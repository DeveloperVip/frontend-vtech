'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserAuthStore } from '@/hooks/useUserAuthStore';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useUserAuthStore((state) => state.setUser);
  const setToken = useUserAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Đăng nhập thành công!');
        setUser(data.user);
        setToken(data.token);
        
        // Cập nhật thông tin cho chat
        localStorage.setItem('chat_user_id', data.user.id.toString());
        localStorage.setItem('chat_user_name', data.user.name);
        
        router.push('/');
      } else {
        toast.error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url('/bg-auth.svg')] bg-cover">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6 group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Trở về trang chủ
          </Link>
          <div className="flex justify-center">
             <img src="/vitechs.png" alt="Logo" className="h-12 w-auto mb-4" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Thành viên đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng nhập thông tin để truy cập tài khoản của bạn
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Email hoặc Tên đăng nhập *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-10 py-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-gray-50/50"
                  placeholder="Email hoặc username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Mật khẩu *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-10 py-3.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-gray-50/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LogIn className="h-5 w-5 text-primary-300 group-hover:text-primary-100 transition-colors" />
                  </span>
                  Đăng nhập
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Đăng ký ngay
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
