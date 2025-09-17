// src/pages/cart/cart-item.tsx

import { useCartActions } from "@/hooks/useCart";
import { CartItem as CartItemProps } from "@/types";
import { formatPrice } from "@/utils/format";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Icon } from "zmp-ui";
import QuantityInput from "@/components/quantity-input";
import { useNavigate } from "react-router-dom";

const SWIPE_TO_DELTE_OFFSET = 80;

export default function CartItem(props: CartItemProps) {
  const { addToCart } = useCartActions();
  const navigate = useNavigate();

  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const bind = useDrag(
    ({ last, offset: [ox] }) => {
      if (last) {
        if (ox < -SWIPE_TO_DELTE_OFFSET) {
          api.start({ x: -SWIPE_TO_DELTE_OFFSET });
        } else {
          api.start({ x: 0 });
        }
      } else {
        api.start({ x: Math.min(ox, 0), immediate: true });
      }
    },
    {
      from: () => [x.get(), 0],
      axis: "x",
      bounds: { left: -100, right: 0, top: 0, bottom: 0 },
      rubberband: true,
      preventScroll: true,
    }
  );
  
  const imageUrl = props.product?.images?.[0] ?? (props.product as any)?.image ?? "";

  const handleNavigate = () => {
    navigate(`/product/${props.product.id}`);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    addToCart(props.product, newQuantity);
  };

  return (
    <div className="relative after:border-b-[0.5px] after:border-black/10 after:absolute after:left-[88px] after:right-0 after:bottom-0 last:after:hidden">
      <div
        className="absolute right-0 top-0 bottom-0 w-20 py-px"
      >
        <div
          className="bg-danger text-white/95 w-full h-full flex flex-col space-y-1 justify-center items-center cursor-pointer"
          onClick={() => handleQuantityChange(0)}
        >
          <Icon icon="zi-delete" />
          <div className="text-2xs font-medium">Xoá</div>
        </div>
      </div>

      <animated.div
        {...bind()}
        style={{ x }}
        className="bg-white p-4 flex items-center space-x-4 relative"
      >
        <div 
          className="flex items-center space-x-4 flex-1 cursor-pointer" 
          onClick={handleNavigate}
        >
          <img
            src={imageUrl}
            className="w-14 h-14 rounded-lg bg-skeleton"
          />
          
          <div className="flex-1 space-y-1">
            <div className="text-sm">{props.product.name}</div>
            <div className="flex flex-col">
              <div className="text-sm font-bold">
                {formatPrice(props.product.price)}
              </div>
              {props.product.originalPrice && (
                <div className="line-through text-subtitle text-4xs">
                  {formatPrice(props.product.originalPrice)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-24">
          <QuantityInput value={props.quantity} onChange={handleQuantityChange} />
        </div>
      </animated.div>
    </div>
  );
}