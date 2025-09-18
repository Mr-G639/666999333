// src/pages/cart/cart-item.tsx

import { useCartActions } from "@/hooks/useCart";
import { CartItem as CartItemProps } from "@/types";
import { formatPrice } from "@/utils/format";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Icon } from "zmp-ui";
import QuantityInput from "@/components/quantity-input";
import { useNavigate } from "react-router-dom";
import placeholderImage from '@/static/logo.png';

const SWIPE_TO_DELETE_THRESHOLD = 80;

export default function CartItem(props: CartItemProps) {
  // SỬA LỖI 1: Thay đổi cách gọi hook để tránh lỗi type inference
  const cartActions = useCartActions();
  const navigate = useNavigate();

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(
    // SỬA LỖI 2: Thêm kiểu trả về `void` để giải quyết lỗi "Not all code paths return a value"
    ({ last, offset: [ox] }): void => {
      api.start({ x: Math.min(ox, 0), immediate: true });

      if (last) {
        if (ox < -SWIPE_TO_DELETE_THRESHOLD) {
          api.start({ x: -SWIPE_TO_DELETE_THRESHOLD });
        } else {
          api.start({ x: 0 });
        }
      }
    },
    {
      from: () => [x.get(), 0],
      axis: "x",
      bounds: { left: -100, right: 0 },
      rubberband: true,
      preventScroll: true,
    }
  );
  
  const imageUrl = props.product?.images?.[0] ?? placeholderImage;

  const handleNavigate = () => {
    navigate(`/product/${props.product.id}`);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    // SỬA LỖI 1 (tiếp): Sử dụng cartActions.addToCart
    cartActions.addToCart(props.product, newQuantity);
  };

  return (
    <div className="relative after:border-b-[0.5px] after:border-black/10 after:absolute after:left-[88px] after:right-0 after:bottom-0 last:after:hidden">
      <div
        className="absolute right-0 top-0 bottom-0 py-px"
        style={{ width: SWIPE_TO_DELETE_THRESHOLD }}
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
            className="w-14 h-14 rounded-lg bg-skeleton object-cover"
            alt={props.product.name}
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