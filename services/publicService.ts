import apiClient from './apiClient';

export const fetchProducts = async (params?: Record<string, string | number>) => {
  const res = await apiClient.get('/products', { params });
  return res.data;
};

export const fetchProductBySlug = async (slug: string) => {
  try {
    const res = await apiClient.get(`/products/slug/${slug}`);
    if (!res.data?.data) {
      throw new Error("Product not found");
    }
    return res.data.data;
  } catch (error) {
    console.error("Fetch product failed:", error);
    return null;
  }
};

export const fetchCategories = async () => {
  const res = await apiClient.get('/categories');
  return res.data.data;
};

export const fetchPosts = async (params?: Record<string, string | number>) => {
  const res = await apiClient.get('/posts', { params: { published: 'true', ...params } });
  return res.data;
};

export const fetchPostBySlug = async (slug: string) => {
  const res = await apiClient.get(`/posts/slug/${slug}`);
  return res.data.data;
};

export const fetchReviews = async (productId: number, params?: Record<string, string | number>) => {
  const res = await apiClient.get(`/products/${productId}/reviews`, { params });
  return res.data;
};

export const fetchRelatedProducts = async (productId: number, params?: Record<string, string | number>) => {
  const res = await apiClient.get(`/products/${productId}/relations`, { params });
  return res.data.data || [];
};

export const submitReview = async (productId: number, data: {
  userName: string;
  email: string;
  rating: number;
  content: string;
  images?: { url: string; width?: number; height?: number }[];
}) => {
  const res = await apiClient.post(`/products/${productId}/reviews`, data);
  return res.data;
};

export const submitContact = async (data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const res = await apiClient.post('/contacts', data);
  return res.data;
};
