import { getBlogSettings } from "@/app/actions/blog-settings";
import { getSiteName } from "@/get-api-data/seo-setting";
import { Metadata } from "next";
import BlogSettingsForm from "./_components/BlogSettingsForm";

export async function generateMetadata(): Promise<Metadata> {
    const site_name = await getSiteName();
    return {
        title: `Blog Settings | ${site_name}`,
        description: "Manage blog display settings and SEO",
    };
}

export default async function BlogSettingsPage() {
    const settings = await getBlogSettings();

    return (
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-dark">Blog Settings</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Manage blog display name and SEO settings
                </p>
            </div>
            <BlogSettingsForm initialData={settings} />
        </div>
    );
}
