<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="apps/chat/public/kura-logo-dark-mode.png">
    <source media="(prefers-color-scheme: light)" srcset="apps/chat/public/kura-logo-light-mode.png">
    <img alt="Kura" src="apps/chat/public/kura-logo-dark-mode.png" width="180" height="180">
  </picture>
  <br/>
  <h1 align="center"><strong>🐢 KURA</strong></h1>
  <p align="center">
    <em>Speak Your DeFi Intent. Execute With Protection.</em>
    <br/>
    <strong>AI-Powered Conversational DeFi Assistant on Sui</strong>
  </p>
  <p align="center">
    <a href="https://kura.ai"><img src="https://img.shields.io/badge/Landing%20Page-kura.ai-6F4FF2?style=flat-square" alt="Landing Page"></a>
    <a href="https://chat.kura.ai"><img src="https://img.shields.io/badge/Chat%20App-chat.kura.ai-6F4FF2?style=flat-square" alt="Chat App"></a>
    <a href="https://suiscan.xyz/testnet/object/0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064"><img src="https://img.shields.io/badge/Sui%20Testnet-Deployed-4F9EFF?style=flat-square" alt="Sui Testnet"></a>
    <br/>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js 16">
    <img src="https://img.shields.io/badge/Sui%20Move-2024-4F9EFF?style=flat-square&logo=sui" alt="Sui Move">
    <img src="https://img.shields.io/badge/pnpm-monorepo-F69220?style=flat-square&logo=pnpm" alt="pnpm monorepo">
    <img src="https://img.shields.io/badge/Bilingual-ID%20%7C%20EN-FF6B6B?style=flat-square" alt="Bilingual">
  </p>
</p>

---

## 📋 Overview

Kura is an **Intent Engine** — a conversational AI assistant that lets you interact with Sui DeFi protocols using natural language. Type `"Tukar 100 USDC ke SUI"` or `"Stake 50 SUI"`, and Kura handles the rest: parsing your intent, building the transaction, simulating it on-chain, analyzing risks via its **Guardian AI**, and presenting a clear report before you sign.

```mermaid
flowchart LR
    A["🗣️ User: 'Tukar 100 USDC ke SUI'"] --> B["🤖 Agent 1: Intent Parser"]
    B --> C["🔧 PTB Builder"]
    C --> D["🔬 Dry Run Simulation"]
    D --> E["🛡️ Agent 2: Guardian AI"]
    E --> F["📋 Transaction Card + Risk Report"]
    F --> G["✅ User Confirms & Signs"]
    G --> H["⚡ Execute on Sui Testnet"]
    H --> I["📦 Walrus + On-Chain Log"]
```

---

## 🌟 Key Differentiators

| Why Kura? | How |
|-----------|-----|
| **🧠 Dual-Agent AI** | Two specialized AI agents: Intent Parser (understands you) + Guardian (protects you) |
| **🛡️ Guardian Layer** | No blind signing. Every transaction gets a pre-execution risk analysis with human-readable reports |
| **🔬 Real On-Chain Simulation** | Uses Sui's `dryRunTransactionBlock` for accurate off-chain simulation — zero gas cost |
| **🗺️ Smart Routing** | Auto-routes swaps via DeepBook V3 aggregator for best prices |
| **📜 Immutable Audit Trail** | Every intent & report stored on Walrus + verified on-chain via KuraLogger Move contract |
| **🌏 Bilingual** | Full support for **Bahasa Indonesia** and **English** |
| **🔐 Privacy-First** | Chat sessions auto-clear on wallet disconnect. Keys never leave your device |

---

## 🎯 Supported DeFi Actions

