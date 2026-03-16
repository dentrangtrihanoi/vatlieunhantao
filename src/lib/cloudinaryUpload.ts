import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sanitize filename: lowercase, spaces → hyphens, strip special chars
 * e.g. "Đèn Trang Trí.jpg" → "den-trang-tri"
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9._-]/g, "-")  // Replace invalid chars with -
    .replace(/-+/g, "-")            // Collapse multiple dashes
    .replace(/^-|-$/g, "");         // Trim leading/trailing dashes
}


export async function uploadImageToCloudinary(
  file: File,
  folder: string = "next-merce-admin-uploads"
): Promise<string> {
  // Validate env vars early for clear error messages
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      `Missing Cloudinary environment variables: ${[
        !cloudName && "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
        !apiKey && "CLOUDINARY_API_KEY",
        !apiSecret && "CLOUDINARY_API_SECRET",
      ]
        .filter(Boolean)
        .join(", ")}`
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Get base name without extension and sanitize
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  const baseName = sanitizeFilename(nameWithoutExt) || "image";

  // Use timestamp + random suffix for unique public_id (no Admin API needed)
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const publicId = `${folder}/${baseName}-${uniqueSuffix}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        format: "webp",
        quality: "auto",
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload error: ${error.message}`));
        } else {
          resolve(result?.secure_url as string);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImageFromCloudinary(imageUrl: string) {
  // Extract public_id from URL (works with both old random IDs and new named IDs)
  const regex = /\/upload\/(?:v\d+\/)?([^.]+)/;
  const matches = imageUrl.match(regex);

  if (matches && matches[1]) {
    const publicId = matches[1];
    return cloudinary.uploader.destroy(publicId);
  } else {
    throw new Error("Invalid Cloudinary URL");
  }
}
