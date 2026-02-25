import { MetadataRoute } from "next";
import { prisma } from "@/lib/prismaDB";

const BASE_URL = process.env.SITE_URL || "https://xinghiepcokhi.info";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages (always indexed)
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Product pages — only where robotsIndex = true
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const products = await prisma.product.findMany({
            where: { robotsIndex: true },
            select: { slug: true, updatedAt: true },
        });
        productPages = products.map((product) => ({
            url: `${BASE_URL}/${product.slug}`,
            lastModified: product.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch {
        // DB unavailable
    }

    // Blog post pages — only where robotsIndex = true
    let blogPages: MetadataRoute.Sitemap = [];
    try {
        const posts = await prisma.post.findMany({
            where: { robotsIndex: true },
            select: { slug: true, updatedAt: true },
        });
        blogPages = posts.map((post) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        }));
    } catch {
        // DB unavailable
    }


    // Category pages — /{cat.slug} (same [slug] route handles categories)
    let categoryPages: MetadataRoute.Sitemap = [];
    try {
        const categories = await prisma.category.findMany({
            select: { slug: true, updatedAt: true },
        });
        categoryPages = categories.map((cat) => ({
            url: `${BASE_URL}/${cat.slug}`,
            lastModified: cat.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        }));
    } catch {
        // DB unavailable
    }

    return [...staticPages, ...productPages, ...blogPages, ...categoryPages];
}
