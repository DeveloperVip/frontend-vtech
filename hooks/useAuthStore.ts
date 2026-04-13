import { create } from 'zustand';
import { adminLogin, adminLogout, getToken, initAuthHeader } from '@/services/adminService';
import apiClient from '@/services/apiClient';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const admin = await adminLogin(email, password);
      set({ admin, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    adminLogout();
    set({ admin: null });
  },

  checkAuth: async () => {
    const token = getToken();
    if (!token) {
        set({ admin: null, isLoading: false });
        return;
    }
    
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/auth/me');
      set({ admin: res.data.data, isLoading: false });
    } catch {
      adminLogout();
      set({ admin: null, isLoading: false });
    }
  },
}));
