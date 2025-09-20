// src/components/category-slider.tsx

import { categoriesState } from "@/state";
import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";
import { loadable } from "jotai/utils";
import TransitionLink from "./transition-link";

const loadableCategoriesState = loadable(categoriesState);

// Thêm props để có thể truyền vào tùy chọn `replace`
export interface CategorySliderProps {
  replace?: boolean;
}

export default function CategorySlider({ replace = false }: CategorySliderProps) {
  const { id } = useParams();
  const categoriesLoadable = useAtomValue(loadableCategoriesState);

  if (categoriesLoadable.state === 'loading') {
    return (
      <div className="px-3 py-2 overflow-x-auto flex space-x-2">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-8 w-20 flex-none rounded-full bg-gray-300 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (categoriesLoadable.state === 'hasError') {
    return <div className="px-3 py-2">Error loading categories.</div>;
  }

  const categories = categoriesLoadable.data;

 return (
    <div className="px-3 py-2 overflow-x-auto flex space-x-2">
      {categories.map((category) => (
        <TransitionLink
          to={`/category/${category.id}`}
          key={category.id}
          // Sử dụng thuộc tính `replace` được truyền vào
          replace={replace}
          className={"h-8 flex-none rounded-full p-1 pr-2 flex items-center space-x-1 border border-black/15 ".concat(
            String(category.id) === id
              ? "bg-primary text-primaryForeground"
              : "bg-section"
          )}
        >
          <img
            src={category.image}
            className="w-6 h-6 rounded-full bg-skeleton"
          />
          <p className="text-xs whitespace-nowrap">{category.name}</p>
        </TransitionLink>
      ))}
    </div>
  );
}