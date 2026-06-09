import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";
import type { PTBBuildResult } from "./ptb-builder";

/**
 * Lends/Supplies tokens to Scallop
 */
export async function buildScallopLendPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any,
  coinToLend: any
): Promise<PTBBuildResult> {
  const tokenIn = intent.tokenIn ?? "SUI";
  // The SDK uses "sui", "usdc" etc.
  const coinName = tokenIn.toLowerCase();

  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Menyiapkan ${amountInRaw} ${tokenIn} untuk dipinjamkan`,
        en: `Step 1: Preparing ${amountInRaw} ${tokenIn} for lending`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Menyetorkan ke protokol Scallop`,
        en: `Step 2: Supplying to Scallop protocol`,
      },
    },
  ];

  // Mock Supply to Scallop: Transfer coin to Scallop mock address
  tx.transferObjects([coinToLend], tx.pure.address("0x1111111111111111111111111111111111111111111111111111111111111111"));

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Lend ${amountInRaw} ${tokenIn} on Scallop`
  };
}

/**
 * Borrows tokens from Scallop
 */
export async function buildScallopBorrowPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountBaseUnits: bigint,
  coinType: string,
  senderAddress: string,
  client: any
): Promise<PTBBuildResult> {
  const tokenOut = intent.tokenOut ?? "SUI";
  const coinName = tokenOut.toLowerCase();

  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Mengakses Obligation Anda (kolateral)`,
        en: `Step 1: Accessing your Obligation (collateral)`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Meminjam ${amountInRaw} ${tokenOut} dari Scallop`,
        en: `Step 2: Borrowing ${amountInRaw} ${tokenOut} from Scallop`,
      },
    },
  ];

  // Mock borrow
  tx.moveCall({
    target: "0x2::coin::zero",
    typeArguments: ["0x2::sui::SUI"],
  });

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Borrow ${amountInRaw} ${tokenOut} from Scallop`
  };
}
