import { NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: false, error: "Không tìm thấy file" }, { status: 400 });
    }

    // Convert to File if it's a raw Blob
    const blob = file as Blob;
    const fileObj = file instanceof File
      ? file
      : new File([blob], "upload.jpg", { type: blob.type || "image/jpeg" });

    const imageUrl = await uploadImageToCloudinary(fileObj, "rich-text-content");
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: any) {
    console.error("Image upload API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Upload thất bại" },
      { status: 500 }
    );
  }
}
