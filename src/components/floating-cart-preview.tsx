// src/components/floating-cart-preview.tsx

import { useAtomValue, useSetAtom } from "jotai";
import Badge from "./badge";
import { CartIcon } from "./vectors";
import { cartState, cartTotalState, cartPopupVisibleState } from "@/state"; // Import thêm state của popup
import { formatPrice } from "@/utils/format";
import { useRouteHandle } from "@/hooks/useUtility";

function FloatingCartPreview() {
  const cart = useAtomValue(cartState);
  const { totalItems, finalAmount } = useAtomValue(cartTotalState); // Sửa thành finalAmount cho chính xác
  const [handle] = useRouteHandle();
  const setCartPopupVisible = useSetAtom(cartPopupVisibleState); // Lấy hàm để bật popup

  if (totalItems === 0 || handle?.noFloatingCart) {
    return null;
  }

  return (
    // SỬA LỖI: Thay thế TransitionLink bằng div có onClick để bật popup
    <div
      onClick={() => setCartPopupVisible(true)}
      className={`fixed left-4 right-4 ${
        handle?.noFooter ? "bottom-6" : "bottom-16"
      } mb-sb flex items-center space-x-2 text-left bg-primary text-primaryForeground px-4 py-2 rounded-lg cursor-pointer active:scale-95 transition-transform`}
    >
      <Badge
        value={cart.length}
        style={{
          boxShadow: "none",
        }}
      >
        <CartIcon mono />
      </Badge>
      <span className="text-base font-medium flex-1">
        {formatPrice(finalAmount)}
      </span>
      <span className="text-sm">Đặt mua</span>
    </div>
  );
}

export default FloatingCartPreview;