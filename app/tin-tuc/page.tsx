import { fetchPosts, fetchFeaturedPost } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Footer from '@/components/layout/Footer';
import NewsHero from '@/components/news/NewsHero';
import NewsGrid from '@/components/news/NewsGrid';
import { PostsService } from '@/src/api/generated';

export const revalidate = 60;

export const metadata = {
  title: 'Tin tức – Vitechs',
  description: 'Tin tức, sự kiện và bài viết mới nhất từ Vitechs.',
};

export default async function TinTucPage() {
  const config = siteConfig;

  const [postsData, featuredPost, sidebarData] = await Promise.all([
    PostsService.getPosts().catch(() => ({ data: [] })),
    PostsService.getPosts().catch(() => null),
    PostsService.getPosts().catch(() => ({ data: [] })),
  ]);
  console.log("🚀 ~ TinTucPage ~ postsData:", featuredPost?.data?.[0])

  const posts = postsData.data || [];
  const sidebarPosts = (sidebarData.data || []).slice(0, 5);

  return (
    <>
      <main>
        {/* Hero Banner */}
        <NewsHero post={featuredPost?.data?.[0]} />

        {/* Grid + Sidebar (includes sticky category filter) */}
        <NewsGrid initialPosts={posts} sidebarPosts={sidebarPosts} />
      </main>
      <Footer config={config} />
    </>
  );
}
