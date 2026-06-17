"use client";

import { useState } from "react";
import { Check, X, Info } from "lucide-react";
import { TransactionData } from "@/types/chat";
import { Language } from "@/hooks/useChat";
import { GuardianReport } from "./GuardianReport";
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

interface TransactionCardProps {
  data: TransactionData;
  language: Language;
  onCancel?: () => void;
}

export function TransactionCard({ data, language, onCancel }: TransactionCardProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [localIsCancelled, setLocalIsCancelled] = useState(false);
  const [executionStep, setExecutionStep] = useState(0); // 0: initial, 1: report, 2: main tx, 3: log, 4: done
  const [txDigest, setTxDigest] = useState("");
  const [acknowledgeRisk, setAcknowledgeRisk] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState("");
  
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const account = useCurrentAccount();

  const executeTx = (tx: Transaction) => new Promise<any>((resolve, reject) => {
    signAndExecuteTransaction({ transaction: tx }, { onSuccess: resolve, onError: reject });
  });

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
      step1: "Langkah 1/3: Menyimpan Laporan AI...",
      step2: "Langkah 2/3: Menyetujui & Mengeksekusi...",
      step3: "Langkah 3/3: Mencatat Hasil Transaksi...",
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
      step1: "Step 1/3: Saving AI Report...",
      step2: "Step 2/3: Approving & Executing...",
      step3: "Step 3/3: Logging Result...",
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

  const handleExecute = async () => {
    if (!canExecute || !data.txBytes || !data.walrusData || !data.kuraLoggerPackageId) {
      if (!data.txBytes) alert(language === "id" ? "Data transaksi tidak valid." : "Invalid transaction data.");
      if (!data.walrusData) alert("Walrus data missing");
      return;
    }

    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    setConfirmed(true);
    const walrus = data.walrusData;

    try {
      // ----------------------------------------------------
      // STEP 1: Emit Guardian Report
      // ----------------------------------------------------
      setExecutionStep(1);
      const reportTx = new Transaction();
      
      reportTx.moveCall({
        target: `${data.kuraLoggerPackageId}::logger::emit_guardian_report`,
        arguments: [
          reportTx.pure.address(account.address),
          reportTx.pure.vector('u8', walrus.intentHash),
          reportTx.pure.u8(walrus.riskLevel),
          reportTx.pure.u64(walrus.slippageBps),
          reportTx.pure.u64(walrus.poolLiqUsd ?? 0),
          reportTx.pure.vector('u8', walrus.reportHash),
          reportTx.pure.string(walrus.intentBlobId),
          reportTx.pure.string(walrus.reportBlobId),
          reportTx.pure.u64(Date.now()),
        ]
      });

      const step1Result = await executeTx(reportTx);
      
      // Fetch events to get the report_id
      const txResult = await suiClient.waitForTransaction({
        digest: step1Result.digest,
        options: { showEvents: true }
      });

      const event = txResult.events?.find(e => e.type.includes("::logger::GuardianReportCreatedEvent"));
      if (!event) throw new Error("Report creation event not found");
      const reportId = (event.parsedJson as any).report_id;

      // Get initial shared version
      const objData = await suiClient.getObject({ id: reportId, options: { showOwner: true } });
      const initialSharedVersion = (objData.data?.owner as any)?.Shared?.initial_shared_version;
      if (!initialSharedVersion) throw new Error("Could not find initial shared version for report");

      // ----------------------------------------------------
      // STEP 2: Main Execution (Swap/Stake) + Confirm Intent
      // ----------------------------------------------------
      setExecutionStep(2);
      const mainTxStr = Buffer.from(data.txBytes, 'base64').toString('utf8');
      const mainTx = Transaction.from(mainTxStr);

      // Append confirm_intent
      mainTx.moveCall({
        target: `${data.kuraLoggerPackageId}::logger::confirm_intent`,
        arguments: [
          mainTx.sharedObjectRef({
            objectId: reportId,
            initialSharedVersion,
            mutable: true
          }),
          mainTx.pure.u64(Date.now())
        ]
      });

      const step2Result = await executeTx(mainTx);
      const mainDigest = step2Result.digest;

      // ----------------------------------------------------
      // STEP 3: Log Execution
      // ----------------------------------------------------
      setExecutionStep(3);
      
      const bs58 = (await import('bs58')).default;
      const digestBytes = Array.from(bs58.decode(mainDigest));
      
      const logTx = new Transaction();
      logTx.moveCall({
        target: `${data.kuraLoggerPackageId}::logger::log_execution`,
        arguments: [
          logTx.sharedObjectRef({
            objectId: reportId,
            initialSharedVersion,
            mutable: false // read-only reference for logging
          }),
          logTx.pure.vector('u8', digestBytes),
          logTx.pure.u64(Date.now()), // confirmed_at (approx)
          logTx.pure.u64(Date.now()), // executed_at
          logTx.pure.bool(true) // success
        ]
      });

      await executeTx(logTx);

      setTxDigest(mainDigest);
      setExecutionStep(4);

    } catch (e) {
      console.error(e);
      setConfirmed(false);
      setExecutionStep(0);
      alert(language === "id" ? "Transaksi gagal atau dibatalkan." : "Transaction failed or cancelled.");
    }
  };

  const isCancelled = data.isCancelled || localIsCancelled;

  const handleCancel = () => {
    setLocalIsCancelled(true);
    if (onCancel) onCancel();
  };

  if (isCancelled) {
    return (
      <div className="w-full max-w-sm rounded-xl border border-red-500/20 bg-card p-4 shadow-sm opacity-60">
        <div className="flex flex-col items-center justify-center space-y-2 py-2 text-center">
          <div className="rounded-full bg-red-500/10 p-2">
            <X className="h-5 w-5 text-red-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-500">
              {language === "id" ? "Transaksi Dibatalkan" : "Transaction Cancelled"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (executionStep === 4) {
    return (
      <div className="w-full max-w-sm rounded-xl border bg-card p-4 shadow-sm animate-in zoom-in-95">
        <div className="flex flex-col items-center justify-center space-y-3 py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="font-semibold text-lg">{text.successMsg}</h3>
          <p className="text-sm text-muted-foreground break-all px-2">Digest: {txDigest}</p>
          <a 
            href={`https://suiscan.xyz/${process.env.NEXT_PUBLIC_SUI_NETWORK || "mainnet"}/tx/${txDigest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2"
          >
            {text.viewExplorer}
          </a>
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
          {data.action === "swap" ? (
            <>
              <span className="text-lg sm:text-2xl font-bold tracking-tight">
                {data.amountIn} {data.tokenIn} <span className="text-muted-foreground font-normal">→</span> {data.tokenOut}
              </span>
              <span className="text-sm text-muted-foreground flex items-center mt-1">
                <Info className="w-3 h-3 mr-1 inline" />
                {text.estOutput}: ≈{data.estimatedOutput} {data.tokenOut}
              </span>
            </>
          ) : data.action === "transfer" ? (
            <span className="text-lg sm:text-2xl font-bold tracking-tight capitalize">
              {language === "id" ? "Kirim" : "Transfer"} {data.amountIn} {data.tokenIn}
            </span>
          ) : data.action === "stake" ? (
            <span className="text-lg sm:text-2xl font-bold tracking-tight capitalize">
              Stake {data.amountIn} {data.tokenIn}
            </span>
          ) : (
            <span className="text-lg sm:text-2xl font-bold tracking-tight capitalize">
              {data.action} {data.amountIn} {data.tokenIn}
            </span>
          )}
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
        {data.action === "swap" && (
          <div className="flex justify-between text-sm font-medium pt-1 border-t mt-2">
            <span>{text.netOutput}</span>
            <span className="font-mono text-primary">≈{data.estimatedOutput} {data.tokenOut}</span>
          </div>
        )}
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
        <button 
          onClick={handleCancel}
          disabled={confirmed}
          className="flex-1 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {text.cancelBtn}
        </button>
        <button 
          onClick={handleExecute}
          disabled={!canExecute || confirmed}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !canExecute || confirmed
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : riskLevel === 3 
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {executionStep === 1 ? text.step1 :
           executionStep === 2 ? text.step2 :
           executionStep === 3 ? text.step3 :
           text.confirmBtn}
        </button>
      </div>
    </div>
  );
}
