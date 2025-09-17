import productsData from "../mock/products.json";

import { Product, PaginatedResponse } from "@/types";

/**
 * Fetches all products from the mock data with a small delay to simulate an API call.
 * Includes pagination support.
 * @returns A promise that resolves with paginated product data.
 */
export const getAllProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Product>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * limit;
      const endIndex = Math.min(startIndex + limit, productsData.length);
      // Type assertion to any to bypass the type checking here, 
      // as the structure will be normalized in state.ts
      const paginatedData = productsData.slice(startIndex, endIndex) as any[];
      const totalItems = productsData.length;
      const totalPages = Math.ceil(totalItems / limit);
      resolve({
        data: paginatedData,
        totalItems: totalItems,
        totalPages: totalPages,
      });
    }, 500); // Simulate a 500ms API delay
  });
};