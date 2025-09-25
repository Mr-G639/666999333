// src/pages/catalog/product-detail.tsx

import React, { ReactNode, Suspense, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { Button, Icon, Text } from "zmp-ui";

import { favoriteProductsState, productState } from "@/state";
import { useCartActions } from "@/hooks/useCart"; // SỬA LỖI: Import hook đã được chuẩn hóa
import { formatPrice } from "@/utils/format";
import { Product } from "@/types";

import Section from "@/components/section";
import Carousel from "@/components/carousel";
import { HeartIcon } from "@/components/vectors";
import HorizontalDivider from "@/components/horizontal-divider";
import { ProductGridSkeleton } from "@/components/skeleton";

import RelatedProducts from "./related-products";
import ProductReviewsSummary from "./product-reviews/summary";
import QuantityInput from "@/components/quantity-input";

const ShareButton: React.FC<{ product: Product }> = ({ product }) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    const shareData = {
      title: product.name,
      text: `Kiểm tra sản phẩm này: ${product.name}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Bỏ qua lỗi nếu người dùng hủy chia sẻ
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Đã sao chép liên kết sản phẩm");
    } catch {
      toast.error("Không thể chia sẻ");
    }
  };

  return (
    <button type="button" onClick={handleShare} className="w-full h-9 rounded bg-gray-100 text-gray-700">
      Chia sẻ
    </button>
  );
};

function ProductDetailContent() {
  const { id } = useParams<{ id: string }>();
  const product = useAtomValue(productState(Number(id)));
  const [favorites, setFavorites] = useAtom(favoriteProductsState);
  
  // SỬA LỖI: Sử dụng hook tập trung thay vì logic cục bộ
  const { updateCart } = useCartActions(); 
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [isMuted] = useState(true);
  const [, setActiveSlideIndex] = useState(0);

  if (!product) {
    return <ProductGridSkeleton />;
  }
  
  // SỬA LỖI: Xóa bỏ hoàn toàn hàm addToCart cục bộ đã lỗi thời
  
  const isFavorited = favorites.includes(product.id);

  const toggleFavorite = () => {
    const message = isFavorited ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích";
    toast.success(message, { id: 'favorite-toast' });
    setFavorites((prev) => isFavorited ? prev.filter((favId) => favId !== product.id) : [...prev, product.id]);
  };
  
  const mediaSlides: ReactNode[] = useMemo(() => {
    const slides: ReactNode[] = [];
    if (product.video) {
      slides.push(<video key="product-video" src={product.video} playsInline autoPlay muted={isMuted} loop className="w-full aspect-square object-cover rounded-lg" />);
    }
    product.images.forEach((imgSrc, i) => {
      slides.push(<img key={`product-image-${i}`} src={imgSrc} alt={product.name} className="w-full aspect-square object-cover rounded-lg" />);
    });
    return slides;
  }, [product, isMuted]);

  const discountPercent = useMemo(() => {
    if (product.originalPrice && product.price) {
      return 100 - Math.round((product.price * 100) / product.originalPrice);
    }
    return null;
  }, [product.price, product.originalPrice]);

  const handleBuyNow = () => {
    if (!product) return;
    // SỬA LỖI: Gọi hàm `updateCart` từ hook
    updateCart(product, quantity);
    navigate("/cart/delivery");
  };

  const handleAddToCart = () => {
    if (!product) return;
    // SỬA LỖI: Gọi hàm `updateCart` từ hook
    updateCart(product, quantity, { toast: true });
  };

  return (
    <div className="w-full h-full flex flex-col bg-section">
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          <Carousel slides={mediaSlides} onSlideChange={setActiveSlideIndex} />
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-red-50 rounded-lg p-3 text-foreground">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Text.Title className="text-red-600 !text-2xl !font-bold">{formatPrice(product.price)}</Text.Title>
                {discountPercent !== null && (
                  <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded">
                    GIẢM {discountPercent}%
                  </span>
                )}
              </div>
              {product.soldCount && (
                <Text size="xSmall" className="text-gray-600">Đã bán {product.soldCount}+</Text>
              )}
            </div>
            {product.originalPrice && (
              <div className="mt-1">
                <Text size="small" className="text-gray-500 line-through">{formatPrice(product.originalPrice)}</Text>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold">{product.name}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="flex-none !bg-red-100 !text-red-500 h-9 aspect-square" onClick={toggleFavorite}>
              <HeartIcon active={isFavorited} className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <ShareButton product={product} />
            </div>
          </div>
        </div>
        <div className="bg-background h-2 w-full"></div>
        <Suspense fallback={<div className="p-4">Đang tải đánh giá...</div>}>
          <ProductReviewsSummary productId={product.id} />
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
      <div className="flex-none p-3 bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-3">
          <Text.Title size="small">Số lượng</Text.Title>
          <QuantityInput value={quantity} onChange={setQuantity} />
        </div>
        <div className="flex items-center space-x-3">
          <Button
            disabled={!product}
            onClick={handleAddToCart}
            variant="secondary"
            className="flex-1"
            style={{ flexBasis: '33.33%' }}
          >
            <Icon icon="zi-plus-circle" />
          </Button>
          <Button
            disabled={!product}
            onClick={handleBuyNow}
            fullWidth
            className="flex-grow"
            style={{ flexBasis: '66.67%' }}
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
}

const ProductDetailPage = () => {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductDetailContent />
    </Suspense>
  );
};

export default ProductDetailPage;