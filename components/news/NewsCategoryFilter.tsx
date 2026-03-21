'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  onChange: (val: string) => void;
}

export default function NewsCategoryFilter({ active, onChange }: Props) {
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
    <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-2 md:px-4 py-8 relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full text-gray-500 hover:text-primary-700 transition"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.value === active;
            return (
              <button
                key={cat.value}
                onClick={() => onChange(cat.value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary-700 text-white border-primary-700 shadow-md shadow-primary-700/20'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full text-gray-500 hover:text-primary-700 transition"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
