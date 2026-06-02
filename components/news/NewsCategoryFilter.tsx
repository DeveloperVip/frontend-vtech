'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

const CATEGORIES = [
  { label: 'Tất cả', value: '' },
  { label: 'Công nghệ', value: 'cong-nghe' },
  { label: 'Sản phẩm', value: 'san-pham' },
  { label: 'Sự kiện', value: 'su-kien' },
  { label: 'Hướng dẫn', value: 'huong-dan' },
  { label: 'Tin nội bộ', value: 'tin-noi-bo' },
  { label: 'Đối tác', value: 'doi-tac' },
];

interface Props {
  active: string;
  query: string;
  onChange: (val: string) => void;
  onSearch: (val: string) => void;
}

export default function NewsCategoryFilter({ active, query, onChange, onSearch }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-[80px] z-40 mb-6 border-b border-slate-200/70 bg-white/86 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-3 py-4 md:px-4">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-sky-50/70 to-white p-3 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:p-4">
          <div className="pointer-events-none absolute -right-24 -top-28 h-52 w-52 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-[360px]">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" />
              <input
                id="news-search-input"
                type="search"
                value={query}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full rounded-2xl border border-slate-200 bg-white/92 py-3 pl-11 pr-11 text-sm font-semibold text-slate-800 shadow-inner shadow-slate-100 outline-none transition placeholder:text-slate-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100"
              />
              {query && (
                <button
                  id="news-search-clear"
                  type="button"
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Xóa tìm kiếm"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="relative min-w-0 flex-1">
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-lg transition hover:text-primary-700 md:flex"
                  aria-label="Danh mục trước"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              <div
                ref={scrollRef}
                className="flex items-center gap-2 overflow-x-auto scroll-smooth px-0 py-1 scrollbar-hide md:px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {CATEGORIES.map((cat) => {
                  const isActive = cat.value === active;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => onChange(cat.value)}
                      className={`flex-shrink-0 rounded-2xl border px-4 py-2 text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'border-primary-700 bg-primary-700 text-white shadow-lg shadow-primary-700/20'
                          : 'border-slate-200 bg-white/80 text-slate-600 hover:-translate-y-0.5 hover:border-primary-300 hover:bg-white hover:text-primary-700 hover:shadow-md'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-lg transition hover:text-primary-700 md:flex"
                  aria-label="Danh mục tiếp theo"
                >
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
