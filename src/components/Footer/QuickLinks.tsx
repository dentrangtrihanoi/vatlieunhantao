import Link from "next/link";

const quickLinks = [
  {
    id: 1,
    label: "Chính sách bảo mật",
    href: "/privacy-policy",
  },
  {
    id: 99,
    label: "Giới thiệu",
    href: "/gioi-thieu",
  },
  {
    id: 2,
    label: "Chính sách hoàn tiền",
    href: "/terms-condition",
  },
  {
    id: 3,
    label: "Điều khoản sử dụng",
    href: "/terms-condition",
  },
  {
    id: 4,
    label: "Câu hỏi thường gặp",
    href: "#",
  },
  {
    id: 5,
    label: "Liên hệ",
    href: "/contact",
  },
];

export default function QuickLinks() {
  return (
    <div className="w-full sm:w-auto">
      <h2 className="mb-7.5 text-xl font-semibold text-dark">Liên kết nhanh</h2>

      <ul className="flex flex-col gap-3">
        {quickLinks.map((link) => (
          <li key={link.id}>
            <Link
              className="text-base duration-200 ease-out hover:text-blue"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
