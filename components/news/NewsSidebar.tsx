'use client';

import Link from 'next/link';
import { CalendarDays, TrendingUp } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string;
  publishedAt?: string;
  readTime?: number;
  category?: { name: string };
}

interface Props {
  posts: Post[];
  title?: string;
}

export default function NewsSidebar({ posts, title = 'Tin nổi bật' }: Props) {
  if (!posts || posts.length === 0) return null;

  return (
    <aside className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b-2 border-primary-600 mb-4">
        <TrendingUp size={16} className="text-primary-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">{title}</h3>
      </div>

      {/* List */}
      <ul className="space-y-0">
        {posts.map((post, i) => (
          <li key={post.id}>
            <Link
              href={`/tin-tuc/${post.slug}`}
              className="group flex items-start gap-3 py-4 hover:bg-primary-50/50 px-2 -mx-2 rounded-xl transition-colors"
            >
              {/* Number */}
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm select-none ${
                  i === 0
                    ? 'bg-primary-600 text-white'
                    : i === 1
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i + 1}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {post.category && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600 mb-0.5">
                    {post.category.name}
                  </span>
                )}
                <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 line-clamp-2 leading-snug transition-colors">
                  {post.title}
                </p>
                {post.publishedAt && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                    <CalendarDays size={10} />
                    {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>

              {/* Thumbnail */}
              {post.thumbnail && (
                <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
            </Link>

            {i < posts.length - 1 && <div className="border-b border-gray-100 mx-2" />}
          </li>
        ))}
      </ul>
    </aside>
  );
}
