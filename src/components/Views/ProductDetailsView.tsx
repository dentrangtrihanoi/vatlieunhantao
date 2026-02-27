import { preload } from 'react-dom';
import ShopDetails from "@/components/ShopDetails";
import { getRelatedProducts } from "@/get-api-data/product";
import { IProductByDetails } from "@/types/product";
import RecentlyViewedItems from "@/components/ShopDetails/RecentlyViewd";
import { getReviews } from "@/get-api-data/reviews";
import Breadcrumb from "@/components/Common/Breadcrumb";

const ProductDetailsView = async ({ product }: { product: IProductByDetails }) => {
    // Preload main product image for LCP — Server Component preload adds fetchpriority=high to <head>
    const defaultVariant = product?.productVariants?.find((v) => v.isDefault);
    if (defaultVariant?.image) {
        preload(defaultVariant.image, { as: 'image', fetchPriority: 'high' });
    }

    const recentProducts = await getRelatedProducts(
        product.category?.title!,
        product.tags!,
        product.id!,
        product.title!
    );

    const { avgRating, totalRating } = await getReviews(product.slug!);

    return (
        <main>
            <Breadcrumb
                items={[
                    {
                        label: "Trang chủ",
                        href: "/",
                    },
                    {
                        label: product?.category?.title || "Cửa hàng",
                        href: product?.category?.slug ? `/${product?.category?.slug}` : "/shop",
                    },
                    {
                        label: product?.title || "",
                        href: `/${product?.slug}`,
                    },
                ]}
            />
            <ShopDetails
                product={product as unknown as IProductByDetails}
                avgRating={avgRating}
                totalRating={totalRating}
            />
            <RecentlyViewedItems products={recentProducts} />
        </main>
    );
};

export default ProductDetailsView;
