import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prismaDB';

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
        // Dynamic product pages
        const products = await prisma.product.findMany({
            select: { slug: true, updatedAt: true },
        });
        const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
            url: `${BASE_URL}/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // Dynamic blog posts
        const posts = await prisma.post.findMany({
            select: { slug: true, updatedAt: true },
        });
        const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
            url: `${BASE_URL}/blog/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

        // Dynamic category pages
        const categories = await prisma.category.findMany({
            select: { slug: true, updatedAt: true },
        });
        const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
            url: `${BASE_URL}/categories/${c.slug}`,
            lastModified: c.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        return [...staticRoutes, ...productRoutes, ...postRoutes, ...categoryRoutes];
    } catch {
        // DB not available, return static routes only
        return staticRoutes;
    }
}
