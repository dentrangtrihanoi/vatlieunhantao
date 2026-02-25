import BlogDetails from "@/components/BlogDetails";

import { getBlogs, getSingleBlog, getRelatedPosts } from "@/get-api-data/blog";
import { getSiteName } from "@/get-api-data/seo-setting";
import Breadcrumb from "@/components/Common/Breadcrumb";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = await getSingleBlog(slug);
  const siteURL = process.env.SITE_URL;
  const site_name = await getSiteName();

  if (post) {
    return {
      title: `${post.metaTitle || post.title || "Single Post Page"} | ${site_name}`,
      description: `${post.metadata?.slice(0, 136)}...`,
      author: post?.author?.name || site_name,
      alternates: {
        canonical: `${siteURL}/blog/${post?.slug}`,
      },

      robots: {
        index: post.robotsIndex ?? true,
        follow: post.robotsFollow ?? true,
        nocache: true,
        googleBot: {
          index: post.robotsIndex ?? true,
          follow: post.robotsFollow ?? true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      openGraph: {
        title: `${post.title} | ${site_name}`,
        description: post.metadata,
        url: `${siteURL}/blog/${post?.slug}`,
        siteName: site_name,
        images: [
          {
            url: post.mainImage,
            width: 1800,
            height: 1600,
            alt: post.title,
          },
        ],
        locale: "en_US",
        type: "article",
      },

      twitter: {
        card: "summary_large_image",
        title: `${post.title} | ${site_name}`,
        description: `${post.metadata?.slice(0, 136)}...`,
        creator: post?.author?.name || site_name,
        site: `${siteURL}/blog/${post?.slug}`,
        images: [post?.mainImage],
        url: `${siteURL}/blog/${post?.slug}`,
      },
    };
  } else {
    return {
      title: "Not Found",
      description: "No blog article has been found",
    };
  }
}

const BlogDetailsPage = async ({ params }: Params) => {
  const { slug } = await params;
  const post = await getSingleBlog(slug);

  // Fetch related posts based on tags
  const relatedPosts = post ? await getRelatedPosts(post.id, post.tags, 4) : [];



  return (
    <main>
      <Breadcrumb
        items={[
          {
            label: "Trang chủ",
            href: "/",
          },
          {
            label: "Tin tức",
            href: "/blog",
          },
          {
            label: post?.title || "Chi tiết bài viết",
            href: `/blog/${slug}`,
          },
        ]}
        seoHeading={false}
      />
      {post ? (
        <BlogDetails blogData={post} relatedPosts={relatedPosts} />
      ) : (
        <div className="pb-20 pt-40 text-center">No blog article has been found</div>
      )}
    </main>
  );
};

export default BlogDetailsPage;
