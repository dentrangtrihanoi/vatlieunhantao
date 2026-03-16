"use server";

import { authenticate } from "@/lib/auth";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { prisma } from "@/lib/prismaDB";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createTestimonial(formData: FormData) {
    try {
        const session = await authenticate();
        if (!session) return { error: "Unauthorized" };

        const name = formData.get("name") as string;
        const designation = formData.get("designation") as string;
        const review = formData.get("review") as string;
        const file = formData.get("image") as File;

        if (!name || !review) {
            return { error: "Name and Review are required" };
        }

        let imageUrl = "";
        if (file) {
            imageUrl = await uploadImageToCloudinary(file, "testimonials");
        }

        await prisma.testimonial.create({
            data: {
                name,
                designation: designation || "",
                review,
                image: imageUrl,
                imageAlt: (formData.get("imageAlt") as string)?.trim() || null,
            },
        });

        revalidateTag("testimonials", { expire: 0 });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: "Testimonial created successfully" };
    } catch (error: any) {
        console.error("Error creating testimonial:", error);
        return { error: "Failed to create testimonial" };
    }
}

export async function updateTestimonial(id: string, formData: FormData) {
    try {
        const session = await authenticate();
        if (!session) return { error: "Unauthorized" };

        const name = formData.get("name") as string;
        const designation = formData.get("designation") as string;
        const review = formData.get("review") as string;
        const file = formData.get("image") as File;

        if (!id || !name || !review) {
            return { error: "ID, Name and Review are required" };
        }

        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id },
        });

        if (!existingTestimonial) {
            return { error: "Testimonial not found" };
        }

        let imageUrl = existingTestimonial.image;

        if (file && file instanceof File && file.size > 0) {
            if (existingTestimonial.image) {
                await deleteImageFromCloudinary(existingTestimonial.image);
            }
            imageUrl = await uploadImageToCloudinary(file, "testimonials");
        }

        await prisma.testimonial.update({
            where: { id },
            data: {
                name,
                designation: designation || "",
                review,
                image: imageUrl,
                imageAlt: (formData.get("imageAlt") as string)?.trim() || null,
            },
        });

        revalidateTag("testimonials", { expire: 0 });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: "Testimonial updated successfully" };
    } catch (error: any) {
        console.error("Error updating testimonial:", error);
        return { error: "Failed to update testimonial" };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        const session = await authenticate();
        if (!session) return { error: "Unauthorized" };

        if (!id) {
            return { error: "ID is required" };
        }

        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id },
        });

        if (!existingTestimonial) {
            return { error: "Testimonial not found" };
        }

        if (existingTestimonial.image) {
            await deleteImageFromCloudinary(existingTestimonial.image);
        }

        await prisma.testimonial.delete({
            where: { id },
        });

        revalidateTag("testimonials", { expire: 0 });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: "Testimonial deleted successfully" };
    } catch (error: any) {
        console.error("Error deleting testimonial:", error);
        return { error: "Failed to delete testimonial" };
    }
}
