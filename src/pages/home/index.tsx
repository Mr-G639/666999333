// src/pages/home/index.tsx

import React, { useEffect, useState } from "react";
import { Box, Page } from "zmp-ui";
import { getCategories } from "../../api/categories";
import { getAllProducts } from "../../api/products";
import { Category, Product } from "../../types";
import Header from "../../components/header";
import Banners from "./banners";
import Categories from "./category";
import FlashSales from "./flash-sales";
import AllProducts from "./all-products";

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);

  useEffect(() => {
    getCategories()
      .then((res: Category[]) => {
        setCategories(res);
      })
      .catch((error: any) => {
        console.error("Lỗi khi tải danh mục:", error);
      });

    getAllProducts()
      .then((res: { data: Product[] }) => {
        // Logic này bây giờ đã chính xác vì bạn đã cập nhật file types.d.ts
        const flashSales = res.data.filter(product => product.sale?.isFlashSale);
        setFlashSaleProducts(flashSales);
        setAllProducts(res.data);
      })
      .catch((error: any) => {
        console.error("Lỗi khi tải tất cả sản phẩm:", error);
      });
  }, []);

  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Header />
      <Box className="flex-1 overflow-auto">
        <Banners />
        <Categories categories={categories} />
        <FlashSales products={flashSaleProducts} />
        <AllProducts products={allProducts} />
      </Box>
    </Page>
  );
};

export default HomePage;