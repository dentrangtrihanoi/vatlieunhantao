"use client";
import { FourSquaresIcon, TwoSquaresIcon } from "@/assets/icons";
import { Product } from "@/types/product";
import { useState } from "react";
import SingleListItem from "../Shop/SingleListItem";
import CustomSelect from "../ShopWithSidebar/CustomSelect";
import usePagination from "@/hooks/usePagination";
import Pagination from "../Common/Pagination";
import ProductItem from "../Common/ProductItem";

const ShopWithoutSidebar = ({ shopData }: { shopData: Product[] }) => {
  const [productStyle, setProductStyle] = useState("grid");
  const { currentItems, handlePageClick, pageCount } = usePagination(
    shopData,
    8
  );

  return (
    <section className="overflow-hidden relative pt-6 pb-6 bg-[#f3f4f6]">
      <div className="w-full px-2 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <div className="flex gap-6">
          <div className="w-full">


            {shopData.length > 0 ? (
              <div
                className={`${productStyle === "grid"
                  ? "grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6"
                  : "flex flex-col gap-6"
                  }`}
              >
                {currentItems.map((item, index) =>
                  productStyle === "grid" ? (
                    <ProductItem item={item} key={item.id} bgClr="white" isPriority={index === 0} />
                  ) : (
                    <SingleListItem item={item} key={item.id} />
                  )
                )}
              </div>
            ) : (
              <p className="py-5 text-2xl text-center">
                {" "}
                No products found in this category!
              </p>
            )}
          </div>
        </div>

        {/* pagination start */}
        {shopData.length > 8 && (
          <div className="mt-14 pagination">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        )}
        {/* pagination end */}
      </div>
    </section>
  );
};

export default ShopWithoutSidebar;
