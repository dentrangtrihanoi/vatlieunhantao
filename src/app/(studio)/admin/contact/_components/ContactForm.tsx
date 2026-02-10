"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createContactPage, updateContactPage } from "@/app/actions/contact";
import { InputGroup } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import Loader from "@/components/Common/Loader";
import { ContactPage } from "@prisma/client";

const TiptapEditor = dynamic(() => import("../../_components/TiptapEditor"), {
    ssr: false,
});

type Props = {
    contactItem: ContactPage | null;
};

type FormData = {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
};

const ContactForm = ({ contactItem }: Props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            title: contactItem?.title || "Liên hệ",
            description: contactItem?.description || "",
            metaTitle: contactItem?.metaTitle || "",
            metaDescription: contactItem?.metaDescription || "",
            robotsIndex: contactItem?.robotsIndex ?? true,
            robotsFollow: contactItem?.robotsFollow ?? true,
        },
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("metaTitle", data.metaTitle);
        formData.append("metaDescription", data.metaDescription);
        formData.append("robotsIndex", String(data.robotsIndex));
        formData.append("robotsFollow", String(data.robotsFollow));

        try {
            if (contactItem) {
                const res = await updateContactPage(contactItem.id.toString(), formData);
                if (res.status === 200) {
                    toast.success(res.message);
                    router.refresh();
                } else {
                    toast.error(res.message);
                }
            } else {
                const res = await createContactPage(formData);
                if (res.status === 201) {
                    toast.success(res.message);
                    router.refresh();
                } else {
                    toast.error(res.message);
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputGroup
                label="Page Title"
                placeholder="Enter page title"
                error={!!errors.title}
                errorMessage={errors.title?.message}
                {...register("title", { required: "Title is required" })}
            />

            <div>
                <label className="mb-2.5 block text-black dark:text-white">
                    Page Content
                </label>
                <TiptapEditor
                    label=""
                    value={contactItem?.description || ""}
                    onChange={(content) => setValue("description", content)}
                />
                {errors.description && (
                    <span className="text-sm text-red-500">{errors.description.message}</span>
                )}
            </div>

            <div className="p-4 mt-6 border rounded-lg border-gray-3">
                <h3 className="mb-4 text-lg font-semibold text-dark">SEO Meta Fields</h3>
                <InputGroup
                    label="Meta Title"
                    placeholder="Enter meta title"
                    error={!!errors.metaTitle}
                    errorMessage={errors.metaTitle?.message}
                    className="mb-4"
                    {...register("metaTitle")}
                />
                <InputGroup
                    label="Meta Description"
                    placeholder="Enter meta description"
                    error={!!errors.metaDescription}
                    errorMessage={errors.metaDescription?.message}
                    className="mb-4"
                    {...register("metaDescription")}
                />
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="robotsIndex"
                            {...register("robotsIndex")}
                            className="w-4 h-4 text-blue border-gray-300 rounded focus:ring-blue"
                        />
                        <label htmlFor="robotsIndex" className="text-sm text-gray-700">Index</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="robotsFollow"
                            {...register("robotsFollow")}
                            className="w-4 h-4 text-blue border-gray-300 rounded focus:ring-blue"
                        />
                        <label htmlFor="robotsFollow" className="text-sm text-gray-700">Follow</label>
                    </div>
                </div>
            </div>

            <button
                disabled={loading}
                className="flex w-full justify-center rounded bg-blue p-3 font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-50"
            >
                {loading ? <Loader /> : contactItem ? "Update Page" : "Create Page"}
            </button>
        </form>
    );
};

export default ContactForm;
