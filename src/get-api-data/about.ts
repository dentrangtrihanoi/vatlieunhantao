import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

// get About Us data
export const getAboutUsData = unstable_cache(
    async () => {
        return await prisma.aboutUs.findMany({
            orderBy: { updatedAt: "desc" },
        });
    },
    ['about-us'], { tags: ['about-us'] }
);
