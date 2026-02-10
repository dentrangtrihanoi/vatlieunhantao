import React from "react";
import OrderSelect from "@/app/(studio)/admin/orders/_components/OrderSelect";
import PaymentStatusSelect from "@/app/(studio)/admin/orders/_components/PaymentStatusSelect";

const EditOrder = ({ order }: any) => {
  return (
    <div className="grid gap-4 lg:grid-cols-1">
      <div>
        <p className="pb-2 font-medium text-dark">Trạng thái đơn hàng</p>
        <OrderSelect id={order?.id} status={order?.shippingStatus} />
      </div>

      <div>
        <p className="pb-2 font-medium text-dark">Trạng thái thanh toán</p>
        <PaymentStatusSelect
          id={order?.id}
          paymentStatus={order?.paymentStatus}
        />
      </div>
    </div>
  );
};

export default EditOrder;
