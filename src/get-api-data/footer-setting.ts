import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prismaDB";

export const getFooterSettings = unstable_cache(
    async () => {
        try {
            let settings = await prisma.footerSetting.findFirst();

            if (!settings) {
                settings = await prisma.footerSetting.create({
                    data: {
                        companyName: "Cozy Commerce",
                        address: "123 Main St, City, Country",
                        email: "support@example.com",
                        phone: "+1234567890",
                        quickLinks: [],
                    },
                });
            }

            return settings;
        } catch (error) {
            console.error("Error fetching footer settings:", error);
            return null;
        }
    },
    ["footer-setting"],
    { tags: ["footer-setting"] }
);
