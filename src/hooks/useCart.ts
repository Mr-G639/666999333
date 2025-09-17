// src/hooks/useCart.ts

import { useSetAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { cartState } from "@/state";
import { Product } from "@/types";

/**
 * Hook chuyên cung cấp các hành động (ghi) để thay đổi giỏ hàng.
 * Component sử dụng hook này sẽ KHÔNG re-render khi cartState thay đổi.
 */
export function useCartActions() {
  const setCart = useSetAtom(cartState);

  const addToCart = useCallback((product: Product, quantity: number, options?: { toast: boolean }) => {
    setCart((currentCart) => {
      const newCart = [...currentCart];
      const itemIndex = newCart.findIndex(
        (item) => item.product.id === product.id
      );

      if (quantity <= 0) {
        if (itemIndex > -1) {
          newCart.splice(itemIndex, 1);
        }
      } else {
        if (itemIndex > -1) {
          newCart[itemIndex] = { ...newCart[itemIndex], quantity: quantity };
        } else {
          newCart.push({ product, quantity: quantity });
        }
      }
      return newCart;
    });

    if (options?.toast && quantity > 0) {
      toast.success("Đã thêm vào giỏ hàng");
    }
  }, [setCart]);

  return { addToCart };
}

/**
 * Hook chuyên để đọc số lượng của một sản phẩm cụ thể trong giỏ hàng.
 * Component sử dụng hook này sẽ CHỈ re-render khi số lượng của chính sản phẩm đó thay đổi.
 */
export function useCartItemQuantity(productId: number) {
  const cart = useAtomValue(cartState);
  return cart.find((item) => item.product.id === productId)?.quantity ?? 0;
}