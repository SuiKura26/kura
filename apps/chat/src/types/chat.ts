export type Role = "user" | "assistant" | "system";

export type MessageType = "text" | "transaction" | "loading";

export interface TransactionStep {
  id: string;
  description: Record<"id" | "en", string>;
}

export interface GuardianReportData {
  riskLevel: 0 | 1 | 2 | 3; // 0=Rendah, 1=Sedang, 2=Tinggi, 3=Kritis
  slippageBps: number;
  poolLiqUsd: number;
  explanation: Record<"id" | "en", string>;
  recommendation: Record<"id" | "en", string>;
}

export interface TransactionData {
  action: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string | number;
  estimatedOutput: string | number;
  steps: TransactionStep[];
  gasEstimate: string | number;
  guardianReport?: GuardianReportData;
  txBytes?: string;
  kuraLoggerPackageId?: string;
  walrusData?: {
    intentBlobId: string;
    reportBlobId: string;
    intentHash: number[];
    reportHash: number[];
    riskLevel: number;
    slippageBps: number;
    poolLiqUsd: number;
  };
}

export interface Message {
  id: string;
  role: Role;
  content: string; // The text content
  timestamp: number;
  type: MessageType;
  transactionData?: TransactionData;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

// ============================================================
// Backend Types
// ============================================================

export type IntentAction =
  | "swap"
  | "stake"
  | "unstake"
  | "lend"
  | "borrow"
  | "provide_liquidity"
  | "remove_liquidity"
  | "transfer"
  | "check_balance"
  | "check_price"
  | "clarify";

export interface IntentJSON {
  action: IntentAction;
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: number;
  amountInType?: "absolute" | "percentage";
  protocol?: string;
  slippageTolerance?: number;
  recipient?: string;
  reason?: string; // only for action === 'clarify'
}

export interface DryRunResult {
  success: boolean;
  estimatedOutput: number;
  gasUsed: number;
  balanceChanges: { coinType: string; amount: string }[];
  error?: string;
}

export interface ChatAPIRequest {
  messages: { role: Role; content: string }[];
  walletAddress?: string;
  language?: "id" | "en";
}

export interface ChatAPIResponse {
  role: Role;
  content: string;
  type: MessageType;
  transactionData?: TransactionData;
}

