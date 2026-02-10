import Breadcrumb from "@/components/Common/Breadcrumb";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { prisma } from "@/lib/prismaDB";
import { Prisma, Category } from "@prisma/client";

type Props = {
    category: Category;
    searchParams: {
        date?: string;
        sort?: string;
    };
};

const CategoryDetailsView = async ({ category, searchParams }: Props) => {
    const { date, sort } = searchParams;

    // Category filter
    const categoryFilter = { category: { slug: category.slug } };

    // Sort order: dynamically construct the sorting logic
    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    if (date) {
        // Sort by creation date, ascending or descending
        orderBy.push({
            updatedAt: date === "desc" ? Prisma.SortOrder.desc : Prisma.SortOrder.asc,
        });
    }
    if (sort === "popular") {
        // Sort by reviews count in descending order
        orderBy.push({ reviews: { _count: Prisma.SortOrder.desc } });
    }

    // Query products based on the category filter and dynamic ordering
    const products = await prisma.product.findMany({
        where: categoryFilter,
        orderBy,
        select: {
            id: true,
            title: true,
            shortDescription: true,
            price: true,
            discountedPrice: true,
            slug: true,
            quantity: true,
            updatedAt: true,
            productVariants: {
                select: {
                    image: true,
                    color: true,
                    size: true,
                    isDefault: true,
                },
            },
            _count: {
                select: {
                    reviews: true,
                },
            },
        },
    });

    // Format products and reviews
    const formattedProducts = products.map(({ _count, ...item }) => ({
        ...item,
        reviews: _count.reviews,
        price: item.price.toNumber(),
        discountedPrice: item.discountedPrice
            ? item.discountedPrice.toNumber()
            : null,
    }));

    return (
        <main>
            <Breadcrumb
                items={[
                    {
                        label: "Trang chủ",
                        href: "/",
                    },
                    {
                        label: category.title || "",
                        href: `/${category.slug}`,
                    },
                ]}
                seoHeading={false}
            />

            <section className="bg-white pt-8 pb-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 xl:px-0">
                    <h1 className="text-2xl font-bold text-dark sm:text-[28px]">
                        {category.title}
                    </h1>
                    <div className="mt-4 border-b border-gray-300"></div>
                </div>
            </section>

            {category.description && (
                <section className="bg-white pt-8 pb-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 xl:px-0">
                        <div
                            className="prose max-w-none text-gray-600"
                            dangerouslySetInnerHTML={{ __html: category.description }}
                        />
                    </div>
                </section>
            )}

            <ShopWithoutSidebar shopData={formattedProducts} />

            {category.descriptionBottom && (
                <section className="bg-white pt-6 pb-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 xl:px-0">
                        <div
                            className="prose max-w-none text-gray-600"
                            dangerouslySetInnerHTML={{ __html: category.descriptionBottom }}
                        />
                    </div>
                </section>
            )}
        </main>
    );
};

export default CategoryDetailsView;
