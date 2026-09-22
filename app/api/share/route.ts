import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { verifyMessage } from 'viem';

// Alamat Admin resmi ZYNETHIC
const AUTHORIZED_ADMIN = "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b";

export async function POST(req: Request) {
  try {
    const { proposalTitle, resultA, resultB, totalVotes, adminAddress, signature, message } = await req.json();

    // KEAMANAN LAPIS 1: Verifikasi Alamat Admin
    if (!adminAddress || adminAddress.toLowerCase() !== AUTHORIZED_ADMIN.toLowerCase()) {
      console.warn(`Unauthorized attempt from: ${adminAddress}`);
      return NextResponse.json(
        { success: false, error: "Access Denied: Only ZYNETHIC Admin can perform this action." },
        { status: 403 }
      );
    }

    // KEAMANAN LAPIS 2: Verifikasi Kriptografi (Cryptographic Signature)
    if (!signature || !message) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Missing cryptographic signature or message." },
        { status: 401 }
      );
    }

    const isValid = await verifyMessage({
      address: AUTHORIZED_ADMIN as `0x${string}`,
      message: message,
      signature: signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Invalid signature provided." },
        { status: 401 }
      );
    }

    // KEAMANAN LAPIS 3: Validasi Ketersediaan API Keys
    if (
      !process.env.TWITTER_CONSUMER_KEY ||
      !process.env.TWITTER_CONSUMER_SECRET ||
      !process.env.TWITTER_ACCESS_TOKEN ||
      !process.env.TWITTER_ACCESS_SECRET
    ) {
      return NextResponse.json(
        { success: false, error: "Server Configuration Error: Twitter API Keys missing." },
        { status: 500 }
      );
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    const formattedVotes = typeof totalVotes === 'number' ? totalVotes.toLocaleString() : totalVotes;

    const tweetText = `🏛️ ZYNETHIC GOVERNANCE UPDATE\n\nProposal: ${proposalTitle}\nStatus: ✅ CLOSED\n\nFinal Results:\n• Option A: ${resultA}%\n• Option B: ${resultB}%\n• Total Weight: ${formattedVotes} $ZNTC\n\nThe voting results are officially finalized. ZYNETHIC community has reached a consensus.\n\nInitiating the next phase of AI + Web3 evolution on @Base... 🚀\n\nCheck: zynethic.xyz\n#ZYNETHIC #ZNTC #BuildOnBase #AI`;

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
