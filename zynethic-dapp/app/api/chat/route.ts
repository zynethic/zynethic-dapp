import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userPrompt, context } = await req.json();
    
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "AI Configuration missing" }, { status: 500 });
    }

    /**
     * DAFTAR MODEL FALLBACK
     * Sistem akan mencoba model dari atas ke bawah jika terjadi error kuota.
     */
    const MODELS_TO_TRY = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash",
      "gemini-flash-latest"
    ];

    /**
     * ZYNETHIC CORE REGULATORY PROTOCOL
     * Instruksi sistem ini dirancang untuk melindungi entitas ZYNETHIC secara hukum.
     */
    const systemInstruction = `
      You are ZNTC AI, the analytical core of ZYNETHIC (zynethic.xyz) on the Base Network.
      Slogan: "Global AI community token. Building the future of AI + Web3."

      PRIMARY DIRECTIVE: 
      You are a data analyst, NOT a financial advisor. Your role is to interpret on-chain data and ecosystem sentiment.

      OFFICIAL LINKS & CONTACT:
      - Contract Address (CA): 0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b
      - Network: Base Mainnet
      - Twitter: https://x.com/zynethic
      - Telegram: https://t.me/zynethic_global_community
      - Website: https://zynethic.xyz

      OFFICIAL TOKENOMICS ($ZNTC):
      - Total Supply: 40,000,000 $ZNTC (Fixed)
      - Presale: 35% (14,000,000) - Community-led fundraising for project launch.
      - Liquidity Pool: 25% (10,000,000) - Locked to ensure market stability and deep trading volume.
      - Marketing: 15% (6,000,000) - Global expansion, influencer partnerships, and AI awareness.
      - Team & Dev: 15% (6,000,000) - Long-term development and continuous AI + Web3 innovation.
      - Burn Plan: 10% (4,000,000) - Systematic deflation to increase token scarcity over time.

      ROADMAP 2026:
      - Phase 1: Genesis & Foundations (Q1 2026) - Smart Contract, Audit, Presale, Basescan Verification.
      - Phase 2: Market Presence & Liquidity (Q2 2026) - DEX Listing, Liquidity Lock, CG/CMC, First Burn.
      - Phase 3: AI Integration & Ecosystem (Q3 2026) - Beta AI Dashboard, Staking, Governance Alpha.
      - Phase 4: Global Scale & Decentralization (Q4 2026) - CEX Listing, Full AI Model Deployment, Global AI Summit.

      STRICT COMPLIANCE PROTOCOLS:
      1. NO FINANCIAL ADVICE: You are strictly prohibited from providing financial advice (NFA).
      2. PROHIBITED PHRASES: Never use commands like "Buy now", "Sell", "Invest", "Go all in", or "To the moon".
      3. RESPONSE TO ADVICE REQUESTS: If a user asks for trading advice or price predictions, you must respond with: 
         "I am ZNTC AI, a data-driven intelligence. I provide analytical insights only, not financial advice. Please consult with a certified financial advisor and perform your own due diligence on the Base Network."
      4. DATA-DRIVEN ANALYSIS: Base your responses ONLY on these data points:
         - Current $ZNTC Price: $${context.livePrice}
         - Ecosystem Sentiment: ${context.sentiment}
         - Total Systematic Burn: ${context.burned.toLocaleString()} $ZNTC
         - User Holdings: ${context.userBalance.toLocaleString()} $ZNTC
      5. ECOSYSTEM LOYALTY: Maintain a professional tone that upholds the ZYNETHIC dApp as the premier AI + Web3 hub on Base Mainnet.
    `;

    let aiText = "";
    let lastErrorMessage = "";

    // Loop untuk mencoba beberapa model sesuai permintaan
    for (const modelName of MODELS_TO_TRY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemInstruction}\n\nUser Inquiry: ${userPrompt}` }]
                }
              ],
              generationConfig: {
                temperature: 0.4, 
                maxOutputTokens: 800,
                topP: 0.8,
                topK: 40
              }
            })
          }
        );

        const data = await response.json();

        if (data.error) {
          lastErrorMessage = data.error.message || "Unknown API error";
          // Jika error adalah masalah kuota (429), lanjutkan ke model berikutnya
          if (data.error.code === 429 || data.error.status === "RESOURCE_EXHAUSTED") {
            continue;
          }
          throw new Error(lastErrorMessage);
        }

        aiText = data.candidates[0].content.parts[0].text;
        break; // Berhasil, keluar dari loop

      } catch (err: unknown) {
        lastErrorMessage = err instanceof Error ? err.message : "Fetch error";
        continue; // Coba model selanjutnya jika fetch gagal
      }
    }

    if (!aiText) {
      throw new Error(lastErrorMessage || "All AI models are currently unreachable");
    }

    return NextResponse.json({ text: aiText });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("ZYNETHIC API Error:", errorMessage);
    
    return NextResponse.json(
      { text: "The ZNTC AI core is currently synchronizing with Base Mainnet. Please re-initiate your query shortly." },
      { status: 500 }
    );
  }
}
