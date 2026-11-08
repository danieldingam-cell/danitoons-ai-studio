import { generateSpeech } from "../../../lib/elevenlabs";

export async function POST(request: Request) {
  try {
    const { text, voiceId } = await request.json();

    if (!text || !voiceId) {
      return Response.json(
        { error: "Text and voice ID are required" },
        { status: 400 }
      );
    }

    const audio = await generateSpeech(text, voiceId);

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Voice generation error:", error);

    return Response.json(
      { error: "Voice generation failed" },
      { status: 500 }
    );
  }
}
