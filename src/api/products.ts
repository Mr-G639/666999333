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
 * [HELPER] Chuyển đổi dữ liệu sản phẩm thô sang kiểu Product hoàn chỉnh.
 * Giúp đảm bảo dữ liệu luôn nhất quán và có cấu trúc đúng trước khi đưa vào ứng dụng.
 */
const transformRawProduct = (raw: RawProductData): Product => {
  // [SỬA LỖI] Cung cấp kiểu dữ liệu tường minh cho tham số 'c'
  const category = allCategories.find((c: Category) => c.id === raw.categoryId);
  return {
    ...raw,
    // Luôn cung cấp một category mặc định để tránh lỗi runtime nếu không tìm thấy
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
 * hỗ trợ đầy đủ các tính năng lọc và phân trang, đã được tối ưu và thêm xử lý lỗi.
 */
export const getProducts = async (
  params: GetProductsParams = {}
): Promise<PaginatedResponse<Product>> => {
  try {
    // [TỐI ƯU HIỆU NĂNG] Đã loại bỏ hàm simulateApiDelay()
    // Giúp giảm thời gian chờ không cần thiết, tăng tốc độ tải dữ liệu.

    const { page = 1, limit = 10, categoryId, keyword } = params;

    let filteredData = productsData as RawProductData[];

    // Lọc dữ liệu dựa trên các tham số đầu vào
    if (categoryId) {
      filteredData = filteredData.filter(p => p.categoryId === categoryId);
    }
    if (keyword) {
      const lowercasedKeyword = keyword.toLowerCase();
      filteredData = filteredData.filter(p =>
        p.name.toLowerCase().includes(lowercasedKeyword)
      );
    }

    // Logic phân trang
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
  } catch (error) {
    // [SỬA LỖI] Bổ sung khối try...catch để xử lý lỗi một cách an toàn.
    // Tác động kinh doanh: Ngăn chặn ứng dụng bị "trắng trang" khi có lỗi xảy ra
    // trong quá trình xử lý dữ liệu, đảm bảo trải nghiệm người dùng không bị gián đoạn.
    console.error("Failed to fetch products:", error);
    // Ném lỗi ra ngoài để các component gọi hàm này có thể bắt và xử lý
    // (ví dụ: hiển thị thông báo lỗi cho người dùng).
    throw new Error("Could not retrieve products. Please try again later.");
  }
};

/**
 * [API MOCK - REFACTORED] Giả lập API lấy TẤT CẢ sản phẩm, đã được tối ưu.
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // [TỐI ƯU HIỆU NĂNG] Đã loại bỏ hàm simulateApiDelay()
    return (productsData as RawProductData[]).map(transformRawProduct);
  } catch (error) {
    // [SỬA LỖI] Đảm bảo tính nhất quán trong việc xử lý lỗi trên toàn bộ file.
    console.error("Failed to fetch all products:", error);
    throw new Error("Could not retrieve all products.");
  }
};