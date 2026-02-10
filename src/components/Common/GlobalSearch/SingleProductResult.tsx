import { formatPrice } from "@/utils/formatePrice";
import Image from "next/image";
import Link from "next/link";

export default function SingleProductResult({
  hit,
  showImage = false,
  setSearchModalOpen,
  isProduct,
}: any) {
  return (
    <div className="w-full p-2 mb-2 bg-white result-template group rounded-xl hover:bg-gray-2 border border-transparent hover:border-gray-3 transition-all duration-200">
      <Link
        onClick={() => setSearchModalOpen(false)}
        className="flex items-center"
        href={hit?.url || "#"}
      >
        {showImage && hit?.image && (
          <div
            className={`relative overflow-hidden flex items-center justify-center rounded-lg border border-gray-3 bg-gray-2 shrink-0 ${isProduct
              ? "w-[80px] h-[80px]"
              : "aspect-video w-[120px]"
              }`}
          >
            <Image
              src={hit?.image || "/images/placeholder.webp"}
              alt={hit?.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="w-full ml-4">
          <h4 className="mb-1 text-base font-semibold text-dark line-clamp-1 group-hover:text-blue transition-colors">
            {hit?.name}
          </h4>

          {!isProduct ? (
            <div>
              <p className="text-sm text-body-color line-clamp-2">
                {hit?.shortDescription || "Xem chi tiết bài viết..."}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              {hit?.price === 0 ? (
                <span className="text-red-500 font-bold text-sm">Liên Hệ</span>
              ) : (
                <>
                  <span className="text-blue font-bold">
                    {formatPrice(hit?.discountedPrice || hit?.price)}
                  </span>
                  {hit?.discountedPrice && (
                    <span className="line-through text-gray-400 text-xs">
                      {formatPrice(hit?.price)}
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
