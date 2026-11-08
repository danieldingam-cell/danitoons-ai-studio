
import { uploadToCloudinary } from "../../../lib/cloudinary";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Please upload an image" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(file);

    return Response.json({
      success: true,
      imageUrl: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return Response.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}
