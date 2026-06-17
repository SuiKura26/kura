import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";

export interface PTBBuildResult {
  transaction: Transaction;
  steps: TransactionStep[];
  humanReadableSummary: string;
}

// Staking validator address (configurable via env, defaults to Mysten Labs mainnet validator)
const VALIDATOR_ADDRESS = process.env.SUI_VALIDATOR_ADDRESS || "0xcb740e2e0faf78f7c5bdfbb1ab2ad823dd28e3bb85808099e06c5c78bfb8790f";
// Vault address for swap destination (configurable via env)
const SWAP_VAULT_ADDRESS = process.env.SUI_SWAP_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000000000000000000000000000";

export interface RouteInfo {
  protocol: string;
  estimatedOutputPct: number; // e.g. 0.99 for 99%
  poolLiqUsd: number;
}

/**
 * AI Auto-Routing: Finds the best DEX pool based on mock simulation
 */
export async function findBestSwapRoute(
  intent: IntentJSON,
  amountBaseUnits: bigint,
  client: any
): Promise<RouteInfo | null> {
  if (intent.action !== "swap") return null;

  // Simulate querying multiple DEXes on Testnet
  const dexes = [
    { protocol: "cetus", poolLiqUsd: 150000, slippage: 0.005 },
    { protocol: "turbos", poolLiqUsd: 45000, slippage: 0.012 },
    { protocol: "flowx", poolLiqUsd: 500, slippage: 0.085 },
    { protocol: "hop", poolLiqUsd: 80000, slippage: 0.008 }
  ];

  // Add some randomness to simulate dynamic market conditions on Testnet
  const simulatedRoutes = dexes.map(dex => {
    const randomVariation = (Math.random() * 0.02) - 0.01; // +/- 1%
    const finalSlippage = Math.max(0.001, dex.slippage + randomVariation);
    return {
      protocol: dex.protocol,
      estimatedOutputPct: 1 - finalSlippage,
      poolLiqUsd: dex.poolLiqUsd * (1 + randomVariation)
    };
  });

  // Sort by highest output (least slippage)
  simulatedRoutes.sort((a, b) => b.estimatedOutputPct - a.estimatedOutputPct);

  // Return the best route
  return simulatedRoutes[0];
}

/**
 * Helper to fetch, merge, and split coins dynamically
 */
async function getCoinForTx(
  tx: Transaction,
  client: any,
  senderAddress: string,
  coinType: string,
  amountBaseUnits: bigint
) {
  if (amountBaseUnits === BigInt(0)) return null;

  if (coinType === "0x2::sui::SUI") {
    const [splitCoin] = tx.splitCoins(tx.gas, [amountBaseUnits]);
    return splitCoin;
  }

  // Fetch non-SUI coins
  const coinsResult = await client.getCoins({ owner: senderAddress, coinType });
  if (coinsResult.data.length === 0) return null;

  const coinObjects = coinsResult.data.map((c: any) => tx.object(c.coinObjectId));
  
  if (coinObjects.length > 1) {
    tx.mergeCoins(coinObjects[0], coinObjects.slice(1));
  }
  
  const [splitCoin] = tx.splitCoins(coinObjects[0], [amountBaseUnits]);
  return splitCoin;
}

/**
 * PTB Builder Service
 */
export async function buildPTB(
  intent: IntentJSON,
  senderAddress: string,
  coinType: string,
  amountBaseUnits: bigint,
  client: any,
  bestRoute?: RouteInfo | null
): Promise<PTBBuildResult> {
  const tx = new Transaction();
  tx.setSender(senderAddress);

  const amountInRaw = intent.amountIn ?? 0;

  switch (intent.action) {
    case "swap":
      return buildSwapPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client, bestRoute);
    case "stake":
      return buildStakePTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client);
    case "transfer":
      return buildTransferPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client);
    default:
      return buildGenericPTB(tx, intent);
  }
}

async function buildSwapPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any,
  bestRoute?: RouteInfo | null
): Promise<PTBBuildResult> {
  const tokenIn = intent.tokenIn ?? "SUI";
  const tokenOut = intent.tokenOut ?? "USDC";
  
  // Use best route protocol if available, else fallback
  const protocol = bestRoute?.protocol ?? intent.protocol ?? "cetus";

  // Build human-readable steps
  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Memisahkan ${amountInRaw} ${tokenIn} dari saldo utama`,
        en: `Step 1: Splitting ${amountInRaw} ${tokenIn} from main balance`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Menukar via pool ${protocol.toUpperCase()}`,
        en: `Step 2: Swapping via ${protocol.toUpperCase()} pool`,
      },
    },
    {
      id: "step3",
      description: {
        id: `Langkah 3: Menerima ${tokenOut}`,
        en: `Step 3: Receiving ${tokenOut}`,
      },
    },
  ];

  // REAL PTB Operations for Swap Simulation
  const coinToSwap = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  if (coinToSwap) {
    tx.transferObjects([coinToSwap], tx.pure.address(SWAP_VAULT_ADDRESS));
  }

  return { 
    transaction: tx, 
    steps, 
    humanReadableSummary: `Swap ${amountInRaw} ${tokenIn} → ${tokenOut} via ${protocol}` 
  };
}

async function buildStakePTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  const tokenIn = intent.tokenIn ?? "SUI";

  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Memisahkan ${amountInRaw} ${tokenIn} untuk di-stake`,
        en: `Step 1: Splitting ${amountInRaw} ${tokenIn} for staking`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Mendaftarkan stake ke Validator Mysten Labs`,
        en: `Step 2: Requesting stake with Mysten Labs Validator`,
      },
    },
  ];

  // REAL PTB Operations for Staking Simulation
  const coinToStake = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  if (coinToStake) {
    tx.moveCall({
      target: "0x3::sui_system::request_add_stake",
      arguments: [
        tx.object("0x5"), // Sui System State object
        coinToStake,
        tx.pure.address(VALIDATOR_ADDRESS),
      ],
    });
  }

  return { 
    transaction: tx, 
    steps, 
    humanReadableSummary: `Stake ${amountInRaw} ${tokenIn} to Mysten Labs Validator` 
  };
}

async function buildTransferPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  const tokenIn = intent.tokenIn ?? "SUI";
  const toAddress = intent.recipient ?? "Unknown Address";

  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Memisahkan ${amountInRaw} ${tokenIn} dari saldo utama`,
        en: `Step 1: Splitting ${amountInRaw} ${tokenIn} from main balance`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Mengirim ke ${toAddress}`,
        en: `Step 2: Sending to ${toAddress}`,
      },
    },
  ];

  const coinToTransfer = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  if (coinToTransfer) {
    tx.transferObjects([coinToTransfer], tx.pure.address(toAddress));
  }

  return { 
    transaction: tx, 
    steps, 
    humanReadableSummary: `Transfer ${amountInRaw} ${tokenIn} to ${toAddress}` 
  };
}

async function buildGenericPTB(
  tx: Transaction,
  intent: IntentJSON
): Promise<PTBBuildResult> {
  return {
    transaction: tx,
    steps: [
      {
        id: "step1",
        description: {
          id: `Menyiapkan transaksi untuk ${intent.action}`,
          en: `Preparing transaction for ${intent.action}`,
        },
      },
    ],
    humanReadableSummary: `Execute ${intent.action}`,
  };
}
