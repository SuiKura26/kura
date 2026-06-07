"use client";

import { useState } from "react";
import { Check, X, Info } from "lucide-react";
import { TransactionData } from "@/types/chat";
import { Language } from "@/hooks/useChat";
import { GuardianReport } from "./GuardianReport";

interface TransactionCardProps {
  data: TransactionData;
  language: Language;
}

export function TransactionCard({ data, language }: TransactionCardProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [acknowledgeRisk, setAcknowledgeRisk] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState("");

  const t = {
    id: {
      action: "Tindakan",
      estOutput: "Estimasi Diterima",
      steps: "Langkah-langkah",
      feeBreakdown: "Rincian Biaya",
      gasFee: "Biaya Gas",
      netOutput: "Output Bersih",
      confirmBtn: "Saya Paham & Eksekusi",
      cancelBtn: "Batal",
      successMsg: "Transaksi Berhasil Dikirim!",
      viewExplorer: "Lihat di Explorer",
      ackRisk: "Saya mengerti risiko ini",
      typeConfirm: "Ketik KONFIRMASI untuk melanjutkan",
    },
    en: {
      action: "Action",
      estOutput: "Estimated Output",
      steps: "Steps",
      feeBreakdown: "Fee Breakdown",
      gasFee: "Gas Fee",
      netOutput: "Net Output",
      confirmBtn: "I Understand & Execute",
      cancelBtn: "Cancel",
      successMsg: "Transaction Successfully Sent!",
      viewExplorer: "View in Explorer",
      ackRisk: "I understand this risk",
      typeConfirm: "Type CONFIRM to proceed",
    }
  };

  const text = t[language];
  const riskLevel = data.guardianReport?.riskLevel ?? 0;

  let canExecute = false;
  if (riskLevel <= 1) canExecute = true;
  else if (riskLevel === 2) canExecute = acknowledgeRisk;
  else if (riskLevel === 3) {
    const keyword = language === "id" ? "KONFIRMASI" : "CONFIRM";
    canExecute = typedConfirmation === keyword;
  }

  const handleExecute = () => {
    if (canExecute) {
      setConfirmed(true);
      // Simulate execution
      setTimeout(() => setExecuted(true), 1500);
    }
  };

  if (executed) {
    return (
      <div className="w-full max-w-sm rounded-xl border bg-card p-4 shadow-sm animate-in zoom-in-95">
        <div className="flex flex-col items-center justify-center space-y-3 py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="font-semibold text-lg">{text.successMsg}</h3>
          <p className="text-sm text-muted-foreground">Digest: 0x9f8...a1b2</p>
          <button className="text-sm text-primary hover:underline mt-2">
            {text.viewExplorer}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md rounded-xl border bg-card overflow-hidden shadow-sm animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {text.action}
          </span>
          <span className="text-sm font-medium bg-background px-2 py-1 rounded-md border">
            {data.action.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg sm:text-2xl font-bold tracking-tight">
            {data.amountIn} {data.tokenIn} <span className="text-muted-foreground font-normal">→</span> {data.tokenOut}
          </span>
          <span className="text-sm text-muted-foreground flex items-center mt-1">
            <Info className="w-3 h-3 mr-1 inline" />
            {text.estOutput}: ≈{data.estimatedOutput} {data.tokenOut}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4 border-b">
        <h4 className="text-sm font-semibold mb-3">{text.steps}</h4>
        <div className="space-y-3">
          {data.steps.map((step, idx) => (
            <div key={step.id} className="flex text-sm">
              <div className="mr-3 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  {idx + 1}
                </div>
                {idx !== data.steps.length - 1 && (
                  <div className="w-px h-full bg-border my-1" />
                )}
              </div>
              <p className="text-foreground pb-2">{step.description[language]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="p-4 bg-muted/20 border-b">
        <h4 className="text-sm font-semibold mb-2">{text.feeBreakdown}</h4>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{text.gasFee}</span>
          <span className="font-mono">{data.gasEstimate} SUI</span>
        </div>
        <div className="flex justify-between text-sm font-medium pt-1 border-t mt-2">
          <span>{text.netOutput}</span>
          <span className="font-mono text-primary">≈{data.estimatedOutput} {data.tokenOut}</span>
        </div>
      </div>

      {/* Guardian Report */}
      {data.guardianReport && (
        <div className="px-4 pb-2">
          <GuardianReport report={data.guardianReport} language={language} />
        </div>
      )}

      {/* Risk Acknowledgement (if needed) */}
      {riskLevel === 2 && (
        <div className="px-4 py-2 flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="ack" 
            checked={acknowledgeRisk} 
            onChange={(e) => setAcknowledgeRisk(e.target.checked)}
            className="rounded text-primary focus:ring-primary h-4 w-4"
          />
          <label htmlFor="ack" className="text-sm text-foreground cursor-pointer">
            {text.ackRisk}
          </label>
        </div>
      )}
      
      {riskLevel === 3 && (
        <div className="px-4 py-2">
          <input 
            type="text" 
            placeholder={text.typeConfirm}
            value={typedConfirmation}
            onChange={(e) => setTypedConfirmation(e.target.value)}
            className="w-full text-sm p-2 rounded-md border bg-background focus:ring-1 focus:ring-red-500 outline-none"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex gap-3">
        <button className="flex-1 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent text-sm font-medium transition-colors">
          {text.cancelBtn}
        </button>
        <button 
          onClick={handleExecute}
          disabled={!canExecute || confirmed}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !canExecute 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : riskLevel === 3 
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {confirmed ? (language === "id" ? "Memproses..." : "Processing...") : text.confirmBtn}
        </button>
      </div>
    </div>
  );
}
