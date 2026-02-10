import Link from "next/link";
import FooterBottom from "./FooterBottom";
import { getFooterSettings } from "@/app/actions/footer-setting";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/assets/icons/social";
import { CallIcon, EmailIcon, MapIcon } from "@/assets/icons";

type QuickLink = {
  label: string;
  url: string;
};

const Footer = async () => {
  const result = await getFooterSettings();
  const footerData = result.success ? result.data : null;

  const companyName = footerData?.companyName || "Cozy Commerce";
  const address = footerData?.address || "123 Main St, City, Country";
  const email = footerData?.email || "support@example.com";
  const phone = footerData?.phone || "+1234567890";

  let quickLinks: QuickLink[] = [];
  try {
    quickLinks = typeof footerData?.quickLinks === "string"
      ? JSON.parse(footerData.quickLinks)
      : footerData?.quickLinks || [];
  } catch (e) {
    console.error("Failed to parse quickLinks in Footer", e);
  }

  return (
    <footer className="overflow-hidden border-t border-gray-3 bg-white pt-[20px]">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[45fr_25fr_30fr] gap-10 mb-[16px]">

          {/* Column 1: Company Info */}
          <div>
            <h3 className="mb-7 text-xl font-semibold text-dark">
              {companyName}
            </h3>

            <ul className="flex flex-col gap-4">
              <li className="flex gap-3 text-base text-dark-4">
                <span className="shrink-0 mt-1">
                  <MapIcon className="fill-blue" width={20} height={20} />
                </span>
                {address}
              </li>

              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-3 text-base text-dark-4 hover:text-blue duration-200">
                  <CallIcon className="fill-blue" width={20} height={20} />
                  {phone}
                </a>
              </li>

              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-base text-dark-4 hover:text-blue duration-200">
                  <EmailIcon className="fill-blue" width={20} height={20} />
                  {email}
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-5 mt-8">
              {footerData?.facebookLink && (
                <a href={footerData.facebookLink} target="_blank" rel="noopener noreferrer" className="text-dark-4 hover:text-blue duration-200">
                  <FacebookIcon />
                </a>
              )}
              {footerData?.twitterLink && (
                <a href={footerData.twitterLink} target="_blank" rel="noopener noreferrer" className="text-dark-4 hover:text-blue duration-200">
                  <TwitterIcon />
                </a>
              )}
              {footerData?.instagramLink && (
                <a href={footerData.instagramLink} target="_blank" rel="noopener noreferrer" className="text-dark-4 hover:text-blue duration-200">
                  <InstagramIcon />
                </a>
              )}
              {footerData?.linkedinLink && (
                <a href={footerData.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-dark-4 hover:text-blue duration-200">
                  <LinkedInIcon />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-7 text-xl font-semibold text-dark">
              Liên kết nhanh
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.length > 0 ? (
                quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-base text-dark-4 hover:text-blue duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">Chưa có liên kết nào.</li>
              )}
            </ul>
          </div>

          {/* Column 3: Google Map */}
          <div>
            <h3 className="mb-7 text-xl font-semibold text-dark">
              Bản đồ
            </h3>
            <div className="w-full h-[250px] bg-gray-2 rounded-lg overflow-hidden">
              {footerData?.mapIframe ? (
                <div
                  className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                  dangerouslySetInnerHTML={{
                    __html: footerData.mapIframe.replace(
                      "<iframe",
                      '<iframe loading="lazy"'
                    ),
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  Chưa có bản đồ
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <FooterBottom />
    </footer>
  );
};

export default Footer;
