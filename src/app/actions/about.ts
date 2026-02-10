"use server";
import { authenticate } from "@/lib/auth";
import { prisma } from "@/lib/prismaDB";
import { errorResponse, successResponse } from "@/lib/response";
import { revalidateTag } from "next/cache";

// create a about us
export async function createAboutUs(formData: FormData) {
    try {
        // check if user is authenticated
        const session = await authenticate();
        if (!session) return errorResponse(401, "Unauthorized");

        // get form data
        const title = formData.get("title") as string;
        const subtitle = formData.get("subtitle") as string;
        const description = formData.get("description") as string;
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;
        const robotsIndex = formData.get("robotsIndex") === "true";
        const robotsFollow = formData.get("robotsFollow") === "true";

        // check if required fields are present
        if (!title || !description) {
            return errorResponse(400, "Title and description are required");
        }

        // create about us
        const aboutUs = await prisma.aboutUs.create({
            data: {
                title,
                subtitle,
                description,
                metaTitle,
                metaDescription,
                robotsIndex,
                robotsFollow,
            },
        });

        // revalidate cache
        revalidateTag("about-us", { expire: 0 });

        // return success response
        return successResponse(201, "About us created successfully", aboutUs);
    } catch (error: any) {
        console.error("Error creating about us:", error?.stack || error);
        return errorResponse(500, error?.message || "Internal server error");
    }
};

// update about us
export async function updateAboutUs(aboutUsId: string, formData: FormData) {
    try {
        // check if user is authenticated
        const session = await authenticate();
        if (!session) return errorResponse(401, "Unauthorized");

        // get form data
        const title = formData.get("title") as string;
        const subtitle = formData.get("subtitle") as string;
        const description = formData.get("description") as string;
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;
        const robotsIndex = formData.get("robotsIndex") === "true";
        const robotsFollow = formData.get("robotsFollow") === "true";

        // check if required fields are present
        if (!title || !description) {
            return errorResponse(400, "Title and description are required");
        }

        // update about us
        const aboutUs = await prisma.aboutUs.update({
            where: {
                id: parseInt(aboutUsId),
            },
            data: {
                title,
                subtitle,
                description,
                metaTitle,
                metaDescription,
                robotsIndex,
                robotsFollow,
            },
        });

        // revalidate cache
        revalidateTag("about-us", { expire: 0 });

        // return success response
        return successResponse(200, "About us updated successfully", aboutUs);
    } catch (error: any) {
        console.error("Error updating about us:", error?.stack || error);
        return errorResponse(500, error?.message || "Internal server error");
    }
};
