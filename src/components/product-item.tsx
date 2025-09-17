import { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import TransitionLink from "./transition-link";
import { useState } from "react";
import { Button } from "zmp-ui";
import { useAddToCart } from "@/hooks";
import QuantityInput from "./quantity-input";
import MarqueeText from "./marquee-text";

export interface ProductItemProps {
  product: Product;
  replace?: boolean;
}

export default function ProductItem(props: ProductItemProps) {
  const [selected, setSelected] = useState(false);
  const { addToCart, cartQuantity } = useAddToCart(props.product);

  return (
    <div
      className="flex flex-col cursor-pointer group bg-section rounded-xl shadow-[0_10px_24px_#0D0D0D17]"
      onClick={() => setSelected(true)}
    >
      <TransitionLink
        to={`/product/${props.product.id}`}
        replace={props.replace}
        className="p-2 pb-0"
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
            <div className="pt-2 pb-1.5 flex flex-col">
              {/* --- THAY ĐỔI Ở ĐÂY: Thêm class font-bold --- */}
              <div className="h-5 text-xs font-bold">
                <MarqueeText text={props.product.name} />
              </div>

              {/* --- THAY ĐỔI Ở ĐÂY: Đổi class màu chữ --- */}
              {props.product.soldCount && (
                <div className="text-2xs text-gray-500 mt-0.5">
                  Đã bán {props.product.soldCount}
                </div>
              )}

              <div className="mt-1 flex-1 flex flex-col justify-end">
                <div className="text-sm font-bold text-primary">
                  {formatPrice(props.product.price)}
                </div>
                <div className="flex items-center space-x-2 text-2xs">
                  {props.product.originalPrice && (
                    <>
                      {/* --- THAY ĐỔI Ở ĐÂY: Đổi class màu chữ --- */}
                      <span className="line-through text-gray-500">
                        {formatPrice(props.product.originalPrice)}
                      </span>
                      <span className="text-danger font-medium">
                        -
                        {Math.round(
                          (1 -
                            props.product.price / props.product.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    </>
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
              addToCart(1, {
                toast: true,
              });
            }}
          >
            Thêm vào giỏ
          </Button>
        ) : (
          <QuantityInput value={cartQuantity} onChange={addToCart} />
        )}
      </div>
    </div>
  );
}