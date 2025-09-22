import { categoriesState, productsState } from "@/state";
import { useAtomValue } from "jotai";
import { FC, Suspense } from "react";
import AllProducts from "./all-products";
import Banners from "./banners";
import Categories from "./category";
import FlashSales from "./flash-sales";

const HomePage: FC = () => {
  const products = useAtomValue(productsState);
  const categories = useAtomValue(categoriesState);

  return (
    <div className="flex-1 overflow-y-auto">
      <Suspense>
        <Banners />
      </Suspense>
      
      {/* CỤM ACTIONS VÀ KHU VỰC ĐƠN HÀNG ĐÃ ĐƯỢC XÓA HOÀN TOÀN */}

      <div className="mb-4" />
      <Suspense>
        <Categories categories={categories} />
      </Suspense>
      <div className="mb-4" />
      <FlashSales products={products} />
      <div className="mb-4" />
      <AllProducts products={products} />
    </div>
  );
};

export default HomePage;