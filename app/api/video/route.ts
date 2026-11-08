
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

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: "Video generation failed" },
      { status: 500 }
    );
  }
}
