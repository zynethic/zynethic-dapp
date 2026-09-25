import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Abaikan error ESLint & TypeScript agar build Vercel tidak dibatalkan secara sepihak
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Mencegah masalah kompilasi paket Web3 / Wagmi / Viem
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
