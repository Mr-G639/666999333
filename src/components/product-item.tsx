// src/components/product-item.tsx

import { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import TransitionLink from "./transition-link";
import { useState } from "react";
import { Button } from "zmp-ui";
import { useCartActions, useCartItemQuantity } from "@/hooks/useCart"; // SỬA LỖI: Import hook mới
import QuantityInput from "./quantity-input";
import MarqueeText from "./marquee-text";

export interface ProductItemProps {
  product: Product;
  replace?: boolean;
}

export default function ProductItem(props: ProductItemProps) {
  const [selected, setSelected] = useState(false);
  
  // Tách biệt logic đọc và ghi để tối ưu hiệu năng
  const { addToCart } = useCartActions(); // Chỉ lấy hành động, không gây re-render
  const cartQuantity = useCartItemQuantity(props.product.id); // Chỉ lắng nghe sự thay đổi số lượng của sản phẩm này

  const handleQuantityChange = (quantity: number, options?: { toast: boolean }) => {
    addToCart(props.product, quantity, options);
  };

  return (
    <div
      className="flex flex-col cursor-pointer group bg-section rounded-xl shadow-[0_10px_24px_#0D0D0D17]"
      onClick={() => setSelected(true)}
    >
      <TransitionLink
        to={`/product/${props.product.id}`}
        replace={props.replace}
        className="p-2 pb-0 flex flex-col flex-1"
      >
        {({ isTransitioning }) => (
          <>
            <img
              src={props.product.images[0]}
              className="w-full aspect-square object-cover rounded-lg"
              style={{
                viewTransitionName:
                  isTransitioning && selected
                    ? `product-image-${props.product.id}`
                    : undefined,
              }}
              alt={props.product.name}
            />
            <div className="pt-2 pb-1.5 flex flex-col flex-1">
              <div className="h-5 text-xs font-bold">
                <MarqueeText text={props.product.name} />
              </div>

              <div className="mt-1 flex-1 flex flex-col justify-end space-y-1">
                <div className="flex justify-between items-center">
                  <div className="text-base font-bold text-primary">
                    {formatPrice(props.product.price)}
                  </div>
                  {props.product.originalPrice && (
                    <span className="text-danger font-medium text-2xs">
                      -
                      {Math.round(
                        (1 -
                          props.product.price / props.product.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-2xs">
                  {props.product.originalPrice ? (
                    <span className="line-through text-subtitle">
                      {formatPrice(props.product.originalPrice)}
                    </span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                  {props.product.soldCount && (
                    <div className="text-subtitle">
                      Đã bán {props.product.soldCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </TransitionLink>
      <div className="p-2">
        {cartQuantity === 0 ? (
          <Button
            variant="secondary"
            size="small"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(1, { toast: true });
            }}
          >
            Thêm vào giỏ
          </Button>
        ) : (
          <QuantityInput value={cartQuantity} onChange={handleQuantityChange} />
        )}
      </div>
    </div>
  );
}