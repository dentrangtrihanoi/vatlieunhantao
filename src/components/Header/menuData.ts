import type { MenuItem } from "./types";

export const menuData: MenuItem[] = [
  {
    title: "Phổ biến",
    path: "/popular?sort=popular",
  },
  {
    title: "Cửa hàng",
    path: "/shop",
  },

  {
    title: "Trang",
    submenu: [
      {
        title: "Cửa hàng (không sidebar)",
        path: "/shop-without-sidebar",
      },
      {
        title: "Thanh toán",
        path: "/checkout",
      },
      {
        title: "Giỏ hàng",
        path: "/cart",
      },
      {
        title: "Yêu thích",
        path: "/wishlist",
      },
      {
        title: "Đăng nhập",
        path: "/signin",
      },
      {
        title: "Đăng ký",
        path: "/signup",
      },
      {
        title: "Lỗi",
        path: "/error",
      },
      {
        title: "Gửi mail thành công",
        path: "/mail-success",
      },
      {
        title: "Chính sách bảo mật",
        path: "/privacy-policy",
      },
      {
        title: "Điều khoản & Điều kiện",
        path: "/terms-condition",
      },
    ],
  },
  {
    title: "Tin tức",
    submenu: [
      {
        title: "Tin tức lưới",
        path: "/blog",
      },
      {
        title: "Tin tức lưới (có sidebar)",
        path: "/blog/blog-grid-with-sidebar",
      },
      {
        title: "Chi tiết tin tức (có sidebar)",
        path: "/blog/blog-details-with-sidebar",
      },
      {
        title: "Chi tiết tin tức",
        path: "/blog/blog-details",
      },
    ],
  },
  {
    title: "Liên hệ",
    path: "/contact",
  },
];
