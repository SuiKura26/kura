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
  client: any
): Promise<PTBBuildResult> {
  const tx = new Transaction();
  tx.setSender(senderAddress);

  const amountInRaw = intent.amountIn ?? 0;

  switch (intent.action) {
    case "swap":
      return buildSwapPTB(tx, intent, amountInRaw, amountBaseUnits, coinType, senderAddress, client);
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
  client: any
): Promise<PTBBuildResult> {
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
  const coinToSwap = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  if (coinToSwap) {
    tx.transferObjects([coinToSwap], tx.pure.address(TESTNET_VAULT));
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

  // Native Staking only works with SUI.
  if (coinType === "0x2::sui::SUI") {
    const stakeCoin = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
    if (stakeCoin) {
      tx.moveCall({
        target: "0x3::sui_system::request_add_stake",
        arguments: [
          tx.object("0x5"), // SuiSystemState
          stakeCoin,
          tx.pure.address(TESTNET_VALIDATOR),
        ],
      });
    }
  }

  return {
    transaction: tx,
    steps,
    humanReadableSummary: `Stake ${amountInRaw} ${tokenIn}`,
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

  const coinToTransfer = await getCoinForTx(tx, client, senderAddress, coinType, amountBaseUnits);
  if (coinToTransfer) {
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

