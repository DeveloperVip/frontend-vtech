import { fetchPosts } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
<<<<<<< HEAD
import NewsList from '@/components/news/NewsList';
=======
import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9

export const revalidate = 60;

export const metadata = {
  title: 'Tin tức – Vitechs',
  description: 'Tin tức và bài viết mới nhất từ Vitechs.',
};

export default async function TinTucPage() {
  const config = siteConfig;
  const postsData = await fetchPosts({ limit: 9, page: 1 }).catch(() => ({ data: [], pagination: {} }));

  const posts = postsData.data || [];

  return (
    <>
      <Navbar config={config} />
      <main>
<<<<<<< HEAD
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6 text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Tin tức</h1>
            <p className="text-blue-100 text-base max-w-2xl mx-auto">
              Cập nhật kiến thức và thông tin mới nhất từ Vitechs
            </p>
=======
        <div className="bg-primary-700 text-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">Tin tức</h1>
            <p className="mt-1 text-primary-200 text-sm">Cập nhật kiến thức và thông tin mới nhất từ Vitechs</p>
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
<<<<<<< HEAD
          <NewsList posts={posts} />
=======
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">📰</p>
              <p>Chưa có bài viết nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: {
                id: number; title: string; slug: string;
                excerpt: string | null; thumbnail: string | null; publishedAt: string;
              }) => (
                <Link key={post.id} href={`/tin-tuc/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm bg-gradient-to-br from-gray-100 to-gray-200">
                        📰
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <CalendarDays size={12} />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : ''}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug mb-2">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-1 text-primary-700 text-sm font-medium mt-4">
                      Đọc thêm <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
        </div>
      </main>
      <Footer config={config} />
    </>
  );
}
