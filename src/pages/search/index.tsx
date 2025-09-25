// src/pages/search/index.tsx

import { Suspense, useState, useEffect } from "react"; // SỬA LỖI: Xóa 'React' không cần thiết
import { useAtomValue } from "jotai";

import Section from "@/components/section";
import { SearchResultSkeleton } from "@/components/skeleton";
import ProductGrid from "@/components/product-grid";
import { EmptySearchResult } from "@/components/empty";
import TransitionLink from "@/components/transition-link";
import {
  keywordState,
  recommendedProductsState,
  searchResultState,
  searchCategoriesResultState,
} from "@/state";

/**
 * Custom hook để trì hoãn (debounce) một giá trị.
 * Chỉ cập nhật giá trị trả về sau khi giá trị đầu vào không thay đổi trong một khoảng thời gian delay.
 * @param value - Giá trị cần debounce.
 * @param delay - Thời gian trì hoãn (ms).
 * @returns Giá trị đã được debounce.
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Thiết lập một timer để cập nhật giá trị sau khoảng thời gian delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Dọn dẹp timer nếu value thay đổi (người dùng tiếp tục gõ)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchedCategories() {
  const categories = useAtomValue(searchCategoriesResultState);

  if (categories.length === 0) {
    return null;
  }

  return (
    <Section title="Danh mục liên quan">
      <div className="px-3 pt-2 pb-3">
        {categories.map((category) => (
          <TransitionLink
            to={`/category/${category.id}`}
            key={category.id}
            className="flex items-center space-x-3 py-2 border-b border-gray-200 last:border-b-0"
          >
            <img
              src={category.image}
              className="w-10 h-10 rounded-full bg-skeleton object-cover"
              alt={category.name}
            />
            <span className="font-medium">{category.name}</span>
          </TransitionLink>
        ))}
      </div>
    </Section>
  );
}

function SearchedProducts() {
  const searchResult = useAtomValue(searchResultState);

  return (
    <Section title={`Sản phẩm (${searchResult.length})`}>
      {searchResult.length === 0 ? (
        <EmptySearchResult />
      ) : (
        <ProductGrid products={searchResult} />
      )}
    </Section>
  );
}

function SearchResult() {
  const searchResult = useAtomValue(searchResultState);
  const categoriesResult = useAtomValue(searchCategoriesResultState);

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

function RecommendedProducts() {
  const recommendedProducts = useAtomValue(recommendedProductsState);

  return (
    <Section title="Gợi ý sản phẩm">
      <ProductGrid products={recommendedProducts} layout="horizontal" />
    </Section>
  );
}

export default function SearchPage() {
  const keyword = useAtomValue(keywordState);
  const debouncedKeyword = useDebounce(keyword, 500);

  if (debouncedKeyword) {
    return (
      <Suspense fallback={<SearchResultSkeleton />}>
        <SearchResult />
      </Suspense>
    );
  }
  
  return <RecommendedProducts />;
}