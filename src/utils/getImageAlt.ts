/**
 * Returns appropriate alt text for an image.
 * Use for content images. For decorative images, use alt="" directly.
 *
 * @param imageAlt - Custom alt text from DB (may be null/empty)
 * @param fallback - Fallback text (e.g. product title, post title)
 */
export function getImageAlt(imageAlt?: string | null, fallback?: string): string {
  return imageAlt?.trim() || fallback || "";
}
