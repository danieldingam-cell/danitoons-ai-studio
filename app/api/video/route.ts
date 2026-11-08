
import {
  generateVideo,
  getVideoStatus,
} from "../../../lib/runway";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { prompt, imageUrl } = body;

    if (!prompt || !imageUrl) {
      return NextResponse.json(
        { error: "Prompt and image URL are required." },
        { status: 400 }
      );
    }

    const result = await generateVideo(prompt, imageUrl);

    return NextResponse.json({
      success: true,
      taskId: result.id,
      status: result.status,
      video: result,
    });
  } catch (error) {
    console.error("Video generation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Video generation failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 }
      );
    }

    const result = await getVideoStatus(taskId);

    return NextResponse.json({
      success: true,
      task: result,
      status: result.status,
      videoUrl: result.output?.[0] ?? null,
    });
  } catch (error) {
    console.error("Video status error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to check video status.",
      },
      { status: 500 }
    );
  }
}

