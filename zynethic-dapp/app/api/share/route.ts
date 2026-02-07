import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

// LAPIS KEAMANAN: Alamat Admin resmi ZYNETHIC
const AUTHORIZED_ADMIN = "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b";

export async function POST(req: Request) {
  try {
    // Menambahkan adminAddress ke dalam payload yang diterima
    const { proposalTitle, resultA, resultB, totalVotes, adminAddress } = await req.json();

    // KEAMANAN LAPIS 1: Verifikasi Alamat Admin di Sisi Server
    if (!adminAddress || adminAddress.toLowerCase() !== AUTHORIZED_ADMIN.toLowerCase()) {
      console.warn(`Unauthorized attempt from: ${adminAddress}`);
      return NextResponse.json(
        { success: false, error: "Access Denied: Only ZYNETHIC Admin can perform this action." },
        { status: 403 }
      );
    }

    // KEAMANAN LAPIS 2: Validasi Ketersediaan Kunci API (Vercel Env)
    if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Server Configuration Error: API Keys missing." },
        { status: 500 }
      );
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Template Tweet ZYNETHIC - Membangun masa depan AI + Web3
    const tweetText = `🏛️ ZYNETHIC GOVERNANCE UPDATE

Proposal: ${proposalTitle}
Status: ✅ CLOSED

Final Results:
• Option A: ${resultA}%
• Option B: ${resultB}%
• Total Weight: ${totalVotes.toLocaleString()} $ZNTC

The voting results are officially finalized. ZYNETHIC community has reached a consensus. Initiating the next phase of AI + Web3 evolution on @Base... 🚀

Check: zynethic.xyz #ZYNETHIC #ZNTC #BuildOnBase #AI`;

    // Proses kirim ke Twitter (X)
    await client.v2.tweet(tweetText);

    return NextResponse.json({ success: true, message: 'Tweet sent successfully!' });
  } catch (error: unknown) {
    console.error('Twitter API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message || 'Failed to send tweet' 
    }, { status: 500 });
  }
}
