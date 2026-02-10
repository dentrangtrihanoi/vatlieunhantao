import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const type = searchParams.get("type") || "all"; // 'all', 'products', 'blogs'

        if (!q || q.trim().length < 2) {
            return NextResponse.json({ results: [] });
        }

        const searchTerm = q.trim();
        console.log(`🔍 Searching for: "${searchTerm}" (Type: ${type})`);

        let products: any[] = [];
        let posts: any[] = [];

        // Search Products
        if (type === "all" || type === "products") {
            try {
                products = await prisma.product.findMany({
                    where: {
                        OR: [
                            { title: { contains: searchTerm, mode: "insensitive" } },
                            { shortDescription: { contains: searchTerm, mode: "insensitive" } },
                        ],
                        // Commented out robotsIndex to debug visibility
                        // robotsIndex: true,
                    },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        price: true,
                        discountedPrice: true,
                        shortDescription: true,
                        productVariants: {
                            take: 1,
                            select: { image: true },
                        },
                    },
                    take: 10,
                });
                console.log(`✅ Found ${products.length} products`);
            } catch (err) {
                console.error("❌ Error fetching products:", err);
            }
        }

        // Search Posts (Blogs)
        if (type === "all" || type === "blogs") {
            try {
                posts = await prisma.post.findMany({
                    where: {
                        title: { contains: searchTerm, mode: "insensitive" },
                        robotsIndex: true,
                    },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        mainImage: true,
                    },
                    take: 5,
                });
                console.log(`✅ Found ${posts.length} posts`);
            } catch (err) {
                console.error("❌ Error fetching posts:", err);
            }
        }

        // Standardize Results
        const formattedProducts = products.map((p) => ({
            objectID: p.id,
            name: p.title,
            url: `/product/${p.slug}`,
            image: p.productVariants[0]?.image || null,
            price: Number(p.price),
            discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
            shortDescription: p.shortDescription,
            type: "products",
        }));

        const formattedPosts = posts.map((p) => ({
            objectID: p.id,
            name: p.title,
            url: `/blog/${p.slug}`,
            image: p.mainImage,
            shortDescription: "",
            type: "blogs",
        }));

        // Combine
        const results = [...formattedProducts, ...formattedPosts];

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search API Critical Error:", error);
        return NextResponse.json({ results: [], error: "Internal Server Error" }, { status: 500 });
    }
}
