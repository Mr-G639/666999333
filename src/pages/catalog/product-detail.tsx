import HorizontalDivider from "@/components/horizontal-divider";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { productState, favoriteProductsState } from "@/state";
import { formatPrice } from "@/utils/format";
import ShareButton from "./share-buttont";
import RelatedProducts from "./related-products";
import { useAddToCart } from "@/hooks/useCart";
import { Button, Icon } from "zmp-ui";
import Section from "@/components/section";
import Carousel from "@/components/carousel";
import { ReactNode, useMemo, useState, Suspense } from "react";
import { HeartIcon } from "@/components/vectors";
import { ProductGridSkeleton } from "@/components/skeleton";

function ProductDetailContent() {
  const { id } = useParams();
  const product = useAtomValue(productState(Number(id)));
  const [favorites, setFavorites] = useAtom(favoriteProductsState);
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);

  const normalizedProduct = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      category: {
        ...product.category,
        image:
          typeof product.category.image === "string"
            ? product.category.image
            : (product.category.image as any).default,
      },
    };
  }, [product]);
  
  if (!normalizedProduct) {
    return null;
  }

  const isFavorited = favorites.includes(normalizedProduct.id);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      isFavorited
        ? prev.filter((favId) => favId !== normalizedProduct.id)
        : [...prev, normalizedProduct.id]
    );
  };

  const { addToCart } = useAddToCart(normalizedProduct);

  const mediaSlides: ReactNode[] = [];

  if (normalizedProduct.video) {
    mediaSlides.push(
      <video
        key="product-video"
        src={normalizedProduct.video}
        playsInline
        autoPlay
        muted={isMuted}
        loop
        className="w-full aspect-square object-cover rounded-lg"
      />
    );
  }

  normalizedProduct.images.forEach((imgSrc, i) => {
    mediaSlides.push(
      <img
        key={`product-image-${i}`}
        src={imgSrc}
        alt={normalizedProduct.name}
        className="w-full aspect-square object-cover rounded-lg"
        style={{
          viewTransitionName: i === 0 && !normalizedProduct.video ? `product-image-${normalizedProduct.id}` : undefined,
        }}
      />
    );
  });

  return (
    <div className="w-full h-full flex flex-col bg-section">
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          <Button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-10 !bg-black/40 !border-none"
            icon={<Icon icon="zi-arrow-left" className="text-white" />}
          />
          
          <Carousel slides={mediaSlides} />

          
          {normalizedProduct.video && (
            <Button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-10 right-4 z-10 !bg-black/40 !border-none"
              // The following line has been corrected
              icon={<Icon icon={isMuted ? 'zi-notif-off' : 'zi-notif'} className="text-white" />}
            />
          )}
        </div>
        
        <div className="p-4 space-y-4">
          
          <div className="bg-red-50 rounded-lg p-3 text-foreground">
            
            <div className="flex justify-between items-center">
              
              <div className="flex items-center space-x-2">
                <span className="text-red-600 text-2xl font-bold">{formatPrice(normalizedProduct.price)}</span>
                {normalizedProduct.originalPrice && (
                    <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded">
                        GIẢM {100 - Math.round((normalizedProduct.price * 100) / normalizedProduct.originalPrice)}%
                    </span>
                )}
              </div>
              {normalizedProduct.soldCount && (
                  <span className="text-sm text-gray-600">Đã bán {normalizedProduct.soldCount}+</span>
              )}
            </div>
            
            {normalizedProduct.originalPrice && (
              <div className="mt-1">
                  <span className="text-gray-500 line-through">{formatPrice(normalizedProduct.originalPrice)}</span>
              </div>
            )}
          </div>

          
          <div>
            <h1 className="text-lg font-bold">{normalizedProduct.name}</h1>
          </div>
          
          
          <div className="flex items-center space-x-2">
            <Button
              className="flex-none !bg-red-100 !text-red-500 h-9 aspect-square"
              onClick={toggleFavorite}
            >
              <HeartIcon active={isFavorited} className="w-6 h-6"/>
            </Button>
            <div className="flex-1">
                <ShareButton product={normalizedProduct} />
            </div>
          </div>
        </div>

        {normalizedProduct.detail && (
          <>
            <div className="bg-background h-2 w-full"></div>
            <Section title="Mô tả sản phẩm">
              <div className="text-sm whitespace-pre-wrap text-subtitle p-4 pt-2">
                {normalizedProduct.detail}
              </div>
            </Section>
          </>
        )}
        <div className="bg-background h-2 w-full"></div>
        <Section title="Sản phẩm khác">
          <RelatedProducts currentProductId={normalizedProduct.id} />
        </Section>
      </div>

      <HorizontalDivider />
      <div className="flex-none grid grid-cols-2 gap-2 py-3 px-4 bg-section">
        <Button
          variant="tertiary"
          onClick={() => {
            addToCart(1, {
              toast: true,
            });
          }}
        >
          Thêm vào giỏ
        </Button>
        <Button
          onClick={() => {
            addToCart(1);
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
    )
}