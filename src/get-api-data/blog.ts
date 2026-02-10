import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";


// get all blogs
export const getBlogs = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    });
  },
  ['posts'], { tags: ['posts'] }
);

// GET POST CATEGORY
export const getPostCategory = unstable_cache(
  async () => {
    const postCategories = await prisma.postCategory.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: {
            posts: true
          }
        },
      }
    });
    return postCategories.map((item) => ({
      ...item,
      postCounts: item._count.posts
    }))
  },
  ['postCategories'], { tags: ['postCategories'] }
);

// GET POST TAGS
export const getPostTags = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      select: {
        tags: true
      }
    });
  },
  ['posts'], { tags: ['posts'] }
);

// GET SINGLE BLOG
export const getSingleBlog = unstable_cache(
  async (slug: string) => {
    return await prisma.post.findUnique({
      where: {
        slug: slug
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            bio: true
          }
        }
      }
    });
  },
  ['posts'], { tags: ['posts'] }
);

// GET POSTS BY CATEGORY
export const getPostsByCategory = unstable_cache(
  async (slug: string) => {
    return await prisma.post.findMany({
      where: {
        category: {
          slug: slug
        }
      }
    });
  },
  ['posts'], { tags: ['posts'] }
);

// GET CATEGORY BY SLUG
export const getPostCategoryBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.postCategory.findUnique({
      where: {
        slug: slug
      }
    });
  },
  ['postCategories'], { tags: ['postCategories'] }
);

// GET POST CATEGORIES
export const getPostCategories = unstable_cache(
  async () => {
    return await prisma.postCategory.findMany({
      orderBy: { updatedAt: "desc" },
    });
  },
  ['postCategories'], { tags: ['postCategories'] }
);

// GET POST BY TAG
export const getPostsByTag = unstable_cache(
  async (slug: string) => {
    return await prisma.post.findMany({
      where: {
        tags: {
          has: slug
        }
      }
    });
  },
  ['posts'], { tags: ['posts'] }
)

// GET RELATED POSTS BY TAGS
export const getRelatedPosts = unstable_cache(
  async (currentPostId: string, tags: string[], limit: number = 4) => {
    if (!tags || tags.length === 0) {
      return [];
    }

    const candidates = await prisma.post.findMany({
      where: {
        id: { not: currentPostId },
        tags: { hasSome: tags },
      },
      take: 50, // Fetch a larger pool for randomness
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        mainImage: true,
        metadata: true,
        tags: true,
        createdAt: true,
      },
    });

    // Fisher-Yates Shuffle
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    return candidates.slice(0, limit);
  },
  ['posts'], { tags: ['posts'] }
);

// GET RANDOM BLOGS
export const getRandomBlogs = unstable_cache(
  async (limit: number = 4) => {
    const candidates = await prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50, // Fetch a larger pool for randomness
      select: {
        id: true,
        title: true,
        slug: true,
        mainImage: true,
        metadata: true,
        createdAt: true,
        body: true,
      },
    });

    // Fisher-Yates Shuffle
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    return candidates.slice(0, limit);
  },
  ['posts'], { tags: ['posts'] }
);