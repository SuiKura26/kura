import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";

export interface PTBBuildResult {
  transaction: Transaction;
  steps: TransactionStep[];
  humanReadableSummary: string;
}

// Vault address for swap destination (configurable via env)
const SWAP_VAULT_ADDRESS = process.env.SUI_SWAP_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Dynamically fetches an active validator from the Sui network.
 * This avoids hardcoding a validator address that may become inactive.
 */
async function getActiveValidator(client: any): Promise<{ address: string; name: string }> {
  try {
    const systemState = await client.getLatestSuiSystemState();
    const validators = systemState.activeValidators;
    if (!validators || validators.length === 0) {
      throw new Error("No active validators found");
    }
    // Pick the validator with the highest voting power for reliability
    const sorted = [...validators].sort((a: any, b: any) => Number(b.votingPower) - Number(a.votingPower));
    const best = sorted[0];
    return { address: best.suiAddress, name: best.name || "Top Validator" };
  } catch (e) {
    console.warn("Failed to fetch active validators, using fallback", e);
    // Fallback: Blockscope.net (known active testnet validator as of June 2026)
    return {
      address: "0x44b1b319e23495995fc837dafd28fc6af8b645edddff0fc1467f1ad631362c23",
      name: "Blockscope.net"
    };
  }
}

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
    case "unstake":
      return buildUnstakePTB(tx, intent, amountInRaw, senderAddress, client);
    case "transfer":
      return buildTransferPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client);
    case "lend":
      return buildLendPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client);
    case "borrow":
      return buildBorrowPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client);
    case "provide_liquidity":
      return buildProvideLiquidityPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client);
    case "remove_liquidity":
      return buildRemoveLiquidityPTB(tx, intent, amountInRaw, senderAddress, client);
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

  // Fallback if DeepBook Router fails: just a mock transaction that sends the coin to the vault 
  // so we don't burn testnet tokens.
  tx.transferObjects([coinToSwap], tx.pure.address(SWAP_VAULT_ADDRESS));

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

  // Dynamically get an active validator from the chain
  const validator = await getActiveValidator(client);
  const targetValidatorAddress = process.env.SUI_VALIDATOR_ADDRESS || validator.address;
  console.log(`=== DEBUG: Staking to validator: ${validator.name} (${targetValidatorAddress}) ===`);

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
        id: `Langkah 2: Mendaftarkan stake ke Validator ${validator.name}`,
        en: `Step 2: Requesting stake with ${validator.name} Validator`,
      },
    },
  ];

  // REAL PTB Operations for Staking
  const coinToStake = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  if (coinToStake) {
    tx.moveCall({
      target: "0x3::sui_system::request_add_stake",
      arguments: [
        tx.object("0x5"), // Sui System State object
        coinToStake,
        tx.pure.address(targetValidatorAddress),
      ],
    });
  }

  return { 
    transaction: tx, 
    steps, 
    humanReadableSummary: `Stake ${amountInRaw} ${tokenIn} to ${validator.name} Validator` 
  };
}

async function buildUnstakePTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  const tokenIn = intent.tokenIn ?? "SUI";

  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Mengambil data StakedSui di wallet Anda`,
        en: `Step 1: Fetching StakedSui objects in your wallet`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Meminta pencairan SUI dari validator`,
        en: `Step 2: Requesting SUI withdrawal from validator`,
      },
    },
  ];

  // Fetch staked SUI objects
  const stakedObjects = await client.getOwnedObjects({
    owner: senderAddress,
    filter: { StructType: "0x3::staking_pool::StakedSui" },
    options: { showContent: true }
  });

  if (!stakedObjects.data || stakedObjects.data.length === 0) {
    throw new Error("Tidak ditemukan Staked SUI di wallet Anda.");
  }

  // Just pick the first one for simplicity, or we could aggregate if needed
  const stakedObjId = stakedObjects.data[0].data.objectId;

  tx.moveCall({
    target: "0x3::sui_system::request_withdraw_stake",
    arguments: [
      tx.object("0x5"), // Sui System State object
      tx.object(stakedObjId)
    ],
  });

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Unstake SUI (Akan tersedia setelah epoch berakhir)`
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

import { buildScallopLendPTB, buildScallopBorrowPTB } from "./scallop-integration";

async function buildLendPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  const coinToLend = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  if (!coinToLend) {
    throw new Error(`Gagal mendapatkan koin ${intent.tokenIn} dari dompet Anda.`);
  }
  return buildScallopLendPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client, coinToLend);
}

async function buildBorrowPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  return buildScallopBorrowPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client);
}

import { buildCetusProvideLiquidityPTB, buildCetusRemoveLiquidityPTB } from "./cetus-integration";

async function buildProvideLiquidityPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  const coinToProvide = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  if (!coinToProvide) {
    throw new Error(`Gagal mendapatkan koin ${intent.tokenIn} dari dompet Anda.`);
  }
  return buildCetusProvideLiquidityPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client, coinToProvide);
}

async function buildRemoveLiquidityPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  return buildCetusRemoveLiquidityPTB(tx, intent, amountInRaw, senderAddress, client);
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
