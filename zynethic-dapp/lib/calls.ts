// lib/calls.ts
import { ethers } from 'ethers';

// Gunakan Environment Variables untuk keamanan (Setting di Vercel)
export const ZNTC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ZNTC_CONTRACT || "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b";

// ABI Minimal untuk membaca saldo (ERC-20)
const MINIMAL_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export const getRealBalance = async (userAddress: string) => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const contract = new ethers.Contract(ZNTC_CONTRACT_ADDRESS, MINIMAL_ABI, provider);
      const balance = await contract.balanceOf(userAddress);
      const decimals = await contract.decimals();
      return parseFloat(ethers.formatUnits(balance, decimals));
    } catch (error) {
      console.error("Error fetching real balance:", error);
      return 0;
    }
  }
  return 0;
};

export const fetchLivePrice = async () => {
  try {
    // Menggunakan API CoinGecko atau DexScreener (Base Network)
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ZNTC_CONTRACT_ADDRESS}`);
    const data = await res.json();
    return data.pairs?.[0]?.priceUsd || "0.0000";
  } catch {
    return "0.0000";
  }
};
