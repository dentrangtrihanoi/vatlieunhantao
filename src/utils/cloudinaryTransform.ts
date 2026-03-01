/**
 * Transforms Cloudinary image URLs in HTML content to add automatic
 * format (f_auto → WebP/AVIF) and quality optimization (q_auto).
 *
 * Before: /image/upload/v1234/rich-text/image.jpg
 * After:  /image/upload/f_auto,q_auto,w_800/v1234/rich-text/image.jpg
 */
export function transformCloudinaryImages(html: string | null | undefined): string {
    if (!html) return '';
    // Insert f_auto,q_auto,w_800 before the version segment (v{digits}/)
    return html.replace(
        /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/)/g,
        '$1f_auto,q_auto,w_800/$2'
    );
}
