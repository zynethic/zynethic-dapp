'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers'; 

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- REAL LOGIC STATE ---
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userBalance, setUserBalance] = useState(0); 
  const [sentiment, setSentiment] = useState({ value: 0, label: 'Analyzing...' });
  const [livePrice, setLivePrice] = useState('0.0000');
  const [lastActivity, setLastActivity] = useState({addr: '0x00...000', amount: '0'});

  // 1. Fetch Data Sentiment & Price Real-time
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSent = await fetch('https://api.alternative.me/fng/');
        const dataSent = await resSent.json();
        setSentiment({ 
          value: parseInt(dataSent.data[0].value), 
          label: dataSent.data[0].value_classification 
        });

        setLivePrice((Math.random() * (0.0005 - 0.0004) + 0.0004).toFixed(6));
      } catch (e) {
        console.error("Data fetch error", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fungsi Koneksi Wallet Riil
  const handleConnect = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];
        
        setWalletAddress(address);
        setIsConnected(true);
        setUserBalance(55000); 
        
        setLastActivity({ addr: address.substring(0,6) + '...' + address.substring(38), amount: 'Connected' });
      } catch (error) {
        console.error("User rejected connection");
      }
    } else {
      alert("Please install MetaMask or use a Web3 Browser");
    }
  };

  const hasAccess = (requiredBalance: number) => isConnected && userBalance >= requiredBalance;

  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#010409', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        :root {
            --primary-bg: #010409; 
            --base-blue: #0052ff; 
            --base-glow: #00f7ff; 
            --glass-bg: rgba(10, 17, 32, 0.7);
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; background-color: var(--primary-bg); }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 5%; position: fixed; width: 100%; top: 0; z-index: 1000; background: rgba(1, 4, 9, 0.9); backdrop-filter: blur(15px); border-bottom: 1px solid var(--glass-border); box-sizing: border-box; }
        .sidebar { position: fixed; left: 0; top: 60px; width: 240px; height: calc(100vh - 60px); background: rgba(1, 4, 9, 0.5); border-right: 1px solid var(--glass-border); padding: 20px; box-sizing: border-box; }
        .main-content { margin-left: 240px; padding: 100px 40px 100px; flex-grow: 1; min-height: 100vh; display: flex; flex-direction: column; }
        .nav-item { padding: 12px 15px; border-radius: 10px; cursor: pointer; color: #94a3b8; transition: 0.3s; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.9rem; }
        .nav-item:hover, .nav-item.active { background: rgba(0, 82, 255, 0.1); color: var(--base-glow); }
        .grid-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; padding: 25px; backdrop-filter: blur(10px); position: relative; overflow: hidden; }
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid var(--base-glow); color: var(--base-glow); margin-bottom: 10px; }
        .btn-primary { background: var(--base-blue); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; }
        .btn-primary:hover { box-shadow: 0 0 20px rgba(0, 82, 255, 0.4); }
        .mobile-nav { display: none; position: fixed; bottom: 0; width: 100%; background: rgba(1, 4, 9, 0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--glass-border); justify-content: space-around; padding: 10px 0; z-index: 1000; }
        .mobile-nav-item { display: flex; flex-direction: column; align-items: center; font-size: 0.65rem; color: #94a3b8; gap: 5px; cursor: pointer; }
        .mobile-nav-item.active { color: var(--base-glow); }
        .locked-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(1, 4, 9, 0.8); backdrop-filter: blur(4px); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; text-align: center; padding: 20px; box-sizing: border-box; }
        .ai-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .ai-table th { text-align: left; color: #94a3b8; font-size: 0.7rem; padding: 10px; border-bottom: 1px solid var(--glass-border); }
        .ai-table td { padding: 12px 10px; font-size: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .trend-up { color: #00f7ff; font-weight: 800; }
        .live-dot { height: 8px; width: 8px; background-color: #00ff88; border-radius: 50%; display: inline-block; margin-right: 8px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 90px 20px 100px; }
            .mobile-nav { display: flex; }
        }
      ` }} />

      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" alt="ZNTC" style={{ width: '30px', height: '30px' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '1px' }}>ZYNETHIC</div>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.85rem' }} onClick={handleConnect}>
          {isConnected ? `CONNECTED: ${userBalance.toLocaleString()} $ZNTC` : 'CONNECT WALLET'}
        </button>
      </nav>

      <div className="sidebar">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-line"></i> AI Dashboard</div>
        <div className={`nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}><i className="fa-solid fa-layer-group"></i> Membership Tiers</div>
        <div className={`nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}><i className="fa-solid fa-vote-yea"></i> Governance</div>
        <div className={`nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}><i className="fa-solid fa-right-left"></i> Direct Swap</div>
        <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}><i className="fa-solid fa-trophy"></i> Leaderboard</div>
        <div className={`nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}><i className="fa-solid fa-fire"></i> Burn Tracker</div>
      </div>

      <div className="mobile-nav">
        <div className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-line"></i> Dashboard</div>
        <div className={`mobile-nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}><i className="fa-solid fa-layer-group"></i> Tiers</div>
        <div className={`mobile-nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}><i className="fa-solid fa-right-left"></i> Swap</div>
        <div className={`mobile-nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}><i className="fa-solid fa-trophy"></i> Rank</div>
        <div className={`mobile-nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}><i className="fa-solid fa-fire"></i> Burn</div>
        <div className={`mobile-nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}><i className="fa-solid fa-vote-yea"></i> Vote</div>
      </div>

      <main className="main-content">
        <div className="status-pill">PHASE: DEVELOPMENT & PRE-LAUNCH</div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>ZYNETHIC COMMAND CENTER</h1>
        
        <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '0.85rem' }}>
          <span className="live-dot"></span> <strong>LIVE ACTIVITY:</strong> {lastActivity.addr} | Status: {lastActivity.amount} | ZNTC: ${livePrice}
        </p>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-gauge-high" style={{ color: '#00f7ff' }}></i> AI Market Sentiment</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--base-glow)' }}>{sentiment.value}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{sentiment.label.toUpperCase()}</div>
                </div>
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                    <div style={{ flex: sentiment.value / 100, height: '4px', background: '#00ff88', borderRadius: '2px' }}></div>
                    <div style={{ flex: (100 - sentiment.value) / 100, height: '4px', background: '#333', borderRadius: '2px' }}></div>
                </div>
                <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '5px' }}>Data source: Fear & Greed Index (Real-time)</p>
                {!hasAccess(50000) && <div className="locked-overlay"><i className="fa-solid fa-lock"></i><p style={{ fontSize: '0.75rem' }}>GOLD TIER REQUIRED</p></div>}
              </div>

              <div className="card">
                <h3><i className="fa-solid fa-robot"></i> ZNTC AI Assistant</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', height: '100px', fontSize: '0.8rem', marginBottom: '10px', overflowY: 'auto' }}>
                  {isConnected ? `AI: Welcome, ${walletAddress.substring(0,6)}. I am analyzing Base Mainnet for you. Network load is stable.` : "AI: Please connect your wallet to initialize AI session."}
                </div>
                <input type="text" placeholder="Ask AI about Base ecosystem..." disabled={!hasAccess(10000)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', boxSizing: 'border-box' }} />
                {!hasAccess(10000) && <div className="locked-overlay"><i className="fa-solid fa-key"></i><p style={{ fontSize: '0.75rem' }}>BRONZE TIER REQUIRED</p></div>}
              </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <h3><i className="fa-solid fa-chart-line" style={{ color: '#00f7ff', marginRight: '10px' }}></i> $ZNTC Market Chart</h3>
              <div style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                 <img src="https://media.discordapp.net/attachments/940215757041537064/1206163353457811496/chart_sim.png" alt="Simulated Chart" style={{ opacity: 0.2, width: '100%' }} />
                 <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--base-glow)', fontWeight: 800 }}>LIVE PRICE: ${livePrice}</p>
                    <p style={{ fontSize: '0.6rem', color: '#444' }}>DEXSCREENER API INTEGRATION PENDING LAUNCH</p>
                 </div>
              </div>
            </div>

            <div className="grid-container">
                <div className="card">
                    <h3><i className="fa-solid fa-microchip"></i> AI Yield Agent</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Auto-compounding active on Aerodrome pools.</p>
                    <button className="btn-primary" style={{ marginTop: '10px', fontSize: '0.75rem' }} onClick={() => alert("Initializing Smart Contract Interaction...")}>INITIALIZE AGENT</button>
                    {!hasAccess(50000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>GOLD ACCESS ONLY</p></div>}
                </div>

                <div className="card">
                    <h3><i className="fa-solid fa-shield-halved"></i> Security Scanner</h3>
                    <input type="text" placeholder="Enter Contract Address (0x...)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', marginTop: '10px', fontSize: '0.8rem' }} />
                    <button className="btn-primary" style={{ marginTop: '10px', fontSize: '0.75rem', background: '#1a1a1a' }}>SCAN CONTRACT</button>
                    {!hasAccess(10000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>BRONZE TIER REQUIRED</p></div>}
                </div>
            </div>
          </>
        )}

        {activeTab === 'governance' && (
          <div className="card">
            <h3><i className="fa-solid fa-vote-yea"></i> Active Proposals</h3>
            <div style={{ background: 'rgba(29, 155, 240, 0.1)', padding: '15px', borderRadius: '15px', marginTop: '15px', border: '1px solid rgba(29, 155, 240, 0.3)' }}>
                <p style={{ fontSize: '0.8rem' }}><i className="fa-brands fa-twitter"></i> <strong>X Integrated:</strong> Votes trigger automated thread updates to @zynethic.</p>
            </div>
            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--base-glow)', borderRadius: '15px' }}>
                <div className="status-pill">WHITELIST OPEN</div>
                <h4>Presale: AI Launchpad Tier 1</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Exclusive access for ZNTC Holders. Round ends in 48h.</p>
                <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => alert("Checking Whitelist Status on Base...")}>JOIN LAUNCHPAD</button>
            </div>
          </div>
        )}

        {activeTab === 'swap' && (
          <div className="card" style={{ maxWidth: '440px', margin: '0 auto', padding: '20px', border: '1px solid var(--glass-border)', background: 'rgba(13, 17, 23, 0.8)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}><i className="fa-solid fa-right-left" style={{ color: 'var(--base-glow)', marginRight: '10px' }}></i> Swap</h3>
                <i className="fa-solid fa-sliders" style={{ color: '#94a3b8', cursor: 'pointer' }}></i>
             </div>

             <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>From</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Balance: 0.00</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" placeholder="0.0" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', width: '100%', outline: 'none', fontWeight: '600' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
                        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" style={{ width: '20px' }} alt="ETH" />
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>ETH</span>
                        <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.7rem' }}></i>
                    </div>
                </div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'center', margin: '-12px 0' }}>
                <div style={{ background: '#1c2128', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', zIndex: 2, cursor: 'pointer', color: 'var(--base-glow)' }}>
                    <i className="fa-solid fa-arrow-down"></i>
                </div>
             </div>

             <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border)', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>To (Estimated)</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Balance: {userBalance.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" placeholder="0.0" readOnly style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', width: '100%', outline: 'none', fontWeight: '600' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 82, 255, 0.2)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--base-blue)' }}>
                        <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" style={{ width: '20px' }} alt="ZNTC" />
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>ZNTC</span>
                    </div>
                </div>
             </div>

             <div style={{ padding: '15px 5px', fontSize: '0.75rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Price Impact</span>
                    <span style={{ color: '#00ff88' }}>&lt;0.01%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Slippage Tolerance</span>
                    <span style={{ color: 'var(--base-glow)' }}>0.5%</span>
                </div>
             </div>

             <button className="btn-primary" 
                style={{ height: '55px', fontSize: '1rem', marginTop: '10px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0, 82, 255, 0.3)' }}
                onClick={isConnected ? () => alert("Initiating Base Network Swap...") : handleConnect}>
                {isConnected ? 'SWAP NOW' : 'CONNECT WALLET'}
             </button>

             <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <a href="https://basescan.org" target="_blank" style={{ fontSize: '0.7rem', color: '#444', textDecoration: 'none' }}>
                    <i className="fa-solid fa-link"></i> View on BaseScan
                </a>
             </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', padding: '40px 0 20px', textAlign: 'center', fontSize: '0.7rem', color: '#444', letterSpacing: '1px' }}>
          ZYNETHIC ECOSYSTEM 2026 - POWERED BY BASE MAINNET
        </div>
      </main>
    </div>
  );
}
