import { fetchPosts } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Footer from '@/components/layout/Footer';
import NewsList from '@/components/news/NewsList';
import AnimatedHeader from '@/components/layout/AnimatedHeader';

export const revalidate = 60;

export const metadata = {
  title: 'Tin tức – Vitechs',
  description: 'Tin tức và bài viết mới nhất từ Vitechs.',
};

export default async function TinTucLocalePage() {
  const config = siteConfig;
  const postsData = await fetchPosts({ limit: 9, page: 1 }).catch(() => ({ data: [], pagination: {} }));
  const posts = postsData.data || [];

  return (
    <>
      <main>
        <AnimatedHeader title="Tin tức" subtitle="Cập nhật kiến thức và thông tin mới nhất từ Vitechs" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <NewsList posts={posts} />
        </div>
      </main>
      <Footer config={config} />
    </>
  );
}
