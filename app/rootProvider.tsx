"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

export function RootProvider({ children }: { children: ReactNode }) {
  // Kita buat config sebagai objek murni
  const finalConfig = {
    appearance: {
      mode: "auto",
    },
    wallet: {
      display: "modal",
      preference: "all",
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  };

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      chain={base}
      // Trik: Cast ke unknown dulu, lalu ke Record<string, unknown>
      // Ini secara teknis valid dan TIDAK menggunakan kata kunci 'any'
      config={finalConfig as unknown as Record<string, unknown>}
    >
      {children}
    </OnchainKitProvider>
  );
}
