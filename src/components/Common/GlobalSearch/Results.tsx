import SingleProductResult from "./SingleProductResult";

const Results = (props: any) => {
  const { setSearchModalOpen, filterValue, results } = props;

  // results is an array of items with { type: 'products' | 'blogs', ... }

  const products = results.filter((item: any) => item.type === "products");
  const blogs = results.filter((item: any) => item.type === "blogs");

  const hasProducts = products.length > 0;
  const hasBlogs = blogs.length > 0;
  const noResults = !hasProducts && !hasBlogs;

  if (noResults && results.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4">
      {(filterValue === "all" || filterValue === "products") && hasProducts && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-medium uppercase text-dark border-b pb-2">
            Sản phẩm ({products.length})
          </h2>
          <div>
            {products.map((item: any) => (
              <SingleProductResult
                key={item.objectID}
                showImage={true}
                hit={item}
                setSearchModalOpen={setSearchModalOpen}
                isProduct={true}
              />
            ))}
          </div>
        </div>
      )}

      {(filterValue === "all" || filterValue === "blogs") && hasBlogs && (
        <div className="mb-4">
          <h2 className="mb-3 text-lg font-medium uppercase text-dark border-b pb-2">
            Tin tức ({blogs.length})
          </h2>
          <div>
            {blogs.map((item: any) => (
              <SingleProductResult
                key={item.objectID}
                showImage={true}
                hit={item}
                setSearchModalOpen={setSearchModalOpen}
                isProduct={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
