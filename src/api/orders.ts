// src/api/orders.ts

import ordersData from '../mock/orders.json';
import {
  Order,
  PaginatedResponse,
  Delivery,
  Product,
  CartItem,
  Category,
  OrderStatus,
} from '@/types';

/**
 * [HELPER] Định nghĩa cấu trúc dữ liệu thô của đơn hàng từ file JSON.
 */
interface RawOrderData {
  id: number;
  status: string;
  createdAt: string;
  totalPrice: number;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  receivedAt?: string; // `?` cho biết trường này là optional
}

/**
 * [SỬA LỖI - V6 FINAL] Hàm chuyển đổi dữ liệu đơn hàng thô sang kiểu Order hoàn chỉnh.
 */
const transformRawOrder = (raw: RawOrderData): Order => {
  const mockDelivery: Delivery = {
    type: "pickup",
    name: "Tên người nhận mặc định",
    address: "273 An Dương Vương, Phường 3, Quận 5, TP.HCM",
  };

  const transformedItems: CartItem[] = raw.items.map(item => {
    const mockCategory: Category = {
      id: 0,
      name: "Danh mục mặc định",
    };
    const product: Product = {
      id: item.productId,
      name: item.productName,
      price: item.price,
      images: [item.image],
      category: mockCategory,
    };
    return {
      product: product,
      quantity: item.quantity,
      options: [],
    };
  });

  return {
    ...raw,
    // [SỬA LỖI TRIỆT ĐỂ] Xử lý trường `receivedAt` có thể là `undefined`.
    // Nếu `raw.receivedAt` không tồn tại, cung cấp một chuỗi rỗng '' làm giá trị mặc định
    // để đáp ứng yêu cầu của kiểu `Order` là `string`.
    receivedAt: raw.receivedAt ?? '',
    status: raw.status as OrderStatus,
    items: transformedItems,
    paymentStatus: 'pending',
    delivery: mockDelivery,
    total: raw.totalPrice,
    note: 'Vui lòng gọi trước khi giao',
  };
};


/**
 * [API MOCK REFACTORED] Giả lập API lấy danh sách đơn hàng.
 */
export const getAllOrders = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Order>> => {
  try {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedRawData = ordersData.slice(startIndex, endIndex) as RawOrderData[];
    const paginatedData = paginatedRawData.map(transformRawOrder);

    const totalItems = ordersData.length;
    const totalPages = Math.ceil(totalItems / limit);

    return { data: paginatedData, totalItems, totalPages };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw new Error("Could not retrieve orders. Please try again later.");
  }
};