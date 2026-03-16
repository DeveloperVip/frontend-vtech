'use client';

<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react';
import { fetchProducts } from '@/services/publicService';
import Link from 'next/link';
import { Phone, Search, SlidersHorizontal, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
=======
import { useState } from 'react';
import { fetchProducts } from '@/services/publicService';
import Link from 'next/link';
import { Phone, Search, SlidersHorizontal } from 'lucide-react';
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9

interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: number | null;
  priceType: 'fixed' | 'contact';
  category?: { name: string };
<<<<<<< HEAD
  shortDescription?: string;
=======
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
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
<<<<<<< HEAD
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
=======
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9

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
<<<<<<< HEAD
    setIsFilterOpen(false);
=======
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
    load({ search, categoryId: id, limit: 12, page: 1 });
  };

  const handlePage = (page: number) => {
    load({ search, categoryId, limit: 12, page });
<<<<<<< HEAD
    window.scrollTo({ top: 300, behavior: 'smooth' });
=======
    window.scrollTo({ top: 0, behavior: 'smooth' });
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
  };

  const formatPrice = (price: number | null, type: string) => {
    if (type === 'contact' || !price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

<<<<<<< HEAD
  const selectedCategoryName = categoryId === ''
    ? 'Tất cả danh mục'
    : categories.find((c) => String(c.id) === categoryId)?.name || 'Tất cả danh mục';

  return (
    <div className="py-6">
      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center w-full max-w-[800px] xl:max-w-[900px] mx-auto px-4 lg:px-0"
      >

        {/* Search */}
        <form onSubmit={handleSearch} className="w-full sm:flex-1">
          <div className="relative w-full group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm bg-white"
=======
  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
<<<<<<< HEAD
        </form>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-[250px] shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-between w-full px-5 py-3 border border-gray-200 rounded-full bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          >
            <span className="font-medium truncate">{selectedCategoryName}</span>
            <ChevronDown size={18} className={`text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 py-2 overflow-hidden">
              <button
                onClick={() => handleCategory('')}
                className={`block w-full text-left px-5 py-2.5 text-sm transition-colors ${categoryId === '' ? 'bg-blue-600 text-white font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Tất cả danh mục
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategory(String(c.id))}
                  className={`block w-full text-left px-5 py-2.5 text-sm transition-colors ${categoryId === String(c.id) ? 'bg-blue-600 text-white font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 flex justify-between items-end"
      >
        <p className="text-sm text-gray-500">
          Hiển thị <span className="font-semibold text-gray-800">{pagination.total}</span> sản phẩm
        </p>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-2xl w-full h-[450px]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp</p>
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Link href={`/san-pham/${p.slug}`} className="group block h-full">
                <div className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
                  
                  {/* Ảnh Sản Phẩm & Badges */}
                  <div className="relative aspect-square md:aspect-[4/3] bg-gray-50 overflow-hidden">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Chưa có ảnh</div>
                    )}
                    
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                      {p.category ? (
                        <span className="bg-white/70 backdrop-blur-md text-gray-800 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm border border-white/20">
                          {p.category.name}
                        </span>
                      ) : <span />}
                      <span className="bg-[#00D1B2] text-white px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm border border-white/10">
                        Còn Hàng
                      </span>
                    </div>
                  </div>

                  {/* Nội dung Card */}
                  <div className="p-6 flex flex-col flex-1 relative">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </h3>
                    
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                      {p.shortDescription || `Khám phá ngay sản phẩm ${p.name.toLowerCase()} với chất lượng tuyệt vời, độ bền cao và thiết kế sang trọng nhất.`}
                    </p>

                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-1">Giá bán</span>
                        <span className={`font-extrabold text-[#FF8A00] text-lg`}>
                          {formatPrice(p.price, p.priceType)}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
=======
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
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
<<<<<<< HEAD
        <div className="flex justify-center gap-2 mt-16 pb-10">
          {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePage(i + 1)}
              className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                pagination.page === i + 1
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
=======
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                pagination.page === i + 1
                  ? 'bg-primary-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700'
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
              }`}
            >
              {i + 1}
            </button>
          ))}
<<<<<<< HEAD
          {pagination.totalPages > 5 && (
            <div className="flex items-center text-gray-400 px-2">...</div>
          )}
=======
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
        </div>
      )}
    </div>
  );
}
