# @kura/chat

> 🤖 AI-Powered Conversational DeFi Chat Application on Sui Mainnet

The core chat application of the Kura platform. Users interact with DeFi protocols through natural language, powered by a dual-agent AI system and protected by the Guardian risk analysis layer.

## Features

- **Natural Language DeFi** — Type intents in Bahasa Indonesia or English
- **10 DeFi Actions** — Swap, Stake, Unstake, Lend, Borrow, LP Add/Remove, Transfer, Balance Check, Price Check
- **Guardian AI Protection** — Every transaction gets risk analysis before execution
- **Real-Time Simulation** — On-chain dry-run before you sign
- **Immutable Audit Trail** — Intent + Report stored on Walrus & logged on-chain via KuraLogger

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2 | Full-stack framework (App Router + Turbopack) |
| React | 19.2 | UI library |
| Tailwind CSS | v4 | Styling |
| @mysten/sui | 2.17 | Sui TypeScript SDK |
| @mysten/dapp-kit | 1.0 | Wallet integration |
| @mysten/deepbook-v3 | 1.4 | DeepBook V3 swap (mainnet pools) |
| @scallop-io/sui-scallop-sdk | 3.0 | Scallop lending/borrowing |
| Vercel AI SDK | 6.0 | LLM orchestration + streaming |
| Zod | v4 | Schema validation |

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Sui Wallet browser extension (connected to **Mainnet**)
- AI API key (OpenAI-compatible endpoint, e.g. DeepSeek)
- CoinGecko API key (for price oracle)

### Environment Variables

Create `apps/chat/.env.local`:

```env
# AI Configuration
AI_BASE_URL="https://api.your-ai-provider.com/v1"
AI_API_KEY="sk-your-key-here"
AI_MODEL="your-model-name"

# Sui Network
NEXT_PUBLIC_SUI_NETWORK=mainnet
SUI_RPC_URL=https://fullnode.mainnet.sui.io:443

# KuraLogger Smart Contract
KURA_LOGGER_PACKAGE_ID=0xff9158af19df647bd9f6ab7a6b239d97465dfcfe2341ac2f6a87fff0861c1a20
NEXT_PUBLIC_KURA_LOGGER_PACKAGE_ID=0xff9158af19df647bd9f6ab7a6b239d97465dfcfe2341ac2f6a87fff0861c1a20

# CoinGecko Price Oracle
COINGECKO_API_KEY=your-coingecko-api-key
```

### Development

```bash
# From the monorepo root
pnpm dev:chat

# Or from apps/chat
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build:chat
```

## Architecture

```
src/
├── app/
│   ├── api/chat/route.ts      # Core API — orchestrates the 8-step pipeline
│   ├── layout.tsx             # Root layout with Sui + Theme providers
│   └── page.tsx               # Main chat page
├── components/
│   ├── chat/
│   │   ├── ChatArea.tsx       # Message list container
│   │   ├── ChatInput.tsx      # User input with send button
│   │   ├── GuardianReport.tsx # Risk analysis display
│   │   ├── LoadingSteps.tsx   # Step-by-step processing indicator
│   │   ├── MessageBubble.tsx  # Individual message rendering
│   │   ├── TransactionCard.tsx # Transaction preview & execution
│   │   └── WelcomeScreen.tsx  # Initial landing with examples
│   ├── layout/                # Sidebar and header
│   ├── ui/                    # shadcn/ui primitives
│   ├── sui-provider.tsx       # Sui wallet + network config
│   └── theme-provider.tsx     # Dark/light theme toggle
├── hooks/
│   └── useChat.ts             # Chat state management hook
├── lib/
│   ├── agents/
│   │   ├── intent-parser.ts   # Agent 1: NLP → IntentJSON
│   │   └── guardian.ts        # Agent 2: Risk analysis engine
│   ├── services/
│   │   ├── ptb-builder.ts     # Builds PTBs for all 10 actions
│   │   ├── deepbook-swap.ts   # DeepBook V3 mainnet swap routing
│   │   ├── scallop-integration.ts  # Scallop lend/borrow via SDK
│   │   ├── cetus-integration.ts    # Cetus LP add/remove
│   │   ├── dry-run.ts         # On-chain transaction simulation
│   │   ├── wallet-scanner.ts  # Portfolio & balance scanning
│   │   ├── price-oracle.ts    # CoinGecko price feeds
│   │   └── walrus.ts          # Walrus decentralized blob storage
│   └── schemas.ts             # Zod validation schemas
├── data/                      # Static data & configurations
└── types/                     # TypeScript type definitions
```

## API Route: `/api/chat`

The main API endpoint orchestrates the entire pipeline:

1. **Parse** — Receives user message, sends to Intent Parser agent
2. **Validate** — Checks balance, resolves token types
3. **Route** — Finds optimal DEX route (DeepBook mainnet pools)
4. **Build** — Constructs unsigned PTB via PTB Builder
5. **Simulate** — Dry-runs on Sui Mainnet
6. **Analyze** — Guardian AI evaluates risk
7. **Store** — Uploads intent + report to Walrus
8. **Respond** — Returns Transaction Card + Guardian Report to client

## Network Configuration

The app is configured for **Sui Mainnet** by default:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUI_NETWORK` | `mainnet` |
| `SUI_RPC_URL` | `https://fullnode.mainnet.sui.io:443` |
| `KURA_LOGGER_PACKAGE_ID` | `0xff9158af...1c1a20` |

DeepBook swap uses `mainnetCoins` and `mainnetPools` from `@mysten/deepbook-v3`.

## License

[MIT](../../LICENSE)
