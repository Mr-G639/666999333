// src/hooks/useCart.ts

import { useSetAtom, useAtomValue } from "jotai";
import { selectAtom } from 'jotai/utils';
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { cartState } from "@/state";
import { Product } from "@/types";

// SỬA LỖI: Định nghĩa một kiểu (type) rõ ràng cho các hành động của giỏ hàng
type CartActions = {
  addToCart: (product: Product, quantity: number, options?: { toast?: boolean }) => void;
}

/**
 * Hook chuyên cung cấp các hành động (ghi) để thay đổi giỏ hàng.
 * Component sử dụng hook này sẽ KHÔNG re-render khi `cartState` thay đổi.
 */
export function useCartActions(): CartActions { // SỬA LỖI: Thêm kiểu trả về rõ ràng cho hook
  const setCart = useSetAtom(cartState);

  const addToCart = useCallback((product: Product, quantity: number, options?: { toast?: boolean }) => {
    setCart((currentCart) => {
      const itemIndex = currentCart.findIndex(
        (item) => item.product.id === product.id
      );

      if (itemIndex > -1) {
        if (quantity <= 0) {
          return currentCart.filter((_, index) => index !== itemIndex);
        }
        return currentCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity } : item
        );
      }
      
      if (quantity > 0) {
        return [...currentCart, { product, quantity }];
      }

      return currentCart;
    });

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