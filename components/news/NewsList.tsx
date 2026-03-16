'use client';

import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewsList({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">📰</p>
        <p>Chưa có bài viết nào.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={itemVariants}>
          <Link
            href={`/tin-tuc/${post.slug}`}
            className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="aspect-[16/9] bg-gray-100 overflow-hidden shrink-0">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm bg-gradient-to-br from-gray-100 to-gray-200">
                  📰
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                <CalendarDays size={12} />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : ''}
              </div>
              <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug mb-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-1 text-primary-700 text-sm font-medium mt-4 mt-auto">
                Đọc thêm <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
