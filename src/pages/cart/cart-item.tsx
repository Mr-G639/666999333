// src/pages/cart/cart-item.tsx

import { useCartActions } from "@/hooks/useCart";
import { CartItem as CartItemProps } from "@/types";
import { formatPrice } from "@/utils/format";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Icon } from "zmp-ui";
import QuantityInput from "@/components/quantity-input";
import { useNavigate } from "react-router-dom";

// Refactor: Đổi tên hằng số để rõ ràng hơn về ý nghĩa.
// Đây là ngưỡng pixel cần kéo qua để kích hoạt trạng thái "sẵn sàng xóa".
const SWIPE_TO_DELETE_THRESHOLD = 80;

export default function CartItem(props: CartItemProps) {
  const { addToCart } = useCartActions();
  const navigate = useNavigate();

  // Khởi tạo animation spring cho hiệu ứng kéo ngang
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  // Gắn cử chỉ kéo (drag) vào component
  const bind = useDrag(
    ({ last, offset: [ox] }) => {
      // Cập nhật vị trí x của component dựa trên khoảng cách kéo của người dùng
      // `immediate: true` để animation diễn ra ngay lập tức, không có độ trễ
      api.start({ x: Math.min(ox, 0), immediate: true });

      // Khi người dùng nhả tay ra (cử chỉ kết thúc)
      if (last) {
        // Nếu kéo qua ngưỡng xóa, giữ nguyên ở vị trí đã kéo
        if (ox < -SWIPE_TO_DELETE_THRESHOLD) {
          api.start({ x: -SWIPE_TO_DELETE_THRESHOLD });
        } else {
          // Nếu không, trả về vị trí ban đầu (0)
          api.start({ x: 0 });
        }
      }
    },
    {
      from: () => [x.get(), 0], // Bắt đầu kéo từ vị trí hiện tại của `x`
      axis: "x", // Chỉ cho phép kéo theo trục x
      bounds: { left: -100, right: 0 }, // Giới hạn khoảng cách kéo
      rubberband: true, // Tạo hiệu ứng "dây cao su" khi kéo quá giới hạn
      preventScroll: true, // Ngăn trang cuộn dọc khi đang kéo ngang
    }
  );
  
  // Bug fix: Thêm optional chaining `?.` để tránh lỗi nếu `product` hoặc `images` không tồn tại
  const imageUrl = props.product?.images?.[0] ?? "";

  // Điều hướng đến trang chi tiết sản phẩm
  const handleNavigate = () => {
    navigate(`/product/${props.product.id}`);
  };
  
  // Xử lý thay đổi số lượng sản phẩm
  const handleQuantityChange = (newQuantity: number) => {
    addToCart(props.product, newQuantity);
  };

  return (
    <div className="relative after:border-b-[0.5px] after:border-black/10 after:absolute after:left-[88px] after:right-0 after:bottom-0 last:after:hidden">
      {/* Nút Xóa ẩn phía sau */}
      <div
        className="absolute right-0 top-0 bottom-0 py-px"
        style={{ width: SWIPE_TO_DELETE_THRESHOLD }}
      >
        <div
          className="bg-danger text-white/95 w-full h-full flex flex-col space-y-1 justify-center items-center cursor-pointer"
          onClick={() => handleQuantityChange(0)} // Gọi hàm xóa khi click
        >
          <Icon icon="zi-delete" />
          <div className="text-2xs font-medium">Xoá</div>
        </div>
      </div>

      {/* Item có thể kéo */}
      <animated.div
        {...bind()}
        style={{ x }}
        className="bg-white p-4 flex items-center space-x-4 relative"
      >
        {/* UX Improvement: Chỉ vùng thông tin sản phẩm mới có thể click để điều hướng */}
        <div 
          className="flex items-center space-x-4 flex-1 cursor-pointer" 
          onClick={handleNavigate}
        >
          <img
            src={imageUrl}
            className="w-14 h-14 rounded-lg bg-skeleton"
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
        
        {/* Component nhập số lượng */}
        <div className="w-24">
          <QuantityInput value={props.quantity} onChange={handleQuantityChange} />
        </div>
      </animated.div>
    </div>
  );
}