import { Metadata } from "next";
import Contact from "@/components/Contact";
import { getSiteName } from "@/get-api-data/seo-setting";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getContactPage } from "@/get-api-data/contact";

export const generateMetadata = async (): Promise<Metadata> => {
  const site_name = await getSiteName();
  const contactData = await getContactPage();
  const contactItem = contactData[0] || null;

  return {
    title: contactItem?.metaTitle || `Contact Page | ${site_name}`,
    description: contactItem?.metaDescription || `This is Contact Page for ${site_name}`,
    robots: {
      index: contactItem?.robotsIndex ?? true,
      follow: contactItem?.robotsFollow ?? true,
    },
    alternates: {
      canonical: `${process.env.SITE_URL}/contact`,
    },
  };
};

import { getFooterSettings } from "@/app/actions/footer-setting";

// ... existing imports

const ContactPage = async () => {

  const contactData = await getContactPage();
  const contactItem = contactData[0] || null;

  const footerSettingResponse = await getFooterSettings();
  const contactInfo = footerSettingResponse && 'data' in footerSettingResponse ? footerSettingResponse.data : null;

  return (
    <main>
      <Breadcrumb
        items={[
          {
            label: "Trang chủ",
            href: "/",
          },
          {
            label: contactItem?.title || "Liên hệ",
            href: "/contact",
          },
        ]}
        seoHeading={true}
      />
      <section className="pt-10 overflow-hidden bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black leading-tight sm:text-4xl sm:leading-tight md:leading-tight text-dark">
              {contactItem?.title || "Liên hệ"}
            </h1>
          </div>
          {contactItem?.description && (
            <div className="flex items-center justify-center">
              <div
                className="prose lg:prose-xl"
                dangerouslySetInnerHTML={{
                  __html: contactItem.description || "",
                }}
              />
            </div>
          )}
        </div>
      </section>

      <Contact contactInfo={contactInfo} />
    </main>
  );
};

export default ContactPage;
