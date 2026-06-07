<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>KURA | Secure DeFi Intent Engine on Sui</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        @import url('https://fonts.cdnfonts.com/css/geist');
        
        body {
            background-color: #000000;
            color: #e5e2e1;
            font-family: 'Geist', sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        .mono-font {
            font-family: 'JetBrains Mono', monospace;
        }

        .glow-hover:hover {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
            border-color: #ffffff;
        }

        .thin-border {
            border: 1px solid #1A1A1A;
        }

        .terminal-cursor::after {
            content: '_';
            animation: blink 1s infinite;
        }

        @keyframes blink {
            50% { opacity: 0; }
        }

        .asymmetric-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 24px;
        }

        @media (max-width: 1024px) {
            .asymmetric-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface-container-highest": "#353535",
                      "on-primary-container": "#636565",
                      "outline": "#8e9192",
                      "on-tertiary-container": "#636565",
                      "background": "#131313",
                      "inverse-surface": "#e5e2e1",
                      "surface-dim": "#131313",
                      "outline-variant": "#444748",
                      "on-background": "#e5e2e1",
                      "tertiary-fixed-dim": "#c6c6c7",
                      "surface-tint": "#c6c6c7",
                      "on-primary-fixed": "#1a1c1c",
                      "primary-fixed": "#e2e2e2",
                      "on-surface-variant": "#c4c7c8",
                      "tertiary-container": "#e2e2e2",
                      "primary": "#ffffff",
                      "inverse-on-surface": "#313030",
                      "on-surface": "#e5e2e1",
                      "on-primary": "#2f3131",
                      "secondary-fixed": "#e3e2e2",
                      "on-tertiary": "#2f3131",
                      "primary-fixed-dim": "#c6c6c7",
                      "secondary-container": "#464747",
                      "inverse-primary": "#5d5f5f",
                      "on-secondary-fixed-variant": "#464747",
                      "tertiary-fixed": "#e2e2e2",
                      "on-primary-fixed-variant": "#454747",
                      "tertiary": "#ffffff",
                      "surface-container-high": "#2a2a2a",
                      "on-tertiary-fixed": "#1a1c1c",
                      "surface-container-low": "#1c1b1b",
                      "on-secondary-container": "#b5b5b5",
                      "surface-variant": "#353535",
                      "surface": "#131313",
                      "on-secondary": "#303031",
                      "secondary-fixed-dim": "#c7c6c6",
                      "error": "#ffb4ab",
                      "surface-container-lowest": "#0e0e0e",
                      "secondary": "#c7c6c6",
                      "surface-bright": "#393939",
                      "surface-container": "#20201f",
                      "on-error-container": "#ffdad6",
                      "error-container": "#93000a",
                      "on-secondary-fixed": "#1b1c1c",
                      "primary-container": "#e2e2e2",
                      "on-error": "#690005",
                      "on-tertiary-fixed-variant": "#454747"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "container-max": "1440px",
                      "margin-mobile": "16px",
                      "margin-desktop": "64px",
                      "gutter": "24px",
                      "unit": "4px"
              },
              "fontFamily": {
                      "headline-xl": ["Geist"],
                      "headline-lg-mobile": ["Geist"],
                      "body-md": ["Geist"],
                      "headline-lg": ["Geist"],
                      "label-sm": ["JetBrains Mono"]
              },
              "fontSize": {
                      "headline-xl": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                      "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                      "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                      "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                      "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }]
              }
            },
          },
        }
    </script>
