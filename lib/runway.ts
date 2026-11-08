
const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;
const RUNWAY_BASE_URL = "https://api.dev.runwayml.com/v1";
const RUNWAY_VERSION = "2024-11-06";

async function runwayRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  if (!RUNWAY_API_KEY) {
    throw new Error("RUNWAY_API_KEY is not configured.");
  }

  const response = await fetch(
    `${RUNWAY_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${RUNWAY_API_KEY}`,
        "Content-Type": "application/json",
        "X-Runway-Version": RUNWAY_VERSION,
        ...options.headers,
      },
      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || `Runway API error: ${response.status}`
    );
  }

  return data;
}

// Start image-to-video generation
export async function generateVideo(
  prompt: string,
  imageUrl: string
) {
  if (!prompt?.trim()) {
    throw new Error("Please provide a video prompt.");
  }

  if (!imageUrl?.startsWith("https://")) {
    throw new Error("A valid HTTPS image URL is required.");
  }

  const result = await runwayRequest(
    "/image_to_video",
    {
      method: "POST",
      body: JSON.stringify({
        model: "gen4_turbo",
        promptText: prompt.trim(),
        promptImage: imageUrl,
        duration: 5,
      }),
    }
  );

  return result;
}

// Check video generation status
export async function getVideoStatus(taskId: string) {
  if (!taskId?.trim()) {
    throw new Error("A valid Runway task ID is required.");
  }

  return await runwayRequest(
    `/tasks/${encodeURIComponent(taskId)}`
  );
}
