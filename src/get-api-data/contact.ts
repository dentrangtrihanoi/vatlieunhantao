import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

export const getContactPage = unstable_cache(
    async () => {
        return await prisma.contactPage.findMany();
    },
    ['contact-page'], { tags: ['contact-page'] }
);
