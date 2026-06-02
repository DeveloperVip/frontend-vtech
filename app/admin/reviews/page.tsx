'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminGet, adminDelete } from '@/services/adminService';
import { Star, Trash2, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AdminSelect from '@/components/ui/AdminSelect';
import AdminConfirmDialog from '@/components/ui/AdminConfirmDialog';

interface Review { id: number; userName: string; email: string; rating: number; content: string; createdAt: string; isActive: boolean; Product: { id: number; name: string; slug: string; }; }
const PAGE_SIZE = 10;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'hidden'>('all');
  const [rating, setRating] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminGet('/product-reviews?page=1&limit=200');
      setReviews(res.data || []);
      setPagination(res.pagination || { total: res.data?.length || 0, page: 1, totalPages: 1 });
    } catch { toast.error('Lỗi lấy danh sách đánh giá'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);
  useEffect(() => { setPage(1); }, [search, status, rating]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      const matchSearch = !q || r.userName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.content.toLowerCase().includes(q) || (r.Product?.name || '').toLowerCase().includes(q);
      const matchStatus = status === 'all' || (status === 'active' ? r.isActive : !r.isActive);
      const matchRating = rating === 'all' || r.rating === Number(rating);
      return matchSearch && matchStatus && matchRating;
    });
  }, [reviews, search, status, rating]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async () => { if (!deleteTarget) return; setDeleting(true); try { await adminDelete(`/product-reviews/${deleteTarget.id}`); toast.success('Đã xóa đánh giá'); setDeleteTarget(null); fetchReviews(); } catch { toast.error('Lỗi khi xóa'); } finally { setDeleting(false); } };
  const handleToggle = async (review: Review) => { try { const { adminPut } = await import('@/services/adminService'); const newValue = !review.isActive; await adminPut(`/product-reviews/${review.id}`, { isActive: newValue }); setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, isActive: newValue } : r))); toast.success('Đã cập nhật trạng thái'); } catch { toast.error('Cập nhật thất bại'); } };

  return (
    <div className="space-y-4">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">Quản lý Đánh giá ({pagination.total || reviews.length})</h1>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm khách hàng, email, sản phẩm, nội dung..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-400" /></div>
          <AdminSelect value={status} onChange={setStatus} options={[{ value: 'all', label: 'Tất cả trạng thái' }, { value: 'active', label: 'Hiển thị' }, { value: 'hidden', label: 'Ẩn' }]} />
          <AdminSelect value={rating} onChange={setRating} options={[{ value: 'all', label: 'Tất cả sao' }, ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} sao` }))]} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
        {loading ? <div className="px-6 py-12 text-center font-medium text-slate-400">Đang tải...</div> : paginated.length === 0 ? <div className="px-6 py-12 text-center font-medium text-slate-400">Không có đánh giá phù hợp</div> : <>
          <div className="space-y-3 p-3 md:hidden">{paginated.map((r) => <div key={r.id} className="rounded-xl border border-slate-100 p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{r.userName}</p><p className="truncate text-xs text-slate-500">{r.email}</p></div><span onClick={() => handleToggle(r)} className={`inline-block cursor-pointer select-none rounded-full px-2 py-0.5 text-xs font-medium ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-slate-500'}`}>{r.isActive ? 'Hiển thị' : 'Ẩn'}</span></div><Link href={`/san-pham/${r.Product?.slug}`} target="_blank" className="mt-2 inline-flex max-w-full items-center gap-1 truncate text-xs text-indigo-700 hover:underline">{r.Product?.name} <ExternalLink size={12} /></Link><div className="mt-2 flex items-center gap-0.5 text-yellow-500">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < r.rating ? 'fill-current' : 'text-slate-200'} />)}</div><p className="mt-2 line-clamp-3 text-sm text-slate-600">{r.content}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span><button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50"><Trash2 size={16} /></button></div></div>)}</div>
          <div className="hidden overflow-x-auto md:block"><table className="w-full border-collapse text-left"><thead><tr className="border-b border-slate-100 bg-gray-50"><th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Khách hàng</th><th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Sản phẩm</th><th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Đánh giá</th><th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Nội dung</th><th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Trạng thái</th><th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Thao tác</th></tr></thead><tbody className="divide-y divide-gray-100">{paginated.map((r) => <tr key={r.id} className="transition-colors hover:bg-gray-50/50"><td className="px-6 py-4"><div className="font-semibold text-slate-900">{r.userName}</div><div className="text-xs text-slate-500">{r.email}</div><div className="mt-1 text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</div></td><td className="px-6 py-4"><Link href={`/san-pham/${r.Product?.slug}`} target="_blank" className="flex items-center gap-1 text-sm text-indigo-700 hover:underline">{r.Product?.name} <ExternalLink size={12} /></Link></td><td className="px-6 py-4"><div className="flex items-center gap-0.5 text-yellow-500">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < r.rating ? 'fill-current' : 'text-slate-200'} />)}</div></td><td className="px-6 py-4"><p className="line-clamp-2 max-w-xs text-sm text-slate-600">{r.content}</p></td><td className="px-6 py-4"><span onClick={() => handleToggle(r)} className={`inline-block w-24 cursor-pointer select-none rounded-full px-2 py-0.5 text-center text-xs font-medium transition-all hover:opacity-80 ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-slate-400 opacity-60'}`}>{r.isActive ? 'Hiển thị' : 'Ẩn'}</span></td><td className="px-6 py-4 text-right"><button onClick={() => setDeleteTarget(r)} className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50"><Trash2 size={18} /></button></td></tr>)}</tbody></table></div>
        </>}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-500">Hiển thị {paginated.length} / {filtered.length} đánh giá</p><div className="flex items-center gap-2"><button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Trước</button><span className="text-sm font-semibold text-slate-700">{safePage}/{totalPages}</span><button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Sau</button></div></div>

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Xóa đánh giá"
        description={`Bạn có chắc chắn muốn xóa đánh giá của “${deleteTarget?.userName || ''}”? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa đánh giá"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
