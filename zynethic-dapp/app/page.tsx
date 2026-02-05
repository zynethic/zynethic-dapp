'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- STATE UNTUK LOGIKA PROFESIONAL ---
  const [isConnected, setIsConnected] = useState(false);
  const [zntcBalance, setZntcBalance] = useState(0); 
  const [sentiment, setSentiment] = useState({ value: 0, label: 'Loading...' });
  // Menghapus chatInput & setChatInput karena belum digunakan di fungsi manapun (Penyebab Error 1 & 2)
  const [chatHistory, setChatHistory] = useState([{ role: 'ai', text: 'Welcome to ZYNETHIC AI. Connect wallet to unlock full analysis.' }]);

  // --- 1. FETCH ON-CHAIN DATA (Sentiment & Market) ---
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('https://api.alternative.me/fng/');
        const data = await res.json();
        setSentiment({ 
          value: parseInt(data.data[0].value), 
          label: data.data[0].value_classification 
        });
      } catch {
        // Menghapus parameter (e) karena tidak digunakan (Penyebab Error 3)
        setSentiment({ value: 50, label: 'Neutral' });
      }
    };
    fetchMarketData();
  }, []);

  // --- 2. FUNGSI KONEKSI (GATEKEEPER) ---
  const handleConnect = () => {
    setIsConnected(true);
    setZntcBalance(55000); 
    setChatHistory([{ role: 'ai', text: 'Wallet Connected. $ZNTC detected. Premium AI Access Unlocked.' }]);
  };

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
        .main-content { margin-left: 240px; padding: 100px 40px 60px; flex-grow: 1; }
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

        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 90px 20px 100px; }
            .mobile-nav { display: flex; }
        }
      ` }} />

      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://raw.githubusercontent.com/zynethic/zntc-icon/main/zntc.png" alt="ZNTC" style={{ width: '30px', height: '30px' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '1px' }}>ZYNETHIC</div>
        </div>
        <button style={{ background: isConnected ? '#1a1d23' : '#0052ff', border: isConnected ? '1px solid var(--base-glow)' : 'none', color: 'white', padding: '6px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }} onClick={handleConnect}>
          {isConnected ? `0x553E...B5B (${zntcBalance.toLocaleString()} ZNTC)` : 'CONNECT WALLET'}
        </button>
      </nav>

      <div className="sidebar">
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-line"></i> AI Dashboard</div>
        <div className={`nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}><i className="fa-solid fa-layer-group"></i> Core Utilities</div>
        <div className={`nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}><i className="fa-solid fa-vote-yea"></i> Governance</div>
        <div className={`nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}><i className="fa-solid fa-right-left"></i> Direct Swap</div>
        <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}><i className="fa-solid fa-trophy"></i> Leaderboard</div>
        <div className={`nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}><i className="fa-solid fa-fire"></i> Burn Tracker</div>
      </div>

      <div className="mobile-nav">
        <div className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-line"></i> Dashboard</div>
        <div className={`mobile-nav-item ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}><i className="fa-solid fa-layer-group"></i> Utilities</div>
        <div className={`mobile-nav-item ${activeTab === 'swap' ? 'active' : ''}`} onClick={() => setActiveTab('swap')}><i className="fa-solid fa-right-left"></i> Swap</div>
        <div className={`mobile-nav-item ${activeTab === 'burn' ? 'active' : ''}`} onClick={() => setActiveTab('burn')}><i className="fa-solid fa-fire"></i> Burn</div>
        <div className={`mobile-nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}><i className="fa-solid fa-vote-yea"></i> Vote</div>
      </div>

      <main className="main-content">
        <div className="status-pill">PHASE: DEVELOPMENT & PRE-LAUNCH</div>

        {activeTab === 'dashboard' && (
          <>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>The New Frontier of Intelligence</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px', lineHeight: '1.6', maxWidth: '800px' }}>
              At the intersection of technological evolution and decentralization, ZYNETHIC ($ZNTC) emerges as a catalyst for the AI ecosystem of the future.
            </p>

            <div className="grid-container">
              <div className="card">
                <h3><i className="fa-solid fa-gauge-high" style={{ color: '#00f7ff' }}></i> AI Market Sentiment</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: sentiment.value > 50 ? 'var(--base-glow)' : '#ff4d4d' }}>{sentiment.value}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{sentiment.label.toUpperCase()}</div>
                </div>
                <div style={{ background: '#222', height: '8px', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${sentiment.value}%`, background: 'var(--base-blue)', height: '100%', transition: '1s' }}></div>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#444', marginTop: '10px' }}>Real-time Fear & Greed Index Aggregator</p>
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3><i className="fa-solid fa-brain"></i> ZNTC AI Assistant</h3>
                  {!isConnected && <span style={{ fontSize: '0.6rem', color: '#ff4d4d' }}><i className="fa-solid fa-lock"></i> LOCKED</span>}
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', height: '100px', fontSize: '0.8rem', overflowY: 'auto', marginBottom: '10px', filter: isConnected ? 'none' : 'blur(2px)' }}>
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={{ marginBottom: '5px', color: msg.role === 'ai' ? 'var(--base-glow)' : '#fff' }}>
                      <strong>{msg.role === 'ai' ? 'AI: ' : 'You: '}</strong>{msg.text}
                    </div>
                  ))}
                </div>
                {!isConnected ? (
                  <button className="btn-primary" style={{ fontSize: '0.8rem' }} onClick={handleConnect}>Connect Wallet to Chat</button>
                ) : (
                  <input type="text" placeholder="Ask about ZYNETHIC..." style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', boxSizing: 'border-box' }} />
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'tiers' && (
          <>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>Core Utilities</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>$ZNTC is a digital testament to your support for the decentralized AI revolution.</p>
            <div className="grid-container">
              <div className="card">
                <div style={{ color: 'var(--base-glow)', fontWeight: 800, fontSize: '0.7rem' }}>UTILITY 01</div>
                <h3>Governance</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Exercise voting power within the ZYNETHIC DAO to decide AI innovations.</p>
              </div>
              <div className="card">
                <div style={{ color: 'var(--base-glow)', fontWeight: 800, fontSize: '0.7rem' }}>UTILITY 02</div>
                <h3>AI Dashboard</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Exclusive access to proprietary, AI-driven tools for deep market analysis.</p>
              </div>
              <div className="card">
                <div style={{ color: 'var(--base-glow)', fontWeight: 800, fontSize: '0.7rem' }}>UTILITY 03</div>
                <h3>Ecosystem Loyalty</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Staking rewards for long-term supporters, aligning commitment with rewards.</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'swap' && (
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
             <h3 style={{ textAlign: 'center' }}>Direct Swap</h3>
             <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginBottom: '15px' }}>Purchase $ZNTC directly on Base Mainnet</p>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <input type="number" placeholder="0.0" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '60%', outline: 'none' }} />
                  <span style={{ fontWeight: 700 }}>ETH</span>
                </div>
             </div>
             <div style={{ textAlign: 'center', margin: '10px 0' }}><i className="fa-solid fa-arrow-down" style={{ color: '#0052ff' }}></i></div>
             <div style={{ background: '#000', padding: '15px', borderRadius: '15px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <input type="number" placeholder="0.0" disabled style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', width: '60%' }} />
                  <span style={{ fontWeight: 700 }}>$ZNTC</span>
                </div>
             </div>
             <button className="btn-primary" onClick={handleConnect}>{isConnected ? 'Swap Now' : 'Connect Wallet to Swap'}</button>
          </div>
        )}

        {activeTab === 'burn' && (
          <div className="card" style={{ maxWidth: '600px' }}>
            <h3><i className="fa-solid fa-fire" style={{ color: '#ff4d4d' }}></i> Strategic Scarcity (Burn Tracker)</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '20px 0' }}>4,000,000 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>$ZNTC</span></div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Fixed total supply: 40,000,000 $ZNTC. 10% allocated for deflationary burn events.</p>
            <div style={{ background: '#222', height: '12px', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
              <div style={{ width: '0%', background: 'linear-gradient(90deg, #ff4d4d, #0052ff)', height: '100%' }}></div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '60px', paddingBottom: '20px', textAlign: 'center', fontSize: '0.7rem', color: '#444', letterSpacing: '1px' }}>
          ZYNETHIC ECOSYSTEM 2026 - BUILDING THE FUTURE OF AI + WEB3
        </div>
      </main>
    </div>
  );
}
