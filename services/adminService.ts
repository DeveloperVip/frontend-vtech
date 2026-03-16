import apiClient from './apiClient';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'vitechs_admin_token';

export const getToken = () => Cookies.get(TOKEN_KEY) || null;
export const setToken = (token: string) => Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'strict' });
export const removeToken = () => Cookies.remove(TOKEN_KEY);

export const adminLogin = async (email: string, password: string) => {
  const res = await apiClient.post('/auth/login', { email, password });
  const { token, admin } = res.data;
  setToken(token);
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return admin;
};

export const adminLogout = () => {
  removeToken();
  delete apiClient.defaults.headers.common['Authorization'];
};

export const initAuthHeader = () => {
  const token = getToken();
  if (token) apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Admin CRUD helpers
export const adminGet = (url: string, params?: object) =>
  apiClient.get(url, { params }).then((r) => r.data);

export const adminPost = (url: string, data: object) =>
  apiClient.post(url, data).then((r) => r.data);

export const adminPut = (url: string, data: object) =>
  apiClient.put(url, data).then((r) => r.data);

export const adminDelete = (url: string) =>
  apiClient.delete(url).then((r) => r.data);
