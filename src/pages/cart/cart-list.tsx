// src/pages/cart/cart-list.tsx

import { useAtomValue } from "jotai";
import { cartDetailsState } from "@/state"; // SỬA LỖI: Luôn dùng atom này để đọc giỏ hàng chi tiết
import CartItem from "./cart-item";
import Section from "@/components/section";
import { Icon } from "zmp-ui";
import HorizontalDivider from "@/components/horizontal-divider";

export default function CartList() {
  // SỬA LỖI: Dùng atom đã được xử lý để có đầy đủ thông tin sản phẩm
  const cart = useAtomValue(cartDetailsState);

  return (
    <Section
      title={
        <div className="flex items-center space-x-2">
          <Icon icon="zi-calendar" />
          <div>
            <span className="font-normal text-sm">Thời gian nhận:</span>{" "}
            <span className="font-medium text-sm">Từ 16h, 20/1/2025</span>
          </div>
        </div>
      }
      className="flex-1 overflow-y-auto rounded-lg"
    >
      <div className="w-full">
        {cart.map((item) => (
          // Logic này giờ đây hoàn toàn chính xác vì `cart` là một mảng `CartItem[]`
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>
      <HorizontalDivider />
      <div className="flex items-center px-4 pt-3 pb-2 space-x-4">
        <div className="text-sm font-medium">Ghi chú</div>
        <input
          type="text"
          placeholder="Lưu ý cho người bán..."
          className="text-sm text-right flex-1 focus:outline-none bg-transparent"
        />
      </div>
    </Section>
  );
}