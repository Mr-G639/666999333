// src/pages/catalog/product-detail.tsx

import HorizontalDivider from "@/components/horizontal-divider";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { productState, favoriteProductsState } from "@/state";
import { formatPrice } from "@/utils/format";
import ShareButton from "./share-buttont";
import RelatedProducts from "./related-products";
import { useCartActions } from "@/hooks/useCart";
import { Button } from "zmp-ui";
import Section from "@/components/section";
import Carousel from "@/components/carousel";
import { ReactNode, useState, Suspense } from "react";
import { HeartIcon } from "@/components/vectors";
import { ProductGridSkeleton } from "@/components/skeleton";
import ProductReviews from "./product-reviews";

function ProductDetailContent() {
  const { id } = useParams();
  const product = useAtomValue(productState(Number(id)));
  const [favorites, setFavorites] = useAtom(favoriteProductsState);
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { addToCart } = useCartActions();

  if (!product) {
    return null;
  }

  const isFavorited = favorites.includes(product.id);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      isFavorited
        ? prev.filter((favId) => favId !== product.id)
        : [...prev, product.id]
    );
  };

  const mediaSlides: ReactNode[] = [];

  if (product.video) {
    mediaSlides.push(
      <video
        key="product-video"
        src={product.video}
        playsInline
        autoPlay
        muted={isMuted}
        loop
        className="w-full aspect-square object-cover rounded-lg"
      />
    );
  }

  product.images.forEach((imgSrc, i) => {
    mediaSlides.push(
      <img
        key={`product-image-${i}`}
        src={imgSrc}
        alt={product.name}
        className="w-full aspect-square object-cover rounded-lg"
        style={{
          viewTransitionName:
            i === 0 && !product.video
              ? `product-image-${product.id}`
              : undefined,
        }}
      />
    );
  });

  return (
    <div className="w-full h-full flex flex-col bg-section">
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          <Carousel
            slides={mediaSlides}
            onSlideChange={setActiveSlideIndex}
          />
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-red-50 rounded-lg p-3 text-foreground">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded">
                    GIẢM{" "}
                    {100 -
                      Math.round(
                        (product.price * 100) /
                          product.originalPrice
                      )}
                    %
                  </span>
                )}
              </div>
              {product.soldCount && (
                <span className="text-sm text-gray-600">
                  Đã bán {product.soldCount}+
                </span>
              )}
            </div>

            {product.originalPrice && (
              <div className="mt-1">
                <span className="text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-lg font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              className="flex-none !bg-red-100 !text-red-500 h-9 aspect-square"
              onClick={toggleFavorite}
            >
              <HeartIcon active={isFavorited} className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <ShareButton product={product} />
            </div>
          </div>
        </div>
        
        {/* === BỐ CỤC MỚI === */}
        <div className="bg-background h-2 w-full"></div>
        <Suspense fallback={<div className="p-4">Đang tải đánh giá...</div>}>
          <ProductReviews productId={product.id} />
        </Suspense>

        {product.detail && (
          <>
            <div className="bg-background h-2 w-full"></div>
            <Section title="Mô tả sản phẩm">
              <div className="text-sm whitespace-pre-wrap text-subtitle p-4 pt-2">
                {product.detail}
              </div>
            </Section>
          </>
        )}
        
        <div className="bg-background h-2 w-full"></div>
        <Section title="Sản phẩm khác">
          <RelatedProducts currentProductId={product.id} />
        </Section>
      </div>

      <HorizontalDivider />
      <div className="flex-none grid grid-cols-2 gap-2 py-3 px-4 bg-section">
        <Button
          variant="tertiary"
          onClick={() => {
            addToCart(product, 1, { toast: true });
          }}
        >
          Thêm vào giỏ
        </Button>
        <Button
          onClick={() => {
            addToCart(product, 1);
            navigate("/cart", {
              viewTransition: true,
            });
          }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductDetailContent />
    </Suspense>
  );
}