'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserAuthStore } from '@/hooks/useUserAuthStore';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useUserAuthStore((state) => state.setUser);
  const setToken = useUserAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Đăng ký tài khoản thành công!');
        setUser(data.user);
        setToken(data.token);
        router.push('/');
      } else {
        toast.error(data.message || 'Đăng ký thất bại');
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
            Đăng ký thành viên
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Cùng VITECHS tận hưởng những ưu đãi tốt nhất
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Họ và tên *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <UserIcon size={18} />
                </span>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-gray-50/50"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Tên đăng nhập *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <UserIcon size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-gray-50/50"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Số điện thoại</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Phone size={18} />
                  </span>
                  <input
                    type="text"
                    className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-gray-50/50"
                    placeholder="09xxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Email *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-gray-50/50"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-gray-50/50"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    <UserPlus className="h-5 w-5 text-primary-300 group-hover:text-primary-100 transition-colors" />
                  </span>
                  Tạo tài khoản
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
