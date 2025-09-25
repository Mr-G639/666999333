// src/utils/cart.ts

import { Cart, Product, CartItem } from "@/types";

/**
 * Tính toán giá cuối cùng của một sản phẩm.
 * LƯU Ý: Dựa trên `types.d.ts`, đối tượng `product.sale` không chứa thông tin về số tiền giảm giá.
 * Do đó, hàm này hiện chỉ trả về giá gốc. Logic sẽ được mở rộng khi cấu trúc dữ liệu được cập nhật.
 * @param product - Sản phẩm cần tính giá.
 * @returns Giá của sản phẩm.
 */
export const getFinalPrice = (product: Product): number => {
  return product.price;
};

/**
 * Thêm một sản phẩm vào giỏ hàng hoặc tăng số lượng nếu đã tồn tại.
 * Hàm này tuân thủ nguyên tắc bất biến (immutability), luôn trả về một mảng giỏ hàng mới.
 * @param cart - Giỏ hàng hiện tại.
 * @param product - Sản phẩm cần thêm.
 * @returns Giỏ hàng mới sau khi đã cập nhật.
 */
export const addItemToCart = (cart: Cart, product: Product): Cart => {
  const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);

  if (existingItemIndex > -1) {
    // Nếu sản phẩm đã tồn tại, tạo một giỏ hàng mới với số lượng được cập nhật
    const updatedCart = [...cart];
    updatedCart[existingItemIndex] = {
      ...updatedCart[existingItemIndex],
      quantity: updatedCart[existingItemIndex].quantity + 1,
    };
    return updatedCart;
  } else {
    // Nếu chưa, thêm sản phẩm mới vào giỏ
    const newItem: CartItem = {
      product,
      quantity: 1,
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

  // Thêm các sản phẩm từ giỏ hàng server vào map để xử lý
  for (const item of serverCart) {
    mergedCartMap.set(item.product.id, { ...item });
  }

  // Thêm hoặc gộp các sản phẩm từ giỏ hàng local
  for (const item of localCart) {
    const existingItem = mergedCartMap.get(item.product.id);
    if (existingItem) {
      // Nếu sản phẩm đã có, cộng dồn số lượng
      existingItem.quantity += item.quantity;
    } else {
      // Nếu chưa có, thêm mới vào
      mergedCartMap.set(item.product.id, { ...item });
    }
  }

  // Chuyển map trở lại thành một mảng
  return Array.from(mergedCartMap.values());
};