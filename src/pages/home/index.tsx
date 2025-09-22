// src/pages/home/index.tsx

import React, { useEffect, useState } from "react";
import { Box, Page } from "zmp-ui";
import { getCategories } from "@/api/categories";
import { getAllProducts } from "@/api/products"; // Sửa lỗi 1: Import đúng tên hàm
import { Category, Product } from "@/types";

import Banners from "./banners";
import Categories from "./category";
import FlashSales from "./flash-sales";
import AllProducts from "./all-products";
import Header from "@/components/header";

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Refactor và Sửa lỗi 2: Tối ưu hóa việc gọi API
  useEffect(() => {
    // Gọi API lấy danh mục sản phẩm
    getCategories().then(setCategories).catch(error => {
      console.error("Failed to fetch categories:", error);
    });

    // Gọi API lấy danh sách tất cả sản phẩm
    getAllProducts().then(res => {
      // Xử lý đúng response trả về từ API (có phân trang)
      setProducts(res.data);
    }).catch(error => {
      console.error("Failed to fetch products:", error);
    });
  }, []);

  const CategoriesComponent = Categories as unknown as React.ComponentType<{ categories: Category[] }>;
  const FlashSalesComponent = FlashSales as unknown as React.ComponentType<{ products: Product[] }>;
  const AllProductsComponent = AllProducts as unknown as React.ComponentType<{ products: Product[] }>;

  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Header />
      <Box className="flex-1 overflow-auto">
        <Banners />
        <CategoriesComponent categories={categories} />
        <FlashSalesComponent products={products} />
        <AllProductsComponent products={products} />
      </Box>
    </Page>
  );
};

export default HomePage;