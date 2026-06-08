# Kura Chat 🐢💬

Kura Chat is an AI-powered conversational DeFi assistant built on the Sui blockchain. It empowers users to interact with decentralized finance protocols using natural language (Bahasa Indonesia & English) while maintaining a strict layer of security and transparency through dry-run simulations and AI risk analysis.

---

## 🌟 Key Features

1. **Natural Language Intents**
   Users can simply type `"Tukar 10 USDC ke SUI"` or `"Kirim 5 SUI ke 0x123..."`. The AI seamlessly parses these conversational intents into actionable blockchain commands.

2. **Dual-Agent Architecture**
   - **Agent 1 (Intent Parser):** Parses user input into a strict JSON schema identifying the action, token, amount, and parameters.
   - **Agent 2 (Guardian AI):** Analyzes the on-chain dry-run simulation of the intended transaction. It calculates real slippage, checks liquidity, and generates an easy-to-understand Risk Report (Low/Medium/High/Critical) to protect the user from malicious pools or mistakes.

3. **Smart Routing & PTB Builder**
   Automatically finds the best swap routes via Aggregators (like Cetus) and constructs Programmatic Transaction Blocks (PTB) directly on the client.

4. **Walrus Integration**
   Every executed transaction intent and its corresponding Guardian AI risk report is permanently stored in Walrus (a decentralized storage network) for auditing and transparency.

5. **Privacy First**
   Chat sessions and local storage are automatically cleared when the user disconnects their wallet, ensuring data privacy.

---

## 🏗️ Architecture Flow

1. **User Input:** User types a message in the chat interface.
2. **Intent Parsing (`/api/chat`):** The server sends the input to the AI model (Sumopod/LLM) to extract structured JSON data.
3. **Validation & Routing:** The server checks user balances and fetches the best exchange routes from aggregators.
4. **PTB Building:** A transaction block is constructed without signing it.
5. **Dry Run Simulation:** The server simulates the transaction on the Sui Testnet to see the exact state changes (gas fees, token inputs/outputs).
6. **Guardian Risk Analysis:** The dry-run results are sent back to the Guardian AI to evaluate slippage and liquidity risks.
7. **Client Execution:** The user is presented with a beautiful UI containing the Guardian Report. If they approve, their local wallet signs and executes the transaction block.
8. **Storage:** The intent and report are serialized and uploaded to Walrus.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- `pnpm` package manager
- A Sui Wallet extension (e.g., Sui Wallet, Martian) connected to **Testnet**.

### Environment Variables

Create a `.env.local` file in the `apps/chat` directory:

```env
# AI Configuration (OpenAI Compatible API)
AI_BASE_URL="https://api.your-ai-provider.com/v1"
AI_API_KEY="your_api_key_here"
AI_MODEL="your_model_name"

# Sui Network Configuration
NEXT_PUBLIC_NETWORK="testnet"
```

### Local Development

1. Install dependencies from the root of the monorepo:
   ```bash
   pnpm install
   ```

2. Start the development server for the chat app:
   ```bash
   pnpm --filter @kura/chat dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

- `src/app/api/chat/route.ts`: The core backend logic handling the multi-agent pipeline.
- `src/lib/agents/intent-parser.ts`: Prompts and logic for Agent 1.
- `src/lib/agents/guardian.ts`: Prompts and logic for Agent 2.
- `src/lib/services/`: Integrations with Walrus, Cetus Aggregator, and PTB Builders.
- `src/components/chat/`: React components for the chat UI, Transaction Cards, and Guardian Reports.
- `src/hooks/useChat.ts`: Custom hook managing local storage sessions and chat states.

---

## 🛡️ Security Measures

- **No Server-Side Signing:** The backend never holds the user's private key. All transactions are constructed as un-signed PTBs and passed back to the client for signature via `@mysten/dapp-kit`.
- **Pre-execution Simulation:** No transaction is recommended without a successful dry run.
- **Slippage Safeguards:** The Guardian AI dynamically ignores slippage for non-swap actions (like transfers) to prevent false positives, while rigorously enforcing bounds on swaps.

---

*Built with ❤️ for the Sui Hackathon.*
