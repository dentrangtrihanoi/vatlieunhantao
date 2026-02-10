"use server";

import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";

export async function uploadImage(formData: FormData) {
    const file = formData.get("file") as File;

    if (!file) {
        throw new Error("No file provided");
    }

    try {
        const imageUrl = await uploadImageToCloudinary(file, "rich-text-content");
        return { success: true, url: imageUrl };
    } catch (error) {
        console.error("Image upload failed:", error);
        return { success: false, error: "Upload failed" };
    }
}
