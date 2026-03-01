/**
 * Transforms Cloudinary image URLs in HTML content to explicitly serve WebP.
 * Changes: /image/upload/v1234/image.jpg → /image/upload/f_webp,q_auto,w_800/v1234/image.webp
 *
 * - f_webp   → force WebP format (not just auto-detect by browser)
 * - q_auto   → auto quality (Cloudinary picks optimal compression)
 * - w_800    → max width 800px (resize oversized images)
 * - .webp    → extension changed so URL explicitly shows WebP
 */
export function transformCloudinaryImages(html: string | null | undefined): string {
    if (!html) return '';
    return html.replace(
        /(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/[^"'\s>]+)\.(jpg|jpeg|png)/gi,
        '$1f_webp,q_auto,w_800/$2.webp'
    );
}
