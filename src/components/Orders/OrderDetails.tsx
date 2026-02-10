import { formatPrice } from "@/utils/formatePrice";
import React from "react";

const OrderDetails = ({ orderItem }: any) => {
  const products = orderItem?.products || [];
  const shippingCost = orderItem?.shippingMethod?.price || 0;
  const discount = orderItem?.couponDiscount || 0;
  const totalAmount = orderItem?.totalAmount || 0;

  return (
    <div className="w-full ">
      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full border-collapse text-left mb-6">
          <thead className="bg-gray-100 border-b text-gray-7 border-gray-3">
            <tr>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                STT
              </th>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                Tên sản phẩm
              </th>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                Số lượng
              </th>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                Đơn giá
              </th>
              <th className="p-2 text-sm font-normal capitalize whitespace-nowrap">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-3">
                <td className="p-2 whitespace-nowrap">{index + 1}</td>
                <td className="p-2 whitespace-nowrap">{item?.name}</td>
                <td className="p-2 whitespace-nowrap">{item?.quantity}</td>
                <td className="p-2 whitespace-nowrap">
                  {formatPrice(item?.price)}
                </td>
                <td className="p-2 font-medium text-red-600 whitespace-nowrap">
                  {formatPrice(parseInt(item?.quantity) * parseInt(item?.price))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
        <ul className="space-y-3">
          <li className="flex items-center justify-between">
            <p className="font-medium">Phí vận chuyển</p>
            <p>{formatPrice(shippingCost)}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="font-medium">Giảm giá</p>
            <p>{formatPrice(discount)}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="font-medium">Tổng tiền</p>
            <p className="text-lg font-bold text-red-600">
              {formatPrice(totalAmount)}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
