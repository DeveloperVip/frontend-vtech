'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchProducts } from '@/services/publicService';
import Link from 'next/link';
import { Phone, Search, SlidersHorizontal, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductsService } from '@/src/api/generated';

interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: number | null;
  priceType: 'fixed' | 'contact';
  category?: { name: string };
  shortDescription?: string;
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastRequest = useRef<any>(null);

  // Initial skip for the first mount to avoid double loading (Next.js 13+ with initialProps)
  const isFirstMount = useRef(true);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      load({ search, categoryId, limit: 12, page: 1 });
    }, 500); // Increased to 500ms to avoid 429 Too Many Requests

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);


  useEffect(() => {
    if (isFirstMount.current) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    load({ search, categoryId, limit: 12, page: 1 });
  }, [categoryId]);

  const load = async (params: Record<string, string | number>) => {
    // Cancel previous request if still running
    if (lastRequest.current && typeof lastRequest.current.cancel === 'function') {
      lastRequest.current.cancel();
    }

    if (products.length === 0) setLoading(true);
    else setIsSearching(true);
    setError(null);

    const promise = ProductsService.getProducts(
      params.page as number,
      params.limit as number,
      params.search as string,
      params.categoryId ? Number(params.categoryId) : undefined
    );
    lastRequest.current = promise;

    try {
      const res = await promise;
      setProducts(res.data || []);
      setPagination(res.pagination || { ...pagination, page: params.page as number });
    } catch (err: any) {
      // Ignore cancellation errors
      if (err.name === 'CancelError' || err.message?.includes('aborted')) return;

      console.error("Error loading products:", err);
      // Handle the 429 specifically
      if (err.status === 429 || err.message?.includes('429')) {
        setError("Bạn đang tìm kiếm quá nhanh. Vui lòng thử lại sau giây lát.");
      } else {
        setError("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleCategory = (id: string) => {
    setCategoryId(id);
    setIsFilterOpen(false);
  };

  const handlePage = (page: number) => {
    load({ search, categoryId, limit: 12, page });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const formatPrice = (price: number | null, type: string) => {
    if (type === 'contact' || !price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

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
        <form onSubmit={(e) => e.preventDefault()} className="w-full sm:flex-1">
          <div className="relative w-full group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm bg-white"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center animate-shake">
          {error}
        </div>
      )}

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

      {/* Grid wrapper to prevent flicker */}
      <div className={`transition-opacity duration-300 ${isSearching ? 'opacity-60 cursor-wait' : 'opacity-100'}`}>
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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8"
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
                  <div className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">

                    {/* Ảnh Sản Phẩm & Badges */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt={p.name} className="w-full h-full p-4 object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Chưa có ảnh</div>
                      )}

                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                        {p.category ? (
                          <span className="bg-white/70 backdrop-blur-md text-gray-800 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm border border-white/20">
                            {p.category.name}
                          </span>
                        ) : <span />}
                        <span className="bg-emerald-100/80 backdrop-blur-md text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm border border-emerald-200/50">
                          Còn Hàng
                        </span>
                      </div>
                    </div>

                    {/* Nội dung Card */}
                    <div className="p-6 flex flex-col flex-1 relative">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">
                        {p.name}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {p.shortDescription || `Khám phá ngay sản phẩm ${p.name.toLowerCase()} với chất lượng tuyệt vời, độ bền cao và thiết kế sang trọng nhất.`}
                      </p>


                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-1">Giá bán</span>
                          <span className={`font-extrabold text-blue-600 text-lg`}>
                            {formatPrice(p.price, p.priceType)}
                          </span>
                        </div>

                        <div className="group/btn w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300 hover:scale-110">
                          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16 pb-10">
          <button
            onClick={() => handlePage(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-400 hover:text-blue-600 transition-all"
          >
            <ChevronDown size={18} className="rotate-90" />
          </button>

          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const pageNum = i + 1;
            // Show first page, last page, and a range around current page
            if (
              pageNum === 1 ||
              pageNum === pagination.totalPages ||
              (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePage(pageNum)}
                  className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${pagination.page === pageNum
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                >
                  {pageNum}
                </button>
              );
            }
            // Show ellipsis
            if (pageNum === 2 && pagination.page > 3) {
              return <span key="dots-1" className="text-gray-400 px-1">...</span>;
            }
            if (pageNum === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2) {
              return <span key="dots-2" className="text-gray-400 px-1">...</span>;
            }
            return null;
          })}

          <button
            onClick={() => handlePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-400 hover:text-blue-600 transition-all"
          >
            <ChevronDown size={18} className="-rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
}
