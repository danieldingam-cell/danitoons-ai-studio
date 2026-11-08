
const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY!;

export async function generateVideo(
  prompt: string,
  imageUrl: string
) {
  const response = await fetch(
    "https://api.dev.runwayml.com/v1/image_to_video",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RUNWAY_API_KEY}`,
        "Content-Type": "application/json",
        "X-Runway-Version": "2024-11-06",
      },
      body: JSON.stringify({
        model: "gen4_turbo",
        promptText: prompt,
        promptImage: imageUrl,
        duration: 5,
        ratio: "1280:720",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Video generation failed");
  }

  return await response.json();
}
