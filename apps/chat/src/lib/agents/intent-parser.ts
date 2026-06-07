import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateObject } from "ai";
import { intentSchema } from "../schemas";
import type { IntentJSON } from "@/types/chat";

// Initialize the AI provider using Sumopod (OpenAI-compatible)
function getProvider() {
  const baseURL = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;

  if (!baseURL || !apiKey) {
    throw new Error(
      "AI_BASE_URL and AI_API_KEY must be set in environment variables"
    );
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

// System prompt for Intent Parser (Agent 1 — The PM)
const INTENT_PARSER_SYSTEM_PROMPT = `You are Kura's Intent Parser — a specialized AI agent that converts natural language DeFi commands into structured JSON.

RULES:
1. You MUST respond ONLY with valid JSON matching the schema. No extra text, no markdown.
2. Supported actions: swap, stake, unstake, lend, borrow, provide_liquidity, remove_liquidity
3. If the user's intent is ambiguous or missing critical info, return: {"action": "clarify", "reason": "..."}
4. Token symbols should be UPPERCASE (e.g., "USDC", "SUI", "WETH")
5. For amounts, parse numeric values. "separuh" or "half" = use amountInType: "percentage" with amountIn: 50
6. Default slippageTolerance to 1 if not specified
7. Default protocol to "cetus" for swaps if not specified
8. Understand both Bahasa Indonesia and English

EXAMPLES:
User: "Tukar 100 USDC ke SUI"
→ {"action":"swap","tokenIn":"USDC","tokenOut":"SUI","amountIn":100,"amountInType":"absolute","protocol":"cetus","slippageTolerance":1}

User: "Swap separuh SUI saya ke USDC"
→ {"action":"swap","tokenIn":"SUI","tokenOut":"USDC","amountIn":50,"amountInType":"percentage","protocol":"cetus","slippageTolerance":1}

User: "Stake 50 SUI"
→ {"action":"stake","tokenIn":"SUI","amountIn":50,"amountInType":"absolute","slippageTolerance":1}

User: "Ganti jadi 25 saja"
→ If previous context had a swap of USDC to SUI, return: {"action":"swap","tokenIn":"USDC","tokenOut":"SUI","amountIn":25,"amountInType":"absolute","protocol":"cetus","slippageTolerance":1}

User: "Apa itu DeFi?"
→ {"action":"clarify","reason":"Pertanyaan ini bukan instruksi transaksi. Saya adalah asisten transaksi DeFi. Silakan berikan perintah seperti 'Tukar 100 USDC ke SUI'."}`;

export async function parseIntent(
  messages: { role: string; content: string }[]
): Promise<IntentJSON> {
  const provider = getProvider();
  const modelId = getModelId();

  // Take last 10 messages for context (as per PRD §10.2)
  const recentMessages = messages.slice(-10);

  const { object } = await generateObject({
    model: provider.chatModel(modelId),
    schema: intentSchema,
    system: INTENT_PARSER_SYSTEM_PROMPT,
    messages: recentMessages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
    maxRetries: 2,
  });

  return object as IntentJSON;
}
