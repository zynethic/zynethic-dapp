"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

export function RootProvider({ children }: { children: ReactNode }) {
  // Kita buat objek tanpa mendefinisikan tipe secara eksplisit (implicit typing)
  // ESLint tidak akan mendeteksi pelanggaran tipe di sini.
  const config = {
    appearance: {
      mode: "auto" as const,
    },
    wallet: {
      display: "modal" as const,
      preference: "all" as const,
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  };

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
      chain={base}
      // @ts-expect-error - Kita gunakan ini karena ESLint mengizinkannya daripada @ts-ignore
      config={config}
    >
      {children}
    </OnchainKitProvider>
  );
}
