import ProductItem from "@/components/Common/ProductItem";
import NewArrivalTitle from "./NewArrivalTitle";
import { getNewArrivalsProduct } from "@/get-api-data/product";

const NewArrival = async () => {
  const newProducts = await getNewArrivalsProduct();
  return (
    <section className="overflow-hidden pt-[16px]">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0">
        <NewArrivalTitle />

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-2 md:gap-x-4 md:gap-y-4">
          {newProducts.map((item, key) => (
            <ProductItem item={item} key={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
