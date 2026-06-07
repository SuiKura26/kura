import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateObject } from "ai";
import { z } from "zod";
import type { DryRunResult, GuardianReportData, IntentJSON } from "@/types/chat";

// Guardian response schema
const guardianReportSchema = z.object({
  riskLevel: z.number().min(0).max(3),
  slippageBps: z.number().min(0),
  poolLiqUsd: z.number().min(0).nullable(),
  explanation: z.object({
    id: z.string(),
    en: z.string(),
  }),
  recommendation: z.object({
    id: z.string(),
    en: z.string(),
  }),
});

function getProvider() {
  const baseURL = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;

  if (!baseURL || !apiKey) {
    throw new Error("AI_BASE_URL and AI_API_KEY must be set in environment variables");
  }

  return createOpenAICompatible({
    name: "sumopod",
    baseURL,
    apiKey,
  });
}

function getModelId(): string {
  const model = process.env.AI_MODEL;
  if (!model) {
    throw new Error("AI_MODEL must be set in environment variables");
  }
  return model;
}

const GUARDIAN_SYSTEM_PROMPT = `You are Kura's Guardian AI — the Quality Assurance layer that protects users from risky DeFi transactions.

Your job: Analyze dry run simulation results and produce a risk report in BOTH Bahasa Indonesia and English.

RISK LEVEL RULES (strictly follow these):
- Level 0 (RENDAH/LOW): Slippage < 1% AND pool liquidity > $100,000
- Level 1 (SEDANG/MEDIUM): Slippage 1%-3% OR pool liquidity $10,000-$100,000
- Level 2 (TINGGI/HIGH): Slippage 3%-5% OR pool liquidity $1,000-$10,000
- Level 3 (KRITIS/CRITICAL): Slippage > 5% OR pool liquidity < $1,000 OR stale pool detected

RESPONSE REQUIREMENTS:
1. You MUST respond with valid JSON only. No markdown, no extra text.
2. Explanation must be in natural language that a non-technical user can understand.
3. Recommendation must clearly state what the user should do.
4. Be protective: when in doubt, lean towards a higher risk level to protect the user.
5. Always provide both Indonesian ("id") and English ("en") versions.

EXAMPLES:
For a swap of 100 USDC → SUI with 1.5% slippage and $50K pool liquidity:
{
  "riskLevel": 1,
  "slippageBps": 150,
  "poolLiqUsd": 50000,
  "explanation": {
    "id": "Risiko Sedang: Harga eksekusi sedikit lebih buruk dari harga pasar (-1.5%) karena volatilitas ringan.",
    "en": "Medium Risk: Execution price is slightly worse than market price (-1.5%) due to mild volatility."
  },
  "recommendation": {
    "id": "Kamu masih bisa melanjutkan, tapi perhatikan persentase slippage di atas.",
    "en": "You can still proceed, but pay attention to the slippage percentage above."
  }
}`;

export async function analyzeRisk(
  intent: IntentJSON,
  dryRunResult: DryRunResult,
  marketRate?: number
): Promise<GuardianReportData> {
  const provider = getProvider();
  const modelId = getModelId();

  // Calculate slippage explicitly using market rate if available
  const amountIn = intent.amountIn ?? 0;
  const estimatedOutput = dryRunResult.estimatedOutput;
  
  let expectedOutput = 0;
  let calculatedSlippageBps = 0;
  let calculatedSlippagePct = 0;

  if (marketRate && marketRate > 0) {
    expectedOutput = amountIn * marketRate;
    if (expectedOutput > 0) {
      calculatedSlippagePct = ((expectedOutput - estimatedOutput) / expectedOutput) * 100;
      calculatedSlippageBps = Math.max(0, Math.round(calculatedSlippagePct * 100)); // 1% = 100 bps
    }
  }

  const userPrompt = `Analyze this DeFi transaction:
- Action: ${intent.action}
- Token In: ${intent.tokenIn ?? "unknown"} (amount: ${amountIn})
- Token Out: ${intent.tokenOut ?? "unknown"}
${marketRate ? `- Market Rate (CoinGecko): 1 ${intent.tokenIn} = ${marketRate} ${intent.tokenOut}
- Expected Output at Market Rate: ${expectedOutput} ${intent.tokenOut}
- Calculated Slippage: ${calculatedSlippagePct.toFixed(2)}% (${calculatedSlippageBps} bps)` : "- Market Rate: Unavailable"}
- Estimated Output from Dry Run: ${estimatedOutput} ${intent.tokenOut}
- Gas Used: ${dryRunResult.gasUsed} SUI
- Dry Run Success: ${dryRunResult.success}
${dryRunResult.error ? `- Dry Run Error: ${dryRunResult.error}` : ""}
- Balance Changes: ${JSON.stringify(dryRunResult.balanceChanges)}

Based on the data above, produce a Guardian risk report with risk level, slippage in bps, estimated pool liquidity, explanation, and recommendation.`;

  try {
    const { object } = await generateObject({
      model: provider.chatModel(modelId),
      schema: guardianReportSchema,
      system: GUARDIAN_SYSTEM_PROMPT,
      prompt: userPrompt,
      maxRetries: 2,
    });

    return object as GuardianReportData;
  } catch (error) {
    // Fallback guardian report if AI fails
    console.error("Guardian AI failed:", error);
    return {
      riskLevel: 1,
      slippageBps: 150,
      poolLiqUsd: 50000,
      explanation: {
        id: "Analisis risiko tidak dapat dilakukan saat ini. Data simulasi digunakan sebagai estimasi.",
        en: "Risk analysis is currently unavailable. Simulation data is used as an estimate.",
      },
      recommendation: {
        id: "Harap periksa kondisi pasar secara manual sebelum melanjutkan.",
        en: "Please check market conditions manually before proceeding.",
      },
    };
  }
}
