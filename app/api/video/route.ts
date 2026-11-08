
import { generateVideo } from "../../../lib/runway";

export async function POST(request: Request) {
  try {
    const { prompt, imageUrl } = await request.json();

    if (!prompt || !imageUrl) {
      return Response.json(
        { error: "Prompt and image are required" },
        { status: 400 }
      );
    }

    const result = await generateVideo(prompt, imageUrl);

    return Response.json({
      success: true,
      video: result,
    });
  } catch (error) {
    console.error("Video generation error:", error);

    return Response.json(
      { error: "Unable to generate video" },
      { status: 500 }
    );
  }
}


