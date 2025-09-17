// src/pages/profile/wishlist.tsx

import { EmptyWishlist } from "@/components/empty";
import ProductGrid from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/skeleton";
import { favoriteProductsDetailsState } from "@/state";
import { useAtomValue } from "jotai";
import { Suspense } from "react";
import { Header, Page } from "zmp-ui";

const Wishlist = () => {
    const favoriteProducts = useAtomValue(favoriteProductsDetailsState);

    if (favoriteProducts.length === 0) {
        return <EmptyWishlist />;
    }

    return <ProductGrid products={favoriteProducts} />;
}

const WishlistPage = () => {
  return (
    <Page className="flex flex-col">
      <Header title="Sản phẩm yêu thích" showBackIcon />
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<ProductGridSkeleton />}>
            <Wishlist />
        </Suspense>
      </div>
    </Page>
  );
};

export default WishlistPage;