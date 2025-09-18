// src/hooks/useCart.ts

import { useSetAtom, useAtomValue } from "jotai";
import { selectAtom } from 'jotai/utils'; // Tối ưu: Import a utility để ngăn re-render không cần thiết
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { cartState } from "@/state";
import { Product } from "@/types";

/**
 * Hook chuyên cung cấp các hành động (ghi) để thay đổi giỏ hàng.
 * Component sử dụng hook này sẽ KHÔNG re-render khi `cartState` thay đổi.
 */
export function useCartActions() {
  const setCart = useSetAtom(cartState);

  const addToCart = useCallback((product: Product, quantity: number, options?: { toast?: boolean }) => {
    setCart((currentCart) => {
      const itemIndex = currentCart.findIndex(
        (item) => item.product.id === product.id
      );

      // Nếu sản phẩm đã có trong giỏ hàng
      if (itemIndex > -1) {
        // Nếu số lượng mới <= 0, xóa sản phẩm khỏi giỏ hàng
        if (quantity <= 0) {
          return currentCart.filter((_, index) => index !== itemIndex);
        }
        // Ngược lại, cập nhật số lượng (sử dụng map để đảm bảo tính bất biến)
        return currentCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity } : item
        );
      }
      
      // Nếu sản phẩm chưa có và số lượng > 0, thêm mới vào giỏ hàng
      if (quantity > 0) {
        return [...currentCart, { product, quantity }];
      }

      // Mặc định, trả về giỏ hàng hiện tại nếu không có thay đổi
      return currentCart;
    });

    // Sửa lỗi UX: Thêm một ID duy nhất cho toast.
    // react-hot-toast sẽ tự động tìm và cập nhật toast có ID này thay vì tạo mới.
    if (options?.toast && quantity > 0) {
      toast.success("Đã thêm vào giỏ hàng", {
        id: 'add-to-cart-toast',
      });
    }
  }, [setCart]);

  return { addToCart };
}

/**
 * Hook hiệu năng cao chuyên để đọc số lượng của một sản phẩm cụ thể trong giỏ hàng.
 * Component sử dụng hook này sẽ CHỈ re-render khi số lượng của chính sản phẩm đó thay đổi.
 */
export function useCartItemQuantity(productId: number) {
  // Tối ưu: Sử dụng `selectAtom` để tạo ra một atom dẫn xuất.
  // Atom này chỉ chứa giá trị số lượng của sản phẩm đang được quan tâm.
  // Component sẽ chỉ lắng nghe sự thay đổi của atom này,
  // do đó tránh được việc re-render khi các sản phẩm khác trong giỏ hàng thay đổi.
  const quantityAtom = useMemo(
    () =>
      selectAtom(
        cartState,
        (cart) =>
          cart.find((item) => item.product.id === productId)?.quantity ?? 0
      ),
    [productId]
  );

  return useAtomValue(quantityAtom);
}