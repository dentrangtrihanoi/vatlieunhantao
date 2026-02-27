import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = process.env.SITE_URL || 'https://xinghiepcokhi.info';
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api/', '/cart', '/checkout', '/wishlist'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
