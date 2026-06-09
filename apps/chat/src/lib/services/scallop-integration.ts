import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";
import type { PTBBuildResult } from "./ptb-builder";

// Scallop Protocol Object IDs on Testnet (Placeholder for Hackathon)
const SCALLOP_PACKAGE_ID = "0xc63072e7f5f4983a2efaf5bdba1480d5e7d74d57948e1c7cc436f8e22cbeb410"; // Base Testnet package
const DUMMY_MARKET_ID = "0x0000000000000000000000000000000000000000000000000000000000000001";
const DUMMY_VERSION_ID = "0x0000000000000000000000000000000000000000000000000000000000000002";

/**
 * Lends/Supplies tokens to Scallop
 * (Constructed manually because Scallop SDK v3 heavily abstracts Transaction blocks)
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

  // Manually construct the Scallop mint/supply Move Call
  // This simulates the exact structure the Scallop SDK would generate.
  const marketCoin = tx.moveCall({
    target: `${SCALLOP_PACKAGE_ID}::mint::mint`,
    typeArguments: [coinType],
    arguments: [
      tx.object(DUMMY_VERSION_ID),
      tx.object(DUMMY_MARKET_ID),
      coinToLend,
      tx.object("0x2::clock::CLOCK"),
    ],
  });

  // Transfer the minted market coin (sCoin) back to the sender
  tx.transferObjects([marketCoin], tx.pure.address(senderAddress));

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

  const DUMMY_OBLIGATION_ID = "0x0000000000000000000000000000000000000000000000000000000000000001";
  const DUMMY_OBLIGATION_KEY = "0x0000000000000000000000000000000000000000000000000000000000000002";

  // Manually construct the Scallop borrow Move Call
  const borrowedCoin = tx.moveCall({
    target: `${SCALLOP_PACKAGE_ID}::borrow::borrow`,
    typeArguments: [coinType],
    arguments: [
      tx.object(DUMMY_VERSION_ID),
      tx.object(DUMMY_OBLIGATION_ID),
      tx.object(DUMMY_OBLIGATION_KEY),
      tx.object(DUMMY_MARKET_ID),
      tx.object("0x2::clock::CLOCK"),
      tx.pure.u64(amountBaseUnits),
    ],
  });

  // Transfer the borrowed coin to the user
  tx.transferObjects([borrowedCoin], tx.pure.address(senderAddress));

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Borrow ${amountInRaw} ${tokenOut} from Scallop`
  };
}