<table>
<thead>
<tr>
<th>#</th>
<th>Action</th>
<th>Protocol</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td><strong>Swap</strong></td>
<td><a href="https://deepbook.com/">DeepBook V3</a></td>
<td><code>Tukar 100 USDC ke SUI</code></td>
</tr>
<tr>
<td>2</td>
<td><strong>Stake</strong></td>
<td>Sui Native</td>
<td><code>Stake 50 SUI</code></td>
</tr>
<tr>
<td>3</td>
<td><strong>Unstake</strong></td>
<td>Sui Native</td>
<td><code>Unstake SUI saya</code></td>
</tr>
<tr>
<td>4</td>
<td><strong>Lend</strong></td>
<td><a href="https://scallop.io/">Scallop</a></td>
<td><code>Pinjamkan 100 USDC</code></td>
</tr>
<tr>
<td>5</td>
<td><strong>Borrow</strong></td>
<td><a href="https://scallop.io/">Scallop</a></td>
<td><code>Borrow 50 SUI</code></td>
</tr>
<tr>
<td>6</td>
<td><strong>Provide Liquidity</strong></td>
<td><a href="https://cetus.zone/">Cetus AMM</a></td>
<td><code>Tambah likuiditas USDC-SUI</code></td>
</tr>
<tr>
<td>7</td>
<td><strong>Remove Liquidity</strong></td>
<td><a href="https://cetus.zone/">Cetus AMM</a></td>
<td><code>Cabut likuiditas saya</code></td>
</tr>
<tr>
<td>8</td>
<td><strong>Transfer</strong></td>
<td>Sui Native</td>
<td><code>Kirim 10 SUI ke 0x123...</code></td>
</tr>
<tr>
<td>9</td>
<td><strong>Check Balance</strong></td>
<td>Sui RPC</td>
<td><code>Cek saldo wallet saya</code></td>
</tr>
<tr>
<td>10</td>
<td><strong>Check Price</strong></td>
<td>Price Oracle</td>
<td><code>Berapa harga SUI?</code></td>
</tr>
</tbody>
</table>

---

## 🏛️ Architecture

