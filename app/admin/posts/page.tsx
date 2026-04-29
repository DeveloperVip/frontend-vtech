'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminGet, adminDelete, adminPut } from '@/services/adminService';
import Link from 'next/link';
import { Plus, Pencil, Trash2, RefreshCw, Search, Star, StarOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Post {
  id: number;
  title: string;
  slug: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
  author: { fullName: string } | null;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGet('/posts', { limit: 50 });
      setPosts(res.data || []);
    } catch {
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Xóa bài viết "${title}"?`)) return;
    setDeleting(id);
    try {
      await adminDelete(`/posts/${id}`);
      toast.success('Đã xóa bài viết');
      setPosts((p) => p.filter((x) => x.id !== id));
    } catch {
      toast.error('Xóa thất bại');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (post: Post, field: 'isPublished' | 'isFeatured') => {
    try {
      const newValue = !post[field];
      const payload: Record<string, unknown> = { [field]: newValue };
      if (field === 'isPublished' && newValue && !post.publishedAt) {
        payload.publishedAt = new Date();
      }
      await adminPut(`/posts/${post.id}`, payload);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? ({ ...p, ...payload } as Post) : p)));
      toast.success('Đã cập nhật bài viết');
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bài viết</h1>
        <div className="flex items-center gap-2">
          <button onClick={loadPosts} className="rounded-lg border border-gray-200 p-2 transition-colors hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin text-gray-400' : 'text-gray-600'} />
          </button>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
          >
            <Plus size={16} /> Thêm bài viết
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <div className="relative w-full max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm bài viết..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw size={24} className="mr-2 animate-spin" /> Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="mb-2 text-4xl">📰</p>
            <p>{search ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào'}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-3 md:hidden">
              {filtered.map((post) => (
                <div key={post.id} className="rounded-xl border border-gray-100 p-3">
                  <p className="line-clamp-2 font-medium text-gray-900">{post.title}</p>
                  <p className="mt-1 truncate text-xs text-gray-400">{post.slug}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      id={`admin-post-feature-mobile-${post.id}`}
                      onClick={() => handleToggle(post, 'isFeatured')}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        post.isFeatured ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {post.isFeatured ? <Star size={14} className="fill-current" /> : <StarOff size={14} />}
                      Nổi bật
                    </button>

                    <span
                      onClick={() => handleToggle(post, 'isPublished')}
                      className={`inline-block cursor-pointer select-none rounded-full px-2.5 py-1 text-xs font-semibold transition-all hover:opacity-80 ${
                        post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {post.isPublished ? 'Đã đăng' : 'Không hiển thị'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : '—'}</span>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/posts/${post.id}`} className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50">
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deleting === post.id}
                        className="rounded-lg p-1.5 text-primary-600 transition-colors hover:bg-primary-50 disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Tiêu đề</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Nổi bật</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Ngày đăng</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((post) => (
                    <tr key={post.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="max-w-xs truncate font-medium text-gray-900">{post.title}</p>
                        <p className="text-xs text-gray-400">{post.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(post, 'isFeatured')}
                          className={`flex items-center gap-1 transition-colors ${post.isFeatured ? 'text-yellow-500' : 'text-gray-300 opacity-40'}`}
                        >
                          {post.isFeatured ? <Star size={16} className="fill-current" /> : <StarOff size={16} />}
                          <span className="text-[11px] font-medium leading-none">Nổi bật</span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          onClick={() => handleToggle(post, 'isPublished')}
                          className={`inline-block w-28 cursor-pointer select-none rounded-full px-2 py-0.5 text-center text-xs font-medium transition-all hover:opacity-80 ${
                            post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          {post.isPublished ? 'Đã đăng' : 'Không hiển thị'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/posts/${post.id}`} className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50">
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deleting === post.id}
                            className="rounded-lg p-1.5 text-primary-600 transition-colors hover:bg-primary-50 disabled:opacity-40"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
