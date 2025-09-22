// src/pages/home/category.tsx

import React from "react";
import { Box, Text } from "zmp-ui";
import { Category } from "@/types";
import { useNavigate } from "react-router-dom";

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const navigate = useNavigate();

  return (
    <Box className="bg-white">
      <Box p={4}>
        <Text.Title size="small">Danh mục</Text.Title>
      </Box>
      <div className="bg-white grid grid-cols-5 gap-4 p-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center space-y-2 text-center"
            onClick={() => navigate(`/category/${category.id}`)}
          >
            <img
              // SỬA LỖI: Sử dụng đúng thuộc tính 'icon'
              src={category.icon}
              alt={category.name}
              className="w-12 h-12"
            />
            <Text size="xxSmall">{category.name}</Text>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default Categories;