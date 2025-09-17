// src/pages/search/index.tsx

import ProductItem from "@/components/product-item";
import Section from "@/components/section";
import { ProductItemSkeleton } from "@/components/skeleton";
import { useAtomValue } from "jotai";
import { HTMLAttributes, Suspense } from "react";
import {
  keywordState,
  recommendedProductsState,
  searchResultState,
  searchCategoriesResultState, // Import atom mới
} from "@/state";
import ProductGrid from "@/components/product-grid";
import { EmptySearchResult } from "@/components/empty";
import TransitionLink from "@/components/transition-link";

// Component hiển thị danh sách danh mục tìm được
function SearchedCategories() {
  const categories = useAtomValue(searchCategoriesResultState);

  if (categories.length === 0) {
    return null; // Không hiển thị gì nếu không có kết quả
  }

  return (
    <Section title="Danh mục liên quan">
      <div className="px-4 pt-2 pb-4">
        {categories.map((category) => (
          <TransitionLink
            to={`/category/${category.id}`}
            key={category.id}
            className="flex items-center space-x-3 py-2 border-b border-gray-200 last:border-b-0"
          >
            <img
              src={category.image}
              className="w-10 h-10 rounded-full bg-skeleton"
              alt={category.name}
            />
            <span className="font-medium">{category.name}</span>
          </TransitionLink>
        ))}
      </div>
    </Section>
  );
}

// Component hiển thị danh sách sản phẩm tìm được
function SearchedProducts() {
  const searchResult = useAtomValue(searchResultState);

  if (searchResult.length === 0) {
    return <EmptySearchResult />;
  }

  return (
    <Section title={`Sản phẩm (${searchResult.length})`}>
      <ProductGrid products={searchResult} />
    </Section>
  );
}

// Component chính để gom kết quả
export function SearchResult() {
  const searchResult = useAtomValue(searchResultState);
  const categoriesResult = useAtomValue(searchCategoriesResultState);

  // Chỉ hiển thị "Không có kết quả" khi cả 2 đều rỗng
  if (searchResult.length === 0 && categoriesResult.length === 0) {
    return <EmptySearchResult />;
  }

  return (
    <div className="w-full h-full space-y-2 bg-background">
      <div className="h-full flex flex-col overflow-y-auto pb-16 space-y-2">
        <SearchedCategories />
        <SearchedProducts />
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <Section title={`Kết quả`}>
      <ProductGridSkeleton />
    </Section>
  );
}

export function ProductGridSkeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={"grid grid-cols-2 px-4 pt-2 pb-8 gap-4 ".concat(
        className ?? ""
      )}
      {...props}
    >
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
      <ProductItemSkeleton />
    </div>
  );
}

export function RecommendedProducts() {
  const recommendedProducts = useAtomValue(recommendedProductsState);

  return (
    <Section title="Gợi ý sản phẩm">
      <div className="py-2 px-4 pb-6 flex space-x-2 overflow-x-auto">
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            className="flex-none"
            style={{ flexBasis: "calc((100vw - 48px) / 2)" }}
          >
            <ProductItem key={product.id} product={product} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function SearchPage() {
  const keyword = useAtomValue(keywordState);

  if (keyword) {
    return (
      <Suspense fallback={<SearchResultSkeleton />}>
        <SearchResult />
      </Suspense>
    );
  }
  return <RecommendedProducts />;
}