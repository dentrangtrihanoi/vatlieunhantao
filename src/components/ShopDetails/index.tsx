"use client";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import {
  CircleCheckIcon,
  FullScreenIcon,
  MinusIcon,
  PlusIcon,
} from "@/assets/icons";
import { updateproductDetails } from "@/redux/features/product-details";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { IProductByDetails } from "@/types/product";
import { transformCloudinaryImages } from "@/utils/cloudinaryTransform";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useCart } from "@/hooks/useCart";

import PreLoader from "../Common/PreLoader";
import ReviewStar from "../Shop/ReviewStar";
import DetailsTabs from "./DetailsTabs";
import toast from "react-hot-toast";
import { formatPrice } from "@/utils/formatePrice";

import { useRouter } from "next/navigation";

type SelectedAttributesType = {
  [key: number]: string | undefined;
};

type IProps = {
  product: IProductByDetails;
  avgRating: number;
  totalRating: number;
};

const ShopDetails = ({ product, avgRating, totalRating }: IProps) => {
  const defaultVariant = product?.productVariants?.find(
    (variant) => variant.isDefault
  );
  const { openPreviewModal } = usePreviewSlider();
  const router = useRouter();
  const [previewImg, setPreviewImg] = useState(defaultVariant?.image);
  const [previewAlt, setPreviewAlt] = useState<string>((defaultVariant as any)?.imageAlt || product.title || "");
  const [quantity, setQuantity] = useState(1);
  const [activeColor, setActiveColor] = useState(defaultVariant?.color);
  const [activeSize, setActiveSize] = useState(defaultVariant?.size);
  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributesType>({});
  // State to track failed thumbnail images
  const [failedThumbnails, setFailedThumbnails] = useState<number[]>([]);

  const handleThumbnailError = (index: number) => {
    setFailedThumbnails((prev) => [...prev, index]);
  };

  const { addItem, cartDetails, incrementItem } = useCart();

  const dispatch = useDispatch<AppDispatch>();

  const cartItem = {
    id: product.id,
    name: product.title,
    price: product.discountedPrice || product.price,
    currency: "usd",
    image: defaultVariant ? defaultVariant?.image : "",
    slug: product?.slug,
    availableQuantity: product.quantity,
    color: activeColor,
    size: activeSize || "",
    attribute: selectedAttributes || "",
  };

  // pass the product here when you get the real data.
  const handlePreviewSlider = () => {
    dispatch(
      updateproductDetails({
        ...product,
        updatedAt: product.updatedAt.toISOString(), // Convert Date to string
      })
    );
    openPreviewModal();
  };

  const handleAddToCart = async (isCheckout: boolean = false) => {
    if (quantity > product.quantity) {
      toast.error(`Chỉ còn ${product.quantity} sản phẩm trong kho!`);
      return;
    }

    const isAlreadyItemInCart = !!cartDetails?.[cartItem.id];

    if (isCheckout) {
      if (isAlreadyItemInCart) {
        router.push("/checkout");
        return;
      }

      // Add the item and wait a short time before redirecting
      await addItem({ ...cartItem, quantity: quantity });

      // Small delay to ensure cart is updated before navigating
      setTimeout(() => {
        router.push("/checkout");
      }, 150); // 300ms is safer than 100ms
      return;
    }

    // Non-checkout mode: Add the item and increment as needed
    await addItem({ ...cartItem, quantity: 1 });

    for (let i = 1; i < quantity; i++) {
      await incrementItem(cartItem.id);
    }

    toast.success("Đã thêm sản phẩm vào giỏ!");
  };

  // Function to toggle the selected attribute for a specific item
  const toggleSelectedAttribute = (itemIndex: number, attributeId: string) => {
    setSelectedAttributes((prevSelected) => ({
      ...prevSelected,
      [itemIndex]: attributeId,
    }));
  };

  // Initialize the first attribute value as selected by default
  useEffect(() => {
    if (product?.customAttributes && product.customAttributes.length > 0) {
      const initialAttributes: SelectedAttributesType = {};

      product.customAttributes.forEach((attribute, index) => {
        if (attribute.attributeValues && attribute.attributeValues.length > 0) {
          initialAttributes[index] = attribute.attributeValues[0].id;
        }
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [product?.customAttributes]);

  // Compute unique color and size variants
  const uniqueColorVariants = product?.productVariants?.reduce((acc: any[], current) => {
    const normalizedColor = current.color?.trim();
    if (!normalizedColor) return acc;
    // Check if we already have this color (case-insensitive)
    const exists = acc.some(item =>
      item.color?.trim().toLowerCase() === normalizedColor.toLowerCase()
    );
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []) || [];

  const uniqueSizeVariants = product?.productVariants?.reduce((acc: any[], current) => {
    const normalizedSize = current.size?.trim();
    if (!normalizedSize) return acc;
    // Check if we already have this size (case-insensitive)
    const exists = acc.some(item =>
      item.size?.trim().toLowerCase() === normalizedSize.toLowerCase()
    );
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []) || [];

  const showVariants = uniqueColorVariants.length > 1 || uniqueSizeVariants.length > 1 || (product?.customAttributes && product.customAttributes.length > 0);

  // wishlist

  return (
    <>
      {product ? (
        <>
          <section className="relative pt-5 pb-[5px] overflow-hidden">
            <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7.5 xl:gap-17.5">
                <div className="w-full lg:col-span-6">
                  <div
                    className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 relative flex items-center justify-center overflow-hidden cursor-zoom-in"
                    onClick={handlePreviewSlider}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {product.discountedPrice &&
                        product.discountedPrice < product.price && (
                          <div className="absolute z-40 inline-flex font-medium shrink-0 text-custom-sm text-white bg-blue rounded-full py-0.5 px-2.5 top-4 lg:top-6 right-4 lg:right-6">
                            {Math.round(
                              ((product.price - product.discountedPrice) /
                                product.price) *
                              100
                            )}
                            % GIẢM
                          </div>
                        )}

                      <Image
                        src={previewImg ? previewImg : ""}
                        alt={previewAlt || product.title}
                        width={600}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {product.productVariants
                      .filter((item) => item?.image && item.image.trim() !== "")
                      .map((item: any, key: any) => {
                        if (failedThumbnails.includes(key)) return null;

                        return (
                          <button
                            onClick={() => {
                              setPreviewImg(item?.image);
                              setPreviewAlt(item?.imageAlt || product.title || "");
                            }}
                            key={key}
                            className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${item?.image === previewImg
                              ? "border-blue"
                              : "border-transparent"
                              }`}
                          >
                            <Image
                              width={100}
                              height={100}
                              src={item.image}
                              alt={item.imageAlt || item.color || product.title}
                              className="w-full h-full object-cover"
                              onError={() => handleThumbnailError(key)}
                            />
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* <!-- product content --> */}
                <div className="w-full lg:col-span-6">
                  <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-semibold sm:text-2xl xl:text-custom-3 text-dark">
                      {product.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                    <div className="flex items-center gap-2.5">
                      {/* <!-- stars --> */}
                      <ReviewStar avgRating={avgRating} />


                    </div>

                    <div className="flex items-center gap-1.5">
                      {product.quantity ? (
                        <>
                          <CircleCheckIcon className="fill-green" />
                          <span className="text-green"> Còn hàng </span>
                        </>
                      ) : (
                        <>
                          <span className="text-red"> Hết hàng </span>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className=" text-xl sm:text-2xl mb-4.5">
                    <span className="mr-2 font-semibold text-dark">
                      Giá:{" "}
                    </span>
                    {product.price === 0 ? (
                      <span className="font-bold text-red text-2xl lg:text-3xl">
                        Liên Hệ
                      </span>
                    ) : (
                      <>
                        {product.discountedPrice && (
                          <span className="font-medium line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                        <span className="font-bold text-red text-2xl lg:text-3xl">
                          {"  "}
                          {formatPrice(product.discountedPrice || product.price)}
                        </span>
                      </>
                    )}
                  </h3>

                  {product.description && (
                    <div
                      className="mb-6 text-base font-medium text-body-color prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: transformCloudinaryImages(product.description) }}
                    />
                  )}

                  <ul className="flex flex-col gap-2">
                    {product.offers?.map((offer, key) => (
                      <li
                        key={key}
                        className="flex items-center gap-2.5 font-normal"
                      >
                        <CircleCheckIcon className="fill-[#3C50E0]" />
                        {offer}
                      </li>
                    ))}
                  </ul>

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className={`flex flex-col gap-4.5 ${showVariants ? "border-y border-gray-3 mt-7.5 mb-9 py-9" : "mt-4 mb-4"}`}>
                      {/* <!-- details item --> */}
                      {/* Color Selection */}
                      {uniqueColorVariants.length > 1 && (
                        <div className="flex items-center gap-4">
                          <div className="min-w-[65px]">
                            <h4 className="text-base font-normal capitalize text-dark">
                              Màu sắc:
                            </h4>
                          </div>

                          <ul className="flex flex-wrap items-center gap-2.5">
                            {uniqueColorVariants.map((item, key) => {
                              const isColorCode =
                                item.color?.startsWith("#") ||
                                item.color?.startsWith("rgb");

                              return (
                                <li
                                  key={key}
                                  onClick={() => {
                                    setActiveColor(item.color);
                                    const variant = product.productVariants.find(
                                      (pv) => pv.color === item.color
                                    );
                                    if (variant?.image) setPreviewImg(variant.image);
                                    setPreviewAlt((variant as any)?.imageAlt || product.title || "");
                                  }}
                                  title={item.color}
                                  className={`cursor-pointer inline-flex items-center justify-center transition-all duration-200 ${isColorCode
                                    ? `w-[22px] h-[22px] rounded-full shadow-sm ${["white", "#ffffff", "#fff"].includes(
                                      item.color?.toLowerCase().trim()
                                    )
                                      ? "border border-gray-3"
                                      : "border-transparent"
                                    }`
                                    : `border py-1 px-2.5 rounded-md text-sm font-normal min-w-[30px] ${activeColor === item.color
                                      ? "border-blue text-blue"
                                      : "border-gray-3 text-dark-3 hover:border-blue hover:text-blue"
                                    }`
                                    }`}
                                  style={
                                    isColorCode
                                      ? { backgroundColor: `${item.color}` }
                                      : {}
                                  }
                                >
                                  {isColorCode ? (
                                    <svg
                                      className={
                                        activeColor === item.color
                                          ? "block"
                                          : "hidden"
                                      }
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                    >
                                      <path
                                        d="M10.0517 3.27002L4.59172 8.73002L1.94922 6.08755"
                                        stroke={
                                          ["white", "#ffffff", "#fff"].includes(
                                            activeColor?.toLowerCase().trim() || ""
                                          ) ||
                                            ["white", "#ffffff", "#fff"].includes(
                                              item.color?.toLowerCase().trim()
                                            )
                                            ? "black"
                                            : "white"
                                        }
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : (
                                    <span className="capitalize">{item.color}</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {product?.customAttributes &&
                        product.customAttributes?.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-4"
                          >
                            <div className="min-w-[65px]">
                              <h4 className="font-normal capitalize text-dark">
                                {item?.attributeName}:
                              </h4>
                            </div>
                            <div className="flex items-center gap-4">
                              {item.attributeValues.map((value, valueIndex) => (
                                <span
                                  key={valueIndex}
                                  onClick={() =>
                                    toggleSelectedAttribute(itemIndex, value.id)
                                  }
                                  className={`border py-1 px-2.5 rounded-md text-sm font-normal cursor-pointer ${selectedAttributes[itemIndex] === value.id
                                    ? "border-blue text-blue"
                                    : "border-gray-3 text-dark-3"
                                    }`}
                                >
                                  {value.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}

                      {/* Size Selection */}
                      {uniqueSizeVariants.length > 1 && (
                        <div className="flex items-center gap-4">
                          <div className="min-w-[65px]">
                            <h4 className="font-normal capitalize text-dark">
                              Kích thước:
                            </h4>
                          </div>
                          <div className="flex items-center gap-4">
                            {uniqueSizeVariants.map(
                              (value, valueIndex) => (
                                <span
                                  key={valueIndex}
                                  onClick={() => setActiveSize(value.size)}
                                  className={`border py-1 px-2.5 rounded-md text-sm font-normal cursor-pointer ${activeSize === value.size
                                    ? "border-blue text-blue"
                                    : "border-gray-3 text-dark-3"
                                    }`}
                                >
                                  {value.size}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Row 1: Quantity + Add to Cart */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-lg border-gray-3 shrink-0">
                          <button
                            aria-label="button for remove product"
                            className="flex items-center justify-center w-10 sm:w-12 h-11 sm:h-12 duration-200 ease-out hover:text-blue"
                            onClick={() =>
                              quantity > 1 && setQuantity(quantity - 1)
                            }
                            disabled={quantity === 1}
                          >
                            <MinusIcon />
                          </button>

                          <span className="flex items-center justify-center w-12 sm:w-16 h-11 sm:h-12 border-x border-gray-3">
                            {quantity}
                          </span>

                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={quantity === product.quantity}
                            aria-label="button for add product"
                            className="flex items-center justify-center w-10 sm:w-12 h-11 sm:h-12 duration-200 ease-out hover:text-blue"
                          >
                            <PlusIcon />
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddToCart()}
                          disabled={product.quantity < 1}
                          className="flex-1 inline-flex items-center justify-center font-medium text-white bg-orange py-3 px-4 sm:px-7 rounded-lg ease-out duration-200 hover:bg-orange-dark"
                        >
                          {product.quantity < 1 ? "Hết hàng" : "Thêm vào giỏ"}
                        </button>
                      </div>

                      {/* Row 2: Buy Now + Hotline */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleAddToCart(true)}
                          disabled={product.quantity < 1}
                          className="flex-1 inline-flex items-center justify-center py-3 font-medium text-white duration-200 ease-out rounded-lg bg-blue px-4 sm:px-7 hover:bg-blue-dark"
                        >
                          Mua ngay
                        </button>

                        <a
                          href="tel:0877236868"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red bg-red py-3 px-4 sm:px-7 text-center font-medium text-white duration-200 ease-out hover:bg-red-dark hover:border-red-dark"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          0877236868
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <DetailsTabs product={product} />
        </>
      ) : (
        <PreLoader />
      )}
    </>
  );
};

export default ShopDetails;
