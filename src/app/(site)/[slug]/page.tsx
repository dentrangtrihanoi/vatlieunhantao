import { getCategoryBySlug, getCategories } from "@/get-api-data/category";
import { getProductBySlug, getAllProducts } from "@/get-api-data/product";
import { getSiteName } from "@/get-api-data/seo-setting";
import { notFound } from "next/navigation";
import CategoryDetailsView from "@/components/Views/CategoryDetailsView";
import ProductDetailsView from "@/components/Views/ProductDetailsView";
import { IProductByDetails } from "@/types/product";

type Params = {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        date: string;
        sort: string;
    }>;
};

export async function generateStaticParams() {
    try {
        const categories = await getCategories();
        const products = await getAllProducts();

        const categoryParams = categories.map((category) => ({
            slug: category.slug,
        }));

        const productParams = products.map((product) => ({
            slug: product.slug,
        }));

        return [...categoryParams, ...productParams];
    } catch {
        return [];
    }
}


export async function generateMetadata({ params }: Params) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const siteURL = process.env.SITE_URL;
    const site_name = await getSiteName();

    // 1. Try Category
    const categoryData = await getCategoryBySlug(decodedSlug);
    if (categoryData) {
        return {
            title: `${categoryData?.metaTitle || categoryData?.title || "Category Page"} | ${site_name}`,
            description: `${categoryData?.metaDescription || categoryData?.description?.slice(0, 136)}...`,
            author: site_name,
            alternates: {
                canonical: `${siteURL}/${categoryData?.slug}`,
            },
            robots: {
                index: categoryData.robotsIndex ?? true,
                follow: categoryData.robotsFollow ?? true,
                nocache: true,
                googleBot: {
                    index: categoryData.robotsIndex ?? true,
                    follow: categoryData.robotsFollow ?? true,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
            openGraph: {
                title: `${categoryData?.metaTitle || categoryData?.title} | ${site_name}`,
                description: categoryData.metaDescription || categoryData.description,
                url: `${siteURL}/${categoryData?.slug}`,
                siteName: site_name,
                images: [
                    {
                        url: categoryData.img || "",
                        width: 1800,
                        height: 1600,
                        alt: categoryData?.title,
                    },
                ],
                locale: "en_US",
                type: "article",
            },
            twitter: {
                card: "summary_large_image",
                title: `${categoryData?.metaTitle || categoryData?.title} | ${site_name}`,
                description: `${categoryData?.metaDescription || categoryData?.description?.slice(0, 136)}...`,
                creator: site_name,
                site: `${siteURL}/${categoryData?.slug}`,
                images: [categoryData.img || ""],
                url: `${siteURL}/${categoryData?.slug}`,
            },
        };
    }

    // 2. Try Product
    const product = await getProductBySlug(decodedSlug);
    if (product) {
        const defaultVariant = product?.productVariants?.find(
            (variant) => variant.isDefault
        );

        return {
            title: `${product.metaTitle || product.title || "Single Product Page"}`,
            description: `${product.metaDescription || product?.shortDescription?.slice(0, 136)}...`,
            author: site_name,
            alternates: {
                canonical: `${siteURL}/${product?.slug}`,
            },
            robots: {
                index: product.robotsIndex ?? true,
                follow: product.robotsFollow ?? true,
                nocache: true,
                googleBot: {
                    index: product.robotsIndex ?? true,
                    follow: product.robotsFollow ?? true,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
            openGraph: {
                title: `${product?.title} | ${site_name}`,
                description: product.shortDescription,
                url: `${siteURL}/${product?.slug}`,
                siteName: site_name,
                images: [
                    {
                        url: defaultVariant?.image,
                        width: 1800,
                        height: 1600,
                        alt: product?.title || `${site_name}`,
                    },
                ],
                locale: "en_US",
                type: "article",
            },
            twitter: {
                card: "summary_large_image",
                title: `${product?.title} | ${site_name}`,
                description: `${product?.shortDescription?.slice(0, 136)}...`,
                creator: site_name,
                site: `${siteURL}/${product?.slug}`,
                images: [defaultVariant?.image],
                url: `${siteURL}/${product?.slug}`,
            },
        };
    }

    return {
        title: "Not Found",
        description: "No product or category has been found",
    };
}

export const revalidate = 60;

const DispatcherPage = async ({ params, searchParams }: Params) => {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const searchParamsValue = await searchParams;

    // 1. Check Category
    const categoryData = await getCategoryBySlug(decodedSlug);
    if (categoryData) {
        return (
            <CategoryDetailsView
                category={categoryData}
                searchParams={searchParamsValue}
            />
        );
    }

    // 2. Check Product
    const productData = await getProductBySlug(decodedSlug);
    if (productData) {
        const siteURL = process.env.SITE_URL;
        const site_name = await getSiteName();
        const defaultVariant = productData?.productVariants?.find(v => v.isDefault) || productData?.productVariants?.[0];
        const imageUrl = defaultVariant?.image;

        const jsonLd = {
            "@context": "http://schema.org",
            "@type": "Product",
            "name": productData.metaTitle || productData.title,
            "brand": {
                "@type": "Brand",
                "name": site_name || "Havaco" // Fallback to a default if site_name is empty
            },
            "image": imageUrl,
            "url": `${siteURL}/${productData.slug}`,
            "description": productData.metaDescription || productData.shortDescription,
            "sku": productData.sku,
            "mpn": productData.sku,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "VND",
                "price": productData.discountedPrice && productData.discountedPrice > 0 ? productData.discountedPrice : productData.price,
                "availability": productData.quantity > 0 ? "http://schema.org/InStock" : "http://schema.org/OutOfStock",
                "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                "seller": {
                    "@type": "Organization",
                    "name": site_name
                }
            },
            ...(productData.reviews && productData.reviews > 0 ? {
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": productData.reviewsList
                        ? (productData.reviewsList.reduce((acc, review) => acc + review.ratings, 0) / productData.reviewsList.length).toFixed(1)
                        : "5", // Fallback if list missing but count > 0? Shouldn't happen.
                    "reviewCount": productData.reviews
                },
                "review": productData.reviewsList?.map((review) => ({
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": review.name
                    },
                    "datePublished": review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : "",
                    "reviewBody": review.comment,
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": review.ratings.toString(),
                        "bestRating": "5",
                        "worstRating": "1"
                    }
                }))
            } : {})
        };

        return (
            <>
                {imageUrl && (() => {
                    const encodedUrl = encodeURIComponent(imageUrl);
                    const q = 75;
                    const srcSet = [640, 828, 1080, 1200]
                        .map(w => `/_next/image?url=${encodedUrl}&w=${w}&q=${q} ${w}w`)
                        .join(', ');
                    return (
                        <link
                            rel="preload"
                            as="image"
                            // @ts-ignore – imageSrcSet/imageSizes are valid HTML attrs for preload
                            imageSrcSet={srcSet}
                            imageSizes="(max-width: 768px) 100vw, 50vw"
                            fetchPriority="high"
                        />
                    );
                })()}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <ProductDetailsView product={productData as unknown as IProductByDetails} />
            </>
        );
    }

    // 3. Not Found
    notFound();
};

export default DispatcherPage;
