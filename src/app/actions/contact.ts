"use server";
import { authenticate } from "@/lib/auth";
import { prisma } from "@/lib/prismaDB";
import { errorResponse, successResponse } from "@/lib/response";
import { revalidateTag } from "next/cache";

// create a contact page (if not exists, though usually we seed or create once)
export async function createContactPage(formData: FormData) {
    try {
        const session = await authenticate();
        if (!session) return errorResponse(401, "Unauthorized");

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;
        const robotsIndex = formData.get("robotsIndex") === "true";
        const robotsFollow = formData.get("robotsFollow") === "true";

        if (!title || !description) {
            return errorResponse(400, "Title and description are required");
        }

        const contactPage = await prisma.contactPage.create({
            data: {
                title,
                description,
                metaTitle,
                metaDescription,
                robotsIndex,
                robotsFollow,
            },
        });

        revalidateTag("contact-page", { expire: 0 });
        return successResponse(201, "Contact page created successfully", contactPage);
    } catch (error: any) {
        console.error("Error creating contact page:", error?.stack || error);
        return errorResponse(500, error?.message || "Internal server error");
    }
};

// update contact page
export async function updateContactPage(id: string, formData: FormData) {
    try {
        const session = await authenticate();
        if (!session) return errorResponse(401, "Unauthorized");

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;
        const robotsIndex = formData.get("robotsIndex") === "true";
        const robotsFollow = formData.get("robotsFollow") === "true";

        if (!title || !description) {
            return errorResponse(400, "Title and description are required");
        }

        const contactPage = await prisma.contactPage.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title,
                description,
                metaTitle,
                metaDescription,
                robotsIndex,
                robotsFollow,
            },
        });

        revalidateTag("contact-page", { expire: 0 });
        return successResponse(200, "Contact page updated successfully", contactPage);
    } catch (error: any) {
        console.error("Error updating contact page:", error?.stack || error);
        return errorResponse(500, error?.message || "Internal server error");
    }
};
