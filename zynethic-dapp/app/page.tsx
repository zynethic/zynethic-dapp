'use client';

import { useState, useEffect } from 'react'; 
import { ethers } from 'ethers'; 
import { getRealBalance, fetchLivePrice } from '@/lib/calls';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userBalance, setUserBalance] = useState(0); 
  const [sentiment, setSentiment] = useState({ value: 0, label: 'Analyzing...' });
  const [livePrice, setLivePrice] = useState('0.0000');
  const [lastActivity, setLastActivity] = useState({addr: '0x00...000', amount: 'Waiting...'});
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      } catch (e) {
        console.error("Data fetch error", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ethereum } = window as any;
    
    if (typeof window !== 'undefined' && ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
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

  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#010409', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        :root { --primary-bg: #010409; --base-blue: #0052ff; --base-glow: #00f7ff; --glass-bg: rgba(10, 17, 32, 0.7); --glass-border: rgba(255, 255, 255, 0.1); }
        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; background-color: var(--primary-bg); }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 5%; position: fixed; width: 100%; top: 0; z-index: 1000; background: rgba(1, 4, 9, 0.9); backdrop-filter: blur(15px); border-bottom: 1px solid var(--glass-border); box-sizing: border-box; }
        .sidebar { position: fixed; left: 0; top: 60px; width: 240px; height: calc(100vh - 60px); background: rgba(1, 4, 9, 0.5); border-right: 1px solid var(--glass-border); padding: 20px; box-sizing: border-box; }
        .main-content { margin-left: 240px; padding: 100px 40px 100px; flex-grow: 1; min-height: 100vh; display: flex; flex-direction: column; }
        .nav-item { padding: 12px 15px; border-radius: 10px; cursor: pointer; color: #94a3b8; transition: 0.3s; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.9rem; }
        .nav-item:hover, .nav-item.active { background: rgba(0, 82, 255, 0.1); color: var(--base-glow); }
        .grid-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; padding: 25px; backdrop-filter: blur(10px); position: relative; overflow: hidden; }
        .btn-primary { background: var(--base-blue); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; }
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid var(--base-glow); color: var(--base-glow); margin-bottom: 10px; }
        .locked-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(1, 4, 9, 0.85); backdrop-filter: blur(4px); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; text-align: center; }
        .ai-fab { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; background: var(--base-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; box-shadow: 0 0 20px rgba(0, 82, 255, 0.5); z-index: 2000; transition: 0.3s; border: 2px solid var(--base-glow); }
        .ai-fab:hover { transform: scale(1.1); }
        .ai-chat-box { position: fixed; bottom: 100px; right: 30px; width: 350px; height: 450px; background: var(--primary-bg); border: 1px solid var(--glass-border); border-radius: 20px; z-index: 2000; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-bottom: 4px solid var(--base-blue); }
        .ai-chat-header { background: rgba(0, 82, 255, 0.1); padding: 15px; font-weight: 800; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; }
        .ai-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .ai-table th { text-align: left; color: #94a3b8; font-size: 0.7rem; padding: 10px; border-bottom: 1px solid var(--glass-border); }
        .ai-table td { padding: 12px 10px; font-size: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .trend-up { color: #00f7ff; font-weight: 800; }
        .live-dot { height: 8px; width: 8px; background-color: #00ff88; border-radius: 50%; display: inline-block; margin-right: 8px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        @media (max-width: 768px) { .sidebar { display: none; } .main-content { margin-left: 0; padding: 90px 20px 100px; } .ai-chat-box { width: 90%; right: 5%; bottom: 80px; } }
      ` }} />

      <div className="ai-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
        <i className={`fa-solid ${isChatOpen ? 'fa-xmark' : 'fa-robot'}`}></i>
      </div>

      {isChatOpen && (
        <div className="ai-chat-box">
          <div className="ai-chat-header">
            <span><i className="fa-solid fa-robot" style={{color: 'var(--base-glow)'}}></i> ZNTC AI ASISTEN</span>
            <i className="fa-solid fa-chevron-down" style={{cursor: 'pointer'}} onClick={() => setIsChatOpen(false)}></i>
          </div>
          <div style={{ flex: 1, padding: '20px', fontSize: '0.85rem', overflowY: 'auto', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ background: 'rgba(0, 82, 255, 0.1)', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
              {isConnected ? `Halo User ${walletAddress.substring(0,6)}! Saya Zynethic AI. Saldo Anda: ${userBalance.toLocaleString()} $ZNTC. Apa yang ingin Anda tanyakan tentang ekosistem Base?` : "Halo! Saya adalah Zynethic AI. Hubungkan wallet Anda untuk mendapatkan analisa portofolio mendalam di jaringan Base."}
            </div>
          </div>
          <div style={{ padding: '15px', borderTop: '1px solid var(--glass-border)' }}>
            <input type="text" placeholder="Tanya tentang Zynethic..." style={{ width: '100%', background: '#000', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '10px', color: 'white', outline: 'none' }} />
          </div>
        </div>
      )}

      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" alt="ZNTC" style={{ width: '30px', height: '30px' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', letterSpacing: '1px' }}>ZYNETHIC</div>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '6px 16px' }} onClick={handleConnect}>
          {isConnected ? `CONNECTED: ${userBalance.toLocaleString()} $ZNTC` : 'CONNECT WALLET'}
        </button>
      </nav>

      <div className="sidebar">
        {['dashboard', 'tiers', 'governance', 'swap', 'leaderboard', 'burn'].map((tab) => (
          <div key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            <i className={`fa-solid fa-${tab === 'dashboard' ? 'chart-line' : tab === 'tiers' ? 'layer-group' : tab === 'governance' ? 'vote-yea' : tab === 'swap' ? 'right-left' : tab === 'leaderboard' ? 'trophy' : 'fire'}`}></i> 
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <main className="main-content">
        <div className="status-pill">PHASE: DEVELOPMENT & PRE-LAUNCH</div>
        <h1 style={{ margin: '0 0 10px 0' }}>ZYNETHIC COMMAND CENTER</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          <span className="live-dot"></span> 
          <strong>LIVE:</strong> {lastActivity.addr} | Price: ${livePrice}
        </p>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-gauge-high" style={{ color: '#00f7ff' }}></i> AI Sentiment</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--base-glow)' }}>{sentiment.value}</div>
                  <div style={{ color: '#94a3b8' }}>{sentiment.label.toUpperCase()}</div>
                </div>
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                    <div style={{ flex: 1, height: '4px', background: '#00ff88', borderRadius: '2px' }}></div>
                    <div style={{ flex: 1, height: '4px', background: '#0052ff', borderRadius: '2px' }}></div>
                    <div style={{ flex: 0.5, height: '4px', background: '#333', borderRadius: '2px' }}></div>
                </div>
                <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '5px' }}>Base Ecosystem AI Heatmap: Aerodrome (High Growth)</p>
                {!hasAccess(50000) && <div className="locked-overlay"><i className="fa-solid fa-lock"></i><p>GOLD TIER REQUIRED</p></div>}
              </div>

              <div className="card">
                <h3><i className="fa-solid fa-robot"></i> Terminal Assistant</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', height: '100px', fontSize: '0.8rem', overflowY: 'auto' }}>
                  {isConnected ? `System: User ${walletAddress.substring(0,6)} detected. Balance confirmed. AI Insight: Whale activity detected on Aerodrome pools.` : "System: Waiting for wallet connection..."}
                </div>
                <input type="text" placeholder="Tanya AI..." disabled={!hasAccess(10000)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', marginTop: '10px', boxSizing: 'border-box' }} />
                {!hasAccess(10000) && <div className="locked-overlay"><i className="fa-solid fa-key"></i><p>BRONZE TIER REQUIRED</p></div>}
              </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <h3><i className="fa-solid fa-chart-line" style={{ color: '#00f7ff', marginRight: '10px' }}></i> $ZNTC Market Chart</h3>
              <div style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <p style={{ fontSize: '0.8rem', color: '#444' }}>[ DEXSCREENER CHART FOR {walletAddress.substring(0,6) || "USER"} WILL LOAD HERE ]</p>
              </div>
            </div>

            <div className="grid-container">
                <div className="card">
                    <h3><i className="fa-solid fa-microchip"></i> AI Agent & Quest</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Auto-Yield Farming on Aerodrome.</p>
                    <button className="btn-primary" style={{ marginTop: '10px', fontSize: '0.75rem' }}>START BASE QUEST</button>
                    {!hasAccess(50000) && <div className="locked-overlay"><p>GOLD ACCESS ONLY</p></div>}
                </div>
                <div className="card">
                    <h3><i className="fa-solid fa-shield-halved"></i> Security Scan AI</h3>
                    <input type="text" placeholder="Paste Contract Address..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', marginTop: '10px' }} />
                    {!hasAccess(10000) && <div className="locked-overlay"><p>BRONZE TIER REQUIRED</p></div>}
                </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <h3><i className="fa-solid fa-brain" style={{ color: '#00f7ff', marginRight: '10px' }}></i> AI Predictor & News Hub</h3>
              <div style={{ background: 'rgba(0,82,255,0.05)', padding: '10px', borderRadius: '10px', marginBottom: '15px', border: '1px solid var(--glass-border)' }}>
                <p style={{ fontSize: '0.7rem' }}><i className="fa-solid fa-bullhorn"></i> <strong>NEWS:</strong> Zynethic Price at ${livePrice}. Signal: Bullish.</p>
              </div>
              <table className="ai-table">
                <thead><tr><th>TOKEN</th><th>AI SCORE</th><th>SIGNAL</th><th>OUTLOOK</th></tr></thead>
                <tbody>
                  <tr><td>$ZNTC</td><td>94/100</td><td className="trend-up">STRONG BUY</td><td>Whale Accumulation</td></tr>
                  <tr><td>🔵 ETH</td><td>78/100</td><td className="trend-up">BUY</td><td>Steady</td></tr>
                </tbody>
              </table>
              {!hasAccess(50000) && <div className="locked-overlay"><p>AI PREDICTOR LOCKED</p></div>}
            </div>
          </>
        )}

        {activeTab === 'governance' && (
          <div className="card">
            <h3><i className="fa-solid fa-vote-yea"></i> Governance & Social</h3>
            <div style={{ background: 'rgba(29, 155, 240, 0.1)', padding: '15px', borderRadius: '15px', marginTop: '15px' }}>
                <p style={{ fontSize: '0.8rem' }}><i className="fa-brands fa-twitter"></i> Voting results auto-posted to @zynethic</p>
            </div>
            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--base-glow)', borderRadius: '15px' }}>
                <div className="status-pill">EXCLUSIVE</div>
                <h4>Presale: Early Bird Access</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Only for $ZNTC holders on Base Network.</p>
                <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => isConnected ? alert("Checking eligibility...") : handleConnect()}>CHECK ELIGIBILITY</button>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="card">
            <h3><i className="fa-solid fa-trophy"></i> Global Leaderboard</h3>
            <table className="ai-table">
              <thead><tr><th>RANK</th><th>WALLET</th><th>REPUTATION</th><th>STATUS</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>0x71...4f</td><td>9,450</td><td className="trend-up"><i className="fa-solid fa-circle-check"></i> BASED</td></tr>
                <tr><td>2</td><td>0x3a...1c</td><td>8,200</td><td className="trend-up"><i className="fa-solid fa-circle-check"></i> BASED</td></tr>
                {isConnected && <tr><td>??</td><td>{walletAddress.substring(0,6)}...</td><td>{userBalance / 10}</td><td>CALCULATING</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'burn' && (
          <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-fire"></i> Burn Tracker</h3>
                <h2 style={{ fontSize: '2.5rem', margin: '20px 0' }}>4,000,000 <span style={{ fontSize: '1rem', color: '#94a3b8' }}>$ZNTC</span></h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>10% Total Supply systematic deflation.</p>
              </div>
              <div className="card">
                <h3><i className="fa-solid fa-whale"></i> Whale Tracker AI</h3>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '15px' }}>
                    <p style={{ color: '#ff4d4d' }}>[ALERT] 250k $ZNTC Burned (Simulated)</p>
                    <p style={{ color: '#00ff88' }}>[ALERT] New Accumulation Detected</p>
                </div>
              </div>
          </div>
        )}

        {activeTab === 'swap' && (
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
             <h3 style={{ textAlign: 'center' }}>Direct Swap (Base Mainnet)</h3>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pay with ETH</label>
                <input type="number" placeholder="0.0" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '100%', outline: 'none' }} />
             </div>
             <button className="btn-primary" onClick={() => isConnected ? alert("Contract: " + walletAddress) : handleConnect()}>
                {isConnected ? 'SWAP TO $ZNTC' : 'CONNECT WALLET'}
             </button>
          </div>
        )}

        <footer style={{ marginTop: 'auto', padding: '40px 0 20px', textAlign: 'center', fontSize: '0.7rem', color: '#444', letterSpacing: '1px' }}>
          ZYNETHIC ECOSYSTEM 2026 - BUILDING THE FUTURE OF AI + WEB3
        </footer>
      </main>
    </div>
  );
}
