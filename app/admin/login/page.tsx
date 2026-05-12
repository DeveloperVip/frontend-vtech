'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (data.success) {
        setShowForgotForm(false);
        setForgotEmail('');
        setError(data.message || 'Vui lòng kiểm tra email để đặt lại mật khẩu');
      } else {
        setError(data.message || 'Không thể gửi email đặt lại mật khẩu');
      }
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setForgotLoading(false);
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-11"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-primary-700"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForgotForm((prev) => !prev);
              setForgotEmail(email);
            }}
            className="self-end text-sm font-bold text-primary-700 hover:text-primary-800"
          >
            Quên mật khẩu?
          </button>
          <button type="submit" disabled={isLoading}
            className="btn-primary w-full mt-2 bg-primary-700 hover:bg-primary-800 focus:ring-primary-500/50">
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {showForgotForm && (
          <form onSubmit={handleForgotPassword} className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/70 p-4">
            <h3 className="text-sm font-bold text-gray-900">Lấy lại mật khẩu admin</h3>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Nhập email admin. Hệ thống sẽ gửi link đặt lại mật khẩu.
            </p>
            <input
              type="email"
              required
              className="mt-3 w-full rounded-xl border border-primary-100 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="admin@vitechs.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                disabled={forgotLoading}
                className="flex-1 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-800 disabled:opacity-50"
              >
                {forgotLoading ? 'Đang gửi...' : 'Gửi link'}
              </button>
              <button
                type="button"
                onClick={() => setShowForgotForm(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
