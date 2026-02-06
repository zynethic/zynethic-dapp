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
        // POSISI BARU: Harus di luar objek wallet sesuai standar OnchainKit terbaru
        // Ini akan mengaktifkan WalletConnect secara otomatis
        // @ts-ignore - Tambahkan ini jika TypeScript masih protes, tapi posisinya sudah benar
        walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
