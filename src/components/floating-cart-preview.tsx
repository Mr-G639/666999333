import { useAtomValue } from "jotai";
import Badge from "./badge";
import { CartIcon } from "./vectors";
import { cartState, cartTotalState } from "@/state";
import { formatPrice } from "@/utils/format";
import TransitionLink from "./transition-link";
import { useRouteHandle } from "@/hooks/useUtility";
import { useToasterStore } from "react-hot-toast"; // 1. Import hook mới
import { useMemo } from "react";

function FloatingCartPreview() {
  const cart = useAtomValue(cartState);
  const { totalItems, totalAmount } = useAtomValue(cartTotalState);
  const [handle] = useRouteHandle();

  // 2. Lấy trạng thái của các thông báo đang hiển thị
  const { toasts } = useToasterStore();
  const isToastVisible = useMemo(
    () => toasts.some((toast) => toast.visible),
    [toasts]
  );

  if (totalItems === 0 || handle?.noFloatingCart) {
    return <></>;
  }

  return (
    <TransitionLink
      to="/cart"
      // 3. Thêm class CSS để tạo hiệu ứng và di chuyển
      className={`fixed left-4 right-4 ${
        handle?.noFooter ? "bottom-6" : "bottom-16"
      } mb-sb flex items-center space-x-2 text-left bg-primary text-primaryForeground px-4 py-2 rounded-lg transition-transform duration-300 ease-in-out`}
      style={{
        // Nếu có thông báo, đẩy giỏ hàng lên trên 60px
        transform: isToastVisible ? "translateY(-39px)" : "translateY(0)",
      }}
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
        {formatPrice(totalAmount)}
      </span>
      <span className="text-sm">Đặt mua</span>
    </TransitionLink>
  );
}

export default FloatingCartPreview;