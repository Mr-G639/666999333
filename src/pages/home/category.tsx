// src/pages/home/category.tsx

import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";
import { loadable } from "jotai/utils";
import TransitionLink from "@/components/transition-link";
import { Icon } from "zmp-ui";

// Component con cho nút "Tất cả danh mục"
const AllCategoriesItem = () => (
  <TransitionLink
    className="flex flex-col items-center space-y-1 flex-none w-16" // Cố định chiều rộng
    to="/categories"
  >
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <Icon icon="zi-more-grid" className="text-gray-500" />
    </div>
    <div className="text-center text-3xs w-full line-clamp-2 text-subtitle">
      Tất cả
    </div>
  </TransitionLink>
);

const loadableCategoriesState = loadable(categoriesState);

export default function Category() {
  const categoriesLoadable = useAtomValue(loadableCategoriesState);

  // Giao diện khi đang tải dữ liệu
  if (categoriesLoadable.state === 'loading') {
    return (
      <div className="bg-section p-4">
          <div className="flex space-x-4 overflow-x-auto no-scrollbar">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 flex-none w-16">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="text-center text-3xs w-14 h-3 bg-gray-200 animate-pulse rounded mt-1"></div>
              </div>
            ))}
          </div>
      </div>
    );
  }

  if (categoriesLoadable.state === 'hasError') {
    return <div className="p-4 text-red-500">Lỗi tải danh mục.</div>;
  }

  const categories = categoriesLoadable.data;
  // Lấy 9 danh mục đầu tiên để hiển thị, chừa chỗ cho nút "Tất cả"
  const itemsToShow = categories.slice(0, 9);

  return (
    <div className="bg-section p-4">
      <div className="flex space-x-4 overflow-x-auto no-scrollbar">
          {itemsToShow.map((category) => (
            <TransitionLink
              key={category.id}
              className="flex flex-col items-center space-y-1 flex-none w-16"
              to={`/category/${category.id}`}
            >
              <img
                src={category.image}
                className="w-12 h-12 object-cover rounded-full bg-skeleton"
                alt={category.name}
              />
              <div className="text-center text-3xs w-full line-clamp-2 text-subtitle">
                {category.name}
              </div>
            </TransitionLink>
          ))}
          {/* Luôn hiển thị nút "Tất cả" ở cuối */}
          <AllCategoriesItem />
      </div>
    </div>
  );
}