```
═══════════════════════════════════════════════════════════════════════════════
                            FRONTEND LAYER (Client)
┌──────────────────┐  ┌──────────────────┐  ┌───────────────────────────────┐
│    Chat UI       │  │  Transaction     │  │   Wallet Connection           │
│  (React/Next.js) │  │  Preview Card    │  │   (@mysten/dapp-kit)          │
│  Tailwind v4     │  │  GuardianReport  │  │   Extension / zkLogin         │
└──────────────────┘  └──────────────────┘  └───────────────────────────────┘
═══════════════════════════════════════════════════════════════════════════════
            HTTP POST (SSE)                Render Response     signAndExecute
                │                                │                    │
                ▼                                │                    ▼
═══════════════════════════════════════════════════════════════════════════════
                     BACKEND & AI LAYER (Vercel - Next.js API)
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐
│   Agent 1:           │  │  PTB Builder     │  │   Agent 2:               │
│   Intent Parser      │──▶  Service         │──▶   The Guardian           │
│   (LLM → JSON)       │  │  (@mysten/sui)   │  │   (LLM Risk Analysis)    │
│                      │  │  DeepBook V3     │  │                          │
│                      │  │  Scallop SDK     │  │   Slippage Detection     │
│                      │  │  Cetus SDK       │  │   Pool Liquidity Check   │
└──────────────────────┘  └──────────────────┘  └──────────────────────────┘
═══════════════════════════════════════════════════════════════════════════════
                                        │ emit_log() via PTB
                                        ▼
═══════════════════════════════════════════════════════════════════════════════
                         BLOCKCHAIN LAYER (Sui Testnet)
┌────────────────────────────┐  ┌──────────────────┐  ┌────────────────────┐
│   KuraLogger Contract      │  │ Sui Testnet RPC  │  │  DeFi Protocols    │
│   (Move Module)            │  │                  │  │                    │
│   • GuardianReport         │◀─▶ • dryRun         │◀─▶ • DeepBook V3     │
│   • ExecutionLog           │  │ • execute        │  │ • Scallop          │
│   • Events                 │  │ • query          │  │ • Cetus AMM        │
│                            │  │                  │  │ • Sui Native       │
└────────────────────────────┘  └──────────────────┘  └────────────────────┘
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                     DECENTRALIZED STORAGE (Walrus)                          │
│  Intent JSON + Guardian Report → Walrus Blobs → Permanent Audit Trail      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pipeline Detail (8-Step Flow)

| Step | Component | Description | Duration |
|------|-----------|-------------|----------|
| 1 | **User Input** | Chat UI sends message + context to `/api/chat` | ~100ms |
| 2 | **Intent Parsing** | Agent 1 extracts structured JSON (action, tokens, amount) | ~2s |
| 3 | **Balance Check** | Server verifies user has sufficient tokens via Sui RPC | ~500ms |
| 4 | **Smart Routing** | Auto-selects best DEX route (DeepBook → Cetus fallback) | ~500ms |
| 5 | **PTB Building** | Constructs unsigned Programmable Transaction Block | ~300ms |
| 6 | **Dry Run** | Simulates on-chain via `sui_dryRunTransactionBlock` | ~2s |
| 7 | **Guardian Analysis** | Agent 2 calculates slippage, liquidity risk → report | ~2s |
| 8 | **Client Review** | User sees Transaction Card + Guardian Report, then signs | User-paced |

**End-to-end target: ≤ 10 seconds** (excluding user review time).

---

## 🛡️ Guardian AI Risk Levels

| Level | Label | Condition | UX |
|-------|-------|-----------|----|
| 0 | 🟢 **Low** | Slippage < 1%, Liquidity > $100K | Direct execution |
| 1 | 🟡 **Medium** | Slippage 1-3%, Liquidity $10K-$100K | Warning shown |
| 2 | 🟠 **High** | Slippage 3-5%, Liquidity $1K-$10K | Checkbox acknowledgment required |
| 3 | 🔴 **Critical** | Slippage > 5%, Liquidity < $1K, or stale pool | Type "KONFIRMASI"/"CONFIRM" to proceed |

---

## 📦 Smart Contract: KuraLogger

Deployed on **Sui Testnet** — immutable on-chain audit trail for every transaction.

```
Package ID: 0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064
Explorer:   https://suiscan.xyz/testnet/object/0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064
```

### Entry Functions

| Function | Phase | Purpose |
|----------|-------|---------|
| `emit_guardian_report()` | After Guardian analysis | Writes risk report on-chain |
| `confirm_intent()` | User presses "Execute" | Records explicit user confirmation |
| `log_execution()` | After tx confirmed | Links tx digest to report |

### On-Chain Data Flow
```
User Intent  ──→  GuardianReport Object (risk_level, slippage, blob refs)
                          │
                    User Confirms
                          │
                          ▼
                   ExecutionLog Object (tx_digest, timestamps, success)
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Full-stack React framework (App Router, Turbopack) |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui + Base UI** | Component primitives |
| **Lucide Icons** | Icon system |
| **Framer Motion** | Transaction card animations |
| **React Markdown** | Guardian report rendering |

### Blockchain & DeFi
| Technology | Purpose |
|------------|---------|
| **Sui Blockchain** | Layer-1 blockchain (Testnet) |
| **@mysten/sui** | Sui TypeScript SDK |
| **@mysten/dapp-kit** | Wallet integration (extension + zkLogin) |
| **DeepBook V3** | CLOB DEX for swaps |
| **Scallop** | Lending & borrowing protocol |
| **Cetus AMM** | Concentrated liquidity AMM |
| **Sui Move** | Smart contract language |

### AI & Backend
| Technology | Purpose |
|------------|---------|
| **Vercel AI SDK** | LLM orchestration + streaming |
| **OpenAI-compatible API** | Intent Parser + Guardian agents |
| **Zod v4** | Schema validation |
| **Walrus** | Decentralized blob storage |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Vercel** | Hosting (chat + landing page) |
| **pnpm workspaces** | Monorepo management |
| **Sui Testnet RPC** | Blockchain interaction |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 20
- **pnpm** ≥ 9
- **Sui Wallet** (extension) connected to **Testnet**
- **AI API key** (OpenAI-compatible endpoint)

### Setup

