'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  FileText,
  MessageSquare,
  LogOut,
  ChevronRight,
  MessageCircle,
  Star,
  Users,
  X,
  Handshake,
  Edit2,
  KeyRound,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { adminPatch } from '@/services/adminService';

const menuGroups = [
  {
    label: 'Tổng quan',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    label: 'Quản lý nội dung',
    items: [
      { label: 'Sản phẩm', href: '/admin/products', icon: <Package size={18} /> },
      { label: 'Danh mục', href: '/admin/categories', icon: <FolderOpen size={18} /> },
      { label: 'Tin tức', href: '/admin/posts', icon: <FileText size={18} /> },
      { label: 'Đối tác', href: '/admin/partners', icon: <Handshake size={18} /> },
    ],
  },
  {
    label: 'Khách hàng',
    items: [
      { label: 'Người dùng', href: '/admin/users', icon: <Users size={18} /> },
      { label: 'Chat hỗ trợ', href: '/admin/chats', icon: <MessageCircle size={18} /> },
      { label: 'Đánh giá', href: '/admin/reviews', icon: <Star size={18} /> },
      { label: 'Liên hệ', href: '/admin/contacts', icon: <MessageSquare size={18} /> },
    ],
  },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return fallback;
};

interface AdminSidebarProps {
  onNavigate?: () => void;
  showCloseButton?: boolean;
}

export default function AdminSidebar({ onNavigate, showCloseButton = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout, setAdmin } = useAuthStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(admin?.name || '');
  const [editEmail, setEditEmail] = useState(admin?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setEditName(admin?.name || '');
    setEditEmail(admin?.email || '');
  }, [admin]);

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.push('/admin/login');
  };

  const openAccountSettings = () => {
    setEditName(admin?.name || '');
    setEditEmail(admin?.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const response = await adminPatch('/auth/profile', {
        name: editName,
        email: editEmail,
      });

      if (response.data) {
        setAdmin(response.data);
      }
      toast.success(response.message || 'Đã cập nhật thông tin admin');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(getErrorMessage(error, 'Không thể cập nhật thông tin'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setSavingPassword(true);
    try {
      const response = await adminPatch('/auth/password', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(response.message || 'Đã đổi mật khẩu');
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error(getErrorMessage(error, 'Không thể đổi mật khẩu'));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white text-slate-600 shadow-[12px_0_40px_rgba(15,23,42,0.04)] md:w-64">
      {/* Brand */}
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={openAccountSettings}
            className="group flex min-w-0 items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-slate-50"
            title="Cài đặt tài khoản admin"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white shadow-sm shadow-indigo-200">V</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-slate-950">Vitechs Admin</p>
              <p className="text-xs text-slate-400">{admin?.role}</p>
            </div>
            <Edit2 size={14} className="opacity-0 text-slate-500 transition group-hover:opacity-100" />
          </button>
          {showCloseButton && (
            <button
              id="admin-sidebar-close"
              type="button"
              aria-label="Đóng menu"
              onClick={onNavigate}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-700 text-gray-300 hover:bg-slate-50 md:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
              {group.label}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onNavigate?.()}
                    className={clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                      active ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                    )}
                  >
                    {item.icon}
                    {item.label}
                    {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-slate-200 px-3 py-4">
        <button
          onClick={openAccountSettings}
          className="group mb-2 w-full rounded-lg px-3 py-2 transition hover:bg-slate-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 text-left">
              <p className="truncate text-sm font-medium text-slate-950">{admin?.name}</p>
              <p className="truncate text-xs text-slate-400">{admin?.email}</p>
            </div>
            <Edit2 size={16} className="opacity-0 text-slate-500 transition group-hover:opacity-100" />
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>

      {/* Account Settings Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[720px] overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gray-900/80 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-300">Admin Account</p>
                <h2 className="mt-1 text-xl font-black text-white">Cài đặt tài khoản</h2>
                <p className="mt-1 text-sm text-slate-500">Cập nhật thông tin hiển thị và mật khẩu đăng nhập.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-800 text-slate-500 transition hover:bg-slate-50 hover:text-white"
                aria-label="Đóng cài đặt tài khoản"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
              <form onSubmit={handleEditSubmit} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-700 text-white">
                    <Edit2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Thông tin admin</h3>
                    <p className="text-xs text-slate-400">Tên và email quản trị</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Tên</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                      placeholder="Nhập tên"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Email</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  {savingProfile ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </form>

              <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
                    <KeyRound size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Đổi mật khẩu</h3>
                    <p className="text-xs text-slate-400">Yêu cầu mật khẩu hiện tại</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-700 bg-gray-800 py-2.5 pl-3 pr-11 text-sm text-white placeholder-gray-500 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition hover:text-amber-300"
                        aria-label={showCurrentPassword ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
                      >
                        {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-700 bg-gray-800 py-2.5 pl-3 pr-11 text-sm text-white placeholder-gray-500 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                        placeholder="Tối thiểu 6 ký tự"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition hover:text-amber-300"
                        aria-label={showNewPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
                      >
                        {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-700 bg-gray-800 py-2.5 pl-3 pr-11 text-sm text-white placeholder-gray-500 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition hover:text-amber-300"
                        aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                      >
                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <KeyRound size={16} />
                  {savingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
