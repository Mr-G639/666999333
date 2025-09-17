// src/pages/home/flash-sales.tsx

import ProductGrid from "@/components/product-grid";
import Section from "@/components/section";
import { useAtomValue } from "jotai";
import { flashSaleProductsState } from "@/state";

export default function FlashSales() {
  const products = useAtomValue(flashSaleProductsState);

  // --- SỬA LỖI TẠI ĐÂY ---
  // Chuẩn hóa dữ liệu hình ảnh trong category của mỗi sản phẩm
  const normalizedProducts = products.map((product) => ({
    ...product,
    category: {
      ...product.category,
      image:
        typeof product.category.image === "string"
          ? product.category.image
          : (product.category.image as any).default,
    },
  }));

  return (
    <Section title="Giá tốt hôm nay">
      <ProductGrid products={normalizedProducts} layout="horizontal" />
    </Section>
  );
}