```bash
# 1. Clone & install
pnpm install

# 2. Set environment variables (apps/chat/.env.local)
cat > apps/chat/.env.local << EOF
AI_BASE_URL="https://api.your-ai-provider.com/v1"
AI_API_KEY="sk-your-key-here"
AI_MODEL="your-model-name"
NEXT_PUBLIC_NETWORK="testnet"
KURA_LOGGER_PACKAGE_ID="0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064"
EOF

# 3. Start development
pnpm --filter @kura/chat dev

# 4. Open http://localhost:3000
```

---

## 📂 Project Structure

```
kura/
├── apps/
│   ├── chat/                      # 🤖 Main chat application
│   │   ├── src/
│   │   │   ├── app/api/chat/      # Core API route (orchestration)
│   │   │   ├── lib/
│   │   │   │   ├── agents/        # Intent Parser + Guardian AI
│   │   │   │   ├── services/      # PTB Builder, DeepBook, Scallop, Cetus, Dry Run, Walrus
│   │   │   │   └── schemas.ts     # Zod validation schemas
│   │   │   ├── components/chat/   # Chat UI, TransactionCard, GuardianReport
│   │   │   ├── hooks/             # useChat state management
│   │   │   └── types/             # TypeScript definitions
│   │   └── public/                # Static assets
│   ├── landing-page/              # 🌐 Marketing site (kura.ai)
│   │   └── src/                   # Next.js 16 app
│   └── smart-contracts/           # 📜 KuraLogger Move module
│       ├── sources/               # Move source code
│       └── Move.toml              # Package manifest
├── docs/                          # Documentation
│   ├── PRD.md                     # Product Requirements Document
│   ├── KURA_ARCHITECTURE.md       # Technical architecture
│   ├── DEPLOYMENT_REPORT.md       # Deployment status
│   └── INTEGRATION_STATUS.md      # Integration checklist
├── env/                           # Shared env files
├── package.json                   # Root workspace config
├── pnpm-workspace.yaml            # Monorepo config
└── pnpm-lock.yaml                 # Lockfile
```

---

## 🔐 Security Architecture

- **No Server-Side Signing** — Backend constructs unsigned PTBs only; signing happens client-side via dapp-kit
- **Pre-Execution Simulation** — Every transaction is dry-run before the user sees it
- **Explicit Confirmation** — 2-step flow: review report → press "I Understand & Execute" → wallet popup
- **Immutable Audit Trail** — On-chain KuraLogger contract stores every report & execution permanently
- **Rate Limited** — 30 req/min per IP on `/api/chat`
- **Auto-Clear Privacy** — Sessions wipe on wallet disconnect

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`docs/PRD.md`](docs/PRD.md) | Full Product Requirements Document (Bahasa Indonesia) |
| [`docs/KURA_ARCHITECTURE_AND_FEATURES.md`](docs/KURA_ARCHITECTURE_AND_FEATURES.md) | Technical architecture deep-dive |
| [`docs/DEPLOYMENT_REPORT.md`](docs/DEPLOYMENT_REPORT.md) | Live deployment status |
| [`docs/INTEGRATION_STATUS.md`](docs/INTEGRATION_STATUS.md) | Integration checklist & resolution log |
| [`apps/chat/README.md`](apps/chat/README.md) | Chat app-specific setup guide |

---

## 🧪 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in parallel |
| `pnpm dev:chat` | Run chat app only |
| `pnpm dev:landing-page` | Run landing page only |
| `pnpm build:chat` | Build chat app for production |
| `pnpm lint` | Run linters across all apps |

---

## 🌐 Live Deployments

| Property | URL |
|----------|-----|
| **Chat App** | [https://chat.kura.ai](https://chat.kura.ai) |
| **Landing Page** | [https://kura.ai](https://kura.ai) |
| **Smart Contract** | [Sui Testnet Explorer](https://suiscan.xyz/testnet/object/0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064) |

---

## 👥 Team

Built with ❤️ for **Sui Overflow 2026** — the global Sui hackathon.

---

## 📄 License

[MIT](LICENSE)
