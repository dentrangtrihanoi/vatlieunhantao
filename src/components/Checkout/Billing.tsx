"use client";
import { CheckMarkIcon } from "@/assets/icons";
import { Controller } from "react-hook-form";
import { InputGroup } from "../ui/input";
import { useCheckoutForm } from "./form";
import { ChevronDown } from "./icons";
import { useSession } from "next-auth/react";

export default function Billing() {
  const { register, errors, control } = useCheckoutForm();
  const session = useSession();

  return (
    <div className="bg-white shadow-1 rounded-[10px] ">
      <div className="p-6 py-5 border-b border-gray-3">
        <h2 className="text-lg font-medium text-dark">Thông tin thanh toán</h2>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <Controller
            control={control}
            rules={{ required: true }}
            name="billing.firstName"
            render={({ field, fieldState }) => (
              <InputGroup
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                required
                error={!!fieldState.error}
                errorMessage="Vui lòng nhập họ và tên"
                name={field.name}
                value={session.data?.user?.name || field.value}
                onChange={field.onChange}
                readOnly={!!session.data?.user?.name}
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            rules={{ required: true }}
            name="billing.address.street"
            render={({ field, fieldState }) => (
              <InputGroup
                label="Địa chỉ"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                required
                error={!!fieldState.error}
                errorMessage="Vui lòng nhập địa chỉ"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            rules={{
              required: "Vui lòng nhập số điện thoại",
              pattern: {
                value: /^\d{10}$/,
                message: "Số điện thoại phải có 10 chữ số",
              },
            }}
            name="billing.phone"
            render={({ field, fieldState }) => (
              <InputGroup
                type="tel"
                label="Số điện thoại"
                required
                error={!!fieldState.error}
                errorMessage={fieldState.error?.message || "Vui lòng nhập số điện thoại"}
                name={field.name}
                value={field.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Allow only numbers
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            rules={{ required: true }}
            name="billing.email"
            render={({ field, fieldState }) => (
              <InputGroup
                label="Địa chỉ Email"
                type="email"
                required
                error={!!fieldState.error}
                errorMessage="Vui lòng nhập email"
                name={field.name}
                value={session?.data?.user?.email || field.value}
                onChange={field.onChange}
                readOnly={!!session?.data?.user?.email}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
