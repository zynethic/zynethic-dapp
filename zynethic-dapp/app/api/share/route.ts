import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(req: Request) {
  try {
    const { proposalTitle, resultA, resultB, totalVotes } = await req.json();

    // Mengambil kunci dari Vercel Environment Variables yang baru saja Anda buat
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Template Tweet ZYNETHIC
    const tweetText = `🏛️ ZYNETHIC GOVERNANCE UPDATE

Proposal: ${proposalTitle}
Status: ✅ CLOSED

Final Results:
• Option A: ${resultA}%
• Option B: ${resultB}%
• Total Weight: ${totalVotes.toLocaleString()} $ZNTC

The voting results are officially finalized. ZYNETHIC community has reached a consensus.... 🚀

Check: zynethic.xyz #ZYNETHIC #ZNTC #BuildOnBase #AI`;

    // Proses kirim ke Twitter
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
