'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth().then(() => {
      const { admin: a } = useAuthStore.getState();
      if (!a && pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    });
  }, [checkAuth, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-400 text-sm">Đang kiểm tra quyền...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block md:shrink-0">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[84vw] transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} showCloseButton />
      </div>

      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
          <button
            id="admin-mobile-menu-toggle"
            type="button"
            aria-label="Mở menu"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
          >
            <Menu size={18} />
          </button>
          <p className="text-sm font-bold text-gray-800">Vitechs Admin</p>
          <div className="w-10" />
        </div>
        <div className="p-4 sm:p-5 md:p-6">{children}</div>
      </main>
    </div>
  );
}
