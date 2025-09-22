// src/pages/catalog/category-list.tsx

import React, { Suspense } from 'react';
import { useAtomValue } from 'jotai';
import { categoriesState } from '@/state';
import { Box, Text } from 'zmp-ui';
import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { PageSkeleton } from '@/components/skeleton';

/**
 * Component hiển thị một mục danh mục.
 */
const CategoryItem: React.FC<{ category: Category }> = ({ category }) => (
  <Link to={`/category/${category.id}`} className="block bg-white rounded-lg shadow-sm">
    <div className="p-4 flex items-center space-x-4">
      <img src={category.icon} alt={category.name} className="w-12 h-12" />
      <Text className="font-semibold">{category.name}</Text>
    </div>
  </Link>
);

/**
 * Nội dung chính của trang, chỉ render khi có dữ liệu.
 */
const CategoryListContent: React.FC = () => {
  const categories = useAtomValue(categoriesState);

  return (
    <Box className="p-4">
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </Box>
  );
};

/**
 * Trang hiển thị danh sách tất cả các danh mục sản phẩm.
 */
const CategoryListPage: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategoryListContent />
    </Suspense>
  );
};

export default CategoryListPage;