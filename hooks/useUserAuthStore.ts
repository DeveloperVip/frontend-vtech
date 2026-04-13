import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface UserAuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) {
          Cookies.set('vitechs_user_token', token, { expires: 7, path: '/' });
          localStorage.setItem('vitechs_user_token', token);
        } else {
          Cookies.remove('vitechs_user_token', { path: '/' });
          localStorage.removeItem('vitechs_user_token');
        }
        set({ token, isAuthenticated: !!token });
      },
      logout: () => {
        Cookies.remove('vitechs_user_token', { path: '/' });
        localStorage.removeItem('vitechs_user_token');
        localStorage.removeItem('chat_user_id');
        localStorage.removeItem('chat_user_name');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'user-auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
