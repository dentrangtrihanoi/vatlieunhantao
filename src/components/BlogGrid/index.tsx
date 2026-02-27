import { Blog } from "@/types/blogItem";
import BlogItem from "../Blog/BlogItem";
import { getBlogs } from "@/get-api-data/blog";

const BlogGrid = async () => {
  const blogData: Blog[] = await getBlogs();

  // Split posts into featured, grid, and regular
  const featuredPost = blogData[0];
  const gridPosts = blogData.slice(1, 5); // Posts 2-5 (4 posts)
  const regularPosts = blogData.slice(5); // Posts 6+

  return (
    <>
      <section className="pt-2.5 pb-[16px] overflow-hidden bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          {/* Featured Section: 1 large + 4 small grid */}
          {blogData.length > 0 && (
            <div className="grid grid-cols-1 gap-2.5 mb-2.5 lg:grid-cols-2">
              {/* Featured Post (Left Half) */}
              {featuredPost && (
                <div className="lg:row-span-2">
                  <BlogItem blog={featuredPost} featured isPriority />
                </div>
              )}

              {/* Grid Posts (Right Half - 2x2) */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {gridPosts.map((blog: Blog, key: number) => (
                    <BlogItem blog={blog} key={key} compact />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Regular Posts (4 columns) */}
          {regularPosts.length > 0 && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {regularPosts.map((blog: Blog, key: number) => (
                <BlogItem blog={blog} key={key} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogGrid;
