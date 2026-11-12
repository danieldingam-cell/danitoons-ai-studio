
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const voices = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    const suffix = number === 1 ? "" : `_${number}`;
    const id = process.env[`ELEVENLABS_VOICE_ID${suffix}`];

    return id ? { id, name: `Character Voice ${number}` } : null;
  }).filter(Boolean);

  return NextResponse.json({ voices });
}

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    if (!text || typeof text !== "string" || text.length > 5000) {
      return NextResponse.json(
        { error: "Enter text between 1 and 5000 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    const allowedVoices = Array.from({ length: 20 }, (_, index) => {
      const number = index + 1;
      const suffix = number === 1 ? "" : `_${number}`;
      return process.env[`ELEVENLABS_VOICE_ID${suffix}`];
    }).filter((id): id is string => Boolean(id));

    if (!apiKey || !allowedVoices.length) {
      return NextResponse.json(
        { error: "ElevenLabs is not configured." },
        { status: 500 }
      );
    }

    const selectedVoice = voiceId || allowedVoices[0];

    if (!allowedVoices.includes(selectedVoice)) {
      return NextResponse.json(
        { error: "Please select a configured voice." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Voice generation failed." },
        { status: response.status }
      );
    }

    return new NextResponse(await response.arrayBuffer(), {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
