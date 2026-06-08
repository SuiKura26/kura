"use client";

import { LoadingStep, Language } from "@/hooks/useChat";
import { CheckCircle2, CircleDashed, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface LoadingStepsProps {
  step: LoadingStep;
  language: Language;
}

export function LoadingSteps({ step, language }: LoadingStepsProps) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    // Reset slow state when step changes
    setIsSlow(false);
    
    // Set a timeout to show "taking longer than usual" message after 15 seconds
    const timeout = setTimeout(() => {
      setIsSlow(true);
    }, 15000);

    return () => clearTimeout(timeout);
  }, [step]);

  if (!step) return null;

  const t = {
    id: {
      parsing: "Memahami permintaan Anda...",
      routing: "Mencari rute pool terbaik...",
      building: "Meracik transaksi...",
      simulating: "Menyimulasikan transaksi...",
      guardian: "Mengecek risiko dengan Guardian...",
      slow: "Memproses lebih lama dari biasanya...",
    },
    en: {
      parsing: "Parsing your request...",
      routing: "Searching for the best pool route...",
      building: "Building transaction...",
      simulating: "Simulating transaction...",
      guardian: "Checking risks with Guardian...",
      slow: "Taking longer than usual to process...",
    }
  };

  const currentLabel = isSlow ? t[language].slow : t[language][step as keyof typeof t["id"]];

  return (
    <div className="flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 justify-start">
      <div className="flex max-w-[85%] flex-row">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1 mr-3">
          <div className="w-8 h-8 flex items-center justify-center">
             <Image
                src="/kura-logo-dark-mode.png"
                alt="Kura"
                width={32}
                height={32}
                className="hidden dark:block object-contain"
              />
              <Image
                src="/kura-logo-light-mode.png"
                alt="Kura"
                width={32}
                height={32}
                className="block dark:hidden object-contain"
              />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className={`flex items-center space-x-3 p-3 rounded-xl border text-sm text-foreground transition-colors duration-500 ${isSlow ? 'bg-amber-500/10 border-amber-500/20' : 'bg-muted/30'}`}>
            {isSlow ? (
              <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
            <span className={`font-medium animate-pulse ${isSlow ? 'text-amber-500/90' : 'text-muted-foreground'}`}>{currentLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
