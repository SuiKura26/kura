import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";
import type { PTBBuildResult } from "./ptb-builder";

/**
 * Provides Liquidity to Cetus (Mock / Simulated for Hackathon)
 * In a real scenario, we'd initialize Cetus SDK, fetch the pool, calculate ticks, etc.
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

  // We do a mock deposit to a Cetus router or pool address.
  // We just transfer the object to simulate locking it.
  tx.transferObjects([coinToProvide], tx.pure.address("0x0000000000000000000000000000000000000000000000000000000000000000"));

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Provide ${amountInRaw} ${tokenIn} Liquidity on Cetus`
  };
}

/**
 * Removes Liquidity from Cetus (Mock / Simulated for Hackathon)
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

  // Mock remove liquidity
  // In a real app we would call remove_liquidity using a position NFT
  tx.moveCall({
    target: "0x2::coin::zero",
    typeArguments: ["0x2::sui::SUI"],
  });

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Remove Liquidity from Cetus`
  };
}
