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

        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 90px 20px 80px; } /* Tambah padding bawah agar tidak tertutup mobile nav */
            .mobile-nav { display: flex; }
            .footer { padding-bottom: 20px; }
        }
      ` }} />

      {/* Top Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" alt="ZNTC" style={{ width: '30px', height: '30px' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '1px' }}>ZYNETHIC</div>
        </div>
        <button 
          style={{ background: isConnected ? 'transparent' : '#0052ff', border: isConnected ? '1px solid var(--base-glow)' : 'none', color: 'white', padding: '6px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }} 
          onClick={handleConnect}
        >
          {isConnected ? `CONNECTED: ${userBalance.toLocaleString()} ZNTC` : 'CONNECT WALLET'}
        </button>
      </nav>

      {/* Sidebar Navigation (Desktop) */}
      <div className="sidebar">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-line"></i> AI Dashboard</div>
        <div className={`nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}><i className="fa-solid fa-layer-group"></i> Membership Tiers</div>
        <div className={`nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}><i className="fa-solid fa-vote-yea"></i> Governance</div>
        <div className={`nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}><i className="fa-solid fa-right-left"></i> Direct Swap</div>
        <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}><i className="fa-solid fa-trophy"></i> Leaderboard</div>
        <div className={`nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}><i className="fa-solid fa-fire"></i> Burn Tracker</div>
      </div>

      {/* Mobile Bottom Navigation (Sesuai Sidebar) */}
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
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Global AI Community Portal on Base Mainnet.</p>

        {/* TAB DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-gauge-high" style={{ color: '#00f7ff' }}></i> AI Market Sentiment</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--base-glow)' }}>{sentiment.value}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{sentiment.label.toUpperCase()}</div>
                </div>
                {!hasAccess(50000) && (
                  <div className="locked-overlay">
                    <i className="fa-solid fa-lock" style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--base-glow)' }}></i>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>GOLD TIER REQUIRED</p>
                  </div>
                )}
              </div>
              <div className="card">
                <h3><i className="fa-solid fa-robot"></i> ZNTC AI Assistant</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', height: '100px', fontSize: '0.8rem', marginBottom: '10px' }}>
                  AI: Welcome. Connect your wallet to start the decentralized AI session.
                </div>
                <input type="text" placeholder="Type a message..." disabled={!hasAccess(10000)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', boxSizing: 'border-box' }} />
                {!hasAccess(10000) && (
                  <div className="locked-overlay">
                    <i className="fa-solid fa-key" style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--base-glow)' }}></i>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>BRONZE TIER REQUIRED</p>
                  </div>
                )}
              </div>
            </div>
            <div className="card" style={{ marginTop: '20px' }}>
              <h3><i className="fa-solid fa-brain" style={{ color: '#00f7ff', marginRight: '10px' }}></i> AI Market Predictor (Base Network)</h3>
              <table className="ai-table">
                <thead><tr><th>TOKEN</th><th>AI SCORE</th><th>SIGNAL</th></tr></thead>
                <tbody>
                  <tr><td>$ZNTC</td><td>94/100</td><td className="trend-up">STRONG BUY</td></tr>
                  <tr><td>ETH (Base)</td><td>78/100</td><td className="trend-up">BUY</td></tr>
                </tbody>
              </table>
              {!hasAccess(50000) && (
                <div className="locked-overlay">
                  <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>AI PREDICTOR LOCKED</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB TIERS */}
        {activeTab === 'tiers' && (
          <div className="grid-container">
            <div className="card" style={{ border: userBalance >= 10000 ? '1px solid var(--base-glow)' : '1px solid var(--glass-border)' }}>
              <div style={{ color: '#cd7f32', fontWeight: 800, fontSize: '0.7rem' }}>BRONZE HOLDER</div>
              <h3 style={{ margin: '10px 0' }}>10,000+ $ZNTC</h3>
              <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '15px' }}><li>Basic AI Chat Access</li><li>Community Badge</li></ul>
            </div>
            <div className="card" style={{ border: userBalance >= 50000 ? '1px solid var(--base-glow)' : '1px solid var(--glass-border)' }}>
              <div style={{ color: '#ffd700', fontWeight: 800, fontSize: '0.7rem' }}>GOLD HOLDER</div>
              <h3 style={{ margin: '10px 0' }}>50,000+ $ZNTC</h3>
              <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '15px' }}><li>AI Market Predictor</li><li>Governance Voting</li></ul>
            </div>
          </div>
        )}

        {/* TAB GOVERNANCE */}
        {activeTab === 'governance' && (
          <div className="card">
            <h3><i className="fa-solid fa-vote-yea" style={{ color: 'var(--base-glow)' }}></i> Active Proposals</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Decide the future of ZYNETHIC. 1 $ZNTC = 1 Vote.</p>
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontWeight: 800, marginBottom: '5px' }}>#001: Increase Burn Rate by 2%</div>
              <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '15px' }}>Status: Voting Open</div>
              <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px' }} onClick={handleConnect}>VOTE NOW</button>
            </div>
            {!hasAccess(50000) && (
              <div className="locked-overlay">
                <i className="fa-solid fa-gavel" style={{ fontSize: '1.5rem', marginBottom: '10px' }}></i>
                <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>GOLD TIER REQUIRED TO VOTE</p>
              </div>
            )}
          </div>
        )}

        {/* TAB LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="card">
            <h3><i className="fa-solid fa-trophy" style={{ color: 'var(--base-glow)' }}></i> Top ZYNETHIC Holders</h3>
            <table className="ai-table">
              <thead><tr><th>RANK</th><th>WALLET</th><th>BALANCE</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>0x71C...a4f</td><td>1,200,000 $ZNTC</td></tr>
                <tr><td>2</td><td>0x3aB...21c</td><td>850,000 $ZNTC</td></tr>
                <tr><td>3</td><td>0x9eD...f92</td><td>500,000 $ZNTC</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB BURN TRACKER */}
        {activeTab === 'burn' && (
          <div className="grid-container">
            <div className="card">
              <h3><i className="fa-solid fa-fire" style={{ color: '#ff4d4d' }}></i> Total Burned</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff4d4d', margin: '20px 0' }}>4,000,000</div>
              <div className="status-pill" style={{ borderColor: '#ff4d4d', color: '#ff4d4d' }}>10% OF SUPPLY</div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px' }}>Systematic deflation to increase scarcity.</p>
            </div>
            <div className="card">
              <h3>Burn Mechanism</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.6' }}>Setiap fase pengembangan ZYNETHIC AI akan memicu pembakaran token otomatis dari alokasi Burn Plan untuk menjaga kesehatan ekosistem.</p>
            </div>
          </div>
        )}

        {/* TAB SWAP */}
        {activeTab === 'swap' && (
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
             <h3 style={{ textAlign: 'center' }}>Direct Swap</h3>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>From ETH</label>
                <input type="number" placeholder="0.0" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '100%', outline: 'none' }} />
             </div>
             <button className="btn-primary" onClick={handleConnect}>{isConnected ? 'SWAP NOW' : 'CONNECT WALLET'}</button>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          ZYNETHIC ECOSYSTEM 2026 - BUILDING THE FUTURE OF AI + WEB3
        </footer>
      </main>
    </div>
  );
}
