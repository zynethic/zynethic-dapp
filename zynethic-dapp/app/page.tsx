'use client';

export default function Page() {
  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#010409', minHeight: '100vh' }}>
      {/* Mengimpor Font dan Style Identik dengan Landing Page */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        :root {
            --primary-bg: #010409; 
            --base-blue: #0052ff; 
            --base-glow: #00f7ff; 
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --glass-bg: rgba(10, 17, 32, 0.7);
            --glass-border: rgba(255, 255, 255, 0.1);
            --blue-shadow: 0 0 25px rgba(0, 82, 255, 0.3);
        }

        body { 
            background-color: var(--primary-bg); 
            color: var(--text-main); 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            margin: 0; 
        }

        .dapp-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            background: radial-gradient(circle at center, rgba(0, 82, 255, 0.1) 0%, transparent 70%);
        }

        .navbar { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 15px 8%; 
            position: fixed; 
            width: 100%; 
            top: 0; 
            z-index: 1000; 
            box-sizing: border-box; 
            background: rgba(1, 4, 9, 0.85); 
            backdrop-filter: blur(15px); 
            border-bottom: 1px solid var(--glass-border); 
        }

        .logo-text { 
            font-weight: 800; 
            font-size: 1.4rem; 
            letter-spacing: 1px; 
            text-transform: uppercase; 
        }
        
        .logo-text span { color: var(--base-blue); }

        .dapp-card {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(20px);
            border-radius: 30px;
            padding: 60px 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 40px 100px rgba(0,0,0,0.4);
            margin-top: 80px;
        }

        .status-badge {
            background: rgba(0, 82, 255, 0.1);
            color: var(--base-glow);
            padding: 8px 20px;
            border-radius: 30px;
            font-size: 0.75rem;
            font-weight: 800;
            border: 1px solid rgba(0, 247, 255, 0.2);
            display: inline-block;
            margin-bottom: 25px;
            text-transform: uppercase;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin: 0 0 15px 0;
            background: linear-gradient(135deg, #fff 30%, var(--base-blue) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            color: var(--text-dim);
            font-weight: 500;
            margin-bottom: 40px;
        }

        .btn-connect {
            background: var(--base-blue);
            color: #fff;
            padding: 16px 40px;
            border-radius: 14px;
            font-weight: 700;
            text-decoration: none;
            display: block;
            transition: 0.4s;
            border: none;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0, 82, 255, 0.4);
            font-size: 1rem;
        }

        .btn-connect:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0, 82, 255, 0.6);
            background: #1a66ff;
        }

        .footer-text {
            margin-top: 40px;
            font-size: 0.75rem;
            color: var(--text-dim);
            letter-spacing: 2px;
            text-transform: uppercase;
        }
      ` }} />

      {/* Konten dApp */}
      <nav className="navbar">
        <div className="logo-text">ZYNE<span>THIC</span></div>
        <div style={{ fontSize: '0.7rem', color: 'var(--base-glow)', fontWeight: 800 }}>DAPP BETA</div>
      </nav>

      <div className="dapp-container">
        <div className="dapp-card">
          <div className="status-badge">
            <i className="fa-solid fa-circle-nodes" style={{ marginRight: '8px' }}></i>
            Network: Base Mainnet
          </div>
          
          <h1>$ZNTC dApp</h1>
          <p>The gateway to Decentralized Intelligence. Connecting you to the ZYNETHIC Ecosystem.</p>
          
          <button className="btn-connect" onClick={() => alert('Integrasi Wallet Segera Hadir!')}>
            <i className="fa-solid fa-wallet" style={{ marginRight: '10px' }}></i>
            CONNECT WALLET
          </button>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
             <a href="https://x.com/zynethic" target="_blank" style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}><i className="fa-brands fa-x-twitter"></i></a>
             <a href="https://t.me/zynethic_global_community" target="_blank" style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}><i className="fa-brands fa-telegram"></i></a>
          </div>
        </div>
        
        <div className="footer-text">Built on Base L2</div>
      </div>
    </div>
  );
}
