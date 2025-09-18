import { Cart, Product } from '@/types';
import productsData from "../mock/products.json";

// Giả lập trạng thái giỏ hàng trên server (in-memory)
let dummyCart: Cart = [];

/**
 * Tìm kiếm một sản phẩm trong file mock dựa trên ID.
 * @param productId - ID của sản phẩm cần tìm.
 * @returns Đối tượng Product nếu tìm thấy, ngược lại trả về undefined.
 */
const findDummyProduct = (productId: number): Product | undefined => {
  // Tìm dữ liệu sản phẩm thô từ file JSON
  const productData = productsData.find(p => p.id === productId);

  if (!productData) {
    console.error(`[Mock API] Không tìm thấy sản phẩm với ID: ${productId}`);
    return undefined;
  }

  // Chuyển đổi dữ liệu thô sang đúng định dạng của kiểu Product
  // Điều này rất quan trọng để đảm bảo tính nhất quán dữ liệu trên toàn ứng dụng.
  return {
    ...productData,
    // Đảm bảo thuộc tính 'images' là một mảng theo đúng định nghĩa trong src/types.d.ts
    images: productData.images ?? [],
    category: {
      id: productData.categoryId,
      name: `Category ${productData.categoryId}`, // Tên category giả lập
      image: ""
    }
  };
};

/**
 * Giả lập API lấy thông tin giỏ hàng từ server.
 * @returns Một Promise giải quyết với trạng thái hiện tại của giỏ hàng.
 */
export const getCartFromApi = async (): Promise<Cart> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Giả lập độ trễ mạng
  console.log("[Mock API] getCartFromApi -> Trả về:", dummyCart);
  return [...dummyCart]; // Trả về một bản sao để đảm bảo tính bất biến
};

/**
 * Giả lập API cập nhật số lượng của một sản phẩm trong giỏ hàng.
 * - Nếu sản phẩm chưa có trong giỏ hàng và quantity > 0, sản phẩm sẽ được thêm mới.
 * - Nếu sản phẩm đã có, số lượng sẽ được cập nhật.
 * - Nếu quantity <= 0, sản phẩm sẽ bị xóa khỏi giỏ hàng.
 * @param productId - ID của sản phẩm cần cập nhật.
 * @param quantity - Số lượng mới.
 * @returns Một Promise giải quyết với trạng thái giỏ hàng sau khi đã cập nhật.
 */
export const updateCartItemQuantityApi = async (productId: number, quantity: number): Promise<Cart> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Giả lập độ trễ mạng
  console.log(`[Mock API] updateCartItemQuantityApi -> productId: ${productId}, quantity: ${quantity}`);

  const existingItemIndex = dummyCart.findIndex(item => item.product.id === productId);

  if (existingItemIndex > -1) {
    // Sản phẩm đã có trong giỏ hàng
    if (quantity > 0) {
      // Cập nhật số lượng
      dummyCart[existingItemIndex].quantity = quantity;
    } else {
      // Xóa sản phẩm nếu số lượng <= 0
      dummyCart.splice(existingItemIndex, 1);
    }
  } else if (quantity > 0) {
    // Sản phẩm chưa có trong giỏ hàng, thêm mới
    const productToAdd = findDummyProduct(productId);
    if (productToAdd) {
      dummyCart.push({ product: productToAdd, quantity });
    } else {
      // Ném lỗi nếu không tìm thấy sản phẩm để thêm vào giỏ
      throw new Error(`Sản phẩm với ID ${productId} không tồn tại.`);
    }
  }

  console.log("[Mock API] updateCartItemQuantityApi -> Giỏ hàng sau khi cập nhật:", dummyCart);
  // Trả về một bản sao của giỏ hàng để đảm bảo tính bất biến
  return [...dummyCart];
};

/**
 * Giả lập API đồng bộ hóa toàn bộ giỏ hàng với server.
 * @param cart - Trạng thái giỏ hàng mới cần đồng bộ.
 * @returns Một Promise giải quyết với trạng thái giỏ hàng đã được xác nhận bởi server.
 */
export const updateCartApi = async (cart: Cart): Promise<Cart> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Giả lập độ trễ mạng
  console.log("[Mock API] updateCartApi -> Đồng bộ hóa với giỏ hàng:", cart);
  dummyCart = [...cart]; // Ghi đè toàn bộ giỏ hàng giả lập
  return [...dummyCart];
};