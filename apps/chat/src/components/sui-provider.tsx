"use client";

import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "@mysten/dapp-kit/dist/index.css";

const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://fullnode.testnet.sui.io:443", network: "testnet" as any },
  mainnet: { url: "https://fullnode.mainnet.sui.io:443", network: "mainnet" as any },
});

// Read network from env var, default to mainnet for production
const defaultNetwork = (process.env.NEXT_PUBLIC_SUI_NETWORK as "testnet" | "mainnet") || "mainnet";

export function SuiProvider({ children }: { children: React.ReactNode }) {
  // Use state to avoid sharing the query client across requests in SSR
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={defaultNetwork}>
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
