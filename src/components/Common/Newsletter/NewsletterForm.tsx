export default function NewsletterForm() {
  return (
    <form>
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Nhập email của bạn"
          className="w-full px-5 py-3 border rounded-lg bg-gray-1 border-gray-3 outline-hidden placeholder:text-dark-4"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center py-3 font-medium text-white duration-200 ease-out rounded-lg px-7 bg-blue hover:bg-blue-dark"
        >
          Đăng ký
        </button>
      </div>
    </form>
  );
}
