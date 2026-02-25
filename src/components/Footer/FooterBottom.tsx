import Image from "next/image";

const paymentsData = [
  {
    id: 1,
    image: "/images/payment/payment-01.svg",
    alt: "visa card",
    width: 66,
    height: 22,
  },
  {
    id: 2,
    image: "/images/payment/payment-02.svg",
    alt: "paypal",
    width: 18,
    height: 21,
  },
  {
    id: 3,
    image: "/images/payment/payment-03.svg",
    alt: "master card",
    width: 33,
    height: 24,
  },
  {
    id: 4,
    image: "/images/payment/payment-04.svg",
    alt: "apple pay",
    width: 52.94,
    height: 22,
  },
  {
    id: 5,
    image: "/images/payment/payment-05.svg",
    alt: "google pay",
    width: 56,
    height: 22,
  },
];

import { getSeoSettings } from "@/get-api-data/seo-setting";

export default async function FooterBottom() {
  const year = new Date().getFullYear();
  const seoData = await getSeoSettings();
  const siteName = seoData?.siteName || "Pimjo";

  return (
    <div className="py-[5px] bg-gray-1">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="text-sm font-normal text-dark">
            &copy; {year}. Bản quyền thuộc về {siteName}.
          </p>


        </div>
      </div>
    </div>
  );
}
