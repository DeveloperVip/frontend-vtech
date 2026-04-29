'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
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
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Sản phẩm', href: '/admin/products', icon: <Package size={18} /> },
  { label: 'Danh mục', href: '/admin/categories', icon: <FolderOpen size={18} /> },
  { label: 'Tin tức', href: '/admin/posts', icon: <FileText size={18} /> },
  { label: 'Người dùng', href: '/admin/users', icon: <Users size={18} /> },
  { label: 'Chat hỗ trợ', href: '/admin/chats', icon: <MessageCircle size={18} /> },
  { label: 'Đánh giá', href: '/admin/reviews', icon: <Star size={18} /> },
  { label: 'Liên hệ', href: '/admin/contacts', icon: <MessageSquare size={18} /> },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  showCloseButton?: boolean;
}

export default function AdminSidebar({ onNavigate, showCloseButton = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.push('/admin/login');
  };

  return (
    <aside className="flex min-h-screen w-60 flex-col bg-gray-900 text-gray-300 md:w-60">
      {/* Brand */}
      <div className="border-b border-gray-800 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-lg font-bold text-white">V</div>
            <div>
              <p className="text-sm font-semibold leading-tight text-white">Vitechs Admin</p>
              <p className="text-xs text-gray-500">{admin?.role}</p>
            </div>
          </div>
          {showCloseButton && (
            <button
              id="admin-sidebar-close"
              type="button"
              aria-label="Đóng menu"
              onClick={onNavigate}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800 md:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  active ? 'bg-primary-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                )}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User & Logout */}
      <div className="border-t border-gray-800 px-3 py-4">
        <div className="mb-2 px-3 py-2">
          <p className="truncate text-sm font-medium text-white">{admin?.name}</p>
          <p className="truncate text-xs text-gray-500">{admin?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
