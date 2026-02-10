import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

export const getTestimonials = unstable_cache(
    async () => {
        return await prisma.testimonial.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    ["testimonials"],
    { tags: ["testimonials"] }
);

export const getTestimonialById = async (id: string) => {
    if (!id) return null;
    return await prisma.testimonial.findUnique({
        where: { id },
    });
};
