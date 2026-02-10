import { Metadata } from "next";
import BlogGrid from "@/components/BlogGrid";
import { getSiteName } from "@/get-api-data/seo-setting";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getBlogSettings } from "@/app/actions/blog-settings";

export async function generateMetadata(): Promise<Metadata> {
  const site_name = await getSiteName();
  const settings = await getBlogSettings();

  const robotsValue = `${settings.robotsIndex ? 'index' : 'noindex'}, ${settings.robotsFollow ? 'follow' : 'nofollow'}`;

  return {
    title: settings.metaTitle || `${settings.displayName} | ${site_name}`,
    description: settings.metaDescription || settings.description || `This is ${settings.displayName} Page for ${site_name}`,
    robots: robotsValue,
    alternates: {
      canonical: `${process.env.SITE_URL}/blog`,
    },
  };
};

export const revalidate = 60;


export default async function BlogPage() {
  const settings = await getBlogSettings();

  return (
    <main>
      <Breadcrumb
        items={[
          {
            label: "Trang chủ",
            href: "/",
          },
          {
            label: settings.displayName,
            href: "/blog",
          },
        ]}
        seoHeading={true}
      />

      {/* Blog Header Section */}
      {/* Blog Header Section */}
      <section className="py-2.5 overflow-hidden bg-white border-b border-gray-3">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <h1 className="mb-4 text-3xl font-bold text-center text-dark lg:text-4xl">
            {settings.displayName}
          </h1>
          {settings.description && (
            <p className="text-base text-justify text-gray-600 lg:text-lg">
              {settings.description}
            </p>
          )}
        </div>
      </section>

      <BlogGrid />
    </main>
  );
}

