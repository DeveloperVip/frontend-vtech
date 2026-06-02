'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminGet, adminDelete } from '@/services/adminService';
import { Trash2, RefreshCw, Mail, Search } from 'lucide-react';
import AdminSelect from '@/components/ui/AdminSelect';
import AdminConfirmDialog from '@/components/ui/AdminConfirmDialog';

interface Contact { id: number; fullName: string; email: string; phone: string; subject: string; status: string; createdAt: string; }

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', read: 'bg-blue-100 text-blue-700', replied: 'bg-green-100 text-green-700', archived: 'bg-gray-100 text-slate-600' };
const statusLabels: Record<string, string> = { pending: 'Chờ xử lý', read: 'Đã đọc', replied: 'Đã trả lời', archived: 'Lưu trữ' };
const PAGE_SIZE = 10;

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminGet('/contacts?limit=200&page=1');
      setContacts(res.data || []);
      setTotal(res.pagination?.total || res.data?.length || 0);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [search, status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      const matchSearch = !q || c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q);
      const matchStatus = status === 'all' || c.status === status;
      return matchSearch && matchStatus;
    });
  }, [contacts, search, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async () => { if (!deleteTarget) return; setDeleting(true); try { await adminDelete(`/contacts/${deleteTarget.id}`); setDeleteTarget(null); load(); } finally { setDeleting(false); } };

  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý liên hệ ({total})</h1>
        <button id="admin-contacts-refresh" onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-gray-50"><RefreshCw size={15} className={loading ? 'animate-spin text-slate-400' : 'text-slate-600'} />Làm mới</button>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm họ tên, email, SĐT, chủ đề..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-400" /></div>
          <AdminSelect value={status} onChange={setStatus} options={[{ value: 'all', label: 'Tất cả trạng thái' }, ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))]} />
        </div>
      </div>

      {loading ? <div className="rounded-2xl border border-slate-100 bg-white px-4 py-16 text-center text-slate-400">Đang tải liên hệ...</div> : paginated.length === 0 ? <div className="rounded-2xl border border-slate-100 bg-white px-4 py-16 text-center text-slate-400"><Mail size={40} className="mx-auto mb-2 text-slate-300" />Không có liên hệ phù hợp</div> : <>
        <div className="space-y-3 md:hidden">{paginated.map((c) => <div key={c.id} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{c.fullName}</p><p className="truncate text-xs text-slate-500">{c.email}</p><p className="mt-1 text-xs text-slate-500">{c.phone}</p></div><span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[c.status]}`}>{statusLabels[c.status] || c.status}</span></div><p className="mt-3 line-clamp-2 text-sm text-slate-700">{c.subject}</p><div className="mt-3 flex items-center justify-between"><p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</p><button onClick={() => setDeleteTarget(c)} className="rounded-lg p-1.5 text-indigo-600 transition hover:bg-indigo-50"><Trash2 size={15} /></button></div></div>)}</div>
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)] md:block"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3 text-left">Họ tên</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Chủ đề</th><th className="px-4 py-3 text-left">Trạng thái</th><th className="px-4 py-3 text-left">Ngày</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-gray-100">{paginated.map((c) => <tr key={c.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-slate-900">{c.fullName}</td><td className="px-4 py-3 text-slate-500">{c.email}</td><td className="max-w-[220px] truncate px-4 py-3 text-slate-600">{c.subject}</td><td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.status]}`}>{statusLabels[c.status] || c.status}</span></td><td className="px-4 py-3 text-slate-400">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td><td className="px-4 py-3 text-right"><button onClick={() => setDeleteTarget(c)} className="rounded p-1.5 text-slate-400 transition hover:text-indigo-600"><Trash2 size={15} /></button></td></tr>)}</tbody></table></div></div>
      </>}

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-500">Hiển thị {paginated.length} / {filtered.length} liên hệ</p><div className="flex items-center gap-2"><button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Trước</button><span className="text-sm font-semibold text-slate-700">{safePage}/{totalPages}</span><button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">Sau</button></div></div>

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Xóa liên hệ"
        description={`Bạn có chắc chắn muốn xóa liên hệ của “${deleteTarget?.fullName || ''}”? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa liên hệ"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
