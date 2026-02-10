"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ChevronDown } from "./icons";

type Input = {
  email: string;
  password: string;
};

const Login = () => {
  const [dropdown, setDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, formState, ...form } = useForm<Input>();

  const loginUser = async (data: Input) => {
    setIsLoading(true);

    try {
      const res = await signIn("credentials", { redirect: false, ...data });
      if (res?.error) {
        toast.error(res?.error);
      } else if (res?.ok) {
        toast.success("Đăng nhập thành công!");
        form.reset();

        router.push("/my-account");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div
        onClick={() => setDropdown(!dropdown)}
        className={`cursor-pointer flex items-center justify-between gap-0.5 py-5 px-5.5 ${dropdown && "border-b border-gray-3"
          }`}
      >
        Bạn đã có tài khoản?
        <span className="flex items-center gap-2.5 font-medium text-dark pl-1">
          Nhấn vào đây để đăng nhập
          <ChevronDown
            className={`${dropdown && "rotate-180"} ease-out duration-200`}
          />
        </span>
      </div>

      {/* <!-- dropdown menu --> */}
      <div className="pt-7.5 pb-8.5 px-4 sm:px-[34px]" hidden={!dropdown}>
        <p className="mb-6 text-custom-sm">
          Nếu bạn chưa đăng nhập, vui lòng đăng nhập trước.
        </p>

        <form onSubmit={form.handleSubmit(loginUser)}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2.5 aria-disabled:opacity-70"
              aria-disabled={isLoading}
            >
              Tên đăng nhập hoặc Email
            </label>

            <input
              type="email"
              {...register("email", { required: true })}
              id="email"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-hidden duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 disabled:opacity-60"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2.5 aria-disabled:opacity-70"
              aria-disabled={isLoading}
            >
              Mật khẩu
            </label>

            <input
              type="password"
              {...register("password", {
                required: true,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              })}
              id="password"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-hidden duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 disabled:opacity-60"
              disabled={isLoading}
              required
            />

            {formState.errors.password && (
              <p className="text-sm text-red mt-1.5">
                Tối thiểu 6 ký tự với 1 chữ hoa, 1 chữ thường và 1 số.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex font-medium text-white bg-blue py-3 px-10.5 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:pointer-events-none disabled:opacity-60"
            disabled={isLoading}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
