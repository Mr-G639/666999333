import categoriesData from '../mock/categories.json';
import { Category } from '@/types';

// Transform mock data to match the Category type in types.d.ts
export const getAllCategories = async (): Promise<Category[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Transform the data to match the Category type
  return (categoriesData as any[]).map(cat => ({
    id: cat.id,
    name: cat.name,
    image: cat.icon || '' // Map icon to image
  }));
};