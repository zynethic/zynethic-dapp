'use client';

import { useState } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#010409', minHeight: '100vh', color: '#f8fafc' }}>
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

        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; }
        
        /* Layout */
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 15px 5%; position: fixed; width: 100%; top: 0; z-index: 1000; background: rgba(1, 4, 9, 0.9); backdrop-filter: blur(15px); border-bottom: 1px solid var(--glass-border); box-sizing: border-box; }
        .sidebar { position: fixed; left: 0; top: 70px; width: 240px; height: calc(100vh - 70px); background: rgba(1, 4, 9, 0.5); border-right: 1px solid var(--glass-border); padding: 20px; box-sizing: border-box; }
        .main-content { margin-left: 240px; padding: 100px 40px 40px; }

        /* Components */
        .nav-item { padding: 12px 15px; border-radius: 10px; cursor: pointer; color: #94a3b8; transition: 0.3s; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; font-weight: 600; }
        .nav-item:hover, .nav-item.active { background: rgba(0, 82, 255, 0.1); color: var(--base-glow); }
        
        .grid-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; padding: 25px; backdrop-filter: blur(10px); }
        
        .badge-coming { font-size: 0.65rem; background: var(--base-blue); color: white; padding: 2px 8px; border-radius: 5px; margin-left: auto; text-transform: uppercase; }
        .status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid var(--base-glow); color: var(--base-glow); margin-bottom: 10px; }
        
        .btn-primary { background: var(--base-blue); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; }
        .btn-primary:hover { box-shadow: 0 0 20px rgba(0, 82, 255, 0.4); }

        /* Responsive */
        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 90px 20px; }
        }
      ` }} />

      {/* Top Navbar */}
      <nav className="navbar">
        <div style={{ fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase' }}>ZYNE<span style={{ color: '#0052ff' }}>THIC</span></div>
        <button style={{ background: '#0052ff', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }} onClick={() => alert('Connect Wallet via OnchainKit coming soon!')}>
          CONNECT WALLET
        </button>
      </nav>

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <i className="fa-solid fa-chart-line"></i> AI Dashboard
        </div>
        <div className={`nav-item ${activeTab === 'holder' ? 'active' : ''}`} onClick={() => setActiveTab('holder')}>
          <i className="fa-solid fa-crown"></i> Holder Access <span className="badge-coming">Lock</span>
        </div>
        <div className={`nav-item ${activeTab === 'staking' ? 'active' : ''}`} onClick={() => setActiveTab('staking')}>
          <i className="fa-solid fa-vault"></i> Burn & Staking
        </div>
        <div className={`nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}>
          <i className="fa-solid fa-right-left"></i> Direct Swap
        </div>
        <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
          <i className="fa-solid fa-trophy"></i> Leaderboard
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
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AI analysis indicates a **Bullish** trend for AI+Web3 sector.</p>
            </div>
            <div className="card">
              <h3><i className="fa-solid fa-message"></i> ZNTC AI Chatbot</h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', height: '120px', fontSize: '0.85rem', overflowY: 'auto', marginBottom: '15px' }}>
                <div style={{ marginBottom: '10px', color: '#00f7ff' }}>AI: Hello! Ask me anything about ZYNETHIC Tokenomics or Roadmap.</div>
              </div>
              <input type="text" placeholder="Ask AI..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white' }} />
            </div>
          </div>
        )}

        {activeTab === 'staking' && (
          <div className="grid-container">
            <div className="card">
              <h3><i className="fa-solid fa-fire" style={{ color: '#ff4d4d' }}></i> Burn Tracker</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '20px 0' }}>4,000,000 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>$ZNTC</span></div>
              <p style={{ fontSize: '0.8rem' }}>10% of total supply is allocated for systematic deflation.</p>
              <div style={{ background: '#222', height: '10px', borderRadius: '10px', marginTop: '10px' }}>
                <div style={{ width: '0%', background: 'linear-gradient(to right, #ff4d4d, #0052ff)', height: '100%', borderRadius: '10px' }}></div>
              </div>
            </div>
            <div className="card">
              <h3><i className="fa-solid fa-lock"></i> ZNTC Staking Vault</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>Lock your $ZNTC to earn AI ecosystem rewards.</p>
              <div style={{ padding: '15px', border: '1px dashed #0052ff', borderRadius: '10px', textAlign: 'center', color: '#94a3b8' }}>
                Available after Presale
              </div>
            </div>
          </div>
        )}

        {activeTab === 'holder' && (
          <div className="card" style={{ maxWidth: '600px', textAlign: 'center' }}>
            <i className="fa-solid fa-user-shield" style={{ fontSize: '3rem', color: '#0052ff', marginBottom: '20px' }}></i>
            <h2>Verified Holder Access</h2>
            <p>Access **Premium Insights** and **Snapshot Governance** by holding at least 50,000 $ZNTC.</p>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
               <p style={{ margin: 0, fontWeight: 700 }}>Your Status: <span style={{ color: '#ff4d4d' }}>Not Connected</span></p>
            </div>
          </div>
        )}

        {/* Tab lainnya bisa ditambahkan polanya sesuai keinginan */}
        {activeTab === 'swap' && (
          <div className="card" style={{ maxWidth: '450px', margin: '0 auto' }}>
             <h3>Direct Swap</h3>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>From</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                   <input type="number" placeholder="0.0" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '60%' }} />
                   <span>ETH</span>
                </div>
             </div>
             <div style={{ textAlign: 'center', margin: '10px 0' }}><i className="fa-solid fa-arrow-down"></i></div>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>To</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                   <input type="number" placeholder="0.0" disabled style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '60%' }} />
                   <span>$ZNTC</span>
                </div>
             </div>
             <button className="btn-primary">Connect Wallet to Swap</button>
          </div>
        )}
      </main>

      <footer style={{ position: 'fixed', bottom: 20, right: 40, fontSize: '0.7rem', color: '#444' }}>
        ZYNETHIC Ecosystem v1.0b - Base Mainnet Verified
      </footer>
    </div>
  );
}
