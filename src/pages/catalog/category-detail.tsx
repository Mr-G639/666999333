import ProductGrid from "@/components/product-grid";
import { useAtomValue, useSetAtom } from "jotai";
import { productsByCategoryState, productsState } from "@/state";
import CategorySlider from "@/components/category-slider";
import { loadable } from "jotai/utils";
import { ProductGridSkeleton } from "../search";
import { EmptyCategory } from "@/components/empty";
import { useParams } from "react-router-dom";
import ErrorMessage from "@/components/error-message";
import HorizontalDivider from "@/components/horizontal-divider";

function ProductList() {
  const { id } = useParams();
  const categoryId = id || ""; // Provide a default value for id
  const productsLoadable = useAtomValue(loadable(productsByCategoryState(categoryId)));
  const retryProducts = useSetAtom(productsState);

  if (productsLoadable.state === 'loading') {
    return <ProductGridSkeleton className="pt-4" />;
  }

  if (productsLoadable.state === 'hasError') {
    return <ErrorMessage message={(productsLoadable.error as Error).message} onRetry={() => retryProducts()} />;
  }

  const products = productsLoadable.data;
  
  if (!products || !products.length) {
    return <EmptyCategory />;
  }

  return <ProductGrid products={products} className="pt-4" />;
}

export default function CategoryDetailPage() {
  return (
    <div className="h-full flex flex-col bg-section">
      <CategorySlider />
      <HorizontalDivider />
      <div className="flex-1 overflow-y-auto p-4">
        <ProductList />
      </div>
    </div>
  );
}
