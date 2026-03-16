'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminDelete } from '@/services/adminService';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Product { id: number; name: string; price: number | null; priceType: string; isActive: boolean; isFeatured: boolean; category?: { name: string }; createdAt: string; }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const load = () => {
    adminGet('/products?limit=20').then((res) => {
      setProducts(res.data || []);
      setTotal(res.pagination?.total || 0);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    await adminDelete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sản phẩm ({total})</h1>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-800 transition">
          <Plus size={16} /> Thêm mới
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Tên sản phẩm</th>
              <th className="px-4 py-3 text-left">Danh mục</th>
              <th className="px-4 py-3 text-left">Giá</th>
              <th className="px-4 py-3 text-left">Nổi bật</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[220px] truncate">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">
                  {p.priceType === 'contact' ? 'Liên hệ' :
                    p.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price) : '—'}
                </td>
                <td className="px-4 py-3">
                  {p.isFeatured ? <span className="text-yellow-600 text-xs font-medium">⭐ Nổi bật</span> : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isActive ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-1">
                  <Link href={`/admin/products/${p.id}`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 rounded transition">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400">Chưa có sản phẩm nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
