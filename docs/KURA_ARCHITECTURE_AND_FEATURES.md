# Kura Chat — Technical Architecture & Full Documentation 🐢💬

## 1. Overview
**Kura Chat** is an innovative, dual-agent conversational AI built for the Sui blockchain ecosystem. It bridges the gap between natural language processing and complex decentralized finance (DeFi) interactions. Users can interact with DeFi protocols (swap, stake, transfer) simply by conversing with Kura in Bahasa Indonesia or English.

---

## 2. Dual-Agent AI System

The core intelligence of Kura Chat relies on two distinct AI Agents with specialized prompts and functions:

### Agent 1: The Intent Parser (The PM)
- **Role:** Translates messy, unstructured human language into a strict, validated JSON intent schema.
- **Capabilities:**
  - Extracts parameters: `action` (swap, transfer, stake, chat, clarify), `tokenIn`, `tokenOut`, `amountIn` (absolute or percentage), and `recipient`.
  - Handles conversational fallbacks (`action: "chat"`) when users ask general questions (e.g., "Siapa namamu?", "Apa itu staking?").
  - Identity injected: Recognizes itself as **"Kura"**, the intelligent DeFi assistant.
- **Location:** `apps/chat/src/lib/agents/intent-parser.ts`

### Agent 2: Guardian AI (The QA Layer)
- **Role:** Protects the user by analyzing on-chain simulated transactions (Dry Runs).
- **Capabilities:**
  - Compares the simulated token output against real market rates (via Aggregator/CoinGecko APIs).
  - Calculates exact **Slippage** in Basis Points (bps).
  - Assigns a **Risk Level** (0: Low, 1: Medium, 2: High, 3: Critical) based on slippage limits and pool liquidity.
  - **Dynamic Exemption:** Automatically ignores slippage and output checks for non-swap transactions (like `transfer` or `stake`) to prevent false-positive "Critical Risk" hallucinations.
  - Generates bilingual explanations and safety recommendations.
- **Location:** `apps/chat/src/lib/agents/guardian.ts`

---

## 3. Core Execution Flow

The system processes requests in a multi-stage pipeline designed for security and speed.

1. **User Request (`/api/chat`)**
   The user sends a chat message. The server invokes Agent 1 (Intent Parser).
   
2. **Dynamic Token & Balance Validation (`wallet-scanner.ts`)**
   - The system checks the connected wallet's Sui RPC to ensure the user actually possesses the requested `tokenIn`.
   - Validates if the user's balance covers the `amountIn`.

3. **Smart Routing & Quote Gathering (`ptb-builder.ts`)**
   - If the action is a `swap`, the system queries aggregators (e.g., Cetus API) to find the most optimal trading route and expected output amount.

4. **PTB Construction (Unsigned)**
   - The server constructs a **Programmatic Transaction Block (PTB)** using the `@mysten/sui` SDK.
   - *Crucial Security Step:* The transaction is serialized using `transaction.toJSON()` **before** any server-side dry run. This prevents version-locking and stale object consumption errors (`unavailable for consumption, current version: XYZ`) when the client finally executes it.

5. **On-Chain Dry Run Simulation**
   - The server simulates the exact PTB against the Sui Testnet RPC without signing it. It extracts `estimatedOutput`, `gasUsed`, and `balanceChanges`.

6. **Guardian Risk Analysis**
   - Agent 2 analyzes the Dry Run result and outputs a Risk Report.

7. **Client-Side Rendering & Signing**
   - The frontend displays the parsed Intent, the multi-step breakdown, and the Guardian Risk Report in a clean `TransactionCard` UI.
   - If the Guardian Risk Level is safe (or if the user insists), the user clicks "Execute".
   - The `@mysten/dapp-kit` prompts the user's browser extension wallet to sign and submit the PTB.

8. **Walrus Archival (`walrus.ts`)**
   - Upon successful generation of the transaction proposal, the JSON Intent and the Guardian Risk Report are permanently uploaded to the **Walrus** decentralized storage network for auditing and absolute transparency.

---

## 4. UI / UX Features

- **Privacy Auto-Clear:** 
  In `useChat.ts`, an active listener monitors the wallet's connection state. Upon `disconnect`, the app immediately triggers a self-destruct mechanism that wipes the `localStorage` sessions and resets the state, ensuring that the next user on the device cannot see previous conversations or transactions.
- **Session Auto-Creation:**
  Automatically initializes a blank canvas/session when a user connects their wallet, bypassing bugs related to undefined sessions.
- **Dynamic Transaction Cards:**
  The `TransactionCard.tsx` intelligently adapts its UI based on the action type. It hides irrelevant data (like `Net Output: 0`) for `Transfer` actions, preventing confusing and misleading information.
- **Streaming UI:**
  Visual steps (Parsing → Routing → Building → Simulating → Guardian Analysis) are streamed back to the user in real-time, drastically reducing perceived latency.

---

## 5. Technology Stack

- **Framework:** Next.js 14+ (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Blockchain SDK:** `@mysten/sui/client`, `@mysten/sui/transactions`, `@mysten/dapp-kit`
- **AI Processing:** OpenAI-Compatible SDK (`@ai-sdk/openai-compatible`, `generateObject`) pointing to custom models (e.g., `sumopod`).
- **Decentralized Storage:** Walrus Publisher Network

---

## 6. Future Roadmap / Expansion
- Add support for lending and borrowing protocols (e.g., Scallop, Navi).
- Implement multi-signature (multisig) support for DAO treasury management.
- Introduce continuous real-time market data websockets for Guardian AI.
