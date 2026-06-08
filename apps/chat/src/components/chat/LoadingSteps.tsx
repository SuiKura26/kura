"use client";

import { LoadingStep, Language } from "@/hooks/useChat";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import Image from "next/image";

interface LoadingStepsProps {
  step: LoadingStep;
  language: Language;
}

export function LoadingSteps({ step, language }: LoadingStepsProps) {
  if (!step) return null;

  const t = {
    id: {
      parsing: "Memahami permintaan Anda...",
      routing: "Mencari rute pool terbaik...",
      building: "Meracik transaksi...",
      simulating: "Menyimulasikan transaksi...",
      guardian: "Mengecek risiko dengan Guardian...",
    },
    en: {
      parsing: "Parsing your request...",
      routing: "Searching for the best pool route...",
      building: "Building transaction...",
      simulating: "Simulating transaction...",
      guardian: "Checking risks with Guardian...",
    }
  };

  const currentLabel = t[language][step as keyof typeof t["id"]];

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
          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl border text-sm text-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground font-medium animate-pulse">{currentLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
