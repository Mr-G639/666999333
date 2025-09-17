// src/pages/home/category.tsx

import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";
import { loadable } from "jotai/utils";

const loadableCategoriesState = loadable(categoriesState);

export default function Category() {
  const categoriesLoadable = useAtomValue(loadableCategoriesState);

  if (categoriesLoadable.state === 'loading') {
    return (
      <div
        className="bg-section grid gap-x-2 gap-y-4 py-2 px-4 overflow-x-auto"
        style={{
          gridTemplateColumns: `repeat(4, minmax(70px, 1fr))`,
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center space-y-1 flex-none overflow-hidden cursor-pointer mx-auto">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="text-center text-3xs w-full h-3 bg-gray-300 animate-pulse rounded mt-1"></div>
          </div>
        ))}
      </div>
    );
  }

  if (categoriesLoadable.state === 'hasError') {
    console.error("Error loading categories:", categoriesLoadable.error);
    return <div className="p-4 text-red-500">Error loading categories.</div>;
  }

  const categories = categoriesLoadable.data;

  // --- SỬA LỖI TẠI ĐÂY ---
  // Chuẩn hóa dữ liệu để đảm bảo `image` luôn là một chuỗi (string)
  const normalizedCategories = categories.map((category) => ({
    ...category,
    image:
      typeof category.image === "string"
        ? category.image
        : (category.image as any).default,
  }));

  return (
    <div
      className="bg-section grid gap-x-2 gap-y-4 py-2 px-4 overflow-x-auto"
      style={{
        gridTemplateColumns: `repeat(${Math.ceil(
          categories.length > 4 ? categories.length / 2 : categories.length
        )}, minmax(70px, 1fr))`,
      }}
    >
      {/* Sử dụng dữ liệu đã được chuẩn hóa */}
      {normalizedCategories.map((category) => (
        <TransitionLink
          key={category.id}
          className="flex flex-col items-center space-y-1 flex-none overflow-hidden cursor-pointer mx-auto"
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
    </div>
  );
}