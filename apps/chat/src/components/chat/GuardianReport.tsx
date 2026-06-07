"use client";

import { AlertTriangle, ShieldCheck, ShieldAlert, AlertCircle } from "lucide-react";
import { GuardianReportData } from "@/types/chat";
import { Language } from "@/hooks/useChat";

interface GuardianReportProps {
  report: GuardianReportData;
  language: Language;
}

export function GuardianReport({ report, language }: GuardianReportProps) {
  const { riskLevel, slippageBps, poolLiqUsd, explanation, recommendation } = report;

  const getRiskConfig = () => {
    switch (riskLevel) {
      case 0:
        return {
          icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
          title: language === "id" ? "Risiko Rendah" : "Low Risk",
          borderColor: "border-green-500",
          bgColor: "bg-green-500/10",
          textColor: "text-green-500"
        };
      case 1:
        return {
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
          title: language === "id" ? "Risiko Sedang" : "Medium Risk",
          borderColor: "border-yellow-500",
          bgColor: "bg-yellow-500/10",
          textColor: "text-yellow-500"
        };
      case 2:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
          title: language === "id" ? "Risiko Tinggi" : "High Risk",
          borderColor: "border-orange-500",
          bgColor: "bg-orange-500/10",
          textColor: "text-orange-500"
        };
      case 3:
        return {
          icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
          title: language === "id" ? "Risiko Kritis" : "Critical Risk",
          borderColor: "border-red-500",
          bgColor: "bg-red-500/10",
          textColor: "text-red-500"
        };
    }
  };

  const config = getRiskConfig();
  const slippagePercent = (slippageBps / 100).toFixed(2);
  const formattedLiq = poolLiqUsd !== null 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(poolLiqUsd)
    : "Unknown";

  return (
    <div className={`mt-4 p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center space-x-2 mb-2">
        {config.icon}
        <h4 className={`font-semibold ${config.textColor}`}>{config.title}</h4>
      </div>
      
      <p className="text-sm text-foreground mb-3">
        {explanation[language]}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="p-2 rounded bg-background/50">
          <span className="text-muted-foreground block mb-1">
            {language === "id" ? "Estimasi Slippage" : "Est. Slippage"}
          </span>
          <span className="font-mono">{slippagePercent}%</span>
        </div>
        <div className="p-2 rounded bg-background/50">
          <span className="text-muted-foreground block mb-1">
            {language === "id" ? "Likuiditas Pool" : "Pool Liquidity"}
          </span>
          <span className="font-mono">{formattedLiq}</span>
        </div>
      </div>

      <div className="text-sm text-foreground italic border-t border-border/50 pt-2 mt-2">
        <strong>{language === "id" ? "Rekomendasi Guardian: " : "Guardian Recommendation: "}</strong>
        {recommendation[language]}
      </div>
    </div>
  );
}
