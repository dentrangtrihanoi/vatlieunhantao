"use client";

import { updateBlogSettings } from "@/app/actions/blog-settings";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BlogSettingsFormProps {
    initialData: {
        displayName: string;
        description: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        robotsIndex: boolean;
        robotsFollow: boolean;
    };
}

export default function BlogSettingsForm({ initialData }: BlogSettingsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: initialData.displayName,
        description: initialData.description || "",
        metaTitle: initialData.metaTitle || "",
        metaDescription: initialData.metaDescription || "",
        robotsIndex: initialData.robotsIndex,
        robotsFollow: initialData.robotsFollow,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await updateBlogSettings(formData);

            if (result.success) {
                toast.success("Blog settings updated successfully!");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white border rounded-lg border-gray-3">
            <div className="space-y-6">
                {/* Display Name */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-dark">
                        Display Name <span className="text-red">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg border-gray-3 focus:border-blue focus:outline-none"
                        placeholder="Blog, Tin tức, Bài viết..."
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-dark">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg border-gray-3 focus:border-blue focus:outline-none"
                        placeholder="Mô tả ngắn về blog..."
                    />
                </div>

                {/* Meta Title */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-dark">
                        Meta Title (SEO)
                    </label>
                    <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg border-gray-3 focus:border-blue focus:outline-none"
                        placeholder="Tiêu đề hiển thị trên Google..."
                    />
                </div>

                {/* Meta Description */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-dark">
                        Meta Description (SEO)
                    </label>
                    <textarea
                        rows={3}
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg border-gray-3 focus:border-blue focus:outline-none"
                        placeholder="Mô tả hiển thị trên Google (150-160 ký tự)..."
                    />
                </div>

                {/* Robots Meta */}
                <div className="p-4 border rounded-lg bg-gray-2 border-gray-3">
                    <h3 className="mb-3 text-sm font-medium text-dark">Robots Meta Tags</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.robotsIndex}
                                onChange={(e) => setFormData({ ...formData, robotsIndex: e.target.checked })}
                                className="w-4 h-4 text-blue border-gray-3 rounded focus:ring-blue"
                            />
                            <span className="text-sm text-dark">
                                Allow search engines to <strong>index</strong> this page
                            </span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.robotsFollow}
                                onChange={(e) => setFormData({ ...formData, robotsFollow: e.target.checked })}
                                className="w-4 h-4 text-blue border-gray-3 rounded focus:ring-blue"
                            />
                            <span className="text-sm text-dark">
                                Allow search engines to <strong>follow</strong> links on this page
                            </span>
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 font-medium text-white rounded-lg bg-blue hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </form>
    );
}
