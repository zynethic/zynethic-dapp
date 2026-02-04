'use client';

import { useState } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
        
        /* Layout */
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 5%; position: fixed; width: 100%; top: 0; z-index: 1000; background: rgba(1, 4, 9, 0.9); backdrop-filter: blur(15px); border-bottom: 1px solid var(--glass-border); box-sizing: border-box; }
        .sidebar { position: fixed; left: 0; top: 60px; width: 240px; height: calc(100vh - 60px); background: rgba(1, 4, 9, 0.5); border-right: 1px solid var(--glass-border); padding: 20px; box-sizing: border-box; }
        .main-content { margin-left: 240px; padding: 100px 40px 60px; flex-grow: 1; }

        /* Components */
        .nav-item { padding: 12px 15px; border-radius: 10px; cursor: pointer; color: #94a3b8; transition: 0.3s; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.9rem; }
        .nav-item:hover, .nav-item.active { background: rgba(0, 82, 255, 0.1); color: var(--base-glow); }
        
        .grid-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; padding: 25px; backdrop-filter: blur(10px); }
        
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid var(--base-glow); color: var(--base-glow); margin-bottom: 10px; }
        
        .btn-primary { background: var(--base-blue); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; }
        .btn-primary:hover { box-shadow: 0 0 20px rgba(0, 82, 255, 0.4); }

        .tier-card { border: 1px solid var(--glass-border); transition: 0.3s; }
        .tier-card:hover { border-color: var(--base-glow); transform: translateY(-5px); }

        /* Mobile Bottom Nav */
        .mobile-nav { display: none; position: fixed; bottom: 0; width: 100%; background: rgba(1, 4, 9, 0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--glass-border); justify-content: space-around; padding: 10px 0; z-index: 1000; }
        .mobile-nav-item { display: flex; flex-direction: column; align-items: center; font-size: 0.65rem; color: #94a3b8; gap: 5px; cursor: pointer; }
        .mobile-nav-item.active { color: var(--base-glow); }

        /* Responsive */
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
        <button style={{ background: '#0052ff', border: 'none', color: 'white', padding: '6px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => alert('OnchainKit: Connecting to Base...')}>
          CONNECT WALLET
        </button>
      </nav>

      {/* Sidebar Navigation (Desktop) */}
      <div className="sidebar">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <i className="fa-solid fa-chart-line"></i> AI Dashboard
        </div>
        <div className={`nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}>
          <i className="fa-solid fa-layer-group"></i> Membership Tiers
        </div>
        <div className={`nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}>
          <i className="fa-solid fa-vote-yea"></i> Governance
        </div>
        <div className={`nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}>
          <i className="fa-solid fa-right-left"></i> Direct Swap
        </div>
        <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
          <i className="fa-solid fa-trophy"></i> Leaderboard
        </div>
        <div className={`nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}>
          <i className="fa-solid fa-fire"></i> Burn Tracker
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <div className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <i className="fa-solid fa-chart-line"></i> Dashboard
        </div>
        <div className={`mobile-nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}>
          <i className="fa-solid fa-layer-group"></i> Tiers
        </div>
        <div className={`mobile-nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}>
          <i className="fa-solid fa-right-left"></i> Swap
        </div>
        <div className={`mobile-nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}>
          <i className="fa-solid fa-fire"></i> Burn
        </div>
        <div className={`mobile-nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}>
          <i className="fa-solid fa-vote-yea"></i> Vote
        </div>
      </div>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="status-pill">PHASE: DEVELOPMENT & PRE-LAUNCH</div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>Welcome to ZYNETHIC dApp</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Global AI Community Portal on Base Mainnet.</p>

        {activeTab === 'dashboard' && (
          <div className="grid-container">
            <div className="card">
              <h3><i className="fa-solid fa-brain" style={{ color: '#00f7ff' }}></i> AI Sentiment Analysis</h3>
              <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '10px 0' }}>
                <div style={{ flex: 1, background: '#0052ff', height: '60%', borderRadius: '5px' }}></div>
                <div style={{ flex: 1, background: '#0052ff', height: '80%', borderRadius: '5px' }}></div>
                <div style={{ flex: 1, background: '#00f7ff', height: '40%', borderRadius: '5px' }}></div>
                <div style={{ flex: 1, background: '#0052ff', height: '90%', borderRadius: '5px' }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AI analysis indicates a **Bullish** trend for the AI+Web3 sector.</p>
            </div>
            <div className="card">
              <h3><i className="fa-solid fa-message"></i> ZNTC AI Chatbot</h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', height: '120px', fontSize: '0.85rem', overflowY: 'auto', marginBottom: '15px' }}>
                <div style={{ marginBottom: '10px', color: '#00f7ff' }}>AI: Hello! Ask me anything about ZYNETHIC Tokenomics or Roadmap.</div>
              </div>
              <input type="text" placeholder="Ask AI..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', boxSizing: 'border-box' }} />
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="grid-container">
            <div className="card tier-card">
              <div style={{ color: '#cd7f32', fontWeight: 800, fontSize: '0.7rem' }}>BRONZE HOLDER</div>
              <h3 style={{ margin: '10px 0' }}>10,000+ $ZNTC</h3>
              <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '15px' }}>
                <li>Basic AI Dashboard Access</li>
                <li>Community Loyalty Badge</li>
              </ul>
            </div>
            <div className="card tier-card" style={{ boxShadow: '0 0 15px rgba(0, 82, 255, 0.2)' }}>
              <div style={{ color: '#ffd700', fontWeight: 800, fontSize: '0.7rem' }}>GOLD HOLDER</div>
              <h3 style={{ margin: '10px 0' }}>50,000+ $ZNTC</h3>
              <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '15px' }}>
                <li>AI Sentiment Analysis</li>
                <li>Governance Voting Rights</li>
                <li>Premium Holder Badge</li>
              </ul>
            </div>
            <div className="card tier-card">
              <div style={{ color: '#e5e4e2', fontWeight: 800, fontSize: '0.7rem' }}>PLATINUM WHALE</div>
              <h3 style={{ margin: '10px 0' }}>250,000+ $ZNTC</h3>
              <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '15px' }}>
                <li>Full AI Engine Access</li>
                <li>Early Beta Feature Access</li>
                <li>Elite Identity Badge</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'burn' && (
          <div className="card" style={{ maxWidth: '600px' }}>
            <h3><i className="fa-solid fa-fire" style={{ color: '#ff4d4d' }}></i> Burn Tracker</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '20px 0' }}>4,000,000 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>$ZNTC</span></div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>10% of total supply is allocated for systematic deflation to increase scarcity.</p>
            <div style={{ background: '#222', height: '12px', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
              <div style={{ width: '0%', background: 'linear-gradient(90deg, #ff4d4d, #0052ff)', height: '100%' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.7rem', fontWeight: 700 }}>
              <span>0 BURNED</span>
              <span>GOAL: 4,000,000</span>
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="card" style={{ maxWidth: '600px', textAlign: 'center' }}>
            <i className="fa-solid fa-user-shield" style={{ fontSize: '3rem', color: '#0052ff', marginBottom: '20px' }}></i>
            <h2>Governance Voting</h2>
            <p style={{ color: '#94a3b8' }}>Hold at least 50,000 $ZNTC to participate in ecosystem decision-making.</p>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
               <p style={{ margin: 0, fontWeight: 700 }}>Status: <span style={{ color: '#ff4d4d' }}>Wallet Not Connected</span></p>
            </div>
          </div>
        )}

        {activeTab === 'swap' && (
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
             <h3 style={{ textAlign: 'center' }}>Direct Swap</h3>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>From</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                   <input type="number" placeholder="0.0" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '60%', outline: 'none' }} />
                   <span style={{ fontWeight: 700 }}>ETH</span>
                </div>
             </div>
             <div style={{ textAlign: 'center', margin: '5px 0' }}><i className="fa-solid fa-arrow-down" style={{ color: '#0052ff' }}></i></div>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', marginBottom: '20px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>To</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                   <input type="number" placeholder="0.0" disabled style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '60%' }} />
                   <span style={{ fontWeight: 700 }}>$ZNTC</span>
                </div>
             </div>
             <button className="btn-primary">Connect Wallet to Swap</button>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="card">
            <h3><i className="fa-solid fa-ranking-star" style={{ color: '#ffd700' }}></i> Top Holders Leaderboard</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Top 100 $ZNTC holders. Long-term holders receive special digital badges.</p>
            <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px', border: '1px dashed var(--glass-border)', borderRadius: '15px', color: '#444' }}>
               Data will be available after Presale & Listing
            </div>
          </div>
        )}
        
        {/* Footer Area (In-flow) */}
        <div style={{ marginTop: '60px', paddingBottom: '20px', textAlign: 'center', fontSize: '0.7rem', color: '#444', letterSpacing: '1px' }}>
          ZYNETHIC ECOSYSTEM 2026 - BUILT ON BASE L2
        </div>
      </main>
    </div>
  );
}
