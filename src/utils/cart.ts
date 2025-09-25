// src/utils/cart.ts

import { Cart, Product, CartItem } from "@/types";

/**
 * Tính toán giá cuối cùng của một sản phẩm.
 * Hiện tại chỉ trả về giá gốc, có thể mở rộng với logic khuyến mãi.
 * @param product - Sản phẩm cần tính giá.
 * @returns Giá của sản phẩm.
 */
export const getFinalPrice = (product: Product): number => {
  return product.price;
};

/**
 * [TỐI ƯU] Tính tổng số lượng sản phẩm trong giỏ hàng.
 * Sử dụng `reduce` để code ngắn gọn và thể hiện rõ ý đồ.
 * @param cart - Giỏ hàng cần tính toán.
 * @returns Tổng số lượng sản phẩm.
 */
export const calculateTotalItems = (cart: Cart): number => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * [TỐI ƯU] Tính tổng giá trị tiền của giỏ hàng.
 * Sử dụng `reduce` thay vì `forEach` để tối ưu và làm code rõ ràng hơn.
 * @param cart - Giỏ hàng cần tính toán.
 * @returns Tổng giá trị của giỏ hàng.
 */
export const calculateCartTotal = (cart: Cart): number => {
  return cart.reduce((total, item) => {
    const itemPrice = getFinalPrice(item.product);
    return total + itemPrice * item.quantity;
  }, 0);
};


/**
 * Thêm một sản phẩm vào giỏ hàng hoặc tăng số lượng nếu đã tồn tại.
 * Hàm này tuân thủ nguyên tắc bất biến (immutability).
 * @param cart - Giỏ hàng hiện tại.
 * @param product - Sản phẩm cần thêm.
 * @returns Giỏ hàng mới sau khi đã cập nhật.
 */
export const addItemToCart = (cart: Cart, product: Product): Cart => {
  const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);

  if (existingItemIndex > -1) {
    const updatedCart = [...cart];
    updatedCart[existingItemIndex] = {
      ...updatedCart[existingItemIndex],
      quantity: updatedCart[existingItemIndex].quantity + 1,
    };
    return updatedCart;
  } else {
    // [SỬA LỖI] Tạo newItem tuân thủ đúng `CartItem` type.
    const newItem: CartItem = {
      product,
      quantity: 1,
      // Đã loại bỏ thuộc tính `options: []` không tồn tại trong `CartItem` type.
    };
    return [...cart, newItem];
  }
};

/**
 * Gộp giỏ hàng từ server và giỏ hàng local.
 * Ưu tiên số lượng từ server và cộng dồn nếu sản phẩm trùng lặp.
 * @param serverCart - Giỏ hàng lấy từ server.
 * @param localCart - Giỏ hàng lưu trữ trên máy người dùng.
 * @returns Một giỏ hàng mới đã được gộp.
 */
export const mergeCarts = (serverCart: Cart, localCart: Cart): Cart => {
  const mergedCartMap = new Map<number, CartItem>();

  for (const item of serverCart) {
    mergedCartMap.set(item.product.id, { ...item });
  }

  for (const item of localCart) {
    const existingItem = mergedCartMap.get(item.product.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      mergedCartMap.set(item.product.id, { ...item });
    }
  }

  return Array.from(mergedCartMap.values());
};