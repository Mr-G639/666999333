import ProductGrid from "@/components/product-grid";
import Section from "@/components/section";
import { useAtomValue } from "jotai";
import { productsState } from "@/state";

export default function AllProducts() {
  const products = useAtomValue(productsState);

  const normalizedProducts = products.map((product) => ({
    ...product,
    category: {
      ...product.category,
      image:
        typeof product.category.image === "string"
          ? product.category.image
          : product.category.image.default,
    },
  }));

  return (
    <Section title="Tất cả sản phẩm">
      <ProductGrid products={normalizedProducts} />
    </Section>
  );
}