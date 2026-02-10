import { useCart } from "@/hooks/useCart";
import { useCheckoutForm } from "./form";
import { formatPrice } from "@/utils/formatePrice";
import { MinusIcon, PlusIcon } from "@/assets/icons";

export default function Orders() {
  const { watch } = useCheckoutForm();
  const { cartCount, cartDetails, totalPrice = 0, incrementItem, decrementItem } = useCart();

  const shippingFee = watch("shippingMethod");
  const couponDiscount = ((watch("couponDiscount") || 0) * totalPrice) / 100;

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <h3 className="px-4 py-5 text-lg font-medium border-b text-dark border-gray-3 sm:px-6">
        Đơn hàng của bạn
      </h3>

      <div className="px-6 pt-1 pb-6">
        <table className="w-full text-dark">
          <thead>
            <tr className="border-b border-gray-3">
              <th className="py-5 text-base font-medium text-left">Sản phẩm</th>
              <th className="py-5 text-base font-medium text-center">Số lượng</th>
              <th className="py-5 text-base font-medium text-right">
                Tạm tính
              </th>
            </tr>
          </thead>

          <tbody>
            {cartCount && cartCount > 0 ? (
              Object.values(cartDetails ?? {}).map((product, key) => (
                <tr key={key} className="border-b border-gray-3">
                  <td className="py-5 text-sm truncate">{product.name}</td>
                  <td className="py-5 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => decrementItem(product.id)}
                        className="flex items-center justify-center w-6 h-6 text-sm border rounded border-gray-3 text-dark hover:bg-gray-2"
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium min-w-[20px] text-center">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => incrementItem(product.id)}
                        className="flex items-center justify-center w-6 h-6 text-sm border rounded border-gray-3 text-dark hover:bg-gray-2"
                        aria-label="Increase quantity"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-5 text-sm text-right">
                    {formatPrice(product.price * product.quantity)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-5 text-center" colSpan={3}>
                  Không có sản phẩm trong giỏ
                </td>
              </tr>
            )}

            <tr className="border-b border-gray-3">
              <td className="py-5">Phí vận chuyển</td>
              <td></td>
              <td className="py-5 text-right">
                {formatPrice(shippingFee?.price || 0)}
              </td>
            </tr>

            {!!couponDiscount && (
              <tr className="border-b border-gray-3">
                <td className="py-5">
                  Mã giảm giá ({watch("couponDiscount")}%)
                </td>
                <td></td>
                <td className="py-5 text-right">
                  - {formatPrice(couponDiscount)}
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr>
              <td className="pt-5 text-base font-medium">Tổng cộng</td>
              <td></td>
              <td className="pt-5 text-base font-medium text-right">
                {formatPrice(totalPrice - couponDiscount + shippingFee.price)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
