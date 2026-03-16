'use client';

import { useState } from 'react';
import { fetchProducts } from '@/services/publicService';
import Link from 'next/link';
import { Phone, Search, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: number | null;
  priceType: 'fixed' | 'contact';
  category?: { name: string };
}

interface Pagination {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface Category {
  id: number;
  name: string;
}

interface Props {
  initialProducts: Product[];
  initialPagination: Pagination;
  categories: Category[];
}

export default function ProductsClient({ initialProducts, initialPagination, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (params: Record<string, string | number>) => {
    setLoading(true);
    try {
      const res = await fetchProducts(params);
      setProducts(res.data || []);
      setPagination(res.pagination || pagination);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load({ search, categoryId, limit: 12, page: 1 });
  };

  const handleCategory = (id: string) => {
    setCategoryId(id);
    load({ search, categoryId: id, limit: 12, page: 1 });
  };

  const handlePage = (page: number) => {
    load({ search, categoryId, limit: 12, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price: number | null, type: string) => {
    if (type === 'contact' || !price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 transition">
            Tìm
          </button>
        </form>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <select
            className="border border-gray-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:border-primary-400"
            value={categoryId}
            onChange={(e) => handleCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        Tìm thấy <span className="font-semibold text-gray-800">{pagination.total}</span> sản phẩm
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-2xl aspect-[4/5]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link key={p.id} href={`/san-pham/${p.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Chưa có ảnh</div>
                )}
              </div>
              <div className="p-4">
                {p.category && (
                  <span className="text-xs text-primary-700 font-medium">{p.category.name}</span>
                )}
                <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2 leading-snug">{p.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`font-bold text-sm ${p.priceType === 'contact' ? 'text-gray-400 italic' : 'text-primary-700'}`}>
                    {formatPrice(p.price, p.priceType)}
                  </span>
                  {p.priceType === 'contact' && (
                    <span className="flex items-center gap-1 text-xs text-white bg-primary-700 px-2 py-1 rounded-full">
                      <Phone size={10} /> Báo giá
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                pagination.page === i + 1
                  ? 'bg-primary-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
