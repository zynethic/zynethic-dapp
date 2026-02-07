'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ZNTC_CONTRACT_ADDRESS } from '@/lib/calls';

interface LeaderboardProps {
  isConnected: boolean;
  walletAddress: string;
  userBalance: number;
}

export default function Leaderboard({ isConnected, walletAddress, userBalance }: LeaderboardProps) {
  const [topHolders, setTopHolders] = useState<any[]>([]);

  const fetchLeaderboard = async () => {
    try {
      // Mengambil API Key dari Environment Variable yang Anda pasang di Vercel
      const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
      
      if (!BASESCAN_API_KEY) {
        console.warn("Basescan API Key is missing in environment variables.");
        return;
      }

      const response = await fetch(
        `https://api.basescan.org/api?module=token&action=tokenholderlist&contractaddress=${ZNTC_CONTRACT_ADDRESS}&page=1&offset=10&apikey=${BASESCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        setTopHolders(data.result.map((holder: any) => ({
          addr: holder.TokenHolderAddress,
          balance: parseFloat(ethers.formatUnits(holder.TokenHolderQuantity, 18)),
          status: parseFloat(ethers.formatUnits(holder.TokenHolderQuantity, 18)) > 1000000 ? 'WHALE' : 'HOLDER'
        })));
      }
    } catch (e) {
      console.error("Leaderboard Sync Error:", e);
    }
  };

  useEffect(() => { 
    fetchLeaderboard(); 
  }, []);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3><i className="fa-solid fa-crown" style={{ color: 'var(--base-glow)' }}></i> ZYNETHIC Elite</h3>
        <div style={{ fontSize: '0.6rem', color: '#00ff88', border: '1px solid #00ff88', padding: '3px 10px', borderRadius: '20px' }}>
          <span className="live-dot"></span> BASESCAN LIVE
        </div>
      </div>
      <table className="ai-table">
        <thead>
          <tr>
            <th>RANK</th>
            <th>WALLET</th>
            <th>BALANCE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {/* Baris User (Tampil jika Wallet Terkoneksi) */}
          {isConnected && (
            <tr style={{ background: 'rgba(0, 82, 255, 0.1)', borderLeft: '4px solid var(--base-glow)' }}>
              <td><i className="fa-solid fa-user-shield"></i></td>
              <td>{walletAddress.substring(0,6)}...{walletAddress.substring(38)}</td>
              <td style={{ fontWeight: 800 }}>{userBalance.toLocaleString()}</td>
              <td style={{ color: 'var(--base-glow)' }}>YOU</td>
            </tr>
          )}

          {/* Data Holder dari Basescan */}
          {topHolders.length > 0 ? (
            topHolders.map((holder, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td style={{ fontFamily: 'monospace', opacity: 0.7 }}>
                  {holder.addr.substring(0,6)}...{holder.addr.substring(38)}
                </td>
                <td>{holder.balance.toLocaleString()}</td>
                <td>
                  <span style={{ 
                    fontSize: '0.6rem', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    border: '1px solid ' + (holder.status === 'WHALE' ? 'var(--base-glow)' : '#333'), 
                    color: holder.status === 'WHALE' ? 'var(--base-glow)' : '#94a3b8' 
                  }}>
                    {holder.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                <i className="fa-solid fa-spinner fa-spin"></i> Retrieving On-chain Data...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
