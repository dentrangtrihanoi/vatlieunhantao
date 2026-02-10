import { CartBegIcon } from "@/assets/icons";

export default function BestSellerSectionTitle() {
  return (
    <div className="max-w-md mx-auto mb-[16px]">
      <div className="flex flex-col items-center justify-center">
        <h2 className="mb-2 text-xl font-bold xl:text-heading-4 text-dark">
          Sản phẩm bán chạy
        </h2>
        <p className="text-base text-center text-dark-3">
          Những sản phẩm này đang bán rất chạy! Tìm hiểu xem mọi người đang yêu thích gì ngay bây giờ.
        </p>
      </div>
    </div>
  );
}
