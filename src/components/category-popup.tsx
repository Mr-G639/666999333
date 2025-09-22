// src/components/category-popup.tsx

import React from "react";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";
import { Sheet, Box, Text } from "zmp-ui";
import { Link } from "react-router-dom";
import { Category } from "@/types";

interface CategoryPopupProps {
  visible: boolean;
  onClose: () => void;
}

const CategoryPopup: React.FC<CategoryPopupProps> = ({ visible, onClose }) => {
  const categories = useAtomValue(categoriesState);

  // Component đệ quy để render danh mục và các cấp con
  const renderCategory = (category: Category, level = 0) => (
    <div key={category.id} style={{ marginLeft: `${level * 20}px` }}>
      <Link
        to={`/category/${category.id}`}
        onClick={onClose}
        className="block py-3 px-4 text-gray-800 hover:bg-gray-100"
      >
        <Text>{category.name}</Text>
      </Link>
      {category.children && (
        <div className="border-l-2 border-gray-200">
          {category.children.map(child => renderCategory(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      autoHeight
      mask
      handler
      swipeToClose
    >
      <Box className="p-4">
        <Text.Title className="mb-4">Danh Mục Sản Phẩm</Text.Title>
        <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {categories.map(category => renderCategory(category))}
        </div>
      </Box>
    </Sheet>
  );
};

export default CategoryPopup;