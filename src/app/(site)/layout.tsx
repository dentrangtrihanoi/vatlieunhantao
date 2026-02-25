import Footer from "../../components/Footer";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import NextTopLoader from "nextjs-toploader";
import MainHeader from "@/components/Header/MainHeader";
import { getHeaderSettings } from "@/get-api-data/header-setting";

import FloatingContact from "@/components/Common/FloatingContact";

// Force all (site) pages to be server-rendered on demand, not pre-rendered at build time
export const dynamic = 'force-dynamic';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let headerSettingData = null;
  try {
    headerSettingData = await getHeaderSettings();
  } catch {
    // DB not available at build time, will be available at runtime
  }
  return (
    <div>
      <PreLoader />
      <>
        <Providers>
          <NextTopLoader
            color="#3C50E0"
            crawlSpeed={300}
            showSpinner={false}
            shadow="none"
          />
          <MainHeader headerData={headerSettingData} />
          <Toaster position="top-center" reverseOrder={false} />
          {children}
          <FloatingContact />
        </Providers>

        <ScrollToTop />
        <Footer />
      </>
    </div>
  );
}
