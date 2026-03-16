'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">V</div>
          <h1 className="text-xl font-bold text-gray-900">Vitechs Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Đăng nhập để quản lý website</p>
        </div>

        {error && (
          <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="admin@vitechs.com" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={isLoading}
            className="btn-primary w-full mt-2 bg-primary-700 hover:bg-primary-800 focus:ring-primary-500/50">
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
