"use client";

import { useCallback, useState, useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { FAUCET_MODULE_TARGET, getFaucetId } from "@/lib/services/faucet-config";

const COOLDOWN_SECONDS = 86_400;
const LS_KEY = "kura_faucet_claim";

function getLastClaimTime(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(LS_KEY);
  return raw ? Number(raw) : 0;
}

function setLastClaimTime() {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY, String(Date.now()));
  }
}

type ClaimStatus = "idle" | "loading" | "success" | "error";

export function useClaimUSDC() {
  const account = useCurrentAccount();
  const address = account?.address;
  const { mutate: signAndExecute, isPending, data } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();
  const faucetId = getFaucetId();

  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("idle");
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successDigest, setSuccessDigest] = useState<string | null>(null);

  const cooldownActive = cooldown > 0;

  useEffect(() => {
    if (!cooldownActive || cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((c) => (c - 1 > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownActive, cooldown]);

  useEffect(() => {
    const last = getLastClaimTime();
    if (last) {
      const elapsed = Math.floor((Date.now() - last) / 1000);
      const remaining = Math.max(0, COOLDOWN_SECONDS - elapsed);
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  // Watch for transaction success
  useEffect(() => {
    if (data?.digest && claimStatus === "loading") {
      setClaimStatus("success");
      setLastClaimTime();
      setCooldown(COOLDOWN_SECONDS);
      setSuccessDigest(data.digest);
      queryClient.invalidateQueries({ queryKey: ["kura", "balances"] });
      setTimeout(() => {
        setClaimStatus((s) => (s === "success" ? "idle" : s));
      }, 3000);
    }
  }, [data, claimStatus, queryClient]);

  const trySponsorFaucet = useCallback(async () => {
    if (!address) return;
    setError(null);
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Faucet failed");
      setClaimStatus("success");
      setLastClaimTime();
      setCooldown(COOLDOWN_SECONDS);
      setSuccessDigest(json.digest);
      queryClient.invalidateQueries({ queryKey: ["kura", "balances"] });
      setTimeout(() => setClaimStatus((s) => (s === "success" ? "idle" : s)), 3000);
    } catch (err) {
      setClaimStatus("error");
      const msg = err instanceof Error ? err.message : "Faucet failed";
      if (msg.includes("not configured") || msg.includes("FAUCET_SECRET_KEY")) {
        setError("Need SUI for gas. Get SUI from Sui Discord faucet first.");
      } else {
        setError(msg);
      }
      setTimeout(() => setClaimStatus("idle"), 2500);
    }
  }, [address, queryClient]);

  const claimUSDC = useCallback(() => {
    if (!address || cooldownActive || !faucetId) return;

    const last = getLastClaimTime();
    if (last && Date.now() - last < COOLDOWN_SECONDS * 1000) {
      const remaining = Math.ceil((COOLDOWN_SECONDS * 1000 - (Date.now() - last)) / 1000);
      setCooldown(remaining);
      setError("Cooldown active. Try again later.");
      return;
    }

    setClaimStatus("loading");
    setError(null);

    const tx = new Transaction();
    tx.moveCall({
      target: FAUCET_MODULE_TARGET,
      arguments: [
        tx.object(faucetId),
        tx.object("0x6"), // Clock
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onError: (err) => {
          // Fallback: try sponsor-backed faucet
          trySponsorFaucet();
        },
      }
    );
  }, [address, cooldownActive, faucetId, signAndExecute, trySponsorFaucet]);

  const formattedTime = (() => {
    const h = Math.floor(cooldown / 3600);
    const m = Math.floor((cooldown % 3600) / 60);
    const s = cooldown % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  })();

  return {
    claimUSDC,
    isPending,
    claimStatus,
    cooldown,
    cooldownActive,
    formattedTime,
    error,
    successDigest,
  };
}
