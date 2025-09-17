import bannersData from '../mock/banners.json';

interface Banner {
  // Assuming banners.json is an array of strings based on the previous file list
  // If it's an object, define its structure here
  // Example if it's an array of objects:
  // id: number;
  // imageUrl: string;
  // link?: string;
}

export const getAllBanners = async (): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Adjust the return type if banners.json is not an array of strings
  return bannersData as string[];
};

// If banners.json is an array of objects, the return type should match the Banner interface:
// export const getAllBanners = async (): Promise<Banner[]> => {
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return bannersData as Banner[];
// };