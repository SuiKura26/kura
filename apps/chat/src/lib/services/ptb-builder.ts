import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";

// Known token coin types on Sui Testnet
const TOKEN_COIN_TYPES: Record<string, string> = {
  SUI: "0x2::sui::SUI",
  USDC: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN", // testnet USDC
  USDT: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN", // testnet USDT
};

// Known DEX pool addresses (Cetus testnet)
const CETUS_POOLS: Record<string, string> = {
  "USDC/SUI": "0x...", // placeholder — will be replaced with actual testnet pool
  "SUI/USDC": "0x...",
};

export interface PTBBuildResult {
  transaction: Transaction;
  steps: TransactionStep[];
  humanReadableSummary: string;
}

/**
 * PTB Builder Service — Pure TypeScript, deterministic, no AI.
 * Receives IntentJSON and produces a Sui Transaction object + human-readable steps.
 *
 * For MVP, this builds a mock/simplified PTB structure since actual Cetus SDK
 * integration requires pool-specific setup. The human-readable steps and
 * structure are accurate for the UI preview.
 */
export function buildPTB(
  intent: IntentJSON,
  senderAddress?: string
): PTBBuildResult {
  const tx = new Transaction();

  switch (intent.action) {
    case "swap":
      return buildSwapPTB(tx, intent, senderAddress);
    case "stake":
      return buildStakePTB(tx, intent, senderAddress);
    default:
      return buildGenericPTB(tx, intent);
  }
}

function buildSwapPTB(
  tx: Transaction,
  intent: IntentJSON,
  senderAddress?: string
): PTBBuildResult {
  const tokenIn = intent.tokenIn ?? "USDC";
  const tokenOut = intent.tokenOut ?? "SUI";
  const amountIn = intent.amountIn ?? 0;
  const protocol = intent.protocol ?? "cetus";

  // Build human-readable steps
  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Split ${amountIn} ${tokenIn} dari dompet kamu`,
        en: `Step 1: Split ${amountIn} ${tokenIn} from your wallet`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Kirim ke ${protocol.charAt(0).toUpperCase() + protocol.slice(1)} Pool ${tokenIn}/${tokenOut}`,
        en: `Step 2: Send to ${protocol.charAt(0).toUpperCase() + protocol.slice(1)} Pool ${tokenIn}/${tokenOut}`,
      },
    },
    {
      id: "step3",
      description: {
        id: `Langkah 3: Terima ${tokenOut} ke dompet`,
        en: `Step 3: Receive ${tokenOut} to wallet`,
      },
    },
  ];

  // Build actual PTB for coin split + swap
  // For MVP, we set up the transaction structure
  // Actual Cetus pool interaction would need their SDK
  if (senderAddress) {
    tx.setSender(senderAddress);
  }

  // Set gas budget
  tx.setGasBudget(10_000_000); // 0.01 SUI

  const humanReadableSummary = `Swap ${amountIn} ${tokenIn} → ${tokenOut} via ${protocol}`;

  return { transaction: tx, steps, humanReadableSummary };
}

function buildStakePTB(
  tx: Transaction,
  intent: IntentJSON,
  senderAddress?: string
): PTBBuildResult {
  const tokenIn = intent.tokenIn ?? "SUI";
  const amountIn = intent.amountIn ?? 0;

  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Split ${amountIn} ${tokenIn} dari dompet kamu`,
        en: `Step 1: Split ${amountIn} ${tokenIn} from your wallet`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Stake ${amountIn} ${tokenIn} ke validator`,
        en: `Step 2: Stake ${amountIn} ${tokenIn} with validator`,
      },
    },
    {
      id: "step3",
      description: {
        id: `Langkah 3: Terima Staked SUI object ke dompet`,
        en: `Step 3: Receive Staked SUI object to wallet`,
      },
    },
  ];

  if (senderAddress) {
    tx.setSender(senderAddress);
  }
  tx.setGasBudget(10_000_000);

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Stake ${amountIn} ${tokenIn}`,
  };
}

function buildGenericPTB(
  tx: Transaction,
  intent: IntentJSON
): PTBBuildResult {
  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Memproses perintah ${intent.action}`,
        en: `Step 1: Processing ${intent.action} command`,
      },
    },
  ];

  tx.setGasBudget(10_000_000);

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `${intent.action} operation`,
  };
}

export { TOKEN_COIN_TYPES, CETUS_POOLS };
