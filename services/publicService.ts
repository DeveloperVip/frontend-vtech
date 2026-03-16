import apiClient from './apiClient';

export const fetchProducts = async (params?: Record<string, string | number>) => {
  const res = await apiClient.get('/products', { params });
  return res.data;
};

export const fetchProductBySlug = async (slug: string) => {
  const res = await apiClient.get(`/products/slug/${slug}`);
  return res.data.data;
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
