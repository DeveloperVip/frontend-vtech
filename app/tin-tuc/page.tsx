import { fetchPosts } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NewsList from '@/components/news/NewsList';

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
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6 text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Tin tức</h1>
            <p className="text-blue-100 text-base max-w-2xl mx-auto">
              Cập nhật kiến thức và thông tin mới nhất từ Vitechs
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <NewsList posts={posts} />
        </div>
      </main>
      <Footer config={config} />
    </>
  );
}
