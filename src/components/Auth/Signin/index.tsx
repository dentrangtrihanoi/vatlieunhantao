"use client";
import { GitHubIcon, GoogleIcon } from "@/assets/icons/social";
import Loader from "@/components/Common/Loader";
import cn from "@/utils/cn";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Input = {
  email: string;
  password: string;
};

const Signin = () => {
  const { handleSubmit, register, formState, reset, setValue } = useForm<Input>();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const session = useSession();

  const loginUser = async (data: Input) => {
    setIsLoading(true);
    signIn("credentials", { redirect: false, ...data })
      .then(async (callback) => {
        if (callback?.error) {
          toast.error(callback?.error);
        } else if (callback?.ok) {
          toast.success("Đăng nhập thành công!");
          reset();
          router.refresh();
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleQuickLogin = (role: 'user' | 'admin') => {
    const credentials = {
      user: { email: 'user@gmail.com', password: 'Cozy1234' },
      admin: { email: 'admin@gmail.com', password: 'Cozy1234' }
    };

    setValue('email', credentials[role].email);
    setValue('password', credentials[role].password);
    loginUser(credentials[role]);
  };

  return (
    <>
      <section className="pb-20 overflow-hidden bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-2xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Đăng nhập tài khoản
              </h2>
              <p className="text-sm">Nhập thông tin chi tiết bên dưới</p>
            </div>

            <div>
              <form onSubmit={handleSubmit(loginUser)}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-1.5 text-sm ">
                    Email
                  </label>

                  <input
                    type="email"
                    {...register("email", { required: true })}
                    id="email"
                    placeholder="example@gmail.com"
                    className="rounded-lg border text-dark placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
                    required
                  />

                  {formState.errors.email && (
                    <p className="text-sm text-red mt-1.5">Vui lòng nhập Email</p>
                  )}
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="block mb-1.5 text-sm text-gray-6"
                  >
                    Mật khẩu
                  </label>

                  <input
                    type="password"
                    {...register("password", {
                      required: true,
                      pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                    })}
                    id="password"
                    placeholder="Nhập mật khẩu"
                    className="rounded-lg border text-dark placeholder:text-sm text-sm placeholder:font-normal border-gray-3 h-11  focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
                    required
                  />

                  {formState.errors.password && (
                    <p className="text-sm text-red mt-1.5">
                      Tối thiểu 6 ký tự gồm 1 chữ hoa, 1 chữ thường và 1 số.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={cn(
                    "w-full flex justify-center font-normal text-sm h-11 text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 items-center gap-2",
                    {
                      "opacity-80 pointer-events-none": isLoading,
                    }
                  )}
                  disabled={isLoading}
                >
                  Đăng nhập {isLoading && <Loader />}
                </button>

                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('user')}
                    className={cn(
                      "flex-1 flex justify-center font-normal text-sm h-11 text-white bg-blue py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue-dark items-center gap-2",
                      {
                        "opacity-80 pointer-events-none": isLoading,
                      }
                    )}
                    disabled={isLoading}
                  >
                    Đăng nhập nhanh (User)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className={cn(
                      "flex-1 flex justify-center font-normal text-sm h-11 text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-darkLight items-center gap-2",
                      {
                        "opacity-80 pointer-events-none": isLoading,
                      }
                    )}
                    disabled={isLoading}
                  >
                    Đăng nhập nhanh (Admin)
                  </button>
                </div>

                <Link
                  href="/forgot-password"
                  className="block text-center text-sm text-dark-4 mt-4.5 ease-out duration-200 hover:text-dark"
                >
                  Quên mật khẩu?
                </Link>

                <span className="relative z-1 block font-medium text-center mt-4.5">
                  <span className="absolute left-0 block w-full h-px -z-1 top-1/2 bg-gray-3"></span>
                  <span className="inline-block px-3 text-base bg-white">
                    Hoặc
                  </span>
                </span>

                <div className="flex flex-col gap-4.5 mt-4.5">
                  <button
                    type="button"
                    onClick={() => signIn("google")}
                    className="flex justify-center h-11 items-center text-sm gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:text-dark hover:bg-gray-2 disabled:pointer-events-none disabled:opacity-60"
                    disabled={isLoading}
                  >
                    <GoogleIcon />
                    Đăng nhập bằng Google
                  </button>

                  <button
                    onClick={() => signIn("github")}
                    type="button"
                    className="flex justify-center items-center text-sm h-11 gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:text-dark hover:bg-gray-2 disabled:pointer-events-none disabled:opacity-60"
                    disabled={isLoading}
                  >
                    <GitHubIcon />
                    Đăng nhập bằng Github
                  </button>
                </div>

                <p className="mt-6 text-sm text-center">
                  Bạn chưa có tài khoản?
                  <Link
                    href="/signup"
                    className="pl-1 font-medium duration-200 ease-out text-dark hover:text-blue-dark"
                  >
                    Đăng ký ngay!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
