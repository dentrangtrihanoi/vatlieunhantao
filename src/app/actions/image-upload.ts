"use server";

import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get("file") as File;

        if (!file || !(file instanceof File)) {
            return { success: false, error: "Không tìm thấy file" };
        }

        const imageUrl = await uploadImageToCloudinary(file, "rich-text-content");
        return { success: true, url: imageUrl };
    } catch (error: any) {
        console.error("Image upload failed:", error);
        return { success: false, error: error?.message || "Upload thất bại" };
    }
}
