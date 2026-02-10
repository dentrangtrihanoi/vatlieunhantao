"use server";

import { prisma } from "@/lib/prismaDB";
import { revalidatePath } from "next/cache";

export async function getBlogSettings() {
    try {
        let settings = await prisma.blogSettings.findFirst();

        if (!settings) {
            settings = await prisma.blogSettings.create({
                data: {
                    displayName: "Blog",
                    robotsIndex: true,
                    robotsFollow: true,
                },
            });
        }

        return settings;
    } catch (error) {
        console.error("Error fetching blog settings:", error);
        throw error;
    }
}

export async function updateBlogSettings(data: {
    displayName: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
}) {
    try {
        const settings = await prisma.blogSettings.findFirst();

        if (settings) {
            await prisma.blogSettings.update({
                where: { id: settings.id },
                data,
            });
        } else {
            await prisma.blogSettings.create({ data });
        }

        revalidatePath("/blog");
        revalidatePath("/admin/blog-settings");

        return { success: true };
    } catch (error) {
        console.error("Error updating blog settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}
