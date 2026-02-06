import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userPrompt, context } = await req.json();
    
    const API_KEY = process.env.GEMINI_API_KEY;
    // Menggunakan model 2.0 Flash untuk kecepatan dan kepatuhan instruksi yang lebih baik
    const MODEL = "gemini-2.0-flash"; 

    if (!API_KEY) {
      return NextResponse.json({ error: "AI Configuration missing" }, { status: 500 });
    }

    /**
     * ZYNETHIC CORE REGULATORY PROTOCOL
     * Instruksi sistem ini dirancang untuk melindungi entitas ZYNETHIC secara hukum.
     */
    const systemInstruction = `
      You are ZNTC AI, the analytical core of ZYNETHIC (zynethic.xyz) on the Base Network.
      Slogan: "Global AI community token. Building the future of AI + Web3."

      PRIMARY DIRECTIVE: 
      You are a data analyst, NOT a financial advisor. Your role is to interpret on-chain data and ecosystem sentiment.

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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
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
      throw new Error(data.error.message);
    }

    const aiText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ text: aiText });

  } catch (error: unknown) {
    // Menangani error tanpa menggunakan tipe 'any' untuk mematuhi ESLint
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("ZYNETHIC API Error:", errorMessage);
    
    return NextResponse.json(
      { text: "The ZNTC AI core is currently synchronizing with Base Mainnet. Please re-initiate your query shortly." },
      { status: 500 }
    );
  }
}
