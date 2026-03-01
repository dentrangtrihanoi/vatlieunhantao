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

/**
 * Find an available public_id. If "folder/name" exists, try "folder/name-1", "folder/name-2", etc.
 */
async function findAvailablePublicId(folder: string, baseName: string): Promise<string> {
  const base = `${folder}/${baseName}`;

  for (let i = 0; i <= 99; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    try {
      await cloudinary.api.resource(candidate);
      // Resource exists → try next suffix
    } catch {
      // Not found → this public_id is available
      return candidate;
    }
  }

  // Fallback: append timestamp if all 100 attempts fail
  return `${base}-${Date.now()}`;
}

export async function uploadImageToCloudinary(
  file: File,
  folder: string = "next-merce-admin-uploads"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Get base name without extension and sanitize
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  const baseName = sanitizeFilename(nameWithoutExt);

  // Find available sequential public_id
  const publicId = await findAvailablePublicId(folder, baseName);

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
          reject(error);
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
