import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@/assets/icons';
import { Blog } from '@/types/blogItem';

// Helper function to extract plain text excerpt from HTML body
const getExcerpt = (htmlContent: string, maxLength: number = 200): string => {
  // Strip HTML tags
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ');
  // Remove extra whitespace
  const cleaned = plainText.replace(/\s+/g, ' ').trim();
  // Truncate to maxLength
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim() + '...';
};

const BlogItem = ({
  blog,
  featured = false,
  compact = false,
  priority = false,
}: {
  blog: Blog;
  featured?: boolean;
  compact?: boolean;
  priority?: boolean;
}) => {
  return (
    <div className="shadow-1 bg-white rounded-xl overflow-hidden h-full flex flex-col">
      <Link
        href={`/blog/${blog?.slug}`}
        className="block relative w-full aspect-[4/3] overflow-hidden"
      >
        <Image
          src={
            blog.mainImage ? blog?.mainImage : '/no image'
          }
          alt="blog"
          className="w-full h-full object-cover"
          width={400}
          height={300}
          priority={priority}
        />
      </Link>

      <div className="px-4 sm:px-5 pt-5 pb-4 flex-1 flex flex-col">
        <h2 className={`font-medium text-dark ease-out duration-200 mb-4 hover:text-blue ${featured ? 'text-xl sm:text-2xl lg:text-3xl' :
          compact ? 'text-sm sm:text-base' :
            'text-lg sm:text-xl'
          }`}>
          <Link href={`/blog/${blog?.slug}`}>{blog.title}</Link>
        </h2>

        {/* Auto-Excerpt - Only for Featured */}
        {featured && blog.body && (
          <p className="mb-4 text-base text-gray-600 line-clamp-4">
            {getExcerpt(blog.body, 250)}
          </p>
        )}

        <div className="mt-auto">
          <Link
            href={`/blog/${blog?.slug}`}
            className="text-custom-sm inline-flex items-center gap-2 py-2 ease-out duration-200 font-bold text-blue hover:text-dark"
          >
            Đọc ngay
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
