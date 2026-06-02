'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminGet, adminDelete, adminPut } from '@/services/adminService';
import Link from 'next/link';
import { Plus, Pencil, Trash2, RefreshCw, Search, Star, StarOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSelect from '@/components/ui/AdminSelect';
import AdminConfirmDialog from '@/components/ui/AdminConfirmDialog';

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
  const [status, setStatus] = useState<'all' | 'published' | 'hidden'>('all');
  const [featured, setFeatured] = useState<'all' | 'featured' | 'normal'>('all');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      await adminDelete(`/posts/${deleteTarget.id}`);
      toast.success('Đã xóa bài viết');
      setPosts((p) => p.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
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

  useEffect(() => {
    setPage(1);
  }, [search, status, featured]);

  const filtered = posts.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || (p.author?.fullName || '').toLowerCase().includes(q);
    const matchStatus = status === 'all' || (status === 'published' ? p.isPublished : !p.isPublished);
    const matchFeatured = featured === 'all' || (featured === 'featured' ? p.isFeatured : !p.isFeatured);
    return matchSearch && matchStatus && matchFeatured;
  });
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Bài viết</h1>
        <div className="flex items-center gap-2">
          <button onClick={loadPosts} className="rounded-lg border border-slate-200 p-2 transition-colors hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin text-slate-400' : 'text-slate-600'} />
          </button>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
          >
            <Plus size={16} /> Thêm bài viết
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-100 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tiêu đề, slug, tác giả..."
                className="h-10 w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
              />
            </div>
            <AdminSelect value={status} onChange={setStatus} options={[{ value: 'all', label: 'Tất cả trạng thái' }, { value: 'published', label: 'Đã đăng' }, { value: 'hidden', label: 'Không hiển thị' }]} />
            <AdminSelect value={featured} onChange={setFeatured} options={[{ value: 'all', label: 'Tất cả nổi bật' }, { value: 'featured', label: 'Nổi bật' }, { value: 'normal', label: 'Không nổi bật' }]} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <RefreshCw size={24} className="mr-2 animate-spin" /> Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="mb-2 text-4xl">📰</p>
            <p>{search ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào'}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-3 md:hidden">
              {paginated.map((post) => (
                <div key={post.id} className="rounded-xl border border-slate-100 p-3">
                  <p className="line-clamp-2 font-medium text-slate-900">{post.title}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">{post.slug}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      id={`admin-post-feature-mobile-${post.id}`}
                      onClick={() => handleToggle(post, 'isFeatured')}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        post.isFeatured ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-slate-500'
                      }`}
                    >
                      {post.isFeatured ? <Star size={14} className="fill-current" /> : <StarOff size={14} />}
                      Nổi bật
                    </button>

                    <span
                      onClick={() => handleToggle(post, 'isPublished')}
                      className={`inline-block cursor-pointer select-none rounded-full px-2.5 py-1 text-xs font-semibold transition-all hover:opacity-80 ${
                        post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-slate-500'
                      }`}
                    >
                      {post.isPublished ? 'Đã đăng' : 'Không hiển thị'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : '—'}</span>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/posts/${post.id}`} className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50">
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        disabled={deleting === post.id}
                        className="rounded-lg p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50 disabled:opacity-40"
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
                <thead className="border-b border-slate-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Tiêu đề</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Nổi bật</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Ngày đăng</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((post) => (
                    <tr key={post.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="max-w-xs truncate font-medium text-slate-900">{post.title}</p>
                        <p className="text-xs text-slate-400">{post.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(post, 'isFeatured')}
                          className={`flex items-center gap-1 transition-colors ${post.isFeatured ? 'text-yellow-500' : 'text-slate-300 opacity-40'}`}
                        >
                          {post.isFeatured ? <Star size={16} className="fill-current" /> : <StarOff size={16} />}
                          <span className="text-[11px] font-medium leading-none">Nổi bật</span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          onClick={() => handleToggle(post, 'isPublished')}
                          className={`inline-block w-28 cursor-pointer select-none rounded-full px-2 py-0.5 text-center text-xs font-medium transition-all hover:opacity-80 ${
                            post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-slate-400 opacity-60'
                          }`}
                        >
                          {post.isPublished ? 'Đã đăng' : 'Không hiển thị'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/posts/${post.id}`} className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50">
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(post)}
                            disabled={deleting === post.id}
                            className="rounded-lg p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50 disabled:opacity-40"
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

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Hiển thị {paginated.length} / {filtered.length} bài viết</p>
        <div className="flex items-center gap-2">
          <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Trước</button>
          <span className="text-sm font-semibold text-slate-700">{safePage}/{totalPages}</span>
          <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Sau</button>
        </div>
      </div>

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Xóa bài viết"
        description={`Bạn có chắc chắn muốn xóa bài viết “${deleteTarget?.title || ''}”? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa bài viết"
        loading={!!deleteTarget && deleting === deleteTarget.id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
