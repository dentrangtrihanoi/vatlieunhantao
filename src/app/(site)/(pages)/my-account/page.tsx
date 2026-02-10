"use client";

import { signOut, useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="p-6 bg-white rounded-lg shadow-1">
      <p className="text-dark">
        Xin chào {session?.user?.name} (không phải {session?.user?.name} ?
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="pl-1 duration-200 ease-out text-red hover:underline"
        >
          Đăng xuất
        </button>
        )
      </p>

      <p className="mt-4 text-custom-sm">
        Từ bảng điều khiển tài khoản, bạn có thể xem các đơn hàng gần đây, quản lý địa chỉ giao hàng và thanh toán, cũng như chỉnh sửa mật khẩu và thông tin tài khoản.
      </p>
    </div>
  );
}
