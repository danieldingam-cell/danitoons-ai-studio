
import { createHash } from "crypto";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function uploadToCloudinary(file: File) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload a valid image.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be smaller than 10 MB.");
  }

  const timestamp = Math.floor(Date.now() / 1000);

  const signatureString =
    `timestamp=${timestamp}${API_SECRET}`;

  const signature = createHash("sha1")
    .update(signatureString)
    .digest("hex");

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Cloudinary upload failed."
    );
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
      }

      
