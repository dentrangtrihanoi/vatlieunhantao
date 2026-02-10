import { MinusIcon, PlusIcon, TrashIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

const SingleItem = ({ item }: any) => {
  const { removeItem, handleCartClick, incrementItem, decrementItem } = useCart();
  const router = useRouter();
  const handleRemoveFromCart = () => {
    removeItem(item.id);
  };

  const handleProductClick = () => {
    router.push(`/${item.slug}`);
    setTimeout(() => {
      handleCartClick();
    }, 500);
  };

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center w-full gap-6">
        <div className="flex items-center justify-center rounded-[10px] bg-gray-3 w-22.5 h-22.5 shrink-0">
          <Image src={item.image} alt="product" width={64} height={64} />
        </div>

        <div className="flex-1">
          <h3 className="mb-1 text-base font-medium duration-200 ease-out text-dark hover:text-blue">
            <button onClick={handleProductClick} className="text-start">
              {item.name}
            </button>
          </h3>
          <p className="font-normal text-custom-sm">Giá: ${item.price}</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => decrementItem(item.id)}
              className="flex items-center justify-center w-6 h-6 text-sm border rounded border-gray-3 text-dark hover:bg-gray-2"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="w-3 h-3" />
            </button>
            <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
            <button
              onClick={() => incrementItem(item.id)}
              className="flex items-center justify-center w-6 h-6 text-sm border rounded border-gray-3 text-dark hover:bg-gray-2"
              aria-label="Increase quantity"
            >
              <PlusIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={handleRemoveFromCart}
          aria-label="button for remove product from cart"
          className="flex items-center justify-center rounded-lg w-[38px] h-[38px] bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
