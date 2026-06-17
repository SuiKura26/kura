"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Terminal,
  EyeOff,
  ShieldAlert,
  Shield,
  ChevronRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Code,
  Zap,
  Lock,
  FileText,
  KeyRound,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const chatAppUrl = process.env.NEXT_PUBLIC_CHAT_APP_URL || "https://kura-chat.vercel.app/";
  const [logoPositions, setLogoPositions] = useState<{
    sui: { top: string; left: string; size: string; rotate: string };
    walrus: { top: string; left: string; size: string; rotate: string };
  } | null>(null);

  // Auto-scroll through steps in simulation for visual effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Generate random positions on client mount to avoid SSR hydration issues
  useEffect(() => {
    const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    setLogoPositions({
      sui: {
        top: `${randomInRange(10, 45)}%`,
        left: `${randomInRange(5, 35)}%`,
        size: `${randomInRange(280, 420)}px`,
        rotate: `${randomInRange(-25, 25)}deg`,
      },
      walrus: {
        top: `${randomInRange(20, 55)}%`,
        left: `${randomInRange(60, 85)}%`,
        size: `${randomInRange(280, 420)}px`,
        rotate: `${randomInRange(-25, 25)}deg`,
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-foreground-base font-sans selection:bg-text-bright selection:text-bg-base">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-bg-base/80 backdrop-blur-md border-b border-border-base">
        <div className="flex justify-between items-center h-16 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <>
              <Image
                alt="KURA"
                className="h-8 w-8 object-contain hidden dark:block"
                src="/kura-logo-dark-mode.png"
                width={32}
                height={32}
              />
              <Image
                alt="KURA"
                className="h-8 w-8 object-contain block dark:hidden"
                src="/kura-logo-light-mode.png"
                width={32}
                height={32}
              />
            </>
          </div>
          <nav className="hidden md:flex gap-8">
            <a className="text-xs font-semibold text-text-muted hover:text-text-bright transition-colors" href="#features">Features</a>
            <a className="text-xs font-semibold text-text-muted hover:text-text-bright transition-colors" href="#how-it-works">How It Works</a>
            <a className="text-xs font-semibold text-text-muted hover:text-text-bright transition-colors" href="#security">Security</a>
            <a className="text-xs font-semibold text-text-muted hover:text-text-bright transition-colors" href="#faq">FAQ</a>
          </nav>
          <div className="flex gap-4">
            <a
              className="hidden md:block px-4 py-2 text-xs font-bold text-text-bright border border-border-accent hover:border-text-bright transition-all bg-transparent rounded-sm cursor-pointer"
              href={chatAppUrl}
            >
              Launch App
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 md:px-16 text-center py-20 border-b border-border-base">
          {logoPositions && (
            <>
              {/* Background Sui Logo Layer */}
              <div
                className="absolute z-20 opacity-30 dark:opacity-20 blur-[6px] hover:blur-none hover:opacity-100 hover:z-20 transition-all duration-500 cursor-pointer"
                style={{
                  top: logoPositions.sui.top,
                  left: logoPositions.sui.left,
                  width: logoPositions.sui.size,
                  height: logoPositions.sui.size,
                  transform: `translate(-50%, -50%) rotate(${logoPositions.sui.rotate})`,
                }}
              >
                <Image
                  src="/sui-logo.png"
                  alt="Sui Logo BG"
                  fill
                  sizes="33vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Background Walrus Logo Layer */}
              <div
                className="absolute z-20 opacity-30 dark:opacity-20 blur-[6px] hover:blur-none hover:opacity-100 hover:z-20 transition-all duration-500 cursor-pointer"
                style={{
                  top: logoPositions.walrus.top,
                  left: logoPositions.walrus.left,
                  width: logoPositions.walrus.size,
                  height: logoPositions.walrus.size,
                  transform: `translate(-50%, -50%) rotate(${logoPositions.walrus.rotate})`,
                }}
              >
                <Image
                  src="/walrus-logo.png"
                  alt="Walrus Logo BG"
                  fill
                  sizes="33vw"
                  className="object-contain"
                  priority
                />
              </div>
            </>
          )}

          {/* Backdrop Blur Layer - Opacity Blur Setengah */}
          <div className="absolute inset-0 bg-bg-base/50 backdrop-blur-md z-10 pointer-events-none" />

          <div className="relative z-30 max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-text-bright tracking-tight leading-none mb-6">
              Speak your DeFi intent.<br />Execute with protection.
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto text-base md:text-lg mb-10 leading-relaxed">
              Kura converts natural language into DeFi transactions on Sui, performing accurate simulations and risk checks before asking for your explicit confirmation.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-btn-primary-bg text-btn-primary-text text-xs font-bold glow-hover transition-all rounded-sm">
                Try Kura
              </button>
              <button className="px-8 py-4 border border-border-accent text-text-bright text-xs font-bold hover:bg-card-bg-accent transition-all rounded-sm">
                View Workflow
              </button>
            </div>
          </div>

          {/* UI Mockup Visual */}
          <div className="relative z-30 w-full max-w-5xl bg-card-bg-base border border-border-base rounded-lg overflow-hidden flex flex-col md:flex-row h-auto md:h-[480px]">
            {/* Chat Panel */}
            <div className="w-full md:w-2/5 border-r border-border-base flex flex-col p-6 text-left">
              <div className="flex-1 space-y-4 overflow-y-auto font-mono text-xs text-text-muted">
                <div className="p-3 bg-card-bg-accent border border-border-accent rounded-sm opacity-60">
                  Transfer 50 SUI to the lending pool and stake the remaining balance in Aftermath.
                </div>
                <div className="p-3 bg-text-bright/5 text-text-bright border border-text-bright/10 rounded-sm font-bold">
                  Parsing intent... Searching for optimal routes on Sui.
                </div>
                <div className="p-3 border border-border-accent text-text-bright rounded-sm terminal-cursor font-mono">
                  Analyzing risk parameters
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-base">
                <div className="flex justify-between items-center opacity-40 mb-2">
                  <span className="text-[10px] tracking-wider font-mono">INTENT INPUT</span>
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="h-10 w-full bg-black border border-border-accent px-3 flex items-center rounded-sm">
                  <span className="text-text-muted text-xs font-mono">Stake 100 SUI to...</span>
                </div>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="flex-1 p-8 text-left bg-bg-base/40 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-text-bright mb-1">Guardian Dry Run</h3>
                    <p className="text-xs font-mono text-text-muted">Simulated on Sui Mainnet Block #492,012</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono tracking-widest rounded-sm font-bold">
                    PASSED
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-border-base bg-card-bg-base rounded-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-text-bright" />
                      <span className="text-xs font-mono font-bold text-text-bright tracking-wider">RISK REPORT</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-text-muted tracking-wider font-mono mb-1">CONTRACT VERIFIED</p>
                        <p className="text-xs font-bold text-text-bright">YES</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted tracking-wider font-mono mb-1">SLIPPAGE PROTECTION</p>
                        <p className="text-xs font-bold text-text-bright">0.5% MAX</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full p-4 bg-btn-primary-bg text-btn-primary-text font-bold rounded-sm flex justify-between items-center hover:opacity-90 transition-opacity">
                  <div className="text-left">
                    <p className="text-[9px] font-extrabold tracking-widest text-text-muted">CONFIRM TRANSACTION</p>
                    <p className="text-xs font-bold">2 Transactions • 5.12 SUI Gas Est.</p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto border-b border-border-base">
          <h2 className="text-3xl font-bold text-text-bright mb-16 text-center tracking-tight">
            Current DeFi is broken by design.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 border border-border-base bg-card-bg-base hover:border-text-bright/20 transition-all rounded-sm">
              <Terminal className="w-8 h-8 text-text-muted mb-6" />
              <h3 className="text-xs font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">DeFi Complexity</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Fragmented interfaces and complex protocols make simple actions require dozens of clicks and deep technical knowledge.
              </p>
            </div>
            <div className="p-8 border border-border-base bg-card-bg-base hover:border-text-bright/20 transition-all rounded-sm">
              <EyeOff className="w-8 h-8 text-text-muted mb-6" />
              <h3 className="text-xs font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">Blind Signing Risks</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Signing opaque hex data is a leap of faith. Most users have no idea what their wallet is actually approving until it's too late.
              </p>
            </div>
            <div className="p-8 border border-border-base bg-card-bg-base hover:border-text-bright/20 transition-all rounded-sm">
              <ShieldAlert className="w-8 h-8 text-text-muted mb-6" />
              <h3 className="text-xs font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">Lack of Guardian Layers</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                There is no "undo" button or safety net between a user's intent and the irreversible execution of smart contracts.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto" id="features">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            {/* The Guardian Shell */}
            <div className="lg:col-span-3 p-12 bg-card-bg-base border border-border-base flex flex-col justify-between min-h-[380px] rounded-sm hover:border-text-bright/10 transition-colors">
              <span className="text-xs font-mono text-text-muted tracking-widest">PROTECTION LAYER</span>
              <div>
                <h2 className="text-3xl font-bold text-text-bright mb-4">The Guardian Shell.</h2>
                <p className="text-text-muted text-sm max-w-md leading-relaxed">
                  Acting as your digital shell in a DeFi ecosystem filled with pitfalls. Through the Guardian AI Layer, Kura actively detects, intercepts, and warns you about real threats like high slippage, low liquidity (stale pools), and adverse execution. No transaction passes through without this protection.
                </p>
              </div>
            </div>

            {/* The Curator */}
            <div className="lg:col-span-2 p-12 bg-btn-primary-bg text-btn-primary-text flex flex-col justify-between min-h-[380px] rounded-sm hover:opacity-90 transition-all">
              <span className="text-xs font-mono text-text-muted tracking-widest font-bold">INTENT MAPPING</span>
              <div>
                <h2 className="text-3xl font-bold text-btn-primary-text mb-4">The Curator.</h2>
                <p className="text-btn-primary-text/80 text-sm max-w-xs leading-relaxed font-medium">
                  Your personal curator for financial transactions. Kura translates arbitrary everyday language into clean, structured Programmable Transaction Blocks (PTB), presented as a simple, human-readable preview before execution.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-12 bg-card-bg-base border border-border-base rounded-sm hover:border-text-bright/10 transition-colors">
              <h3 className="text-xl font-bold text-text-bright mb-4">High Accuracy (A-KURA-si).</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Embodying "Akurasi" (Accuracy) in its DNA. Powered by Sui's Dry Run capability, Kura doesn't guess transaction outcomes. It runs accurate off-chain mathematical simulations against real blockchain state so that the AI never hallucinates.
              </p>
            </div>
            <div className="p-12 bg-card-bg-base border border-border-base rounded-sm hover:border-text-bright/10 transition-colors">
              <h3 className="text-xl font-bold text-text-bright mb-4">Deliberate Execution.</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Never moving rashly, just like a turtle observing its surroundings before stepping. Kura enforces Explicit Confirmation: the AI never moves assets unilaterally. AI only drafts and analyzes, but final execution and signing remain 100% in your hands.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works (Timeline) */}
        <section className="py-24 bg-card-bg-base border-y border-border-base" id="how-it-works">
          <div className="px-6 md:px-16 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text-bright mb-20 tracking-tight">The Execution Cycle.</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden md:block absolute top-[24px] left-[10%] right-[10%] h-[1px] bg-border-accent z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {[
                  { step: "01", title: "Intent Input", desc: "Natural language request via chat or voice." },
                  { step: "02", title: "AI Parsing", desc: "Large-model conversion to protocol logic." },
                  { step: "03", title: "PTB Construction", desc: "Atomic transaction batching for efficiency." },
                  { step: "04", title: "Guardian Analysis", desc: "Security audit and dry run simulation." },
                  { step: "05", title: "Explicit Confirmation", desc: "Final human approval via zkLogin or wallet." }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group cursor-pointer flex flex-col items-center text-center" 
                    onClick={() => setActiveStep(idx)}
                  >
                    <div className={`w-12 h-12 border flex items-center justify-center font-mono text-xs mb-6 rounded-sm transition-all duration-300 relative z-10 ${activeStep === idx
                        ? "bg-text-bright text-bg-base border-text-bright shadow-[0_0_15px_rgba(12,10,9,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                        : "bg-card-bg-base text-text-muted border-border-accent group-hover:border-text-bright"
                      }`}>
                      {item.step}
                    </div>
                    <h4 className={`text-xs font-mono font-bold mb-2 transition-colors duration-300 ${activeStep === idx ? "text-text-bright" : "text-text-muted"
                      }`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Spotlight (Bento Grid) */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Natural Language Chat */}
            <div className="md:col-span-3 border border-border-base p-8 flex flex-col justify-between bg-card-bg-base min-h-[320px] rounded-sm hover:border-text-bright/10 transition-colors">
              <div>
                <Terminal className="w-6 h-6 text-text-bright mb-4" />
                <h3 className="text-xl font-bold text-text-bright mb-2">Natural Language Chat</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  Type complex multi-protocol intents as easily as a text message. Kura supports 10 core DeFi actions: swap, stake, unstake, lend, borrow, provide liquidity, remove liquidity, transfer, check balance, and check price.
                </p>
                <p className="text-[10px] font-mono text-text-muted">
                  INTEGRATIONS: Cetus AMM · DeepBook V3 · Scallop · Sui Native
                </p>
              </div>
              <div className="mt-6 p-4 bg-card-bg-accent border border-border-base rounded-sm flex items-center">
                <span className="font-mono text-xs text-text-muted">system: Waiting for user intent...</span>
              </div>
            </div>

            {/* Dry Run Simulation */}
            <div className="md:col-span-3 border border-border-base p-8 flex flex-col justify-between bg-card-bg-base min-h-[320px] rounded-sm hover:border-text-bright/10 transition-colors">
              <div>
                <Zap className="w-6 h-6 text-text-bright mb-4" />
                <h3 className="text-xl font-bold text-text-bright mb-2">Dry Run Simulation</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  See exactly how your balance changes before committing to the chain.
                </p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-text-muted">
                  <span>SIMULATING BLOCK INDEX</span>
                  <span>100% COMPLETE</span>
                </div>
                <div className="h-1.5 w-full bg-border-accent rounded-full overflow-hidden">
                  <div className="h-full bg-text-bright w-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Guardian Risk Report */}
            <div className="md:col-span-2 border border-border-base p-8 bg-card-bg-base rounded-sm hover:border-text-bright/10 transition-colors flex flex-col justify-between">
              <div>
                <Shield className="w-6 h-6 text-text-bright mb-4" />
                <h3 className="text-xs font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">Guardian Risk Report</h3>
                <p className="text-text-muted text-xs leading-relaxed mb-4">
                  AI-driven auditing for every transaction block prior to signing.
                </p>
                <div className="space-y-2 text-[10px] font-mono text-text-muted">
                  <div className="flex justify-between items-center border-b border-border-base pb-1">
                    <span className="text-emerald-400 font-bold">LOW</span>
                    <span>Slippage &lt; 1% | Pool &gt; $100K</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border-base pb-1">
                    <span className="text-yellow-400 font-bold">MEDIUM</span>
                    <span>Slippage 1%-3% | Pool $10K-$100K</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border-base pb-1">
                    <span className="text-red-400 font-bold">HIGH</span>
                    <span>Slippage 3%-5% | Pool $1K-$10K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-bold">CRITICAL</span>
                    <span>Slippage &gt; 5% | Pool &lt; $1K / Stale</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Human-readable PTB */}
            <div className="md:col-span-2 border border-border-base p-8 bg-card-bg-base rounded-sm hover:border-text-bright/10 transition-colors">
              <FileText className="w-6 h-6 text-text-bright mb-4" />
              <h3 className="text-xs font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">Human-readable PTB</h3>
              <p className="text-text-muted text-xs leading-relaxed">
                No more hex parsing. Read what your transaction actually executes.
              </p>
            </div>

            {/* zkLogin Onboarding */}
            <div className="md:col-span-2 border border-border-base p-8 bg-card-bg-base rounded-sm hover:border-text-bright/10 transition-colors">
              <KeyRound className="w-6 h-6 text-text-bright mb-4" />
              <h3 className="text-xs font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">zkLogin Onboarding</h3>
              <p className="text-text-muted text-xs leading-relaxed">
                Connect using Google, Facebook, or Apple without managing recovery seeds.
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 bg-bg-base text-foreground-base" id="security">
          <div className="px-6 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-text-bright mb-8 tracking-tight">
                Clinical Security. Zero Blind Signing.
              </h2>
              <ul className="space-y-6">
                {[
                  { title: "Local Key Management", desc: "Your private keys never leave your device. Kura acts only as a secure interface generator." },
                  { title: "100% Active Signing", desc: "Passive monitoring is not enough. Kura requires your explicit signature for every state change." },
                  { title: "On-chain Logs", desc: "All Kura interactions are logged via KuraLogger on Sui for transparent, immutable audit trails." }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-text-bright mt-1 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-text-bright font-mono tracking-wide uppercase">{item.title}</h4>
                      <p className="text-text-muted text-sm leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual element on the right */}
            <div className="flex-1 w-full max-w-md aspect-square border border-border-base p-12 flex items-center justify-center relative overflow-hidden bg-card-bg-base rounded-sm">
              <div className="absolute inset-0 opacity-5 flex flex-wrap gap-1 p-2">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 border border-border-accent"></div>
                ))}
              </div>
              <Shield className="w-32 h-32 text-text-bright relative z-10" />
            </div>
          </div>
        </section>

        {/* Target Users */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-text-bright mb-16 text-center tracking-tight">
            Built for the Sui ecosystem.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card-bg-base border border-border-base rounded-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-text-bright/5 flex items-center justify-center rounded-full">
                <Users className="w-6 h-6 text-text-bright" />
              </div>
              <h4 className="text-xs font-mono font-bold mb-4 uppercase tracking-wider text-text-bright">Crypto Beginners</h4>
              <p className="text-text-muted text-xs leading-relaxed">
                Fearless entry into DeFi. No technical jargon, just execute your intent.
              </p>
            </div>
            <div className="text-center p-8 bg-card-bg-base border border-border-base rounded-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-text-bright/5 flex items-center justify-center rounded-full">
                <TrendingUp className="w-6 h-6 text-text-bright" />
              </div>
              <h4 className="text-xs font-mono font-bold mb-4 uppercase tracking-wider text-text-bright">Intermediate Users</h4>
              <p className="text-text-muted text-xs leading-relaxed">
                Faster execution routing and real-time security scanning.
              </p>
            </div>
            <div className="text-center p-8 bg-card-bg-base border border-border-base rounded-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-text-bright/5 flex items-center justify-center rounded-full">
                <Code className="w-6 h-6 text-text-bright" />
              </div>
              <h4 className="text-xs font-mono font-bold mb-4 uppercase tracking-wider text-text-bright">Sui Developers</h4>
              <p className="text-text-muted text-xs leading-relaxed">
                Integrate Kura into your dApp to simplify the user journey.
              </p>
            </div>
          </div>
        </section>

        {/* Metrics Dashboard */}
        <section className="py-24 bg-card-bg-base border-y border-border-base">
          <div className="px-6 md:px-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { metric: "90%", label: "PARSE SUCCESS" },
                { metric: "100%", label: "GUARDIAN CHECK" },
                { metric: "<10s", label: "LATENCY" },
                { metric: "100%", label: "CONFIRM RATE" }
              ].map((item, idx) => (
                <div key={idx} className="p-6 border border-border-base text-center rounded-sm bg-bg-base/40">
                  <p className="text-3xl md:text-4xl font-bold text-text-bright mb-2">{item.metric}</p>
                  <p className="text-[10px] font-mono text-text-muted tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 md:px-16 max-w-4xl mx-auto border-t border-border-base" id="faq">
          <h2 className="text-3xl font-bold text-text-bright mb-12 text-center tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What protocols does Kura integrate with?",
                a: "Kura is integrated with Cetus AMM for liquidity provision, DeepBook V3 for limit orderbook swaps, Scallop for lending/borrowing, and Sui Native Staking for staking operations."
              },
              {
                q: "What actions can the Intent Parser process?",
                a: "Kura supports 10 distinct DeFi actions: swap, stake, unstake, lend, borrow, provide liquidity, remove liquidity, transfer, check balance, and check price."
              },
              {
                q: "Is Kura non-custodial?",
                a: "Yes, Kura is 100% non-custodial. Kura operates under the philosophy of Deliberate Execution, meaning the AI only acts as an assistant to draft and analyze transactions, while the final cryptographic execution requires your manual confirmation and signature."
              },
              {
                q: "How does the Guardian AI evaluate risk?",
                a: "For every intent, the Guardian AI performs an off-chain dry-run simulation of the generated Programmable Transaction Block (PTB) on the Sui network. It extracts parameters like slippage and pool depth, compares them with real-time oracle data, and maps them to four risk tiers (Low, Medium, High, Critical) to protect you from bad executions."
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-6 border border-border-base bg-card-bg-base rounded-sm">
                <h4 className="text-sm font-bold text-text-bright font-mono mb-2">{faq.q}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 md:px-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-text-bright mb-8 tracking-tight">
              DeFi should feel clear before it feels powerful.
            </h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href={chatAppUrl}
                className="px-12 py-4 bg-btn-primary-bg text-btn-primary-text text-xs font-bold glow-hover transition-all rounded-sm flex items-center justify-center gap-2"
              >
                Launch Kura <ArrowRight className="w-4 h-4" />
              </a>
              <button className="px-12 py-4 border border-border-accent text-text-bright text-xs font-bold hover:bg-card-bg-accent transition-all rounded-sm">
                Read Architecture
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="bg-bg-base border-t border-border-base text-xs text-text-muted">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <>
                <Image
                  alt="KURA"
                  className="h-8 w-8 object-contain hidden dark:block"
                  src="/kura-logo-dark-mode.png"
                  width={32}
                  height={32}
                />
                <Image
                  alt="KURA"
                  className="h-8 w-8 object-contain block dark:hidden"
                  src="/kura-logo-light-mode.png"
                  width={32}
                  height={32}
                />
              </>
            </div>
            <p className="max-w-sm leading-relaxed">
              Built for safer DeFi interactions on Sui. Secured by machine intelligence, confirmed by you.
            </p>
            <div className="pt-4 text-[10px] font-mono opacity-50">
              © 2026 KURA AI. SECURED BY SUI.
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h5 className="font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">Product</h5>
              <ul className="space-y-3">
                <li><a className="hover:text-text-bright transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-text-bright transition-colors" href="#">Security Audit</a></li>
                <li><a className="hover:text-text-bright transition-colors" href="#">Architecture</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">Company</h5>
              <ul className="space-y-3">
                <li><a className="hover:text-text-bright transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-text-bright transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono font-bold text-text-bright mb-4 uppercase tracking-wider">Social</h5>
              <ul className="space-y-3">
                <li><a className="hover:text-text-bright transition-colors" href="#">Discord</a></li>
                <li><a className="hover:text-text-bright transition-colors" href="#">Twitter</a></li>
                <li><a className="hover:text-text-bright transition-colors" href="#">Github</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
