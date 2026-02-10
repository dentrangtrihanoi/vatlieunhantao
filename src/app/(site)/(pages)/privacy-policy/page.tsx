import { Metadata } from "next";
import { getPrivacyPolicies } from "@/get-api-data/privacy-policy";
import { getSiteName } from "@/get-api-data/seo-setting";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const generateMetadata = async (): Promise<Metadata> => {
  const site_name = await getSiteName();
  const privacyPolicyData = await getPrivacyPolicies();
  const policyItem = privacyPolicyData[0] || null;

  return {
    title: policyItem?.metaTitle || `Privacy Policy Page | ${site_name}`,
    description: policyItem?.metaDescription || `This is Privacy Policy Page for ${site_name}`,
    robots: {
      index: policyItem?.robotsIndex ?? true,
      follow: policyItem?.robotsFollow ?? true,
    },
    alternates: {
      canonical: `${process.env.SITE_URL}/privacy-policy`,
    },
  };
};

const PrivacyPolicyPage = async () => {
  const privacyPolicyData = await getPrivacyPolicies();
  const policyItem = privacyPolicyData[0] || null;
  return (
    <main>
      <Breadcrumb
        items={[
          {
            label: "Trang chủ",
            href: "/",
          },
          {
            label: "Chính sách bảo mật",
            href: "/privacy-policy",
          },
        ]}
      />
      <section className="py-20 overflow-hidden bg-white">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <h1 className="mt-0 mb-16 text-3xl font-black leading-tight text-center sm:text-4xl sm:leading-tight md:leading-tight text-dark">
            {policyItem?.title || "Chính sách bảo mật"}
          </h1>

          {policyItem && (
            <div className="flex items-center justify-center">
              <div
                className="prose lg:prose-xl"
                dangerouslySetInnerHTML={{
                  __html: policyItem.description || "",
                }}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
