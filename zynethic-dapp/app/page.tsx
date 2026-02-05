'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [userBalance, setUserBalance] = useState(0); 
  const [sentiment, setSentiment] = useState({ value: 0, label: 'Analyzing...' });

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

  const handleConnect = () => {
    setIsConnected(true);
    setUserBalance(55000); 
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

        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; background-color: var(--primary-bg); }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 5%; position: fixed; width: 100%; top: 0; z-index: 1000; background: rgba(1, 4, 9, 0.9); backdrop-filter: blur(15px); border-bottom: 1px solid var(--glass-border); box-sizing: border-box; }
        .sidebar { position: fixed; left: 0; top: 60px; width: 240px; height: calc(100vh - 60px); background: rgba(1, 4, 9, 0.5); border-right: 1px solid var(--glass-border); padding: 20px; box-sizing: border-box; overflow-y: auto; }
        .main-content { margin-left: 240px; padding: 100px 40px 20px; flex-grow: 1; display: flex; flexDirection: column; min-height: 100vh; box-sizing: border-box; }
        .nav-item { padding: 12px 15px; border-radius: 10px; cursor: pointer; color: #94a3b8; transition: 0.3s; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.85rem; }
        .nav-item:hover, .nav-item.active { background: rgba(0, 82, 255, 0.1); color: var(--base-glow); }
        .grid-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; padding: 25px; backdrop-filter: blur(10px); position: relative; overflow: hidden; height: 100%; box-sizing: border-box; }
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid var(--base-glow); color: var(--base-glow); margin-bottom: 10px; }
        .btn-primary { background: var(--base-blue); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; }
        .btn-primary:hover { box-shadow: 0 0 20px rgba(0, 82, 255, 0.4); }
        .mobile-nav { display: none; position: fixed; bottom: 0; width: 100%; background: rgba(1, 4, 9, 0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--glass-border); justify-content: space-around; padding: 12px 0; z-index: 1000; }
        .mobile-nav-item { display: flex; flex-direction: column; align-items: center; font-size: 0.6rem; color: #94a3b8; gap: 5px; cursor: pointer; flex: 1; }
        .mobile-nav-item.active { color: var(--base-glow); }
        .locked-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(1, 4, 9, 0.8); backdrop-filter: blur(4px); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 10; text-align: center; padding: 20px; box-sizing: border-box; }
        .ai-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .ai-table th { text-align: left; color: #94a3b8; font-size: 0.7rem; padding: 10px; border-bottom: 1px solid var(--glass-border); }
        .ai-table td { padding: 12px 10px; font-size: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .trend-up { color: #00f7ff; font-weight: 800; }
        .footer { margin-top: auto; padding: 40px 0 20px; text-align: center; font-size: 0.7rem; color: #444; letter-spacing: 1px; }

        @keyframes pulse-glow { 0% { opacity: 0.5; } 50% { opacity: 1; color: var(--base-glow); } 100% { opacity: 0.5; } }
        .live-dot { height: 8px; width: 8px; background-color: #00ff88; border-radius: 50%; display: inline-block; margin-right: 8px; animation: pulse-glow 2s infinite; }
        
        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 90px 20px 80px; }
            .mobile-nav { display: flex; }
        }
      ` }} />

      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" alt="ZNTC" style={{ width: '30px', height: '30px' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '1px' }}>ZYNETHIC</div>
        </div>
        <button style={{ background: isConnected ? 'transparent' : '#0052ff', border: isConnected ? '1px solid var(--base-glow)' : 'none', color: 'white', padding: '6px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }} onClick={handleConnect}>
          {isConnected ? `CONNECTED: ${userBalance.toLocaleString()} ZNTC` : 'CONNECT WALLET'}
        </button>
      </nav>

      {/* Sidebar */}
      <div className="sidebar">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-line"></i> AI Dashboard</div>
        <div className={`nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}><i className="fa-solid fa-layer-group"></i> Membership Tiers</div>
        <div className={`nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}><i className="fa-solid fa-vote-yea"></i> Governance</div>
        <div className={`nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}><i className="fa-solid fa-right-left"></i> Direct Swap</div>
        <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}><i className="fa-solid fa-trophy"></i> Leaderboard</div>
        <div className={`nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}><i className="fa-solid fa-fire"></i> Burn Tracker</div>
      </div>

      {/* Mobile Nav - Synchronized with Sidebar */}
      <div className="mobile-nav">
        <div className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-line"></i> Dashboard</div>
        <div className={`mobile-nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}><i className="fa-solid fa-layer-group"></i> Tiers</div>
        <div className={`mobile-nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}><i className="fa-solid fa-vote-yea"></i> Vote</div>
        <div className={`mobile-nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}><i className="fa-solid fa-right-left"></i> Swap</div>
        <div className={`mobile-nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}><i className="fa-solid fa-trophy"></i> Rank</div>
        <div className={`mobile-nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}><i className="fa-solid fa-fire"></i> Burn</div>
      </div>

      <main className="main-content">
        <div className="status-pill">PHASE: DEVELOPMENT & PRE-LAUNCH</div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>ZYNETHIC COMMAND CENTER</h1>
        
        {/* Real-time Activity Feed */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '20px' }}>
          <span className="live-dot"></span> LIVE ACTIVITY: <span style={{ marginLeft: '5px', color: '#fff' }}>0x71... purchased 2,500 $ZNTC on Base Mainnet</span>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-gauge-high" style={{ color: 'var(--base-glow)' }}></i> AI Market Sentiment</h3>
                <div style={{ textAlign: 'center', padding: '15px 0' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--base-glow)' }}>{sentiment.value}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{sentiment.label.toUpperCase()}</div>
                </div>
                {/* Personalized AI Insight */}
                <p style={{ fontSize: '0.65rem', borderTop: '1px solid var(--glass-border)', paddingTop: '10px', color: '#94a3b8' }}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i> AI Insight: Your Base portfolio is outperforming 78% of users today.
                </p>
                {!hasAccess(50000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>GOLD TIER REQUIRED</p></div>}
              </div>

              <div className="card">
                <h3><i className="fa-solid fa-robot"></i> ZNTC AI Assistant</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '12px', height: '80px', fontSize: '0.75rem', marginBottom: '10px', overflowY: 'auto' }}>
                  AI: Analyzing Base Mainnet... Network gas is low. Perfect time for smart contract interactions.
                </div>
                <input type="text" placeholder="Ask AI anything about Base..." disabled={!hasAccess(10000)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', fontSize: '0.75rem' }} />
                {!hasAccess(10000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>BRONZE TIER REQUIRED</p></div>}
              </div>
            </div>

            {/* Dexscreener Simulation Chart */}
            <div className="card" style={{ marginTop: '20px', height: '400px' }}>
                <h3><i className="fa-solid fa-chart-area" style={{ color: '#0052ff' }}></i> $ZNTC Price Tracker (Simulated)</h3>
                <div style={{ width: '100%', height: '90%', borderRadius: '12px', background: '#000', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ padding: '20px', textAlign: 'center', width: '100%' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>DEXSCREENER API LINKED (PENDING LAUNCH)</p>
                        <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHYwNnNnd2h6b3NqbmpsZ2Z0ZzVxdzZzdzZzdzZzdzZzdzZzdzZzJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxS06LzZ9S/giphy.gif" alt="Chart Loading" style={{ height: '150px', opacity: 0.3 }} />
                        <p style={{ color: 'var(--base-glow)', fontWeight: 800 }}>CHART WILL APPEAR AT LAUNCH</p>
                    </div>
                </div>
            </div>

            <div className="grid-container">
              {/* Auto-Compounding AI Agent */}
              <div className="card">
                <h3><i className="fa-solid fa-microchip" style={{ color: '#00ff88' }}></i> Auto-Compounding AI</h3>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AI delegates yield farming on Aerodrome/Uniswap.</p>
                <button className="btn-primary" style={{ marginTop: '15px', fontSize: '0.7rem' }}>INITIALIZE AGENT</button>
                {!hasAccess(100000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>AGENT ACCESS (100K+ $ZNTC)</p></div>}
              </div>

              {/* Base Security Scan AI */}
              <div className="card">
                <h3><i className="fa-solid fa-shield-halved" style={{ color: '#ff4d4d' }}></i> Base Security Scan AI</h3>
                <input type="text" placeholder="Enter contract 0x..." style={{ width: '100%', padding: '8px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '0.7rem', marginTop: '10px' }} />
                <button className="btn-primary" style={{ marginTop: '10px', fontSize: '0.7rem', background: '#333' }}>SCAN SAFETY</button>
                {!hasAccess(10000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>BRONZE TIER REQUIRED</p></div>}
              </div>
            </div>

            <div className="grid-container">
              {/* Base AI News Hub */}
              <div className="card">
                <h3><i className="fa-solid fa-newspaper"></i> Base AI News Hub</h3>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px' }}>
                    <div style={{ marginBottom: '8px', borderLeft: '2px solid var(--base-blue)', paddingLeft: '10px' }}>Base ecosystem hits $4B TVL - AI Forecasts bullish trend.</div>
                    <div style={{ borderLeft: '2px solid var(--base-blue)', paddingLeft: '10px' }}>Zynethic AI integration phase 1 complete.</div>
                </div>
              </div>

              {/* Base Quests */}
              <div className="card">
                <h3><i className="fa-solid fa-chess-knight"></i> Daily Base Quests</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.7rem' }}>Learn Aerodrome Liquidity</span>
                    <button style={{ background: 'var(--base-glow)', border: 'none', padding: '4px 8px', borderRadius: '5px', fontSize: '0.6rem', fontWeight: 800 }}>+50 REP</button>
                </div>
              </div>
            </div>

            <div className="grid-container">
                {/* Base Ecosystem Heatmap */}
                <div className="card">
                    <h3><i className="fa-solid fa-fire" style={{ color: '#ff4d4d' }}></i> Base Ecosystem Heatmap</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '10px' }}>
                        <div style={{ background: 'rgba(0,255,136,0.2)', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.65rem' }}>AERODROME: HIGH GROWTH</div>
                        <div style={{ background: 'rgba(0,82,255,0.2)', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.65rem' }}>UNISWAP: STABLE</div>
                    </div>
                </div>
                {/* AI Trade Signals */}
                <div className="card">
                    <h3><i className="fa-solid fa-satellite-dish" style={{ color: 'var(--base-glow)' }}></i> AI Trade Signals</h3>
                    <div style={{ color: 'var(--base-glow)', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', marginTop: '20px' }}>SIGNAL: ACCUMULATE $ZNTC</div>
                    <p style={{ fontSize: '0.6rem', textAlign: 'center', color: '#94a3b8' }}>Confident Score: 92%</p>
                    {!hasAccess(1000000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>WHALE ACCESS (1M $ZNTC)</p></div>}
                </div>
            </div>
          </>
        )}

        {activeTab === 'governance' && (
          <div className="card">
            <h3><i className="fa-solid fa-vote-yea" style={{ color: 'var(--base-glow)' }}></i> Governance Hub</h3>
            {/* Social Governance Twitter Integration */}
            <div style={{ background: 'rgba(29, 155, 240, 0.1)', padding: '10px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(29, 155, 240, 0.3)', fontSize: '0.7rem' }}>
                <i className="fa-brands fa-twitter"></i> <strong>Twitter Sync Active:</strong> Votes are automatically shared to @zynethic.
            </div>
            {/* Exclusive Presale Access */}
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
              <div className="status-pill" style={{ borderColor: 'var(--base-glow)', color: 'var(--base-glow)' }}>EARLY BIRD ACCESS</div>
              <div style={{ fontWeight: 800, marginBottom: '5px' }}>Presale: AI Launchpad Project #1</div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Exclusive to $ZNTC holders on Base Network.</p>
              <button className="btn-primary" style={{ width: 'auto', marginTop: '10px' }}>GET ACCESS</button>
            </div>
            {!hasAccess(50000) && <div className="locked-overlay"><p style={{ fontSize: '0.75rem' }}>GOLD TIER REQUIRED</p></div>}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="card">
            <h3><i className="fa-solid fa-trophy" style={{ color: 'var(--base-glow)' }}></i> Global Reputation Leaderboard</h3>
            <table className="ai-table">
              <thead><tr><th>RANK</th><th>WALLET</th><th>REPUTATION</th><th>STATUS</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>0x71C...a4f</td><td>9,450</td><td><span style={{ color: 'var(--base-blue)', fontSize: '0.6rem' }}><i className="fa-solid fa-circle-check"></i> BASED</span></td></tr>
                <tr><td>2</td><td>0x3aB...21c</td><td>8,200</td><td><span style={{ color: 'var(--base-blue)', fontSize: '0.6rem' }}><i className="fa-solid fa-circle-check"></i> BASED</span></td></tr>
                <tr><td>3</td><td>0x9eD...f92</td><td>7,100</td><td>-</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'burn' && (
          <div className="grid-container">
            <div className="card">
              <h3><i className="fa-solid fa-fire" style={{ color: '#ff4d4d' }}></i> Burn Tracker</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff4d4d', margin: '20px 0' }}>4,000,000</div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>10% of supply systematically removed.</p>
            </div>
            {/* Whale Tracker AI */}
            <div className="card">
               <h3><i className="fa-solid fa-whale"></i> Whale Tracker AI</h3>
               <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px' }}>
                  <div style={{ padding: '5px 0', color: '#ff4d4d' }}>[ALERT] 200,000 $ZNTC moved to Burn Address</div>
                  <div style={{ padding: '5px 0', color: '#00ff88' }}>[ALERT] New Whale holding 1.5M $ZNTC detected</div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'swap' && (
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
             <h3 style={{ textAlign: 'center' }}>Direct Swap (Base)</h3>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>From ETH</label>
                <input type="number" placeholder="0.0" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '100%', outline: 'none' }} />
             </div>
             <button className="btn-primary" onClick={handleConnect}>{isConnected ? 'SWAP NOW' : 'CONNECT WALLET'}</button>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="grid-container">
            <div className="card">
              <div style={{ color: '#cd7f32', fontWeight: 800, fontSize: '0.7rem' }}>BRONZE</div>
              <h3 style={{ margin: '10px 0' }}>10,000+ $ZNTC</h3>
              <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '15px' }}><li>AI Scan Access</li><li>News Hub</li></ul>
            </div>
            <div className="card">
              <div style={{ color: '#ffd700', fontWeight: 800, fontSize: '0.7rem' }}>GOLD</div>
              <h3 style={{ margin: '10px 0' }}>50,000+ $ZNTC</h3>
              <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '15px' }}><li>Sentiment Pro</li><li>Early Presale Access</li></ul>
            </div>
            <div className="card">
              <div style={{ color: 'var(--base-glow)', fontWeight: 800, fontSize: '0.7rem' }}>WHALE</div>
              <h3 style={{ margin: '10px 0' }}>1,000,000+ $ZNTC</h3>
              <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '15px' }}><li>AI Trade Signals</li><li>Direct Dev Access</li></ul>
            </div>
          </div>
        )}

        {/* Improved Footer with Margin Auto to push it down */}
        <footer className="footer" style={{ borderTop: '1px solid var(--glass-border)', marginTop: '40px', padding: '20px' }}>
          ZYNETHIC ECOSYSTEM 2026 - BUILDING THE FUTURE OF AI + WEB3
        </footer>
      </main>
    </div>
  );
}
