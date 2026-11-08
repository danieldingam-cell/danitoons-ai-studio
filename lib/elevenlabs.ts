
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

export async function generateSpeech(
  text: string,
  voiceId?: string
) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ElevenLabs API key is missing.");
  }

  if (!text?.trim()) {
    throw new Error("Please provide text for the character to speak.");
  }

  if (text.length > 5000) {
    throw new Error("Text must not exceed 5000 characters.");
  }

  const selectedVoice = voiceId || DEFAULT_VOICE_ID;

  if (!selectedVoice) {
    throw new Error("ElevenLabs voice ID is missing.");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(selectedVoice)}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs error: ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();

  return Buffer.from(audioBuffer);
    }
