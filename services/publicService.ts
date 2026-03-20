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

export const fetchFeaturedPost = async () => {
  const res = await apiClient.get('/posts', { params: { published: 'true', featured: 'true', limit: 1 } });
  const list = res.data?.data || [];
  if (list.length > 0) return list[0];
  // fallback: bài mới nhất
  const fallback = await apiClient.get('/posts', { params: { published: 'true', limit: 1 } });
  return fallback.data?.data?.[0] || null;
};

export const fetchRelatedPosts = async (currentSlug: string, limit = 4) => {
  const res = await apiClient.get('/posts', { params: { published: 'true', limit: limit + 1 } });
  const list: any[] = res.data?.data || [];
  return list.filter((p: any) => p.slug !== currentSlug).slice(0, limit);
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
