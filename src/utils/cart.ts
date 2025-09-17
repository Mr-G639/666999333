import { Cart } from "@/types";

export const mergeCarts = (serverCart: Cart, localCart: Cart): Cart => {
  const mergedCartMap = new Map<number, Cart[number]>();

  // Add items from server cart to the map
  for (const item of serverCart) {
    mergedCartMap.set(item.product.id, { ...item });
  }

  // Add/merge items from local cart
  for (const item of localCart) {
    const existingItem = mergedCartMap.get(item.product.id);
    if (existingItem) {
      // Product exists in both carts, sum quantities
      existingItem.quantity += item.quantity;
    } else {
      // Product only exists in local cart, add it
      mergedCartMap.set(item.product.id, { ...item });
    }
  }

  // Convert map back to an array
  return Array.from(mergedCartMap.values());
};