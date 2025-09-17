import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { productState } from "@/state";
import { formatPrice } from "@/utils/format";
import ShareButton from "./share-buttont";
import RelatedProducts from "./related-products";
import { useAddToCart } from "@/hooks";
import { Button } from "zmp-ui";
import Section from "@/components/section";
import Carousel from "@/components/carousel";
import { ReactNode } from "react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useAtomValue(productState(Number(id)))!;
  const navigate = useNavigate();

  const normalizedProduct = {
    ...product,
    category: {
      ...product.category,
      image:
        typeof product.category.image === "string"
          ? product.category.image
          : (product.category.image as any).default,
    },
  };

  const { addToCart } = useAddToCart(normalizedProduct);

  // --- THAY ĐỔI BẮT ĐẦU TỪ ĐÂY ---
  // Tạo một mảng chứa các slide media (cả video và ảnh)
  const mediaSlides: ReactNode[] = [];

  // Nếu sản phẩm có video, thêm slide video vào đầu mảng
  if (normalizedProduct.video) {
    mediaSlides.push(
      <video
        key="product-video"
        src={normalizedProduct.video}
        playsInline
        controls
        className="w-full aspect-square object-cover rounded-lg"
      />
    );
  }

  // Thêm các slide hình ảnh vào mảng
  normalizedProduct.images.forEach((imgSrc, i) => {
    mediaSlides.push(
      <img
        key={`product-image-${i}`}
        src={imgSrc}
        alt={normalizedProduct.name}
        className="w-full aspect-square object-cover rounded-lg"
        style={{
          viewTransitionName: i === 0 && !normalizedProduct.video ? `product-image-${product.id}` : undefined,
        }}
      />
    );
  });
  // --- KẾT THÚC THAY ĐỔI ---

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-4 pb-2 space-y-4 bg-section">
          {/* Truyền mảng mediaSlides đã tạo vào Carousel */}
          <Carousel slides={mediaSlides} />
          
          <div>
            <div className="text-xl font-bold text-primary">
              {formatPrice(normalizedProduct.price)}
            </div>
            {normalizedProduct.originalPrice && (
              <div className="text-2xs space-x-0.5">
                <span className="text-subtitle line-through">
                  {formatPrice(normalizedProduct.originalPrice)}
                </span>
                <span className="text-danger">
                  -
                  {100 -
                    Math.round((normalizedProduct.price * 100) / normalizedProduct.originalPrice)}
                  %
                </span>
              </div>
            )}
            <div className="text-sm mt-1">{normalizedProduct.name}</div>
          </div>
          <ShareButton product={normalizedProduct} />
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
          <RelatedProducts currentProductId={product.id} />
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