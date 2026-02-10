import { useCheckoutForm } from "./form";

export default function Notes() {
  const { register } = useCheckoutForm();

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-6  break-after-column">
      <label htmlFor="notes" className="block mb-1.5 text-sm text-gray-6">
        Ghi chú khác (tùy chọn)
      </label>
      <textarea
        {...register("notes")}
        id="notes"
        rows={5}
        placeholder="Ghi chú về đơn hàng, ví dụ: lưu ý khi giao hàng."
        className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3   focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
      />
    </div>
  );
}
