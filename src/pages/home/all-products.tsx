// src/pages/home/all-products.tsx

import React from "react";
import { Box, Text } from "zmp-ui";
import ProductItem from "@/components/product-item";
import { Product } from "@/types";

interface AllProductsProps {
  products: Product[];
}

const AllProducts: React.FC<AllProductsProps> = ({ products }) => {
  return (
    <Box className="bg-white">
      <Box p={4}>
        <Text.Title size="small">Tất cả sản phẩm</Text.Title>
      </Box>
      {/* SỬA LỖI: Thêm class grid để tạo layout lưới 2 cột */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </Box>
  );
};

export default AllProducts;