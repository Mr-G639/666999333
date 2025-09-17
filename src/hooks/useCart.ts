import { useAtom, useAtomValue } from "jotai";
import { useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { cartState } from "@/state";
import { Product } from "@/types";

export function useAddToCart(product: Product) {
  const [cart, setCart] = useAtom(cartState);

  const cartQuantity = useMemo(
    () => cart.find((item) => item.product.id === product.id)?.quantity ?? 0,
    [cart, product.id]
  );

  const addToCart = useCallback((newQuantity: number, options?: { toast: boolean }) => {
    setCart((currentCart) => {
      const newCart = [...currentCart];
      const itemIndex = newCart.findIndex(
        (item) => item.product.id === product.id
      );

      if (newQuantity <= 0) {
        if (itemIndex > -1) {
          newCart.splice(itemIndex, 1);
        }
      } else {
        if (itemIndex > -1) {
          newCart[itemIndex] = { ...newCart[itemIndex], quantity: newQuantity };
        } else {
          newCart.push({ product, quantity: newQuantity });
        }
      }
      return newCart;
    });

    if (options?.toast) {
      toast.success("Đã thêm vào giỏ hàng");
    }
  }, [product, setCart]);

  return { addToCart, cartQuantity };
}