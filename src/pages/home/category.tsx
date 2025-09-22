// src/pages/home/category.tsx

import React from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "zmp-ui";
import { Category } from "@/types";
import Section from "@/components/section";
import SeeMoreIcon from "@/static/see-more.png"; // Tạo một icon "Tất cả"

interface CategoriesProps {
  categories: Category[];
}

const CategoryItem: React.FC<{ category: Category }> = ({ category }) => (
  <Link
    to={`/category/${category.id}`}
    className="flex flex-col space-y-2 items-center text-center"
  >
    <img
      className="w-12 h-12 rounded-full"
      src={category.icon}
      alt={category.name}
    />
    <Text size="xxSmall" className="text-gray-600">
      {category.name}
    </Text>
  </Link>
);

const SeeMoreItem: React.FC = () => (
  <Link
    to="/categories"
    className="flex flex-col space-y-2 items-center text-center"
  >
    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
        {/* Bạn có thể dùng icon khác ở đây */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 17a1 1 0 0 1-1-1a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2zm-5-4a1 1 0 0 1-1-1a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2zm2-4a1 1 0 0 1-1-1a1 1 0 0 1 1-1h6a1 1 0 0 1 0 2z"/></svg>
    </div>
    <Text size="xxSmall" className="text-gray-600">
      Tất cả
    </Text>
  </Link>
);

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  if (categories.length === 0) {
    return null;
  }
  return (
    <Section title="Danh Mục">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-flex space-x-6 p-4">
          {categories.slice(0, 8).map((category) => (
            <div key={category.id} className="w-16 flex-shrink-0">
              <CategoryItem category={category} />
            </div>
          ))}
          <div className="w-16 flex-shrink-0">
            <SeeMoreItem />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Categories;