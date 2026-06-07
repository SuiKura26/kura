import { z } from "zod";

// ============================================================
// Intent Parser Output Schema
// ============================================================

export const intentSchema = z.object({
  action: z.enum([
    "swap",
    "stake",
    "unstake",
    "lend",
    "borrow",
    "provide_liquidity",
    "remove_liquidity",
    "transfer",
    "check_balance",
    "check_price",
    "clarify",
  ]),
  tokenIn: z.string().optional(),
  tokenOut: z.string().optional(),
  amountIn: z.number().positive().optional(),
  amountInType: z.enum(["absolute", "percentage"]).default("absolute"),
  protocol: z.string().optional(),
  slippageTolerance: z.number().min(0).max(100).optional(),
  recipient: z.string().optional(),
  reason: z.string().optional(), // only for action === 'clarify'
});

export type IntentSchemaType = z.infer<typeof intentSchema>;

// ============================================================
// Chat API Request Schema
// ============================================================

export const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
  walletAddress: z.string().optional(),
  language: z.enum(["id", "en"]).default("id"),
});

export type ChatRequestSchemaType = z.infer<typeof chatRequestSchema>;
