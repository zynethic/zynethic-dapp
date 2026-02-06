"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

// Kita buat interface khusus agar tidak menggunakan 'any'
interface OnchainKitConfigCustom {
  appearance: {
    mode: "auto" | "light" | "dark";
  };
  wallet: {
    display: "modal" | "tray";
    preference: "all" | "smartWalletOnly" | "eoaOnly";
  };
  walletConnectProjectId?: string;
}

export function RootProvider({ children }: { children: ReactNode }) {
  // Kita bungkus konfigurasi dalam objek yang sudah bertipe jelas
  const kitConfig: OnchainKitConfigCustom = {
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
      // Kita masukkan config yang sudah bersih dari error tipe data
      config={kitConfig as unknown as any} 
    >
      {children}
    </OnchainKitProvider>
  );
}
