"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
        },
        wallet: {
          display: "modal",
          // Sekarang kita aktifkan kembali karena Project ID sudah ada di Vercel
          walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
          preference: "all", 
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
