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

// Disable AI SDK Warnings for "responseFormat is not supported"
process.env.AI_SDK_LOG_WARNINGS = "false";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        controller.enqueue(new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const sendResultAndClose = (data: ChatAPIResponse) => {
        sendEvent("result", data);
        controller.close();
      };

      try {
    // 1. Parse and validate request body
    const parseResult = chatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return sendResultAndClose({
          role: "assistant",
          content: "Request tidak valid. Pastikan format pesan sudah benar.",
          type: "text",
        } );
    }

    const { messages, walletAddress, language } = parseResult.data;

    // Resolve sender address: Use frontend wallet if connected, otherwise fallback to .env testnet wallet
    const senderAddress = walletAddress || process.env.TESTNET_WALLET_ADDRESS;

    if (!senderAddress) {
      return sendResultAndClose({
          role: "assistant",
          content: language === "en" 
            ? "Please connect your wallet first to execute transactions." 
            : "Harap hubungkan dompet Anda terlebih dahulu untuk mengeksekusi transaksi.",
          type: "text",
        } );
    }

    // 2. Fetch prices concurrently with Intent Parsing to save time
    const pricesPromise = fetchTokenPrices();
    
    // Agent 1: Intent Parser
    sendEvent("step", "parsing");
    let intent;
    try {
      intent = await parseIntent(messages);
      console.log("=== DEBUG: Parsed Intent ===", JSON.stringify(intent, null, 2));
    } catch (error) {
      console.error("Intent Parser error:", error);
      return sendResultAndClose({
          role: "assistant",
          content:
            language === "en"
              ? "Sorry, I couldn't understand your request. Please try rephrasing your command, for example: 'Swap 100 USDC to SUI'."
              : "Maaf, saya tidak bisa memahami permintaan Anda. Coba ulangi perintah Anda, contoh: 'Tukar 100 USDC ke SUI'.",
          type: "text",
        } );
    }

    // 3. Handle clarification requests
    if (intent.action === "clarify") {
      return sendResultAndClose({
          role: "assistant",
          content: intent.reason || (language === "en"
            ? "Could you clarify what you'd like to do? For example: 'Swap 100 USDC to SUI'."
            : "Bisa tolong perjelas apa yang ingin Anda lakukan? Contoh: 'Tukar 100 USDC ke SUI'."),
          type: "text",
        } );
    }

    // Wait for prices to resolve
    const prices = await pricesPromise;
    const tokenIn = intent.tokenIn ?? "USDC";
    const tokenOut = intent.tokenOut ?? "SUI";

    const { SuiJsonRpcClient } = await import("@mysten/sui/jsonRpc");
    const client = new SuiJsonRpcClient({ url: "https://fullnode.testnet.sui.io:443", network: "testnet" as any });
    
    // 3a. Handle check_price
    if (intent.action === "check_price") {
      const rate = getExchangeRate(tokenIn, "USDC", prices);
      return sendResultAndClose({
          role: "assistant",
          content: language === "en"
            ? `The current price of ${tokenIn} is approximately $${rate.toFixed(4)} USD.`
            : `Harga ${tokenIn} saat ini adalah sekitar $${rate.toFixed(4)} USD.`,
          type: "text",
        } );
    }

    // 3b. Handle general chat
    if (intent.action === "chat") {
      return sendResultAndClose({
          role: "assistant",
          content: intent.response || "...",
          type: "text",
        } );
    }

    // 3c. Handle check_balance
    if (intent.action === "check_balance") {
      try {
        const { findCoinInWallet } = await import("@/lib/services/wallet-scanner");
        const coinInfo = await findCoinInWallet(client as any, senderAddress, tokenIn);

        if (!coinInfo) {
          return sendResultAndClose({
              role: "assistant",
              content: language === "en"
                ? `You don't have any ${tokenIn} in your wallet.`
                : `Anda tidak memiliki saldo ${tokenIn} di dompet Anda.`,
              type: "text",
            } );
        }

        const totalBalance = Number(coinInfo.totalBalanceBase) / (10 ** coinInfo.decimals);
        
        return sendResultAndClose({
            role: "assistant",
            content: language === "en"
              ? `Your current ${tokenIn} balance is ${totalBalance.toFixed(4)} ${tokenIn}.`
              : `Saldo ${tokenIn} Anda saat ini adalah ${totalBalance.toFixed(4)} ${tokenIn}.`,
            type: "text",
          } );
      } catch (e) {
        console.error("Balance fetch error:", e);
        return sendResultAndClose({
            role: "assistant",
            content: language === "en"
              ? "Sorry, I couldn't fetch your balance right now."
              : "Maaf, saya tidak bisa mengambil data saldo Anda saat ini.",
            type: "text",
          } );
      }
    }

    // 4. Dynamic Token Validation for Transactions (Swap, Stake, Transfer)
    const { findCoinInWallet } = await import("@/lib/services/wallet-scanner");
    const coinInfo = await findCoinInWallet(client as any, senderAddress, tokenIn);

    if (!coinInfo) {
      return sendResultAndClose({
          role: "assistant",
          content: language === "en"
            ? `Transaction failed: You don't have any ${tokenIn} in your wallet.`
            : `Transaksi gagal: Anda tidak memiliki ${tokenIn} di dompet Anda.`,
          type: "text",
        } );
    }

    const amountInRaw = intent.amountIn ?? 0;
    const amountInBaseUnits = BigInt(Math.floor(amountInRaw * (10 ** coinInfo.decimals)));

    if (amountInBaseUnits > coinInfo.totalBalanceBase) {
      const maxAvailable = Number(coinInfo.totalBalanceBase) / (10 ** coinInfo.decimals);
      return sendResultAndClose({
          role: "assistant",
          content: language === "en"
            ? `Insufficient balance. You only have ${maxAvailable} ${tokenIn}.`
            : `Saldo tidak mencukupi. Anda hanya memiliki ${maxAvailable} ${tokenIn}.`,
          type: "text",
        } );
    }

    const marketRate = getExchangeRate(tokenIn, tokenOut, prices);

    // 4.5 Auto Routing (Aggregator)
    sendEvent("step", "routing");
    const { buildPTB, findBestSwapRoute } = await import("@/lib/services/ptb-builder");
    const bestRoute = await findBestSwapRoute(intent, amountInBaseUnits, client as any);

    // 5. PTB Builder
    sendEvent("step", "building");
    const { transaction, steps, humanReadableSummary } = await buildPTB(
      intent,
      senderAddress,
      coinInfo.coinType,
      amountInBaseUnits,
      client as any,
      bestRoute
    );

    // Serialize transaction for frontend execution
    // Using toJSON() BEFORE dryRunTransaction so we don't resolve and lock object versions and gas coins on the server
    const txJSON = await transaction.toJSON();
    const base64TxBytes = Buffer.from(txJSON).toString("base64");

    // 5. REAL Dry Run Simulation (on-chain via RPC)
    sendEvent("step", "simulating");
    const dryRunResult = await dryRunTransaction(transaction, senderAddress);

    // 6. Agent 2: Guardian AI Analysis
    sendEvent("step", "guardian");
    let guardianReport;
    try {
      guardianReport = await analyzeRisk(intent, dryRunResult, marketRate);
      console.log("=== DEBUG: Guardian Report ===", JSON.stringify(guardianReport, null, 2));

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

    // 7. Walrus Integration (Store Intent & Report)
    const { uploadToWalrus } = await import("@/lib/services/walrus");
    const crypto = await import("crypto");
    
    const intentString = JSON.stringify(intent);
    const reportString = JSON.stringify(guardianReport);

    const intentHash = Array.from(crypto.createHash("sha256").update(intentString).digest());
    const reportHash = Array.from(crypto.createHash("sha256").update(reportString).digest());

    // Upload to Walrus in parallel
    const [intentBlobId, reportBlobId] = await Promise.all([
      uploadToWalrus(intentString),
      uploadToWalrus(reportString)
    ]);

    // 8. Compose response
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
      walrusData: (intentBlobId && reportBlobId) ? {
        intentBlobId,
        reportBlobId,
        intentHash,
        reportHash,
        riskLevel: guardianReport.riskLevel,
        slippageBps: guardianReport.slippageBps ?? 0,
        poolLiqUsd: guardianReport.poolLiqUsd ?? 0,
      } : undefined
    };

    const responseContent =
      language === "en"
        ? `Here are your transaction details for: ${humanReadableSummary}. Please review the Guardian risk report before executing.`
        : `Berikut rincian transaksi Anda untuk: ${humanReadableSummary}. Harap tinjau laporan risiko Guardian sebelum mengeksekusi.`;

    return sendResultAndClose({
        role: "assistant",
        content: responseContent,
        type: "transaction",
        transactionData,
      } );
  } catch (error) {
    console.error("API /chat error:", error);
    sendResultAndClose({
      role: "assistant",
      content: "Terjadi kesalahan internal. Silakan coba lagi dalam beberapa saat.",
      type: "text",
    });
  }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
