"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputGroup } from "@/components/ui/input";
import cn from "@/utils/cn";
import { useRouter } from "next/navigation";
import { PrivacyPolicy } from "@prisma/client";
import toast from "react-hot-toast";
import TiptapEditor from "../../_components/TiptapEditor";
import { createPrivacyPolicy, updatePrivacyPolicy } from "@/app/actions/privacy-policy";

interface PrivacyPolicyInput {
    id: number;
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
}

type PolicyProps = {
    policyItem?: PrivacyPolicy | null;
};

export default function PrivacyPolicyForm({
    policyItem,
}: PolicyProps) {
    const {
        handleSubmit,
        control,
        reset,
    } = useForm<PrivacyPolicyInput>({
        defaultValues: {
            title: policyItem?.title || "",
            description: policyItem?.description || "",
            metaTitle: policyItem?.metaTitle || "",
            metaDescription: policyItem?.metaDescription || "",
            robotsIndex: policyItem?.robotsIndex ?? true,
            robotsFollow: policyItem?.robotsFollow ?? true,
        },
    });

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (policyItem) {
            reset({
                title: policyItem.title || "",
                description: policyItem.description || "",
                metaTitle: policyItem.metaTitle || "",
                metaDescription: policyItem.metaDescription || "",
                robotsIndex: policyItem.robotsIndex ?? true,
                robotsFollow: policyItem.robotsFollow ?? true,
            });
        } else {
            reset({
                title: "",
                description: "",
                metaTitle: "",
                metaDescription: "",
                robotsIndex: true,
                robotsFollow: true,
            });
        }
    }, [policyItem, reset]);

    const onSubmit = async (data: PrivacyPolicyInput) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("metaTitle", data.metaTitle);
            formData.append("metaDescription", data.metaDescription);
            formData.append("robotsIndex", String(data.robotsIndex));
            formData.append("robotsFollow", String(data.robotsFollow));
            let result;
            if (policyItem) {
                result = await updatePrivacyPolicy(policyItem.id.toString(), formData);
            } else {
                result = await createPrivacyPolicy(formData);
            }
            if (result?.success) {
                toast.success(`Privacy policy ${policyItem ? "updated" : "created"} successfully`);
                if (!policyItem) {
                    reset({
                        title: "",
                        description: "",
                        metaTitle: "",
                        metaDescription: "",
                        robotsIndex: true,
                        robotsFollow: true,
                    });
                }
                router.refresh();
            } else {
                toast.error(result?.message || "Failed to upload post");
            }
        } catch (error: any) {
            console.error("Error uploading post", error);
            toast.error(error?.message || "Failed to upload post");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 mb-5">
                {/* Title Input */}
                <Controller
                    control={control}
                    name="title"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                        <div className="w-full">
                            <InputGroup
                                label="Title"
                                type="text"
                                required
                                error={!!fieldState.error}
                                errorMessage="Title is required"
                                name={field.name}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                            />
                        </div>
                    )}
                />

                {/* SEO Meta Fields */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Controller
                        control={control}
                        name="metaTitle"
                        rules={{ required: false }}
                        render={({ field }) => (
                            <InputGroup
                                label="Meta Title (SEO)"
                                type="text"
                                placeholder="Meta Title"
                                name={field.name}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="metaDescription"
                        rules={{ required: false }}
                        render={({ field }) => (
                            <InputGroup
                                label="Meta Description (SEO)"
                                type="text"
                                placeholder="Meta Description"
                                name={field.name}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                {/* SEO Robots Meta */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Controller
                        control={control}
                        name="robotsIndex"
                        render={({ field }) => (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 border rounded-md accent-blue-600 border-gray-4 focus:ring-0 focus:ring-transparent"
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                                <span className="text-sm text-gray-600">Index</span>
                            </label>
                        )}
                    />

                    <Controller
                        control={control}
                        name="robotsFollow"
                        render={({ field }) => (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 border rounded-md accent-blue-600 border-gray-4 focus:ring-0 focus:ring-transparent"
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                                <span className="text-sm text-gray-600">Follow</span>
                            </label>
                        )}
                    />
                </div>

                {/* Quill Editor for Body */}
                <Controller
                    control={control}
                    name="description"
                    rules={{
                        required: "Description is required",
                        validate: (value) =>
                            value.trim() === "" || value === "<p><br></p>"
                                ? "Description is required"
                                : true,
                    }}
                    render={({ field, fieldState }) => (
                        <TiptapEditor
                            label="Description"
                            required
                            value={field.value}
                            onChange={field.onChange}
                            errMsg={fieldState.error?.message}
                        />
                    )}
                />
            </div>
            {/* Submit Button */}
            <button
                className={cn(
                    "inline-flex  items-center gap-2 font-normal text-sm text-white bg-blue py-3 px-5 rounded-lg ease-out duration-200 hover:bg-blue-dark",
                    { "opacity-80 pointer-events-none": isLoading }
                )}
                disabled={isLoading}
            >
                {isLoading ? "Saving..." : policyItem ? "Update Privacy Policy" : "Save Privacy Policy"}
            </button>
        </form>
    );
}
