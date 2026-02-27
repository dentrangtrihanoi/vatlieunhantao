"use client";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { EyeIcon } from "@/assets/icons";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch } from "@/redux/store";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useCart } from "@/hooks/useCart";
import CheckoutBtn from "../Shop/CheckoutBtn";
import WishlistButton from "../Wishlist/AddWishlistButton";
import { formatPrice } from "@/utils/formatePrice";
import Tooltip from "./Tooltip";
import { calculateDiscountPercentage } from "@/utils/calculateDiscountPercentage";

type Props = {
  bgClr?: string;
  item: Product;
  isPriority?: boolean;
};
// add updated the type here
const ProductItem = ({ item, bgClr = "[#F6F7FB]", isPriority = false }: Props) => {
  const defaultVariant = item?.productVariants.find(
    (variant) => variant.isDefault
  );
  const { openModal } = useModalContext();
  // const [product, setProduct] = useState({});
  const dispatch = useDispatch<AppDispatch>();

  const { addItem, cartDetails } = useCart();

  const pathUrl = usePathname();

  const isAlradyAdded = Object.values(cartDetails ?? {}).some(
    (cartItem) => cartItem.id === item.id
  );

  const cartItem = {
    id: item.id,
    name: item.title,
    price: item.discountedPrice ? item.discountedPrice : item.price,
    currency: "usd",
    image: defaultVariant?.image ? defaultVariant.image : "",
    slug: item?.slug,
    availableQuantity: item.quantity,
    color: defaultVariant?.color ? defaultVariant.color : "",
    size: defaultVariant?.size ? defaultVariant.size : "",
  };

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    const serializableItem = {
      ...item,
      updatedAt:
        item.updatedAt instanceof Date
          ? item.updatedAt.toISOString()
          : item.updatedAt, // ✅ Convert Date to ISO string
    };
    dispatch(updateQuickView(serializableItem));
  };

  // add to cart
  const handleAddToCart = (item: Product) => {
    if (item.quantity > 0) {
      // @ts-ignore
      addItem(cartItem);
      toast.success("Đã thêm sản phẩm vào giỏ!");
    } else {
      toast.error("Sản phẩm đã hết hàng!");
    }
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        id: item.id,
        title: item.title,
        slug: item.slug,
        image: defaultVariant?.image ? defaultVariant.image : "",
        price: item.discountedPrice ? item.discountedPrice : item.price,
        quantity: item.quantity,
        color: defaultVariant?.color ? defaultVariant.color : "",
      })
    );
  };

  return (
    <div className="group">
      <div
        className={`relative overflow-hidden border border-gray-3 rounded-xl bg-${bgClr} mb-4 group h-full flex flex-col`}
      >
        {/* Full width image container */}
        <Link
          href={`/${item?.slug}`}
          className="block w-full"
        >
          <div className="relative w-full aspect-[1/1] overflow-hidden">
            <Image
              src={defaultVariant?.image ? defaultVariant.image : ""}
              alt={item.title || "product-image"}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={isPriority}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="absolute top-2 right-2 z-10">
          {item.quantity < 1 ? (
            <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
              Hết hàng
            </span>
          ) : item?.discountedPrice && item?.discountedPrice > 0 ? (
            <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-blue">
              {calculateDiscountPercentage(item.discountedPrice, item.price)}%
              GIẢM
            </span>
          ) : null}
        </div>

        {/* Hover buttons */}
        <div className="absolute left-0 top-[200px] translate-y-10 opacity-0 w-full flex items-center justify-center gap-2.5 z-20 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Tooltip content="Xem nhanh" placement="top">
            <button
              className="border border-gray-3 h-[38px] w-[38px] rounded-lg flex items-center justify-center text-dark bg-white hover:text-blue"
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
            >
              <EyeIcon />
            </button>
          </Tooltip>

          {isAlradyAdded ? (
            <CheckoutBtn />
          ) : (
            <button
              onClick={() => handleAddToCart(item)}
              disabled={item.quantity < 1}
              className="inline-flex px-5 py-2 font-medium h-[38px] text-white duration-200 ease-out rounded-lg text-custom-sm bg-blue hover:bg-blue-dark"
            >
              {item.quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
            </button>
          )}
          {/* wishlist button */}
          <WishlistButton
            item={item}
            handleItemToWishList={handleItemToWishList}
          />
        </div>

        {/* Product Details Section - inside the box */}
        <div className="p-3 flex flex-col flex-grow justify-start">
          <h3 className="font-semibold text-dark ease-out text-base duration-200 hover:text-blue mb-1.5 line-clamp-2">
            <Link
              href={`/${item?.slug}`}
            >
              {" "}
              {item.title}{" "}
            </Link>
          </h3>

          <div className="flex items-center gap-2 text-base font-medium mt-auto">
            {item.price === 0 ? (
              <span className="text-blue font-bold">Liên Hệ</span>
            ) : (
              <>
                {item.discountedPrice && (
                  <span className="line-through text-dark-4 text-sm">
                    {formatPrice(item.price)}
                  </span>
                )}
                <span className="text-blue font-bold">
                  {formatPrice(item.discountedPrice || item.price)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
