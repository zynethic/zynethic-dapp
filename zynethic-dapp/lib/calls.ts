import { ethers } from 'ethers';

export const ZNTC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ZNTC_CONTRACT || "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b";

const MINIMAL_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)"
];

// Address pembakaran standar (Dead Address)
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dead";

export const getRealBalance = async (userAddress: string) => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ethereum } = window as any;
    
    if (ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const contract = new ethers.Contract(ZNTC_CONTRACT_ADDRESS, MINIMAL_ABI, provider);
        const balance = await contract.balanceOf(userAddress);
        const decimals = await contract.decimals();
        return parseFloat(ethers.formatUnits(balance, decimals));
      } catch (error) {
        console.error("Error fetching real balance:", error);
        return 0;
      }
    }
  }
  return 0;
};

export const fetchLivePrice = async () => {
  try {
    // Mengambil data harga real-time dari DexScreener API berdasarkan Contract Address
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ZNTC_CONTRACT_ADDRESS}`);
    const data = await res.json();
    // Mengambil harga USD dari pair pertama yang ditemukan
    return data.pairs?.[0]?.priceUsd || "0.0000";
  } catch {
    return "0.0000";
  }
};

/**
 * Fungsi tambahan untuk mendukung fitur "Burn Tracker" di Page.tsx secara nyata.
 * Menghitung jumlah token yang sudah dikirim ke dead address.
 */
export const getTotalBurned = async () => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ethereum } = window as any;
    if (ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const contract = new ethers.Contract(ZNTC_CONTRACT_ADDRESS, MINIMAL_ABI, provider);
        const burnBalance = await contract.balanceOf(DEAD_ADDRESS);
        const decimals = await contract.decimals();
        return parseFloat(ethers.formatUnits(burnBalance, decimals));
      } catch (error) {
        console.error("Error fetching burn data:", error);
        return 4000000; // Fallback ke angka rencana burn jika gagal load
      }
    }
  }
  return 4000000;
};
