import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";

export interface PTBBuildResult {
  transaction: Transaction;
  steps: TransactionStep[];
  humanReadableSummary: string;
}

// Known testnet validator for Staking (Mysten Labs Testnet Validator)
const TESTNET_VALIDATOR = "0x8c6d48227b68677f5255c479fbcc726a4b12e3e9d80d220b33b00021b36bb0fb";

export interface RouteInfo {
  protocol: string;
  estimatedOutputPct: number; // e.g. 0.99 for 99%
  poolLiqUsd: number;
}

import { findDeepBookRoute, buildDeepBookSwapPTB } from "./deepbook-swap";

/**
 * Auto-Routing: Finds the best DEX pool based on DeepBook
 */
export async function findBestSwapRoute(
  intent: IntentJSON,
  amountBaseUnits: bigint,
  coinType: string,
  client: any
): Promise<any | null> {
  if (intent.action !== "swap") return null;
  const tokenIn = intent.tokenIn ?? "SUI";
  const tokenOut = intent.tokenOut ?? "USDC";

  // Query DeepBook V3
  const deepBookRoute = await findDeepBookRoute(tokenIn, tokenOut, coinType);
  if (deepBookRoute) {
    return deepBookRoute;
  }

  // Fallback to simulated Cetus router
  return { protocol: "cetus", poolKey: null };
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
  bestRoute?: any | null
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
  bestRoute?: any | null
): Promise<PTBBuildResult> {
  const tokenIn = intent.tokenIn ?? "SUI";
  const tokenOut = intent.tokenOut ?? "USDC";
  
  const protocol = bestRoute?.protocol || "cetus";

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

  // Prepare the coin to swap
  const coinToSwap = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  
  if (!coinToSwap) {
    throw new Error(`Gagal mendapatkan koin ${tokenIn} dari dompet kamu.`);
  }

  // If we have a route from DeepBook, build the actual swap transaction
  if (bestRoute && bestRoute.poolKey) {
    try {
      buildDeepBookSwapPTB(
        tx,
        bestRoute,
        coinToSwap,
        amountBaseUnits,
        senderAddress,
        BigInt(0) // testnet fee
      );
      
      return { 
        transaction: tx, 
        steps, 
        humanReadableSummary: `Swap ${amountInRaw} ${tokenIn} → ${tokenOut} via DeepBook V3` 
      };
    } catch (e) {
      console.warn("DeepBook Swap failed, falling back to sending back to user");
      // Fallthrough to mock
    }
  }

  // Fallback if DeepBook Router fails: just a mock transaction that returns the coin to the user 
  // so we don't burn testnet tokens.
  tx.transferObjects([coinToSwap], tx.pure.address(senderAddress));

  return { 
    transaction: tx, 
    steps, 
    humanReadableSummary: `(Simulated) Swap ${amountInRaw} ${tokenIn} → ${tokenOut} via ${protocol}` 
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
        tx.pure.address(TESTNET_VALIDATOR),
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
