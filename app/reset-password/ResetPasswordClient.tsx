'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type ResetPasswordClientProps = {
  token: string;
  type: 'admin' | 'user';
};

export default function ResetPasswordClient({ token, type }: ResetPasswordClientProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginHref = useMemo(() => (type === 'admin' ? '/admin/login' : '/login'), [type]);
  const title = type === 'admin' ? 'Đặt lại mật khẩu admin' : 'Đặt lại mật khẩu thành viên';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Thiếu token đặt lại mật khẩu');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới tối thiểu 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const endpoint = type === 'admin' ? '/auth/reset-password' : '/users/reset-password';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Đặt lại mật khẩu thành công');
        router.push(loginHref);
      } else {
        toast.error(data.message || 'Không thể đặt lại mật khẩu');
      }
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 bg-[url('/bg-auth.svg')] bg-cover px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <Link href={loginHref} className="mb-6 inline-flex items-center text-sm text-gray-500 transition-colors hover:text-primary-600">
          <ArrowLeft size={16} className="mr-2" />
          Quay lại đăng nhập
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <KeyRound size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">Nhập mật khẩu mới cho tài khoản của bạn.</p>
        </div>

        {!token && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            Link đặt lại mật khẩu không hợp lệ hoặc thiếu token.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Mật khẩu mới</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 pl-10 pr-12 py-3.5 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-primary-600"
                aria-label={showNewPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 pl-10 pr-12 py-3.5 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-primary-600"
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-xl bg-primary-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-200 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
