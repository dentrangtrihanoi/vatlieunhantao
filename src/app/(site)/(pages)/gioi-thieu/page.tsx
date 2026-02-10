import { Metadata } from "next";

import { getSiteName } from "@/get-api-data/seo-setting";
import { getAboutUsData } from "@/get-api-data/about";

export const generateMetadata = async (): Promise<Metadata> => {
    const site_name = await getSiteName();
    const aboutData = await getAboutUsData();
    const aboutItem = aboutData[0] || null;

    return {
        title: aboutItem?.metaTitle || `About Us | ${site_name}`,
        description: aboutItem?.metaDescription || `About Us page for ${site_name}`,
        robots: {
            index: aboutItem?.robotsIndex ?? true,
            follow: aboutItem?.robotsFollow ?? true,
        },
        alternates: {
            canonical: `${process.env.SITE_URL}/gioi-thieu`,
        },
    };
};

const AboutPage = async () => {
    const aboutData = await getAboutUsData();
    const aboutItem = aboutData[0] || null;
    return (
        <main>
            <section className="pb-20 pt-10 overflow-hidden bg-gray-2">
                <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
                    <div className="mb-16">
                        <h3 className="mt-0 mb-3 text-3xl font-black leading-tight text-center sm:text-4xl sm:leading-tight md:leading-tight text-dark">
                            {aboutItem?.title || "About Us"}
                        </h3>
                        {aboutItem?.subtitle && (
                            <p className="text-dark text-center max-w-[700px] mx-auto">
                                {aboutItem?.subtitle}
                            </p>
                        )}
                    </div>

                    {aboutItem && (
                        <div className="flex items-center justify-center">
                            <div
                                className="prose lg:prose-xl" // Tailwind typography class
                                dangerouslySetInnerHTML={{
                                    __html: aboutItem.description || "",
                                }}
                            />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default AboutPage;
