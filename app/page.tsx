'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import AIChatModal from '@/components/AIChatModal';
import SecurityScan from '@/components/SecurityScan';
import Leaderboard from '@/components/leaderboard';
import Governance from '@/components/governance';
import { getRealBalance, fetchLivePrice, getTotalBurned, ZNTC_CONTRACT_ADDRESS } from '@/lib/calls';
import { useAccount } from 'wagmi';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [sentiment, setSentiment] = useState({ value: 0, label: 'Analyzing...' });
  const [livePrice, setLivePrice] = useState('0.0000');
  const [lastActivity, setLastActivity] = useState({ addr: '0x00...000', amount: 'Waiting...' });
  const [realBurned, setRealBurned] = useState(4000000);

  const { address, isConnected: isWalletConnected } = useAccount();

  useEffect(() => {
    if (isWalletConnected && address) {
      setIsConnected(true);
      setWalletAddress(address);
      getRealBalance(address).then(setUserBalance);
      setLastActivity({ addr: `${address.substring(0, 6)}...${address.substring(38)}`, amount: 'Connected' });
    } else {
      setIsConnected(false);
      setWalletAddress('');
      setUserBalance(0);
    }
  }, [isWalletConnected, address]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSent = await fetch('https://api.alternative.me/fng/');
        const dataSent = await resSent.json();
        setSentiment({
          value: parseInt(dataSent.data[0].value, 10),
          label: dataSent.data[0].value_classification,
        });
        const price = await fetchLivePrice();
        setLivePrice(price);
        const burned = await getTotalBurned();
        setRealBurned(burned);
      } catch (e) {
        console.error('Data fetch error:', e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const hasAccess = (requiredBalance: number) => isConnected && userBalance >= requiredBalance;

  return (
    <div className={styles.wrapper}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <AIChatModal
        livePrice={livePrice}
        sentimentLabel={sentiment.label}
        realBurned={realBurned}
        userBalance={userBalance}
      />

      <main className={styles.mainContent}>
        {activeTab === 'dashboard' && (
          <>
            <div className={styles.heroSection}>
              <div className="status-pill">PHASE: DEVELOPMENT & PRE-LAUNCH</div>
              <h1 className={styles.heroTitle}>ZYNETHIC Hub</h1>
              <h2 className={styles.heroSubtitle}>
                Global AI community token. Building the future of AI + Web3.
              </h2>
              <p className={styles.heroDescription}>
                The Command Center for real-time AI sentiment analysis, on-chain whale tracking, and predictive competition.
              </p>
              <p className={styles.heroLiveText}>
                <span className="live-dot"></span> <strong>LIVE:</strong> {lastActivity.addr} | Price: ${livePrice}
              </p>
            </div>

            <div className="grid-container">
              <div className="card">
                <h3>
                  <i className="fa-solid fa-gauge-high" style={{ color: 'var(--base-glow)' }}></i> AI Sentiment
                </h3>
                <div style={{ textAlign: 'center', padding: '15px 0' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--base-glow)' }}>
                    {sentiment.value}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{sentiment.label.toUpperCase()}</div>
                </div>
                {!hasAccess(50000) && (
                  <div className="locked-overlay">
                    <p>GOLD TIER REQUIRED</p>
                  </div>
                )}
              </div>

              <div className="card">
                <h3>
                  <i className="fa-solid fa-robot"></i> Terminal Assistant
                </h3>
                <div
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '10px',
                    padding: '15px',
                    height: '80px',
                    fontSize: '0.8rem',
                    overflowY: 'auto',
                  }}
                >
                  {isConnected
                    ? `Real-time data stream: $ZNTC price at $${livePrice}. Whale tracking enabled.`
                    : 'Waiting for connection...'}
                </div>
                <input
                  type="text"
                  placeholder="Ask AI..."
                  disabled={!hasAccess(10000)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'transparent',
                    color: 'white',
                    marginTop: '10px',
                    boxSizing: 'border-box',
                  }}
                />
                {!hasAccess(10000) && (
                  <div className="locked-overlay">
                    <p>BRONZE TIER REQUIRED</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`card ${styles.chartCard}`}>
              <h3 className={styles.chartHeader}>
                <i className={`fa-solid fa-chart-line ${styles.chartIcon}`}></i> $ZNTC Market Chart
              </h3>
              <div className={styles.chartContainer}>
                <iframe
                  src={`https://dexscreener.com/base/${ZNTC_CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
                  className={styles.chartIframe}
                  title="DexScreener ZNTC Chart"
                ></iframe>
              </div>
            </div>

            <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-microchip"></i> AI Agent & Quest</h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time yield optimization on Base.</p>
                <button className="btn-primary" style={{ marginTop: '10px', fontSize: '0.75rem' }}>
                  START QUEST
                </button>
                {!hasAccess(50000) && (
                  <div className="locked-overlay">
                    <p>GOLD ACCESS ONLY</p>
                  </div>
                )}
              </div>

              <div className="card">
                <h3><i className="fa-solid fa-shield-halved"></i> Security Scan AI</h3>
                <SecurityScan />
                {!hasAccess(10000) && (
                  <div className="locked-overlay">
                    <p>BRONZE TIER REQUIRED</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'swap' && (
          <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div className="status-pill" style={{ marginBottom: '20px' }}>STATION CLOSED</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>$ZNTC Listing Imminent</h2>
            <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 30px' }}>
              The ZYNETHIC Swap Engine is currently in stand-by. Native In-App Swap will be activated once $ZNTC Liquidity is deployed on Base Mainnet.
            </p>
            <button className="btn-primary" onClick={() => window.open('https://x.com/zynethic', '_blank')}>
              <i className="fa-brands fa-x-twitter"></i> FOLLOW FOR ANNOUNCEMENT
            </button>
          </div>
        )}

        {activeTab === 'governance' && (
          <Governance isConnected={isConnected} walletAddress={walletAddress} userBalance={userBalance} />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard isConnected={isConnected} walletAddress={walletAddress} userBalance={userBalance} />
        )}

        {activeTab === 'burn' && (
          <div className="grid-container">
            <div className="card">
              <h3><i className="fa-solid fa-fire"></i> Burn Tracker</h3>
              <h2 style={{ fontSize: '2.5rem', margin: '20px 0' }}>
                {realBurned.toLocaleString()} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>$ZNTC</span>
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time on-chain deflationary burn tracking.</p>
            </div>
            <div className="card">
              <h3><i className="fa-solid fa-whale"></i> Whale Tracker AI</h3>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '15px' }}>
                <p style={{ color: '#ff4d4d' }}>
                  [ALERT] {realBurned > 0 ? 'Burning Mechanism Active' : 'Scanning Dead Address...'}
                </p>
                <p style={{ color: '#00ff88' }}>[LIVE] Current $ZNTC Price:${livePrice}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="grid-container">
            <div className="card">
              <div className="status-pill">TIER 1</div>
              <h3>BRONZE</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Requirement: 10,000 $ZNTC</p>
              <ul style={{ fontSize: '0.75rem', color: '#f8fafc', paddingLeft: '20px' }}>
                <li>Basic AI Terminal</li>
                <li>Security Scan Access</li>
              </ul>
            </div>
            <div className="card">
              <div className="status-pill">TIER 2</div>
              <h3>GOLD</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Requirement: 50,000 $ZNTC</p>
              <ul style={{ fontSize: '0.75rem', color: '#f8fafc', paddingLeft: '20px' }}>
                <li>AI Sentiment Analysis</li>
                <li>Yield Optimization Quest</li>
              </ul>
            </div>
          </div>
        )}

        <footer className={styles.footer}>
          ZYNETHIC ECOSYSTEM 2026 - BUILDING THE FUTURE OF AI + WEB3
        </footer>
      </main>
    </div>
  );
}
