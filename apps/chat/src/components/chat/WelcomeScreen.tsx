"use client";

import { Language } from "@/hooks/useChat";
import Image from "next/image";

interface WelcomeScreenProps {
  language: Language;
  onSuggestionClick: (suggestion: string) => void;
}

export function WelcomeScreen({ language, onSuggestionClick }: WelcomeScreenProps) {
  const t = {
    id: {
      title: "Apa yang ingin Anda lakukan hari ini?",
      subtitle: "Kura, Intent Engine berbasis AI yang melindungi DeFi Anda di Sui.",
      suggestions: [
        "Tukar 100 USDC ke SUI",
        "Stake 50 SUI di validator",
        "Cek saldo wallet saya",
        "Swap 500 SUI ke MEME (High Risk)"
      ]
    },
    en: {
      title: "What would you like to do today?",
      subtitle: "Kura, the AI-based Intent Engine protecting your DeFi on Sui.",
      suggestions: [
        "Swap 100 USDC to SUI",
        "Stake 50 SUI with a validator",
        "Check my wallet balance",
        "Swap 500 SUI to MEME (High Risk)"
      ]
    }
  };

  const text = t[language];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 pb-44 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center space-y-4">
        {/* Placeholder for Logo, since we'll configure next/image to allow local static or just use img for simplicity */}
        <div className="w-24 h-24 flex items-center justify-center">
          <Image
            src="/kura-logo-dark-mode.png"
            alt="Kura Logo"
            width={96}
            height={96}
            className="hidden dark:block object-contain"
          />
          <Image
            src="/kura-logo-light-mode.png"
            alt="Kura Logo"
            width={96}
            height={96}
            className="block dark:hidden object-contain"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-foreground">
          {text.title}
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          {text.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {text.suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-4 border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground text-left transition-colors duration-200"
          >
            <span className="text-sm font-medium">{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
