// src/pages/home/all-products.tsx

import ProductGrid from "@/components/product-grid";
import Section from "@/components/section";
import { useAtomValue } from "jotai";
import { productsState } from "@/state";

export default function AllProducts() {
  const products = useAtomValue(productsState);

  return (
    <Section title="Tất cả sản phẩm">
      <ProductGrid products={products} />
    </Section>
  );
}