import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { userInfoState, cartState, productsState } from "@/state";
import { incrementCartItemQuantityApi, removeCartItemApi, updateCartItemApi } from "@/api/cart";
import { Product } from "@/types";


export function useAddToCart(product: Product) {
  const userInfo = useAtomValue(userInfoState);
  const [cart, setCart] = useAtom(cartState);

  const allProducts = useAtomValue(productsState); // Get all products from state
  const currentCartItem = useMemo(
    () => cart.find((item) => item.product.id === product.id),
    [cart, product.id]
  );

  const addToCart = async ( // Made async because we call an async API
    quantity: number | ((oldQuantity: number) => number), // Quantity to add, not the final quantity
    options?: { toast: boolean }
  ) => { // Made async because we call an async API

    const newQuantity =
      typeof quantity === "function"
        ? quantity(currentCartItem?.quantity ?? 0) // Calculate the desired final quantity
        : (currentCartItem?.quantity ?? 0) + quantity; // Add the quantity if not a function

    if (userInfo) {
      try {
        if (newQuantity <= 0) {
          // Call API to remove item if new quantity is zero or less
          const updatedCart = await removeCartItemApi(product.id);
          setCart(updatedCart);
        } else {
          // Call API to add/update item
          if (typeof quantity === "function") {
            // If quantity is a function, it implies setting the total newQuantity
            const updatedCart = await updateCartItemApi(product.id, newQuantity);
            setCart(updatedCart);
          } else {
            // If quantity is a number, it implies incrementing by that amount
            const updatedCart = await incrementCartItemQuantityApi(product.id, quantity);
            setCart(updatedCart);
          }
        }

        if (options?.toast) {
          toast.success("Đã thêm vào giỏ hàng");
        }
      } catch (error) {
        console.error("Failed to add/remove item from cart (API call):", error);
        toast.error("Không thể cập nhật giỏ hàng. Vui lòng thử lại!");
      }
    } else {
      // User is NOT logged in, update local storage via atomWithStorage
      setCart((currentCart) => {
        const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);
        const draftCart = [...currentCart]; // Create a mutable copy

        if (newQuantity <= 0) {
            if (existingItemIndex !== -1) {
                draftCart.splice(existingItemIndex, 1);
            }
        } else {
          if (existingItemIndex !== -1) {
            draftCart[existingItemIndex].quantity = newQuantity;
          } else {
            draftCart.push({ product: product, quantity: newQuantity });
          }
      }
        if (options?.toast) {
          toast.success("Đã thêm vào giỏ hàng");
        }
        return draftCart; // Return the new array reference
      });
    }
  }

  return { addToCart, cartQuantity: currentCartItem?.quantity ?? 0 };
}