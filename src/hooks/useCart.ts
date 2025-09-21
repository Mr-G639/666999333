// src/hooks/useCart.ts

import { useSetAtom, useAtomValue } from "jotai";
import { selectAtom } from 'jotai/utils';
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { cartState } from "@/state";
import { Product } from "@/types";

/**
 * @typedef CartActions
 * @type {object}
 * @property {(product: Product, quantity: number, options?: { toast?: boolean }) => void} addToCart - Thêm sản phẩm vào giỏ hoặc cập nhật số lượng. Nếu quantity <= 0, sản phẩm sẽ bị xóa.
 */
type CartActions = {
  addToCart: (product: Product, quantity: number, options?: { toast?: boolean }) => void;
};

/**
 * Hook chuyên cung cấp các hành động (ghi) để thay đổi giỏ hàng.
 * Component sử dụng hook này sẽ KHÔNG re-render khi `cartState` thay đổi,
 * đảm bảo hiệu năng tối ưu cho các component chỉ cần thực hiện hành động.
 * @returns {CartActions} Các hàm để thao tác với giỏ hàng.
 */
export function useCartActions(): CartActions {
  const setCart = useSetAtom(cartState);

  /**
   * Thêm một sản phẩm vào giỏ hàng hoặc cập nhật số lượng của nó.
   * - Nếu sản phẩm đã tồn tại, cập nhật số lượng.
   * - Nếu số lượng <= 0, sản phẩm sẽ được xóa khỏi giỏ hàng.
   * - Nếu sản phẩm chưa tồn tại và số lượng > 0, thêm mới vào giỏ hàng.
   */
  const addToCart = useCallback((product: Product, quantity: number, options?: { toast?: boolean }) => {
    setCart((currentCart) => {
      const itemIndex = currentCart.findIndex(
        (item) => item.product.id === product.id
      );

      // Sản phẩm đã có trong giỏ
      if (itemIndex > -1) {
        // Nếu số lượng mới là 0 hoặc âm, xóa sản phẩm khỏi giỏ
        if (quantity <= 0) {
          // Trả về một mảng mới không chứa sản phẩm cần xóa
          return currentCart.filter((_, index) => index !== itemIndex);
        }
        // Ngược lại, cập nhật số lượng cho sản phẩm đó
        return currentCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity } : item
        );
      }
      
      // Nếu sản phẩm chưa có trong giỏ và số lượng lớn hơn 0, thêm mới
      if (quantity > 0) {
        return [...currentCart, { product, quantity }];
      }

      // Nếu số lượng không hợp lệ (<=0 và sản phẩm chưa có), không làm gì cả
      return currentCart;
    });

    // Hiển thị thông báo nếu được yêu cầu và là hành động thêm/cập nhật
    if (options?.toast && quantity > 0) {
      toast.success("Đã thêm vào giỏ hàng", {
        id: 'add-to-cart-toast', // Dùng ID để tránh hiển thị nhiều toast trùng lặp
      });
    }
  }, [setCart]);

  return { addToCart };
}

/**
 * Hook hiệu năng cao chuyên để đọc số lượng của một sản phẩm cụ thể trong giỏ hàng.
 * Component sử dụng hook này sẽ CHỈ re-render khi số lượng của chính sản phẩm đó thay đổi.
 * Điều này được tối ưu nhờ `selectAtom` của Jotai.
 * @param {number} productId - ID của sản phẩm cần lấy số lượng.
 * @returns {number} Số lượng của sản phẩm trong giỏ hàng, mặc định là 0.
 */
export function useCartItemQuantity(productId: number): number {
  // `useMemo` được sử dụng ở đây để đảm bảo rằng `quantityAtom` chỉ được tạo lại
  // khi `productId` thay đổi, tránh việc tạo atom không cần thiết trong mỗi lần render.
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