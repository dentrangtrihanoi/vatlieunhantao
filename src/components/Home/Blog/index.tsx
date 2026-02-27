import Link from "next/link";
import { getRandomBlogs } from "@/get-api-data/blog";
import BlogItem from "@/components/Blog/BlogItem";

const HomeBlog = async () => {
    const blogs = await getRandomBlogs(4);

    return (
        <section className="py-[16px] overflow-hidden bg-gray-1">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0">
                <div className="flex items-center justify-between mb-8 sm:mb-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
                            Tin tức mới nhất
                        </h2>
                        <p className="text-gray-6 text-sm sm:text-base">
                            Cập nhật những xu hướng và thông tin mới nhất
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-dark font-medium hover:text-blue transition-colors"
                    >
                        Xem tất cả
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {blogs.map((blog, key) => (
                        <div key={key} className="h-full">
                            <BlogItem blog={blog} compact={true} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeBlog;
