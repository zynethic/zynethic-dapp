// lib/ai-assistant.ts

export interface AIChatContext {
  livePrice: string;
  sentiment: string;
  burned: number;
  userBalance: number;
}

/**
 * Fungsi ini bertugas mengirimkan pesan pengguna dan data konteks real-time
 * ke API Route internal kita.
 */
export async function fetchAIResponse(userPrompt: string, context: AIChatContext): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userPrompt,
        context: {
          livePrice: context.livePrice,
          sentiment: context.sentiment,
          burned: context.burned,
          userBalance: context.userBalance,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("ZYNETHIC AI Error:", error);
    return "I am experiencing a sync issue with Base nodes. Please verify your connection and try again later.";
  }
}
