"use client";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

import { useForm } from "react-hook-form";
import { CheckoutFormProvider, CheckoutInput } from "./form";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { EmptyCartIcon } from "@/assets/icons";
import CheckoutAreaWithoutStripe from "./CheckoutAreaWithoutStripe";



export default function CheckoutMain() {
  const session = useSession();
  const { register, formState, watch, control, handleSubmit, setValue } =
    useForm<CheckoutInput>({
      defaultValues: {
        shippingMethod: {
          name: "free",
          price: 0,
        },
        paymentMethod: "cod",
        couponDiscount: 0,
        couponCode: "",
        billing: {
          address: {
            street: "",
            apartment: "",
          },
          companyName: "",
          country: "",
          email: session.data?.user?.email || "",
          firstName: session.data?.user?.name || "",
          lastName: "",
          phone: "",
          regionName: "",
          town: "",
          createAccount: false,
        },
        shipping: {
          address: {
            street: "",
            apartment: "",
          },
          country: "",
          email: "",
          phone: "",
          town: "",
          countryName: "",
        },
        notes: "",
        shipToDifferentAddress: false,
      },
    });

  const { totalPrice = 0, cartDetails } = useCart();
  const cartIsEmpty = !cartDetails || Object.keys(cartDetails).length === 0;

  const shippingFee = watch("shippingMethod");
  const couponDiscount = ((watch("couponDiscount") || 0) * totalPrice) / 100;
  const amount = totalPrice - couponDiscount + (shippingFee?.price || 0);

  if (cartIsEmpty) {
    return (
      <div className="py-20 mt-40">
        <div className="flex items-center justify-center mb-5">
          <EmptyCartIcon className="mx-auto text-blue" />
        </div>
        <h2 className="pb-5 text-2xl font-medium text-center text-dark">
          Không tìm thấy sản phẩm nào trong giỏ hàng để thanh toán.
        </h2>
        <Link
          href="/shop"
          className="w-96 mx-auto flex justify-center font-medium text-white bg-blue py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  // Always use COD checkout (no Stripe)
  return (
    <CheckoutFormProvider
      value={{
        register,
        watch,
        control,
        setValue,
        errors: formState.errors,
        handleSubmit,
      }}
    >
      <CheckoutAreaWithoutStripe amount={amount} />
    </CheckoutFormProvider>
  );
}
