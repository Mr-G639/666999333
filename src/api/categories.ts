// src/api/categories.ts

// Sửa lỗi: Import biến `categories` từ file TypeScript './mock/categories.ts'
// và đổi tên thành `categoriesData` để sử dụng trong hàm.
import { categories as categoriesData } from '../mock/categories';
import { Category } from '@/types';

/**
 * Giả lập một cuộc gọi API để lấy danh sách tất cả các danh mục sản phẩm.
 * @returns {Promise<Category[]>} Một promise chứa một mảng các danh mục.
 */
export const getAllCategories = async (): Promise<Category[]> => {
  // Giả lập độ trễ mạng để giống với một cuộc gọi API thực tế.
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Dữ liệu `categoriesData` được import trực tiếp đã có cấu trúc tương thích.
  // Chỉ cần ép kiểu để đảm bảo TypeScript hiểu đúng.
  return categoriesData as Category[];
};