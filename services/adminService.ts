import apiClient from './apiClient';
import Cookies from 'js-cookie';
import { OpenAPI } from '@/src/api/generated/core/OpenAPI';

const TOKEN_KEY = 'vitechs_admin_token';

export const getToken = () => Cookies.get(TOKEN_KEY) || null;
export const setToken = (token: string) => Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'strict', path: '/' });
export const removeToken = () => Cookies.remove(TOKEN_KEY, { path: '/' });

export const adminLogin = async (email: string, password: string) => {
  const res = await apiClient.post('/auth/login', { email, password });
  const { token, admin } = res.data;
  setToken(token);
  // Header is now handled by interceptor
  OpenAPI.TOKEN = token;
  return admin;
};

export const adminLogout = () => {
  removeToken();
  OpenAPI.TOKEN = undefined;
};

export const initAuthHeader = () => {
  // Logic remains for legacy or OpenAPI generation compatibility if needed
  const token = getToken();
  if (token) {
    OpenAPI.TOKEN = token;
  }
};

// Admin CRUD helpers
export const adminGet = (url: string, params?: object) =>
  apiClient.get(url, { params }).then((r) => r.data);

export const adminPost = (url: string, data: object) =>
  apiClient.post(url, data).then((r) => r.data);

export const adminPut = (url: string, data: object) =>
  apiClient.put(url, data).then((r) => r.data);

export const adminPatch = (url: string, data: object) =>
  apiClient.patch(url, data).then((r) => r.data);

export const adminDelete = (url: string) =>
  apiClient.delete(url).then((r) => r.data);
