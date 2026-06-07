import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/schemas";
import { parseIntent } from "@/lib/agents/intent-parser";
import { buildPTB } from "@/lib/services/ptb-builder";
import { dryRunTransaction } from "@/lib/services/dry-run";
import { analyzeRisk } from "@/lib/agents/guardian";
import { fetchTokenPrices, getExchangeRate } from "@/lib/services/price-oracle";
import type { ChatAPIResponse, TransactionData } from "@/types/chat";

/**
 * POST /api/chat
 *
 * Main orchestration endpoint for Kura Chat.
 * Flow: Input → Intent Parse → PTB Build → Dry Run → Guardian → Response
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const parseResult = chatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          role: "assistant",
          content: "Request tidak valid. Pastikan format pesan sudah benar.",
          type: "text",
        } satisfies ChatAPIResponse,
        { status: 400 }
      );
    }

    const { messages, walletAddress, language } = parseResult.data;

    // Resolve sender address: Use frontend wallet if connected, otherwise fallback to .env testnet wallet
    const senderAddress = walletAddress || process.env.TESTNET_WALLET_ADDRESS;

    if (!senderAddress) {
      return NextResponse.json(
        {
          role: "assistant",
          content: language === "en" 
            ? "Please connect your wallet first to execute transactions." 
            : "Harap hubungkan dompet Anda terlebih dahulu untuk mengeksekusi transaksi.",
          type: "text",
        } satisfies ChatAPIResponse,
        { status: 200 }
      );
    }

    // 2. Fetch prices concurrently with Intent Parsing to save time
    const pricesPromise = fetchTokenPrices();
    
    // Agent 1: Intent Parser
    let intent;
    try {
      intent = await parseIntent(messages);
    } catch (error) {
      console.error("Intent Parser error:", error);
      return NextResponse.json(
        {
          role: "assistant",
          content:
            language === "en"
              ? "Sorry, I couldn't understand your request. Please try rephrasing your command, for example: 'Swap 100 USDC to SUI'."
              : "Maaf, saya tidak bisa memahami permintaan Anda. Coba ulangi perintah Anda, contoh: 'Tukar 100 USDC ke SUI'.",
          type: "text",
        } satisfies ChatAPIResponse,
        { status: 200 }
      );
    }

    // 3. Handle clarification requests
    if (intent.action === "clarify") {
      return NextResponse.json(
        {
          role: "assistant",
          content: intent.reason || (language === "en"
            ? "Could you clarify what you'd like to do? For example: 'Swap 100 USDC to SUI'."
            : "Bisa tolong perjelas apa yang ingin Anda lakukan? Contoh: 'Tukar 100 USDC ke SUI'."),
          type: "text",
        } satisfies ChatAPIResponse,
        { status: 200 }
      );
    }

    // Wait for prices to resolve
    const prices = await pricesPromise;
    const marketRate = getExchangeRate(
      intent.tokenIn ?? "USDC",
      intent.tokenOut ?? "SUI",
      prices
    );

    // 4. PTB Builder
    const { transaction, steps, humanReadableSummary } = await buildPTB(
      intent,
      senderAddress
    );

    // 5. REAL Dry Run Simulation (on-chain via RPC)
    const dryRunResult = await dryRunTransaction(transaction, senderAddress);

    // 6. Agent 2: Guardian AI Analysis
    let guardianReport;
    try {
      guardianReport = await analyzeRisk(intent, dryRunResult, marketRate);

    } catch (error) {
      console.error("Guardian AI error:", error);
      // Fallback guardian report
      guardianReport = {
        riskLevel: 1 as const,
        slippageBps: 150,
        poolLiqUsd: 50000,
        explanation: {
          id: "Analisis risiko tidak tersedia saat ini.",
          en: "Risk analysis is currently unavailable.",
        },
        recommendation: {
          id: "Harap periksa kondisi pasar secara manual.",
          en: "Please check market conditions manually.",
        },
      };
    }

    // Serialize transaction for frontend execution
    // Using an empty/default client for building bytes if needed
    const txBytes = await transaction.build({
      client: new (await import("@mysten/sui/jsonRpc")).SuiJsonRpcClient({ 
        url: "https://fullnode.testnet.sui.io:443",
        network: "testnet" 
      } as any) as any
    }).catch(e => {
      console.error("Failed to build txBytes:", e);
      return undefined;
    });

    const base64TxBytes = txBytes ? Buffer.from(txBytes).toString("base64") : undefined;

    // 7. Compose response
    const transactionData: TransactionData = {
      action: intent.action,
      tokenIn: intent.tokenIn ?? "USDC",
      tokenOut: intent.tokenOut ?? "SUI",
      amountIn: intent.amountIn ?? 0,
      estimatedOutput: dryRunResult.estimatedOutput,
      steps,
      gasEstimate: dryRunResult.gasUsed,
      guardianReport,
      txBytes: base64TxBytes,
      kuraLoggerPackageId: process.env.KURA_LOGGER_PACKAGE_ID,
    };

    const responseContent =
      language === "en"
        ? `Here are your transaction details for: ${humanReadableSummary}. Please review the Guardian risk report before executing.`
        : `Berikut rincian transaksi Anda untuk: ${humanReadableSummary}. Harap tinjau laporan risiko Guardian sebelum mengeksekusi.`;

    return NextResponse.json(
      {
        role: "assistant",
        content: responseContent,
        type: "transaction",
        transactionData,
      } satisfies ChatAPIResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("API /chat error:", error);
    return NextResponse.json(
      {
        role: "assistant",
        content:
          "Terjadi kesalahan internal. Silakan coba lagi dalam beberapa saat.",
        type: "text",
      } satisfies ChatAPIResponse,
      { status: 500 }
    );
  }
}
