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
          preference: "all", 
        },
        // Kita gunakan Type Casting 'as any' secara spesifik di sini 
        // agar ESLint & TypeScript membiarkan walletConnectProjectId lewat.
        ...({ walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID } as any),
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
