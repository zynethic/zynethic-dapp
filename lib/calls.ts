import { ethers } from 'ethers';

export const ZNTC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ZNTC_CONTRACT || "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b";

// Public RPC Base Mainnet agar data publik tetap ter-load tanpa extension wallet
const BASE_PUBLIC_RPC = "https://mainnet.base.org";

const MINIMAL_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)"
];

// Address pembakaran standar (Dead Address)
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dead";

/**
 * Mendapatkan Provider secara dinamis:
 * Menggunakan window.ethereum jika ada, atau fallback ke Public RPC Base.
 */
const getProvider = () => {
  if (typeof window !== 'undefined' && (window as unknown as { ethereum?: ethers.Eip1193Provider }).ethereum) {
    return new ethers.BrowserProvider((window as unknown as { ethereum: ethers.Eip1193Provider }).ethereum);
  }
  return new ethers.JsonRpcProvider(BASE_PUBLIC_RPC);
};

export const getRealBalance = async (userAddress: string): Promise<number> => {
  if (!userAddress || !ethers.isAddress(userAddress)) return 0;

  try {
    const provider = getProvider();
    const contract = new ethers.Contract(ZNTC_CONTRACT_ADDRESS, MINIMAL_ABI, provider);
    
    const [balance, decimals] = await Promise.all([
      contract.balanceOf(userAddress),
      contract.decimals().catch(() => 18) // Default desimal token ERC-20
    ]);

    return parseFloat(ethers.formatUnits(balance, decimals));
  } catch (error) {
    console.error("Error fetching real balance:", error);
    return 0;
  }
};

export const fetchLivePrice = async (): Promise<string> => {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ZNTC_CONTRACT_ADDRESS}`);
    const data = await res.json();
    return data.pairs?.[0]?.priceUsd || "0.0000";
  } catch (error) {
    console.error("DexScreener Fetch Error:", error);
    return "0.0000";
  }
};

export const getTotalBurned = async (): Promise<number> => {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(ZNTC_CONTRACT_ADDRESS, MINIMAL_ABI, provider);
    
    const [burnBalance, decimals] = await Promise.all([
      contract.balanceOf(DEAD_ADDRESS),
      contract.decimals().catch(() => 18)
    ]);

    return parseFloat(ethers.formatUnits(burnBalance, decimals));
  } catch (error) {
    console.error("Error fetching burn data:", error);
    return 4000000; // Fallback jika koneksi RPC terputus
  }
};
