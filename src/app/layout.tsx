import "./css/style.css";
import { Metadata } from "next";
import { getSeoSettings, getSiteName } from "@/get-api-data/seo-setting";
import { GoogleTagManager } from '@next/third-parties/google'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: "--font-body",
  subsets: ['latin'],
  display: 'swap',
})

// Force all pages in this root layout to be server-rendered on demand
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seoSettings = await getSeoSettings();
    const site_name = await getSiteName();
    return {
      title: seoSettings?.metaTitle || seoSettings?.siteTitle || `Cửa hàng CozyCommerce`,
      description: seoSettings?.metaDescription || seoSettings?.metadescription || "Đây là trang web của CozyCommerce",
      keywords: seoSettings?.metaKeywords || "e-commerce, online store",
      openGraph: {
        images: seoSettings?.metaImage ? [seoSettings.metaImage] : [],
      },
      robots: {
        index: seoSettings?.robotsIndex ?? true,
        follow: seoSettings?.robotsFollow ?? true,
      },
      alternates: {
        canonical: process.env.SITE_URL,
      },
      icons: {
        icon: seoSettings?.favicon || "/favicon.ico",
        shortcut: seoSettings?.favicon || "/favicon.ico",
        apple: seoSettings?.favicon || "/favicon.ico",
      },
    };
  } catch {
    return {
      title: "Cửa hàng CozyCommerce",
      description: "Đây là trang web của CozyCommerce",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let seoSettings = null;
  try {
    seoSettings = await getSeoSettings();
  } catch {
    // DB not available at build time
  }
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body suppressHydrationWarning={true} className={roboto.variable}>
        {children}
        {seoSettings?.gtmId && <GoogleTagManager gtmId={seoSettings.gtmId} />}
      </body>
    </html>
  );
}
