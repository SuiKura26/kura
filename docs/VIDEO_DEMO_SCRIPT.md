# Kura — Video Demo Script (Final)

> **Durasi:** 2:45 — 3:00 menit  
> **Bahasa:** English narration + subtitle Bahasa Indonesia  
> **Format:** 1920×1080, 30fps, MP4

---

## SCENE 1 — COLD OPEN (0:00–0:15)

| Visual | Narration |
|--------|-----------|
| Layar hitam. Teks putih: *"Sign this transaction?"* | *You open your wallet. It says: "Sign this transaction."* |
| Raw hex blob tanpa penjelasan. | *But what does it do? Where is your money going? Nobody tells you.* |
| Teks merah: **"YOU JUST LOST EVERYTHING."** | *This is Blind Signing. And it's how millions get drained.* |
| Logo Kura fade in. Tagline: **"Don't Blind Sign. Kura Sign."** | *Introducing Kura. The DeFi Firewall for Sui.* |

---

## SCENE 2 — CONNECT & FAUCET (0:15–0:40)

| Visual | Narration |
|--------|-----------|
| Screen recording: `chat.kura.ai` di browser. | *Here's Kura. A chat interface — like talking to a friend.* |
| Klik "Connect Wallet" → Sui Wallet popup → approve. | *Connect any Sui wallet. Kura never auto-signs. You're in control.* |
| Sidebar update. Suggestion chips: "Tukar SUI ke USDC", "Stake SUI", "Cek saldo". | *Kura suggests commands. English. Bahasa Indonesia. Just type what you want.* |
| Klik tombol **"Claim 1000 USDC"** di sidebar. | *First, get test tokens. One click. Zero gas.* |
| Close-up: **⛽ gas fee = $0.00 — Sponsored Transaction.** | *Kura pays the gas. You pay nothing. Always.* |

---

## SCENE 3 — INTENT PARSING (0:40–1:05)

| Visual | Narration |
|--------|-----------|
| Ketik: **"Swap 0.5 SUI to USDC"** → Enter. | *Let's trade. Just type what you want. No buttons. No code.* |
| LoadingSteps muncul live: | *Watch the pipeline — real time:* |
| ✅ "Parsing intent..." → checklist hijau. | *Agent 1 — the Intent Parser — translates natural language into structured data.* |
| ✅ "Checking balance..." → "Balance OK. 2.3 SUI" | *Balance verified. No wasted gas on impossible transactions.* |
| ✅ "Routing..." → "DeepBook V3" | *Smart routing picks the best protocol — DeepBook, Cetus, or Scallop.* |

---

## SCENE 4 — DRY-RUN & GUARDIAN REPORT (1:05–1:40)

| Visual | Narration |
|--------|-----------|
| ✅ "Building..." → "Simulating on Sui VM..." | *Here's the magic. Kura builds a real Sui PTB and dry-runs it on the Sui VM.* |
| | *Not AI guessing. Real blockchain execution — before you sign.* |
| Transaction Card muncul: | *Your Transaction Card. Human readable. Step by step.* |
| • Swap: 0.5 SUI → ~1.74 USDC | |
| • Route: DeepBook V3 | |
| • Fee: 0.005 SUI | |
| Guardian Report — color bar HIJAU: | *Agent 2 — the Guardian — analyzes the dry-run results.* |
| • Risk: **LOW** 🟢 | *Low Risk. Safe to proceed.* |
| • Slippage: <0.5% | |
| • Pool Liquidity: $12.4M | |
| **⏱️ < 3 detik dari input ke Guardian Report.** | |

---

## SCENE 5 — THE GUARDIAN SHELL (1:40–2:05)

