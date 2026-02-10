"use client";
import { Blog } from "@/types/blogItem";
import Image from "next/image";
import Link from "next/link";

import RelatedPostCard from "./RelatedPostCard";

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  mainImage: string;
  metadata: string | null;
  createdAt: Date;
};

const BlogDetails = ({
  blogData,
  relatedPosts = []
}: {
  blogData: Blog;
  relatedPosts?: RelatedPost[];
}) => {
  return (
    <>
      <section className="pb-[15px] pt-0 overflow-hidden bg-gray-2">
        {blogData ? (
          <div className="max-w-7xl w-full mx-auto px-[5px] sm:px-6 xl:px-0">
            <div className="bg-white border border-gray-3 rounded-lg p-3 md:p-8 lg:p-10">
              <h1 className="mb-6 text-2xl font-semibold text-dark lg:text-3xl xl:text-4xl">
                {blogData?.title}
              </h1>

              <div className="blog-details">
                <article
                  className="prose lg:prose-xl max-w-none"
                  dangerouslySetInnerHTML={{ __html: blogData.body }}
                />
              </div>

              {/* Author Info Section */}
              {blogData?.author && (
                <div className="flex gap-4 mt-10 pt-6 border-t border-gray-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={blogData.author.image}
                      alt={blogData.author.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-dark mb-2 uppercase border-2 border-dashed border-dark inline-block px-3 py-1">
                      {blogData.author.name}
                    </h3>
                    {blogData.author.bio && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {blogData.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-2xl text-center">Không tìm thấy bài viết!</p>
        )}

        {/* Related Posts Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-[5px] -mx-[5px] sm:-mx-6 xl:mx-0">
            <div className="bg-white py-4 px-[5px] sm:px-6 xl:px-0">
              <div className="max-w-7xl mx-auto pl-[15px]">
                <h2 className="text-lg font-semibold text-dark">Bài viết liên quan</h2>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-[5px] sm:px-6 xl:px-0 mt-[15px]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedPosts.map((post) => (
                  <RelatedPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default BlogDetails;
