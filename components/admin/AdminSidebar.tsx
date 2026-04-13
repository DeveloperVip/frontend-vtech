'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  LayoutDashboard, Package, FolderOpen, FileText,
  MessageSquare, LogOut, ChevronRight, MessageCircle, Star
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Sản phẩm', href: '/admin/products', icon: <Package size={18} /> },
  { label: 'Danh mục', href: '/admin/categories', icon: <FolderOpen size={18} /> },
  { label: 'Tin tức', href: '/admin/posts', icon: <FileText size={18} /> },
  { label: 'Chat hỗ trợ', href: '/admin/chats', icon: <MessageCircle size={18} /> },
  { label: 'Đánh giá', href: '/admin/reviews', icon: <Star size={18} /> },
  { label: 'Liên hệ', href: '/admin/contacts', icon: <MessageSquare size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">V</div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Vitechs Admin</p>
            <p className="text-gray-500 text-xs">{admin?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <div className='flex flex-col gap-1 sticky top-0 left-0'>
          {menuItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                  active
                    ? 'bg-primary-700 text-white'
                    : 'hover:bg-gray-800 text-gray-400 hover:text-white',
                )}>
                {item.icon}
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="px-3 py-2 mb-2">
          <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
          <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
