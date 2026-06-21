"use client";

import { useClaimUSDC } from "@/hooks/useClaimUSDC";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";

interface FaucetButtonProps {
  variant?: "header" | "compact";
}

export function FaucetButton({ variant = "header" }: FaucetButtonProps) {
  const account = useCurrentAccount();
  const {
    claimUSDC,
    isPending,
    claimStatus,
    cooldownActive,
    formattedTime,
    error,
  } = useClaimUSDC();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !account) return null;

  const isDisabled = isPending || claimStatus === "loading" || cooldownActive;

  const statusLabel =
    claimStatus === "loading"
      ? "Claiming..."
      : claimStatus === "success"
      ? "Done!"
      : claimStatus === "error"
      ? "Retry"
      : cooldownActive
      ? formattedTime
      : "1000 USDC";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .faucet-pill {
            width: 165px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 10px;
            background-color: #ffffff;
            border-radius: 12px;
            color: rgb(19, 19, 19);
            font-weight: 600;
            font-size: 13px;
            border: 1px solid #e5e5e5;
            position: relative;
            cursor: pointer;
            transition-duration: .2s;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.116);
            padding-left: 8px;
            transition-duration: .5s;
          }
          .faucet-pill:hover {
            background-color: #f5f5f5;
            transition-duration: .5s;
          }
          .faucet-pill:active {
            transform: scale(0.97);
            transition-duration: .2s;
          }
          .faucet-pill:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .faucet-pill:hover .faucet-svg-icon {
            transform: rotate(250deg);
            transition-duration: 1.5s;
          }
          .faucet-svg-icon {
            height: 25px;
            transition-duration: 1.5s;
          }
          .faucet-svg-icon path {
            fill: rgb(19, 19, 19);
          }
          .faucet-pill.success {
            background-color: rgb(34, 197, 94);
            color: white;
          }
          .faucet-pill.success .faucet-svg-icon path {
            fill: white;
          }
          .faucet-pill.error {
            background-color: rgb(239, 68, 68);
            color: white;
          }
          .faucet-pill.error .faucet-svg-icon path {
            fill: white;
          }
        `,
        }}
      />
      <button
        onClick={claimUSDC}
        disabled={isDisabled}
        className={`faucet-pill ${claimStatus === "success" ? "success" : ""} ${
          claimStatus === "error" ? "error" : ""
        }`}
        title={cooldownActive ? `Next claim in ${formattedTime}` : "Claim 1000 Mock USDC"}
      >
        {/* Droplet SVG Icon */}
        <svg
          className="faucet-svg-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C12 2 5 10 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 10 12 2 12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18C13.6569 18 15 16.6569 15 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>{statusLabel}</span>
      </button>
      {error && (
        <p className="text-[10px] text-red-500 text-center mt-1 leading-tight">
          {error}
        </p>
      )}
    </>
  );
}
