"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/assets/icons";

type RelatedPost = {
    id: string;
    title: string;
    slug: string;
    mainImage: string;
    metadata: string | null;
    createdAt: Date;
};

export default function RelatedPostCard({ post }: { post: RelatedPost }) {
    return (
        <div className="shadow-1 bg-white rounded-xl overflow-hidden h-full flex flex-col">
            <Link
                href={`/blog/${post.slug}`}
                className="block relative w-full aspect-[4/3] overflow-hidden"
            >
                <Image
                    src={post.mainImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                />
            </Link>

            <div className="px-4 sm:px-5 pt-5 pb-4 flex-1 flex flex-col">
                <h2 className="font-medium text-dark ease-out duration-200 mb-4 hover:text-blue text-sm sm:text-base">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <div className="mt-auto">
                    <Link
                        href={`/blog/${post.slug}`}
                        className="text-custom-sm inline-flex items-center gap-2 py-2 ease-out duration-200 font-bold text-blue hover:text-dark"
                    >
                        Đọc ngay
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </div>
    );
}
