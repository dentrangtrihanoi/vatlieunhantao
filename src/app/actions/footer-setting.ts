"use server";

import { authenticate } from "@/lib/auth";
import { prisma } from "@/lib/prismaDB";
import { errorResponse, successResponse } from "@/lib/response";
import { revalidateTag } from "next/cache";

// Get Footer Settings (create default if not exists)
export const getFooterSettings = async () => {
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

        return successResponse(200, "Footer settings fetched successfully", settings);
    } catch (error: any) {
        console.error("Error fetching footer settings:", error?.stack || error);
        return errorResponse(500, error?.message || "Internal server error");
    }
};

// Update Footer Settings
export const updateFooterSettings = async (formData: FormData) => {
    try {
        // check if user is authenticated
        const session = await authenticate();
        if (!session) return errorResponse(401, "Unauthorized");

        const settings = await prisma.footerSetting.findFirst();
        if (!settings) {
            return errorResponse(404, "Footer settings not found");
        }

        const companyName = formData.get("companyName") as string;
        const address = formData.get("address") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;

        const facebookLink = formData.get("facebookLink") as string;
        const twitterLink = formData.get("twitterLink") as string;
        const instagramLink = formData.get("instagramLink") as string;
        const linkedinLink = formData.get("linkedinLink") as string;
        const pinterestLink = formData.get("pinterestLink") as string;

        const mapIframe = formData.get("mapIframe") as string;

        const quickLinksJson = formData.get("quickLinks") as string;
        let quickLinks = [];
        try {
            quickLinks = quickLinksJson ? JSON.parse(quickLinksJson) : [];
        } catch (e) {
            console.error("Error parsing quickLinks JSON", e);
        }

        const updatedSettings = await prisma.footerSetting.update({
            where: { id: settings.id },
            data: {
                companyName,
                address,
                email,
                phone,
                facebookLink,
                twitterLink,
                instagramLink,
                linkedinLink,
                pinterestLink,
                mapIframe,
                quickLinks,
            },
        });

        revalidateTag("footer-setting");
        return successResponse(200, "Footer settings updated successfully", updatedSettings);
    } catch (error: any) {
        console.error("Error updating footer settings:", error?.stack || error);
        return errorResponse(500, error?.message || "Internal server error");
    }
};
