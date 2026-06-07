import { Transaction } from "@mysten/sui/transactions";
import type { IntentJSON, TransactionStep } from "@/types/chat";

export interface PTBBuildResult {
  transaction: Transaction;
  steps: TransactionStep[];
  humanReadableSummary: string;
}

// Known testnet validator for Staking (Mysten Labs Testnet Validator)
const TESTNET_VALIDATOR = "0x8c6d48227b68677f5255c479fbcc726a4b12e3e9d80d220b33b00021b36bb0fb";
// Dummy vault address for swap simulation on testnet
const TESTNET_VAULT = "0x0000000000000000000000000000000000000000000000000000000000000000"; // burned

/**
 * PTB Builder Service
 * Converts IntentJSON into a real Sui Transaction that can be dry-run.
 */
export async function buildPTB(
  intent: IntentJSON,
  senderAddress?: string
): Promise<PTBBuildResult> {
  const tx = new Transaction();

  if (senderAddress) {
    tx.setSender(senderAddress);
  }

  // Common: calculate amount in MIST (1 SUI = 10^9 MIST)
  const amountInRaw = intent.amountIn ?? 0;
  const amountInMist = BigInt(Math.floor(amountInRaw * 1_000_000_000));

  switch (intent.action) {
    case "swap":
      return buildSwapPTB(tx, intent, amountInRaw, amountInMist);
    case "stake":
      return buildStakePTB(tx, intent, amountInRaw, amountInMist);
    case "transfer":
      return buildTransferPTB(tx, intent, amountInRaw, amountInMist);
    default:
      return buildGenericPTB(tx, intent);
  }
}

function buildSwapPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountInMist: bigint
): PTBBuildResult {
  const tokenIn = intent.tokenIn ?? "SUI";
  const tokenOut = intent.tokenOut ?? "USDC";
  const protocol = intent.protocol ?? "cetus";

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
  // For hackathon MVP on testnet, if tokenIn is SUI, we split the gas coin.
  // We simulate a swap by transferring the split coin. In a full Cetus integration, 
  // this would be tx.moveCall to the Cetus Router.
  if (tokenIn === "SUI" && amountInMist > BigInt(0)) {
    const [coinToSwap] = tx.splitCoins(tx.gas, [amountInMist]);
    // Simulate sending it to a DEX pool (burning it for the dry run to show balance change)
    tx.transferObjects([coinToSwap], tx.pure.address(TESTNET_VAULT));
  }

  return { 
    transaction: tx, 
    steps, 
    humanReadableSummary: `Swap ${amountInRaw} ${tokenIn} → ${tokenOut} via ${protocol}` 
  };
}

function buildStakePTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountInMist: bigint
): PTBBuildResult {
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

  // REAL PTB Operations for Staking
  if (tokenIn === "SUI" && amountInMist > BigInt(0)) {
    const [stakeCoin] = tx.splitCoins(tx.gas, [amountInMist]);
    
    // Exact move call for Sui Native Staking!
    tx.moveCall({
      target: "0x3::sui_system::request_add_stake",
      arguments: [
        tx.object("0x5"), // SuiSystemState
        stakeCoin,
        tx.pure.address(TESTNET_VALIDATOR),
      ],
    });
  }

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Stake ${amountInRaw} ${tokenIn}`,
  };
}

function buildTransferPTB(
  tx: Transaction,
  intent: IntentJSON,
  amountInRaw: number,
  amountInMist: bigint
): PTBBuildResult {
  const tokenIn = intent.tokenIn ?? "SUI";
  const recipient = intent.recipient ?? "0x0000000000000000000000000000000000000000000000000000000000000000";

  const steps: TransactionStep[] = [
    {
      id: "step1",
      description: {
        id: `Langkah 1: Memisahkan ${amountInRaw} ${tokenIn} untuk dikirim`,
        en: `Step 1: Splitting ${amountInRaw} ${tokenIn} for transfer`,
      },
    },
    {
      id: "step2",
      description: {
        id: `Langkah 2: Mengirim ke alamat tujuan`,
        en: `Step 2: Transferring to recipient address`,
      },
    },
  ];

  // REAL PTB Operations for Transfer
  if (tokenIn === "SUI" && amountInMist > BigInt(0)) {
    const [coinToTransfer] = tx.splitCoins(tx.gas, [amountInMist]);
    tx.transferObjects([coinToTransfer], tx.pure.address(recipient));
  }

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Transfer ${amountInRaw} ${tokenIn} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
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
        id: `Langkah 1: Menyiapkan operasi ${intent.action}`,
        en: `Step 1: Preparing ${intent.action} operation`,
      },
    },
  ];

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `${intent.action} operation`,
  };
}