| Visual | Narration |
|--------|-----------|
| Ketik: **"Swap 100 SUI to RANDOM"** | *Now. A dangerous trade.* |
| Guardian Report MERAH: | *The Guardian flags it: CRITICAL.* |
| • Risk: **CRITICAL** 🔴 | *Forty-five percent slippage.* |
| • Slippage: 45% | *Dangerously low liquidity.* |
| • Liquidity: $1,200 | |
| **Text input: "Ketik KONFIRMASI untuk lanjutkan"** | *For Critical risks, Kura forces you to TYPE a confirmation word. No accidental clicks.* |
| Klik "Cancel." | *We'll skip this one. That's the point. The Guardian Shell just saved you.* |

---

## SCENE 6 — EXECUTE & ON-CHAIN AUDIT (2:05–2:25)

| Visual | Narration |
|--------|-----------|
| Kembali ke swap SUI→USDC. Klik **"Execute"** → wallet prompt. | *Back to our safe swap. Execute. Sign.* |
| ⛽ **Gas fee = $0.00 — Sponsored.** | *Zero gas. Every transaction. Always sponsored.* |
| "✅ Transaction Success" + link SuiScan. | *Done. Transaction confirmed.* |
| SuiScan: KuraLogger events — `emit_guardian_report`, `confirm_intent`, `log_execution`. | *Every interaction permanently on-chain via KuraLogger. Guardian Report. Confirmation. Digest. All auditable.* |
| Walrus blob ID. | *Full report on Walrus. Decentralized. Immutable.* |

---

## SCENE 7 — MONTAGE & CLOSING (2:25–2:50)

| Visual | Narration |
|--------|-----------|
| Montase cepat — 5 klip 3 detik: | *Swap. Stake. Lend. Borrow. Transfer. Ten DeFi actions. One interface.* |
| • "Stake 1 SUI" → Guardian → Execute | |
| • "Lend 50 USDC di Scallop" → Guardian | |
| • "Pinjam 20 USDC" → Guardian | |
| • Bilingual: "Tukar 0.5 SUI ke USDC" | *English and Bahasa Indonesia. Built for everyone.* |
| Tampilkan: **Try Kura** | *Kura is open source. Live on Sui. Try it now.* |
| Logo Kura + tagline fade in. | *Don't Blind Sign. Kura Sign.* |

---

## 🎙 NARRATION — PLAIN TEXT (voiceover)

```
You open your wallet. It says: Sign this transaction.
But what does it do? Where is your money going?
Nobody tells you.

This is Blind Signing. And it's how millions get drained.

Introducing Kura. The DeFi Firewall for Sui.

Here's Kura. A chat interface — like talking to a friend.
Connect any Sui wallet. Kura never auto-signs. You're in control.

First, get test tokens. One click. Zero gas.
Kura pays the gas. You pay nothing. Always.

Let's trade. Just type what you want. No buttons. No code.
"Swap 0.5 SUI to USDC."

Watch the pipeline — real time.
Agent 1, the Intent Parser, translates natural language
into structured data.

Balance verified. No wasted gas.

Smart routing picks the best protocol:
DeepBook, Cetus, or Scallop. Automatically.

Here's the magic. Kura builds a real Sui PTB and dry-runs it
on the Sui VM. Not AI guessing. Real blockchain execution —
before you sign.

Your Transaction Card. Human readable. Step by step.

Agent 2, the Guardian, analyzes the dry-run results.
Risk level: Low. Slippage under half a percent.
Pool liquidity: twelve point four million dollars.
Safe to proceed.

Now. A dangerous trade.
The Guardian flags it: Critical.
Forty-five percent slippage. Dangerously low liquidity.

For Critical risks, Kura forces you to TYPE a confirmation word.
No accidental clicks. The Guardian Shell protects you.

Back to our safe swap. Execute. Sign.
Zero gas. Again. Every transaction. Always sponsored.
Done. Transaction confirmed.

Every interaction permanently on-chain via KuraLogger.
Guardian Report. Confirmation. Digest. All auditable.
Full report on Walrus. Decentralized. Immutable.

Swap. Stake. Lend. Borrow. Transfer.
Ten DeFi actions. One interface.
English and Bahasa Indonesia. Built for everyone.

Kura is open source. Live on Sui.
Try it now.

Don't Blind Sign. Kura Sign.
```
