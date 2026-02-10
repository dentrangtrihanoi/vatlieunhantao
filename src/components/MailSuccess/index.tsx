import { ArrowLeftIcon } from "@/app/(site)/success/_components/icons";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";

const MailSuccess = () => {
  return (
    <>
      <section className="pb-20 overflow-hidden bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <div className="px-4 py-10 bg-white rounded-xl shadow-1 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              <h1 className="font-bold text-blue text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                Thành công!
              </h1>

              <h2 className="mb-3 text-xl font-medium text-dark sm:text-2xl">
                Tin nhắn của bạn đã được gửi thành công
              </h2>

              <p className="max-w-[491px] w-full mx-auto mb-7.5">
                Cảm ơn bạn đã gửi tin nhắn. Chúng tôi kiểm tra email thường xuyên và sẽ cố gắng phản hồi yêu cầu của bạn sớm nhất có thể.
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white duration-200 ease-out rounded-md bg-blue hover:bg-blue-dark"
              >
                <ArrowLeftIcon />
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MailSuccess;
