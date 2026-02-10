"use client";
import { useState } from "react";
import { useCheckoutForm } from "./form";
import toast from "react-hot-toast";
import { validateCoupon } from "@/app/actions/coupon";

export default function CouponForm() {
  const { setValue, watch } = useCheckoutForm();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");

  const alreadyApplied = !!watch("couponDiscount");

  async function applyCoupon() {
    setLoading(true);
    if (!coupon) return;

    const data = await validateCoupon(coupon);
    setLoading(false);

    if (!data?.success) {
      toast.error(data?.message || "Áp dụng mã giảm giá thất bại");
      setCoupon("");
      return;
    }
    console.log(data);
    setValue("couponDiscount", data?.data?.discount);
    setValue("couponCode", data?.data?.code);
    setCoupon("");
  }

  return (
    <>
      <input
        type="text"
        placeholder="Nhập mã giảm giá"
        className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
        disabled={alreadyApplied}
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
      />

      <button
        type="button"
        onClick={applyCoupon}
        className="inline-flex px-6 py-3 text-sm font-normal text-white duration-200 ease-out rounded-lg disabled:pointer-events-none disabled:opacity-80 bg-blue hover:bg-blue-dark"
        disabled={alreadyApplied || loading}
      >
        {alreadyApplied ? "Đã áp dụng" : loading ? "Đang áp dụng..." : "Áp dụng"}
      </button>
    </>
  );
}
