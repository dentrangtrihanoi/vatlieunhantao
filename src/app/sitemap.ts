import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prismaDB';

// Cache for 24 hours; invalidated on-demand when content changes
export const revalidate = 86400;

const BASE_URL = process.env.SITE_URL || 'https://xinghiepcokhi.info';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ];

    try {
        // Only include products with robotsIndex: true
        const products = await prisma.product.findMany({
            select: { slug: true, updatedAt: true },
            where: { robotsIndex: true },
        });
        const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
            url: `${BASE_URL}/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // Only include posts with robotsIndex: true
        const posts = await prisma.post.findMany({
            select: { slug: true, updatedAt: true },
            where: { robotsIndex: true },
        });
        const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
            url: `${BASE_URL}/blog/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

        // Only include categories with robotsIndex: true
        const categories = await prisma.category.findMany({
            select: { slug: true, updatedAt: true },
            where: { robotsIndex: true },
        });
        const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
            url: `${BASE_URL}/${c.slug}`,
            lastModified: c.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.9,
        }));

        return [...staticRoutes, ...productRoutes, ...postRoutes, ...categoryRoutes];
    } catch {
        return staticRoutes;
    }
}