</head>
<body class="bg-background">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
<div class="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<div class="flex items-center gap-2">
<img alt="KURA" class="h-8 w-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMcB0KUHf0-oxZbd76e8CMCjgXcIOumU8nlC95_PwTjpazqRSJhGRokQ2Dw9ZqTmKWC0hP5WGxYAC3Wgd2CNQtc8T8GBoTrtGBAqtdi5WkLWKj7RVyR1EklCFfN8aMUj6yNI-RRGuoHKzlT_lznDJNwykkFraH3TA2Ie2KGq3UFTQg-jAGPT1zWqjflXzct5GIxBcMX_4mG35lOnhkpSbG1VrLBJcdESFd_xAs1820FzNbMuQ4tiss6Tm0GXcvevHINub3szWGu9Mk"/>
<span class="font-headline-lg text-headline-lg font-bold tracking-tighter text-primary">KURA</span>
</div>
<nav class="hidden md:flex gap-8">
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#how-it-works">How It Works</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#security">Security</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#faq">FAQ</a>
</nav>
<div class="flex gap-4">
<button class="hidden md:block px-4 py-2 font-label-sm text-label-sm text-primary border border-outline-variant hover:border-primary transition-all">Launch App</button>
<button class="px-4 py-2 bg-primary text-on-primary font-label-sm text-label-sm font-bold glow-hover transition-all">Connect Wallet</button>
</div>
</div>
</header>
<main class="pt-16">
<!-- Hero Section -->
<section class="min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop text-center py-20 border-b border-outline-variant">
<div class="max-w-4xl mx-auto mb-16">
<div class="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm">
<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    SECURED BY SUI NETWORK
                </div>
<h1 class="font-headline-xl text-headline-xl md:text-[64px] md:leading-[72px] mb-6">
                    Speak your DeFi intent.<br/>Execute with protection.
                </h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mb-10">
                    Kura converts natural language into DeFi transactions on Sui, performing accurate simulations and risk checks before asking for your explicit confirmation.
                </p>
