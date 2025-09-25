// src/api/products.ts

import productsData from "../mock/products.json";
// [SỬA LỖI] Sử dụng import có tên thay vì default import cho categories
import { categories as allCategories } from "../mock/categories";
import { Product, PaginatedResponse, Category } from "@/types";

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
 * [HELPER] Chuyển đổi dữ liệu sản phẩm thô sang kiểu Product hoàn chỉnh.
 */
const transformRawProduct = (raw: RawProductData): Product => {
  // [SỬA LỖI] Cung cấp kiểu dữ liệu tường minh cho tham số 'c'
  const category = allCategories.find((c: Category) => c.id === raw.categoryId);
  return {
    ...raw,
    category: category || { id: raw.categoryId, name: "Unknown Category" }
  };
};

/**
 * Định nghĩa các tham số đầu vào cho API lấy sản phẩm.
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
 */
export const getProducts = async (
  params: GetProductsParams = {}
): Promise<PaginatedResponse<Product>> => {
  const { page = 1, limit = 10, categoryId, keyword } = params;
  await simulateApiDelay();

  let filteredData = productsData as RawProductData[];

  // Lọc dữ liệu...
  if (categoryId) {
    filteredData = filteredData.filter(p => p.categoryId === categoryId);
  }
  if (keyword) {
    const lowercasedKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(p =>
      p.name.toLowerCase().includes(lowercasedKeyword)
    );
  }

  // Phân trang...
  const totalItems = filteredData.length;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalItems / limit);

  const transformedData = paginatedData.map(transformRawProduct);

  return {
    data: transformedData,
    totalItems: totalItems,
    totalPages: totalPages,
  };
};

/**
 * [API MOCK - REFACTORED] Giả lập API lấy TẤT CẢ sản phẩm.
 */
export const getAllProducts = async (): Promise<Product[]> => {
  await simulateApiDelay();
  return (productsData as RawProductData[]).map(transformRawProduct);
};