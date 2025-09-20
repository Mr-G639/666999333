// src/pages/catalog/category-detail.tsx

import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { productsByCategoryState } from "@/state";
import ProductGrid from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/skeleton";
import { EmptyCategory } from "@/components/empty";
import CategorySlider from "@/components/category-slider";

function ProductListByCategory() {
  const { id } = useParams();
  const products = useAtomValue(productsByCategoryState(id!));

  if (products.length === 0) {
    return <EmptyCategory />;
  }

  return <ProductGrid products={products} />;
}

export default function CategoryDetailPage() {
  return (
    <div className="flex flex-col h-full">
      {/* THAY ĐỔI: Truyền `replace={true}` để kích hoạt logic mới */}
      <CategorySlider replace={true} />
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductListByCategory />
        </Suspense>
      </div>
    </div>
  );
}