<div class="flex flex-col md:flex-row gap-4 justify-center">
<button class="px-8 py-4 bg-primary text-on-primary font-label-sm text-label-sm font-bold glow-hover transition-all">Try Kura</button>
<button class="px-8 py-4 border border-outline-variant text-primary font-label-sm text-label-sm font-bold hover:bg-surface-container-low transition-all">View Workflow</button>
</div>
</div>
<!-- UI Mockup Visual -->
<div class="w-full max-w-5xl bg-surface-container-lowest thin-border rounded-lg overflow-hidden flex flex-col md:flex-row h-[500px]">
<!-- Chat Panel -->
<div class="w-full md:w-1/3 border-r border-outline-variant flex flex-col p-6 text-left">
<div class="flex-1 space-y-4 overflow-y-auto font-label-sm text-label-sm">
<div class="p-3 bg-surface-container-low border border-outline-variant opacity-50">Transfer 50 SUI to the lending pool and stake the remaining balance in Aftermath.</div>
<div class="p-3 bg-primary text-on-primary font-bold">Parsing intent... Searching for optimal routes on Sui.</div>
<div class="p-3 border border-outline-variant text-primary terminal-cursor">Analyzing risk parameters</div>
</div>
<div class="mt-4 pt-4 border-t border-outline-variant">
<div class="flex justify-between items-center opacity-40 mb-2">
<span class="font-label-sm text-label-sm">INTENT INPUT</span>
<span class="material-symbols-outlined text-sm">keyboard</span>
</div>
<div class="h-10 w-full bg-background border border-outline-variant px-3 flex items-center">
<span class="text-on-surface-variant font-label-sm text-label-sm">Stake 100 SUI to...</span>
</div>
</div>
</div>
<!-- Analysis Panel -->
<div class="flex-1 p-8 text-left bg-surface-container-lowest overflow-y-auto">
<div class="flex justify-between items-start mb-8">
<div>
<h3 class="font-headline-lg text-headline-lg-mobile text-primary mb-1">Guardian Dry Run</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">Simulated on Sui Mainnet Block #492,012</p>
</div>
<div class="px-3 py-1 bg-green-900/20 text-green-500 border border-green-500/30 text-[10px] mono-font">PASSED</div>
</div>
<div class="space-y-6">
<div class="p-4 border border-outline-variant bg-surface-container-low">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary">security</span>
<span class="font-label-sm text-label-sm text-primary">RISK REPORT</span>
</div>
<div class="grid grid-cols-2 gap-4">
<div>
<p class="text-[10px] text-on-surface-variant mb-1">CONTRACT VERIFIED</p>
<p class="font-label-sm text-label-sm text-primary">YES</p>
</div>
<div>
<p class="text-[10px] text-on-surface-variant mb-1">SLIPPAGE PROTECTION</p>
<p class="font-label-sm text-label-sm text-primary">0.5% MAX</p>
</div>
</div>
</div>
<div class="p-4 bg-primary text-on-primary rounded-sm flex justify-between items-center">
<div>
<p class="text-[10px] font-bold opacity-70">CONFIRM TRANSACTION</p>
<p class="font-label-sm text-label-sm font-bold">2 Transactions • 5.12 SUI Gas Est.</p>
</div>
<span class="material-symbols-outlined">chevron_right</span>
</div>
</div>
</div>
</div>
</section>
<!-- Problem Section -->
<section class="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant">
<h2 class="font-headline-lg text-headline-lg mb-16 text-center">Current DeFi is broken by design.</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div class="p-8 thin-border bg-surface-container-lowest hover:border-primary/40 transition-colors">
<span class="material-symbols-outlined text-4xl mb-6 text-on-surface-variant">terminal</span>
<h3 class="font-label-sm text-label-sm font-bold text-primary mb-4 uppercase">DeFi Complexity</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Fragmented interfaces and complex protocols make simple actions require dozens of clicks and deep technical knowledge.</p>
</div>
<div class="p-8 thin-border bg-surface-container-lowest hover:border-primary/40 transition-colors">
<span class="material-symbols-outlined text-4xl mb-6 text-on-surface-variant">visibility_off</span>
<h3 class="font-label-sm text-label-sm font-bold text-primary mb-4 uppercase">Blind Signing Risks</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Signing opaque hex data is a leap of faith. Most users have no idea what their wallet is actually approving until it's too late.</p>
</div>
<div class="p-8 thin-border bg-surface-container-lowest hover:border-primary/40 transition-colors">
<span class="material-symbols-outlined text-4xl mb-6 text-on-surface-variant">gpp_maybe</span>
<h3 class="font-label-sm text-label-sm font-bold text-primary mb-4 uppercase">Lack of Guardian Layers</h3>
<p class="font-body-md text-body-md text-on-surface-variant">There is no "undo" button or safety net between a user's intent and the irreversible execution of smart contracts.</p>
</div>
</div>
</section>
<!-- Solution Section -->
<section class="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="features">
<div class="asymmetric-grid mb-gutter">
<div class="p-12 bg-surface-container-lowest thin-border flex flex-col justify-end min-h-[400px]">
<span class="font-label-sm text-label-sm text-primary mb-2 opacity-50">PROTECTION LAYER</span>
<h2 class="font-headline-xl text-headline-xl mb-6">The Guardian Shell.</h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-md">Every transaction is wrapped in a validation layer that checks for malicious logic, drainer patterns, and protocol health in real-time.</p>
</div>
<div class="p-12 bg-primary text-on-primary flex flex-col justify-end min-h-[400px]">
<span class="font-label-sm text-label-sm font-bold mb-2 opacity-70">INTENT MAPPING</span>
<h2 class="font-headline-xl text-headline-xl mb-6">The Curator.</h2>
<p class="font-body-md text-body-md font-medium max-w-xs">Your natural language intent is meticulously parsed into Programmable Transaction Blocks (PTB) optimized for the Sui network.</p>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<div class="p-12 bg-surface-container-lowest thin-border">
<h3 class="font-headline-lg text-headline-lg mb-4">Uncompromising Accuracy.</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Kura performs "shadow executions" against current network state to provide a 100% accurate preview of your balance changes before you sign.</p>
</div>
<div class="p-12 bg-surface-container-lowest thin-border">
<h3 class="font-headline-lg text-headline-lg mb-4">Deliberate Execution.</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Kura is non-custodial and passive by design. No asset movement ever occurs without your explicit, manual confirmation of the Guardian report.</p>
</div>
</div>
</section>
<!-- How It Works (Timeline) -->
<section class="py-24 bg-surface-container-lowest border-y border-outline-variant" id="how-it-works">
<div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<h2 class="font-headline-xl text-headline-xl mb-20">The Execution Cycle.</h2>
<div class="relative">
<div class="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant -translate-y-1/2"></div>
<div class="grid grid-cols-1 md:grid-cols-5 gap-8">
<!-- Step 1 -->
<div class="relative z-10 bg-surface-container-lowest pr-4 group">
<div class="w-12 h-12 border border-outline-variant flex items-center justify-center font-label-sm text-label-sm mb-6 bg-background group-hover:border-primary transition-colors">01</div>
<h4 class="font-label-sm text-label-sm font-bold text-primary mb-2">Intent Input</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-sm">Natural language request via chat or voice.</p>
</div>
<!-- Step 2 -->
<div class="relative z-10 bg-surface-container-lowest pr-4 group">
<div class="w-12 h-12 border border-outline-variant flex items-center justify-center font-label-sm text-label-sm mb-6 bg-background group-hover:border-primary transition-colors">02</div>
<h4 class="font-label-sm text-label-sm font-bold text-primary mb-2">AI Parsing</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-sm">Large-model conversion to protocol logic.</p>
</div>
<!-- Step 3 -->
<div class="relative z-10 bg-surface-container-lowest pr-4 group">
<div class="w-12 h-12 border border-outline-variant flex items-center justify-center font-label-sm text-label-sm mb-6 bg-background group-hover:border-primary transition-colors">03</div>
<h4 class="font-label-sm text-label-sm font-bold text-primary mb-2">PTB Construction</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-sm">Atomic transaction batching for efficiency.</p>
</div>
<!-- Step 4 -->
<div class="relative z-10 bg-surface-container-lowest pr-4 group">
<div class="w-12 h-12 border border-outline-variant flex items-center justify-center font-label-sm text-label-sm mb-6 bg-background group-hover:border-primary transition-colors">04</div>
<h4 class="font-label-sm text-label-sm font-bold text-primary mb-2">Guardian Analysis</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-sm">Security audit and dry run simulation.</p>
</div>
<!-- Step 5 -->
<div class="relative z-10 bg-surface-container-lowest pr-4 group">
<div class="w-12 h-12 border border-outline-variant flex items-center justify-center font-label-sm text-label-sm mb-6 bg-background group-hover:border-primary transition-colors">05</div>
<h4 class="font-label-sm text-label-sm font-bold text-primary mb-2">Explicit Confirmation</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-sm">Final human approval via zkLogin or wallet.</p>
</div>
</div>
</div>
</div>
</section>
<!-- Feature Spotlight (Bento) -->
<section class="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<div class="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-auto md:h-[800px]">
<div class="md:col-span-3 md:row-span-1 thin-border p-8 flex flex-col justify-between bg-surface-container-lowest">
<div>
<span class="material-symbols-outlined mb-4 text-primary">chat_bubble</span>
<h3 class="font-headline-lg text-headline-lg mb-2">Natural Language Chat</h3>
<p class="text-on-surface-variant">Type complex multi-protocol intents as easily as a text message.</p>
</div>
<div class="h-20 bg-background border border-outline-variant mt-8 flex items-center px-4">
<span class="mono-font text-xs text-primary/40">system: Waiting for user intent...</span>
</div>
</div>
<div class="md:col-span-3 md:row-span-1 thin-border p-8 flex flex-col justify-between bg-surface-container-low">
<div>
<span class="material-symbols-outlined mb-4 text-primary">analytics</span>
<h3 class="font-headline-lg text-headline-lg mb-2">Dry Run Simulation</h3>
<p class="text-on-surface-variant">See exactly how your balance changes before committing to the chain.</p>
</div>
<div class="flex gap-2 mt-8">
<div class="h-2 w-full bg-outline-variant"><div class="h-full bg-primary w-2/3"></div></div>
<span class="mono-font text-[10px]">67% SIM</span>
</div>
</div>
<div class="md:col-span-2 md:row-span-1 thin-border p-8 bg-surface-container-lowest">
<span class="material-symbols-outlined mb-4 text-primary">shield</span>
<h3 class="font-label-sm text-label-sm font-bold mb-4">Guardian Risk Report</h3>
<p class="text-on-surface-variant text-sm">AI-driven auditing for every transaction block.</p>
</div>
<div class="md:col-span-2 md:row-span-1 thin-border p-8 bg-surface-container-lowest">
<span class="material-symbols-outlined mb-4 text-primary">description</span>
<h3 class="font-label-sm text-label-sm font-bold mb-4">Human-readable PTB</h3>
<p class="text-on-surface-variant text-sm">No more hex. Read what your transaction actually does.</p>
</div>
<div class="md:col-span-2 md:row-span-1 thin-border p-8 bg-surface-container-lowest">
<span class="material-symbols-outlined mb-4 text-primary">key</span>
<h3 class="font-label-sm text-label-sm font-bold mb-4">zkLogin Onboarding</h3>
<p class="text-on-surface-variant text-sm">Connect using Google or Twitch without managing seeds.</p>
</div>
</div>
</section>
<!-- Security Section -->
<section class="py-24 bg-primary text-on-primary" id="security">
<div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-16">
<div class="flex-1">
<h2 class="font-headline-xl text-headline-xl mb-8">Clinical Security. Zero Blind Signing.</h2>
<ul class="space-y-6">
<li class="flex items-start gap-4">
<span class="material-symbols-outlined mt-1">check_circle</span>
<div>
<h4 class="font-label-sm text-label-sm font-bold">Local Key Management</h4>
<p class="opacity-70 text-sm">Your private keys never leave your device. Kura acts only as a secure interface generator.</p>
</div>
</li>
<li class="flex items-start gap-4">
<span class="material-symbols-outlined mt-1">check_circle</span>
<div>
<h4 class="font-label-sm text-label-sm font-bold">100% Active Signing</h4>
<p class="opacity-70 text-sm">Passive monitoring is not enough. Kura requires your signature for every state change.</p>
</div>
</li>
<li class="flex items-start gap-4">
<span class="material-symbols-outlined mt-1">check_circle</span>
<div>
<h4 class="font-label-sm text-label-sm font-bold">On-chain Logs</h4>
<p class="opacity-70 text-sm">All Kura interactions are logged via KuraLogger on Sui for transparent, immutable audit trails.</p>
</div>
</li>
</ul>
</div>
<div class="flex-1 w-full max-w-md aspect-square thin-border border-on-primary/30 p-12 flex items-center justify-center relative overflow-hidden">
<div class="absolute inset-0 opacity-10 flex flex-wrap gap-1 p-2">
<script>
                            for(let i=0; i<100; i++) document.write('<div class="w-8 h-8 border border-white"></div>');
                        </script>
