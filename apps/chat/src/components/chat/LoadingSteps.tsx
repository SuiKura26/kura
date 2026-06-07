"use client";

import { LoadingStep, Language } from "@/hooks/useChat";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

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

  const steps = [
    { id: "parsing", label: t[language].parsing },
    { id: "routing", label: t[language].routing },
    { id: "building", label: t[language].building },
    { id: "simulating", label: t[language].simulating },
    { id: "guardian", label: t[language].guardian },
  ];

  const currentIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="flex flex-col space-y-3 p-4 bg-muted/30 rounded-xl border w-fit animate-in fade-in zoom-in-95 duration-300">
      {steps.map((s, idx) => {
        const isPast = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isFuture = idx > currentIndex;

        return (
          <div 
            key={s.id} 
            className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
              isPast ? "text-green-500" : isCurrent ? "text-primary font-medium" : "text-muted-foreground opacity-50"
            }`}
          >
            {isPast && <CheckCircle2 className="w-4 h-4" />}
            {isCurrent && <Loader2 className="w-4 h-4 animate-spin" />}
            {isFuture && <CircleDashed className="w-4 h-4" />}
            
            <span>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
