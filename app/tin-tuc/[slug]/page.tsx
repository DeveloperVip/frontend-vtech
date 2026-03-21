import { fetchRelatedPosts, fetchPosts } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Footer from '@/components/layout/Footer';
import ReadingProgressBar from '@/components/news/ReadingProgressBar';
import NewsSidebar from '@/components/news/NewsSidebar';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock, ArrowLeft, User, Tag } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PostsService } from '@/src/api/generated';

export const revalidate = 60;

type Props = { params: { slug: string } };

async function getPost(slug: string) {
  try {
    const res = await PostsService.getPostsSlug(slug);
    return res?.data || null;
  } catch (err) {
    console.error('❌ Fetch post error:', err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: 'Không tìm thấy – Vitechs' };
  }

  return {
    title: post.metaTitle || `${post.title} – Vitechs`,
    description: post.metaDescription || post.excerpt || '',
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || '',
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function TinTucDetailPage({ params }: Props) {
  const config = siteConfig;

  const post = await getPost(params.slug);
  if (!post) notFound();

  const [relatedPosts, sidebarPosts] = await Promise.all([
    fetchRelatedPosts(params.slug, 4).catch(() => []),
    fetchPosts({ limit: 5, page: 1 }).catch(() => ({ data: [] })),
  ]);

  const sidebar = sidebarPosts?.data || [];
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/tin-tuc/${params.slug}`;

  return (
    <>
      <ReadingProgressBar />

      <main className="bg-white">
        {/* Breadcrumb */}
        <div className="max-w-[1440px] mx-auto px-2 md:px-4 pt-6 pb-2">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <Link href="/tin-tuc">Tin tức</Link>
            {post.category && (
              <>
                <span>/</span>
                <span className="text-primary-600 font-medium">
                  {post.category.name}
                </span>
              </>
            )}
          </nav>
        </div>

        <div className="max-w-[1440px] mx-auto px-2 md:px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

            {/* ARTICLE */}
            <article>
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 mb-6"
              >
                <ArrowLeft size={14} />
                Quay lại tin tức
              </Link>

              {/* Category */}
              {post.category && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-700">
                    <Tag size={11} />
                    {post.category.name}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-extrabold mb-5">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex gap-4 text-sm text-gray-500 mb-8 border-b pb-6">
                {post.author?.fullName && (
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {post.author.fullName}
                  </span>
                )}

                {post.publishedAt && (
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                )}

                {post.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime} phút đọc
                  </span>
                )}
              </div>

              {/* Thumbnail */}
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="rounded-xl mb-6 w-full"
                />
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="italic mb-6 text-gray-600">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((tag: any) => (
                    <span key={tag.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Related */}
              {relatedPosts.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-bold mb-4">Bài viết liên quan</h2>

                  <div className="grid grid-cols-2 gap-4">
                    {relatedPosts.map((rp: any) => (
                      <Link key={rp.id} href={`/tin-tuc/${rp.slug}`}>
                        <div className="border p-3 rounded">
                          <p className="font-semibold">{rp.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* SIDEBAR */}
            <aside className="hidden lg:block">
              <NewsSidebar posts={sidebar.slice(0, 5)} title="Đọc nhiều nhất" />
            </aside>
          </div>
        </div>
      </main>

      <Footer config={config} />
    </>
  );
}