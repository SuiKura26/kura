import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";
import type { DryRunResult } from "@/types/chat";

function getSuiClient(): SuiJsonRpcClient {
  const rpcUrl = process.env.SUI_RPC_URL || "https://fullnode.mainnet.sui.io:443";
  const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || "mainnet") as any;
  return new SuiJsonRpcClient({ url: rpcUrl, network });
}

/**
 * Dry Run Service
 * Simulates a transaction off-chain using Sui RPC dryRunTransactionBlock.
 * Returns estimated output, gas used, and balance changes without spending real gas.
 */
export async function dryRunTransaction(
  transaction: Transaction,
  senderAddress: string
): Promise<DryRunResult> {
  try {
    const client = getSuiClient();

    // Build the transaction bytes for dry run
    transaction.setSender(senderAddress);
    const txBytes = await transaction.build({ client });

    const result = await client.dryRunTransactionBlock({
      transactionBlock: txBytes,
    });

    // Parse balance changes from effects
    const balanceChanges = result.balanceChanges?.map((change) => ({
      coinType: change.coinType,
      amount: change.amount,
    })) ?? [];

    // Calculate estimated output from balance changes
    let estimatedOutput = 0;
    for (const change of balanceChanges) {
      const amount = parseInt(change.amount);
      if (amount > 0) {
        estimatedOutput = amount / 1_000_000_000;
      }
    }

    const gasUsed = result.effects?.gasUsed
      ? (parseInt(result.effects.gasUsed.computationCost) +
         parseInt(result.effects.gasUsed.storageCost) -
         parseInt(result.effects.gasUsed.storageRebate)) / 1_000_000_000
      : 0;

    const success = result.effects?.status?.status === "success";

    return {
      success,
      estimatedOutput,
      gasUsed,
      balanceChanges,
      error: success ? undefined : result.effects?.status?.error,
    };
  } catch (error) {
    console.error("Dry Run failed:", error);
    return {
      success: false,
      estimatedOutput: 0,
      gasUsed: 0,
      balanceChanges: [],
      error: error instanceof Error ? error.message : "Dry run failed",
    };
  }
}

/**
 * Mock Dry Run — used when real dry run is not available
 * (e.g., no wallet connected, testnet down)
 * Accepts marketRate from CoinGecko to provide realistic simulation.
 */
export function mockDryRun(
  action: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: number,
  marketRate?: number
): DryRunResult {
  // Simple mock exchange rates as fallback if marketRate is missing
  const fallbackRates: Record<string, Record<string, number>> = {
    USDC: { SUI: 0.482, USDT: 1.0, WETH: 0.00031 },
    SUI: { USDC: 2.075, USDT: 2.075, WETH: 0.00064 },
    USDT: { SUI: 0.482, USDC: 1.0 },
  };

  const rate = marketRate ?? (fallbackRates[tokenIn]?.[tokenOut] ?? 1.0);
  const expectedOutput = amountIn * rate;
  
  // Add slight randomness to simulate real market execution slippage
  // E.g., execution price is often slightly worse than pure market rate
  const slippageFactor = 0.975 + Math.random() * 0.024; // 0.1% to 2.5% slippage
  const adjustedOutput = parseFloat((expectedOutput * slippageFactor).toFixed(4));

  return {
    success: true,
    estimatedOutput: adjustedOutput,
    gasUsed: parseFloat((0.001 + Math.random() * 0.003).toFixed(6)),
    balanceChanges: [
      { coinType: tokenIn, amount: (-amountIn * 1_000_000_000).toString() },
      { coinType: tokenOut, amount: (adjustedOutput * 1_000_000_000).toString() },
    ],
  };
}
