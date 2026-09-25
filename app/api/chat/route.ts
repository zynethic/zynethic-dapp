import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userPrompt, context } = body;

    // Security Check: Input validation
    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json({ error: "Invalid inquiry format" }, { status: 400 });
    }

    // Limit length to prevent buffer exhaustion or malicious excessive context injection
    const sanitizedPrompt = userPrompt.trim().slice(0, 500);

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "AI Engine synchronizing..." }, { status: 500 });
    }

    const MODELS_TO_TRY = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash",
      "gemini-flash-latest"
    ];

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
      - Presale: 35% (14,000,000)
      - Liquidity Pool: 25% (10,000,000)
      - Marketing: 15% (6,000,000)
      - Team & Dev: 15% (6,000,000)
      - Burn Plan: 10% (4,000,000)

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
         - Current $ZNTC Price: $${context?.livePrice || '0.0000'}
         - Ecosystem Sentiment: ${context?.sentiment || 'Neutral'}
         - Total Systematic Burn: ${(context?.burned || 0).toLocaleString()} $ZNTC
         - User Holdings: ${(context?.userBalance || 0).toLocaleString()} $ZNTC
      5. ECOSYSTEM LOYALTY: Maintain a professional tone that upholds the ZYNETHIC dApp as the premier AI + Web3 hub on Base Mainnet.
    `;

    let aiText = "";

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
                  parts: [{ text: `${systemInstruction}\n\nUser Inquiry: ${sanitizedPrompt}` }]
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
          if (data.error.code === 429 || data.error.status === "RESOURCE_EXHAUSTED") {
            continue;
          }
          break;
        }

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiText = data.candidates[0].content.parts[0].text;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!aiText) {
      return NextResponse.json({
        text: "The ZNTC AI core is currently synchronizing with Base Mainnet. Please re-initiate your query shortly."
      });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: unknown) {
    console.error("ZYNETHIC API Exception:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { text: "The ZNTC AI core is currently synchronizing with Base Mainnet. Please re-initiate your query shortly." },
      { status: 500 }
    );
  }
}
