import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { verifyMessage } from 'viem';

const AUTHORIZED_ADMIN = "0x553E1479999432aBF4D7c4aD613faac6b62Fcb5b";

export async function POST(req: Request) {
  try {
    const { proposalTitle, resultA, resultB, totalVotes, adminAddress, signature, message } = await req.json();

    // SECURE LAYER 1: Admin Address Enforcement
    if (!adminAddress || adminAddress.toLowerCase() !== AUTHORIZED_ADMIN.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Unauthorized entity." },
        { status: 403 }
      );
    }

    // SECURE LAYER 2: Cryptographic Signature & Replay Prevention
    if (!signature || !message) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Cryptographic proof missing." },
        { status: 401 }
      );
    }

    // Anti-Replay Check: Validate timestamp in message body (Max age: 5 minutes)
    const timestampMatch = message.match(/Timestamp:\s*(\d+)/);
    if (timestampMatch) {
      const msgTimestamp = parseInt(timestampMatch[1], 10);
      const currentTime = Date.now();
      if (isNaN(msgTimestamp) || currentTime - msgTimestamp > 300000) {
        return NextResponse.json(
          { success: false, error: "Access Denied: Signature expired (Replay Attack Protection)." },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Access Denied: Malformed authentication message." },
        { status: 400 }
      );
    }

    const isValid = await verifyMessage({
      address: AUTHORIZED_ADMIN as `0x${string}`,
      message: message,
      signature: signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Invalid signature verification." },
        { status: 401 }
      );
    }

    // SECURE LAYER 3: Twitter API Credentials Check
    if (
      !process.env.TWITTER_CONSUMER_KEY ||
      !process.env.TWITTER_CONSUMER_SECRET ||
      !process.env.TWITTER_ACCESS_TOKEN ||
      !process.env.TWITTER_ACCESS_SECRET
    ) {
      return NextResponse.json(
        { success: false, error: "Service configuration error: Credentials uninitialized." },
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

    return NextResponse.json({ success: true, message: 'Broadcast successful!' });
  } catch (error: unknown) {
    console.error('Twitter API Error:', error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ 
      success: false, 
      error: 'Execution failed due to API rate limits or security parameters.' 
    }, { status: 500 });
  }
}
