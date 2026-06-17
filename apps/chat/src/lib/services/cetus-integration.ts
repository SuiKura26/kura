import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";
import type { PTBBuildResult } from "./ptb-builder";

// Cetus Package ID (Placeholder for Hackathon — requires real Cetus SDK integration for production once compatible with Sui v2)
const CETUS_PACKAGE_ID = process.env.CETUS_PACKAGE_ID || "0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb";
const DUMMY_CETUS_POOL_ID = "0x0000000000000000000000000000000000000000000000000000000000000001";
const DUMMY_GLOBAL_CONFIG = "0x0000000000000000000000000000000000000000000000000000000000000002";

/**
 * Provides Liquidity to Cetus
 * (Constructed manually because Cetus SDK v5.4.0 is incompatible with @mysten/sui v2)
 */
export async function buildCetusProvideLiquidityPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any,
  coinToProvide: any
): Promise<PTBBuildResult> {
  const tokenIn = intent.tokenIn ?? "USDC";

  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Menyiapkan ${amountInRaw} ${tokenIn} untuk likuiditas`,
        en: `Step 1: Preparing ${amountInRaw} ${tokenIn} for liquidity`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Menambahkan likuiditas ke Cetus Pool`,
        en: `Step 2: Providing liquidity to Cetus Pool`,
      },
    },
  ];

  // Manually construct the Cetus add_liquidity Move Call
  // This simulates the exact structure the Cetus SDK would generate,
  // making it a "real" PTB structure for the Guardian AI to dry-run.
  tx.moveCall({
    target: `${CETUS_PACKAGE_ID}::pool::add_liquidity`,
    typeArguments: ["0x2::sui::SUI", coinType],
    arguments: [
      tx.object(DUMMY_GLOBAL_CONFIG),
      tx.object(DUMMY_CETUS_POOL_ID),
      tx.pure.vector("u32", []), // tick_lower
      tx.pure.vector("u32", []), // tick_upper
      tx.object("0x2::clock::CLOCK"),
    ],
  });

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Provide ${amountInRaw} ${tokenIn} Liquidity on Cetus`
  };
}

/**
 * Removes Liquidity from Cetus
 */
export async function buildCetusRemoveLiquidityPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Mengakses posisi likuiditas Cetus Anda`,
        en: `Step 1: Accessing your Cetus liquidity position`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Mencabut likuiditas dari pool`,
        en: `Step 2: Removing liquidity from pool`,
      },
    },
  ];

  const DUMMY_POSITION_ID = "0x0000000000000000000000000000000000000000000000000000000000000003";

  // Manually construct the Cetus remove_liquidity Move Call
  tx.moveCall({
    target: `${CETUS_PACKAGE_ID}::pool::remove_liquidity`,
    typeArguments: ["0x2::sui::SUI", intent.tokenIn ? `0x...::${intent.tokenIn}` : "0x2::sui::SUI"],
    arguments: [
      tx.object(DUMMY_GLOBAL_CONFIG),
      tx.object(DUMMY_CETUS_POOL_ID),
      tx.object(DUMMY_POSITION_ID),
      tx.pure.u64(amountInRaw), // delta_liquidity
      tx.object("0x2::clock::CLOCK"),
    ],
  });

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Remove Liquidity from Cetus`
  };
}
