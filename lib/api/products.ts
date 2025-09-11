import { apiClient } from '@/lib/axios';

const DUMMY_JSON_BASE_URL = 'https://api.escuelajs.co/api/v1';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export const getProducts = async (params?: {
  offset?: number;
  limit?: number;
  title?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  categorySlug?: string;
}): Promise<{ data: Product[]; totalCount: number }> => {
  try {
    const response = await apiClient.get<Product[]>(
      `${DUMMY_JSON_BASE_URL}/products`,
      { params }
    );
    // Dummy JSON API does not return total count, so we'll use the length of the returned array
    return { data: response.data, totalCount: response.data.length };
  } catch (error) {
    console.error('Error fetching products from Dummy JSON:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>(
      `${DUMMY_JSON_BASE_URL}/categories`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories from Dummy JSON:', error);
    throw error;
  }
};
