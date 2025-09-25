// src/components/product-item.tsx

import React, { FC, useState, useMemo } from "react";
import { Button, Icon } from "zmp-ui";
import toast from 'react-hot-toast'; // SỬA LỖI: Thêm import còn thiếu

import { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import { getFinalPrice } from "@/utils/cart";
import { useCartActions, useCartItemQuantity } from "@/hooks/useCart";

import TransitionLink from "./transition-link";
import QuantityInput from "./quantity-input";
import MarqueeText from "./marquee-text";

export interface ProductItemProps {
  product: Product;
  replace?: boolean;
}

const ProductItem: FC<ProductItemProps> = ({ product, replace }) => {
  const [selected, setSelected] = useState(false);
  
  const { updateCart } = useCartActions();
  const cartQuantity = useCartItemQuantity(product.id);

  const handleQuantityChange = (quantity: number) => {
    updateCart(product, quantity);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCart(product, 1);
    toast.success("Đã thêm vào giỏ hàng");
  };

  const discountPercent = useMemo(() => {
    if (product.originalPrice && product.price) {
      return Math.round((1 - product.price / product.originalPrice) * 100);
    }
    return null;
  }, [product.price, product.originalPrice]);
  
  const finalPrice = getFinalPrice(product);

  return (
    <div
      className="flex flex-col cursor-pointer group bg-section rounded-xl shadow-[0_10px_24px_#0D0D0D17]"
      onClick={() => setSelected(true)}
    >
      <TransitionLink
        to={`/product/${product.id}`}
        replace={replace}
        className="p-2 pb-0 flex flex-col flex-1"
      >
        {() => (
          <>
            <div className="relative w-full aspect-square">
              <img
                src={product.images?.[0] || ""}
                className="w-full h-full object-cover rounded-lg"
                style={{
                  viewTransitionName: selected
                    ? `product-image-${product.id}`
                    : undefined,
                }}
                alt={product.name}
              />
              {discountPercent && (
                <span className="absolute top-2 left-2 text-xs bg-danger text-white font-medium px-2 py-0.5 rounded-full">
                  -{discountPercent}%
                </span>
              )}
            </div>
            <div className="pt-2 pb-1.5 flex flex-col flex-1">
              <div className="h-5 text-xs font-bold">
                <MarqueeText text={product.name} />
              </div>
              <div className="mt-1 flex-1 flex flex-col justify-end space-y-1">
                <div className="text-base font-bold text-primary">
                  {formatPrice(finalPrice)}
                </div>
                <div className="flex justify-between items-center text-xs">
                  {product.originalPrice ? (
                    <span className="line-through text-subtitle">
                      {formatPrice(product.originalPrice)}
                    </span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                  {product.soldCount && (
                    <div className="flex items-center space-x-1 text-subtitle">
                      <Icon icon="zi-check" size={14} className="text-primary" />
                      <span>
                        {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k` : product.soldCount}
                      </span>
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
            onClick={handleAddToCart}
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

export default React.memo(ProductItem);