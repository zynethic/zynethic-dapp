'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ZNTC_CONTRACT_ADDRESS } from '@/lib/calls';
import styles from './leaderboard.module.css';

interface LeaderboardProps {
  isConnected: boolean;
  walletAddress: string;
  userBalance: number;
}

interface HolderData {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
}

export default function Leaderboard({ isConnected, walletAddress, userBalance }: LeaderboardProps) {
  const [topHolders, setTopHolders] = useState<{ addr: string; balance: number; status: string }[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;

      if (!BASESCAN_API_KEY) {
        console.warn('Basescan API Key is missing in environment variables.');
        return;
      }

      const response = await fetch(
        `https://api.basescan.org/api?module=token&action=tokenholderlist&contractaddress=${ZNTC_CONTRACT_ADDRESS}&page=1&offset=10&apikey=${BASESCAN_API_KEY}`
      );

      const data = await response.json();

      if (data.status === '1' && data.result) {
        setTopHolders(
          data.result.map((holder: HolderData) => {
            const balanceNum = parseFloat(ethers.formatUnits(holder.TokenHolderQuantity, 18));
            return {
              addr: holder.TokenHolderAddress,
              balance: balanceNum,
              status: balanceNum > 1000000 ? 'WHALE' : 'HOLDER',
            };
          })
        );
      }
    } catch (e) {
      console.error('Leaderboard Sync Error:', e);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="card">
      <div className={styles.header}>
        <h3>
          <i className="fa-solid fa-crown" style={{ color: 'var(--base-glow)' }}></i> ZYNETHIC Elite
        </h3>
        <div className={styles.liveBadge}>
          <span className="live-dot"></span> BASESCAN LIVE
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>RANK</th>
            <th>WALLET</th>
            <th>BALANCE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {isConnected && (
            <tr className={styles.userRow}>
              <td><i className="fa-solid fa-user-shield"></i></td>
              <td>{walletAddress.substring(0, 6)}...{walletAddress.substring(38)}</td>
              <td style={{ fontWeight: 800 }}>{userBalance.toLocaleString()}</td>
              <td style={{ color: 'var(--base-glow)' }}>YOU</td>
            </tr>
          )}

          {topHolders.length > 0 ? (
            topHolders.map((holder, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className={styles.mono}>
                  {holder.addr.substring(0, 6)}...{holder.addr.substring(38)}
                </td>
                <td>{holder.balance.toLocaleString()}</td>
                <td>
                  <span className={`${styles.statusPill} ${holder.status === 'WHALE' ? styles.whalePill : styles.holderPill}`}>
                    {holder.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className={styles.loadingCell}>
                <i className="fa-solid fa-spinner fa-spin"></i> Retrieving On-chain Data...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
