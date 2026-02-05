'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- LOGIC PROFESIONAL (GATEKEEPER) ---
  const [isConnected, setIsConnected] = useState(false);
  const [userBalance, setUserBalance] = useState(0); // Dalam $ZNTC
  const [sentiment, setSentiment] = useState({ value: 0, label: 'Analyzing...' });

  // 1. Simulasi Fetch Data Sentiment Real (Alternative.me API)
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await fetch('https://api.alternative.me/fng/');
        const data = await res.json();
        setSentiment({ 
          value: parseInt(data.data[0].value), 
          label: data.data[0].value_classification 
        });
      } catch {
        setSentiment({ value: 65, label: 'Greed' });
      }
    };
    fetchSentiment();
  }, []);

  // 2. Simulasi Koneksi Wallet
  const handleConnect = () => {
    setIsConnected(true);
    setUserBalance(55000); 
  };

  // 3. Helper untuk mengecek akses Tier
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

      {/* Top Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" alt="ZNTC" style={{ width: '30px', height: '30px' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '1px' }}>ZYNETHIC</div>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.85rem' }} onClick={handleConnect}>
          {isConnected ? `CONNECTED: ${userBalance.toLocaleString()} ZNTC` : 'CONNECT WALLET'}
        </button>
      </nav>

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-line"></i> AI Dashboard</div>
        <div className={`nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}><i className="fa-solid fa-layer-group"></i> Membership Tiers</div>
        <div className={`nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}><i className="fa-solid fa-vote-yea"></i> Governance</div>
        <div className={`nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}><i className="fa-solid fa-right-left"></i> Direct Swap</div>
        <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}><i className="fa-solid fa-trophy"></i> Leaderboard</div>
        <div className={`nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}><i className="fa-solid fa-fire"></i> Burn Tracker</div>
      </div>

      {/* Mobile Bottom Navigation */}
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
        
        {/* Real-time Activity Feed */}
        <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '0.85rem' }}>
          <span className="live-dot"></span> <strong>LIVE:</strong> 0x7a... swap 1.2 ETH for $ZNTC | AI Score: 98/100
        </p>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid-container">
              {/* Fitur 1: AI Sentiment & Heatmap */}
              <div className="card">
                <h3><i className="fa-solid fa-gauge-high" style={{ color: '#00f7ff' }}></i> AI Market Sentiment</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--base-glow)' }}>{sentiment.value}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{sentiment.label.toUpperCase()}</div>
                </div>
                {/* Heatmap Mini */}
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                    <div style={{ flex: 1, height: '4px', background: '#00ff88', borderRadius: '2px' }}></div>
                    <div style={{ flex: 1, height: '4px', background: '#0052ff', borderRadius: '2px' }}></div>
                    <div style={{ flex: 0.5, height: '4px', background: '#333', borderRadius: '2px' }}></div>
                </div>
                <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '5px' }}>Base Ecosystem AI Heatmap: Aerodrome (High Growth)</p>
                {!hasAccess(50000) && <div className="locked-overlay"><i className="fa-solid fa-lock"></i><p style={{ fontSize: '0.75rem' }}>GOLD TIER REQUIRED</p></div>}
              </div>

              {/* Fitur 2: Chatbot & Personalized Insight */}
              <div className="card">
                <h3><i className="fa-solid fa-robot"></i> ZNTC AI Assistant</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', height: '100px', fontSize: '0.8rem', marginBottom: '10px', overflowY: 'auto' }}>
                  AI Insight: Whale wallet 0x4... just added liquidity to $ZNTC pool. 
                </div>
                <input type="text" placeholder="Type a message..." disabled={!hasAccess(10000)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', boxSizing: 'border-box' }} />
                {!hasAccess(10000) && <div className="locked-overlay"><i className="fa-solid fa-key"></i><p style={{ fontSize: '0.75rem' }}>BRONZE TIER REQUIRED</p></div>}
              </div>
            </div>

            {/* Dexscreener Chart Simulation */}
            <div className="card" style={{ marginTop: '20px' }}>
              <h3><i className="fa-solid fa-chart-line" style={{ color: '#00f7ff', marginRight: '10px' }}></i> $ZNTC Real-Time Price (Simulated)</h3>
              <div style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.5)', borderRadius: '15px', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <p style={{ fontSize: '0.8rem', color: '#444' }}>[ DEXSCREENER CHART WILL LOAD HERE AT LAUNCH ]</p>
              </div>
            </div>

            <div className="grid-container">
                {/* AI Agent Framework & Quests */}
                <div className="card">
                    <h3><i className="fa-solid fa-microchip"></i> AI Agent & Quest</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Auto-Yield Farming on Aerodrome.</p>
                    <button className="btn-primary" style={{ marginTop: '10px', fontSize: '0.75rem' }}>START BASE QUEST</button>
                    {!hasAccess(50000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>GOLD ACCESS ONLY</p></div>}
                </div>

                {/* Base Security Scan */}
                <div className="card">
                    <h3><i className="fa-solid fa-shield-halved"></i> Base Security Scan AI</h3>
                    <input type="text" placeholder="Paste Contract Address..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', marginTop: '10px' }} />
                    {!hasAccess(10000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>BRONZE TIER REQUIRED</p></div>}
                </div>
            </div>

            {/* AI Market Predictor & News Hub */}
            <div className="card" style={{ marginTop: '20px' }}>
              <h3><i className="fa-solid fa-brain" style={{ color: '#00f7ff', marginRight: '10px' }}></i> AI Predictor & News Hub</h3>
              <div style={{ background: 'rgba(0,82,255,0.05)', padding: '10px', borderRadius: '10px', marginBottom: '15px', border: '1px solid var(--glass-border)' }}>
                <p style={{ fontSize: '0.7rem' }}><i className="fa-solid fa-bullhorn"></i> <strong>NEWS:</strong> Base TVL hits new ATH. $ZNTC signals Bullish.</p>
              </div>
              
              <table className="ai-table">
                <thead><tr><th>TOKEN</th><th>AI SCORE</th><th>SIGNAL</th><th>OUTLOOK</th></tr></thead>
                <tbody>
                  <tr><td>$ZNTC</td><td>94/100</td><td className="trend-up">STRONG BUY</td><td>Whale Accumulation</td></tr>
                  <tr><td>🔵 ETH</td><td>78/100</td><td className="trend-up">BUY</td><td>Steady</td></tr>
                </tbody>
              </table>

              {!hasAccess(50000) && <div className="locked-overlay"><p style={{ fontSize: '0.8rem' }}>AI PREDICTOR & WHALE TRACKER LOCKED</p></div>}
              {hasAccess(1000000) && <div style={{ marginTop: '15px', color: 'var(--base-glow)', fontSize: '0.8rem', fontWeight: 800 }}><i className="fa-solid fa-satellite-dish"></i> EXCLUSIVE WHALE SIGNAL: ENTRY AT $0.00045</div>}
            </div>
          </>
        )}

        {activeTab === 'governance' && (
          <div className="card">
            <h3><i className="fa-solid fa-vote-yea"></i> Governance & Social</h3>
            <div style={{ background: 'rgba(29, 155, 240, 0.1)', padding: '15px', borderRadius: '15px', marginTop: '15px' }}>
                <p style={{ fontSize: '0.8rem' }}><i className="fa-brands fa-twitter"></i> Voting will be auto-posted to @zynethic</p>
            </div>
            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--base-glow)', borderRadius: '15px' }}>
                <div className="status-pill">EXCLUSIVE</div>
                <h4>Presale: Early Bird Access</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Only for $ZNTC holders on Base Network.</p>
                <button className="btn-primary" style={{ marginTop: '10px' }}>CHECK ELIGIBILITY</button>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="card">
            <h3><i className="fa-solid fa-trophy"></i> Leaderboard</h3>
            <table className="ai-table">
              <thead><tr><th>RANK</th><th>WALLET</th><th>REPUTATION</th><th>STATUS</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>0x71...4f</td><td>9,450</td><td className="trend-up"><i className="fa-solid fa-circle-check"></i> BASED</td></tr>
                <tr><td>2</td><td>0x3a...1c</td><td>8,200</td><td className="trend-up"><i className="fa-solid fa-circle-check"></i> BASED</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'burn' && (
          <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-fire"></i> Burn Tracker</h3>
                <h2 style={{ fontSize: '2.5rem', margin: '20px 0' }}>4,000,000 <span style={{ fontSize: '1rem', color: '#94a3b8' }}>$ZNTC</span></h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Systematic deflation in progress.</p>
              </div>
              <div className="card">
                <h3><i className="fa-solid fa-whale"></i> Whale Tracker AI</h3>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '15px' }}>
                    <p style={{ color: '#ff4d4d' }}>[ALERT] 250k $ZNTC Burned 5m ago</p>
                    <p style={{ color: '#00ff88' }}>[ALERT] New Whale Wallet Detected</p>
                </div>
              </div>
          </div>
        )}

        {activeTab === 'swap' && (
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
             <h3 style={{ textAlign: 'center' }}>Direct Swap</h3>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>From ETH</label>
                <input type="number" placeholder="0.0" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '100%', outline: 'none' }} />
             </div>
             <button className="btn-primary" onClick={handleConnect}>
                {isConnected ? 'SWAP NOW' : 'CONNECT WALLET'}
             </button>
          </div>
        )}

        {/* Footer - Posisi Fix di bawah tanpa tabrakan */}
        <div style={{ marginTop: 'auto', padding: '40px 0 20px', textAlign: 'center', fontSize: '0.7rem', color: '#444', letterSpacing: '1px' }}>
          ZYNETHIC ECOSYSTEM 2026 - BUILDING THE FUTURE OF AI + WEB3
        </div>
      </main>
    </div>
  );
}
