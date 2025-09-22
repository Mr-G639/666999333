// src/pages/home/category.tsx

import { FC } from "react";
import { Text } from "zmp-ui";
import { Category } from "../../types";
import TransitionLink from "../../components/transition-link";
import Section from "../../components/section";
import allCategoryIcon from "../../static/category/tat-ca.png";

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: FC<CategoryListProps> = ({ categories }) => {
  const allCategory = {
    id: "all",
    name: "Tất cả",
    icon: allCategoryIcon,
  };

  const displayCategories = [allCategory, ...categories.slice(0, 8)];

  return (
    // Sửa: Xóa prop 'padding' và thêm class p-4
    <Section title="Danh mục" className="bg-white p-4">
      <div className="flex flex-row overflow-x-auto space-x-2 no-scrollbar">
        {categories.length === 0
          ? Array.from(new Array(9)).map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-shrink-0 w-20 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="mt-1 h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))
          : displayCategories.map((category) => (
              <TransitionLink key={category.id} to={category.id === "all" ? "/category-list" : `/category-detail/${category.id}`}>
                <div className="flex flex-col items-center flex-shrink-0 w-20 text-center space-y-1">
                  <img className="w-12 h-12 rounded-full" src={category.icon} alt={category.name} />
                  <Text size="xxSmall" className="text-gray-600">{category.name}</Text>
                </div>
              </TransitionLink>
            ))}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Section>
  );
};

export default CategoryList;