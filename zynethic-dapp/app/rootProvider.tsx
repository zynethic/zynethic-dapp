"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      // Gunakan API Key dari Coinbase CDP Anda
      apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
        },
        wallet: {
          display: "modal",
          // Masukkan Project ID Reown yang Anda dapatkan tadi di sini
          walletConnectProjectId: "4b7d76f778e53c6d1848be8b3566f6e7",
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