</div>
<span class="material-symbols-outlined text-[120px]" style="font-variation-settings: 'FILL' 1">security</span>
</div>
</div>
</section>
<!-- Target Users -->
<section class="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<h2 class="font-headline-lg text-headline-lg mb-16 text-center">Built for the Sui ecosystem.</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div class="text-center p-8">
<div class="w-20 h-20 mx-auto mb-6 bg-surface-container-high flex items-center justify-center rounded-full">
<span class="material-symbols-outlined text-primary text-3xl">child_care</span>
</div>
<h4 class="font-label-sm text-label-sm font-bold mb-4 uppercase">Crypto Beginners</h4>
<p class="text-on-surface-variant text-sm">Fearless entry into DeFi. No technical jargon, just intent.</p>
</div>
<div class="text-center p-8">
<div class="w-20 h-20 mx-auto mb-6 bg-surface-container-high flex items-center justify-center rounded-full">
<span class="material-symbols-outlined text-primary text-3xl">trending_up</span>
</div>
<h4 class="font-label-sm text-label-sm font-bold mb-4 uppercase">Intermediate Users</h4>
<p class="text-on-surface-variant text-sm">Faster execution and protection against the latest protocol risks.</p>
</div>
<div class="text-center p-8">
<div class="w-20 h-20 mx-auto mb-6 bg-surface-container-high flex items-center justify-center rounded-full">
<span class="material-symbols-outlined text-primary text-3xl">code</span>
</div>
<h4 class="font-label-sm text-label-sm font-bold mb-4 uppercase">Sui Developers</h4>
<p class="text-on-surface-variant text-sm">Integrate Kura into your dApp to simplify the user journey.</p>
</div>
</div>
</section>
<!-- Metrics Dashboard -->
<section class="py-24 bg-surface-container-lowest border-y border-outline-variant">
<div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<div class="grid grid-cols-2 md:grid-cols-4 gap-gutter">
<div class="p-6 thin-border text-center">
<p class="font-headline-xl text-headline-xl mb-2">90%</p>
<p class="font-label-sm text-label-sm text-on-surface-variant">PARSE SUCCESS</p>
</div>
<div class="p-6 thin-border text-center">
<p class="font-headline-xl text-headline-xl mb-2">100%</p>
<p class="font-label-sm text-label-sm text-on-surface-variant">GUARDIAN CHECK</p>
</div>
<div class="p-6 thin-border text-center">
<p class="font-headline-xl text-headline-xl mb-2">&lt;10s</p>
<p class="font-label-sm text-label-sm text-on-surface-variant">LATENCY</p>
</div>
<div class="p-6 thin-border text-center">
<p class="font-headline-xl text-headline-xl mb-2">100%</p>
<p class="font-label-sm text-label-sm text-on-surface-variant">CONFIRM RATE</p>
</div>
</div>
</div>
</section>
<!-- Final CTA -->
<section class="py-32 px-margin-mobile md:px-margin-desktop text-center">
<div class="max-w-3xl mx-auto">
<h2 class="font-headline-xl text-headline-xl mb-8">DeFi should feel clear before it feels powerful.</h2>
<div class="flex flex-col md:flex-row gap-4 justify-center">
<button class="px-12 py-4 bg-primary text-on-primary font-label-sm text-label-sm font-bold glow-hover transition-all">Launch Kura</button>
<button class="px-12 py-4 border border-outline-variant text-primary font-label-sm text-label-sm font-bold hover:bg-surface-container-low transition-all">Read Architecture</button>
</div>
</div>
</section>
</main>
<!-- Footer Component -->
<footer class="bg-background border-t border-outline-variant">
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<div class="space-y-6">
<div class="flex items-center gap-2">
<img alt="KURA" class="h-10 w-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMcB0KUHf0-oxZbd76e8CMCjgXcIOumU8nlC95_PwTjpazqRSJhGRokQ2Dw9ZqTmKWC0hP5WGxYAC3Wgd2CNQtc8T8GBoTrtGBAqtdi5WkLWKj7RVyR1EklCFfN8aMUj6yNI-RRGuoHKzlT_lznDJNwykkFraH3TA2Ie2KGq3UFTQg-jAGPT1zWqjflXzct5GIxBcMX_4mG35lOnhkpSbG1VrLBJcdESFd_xAs1820FzNbMuQ4tiss6Tm0GXcvevHINub3szWGu9Mk"/>
<span class="font-headline-lg text-headline-lg text-primary font-bold tracking-tighter">KURA</span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant max-w-sm">Built for safer DeFi interactions on Sui. Secured by machine intelligence, confirmed by you.</p>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-8 opacity-50">
                    © 2024 KURA AI. SECURED BY SUI.
                </div>
</div>
<div class="grid grid-cols-2 md:grid-cols-3 gap-8">
<div>
<h5 class="font-label-sm text-label-sm font-bold text-primary mb-6 uppercase">Product</h5>
<ul class="space-y-4">
<li><a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a></li>
<li><a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Security Audit</a></li>
<li><a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Architecture</a></li>
</ul>
</div>
<div>
<h5 class="font-label-sm text-label-sm font-bold text-primary mb-6 uppercase">Company</h5>
<ul class="space-y-4">
<li><a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a></li>
<li><a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
</ul>
</div>
<div>
<h5 class="font-label-sm text-label-sm font-bold text-primary mb-6 uppercase">Social</h5>
<ul class="space-y-4">
<li><a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Discord</a></li>
<li><a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Twitter</a></li>
<li><a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Github</a></li>
</ul>
</div>
</div>
</div>
</footer>
<script>
        // Micro-interaction for the terminal cursor
        setInterval(() => {
            const cursor = document.querySelector('.terminal-cursor');
            if(cursor) {
                // Future enhancement: typing animation simulation
            }
        }, 3000);

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body></html>