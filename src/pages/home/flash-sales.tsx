// src/pages/home/flash-sales.tsx

import { FC } from "react";
import { Product } from "../../types";
import ProductItem from "../../components/product-item";
import { ProductItemSkeleton } from "../../components/skeleton";
import Section from "../../components/section";

interface FlashSalesProps {
  products: Product[];
}

const FlashSales: FC<FlashSalesProps> = ({ products }) => {
  return (
    // Sửa: Xóa prop 'padding' và thêm class p-4
    <Section title="⚡ Flash Sale" className="bg-white p-4">
      <div className="grid grid-cols-2 gap-4">
        {products.length === 0
          ? Array.from(new Array(4)).map((_, i) => <ProductItemSkeleton key={i} />)
          : products.map((product) => <ProductItem key={product.id} product={product} />)}
      </div>
    </Section>
  );
};

export default FlashSales;