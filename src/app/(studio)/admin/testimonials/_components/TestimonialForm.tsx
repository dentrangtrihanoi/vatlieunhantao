"use client";
import { createTestimonial, updateTestimonial } from "@/app/actions/testimonial";
import { InputGroup } from "@/components/ui/input";
import cn from "@/utils/cn";
import { Testimonial } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageUpload from "../../_components/ImageUpload";

interface TestimonialInput {
    name: string;
    designation: string;
    review: string;
    image: {
        image: File | null | string;
    };
}

type TestimonialProps = {
    testimonial?: Testimonial | null;
};

export default function TestimonialForm({ testimonial }: TestimonialProps) {
    const { handleSubmit, control, reset } = useForm<TestimonialInput>({
        defaultValues: {
            name: testimonial?.name || "",
            designation: testimonial?.designation || "",
            review: testimonial?.review || "",
            image: testimonial?.image
                ? { image: testimonial.image }
                : { image: null },
        },
    });

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: TestimonialInput) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("designation", data.designation);
            formData.append("review", data.review);
            if (data.image.image) {
                formData.append("image", data.image.image);
            } else {
                // If editing and no new image, we might keep old one, but here we enforce image or handle it in backend.
                // Actually backend usually expects file. If it's string (url), backend should handle it or we skip strictly if it's new.
                // But my actions handle it: `image: image || ""` if passed string.
                // If file object, uploaded.
                // `ImageUpload` component returns File or String (if existing).
            }

            // Check if image is required? Usually yes.
            if (!data.image.image && !testimonial?.image) {
                toast.error("Image is required");
                setIsLoading(false);
                return;
            }

            // If data.image.image is a string (existing URL) and we are updating, we append it.
            // If it's a File, we append it.
            if (data.image.image) {
                formData.append("image", data.image.image);
            }

            let result;
            if (testimonial) {
                result = await updateTestimonial(testimonial.id, formData);
            } else {
                result = await createTestimonial(formData);
            }

            if (result?.success) {
                toast.success(
                    `Testimonial ${testimonial ? "updated" : "created"} successfully`
                );
                reset();
                router.push("/admin/testimonials");
            } else {
                toast.error(result?.error || "Failed to save testimonial");
            }
        } catch (error: any) {
            console.error("Error saving testimonial:", error);
            toast.error(error?.message || "Failed to save testimonial");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 mb-5">
                {/* Name Input */}
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                        <div className="w-full">
                            <InputGroup
                                label="Name"
                                type="text"
                                required
                                error={!!fieldState.error}
                                errorMessage="Name is required"
                                name={field.name}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                            />
                        </div>
                    )}
                />

                {/* Designation Input */}
                <Controller
                    control={control}
                    name="designation"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                        <div className="w-full">
                            <InputGroup
                                label="Designation / Role"
                                type="text"
                                required
                                error={!!fieldState.error}
                                errorMessage="Designation is required"
                                name={field.name}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                            />
                        </div>
                    )}
                />

                {/* Review Input */}
                <Controller
                    control={control}
                    name="review"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                        <div className="w-full">
                            <label className="block mb-2.5 text-sm font-medium text-dark">
                                Review <span className="text-red">*</span>
                            </label>
                            <textarea
                                className={cn(
                                    "w-full rounded-lg border border-gray-3 bg-transparent px-5 py-3 text-dark outline-none focus:border-blue transition active:border-blue disabled:cursor-default disabled:bg-gray-2",
                                    fieldState.error && "border-red focus:border-red"
                                )}
                                rows={4}
                                {...field}
                            />
                            {fieldState.error && (
                                <p className="mt-1 text-sm text-red">Review is required</p>
                            )}
                        </div>
                    )}
                />

                {/* Image Input */}
                <Controller
                    control={control}
                    name="image"
                    rules={{ required: !testimonial }} // Required only if creating
                    render={({ field, fieldState }) => (
                        <ImageUpload
                            label="Author Image (100x100)"
                            images={
                                field.value.image
                                    ? [field.value.image instanceof File ? URL.createObjectURL(field.value.image) : field.value.image]
                                    : []
                            }
                            setImages={(files) =>
                                field.onChange({ image: files?.[0] || null })
                            }
                            showTitle={false}
                            required
                            error={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />
            </div>

            <button
                className={cn(
                    "inline-flex items-center gap-2 font-normal text-sm text-white bg-blue py-3 px-5 rounded-lg ease-out duration-200 hover:bg-blue-dark",
                    { "opacity-80 pointer-events-none": isLoading }
                )}
                disabled={isLoading}
            >
                {isLoading
                    ? "Saving..."
                    : testimonial
                        ? "Update Testimonial"
                        : "Save Testimonial"}
            </button>
        </form>
    );
}
