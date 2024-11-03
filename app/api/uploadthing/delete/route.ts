import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { imageKey } = await req.json();

    if (!imageKey) {
      return new NextResponse("Image key is required", { status: 400 });
    }

    // Hapus ekstensi file jika ada
    const publicId = imageKey.split(".")[0];
    console.log("Attempting to delete image with public ID:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return NextResponse.json({ success: true });
    } else {
      console.error("Failed to delete image in Cloudinary:", result);
      return new NextResponse("Failed to delete image", { status: 500 });
    }
  } catch (error: unknown) {
    console.error("Error at uploadthing/delete:", error);

    // Memeriksa apakah error memiliki properti 'message'
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Internal Server Error: ${errorMessage}`, {
      status: 500,
    });
  }
}
