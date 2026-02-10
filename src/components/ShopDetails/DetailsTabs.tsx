"use client";
import { IProductByDetails } from "@/types/product";
import { useState } from "react";
import AdditionalInformation from "./AdditionalInformation";
import Reviews from "./Reviews";

const DetailsTabs = ({ product }: { product: IProductByDetails }) => {
  const [activeTab, setActiveTab] = useState("tabOne");

  const tabs = [
    {
      id: "tabOne",
      title: "Mô tả",
    },
    {
      id: "tabTwo",
      title: "Thông tin thêm",
    },
    {
      id: "tabThree",
      title: "Đánh giá",
    },
  ];

  return (
    <section className="pt-[5px] pb-4 overflow-hidden bg-gray-2">
      <div className="w-full px-0 mx-auto max-w-7xl sm:px-8 xl:px-0">
        {/* <!--== tab header start ==--> */}
        <div className="flex flex-nowrap items-center bg-white rounded-[10px] shadow-1 gap-2 xl:gap-12.5 py-4.5 px-4 sm:px-6">
          {tabs.map((item, key) => (
            <button
              key={key}
              onClick={() => setActiveTab(item.id)}
              className={`font-medium lg:text-lg ease-out duration-200 rounded-lg py-2 px-4 hover:bg-blue hover:text-white ${activeTab === item.id
                ? "bg-blue text-white shadow-1"
                : "text-dark bg-gray-2"
                }`}
            >
              {item.title}
            </button>
          ))}
        </div>
        {/* <!--== tab header end ==--> */}

        {/* <!--== tab content start ==--> */}
        {/* <!-- tab content one start --> */}
        <div>
          <div
            className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-[5px] ${activeTab === "tabOne" ? "flex" : "hidden"
              }`}
          >
            <div className="w-full rounded-xl bg-white shadow-1 p-4 sm:p-6 border border-gray-3">
              <h2 className="text-2xl font-medium text-dark mb-7">
                Thông số kỹ thuật:
              </h2>

              {/* <PortableText value={product?.description!} /> */}
              {/* <PortableText value={product?.description!} /> */}
              {product?.body && (
                <div
                  className="prose prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.body }}
                />
              )}
            </div>
          </div>
        </div>
        {/* <!-- tab content one end --> */}

        {/* <!-- tab content two start --> */}
        <div
          className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-[5px] ${activeTab === "tabTwo" ? "block" : "hidden"
            }`}
        >
          {product?.additionalInformation?.length ? (
            <AdditionalInformation
              additionalInformation={product?.additionalInformation}
            />
          ) : (
            <p className="">Không có thông tin thêm!</p>
          )}
        </div>
        {/* <!-- tab content two end --> */}

        {/* <!-- tab content three start --> */}
        <div
          className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-[5px] rounded-xl bg-white shadow-1 p-4 sm:p-6 border border-gray-3 ${activeTab === "tabThree" ? "flex" : "hidden"
            }`}
        >
          <Reviews product={product} />
        </div>
        {/* <!-- tab content three end --> */}
        {/* <!--== tab content end ==--> */}
      </div>
    </section>
  );
};

export default DetailsTabs;
