import Link from "next/link";
import BestSellerSectionTitle from "./BestSellerSectionTitle";
import ProductItem from "@/components/Common/ProductItem";
import { getBestSellingProducts } from "@/get-api-data/product";

const BestSeller = async () => {
  const bestSellProducts = await getBestSellingProducts();

  return (
    <section className="overflow-hidden py-[16px]">
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <BestSellerSectionTitle />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {bestSellProducts.length > 0 &&
            bestSellProducts.map((item, key) => (
              <ProductItem item={item} key={key} />
            ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-lg border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
