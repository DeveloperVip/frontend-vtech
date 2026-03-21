'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { fetchPosts } from '@/services/publicService';
import NewsCategoryFilter from './NewsCategoryFilter';
import NewsSidebar from './NewsSidebar';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  thumbnail?: string;
  publishedAt?: string;
  readTime?: number;
  category?: { name: string; slug: string };
}

interface Props {
  initialPosts: Post[];
  sidebarPosts: Post[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function PostCardLarge({ post }: { post: Post }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className="group block h-full">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 mb-4">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-violet-100 flex items-center justify-center text-gray-300 text-4xl">
            📰
          </div>
        )}
        {post.category && (
          <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary-600 text-white">
            {post.category.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
        {post.publishedAt && (
          <span className="flex items-center gap-1">
            <CalendarDays size={12} />
            {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
          </span>
        )}
        {post.readTime && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readTime} phút đọc
          </span>
        )}
      </div>

      <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors mb-2 line-clamp-3">
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
      )}

      <div className="flex items-center gap-1 text-primary-700 text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
        Đọc thêm <ArrowRight size={14} />
      </div>
    </Link>
  );
}

function PostCardSmall({ post }: { post: Post }) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className="group flex gap-3 p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden bg-gray-100">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-violet-50 flex items-center justify-center text-gray-300">
            📰
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {post.category && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-1">
            {post.category.name}
          </span>
        )}
        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 line-clamp-2 leading-snug transition-colors">
          {post.title}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1.5">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <CalendarDays size={10} />
              {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {post.readTime} phút
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function NewsGrid({ initialPosts, sidebarPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 12);

  const handleCategoryChange = async (val: string) => {
    setActiveCategory(val);
    setLoading(true);
    setPage(1);
    try {
      const params: Record<string, string | number> = { limit: 12, page: 1, published: 'true' };
      if (val) params.category = val;
      const res = await fetchPosts(params);
      const data = res.data || [];
      setPosts(data);
      setHasMore(data.length >= 12);
    } catch {
      // silent
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit: 12, page: nextPage, published: 'true' };
      if (activeCategory) params.category = activeCategory;
      const res = await fetchPosts(params);
      const data = res.data || [];
      setPosts((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length >= 12);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Category filter */}
      <NewsCategoryFilter active={activeCategory} onChange={handleCategoryChange} />

      <div className="max-w-[1440px] mx-auto px-2 md:px-4 pb-20">
        {loading && posts.length === 0 ? (
          /* Skeleton */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-[16/9] bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-24 h-20 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">📰</p>
            <p className="text-lg font-medium">Không có bài viết nào</p>
            <p className="text-sm mt-1">Hãy thử chọn danh mục khác</p>
          </div>
        ) : (
          <AnimatePresence mode="wait" >
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {/* Left: Main posts */}
              <div className="lg:col-span-2 space-y-8">
                {/* Featured large card */}
                {featured && (
                  <motion.div key={featured.id} variants={itemVariants}>
                    <PostCardLarge post={featured} />
                  </motion.div>
                )}

                {/* Divider */}
                {rest.length > 0 && (
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <div className="flex-1 h-px bg-gray-100" />
                    Bài viết mới
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )}

                {/* Small cards */}
                <div className="space-y-1 divide-y divide-gray-100">
                  {rest.map((post) => (
                    <motion.div key={post.id} variants={itemVariants}>
                      <PostCardSmall post={post} />
                    </motion.div>
                  ))}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary-600 text-primary-700 font-semibold text-sm hover:bg-primary-600 hover:text-white transition-all disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                      {loading ? 'Đang tải...' : 'Xem thêm bài viết'}
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Sidebar */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-36">
                  <NewsSidebar posts={sidebarPosts} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
