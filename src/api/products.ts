// src/api/products.ts

import productsData from "../mock/products.json";
import { Product, PaginatedResponse } from "@/types";

/**
 * [HELPER] Định nghĩa cấu trúc dữ liệu thô của sản phẩm từ file JSON.
 */
interface RawProductData {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  video?: string;
  detail?: string;
  soldCount?: number;
}

/**
 * [HELPER] Giả lập độ trễ của một cuộc gọi mạng.
 */
const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Định nghĩa các tham số đầu vào cho API lấy sản phẩm.
 * Việc này giúp code an toàn và dễ đọc hơn.
 */
export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  keyword?: string;
}

/**
 * [API MOCK REFACTORED] Giả lập API lấy danh sách sản phẩm,
 * hỗ trợ đầy đủ các tính năng lọc và phân trang.
 *
 * @param params - Một đối tượng chứa các tùy chọn lọc và phân trang.
 * @returns Một Promise chứa đối tượng PaginatedResponse<Product>.
 * Dữ liệu trả về vẫn ở dạng thô, việc làm giàu dữ liệu sẽ diễn ra ở tầng state.
 */
export const getProducts = async (
  params: GetProductsParams = {}
): Promise<PaginatedResponse<Product>> => {
  const { page = 1, limit = 10, categoryId, keyword } = params;
  await simulateApiDelay();

  let filteredData = productsData as RawProductData[];

  // BƯỚC 1: LỌC DỮ LIỆU THEO TIÊU CHÍ (LOGIC SERVER)
  if (categoryId) {
    filteredData = filteredData.filter(p => p.categoryId === categoryId);
  }

  if (keyword) {
    const lowercasedKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(p =>
      p.name.toLowerCase().includes(lowercasedKeyword)
    );
  }

  // BƯỚC 2: PHÂN TRANG TRÊN TẬP DỮ LIỆU ĐÃ LỌC
  const totalItems = filteredData.length;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: paginatedData as any, // Dữ liệu sẽ được hoàn thiện ở tầng state
    totalItems: totalItems,
    totalPages: totalPages,
  };
};