'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminDelete, adminPut } from '@/services/adminService';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Star, StarOff } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number | null;
  priceType: string;
  isActive: boolean;
  isFeatured: boolean;
  category?: { name: string };
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const load = () => {
    adminGet('/products?limit=20').then((res) => {
      setProducts(res.data || []);
      setTotal(res.pagination?.total || 0);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    await adminDelete(`/products/${id}`);
    load();
  };

  const handleToggle = async (product: Product, field: 'isFeatured' | 'isActive') => {
    try {
      const newValue = !product[field];
      await adminPut(`/products/${product.id}`, { [field]: newValue });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, [field]: newValue } : p)));
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
    }
  };

  const formatPrice = (p: Product) => {
    if (p.priceType === 'contact') return 'Liên hệ';
    if (!p.price) return '—';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Sản phẩm ({total})</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          <Plus size={16} /> Thêm mới
        </Link>
      </div>

      <div className="space-y-3 md:hidden">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center text-gray-400">Chưa có sản phẩm nào</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="line-clamp-2 font-semibold text-gray-900">{p.name}</p>
              <p className="mt-1 text-xs text-gray-500">{p.category?.name || '—'}</p>
              <p className="mt-2 text-sm font-semibold text-primary-700">{formatPrice(p)}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  id={`admin-product-feature-${p.id}`}
                  onClick={() => handleToggle(p, 'isFeatured')}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    p.isFeatured ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {p.isFeatured ? <Star size={14} className="fill-current" /> : <StarOff size={14} />}
                  Nổi bật
                </button>

                <button
                  id={`admin-product-active-${p.id}`}
                  onClick={() => handleToggle(p, 'isActive')}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {p.isActive ? 'Hiển thị' : 'Không hiển thị'}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-end gap-1">
                <Link href={`/admin/products/${p.id}`} className="rounded p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600">
                  <Pencil size={15} />
                </Link>
                <button
                  id={`admin-product-delete-${p.id}`}
                  onClick={() => handleDelete(p.id)}
                  className="rounded p-2 text-gray-500 transition hover:bg-primary-50 hover:text-primary-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
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
                  <td className="max-w-[220px] truncate px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPrice(p)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(p, 'isFeatured')}
                      className={`flex items-center gap-1 transition-colors ${p.isFeatured ? 'text-yellow-600' : 'text-gray-300 opacity-40'}`}
                    >
                      {p.isFeatured ? <Star size={16} className="fill-current" /> : <StarOff size={16} />}
                      <span className="text-[11px] font-medium leading-none">Nổi bật</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      onClick={() => handleToggle(p, 'isActive')}
                      className={`inline-block w-28 cursor-pointer select-none rounded-full px-2 py-0.5 text-center text-xs font-medium transition-all hover:opacity-80 ${
                        p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 opacity-60'
                      }`}
                    >
                      {p.isActive ? 'Hiển thị' : 'Không hiển thị'}
                    </span>
                  </td>
                  <td className="flex justify-end gap-1 px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="rounded p-1.5 text-gray-400 transition hover:text-blue-600">
                      <Pencil size={15} />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="rounded p-1.5 text-gray-400 transition hover:text-primary-600">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
