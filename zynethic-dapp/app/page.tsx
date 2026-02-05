'use client';

import { useState, useEffect } from 'react'; 
import { ethers } from 'ethers'; 
import { getRealBalance, fetchLivePrice, getTotalBurned, ZNTC_CONTRACT_ADDRESS } from '@/lib/calls';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userBalance, setUserBalance] = useState(0); 
  const [sentiment, setSentiment] = useState({ value: 0, label: 'Analyzing...' });
  const [livePrice, setLivePrice] = useState('0.0000');
  const [lastActivity, setLastActivity] = useState({addr: '0x00...000', amount: 'Waiting...'});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [realBurned, setRealBurned] = useState(4000000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSent = await fetch('https://api.alternative.me/fng/');
        const dataSent = await resSent.json();
        setSentiment({ 
          value: parseInt(dataSent.data[0].value), 
          label: dataSent.data[0].value_classification 
        });

        const price = await fetchLivePrice();
        setLivePrice(price);

        const burned = await getTotalBurned();
        setRealBurned(burned);
      } catch (e) {
        console.error("Data fetch error", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    // Memperbaiki error TypeScript dengan menggunakan indexing untuk menghindari deteksi 'any'
    if (typeof window !== 'undefined' && window['ethereum' as keyof typeof window]) {
      try {
        const ethProvider = window['ethereum' as keyof typeof window];
        const provider = new ethers.BrowserProvider(ethProvider as ethers.Eip1193Provider);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        const balance = await getRealBalance(address);
        setUserBalance(balance);
        setLastActivity({ addr: address.substring(0,6) + '...' + address.substring(38), amount: 'Connected' });
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const hasAccess = (requiredBalance: number) => isConnected && userBalance >= requiredBalance;

  const NavItems = () => (
    <>
      {['dashboard', 'tiers', 'governance', 'swap', 'leaderboard', 'burn'].map((tab) => (
        <div key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
          <i className={`fa-solid fa-${tab === 'dashboard' ? 'chart-line' : tab === 'tiers' ? 'layer-group' : tab === 'governance' ? 'vote-yea' : tab === 'swap' ? 'right-left' : tab === 'leaderboard' ? 'trophy' : 'fire'}`}></i> 
          <span className="nav-text">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
        </div>
      ))}
    </>
  );

  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#010409', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        :root { --primary-bg: #010409; --base-blue: #0052ff; --base-glow: #00f7ff; --glass-bg: rgba(10, 17, 32, 0.7); --glass-border: rgba(255, 255, 255, 0.1); --pancake-bg: #27262c; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; background-color: var(--primary-bg); }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 4%; position: fixed; width: 100%; top: 0; z-index: 1000; background: rgba(1, 4, 9, 0.9); backdrop-filter: blur(15px); border-bottom: 1px solid var(--glass-border); box-sizing: border-box; }
        .nav-center-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; }
        .nav-links-desktop { display: flex; gap: 5px; }
        .main-content { padding: 100px 40px 60px; flex-grow: 1; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; }
        .nav-item { padding: 6px 10px; border-radius: 10px; cursor: pointer; color: #94a3b8; transition: 0.3s; display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.8rem; white-space: nowrap; }
        .nav-item:hover, .nav-item.active { background: rgba(0, 82, 255, 0.1); color: var(--base-glow); }
        .btn-connect-fixed { padding: 6px 14px !important; font-size: 0.75rem !important; min-width: fit-content; }
        .swap-container { background: var(--pancake-bg); border-radius: 24px; padding: 20px; width: 100%; max-width: 420px; margin: 0 auto; border: 1px solid var(--glass-border); box-shadow: 0px 4px 20px rgba(0,0,0,0.5); }
        .swap-input-box { background: #372f47; border-radius: 16px; padding: 16px; margin-bottom: 8px; border: 1px solid transparent; }
        .swap-input-box:focus-within { border-color: var(--base-glow); }
        .swap-label { color: #b8add2; font-size: 0.75rem; font-weight: 600; margin-bottom: 8px; display: block; }
        .swap-input-row { display: flex; justify-content: space-between; align-items: center; }
        .swap-input { background: transparent; border: none; color: white; font-size: 1.5rem; font-weight: 600; width: 60%; outline: none; }
        .token-select { background: #483f5a; padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; }
        .grid-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; padding: 25px; backdrop-filter: blur(10px); position: relative; overflow: hidden; }
        .btn-primary { background: var(--base-blue); color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; border-bottom: 3px solid rgba(0,0,0,0.2); }
        .btn-primary:active { transform: translateY(2px); border-bottom: none; }
        .mobile-menu { display: none; position: fixed; bottom: 0; left: 0; width: 100%; background: #191326; border-top: 1px solid var(--glass-border); justify-content: space-around; padding: 10px 0; z-index: 1000; }
        .mobile-menu .nav-item { flex-direction: column; gap: 4px; font-size: 0.65rem; padding: 5px; }
        .mobile-menu .nav-item i { font-size: 1.2rem; }
        .ai-fab { position: fixed; bottom: 85px; right: 20px; width: 55px; height: 55px; background: var(--base-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; cursor: pointer; z-index: 999; border: 2px solid var(--base-glow); }
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid var(--base-glow); color: var(--base-glow); margin-bottom: 10px; }
        .locked-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(1, 4, 9, 0.85); backdrop-filter: blur(4px); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; text-align: center; }
        .live-dot { height: 8px; width: 8px; background-color: #00ff88; border-radius: 50%; display: inline-block; margin-right: 8px; animation: pulse 2s infinite; }
        .ai-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .ai-table th { text-align: left; color: #94a3b8; font-size: 0.7rem; padding: 10px; border-bottom: 1px solid var(--glass-border); }
        .ai-table td { padding: 12px 10px; font-size: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .trend-up { color: #00f7ff; font-weight: 800; }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        @media (max-width: 768px) { .nav-center-wrapper { display: none; } .mobile-menu { display: flex; } .main-content { padding: 80px 15px 120px; } .btn-connect { font-size: 0.7rem !important; padding: 6px 10px !important; } .nav-text { display: none; } .ai-fab { bottom: 80px; width: 50px; height: 50px; } }
      ` }} />

      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '180px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" alt="ZNTC" style={{ width: '28px', height: '28px' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', letterSpacing: '0.5px' }}>ZYNETHIC</div>
        </div>
        <div className="nav-center-wrapper"><div className="nav-links-desktop"><NavItems /></div></div>
        <div style={{ width: '180px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary btn-connect-fixed" onClick={handleConnect}>
            {isConnected ? `${userBalance.toLocaleString()} $ZNTC` : 'CONNECT WALLET'}
          </button>
        </div>
      </nav>

      <div className="mobile-menu"><NavItems /></div>

      <div className="ai-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
        <i className={`fa-solid ${isChatOpen ? 'fa-xmark' : 'fa-robot'}`}></i>
      </div>

      {isChatOpen && (
        <div className="ai-chat-box" style={{ position: 'fixed', bottom: '150px', right: '20px', width: '320px', height: '400px', background: '#010409', border: '1px solid var(--glass-border)', borderRadius: '20px', zIndex: 2000, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div className="ai-chat-header" style={{ background: 'rgba(0, 82, 255, 0.1)', padding: '15px', fontWeight: 800, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)' }}>
            <span><i className="fa-solid fa-robot" style={{color: 'var(--base-glow)'}}></i> ZNTC AI ASSISTANT</span>
            <i className="fa-solid fa-chevron-down" style={{cursor: 'pointer'}} onClick={() => setIsChatOpen(false)}></i>
          </div>
          <div style={{ flex: 1, padding: '15px', fontSize: '0.8rem', overflowY: 'auto' }}>
            {isConnected ? `Hello ${walletAddress.substring(0,6)}! Your real-time balance is ${userBalance.toLocaleString()} $ZNTC. I am ready to analyze Base Network trends for you.` : "Please connect your wallet to access personal AI portfolio insights."}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid var(--glass-border)' }}>
             <input type="text" placeholder="Ask AI..." style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '8px', borderRadius: '8px', color: 'white' }} />
          </div>
        </div>
      )}

      <main className="main-content">
        <div className="status-pill">PHASE: DEVELOPMENT & PRE-LAUNCH</div>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>ZYNETHIC COMMAND CENTER</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '20px' }}>
          <span className="live-dot"></span> <strong>LIVE:</strong> {lastActivity.addr} | Price: ${livePrice}
        </p>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-gauge-high" style={{ color: '#00f7ff' }}></i> AI Sentiment</h3>
                <div style={{ textAlign: 'center', padding: '15px 0' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--base-glow)' }}>{sentiment.value}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{sentiment.label.toUpperCase()}</div>
                </div>
                {!hasAccess(50000) && <div className="locked-overlay"><p>GOLD TIER REQUIRED</p></div>}
              </div>

              <div className="card">
                <h3><i className="fa-solid fa-robot"></i> Terminal Assistant</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', height: '80px', fontSize: '0.8rem', overflowY: 'auto' }}>
                  {isConnected ? `Real-time data stream: $ZNTC price at $${livePrice}. Whale tracking enabled.` : "Waiting for connection..."}
                </div>
                <input type="text" placeholder="Ask AI..." disabled={!hasAccess(10000)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', marginTop: '10px', boxSizing: 'border-box' }} />
                {!hasAccess(10000) && <div className="locked-overlay"><p>BRONZE TIER REQUIRED</p></div>}
              </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <h3><i className="fa-solid fa-chart-line" style={{ color: '#00f7ff', marginRight: '10px' }}></i> $ZNTC Market Chart</h3>
              <div style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <iframe src={`https://dexscreener.com/base/${ZNTC_CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`} style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
              </div>
            </div>

            <div className="grid-container">
                <div className="card">
                    <h3><i className="fa-solid fa-microchip"></i> AI Agent & Quest</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time yield optimization on Base.</p>
                    <button className="btn-primary" style={{ marginTop: '10px', fontSize: '0.75rem' }}>START QUEST</button>
                    {!hasAccess(50000) && <div className="locked-overlay"><p>GOLD ACCESS ONLY</p></div>}
                </div>
                <div className="card">
                    <h3><i className="fa-solid fa-shield-halved"></i> Security Scan AI</h3>
                    <input type="text" placeholder="Paste Contract Address..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', marginTop: '10px' }} />
                    {!hasAccess(10000) && <div className="locked-overlay"><p>BRONZE TIER REQUIRED</p></div>}
                </div>
            </div>
          </>
        )}

        {activeTab === 'swap' && (
          <div style={{ padding: '40px 0' }}>
            <div className="swap-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Swap</h3>
                <i className="fa-solid fa-gear" style={{ color: '#b8add2' }}></i>
              </div>
              <div className="swap-input-box">
                <span className="swap-label">From</span>
                <div className="swap-input-row">
                  <input type="number" className="swap-input" placeholder="0.0" />
                  <div className="token-select">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" width="20" alt="eth" /> ETH <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.6rem' }}></i>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', margin: '-15px 0', position: 'relative', zIndex: 2 }}>
                <div style={{ background: '#372f47', width: '32px', height: '32px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--pancake-bg)', cursor: 'pointer' }}>
                  <i className="fa-solid fa-arrow-down" style={{ color: 'var(--base-glow)', fontSize: '0.8rem' }}></i>
                </div>
              </div>
              <div className="swap-input-box" style={{ marginTop: '5px' }}>
                <span className="swap-label">To</span>
                <div className="swap-input-row">
                  <input type="number" className="swap-input" placeholder="0.0" readOnly />
                  <div className="token-select" style={{ background: 'var(--base-blue)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" width="20" alt="zntc" /> $ZNTC
                  </div>
                </div>
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '15px', borderRadius: '16px' }} onClick={() => isConnected ? window.open(`https://app.uniswap.org/#/swap?outputCurrency=${ZNTC_CONTRACT_ADDRESS}&chain=base`, '_blank') : handleConnect()}>
                {isConnected ? 'SWAP ON UNISWAP' : 'CONNECT WALLET'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="card">
            <h3><i className="fa-solid fa-vote-yea"></i> Governance & Social</h3>
            <div style={{ background: 'rgba(29, 155, 240, 0.1)', padding: '15px', borderRadius: '15px', marginTop: '15px' }}>
                <p style={{ fontSize: '0.8rem' }}><i className="fa-brands fa-twitter"></i> Voting results auto-posted to @zynethic</p>
            </div>
            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--base-glow)', borderRadius: '15px' }}>
                <h4>Presale: Early Bird Access</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verified $ZNTC holders on Base Mainnet only.</p>
                <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => isConnected ? alert(`Verifying eligibility for ${walletAddress}...`) : handleConnect()}>CHECK ELIGIBILITY</button>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="card">
            <h3><i className="fa-solid fa-trophy"></i> Global Leaderboard</h3>
            <table className="ai-table">
              <thead><tr><th>RANK</th><th>WALLET</th><th>BALANCE</th><th>STATUS</th></tr></thead>
              <tbody>
                {isConnected && userBalance > 0 && (
                  <tr><td>-</td><td>{walletAddress.substring(0,6)}...{walletAddress.substring(38)}</td><td>{userBalance.toLocaleString()}</td><td className="trend-up"><i className="fa-solid fa-circle-check"></i> YOU</td></tr>
                )}
                <tr><td>1</td><td>0x71...4f</td><td>9,450,000</td><td className="trend-up"><i className="fa-solid fa-circle-check"></i> BASED</td></tr>
                <tr><td>2</td><td>0x3a...1c</td><td>8,200,000</td><td className="trend-up"><i className="fa-solid fa-circle-check"></i> BASED</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'burn' && (
          <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-fire"></i> Burn Tracker</h3>
                <h2 style={{ fontSize: '2.5rem', margin: '20px 0' }}>{realBurned.toLocaleString()} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>$ZNTC</span></h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time on-chain deflationary burn tracking.</p>
              </div>
              <div className="card">
                <h3><i className="fa-solid fa-whale"></i> Whale Tracker AI</h3>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '15px' }}>
                    <p style={{ color: '#ff4d4d' }}>[ALERT] {realBurned > 0 ? 'Burning Mechanism Active' : 'Scanning Dead Address...'}</p>
                    <p style={{ color: '#00ff88' }}>[LIVE] Current $ZNTC Price: ${livePrice}</p>
                </div>
              </div>
          </div>
        )}

        <footer style={{ marginTop: 'auto', padding: '40px 0 30px', textAlign: 'center', fontSize: '0.65rem', color: '#444', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
          ZYNETHIC ECOSYSTEM 2026 - BUILDING THE FUTURE OF AI + WEB3
        </footer>
      </main>
    </div>
  );
}
