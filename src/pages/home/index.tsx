// src/pages/home/index.tsx

import React, { Suspense } from "react";
import { Box, Page } from "zmp-ui";
import { useAtomValue } from "jotai";
import {
  productsState,
  flashSaleProductsState,
} from "@/state";

import Banners from "./banners";
import FlashSales from "./flash-sales";
import AllProducts from "./all-products";
import { PageSkeleton } from "@/components/skeleton";

/**
 * Component con chứa nội dung chính của trang chủ.
 * Cấu trúc này đã được tinh gọn để tập trung vào các thành phần cốt lõi.
 */
const HomePageContent: React.FC = () => {
  const allProducts = useAtomValue(productsState);
  const flashSaleProducts = useAtomValue(flashSaleProductsState);

  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Box className="flex-1 overflow-auto">
        {/* Sử dụng space-y-4 để tạo khoảng cách đồng nhất giữa các section */}
        <div className="flex flex-col space-y-0">
          <Banners />
          <FlashSales products={flashSaleProducts} />
          <AllProducts products={allProducts} />
        </div>
      </Box>
    </Page>
  );
};

/**
 * Component cha của trang chủ.
 * Chịu trách nhiệm xử lý trạng thái chờ (loading) trong khi ứng dụng
 * tìm nạp dữ liệu, mang lại trải nghiệm mượt mà.
 */
const HomePage: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
};

export default HomePage;