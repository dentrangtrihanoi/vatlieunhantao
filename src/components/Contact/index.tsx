"use client";

import { FooterSetting } from "@prisma/client";
import { CallIcon, EmailIcon, MapIcon } from "@/assets/icons";
import { sendContactFormEmail } from "@/app/actions/send-email";
import Loader from "@/components/Common/Loader";
import { InputGroup } from "@/components/ui/input";
import cn from "@/utils/cn";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Input = {
  firstName: string;
  lastName: string;
  subject: string;
  phone: string;
  message: string;
};

const Contact = ({ contactInfo }: { contactInfo?: FooterSetting | null }) => {
  const { register, control, formState, handleSubmit, reset } = useForm<Input>({
    defaultValues: {
      firstName: "",
      lastName: "",
      subject: "",
      phone: "",
      message: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const router = useRouter();

  const onSubmit = async (data: Input) => {
    setIsLoading(true);
    try {
      // Simulate form submission (replace with your actual API call)
      const response = await sendContactFormEmail({ ...data });
      if (response.statusCode === 200) {
        setStatus("success");
        reset();
        // Redirect to /mail-success if desired, or just show success message inline
        // router.push("/mail-success");
        setIsLoading(false);
      } else {
        setStatus("error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="pb-20 overflow-hidden bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="w-full bg-white xl:col-span-4 rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="text-xl font-medium text-dark">
                  Thông tin liên hệ
                </p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-4">
                  <p className="flex items-center gap-4">
                    <EmailIcon width={22} height={22} className="fill-blue" />
                    Email: {contactInfo?.email || "support@example.com"}
                  </p>

                  <p className="flex items-center gap-4">
                    <CallIcon width={22} height={22} className="fill-blue" />
                    Điện thoại: {contactInfo?.phone || "1234 567890"}
                  </p>

                  <p className="flex gap-4">
                    <MapIcon
                      width={22}
                      height={22}
                      className="fill-blue shrink-0"
                    />
                    Địa chỉ: {contactInfo?.address || "123 Main Street"}
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-8 w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 mb-5 lg:flex-row sm:gap-8">
                  <Controller
                    control={control}
                    name="firstName"
                    rules={{ required: "Vui lòng nhập tên" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <InputGroup
                          label="Tên"
                          placeholder="John"
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="lastName"
                    rules={{ required: "Vui lòng nhập họ" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <InputGroup
                          label="Họ"
                          placeholder="Deo"
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-5 mb-5 lg:flex-row sm:gap-8">
                  <Controller
                    control={control}
                    name="subject"
                    rules={{ required: "Vui lòng nhập chủ đề" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <InputGroup
                          label="Chủ đề"
                          placeholder="Nhập chủ đề"
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="phone"
                    rules={{ required: "Vui lòng nhập số điện thoại" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <InputGroup
                          type="tel"
                          label="Số điện thoại"
                          placeholder="Nhập số điện thoại"
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="mb-7.5">
                  <label
                    htmlFor="message"
                    className="block mb-1.5 text-sm text-gray-6"
                  >
                    Tin nhắn
                  </label>

                  <textarea
                    {...register("message", {
                      required: "Vui lòng nhập tin nhắn",
                    })}
                    id="message"
                    rows={5}
                    placeholder="Nhập tin nhắn"
                    className="rounded-lg border placeholder:text-sm text-sm placeholder:font-normal border-gray-3    focus:border-blue focus:outline-0  placeholder:text-dark-5 w-full  py-2.5 px-4 duration-200  focus:ring-0"
                  />

                  {formState.errors.message && (
                    <p className="mt-1 text-sm text-red">
                      {formState.errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={cn(
                    "inline-flex items-center gap-2 font-normal text-white bg-blue py-3 px-7 rounded-lg text-sm ease-out duration-200 hover:bg-blue-dark",
                    {
                      "opacity-80 pointer-events-none": isLoading,
                    }
                  )}
                  disabled={isLoading}
                >
                  Gửi tin nhắn {isLoading && <Loader />}
                </button>

                {status === "success" && (
                  <div className="text-base text-green mt-3">Gửi tin nhắn thành công!</div>
                )}
                {status === "error" && (
                  <div className="text-base text-red mt-3">
                    Gửi tin nhắn thất bại!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
