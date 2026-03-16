'use client';

import { useEffect, useState } from 'react';
import { adminGet } from '@/services/adminService';
import { Package, MessageSquare, FileText, FolderOpen } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  products: number;
  contacts: number;
  posts: number;
  categories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, contacts: 0, posts: 0, categories: 0 });
  useEffect(() => {
    Promise.all([
      adminGet('/products?limit=1').catch(() => ({ pagination: { total: 0 } })),
      adminGet('/contacts?limit=1').catch(() => ({ pagination: { total: 0 } })),
      adminGet('/posts?limit=1').catch(() => ({ pagination: { total: 0 } })),
      adminGet('/categories').catch(() => ({ data: [] })),
    ]).then(([products, contacts, posts, categories]) => {
      setStats({
        products: products?.pagination?.total ?? 0,
        contacts: contacts?.pagination?.total ?? 0,
        posts: posts?.pagination?.total ?? 0,
        categories: categories?.data?.length ?? 0,
      });
    });
  }, []);

  const cards = [
    { label: 'Sản phẩm', value: stats.products, icon: <Package size={22} />, href: '/admin/products', color: 'bg-blue-500' },
    { label: 'Liên hệ mới', value: stats.contacts, icon: <MessageSquare size={22} />, href: '/admin/contacts', color: 'bg-primary-700' },
    { label: 'Bài viết', value: stats.posts, icon: <FileText size={22} />, href: '/admin/posts', color: 'bg-green-600' },
    { label: 'Danh mục', value: stats.categories, icon: <FolderOpen size={22} />, href: '/admin/categories', color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition border border-gray-100">
            <div className={`${c.color} text-white w-12 h-12 rounded-xl flex items-center justify-center`}>
              {c.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Truy cập nhanh</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Thêm sản phẩm', href: '/admin/products/new' },
            { label: 'Thêm bài viết', href: '/admin/posts/new' },
            { label: 'Xem liên hệ', href: '/admin/contacts' },
            { label: 'Cấu hình website', href: '/admin/settings' },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-100 transition">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
