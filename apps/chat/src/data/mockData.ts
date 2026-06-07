import { Message, TransactionData } from "../types/chat";

export const MOCK_SWAP_TRANSACTION: TransactionData = {
  action: "swap",
  tokenIn: "USDC",
  tokenOut: "SUI",
  amountIn: 100,
  estimatedOutput: 48.2,
  gasEstimate: 0.002,
  steps: [
    {
      id: "step1",
      description: {
        id: "Langkah 1: Split 100 USDC dari dompet kamu",
        en: "Step 1: Split 100 USDC from your wallet"
      }
    },
    {
      id: "step2",
      description: {
        id: "Langkah 2: Kirim ke Cetus Pool USDC/SUI",
        en: "Step 2: Send to Cetus Pool USDC/SUI"
      }
    },
    {
      id: "step3",
      description: {
        id: "Langkah 3: Terima ≈48.2 SUI ke dompet",
        en: "Step 3: Receive ≈48.2 SUI to wallet"
      }
    }
  ],
  guardianReport: {
    riskLevel: 1, // Sedang
    slippageBps: 150, // 1.5%
    poolLiqUsd: 50000,
    explanation: {
      id: "Risiko Sedang: Harga eksekusi sedikit lebih buruk dari harga pasar (-1.5%) karena volatilitas ringan.",
      en: "Medium Risk: Execution price is slightly worse than market price (-1.5%) due to mild volatility."
    },
    recommendation: {
      id: "Kamu masih bisa melanjutkan, tapi perhatikan persentase slippage di atas.",
      en: "You can still proceed, but pay attention to the slippage percentage above."
    }
  }
};

export const MOCK_HIGH_RISK_TRANSACTION: TransactionData = {
  action: "swap",
  tokenIn: "SUI",
  tokenOut: "MEME",
  amountIn: 500,
  estimatedOutput: 1000000,
  gasEstimate: 0.003,
  steps: [
    {
      id: "step1",
      description: {
        id: "Langkah 1: Kirim 500 SUI ke BlueMove Pool",
        en: "Step 1: Send 500 SUI to BlueMove Pool"
      }
    },
    {
      id: "step2",
      description: {
        id: "Langkah 2: Terima ≈1,000,000 MEME ke dompet",
        en: "Step 2: Receive ≈1,000,000 MEME to wallet"
      }
    }
  ],
  guardianReport: {
    riskLevel: 3, // Kritis
    slippageBps: 800, // 8.0%
    poolLiqUsd: 500, // Likuiditas sangat rendah
    explanation: {
      id: "Risiko Kritis: Slippage sangat tinggi (>5%) dan likuiditas pool sangat rendah (<$1K). Transaksi ini akan menyebabkan kerugian nilai yang signifikan.",
      en: "Critical Risk: Slippage is very high (>5%) and pool liquidity is very low (<$1K). This transaction will cause significant value loss."
    },
    recommendation: {
      id: "Sistem menyarankan untuk TIDAK melanjutkan transaksi ini.",
      en: "The system advises against proceeding with this transaction."
    }
  }
};
