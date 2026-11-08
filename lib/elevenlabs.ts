
const API_KEY = process.env.ELEVENLABS_API_KEY!;

export async function generateSpeech(
  text: string,
  voiceId: string
) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Voice generation failed");
  }

  return await response.arrayBuffer();
}
