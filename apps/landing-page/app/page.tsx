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

  // Auto-scroll through steps in simulation for visual effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] font-sans selection:bg-white selection:text-black">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-[#1A1A1A]">
        <div className="flex justify-between items-center h-16 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Image 
              alt="KURA" 
              className="h-8 w-8 object-contain" 
              src="/kura-logo-dark-mode.png" 
              width={32} 
              height={32} 
            />
          </div>
          <nav className="hidden md:flex gap-8">
            <a className="text-xs font-semibold text-[#8e9192] hover:text-white transition-colors" href="#features">Features</a>
            <a className="text-xs font-semibold text-[#8e9192] hover:text-white transition-colors" href="#how-it-works">How It Works</a>
            <a className="text-xs font-semibold text-[#8e9192] hover:text-white transition-colors" href="#security">Security</a>
            <a className="text-xs font-semibold text-[#8e9192] hover:text-white transition-colors" href="#faq">FAQ</a>
          </nav>
          <div className="flex gap-4">
            <button className="hidden md:block px-4 py-2 text-xs font-bold text-white border border-[#2a2a2a] hover:border-white transition-all bg-transparent rounded-sm cursor-pointer">
              Launch App
            </button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 md:px-16 text-center py-20 border-b border-[#1A1A1A]">
          <div className="max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#2a2a2a] bg-[#0e0e0e] text-[#8e9192] text-xs font-mono tracking-widest rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SECURED BY SUI NETWORK
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none mb-6">
              Speak your DeFi intent.<br />Execute with protection.
            </h1>
            <p className="text-[#8e9192] max-w-2xl mx-auto text-base md:text-lg mb-10 leading-relaxed">
              Kura converts natural language into DeFi transactions on Sui, performing accurate simulations and risk checks before asking for your explicit confirmation.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-black text-xs font-bold glow-hover transition-all rounded-sm">
                Try Kura
              </button>
              <button className="px-8 py-4 border border-[#2a2a2a] text-white text-xs font-bold hover:bg-[#1c1b1b] transition-all rounded-sm">
                View Workflow
              </button>
            </div>
          </div>

          {/* UI Mockup Visual */}
          <div className="w-full max-w-5xl bg-[#0e0e0e] thin-border rounded-lg overflow-hidden flex flex-col md:flex-row h-auto md:h-[480px]">
            {/* Chat Panel */}
            <div className="w-full md:w-2/5 border-r border-[#1a1a1a] flex flex-col p-6 text-left">
              <div className="flex-1 space-y-4 overflow-y-auto font-mono text-xs text-[#8e9192]">
                <div className="p-3 bg-[#1c1b1b] border border-[#2a2a2a] rounded-sm opacity-60">
                  Transfer 50 SUI to the lending pool and stake the remaining balance in Aftermath.
                </div>
                <div className="p-3 bg-white/5 text-white border border-white/10 rounded-sm font-bold">
                  Parsing intent... Searching for optimal routes on Sui.
                </div>
                <div className="p-3 border border-[#2a2a2a] text-white rounded-sm terminal-cursor font-mono">
                  Analyzing risk parameters
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                <div className="flex justify-between items-center opacity-40 mb-2">
                  <span className="text-[10px] tracking-wider font-mono">INTENT INPUT</span>
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="h-10 w-full bg-black border border-[#2a2a2a] px-3 flex items-center rounded-sm">
                  <span className="text-[#8e9192] text-xs font-mono">Stake 100 SUI to...</span>
                </div>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="flex-1 p-8 text-left bg-black/40 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Guardian Dry Run</h3>
                    <p className="text-xs font-mono text-[#8e9192]">Simulated on Sui Mainnet Block #492,012</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono tracking-widest rounded-sm font-bold">
                    PASSED
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-[#1a1a1a] bg-[#0e0e0e] rounded-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-white" />
                      <span className="text-xs font-mono font-bold text-white tracking-wider">RISK REPORT</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-[#8e9192] tracking-wider font-mono mb-1">CONTRACT VERIFIED</p>
                        <p className="text-xs font-bold text-white">YES</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#8e9192] tracking-wider font-mono mb-1">SLIPPAGE PROTECTION</p>
                        <p className="text-xs font-bold text-white">0.5% MAX</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full p-4 bg-white text-black font-bold rounded-sm flex justify-between items-center hover:bg-neutral-200 transition-colors">
                  <div className="text-left">
                    <p className="text-[9px] font-extrabold tracking-widest text-neutral-500">CONFIRM TRANSACTION</p>
                    <p className="text-xs font-bold">2 Transactions • 5.12 SUI Gas Est.</p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto border-b border-[#1A1A1A]">
          <h2 className="text-3xl font-bold text-white mb-16 text-center tracking-tight">
            Current DeFi is broken by design.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 thin-border bg-[#0e0e0e] hover:border-white/20 transition-all rounded-sm">
              <Terminal className="w-8 h-8 text-[#8e9192] mb-6" />
              <h3 className="text-xs font-mono font-bold text-white mb-4 uppercase tracking-wider">DeFi Complexity</h3>
              <p className="text-[#8e9192] text-sm leading-relaxed">
                Fragmented interfaces and complex protocols make simple actions require dozens of clicks and deep technical knowledge.
              </p>
            </div>
            <div className="p-8 thin-border bg-[#0e0e0e] hover:border-white/20 transition-all rounded-sm">
              <EyeOff className="w-8 h-8 text-[#8e9192] mb-6" />
              <h3 className="text-xs font-mono font-bold text-white mb-4 uppercase tracking-wider">Blind Signing Risks</h3>
              <p className="text-[#8e9192] text-sm leading-relaxed">
                Signing opaque hex data is a leap of faith. Most users have no idea what their wallet is actually approving until it's too late.
              </p>
            </div>
            <div className="p-8 thin-border bg-[#0e0e0e] hover:border-white/20 transition-all rounded-sm">
              <ShieldAlert className="w-8 h-8 text-[#8e9192] mb-6" />
              <h3 className="text-xs font-mono font-bold text-white mb-4 uppercase tracking-wider">Lack of Guardian Layers</h3>
              <p className="text-[#8e9192] text-sm leading-relaxed">
                There is no "undo" button or safety net between a user's intent and the irreversible execution of smart contracts.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto" id="features">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            {/* The Guardian Shell */}
            <div className="lg:col-span-3 p-12 bg-[#0e0e0e] thin-border flex flex-col justify-between min-h-[380px] rounded-sm hover:border-white/10 transition-colors">
              <span className="text-xs font-mono text-[#8e9192] tracking-widest">PROTECTION LAYER</span>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">The Guardian Shell.</h2>
                <p className="text-[#8e9192] text-sm max-w-md leading-relaxed">
                  Every transaction is wrapped in a validation layer that checks for malicious logic, drainer patterns, and protocol health in real-time.
                </p>
              </div>
            </div>

            {/* The Curator */}
            <div className="lg:col-span-2 p-12 bg-white text-black flex flex-col justify-between min-h-[380px] rounded-sm hover:bg-neutral-100 transition-colors">
              <span className="text-xs font-mono text-neutral-500 tracking-widest font-bold">INTENT MAPPING</span>
              <div>
                <h2 className="text-3xl font-bold text-black mb-4">The Curator.</h2>
                <p className="text-neutral-700 text-sm max-w-xs leading-relaxed font-medium">
                  Your natural language intent is meticulously parsed into Programmable Transaction Blocks (PTB) optimized for the Sui network.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-12 bg-[#0e0e0e] thin-border rounded-sm hover:border-white/10 transition-colors">
              <h3 className="text-xl font-bold text-white mb-4">Uncompromising Accuracy.</h3>
              <p className="text-[#8e9192] text-sm leading-relaxed">
                Kura performs "shadow executions" against current network state to provide a 100% accurate preview of your balance changes before you sign.
              </p>
            </div>
            <div className="p-12 bg-[#0e0e0e] thin-border rounded-sm hover:border-white/10 transition-colors">
              <h3 className="text-xl font-bold text-white mb-4">Deliberate Execution.</h3>
              <p className="text-[#8e9192] text-sm leading-relaxed">
                Kura is non-custodial and passive by design. No asset movement ever occurs without your explicit, manual confirmation of the Guardian report.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works (Timeline) */}
        <section className="py-24 bg-[#0e0e0e] border-y border-[#1a1a1a]" id="how-it-works">
          <div className="px-6 md:px-16 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-20 tracking-tight">The Execution Cycle.</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden md:block absolute top-[24px] left-0 w-full h-[1px] bg-[#2a2a2a] z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {[
                  { step: "01", title: "Intent Input", desc: "Natural language request via chat or voice." },
                  { step: "02", title: "AI Parsing", desc: "Large-model conversion to protocol logic." },
                  { step: "03", title: "PTB Construction", desc: "Atomic transaction batching for efficiency." },
                  { step: "04", title: "Guardian Analysis", desc: "Security audit and dry run simulation." },
                  { step: "05", title: "Explicit Confirmation", desc: "Final human approval via zkLogin or wallet." }
                ].map((item, idx) => (
                  <div key={idx} className="group cursor-pointer" onClick={() => setActiveStep(idx)}>
                    <div className={`w-12 h-12 border flex items-center justify-center font-mono text-xs mb-6 rounded-sm transition-all duration-300 ${
                      activeStep === idx 
                        ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                        : "bg-black text-[#8e9192] border-[#2a2a2a] group-hover:border-white"
                    }`}>
                      {item.step}
                    </div>
                    <h4 className={`text-xs font-mono font-bold mb-2 transition-colors duration-300 ${
                      activeStep === idx ? "text-white" : "text-[#8e9192]"
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#8e9192] leading-relaxed">{item.desc}</p>
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
            <div className="md:col-span-3 thin-border p-8 flex flex-col justify-between bg-[#0e0e0e] min-h-[320px] rounded-sm hover:border-white/10 transition-colors">
              <div>
                <Terminal className="w-6 h-6 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Natural Language Chat</h3>
                <p className="text-[#8e9192] text-sm leading-relaxed">
                  Type complex multi-protocol intents as easily as a text message.
                </p>
              </div>
              <div className="mt-6 p-4 bg-black border border-[#1a1a1a] rounded-sm flex items-center">
                <span className="font-mono text-xs text-[#8e9192]/60">system: Waiting for user intent...</span>
              </div>
            </div>

            {/* Dry Run Simulation */}
            <div className="md:col-span-3 thin-border p-8 flex flex-col justify-between bg-[#0e0e0e] min-h-[320px] rounded-sm hover:border-white/10 transition-colors">
              <div>
                <Zap className="w-6 h-6 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Dry Run Simulation</h3>
                <p className="text-[#8e9192] text-sm leading-relaxed">
                  See exactly how your balance changes before committing to the chain.
                </p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-[#8e9192]">
                  <span>SIMULATING BLOCK INDEX</span>
                  <span>100% COMPLETE</span>
                </div>
                <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-white w-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Guardian Risk Report */}
            <div className="md:col-span-2 thin-border p-8 bg-[#0e0e0e] rounded-sm hover:border-white/10 transition-colors">
              <Shield className="w-6 h-6 text-white mb-4" />
              <h3 className="text-xs font-mono font-bold text-white mb-4 uppercase tracking-wider">Guardian Risk Report</h3>
              <p className="text-[#8e9192] text-xs leading-relaxed">
                AI-driven auditing for every transaction block prior to signing.
              </p>
            </div>

            {/* Human-readable PTB */}
            <div className="md:col-span-2 thin-border p-8 bg-[#0e0e0e] rounded-sm hover:border-white/10 transition-colors">
              <FileText className="w-6 h-6 text-white mb-4" />
              <h3 className="text-xs font-mono font-bold text-white mb-4 uppercase tracking-wider">Human-readable PTB</h3>
              <p className="text-[#8e9192] text-xs leading-relaxed">
                No more hex parsing. Read what your transaction actually executes.
              </p>
            </div>

            {/* zkLogin Onboarding */}
            <div className="md:col-span-2 thin-border p-8 bg-[#0e0e0e] rounded-sm hover:border-white/10 transition-colors">
              <KeyRound className="w-6 h-6 text-white mb-4" />
              <h3 className="text-xs font-mono font-bold text-white mb-4 uppercase tracking-wider">zkLogin Onboarding</h3>
              <p className="text-[#8e9192] text-xs leading-relaxed">
                Connect using Google, Facebook, or Apple without managing recovery seeds.
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 bg-white text-black" id="security">
          <div className="px-6 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 tracking-tight">
                Clinical Security. Zero Blind Signing.
              </h2>
              <ul className="space-y-6">
                {[
                  { title: "Local Key Management", desc: "Your private keys never leave your device. Kura acts only as a secure interface generator." },
                  { title: "100% Active Signing", desc: "Passive monitoring is not enough. Kura requires your explicit signature for every state change." },
                  { title: "On-chain Logs", desc: "All Kura interactions are logged via KuraLogger on Sui for transparent, immutable audit trails." }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-black mt-1 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-black font-mono tracking-wide uppercase">{item.title}</h4>
                      <p className="text-neutral-600 text-sm leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual element on the right */}
            <div className="flex-1 w-full max-w-md aspect-square border border-neutral-300 p-12 flex items-center justify-center relative overflow-hidden bg-neutral-50 rounded-sm">
              <div className="absolute inset-0 opacity-5 flex flex-wrap gap-1 p-2">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 border border-black"></div>
                ))}
              </div>
              <Shield className="w-32 h-32 text-black relative z-10" />
            </div>
          </div>
        </section>

        {/* Target Users */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-16 text-center tracking-tight">
            Built for the Sui ecosystem.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-[#0e0e0e] thin-border rounded-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 flex items-center justify-center rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xs font-mono font-bold mb-4 uppercase tracking-wider text-white">Crypto Beginners</h4>
              <p className="text-[#8e9192] text-xs leading-relaxed">
                Fearless entry into DeFi. No technical jargon, just execute your intent.
              </p>
            </div>
            <div className="text-center p-8 bg-[#0e0e0e] thin-border rounded-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 flex items-center justify-center rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xs font-mono font-bold mb-4 uppercase tracking-wider text-white">Intermediate Users</h4>
              <p className="text-[#8e9192] text-xs leading-relaxed">
                Faster execution routing and real-time security scanning.
              </p>
            </div>
            <div className="text-center p-8 bg-[#0e0e0e] thin-border rounded-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 flex items-center justify-center rounded-full">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xs font-mono font-bold mb-4 uppercase tracking-wider text-white">Sui Developers</h4>
              <p className="text-[#8e9192] text-xs leading-relaxed">
                Integrate Kura into your dApp to simplify the user journey.
              </p>
            </div>
          </div>
        </section>

        {/* Metrics Dashboard */}
        <section className="py-24 bg-[#0e0e0e] border-y border-[#1a1a1a]">
          <div className="px-6 md:px-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { metric: "90%", label: "PARSE SUCCESS" },
                { metric: "100%", label: "GUARDIAN CHECK" },
                { metric: "<10s", label: "LATENCY" },
                { metric: "100%", label: "CONFIRM RATE" }
              ].map((item, idx) => (
                <div key={idx} className="p-6 thin-border text-center rounded-sm bg-black/40">
                  <p className="text-3xl md:text-4xl font-bold text-white mb-2">{item.metric}</p>
                  <p className="text-[10px] font-mono text-[#8e9192] tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 md:px-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              DeFi should feel clear before it feels powerful.
            </h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="px-12 py-4 bg-white text-black text-xs font-bold glow-hover transition-all rounded-sm flex items-center justify-center gap-2">
                Launch Kura <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-12 py-4 border border-[#2a2a2a] text-white text-xs font-bold hover:bg-[#1c1b1b] transition-all rounded-sm">
                Read Architecture
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="bg-black border-t border-[#1a1a1a] text-xs text-[#8e9192]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image 
                alt="KURA" 
                className="h-8 w-8 object-contain" 
                src="/kura-logo-dark-mode.png" 
                width={32} 
                height={32} 
              />
              <span className="text-lg font-bold text-white tracking-tighter">KURA</span>
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
              <h5 className="font-mono font-bold text-white mb-4 uppercase tracking-wider">Product</h5>
              <ul className="space-y-3">
                <li><a className="hover:text-white transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Security Audit</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Architecture</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono font-bold text-white mb-4 uppercase tracking-wider">Company</h5>
              <ul className="space-y-3">
                <li><a className="hover:text-white transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono font-bold text-white mb-4 uppercase tracking-wider">Social</h5>
              <ul className="space-y-3">
                <li><a className="hover:text-white transition-colors" href="#">Discord</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Twitter</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Github</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
