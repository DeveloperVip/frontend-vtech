'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, ArrowRight, Tag } from 'lucide-react';

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

export default function NewsHero({ post }: { post: Post | null }) {
  // console.log("🚀 ~ NewsHero ~ post:", post)
  if (!post) return null;

  return (
    <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden">
      {/* Background image */}
      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover scale-[1.02] transition-transform duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-violet-700" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-[1440px] mx-auto px-2 md:px-4 flex flex-col justify-end pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          {/* Badge */}
          {post.category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-600/90 text-white mb-4 backdrop-blur-sm">
              <Tag size={11} />
              {post.category.name}
            </span>
          )}

          {/* Title */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-5 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta + CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {post.readTime} phút đọc
                </span>
              )}
            </div>

            <Link
              href={`/tin-tuc/${post.slug}`}
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-primary-50 transition-all group shadow-lg"
            >
              Đọc toàn bài
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Featured label */}
      <div className="absolute top-5 right-5">
        <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/20">
          ✦ Nổi bật
        </span>
      </div>
    </section>
  );
}
