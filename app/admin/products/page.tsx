'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { adminGet, adminDelete, adminPut } from '@/services/adminService';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Star, StarOff, Upload, Download, Search, Package, SlidersHorizontal } from 'lucide-react';
import AdminSelect from '@/components/ui/AdminSelect';
import AdminConfirmDialog from '@/components/ui/AdminConfirmDialog';

interface Product {
  id: number;
  name: string;
  price: number | null;
  priceType: string;
  isActive: boolean;
  isFeatured: boolean;
  category?: { name: string };
  createdAt: string;
}

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [featured, setFeatured] = useState<'all' | 'featured' | 'normal'>('all');
  const [page, setPage] = useState(1);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    adminGet('/products?limit=200').then((res) => {
      setProducts(res.data || []);
      setTotal(res.pagination?.total || res.data?.length || 0);
    });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, status, featured]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDelete(`/products/${deleteTarget.id}`);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (product: Product, field: 'isFeatured' | 'isActive') => {
    try {
      const newValue = !product[field];
      await adminPut(`/products/${product.id}`, { [field]: newValue });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, [field]: newValue } : p)));
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
    }
  };

  const formatPrice = (p: Product) => {
    if (p.priceType === 'contact') return 'Liên hệ';
    if (!p.price) return '—';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.category?.name || '').toLowerCase().includes(q) || formatPrice(p).toLowerCase().includes(q);
      const matchStatus = status === 'all' || (status === 'active' ? p.isActive : !p.isActive);
      const matchFeatured = featured === 'all' || (featured === 'featured' ? p.isFeatured : !p.isFeatured);
      return matchSearch && matchStatus && matchFeatured;
    });
  }, [products, search, status, featured]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeCount = products.filter((p) => p.isActive).length;
  const featuredCount = products.filter((p) => p.isFeatured).length;

  const handleExport = () => {
    const rows: string[][] = [
      ['Tên sản phẩm', 'Danh mục', 'Giá', 'Nổi bật', 'Trạng thái'],
      ...filtered.map((p) => [p.name, p.category?.name || '', formatPrice(p), p.isFeatured ? 'Có' : 'Không', p.isActive ? 'Hiển thị' : 'Không hiển thị']),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative -m-4 min-h-[calc(100dvh-2rem)] bg-[#f8f9fc] p-4 text-slate-900 sm:-m-5 sm:p-5 md:-m-6 md:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:radial-gradient(circle_at_20%_0%,rgba(79,70,229,0.08),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-[1420px] space-y-5">
        <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                <Package size={19} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 inline-flex items-center border-b-2 border-indigo-600 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  Kho sản phẩm
                </div>
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                  <h1 className="text-xl font-bold tracking-tight text-slate-950 md:text-2xl">Sản phẩm</h1>
                  <p className="pb-0.5 text-xs font-medium text-slate-500">Quản lý sản phẩm, trạng thái và dữ liệu nổi bật.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
                <div className="min-w-[72px] px-3 py-1.5">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Tổng</p>
                  <p className="text-sm font-bold tabular-nums text-slate-950">{total}</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="min-w-[72px] px-3 py-1.5">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Hiển thị</p>
                  <p className="text-sm font-bold tabular-nums text-emerald-600">{activeCount}</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="min-w-[72px] px-3 py-1.5">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Nổi bật</p>
                  <p className="text-sm font-bold tabular-nums text-amber-600">{featuredCount}</p>
                </div>
              </div>

              <input ref={importInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; alert('Đã chọn file import. Cần kết nối API import để xử lý dữ liệu.'); event.target.value = ''; }} />
              <button type="button" onClick={() => importInputRef.current?.click()} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98]">
                <Upload size={15} /> Import
              </button>
              <button type="button" onClick={handleExport} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98]">
                <Download size={15} /> Export
              </button>
              <Link href="/admin/products/new" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(79,70,229,0.22)] transition-all hover:bg-indigo-700 active:scale-[0.98]">
                <Plus size={15} /> Thêm sản phẩm
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 lg:px-5">
            <div className="grid gap-2 md:grid-cols-[minmax(260px,1fr)_180px_180px] md:items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm sản phẩm, danh mục hoặc giá..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
              <AdminSelect value={status} onChange={setStatus} className="h-10 min-w-0 border-slate-200 bg-white shadow-none" options={[{ value: 'all', label: 'Tất cả trạng thái' }, { value: 'active', label: 'Hiển thị' }, { value: 'inactive', label: 'Đang ẩn' }]} />
              <AdminSelect value={featured} onChange={setFeatured} className="h-10 min-w-0 border-slate-200 bg-white shadow-none" options={[{ value: 'all', label: 'Tất cả nổi bật' }, { value: 'featured', label: 'Nổi bật' }, { value: 'normal', label: 'Không nổi bật' }]} />
            </div>
          </div>
        </section>

        <div className="space-y-3 md:hidden">
          {paginated.length === 0 ? (
            <div className="rounded-[22px] border border-slate-200 bg-white py-14 text-center text-sm font-medium text-slate-400 shadow-sm">Không có sản phẩm phù hợp</div>
          ) : paginated.map((p) => (
            <div key={p.id} className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">{p.name}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{p.category?.name || 'Chưa có danh mục'}</p>
                </div>
                <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold ${p.isActive ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'}`}>{p.isActive ? 'Hiển thị' : 'Đang ẩn'}</span>
              </div>
              <p className="mt-3 text-sm font-bold tabular-nums text-slate-800">{formatPrice(p)}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <button onClick={() => handleToggle(p, 'isFeatured')} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${p.isFeatured ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' : 'bg-slate-50 text-slate-500 ring-1 ring-slate-100'}`}>{p.isFeatured ? <Star size={14} className="fill-current" /> : <StarOff size={14} />}Nổi bật</button>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/products/${p.id}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"><Pencil size={15} /></Link>
                  <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="hidden overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.05)] md:block">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <SlidersHorizontal size={17} className="text-indigo-600" />
              Danh sách sản phẩm
            </div>
            <p className="text-xs font-medium text-slate-500">Hiển thị {paginated.length} / {filtered.length} kết quả</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[18%]" />
                <col className="w-[17%]" />
                <col className="w-[13%]" />
                <col className="w-[12%]" />
                <col className="w-[6%]" />
              </colgroup>
              <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 text-left">Tên sản phẩm</th>
                  <th className="px-5 py-3.5 text-left">Danh mục</th>
                  <th className="px-5 py-3.5 text-left">Giá</th>
                  <th className="px-5 py-3.5 text-center">Nổi bật</th>
                  <th className="px-5 py-3.5 text-center">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((p) => (
                  <tr key={p.id} className="group transition-colors hover:bg-indigo-50/30">
                    <td className="px-5 py-4 align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500 ring-1 ring-slate-200">#{p.id}</div>
                        <p className="truncate font-semibold text-slate-900">{p.name}</p>
                      </div>
                    </td>
                    <td className="truncate px-5 py-4 align-middle font-medium text-slate-500">{p.category?.name || '—'}</td>
                    <td className="px-5 py-4 align-middle font-semibold tabular-nums text-slate-700">{formatPrice(p)}</td>
                    <td className="px-5 py-4 align-middle text-center">
                      <button onClick={() => handleToggle(p, 'isFeatured')} className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all ${p.isFeatured ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' : 'bg-slate-50 text-slate-400 ring-1 ring-slate-100 hover:text-slate-600'}`}>{p.isFeatured ? <Star size={14} className="fill-current" /> : <StarOff size={14} />} {p.isFeatured ? 'Có' : 'Không'}</button>
                    </td>
                    <td className="px-5 py-4 align-middle text-center">
                      <button onClick={() => handleToggle(p, 'isActive')} className={`inline-flex h-8 min-w-[92px] items-center justify-center rounded-lg px-2.5 text-xs font-semibold transition-all ${p.isActive ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'}`}>{p.isActive ? 'Hiển thị' : 'Đang ẩn'}</button>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/products/${p.id}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"><Pencil size={15} /></Link>
                        <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-slate-400">
                        <Package size={34} />
                        <p className="text-sm font-semibold text-slate-500">Không có sản phẩm phù hợp</p>
                        <p className="text-xs font-medium">Thử đổi từ khóa hoặc bộ lọc.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500">Trang <span className="font-semibold tabular-nums text-slate-800">{safePage}</span> / <span className="font-semibold tabular-nums text-slate-800">{totalPages}</span></p>
          <div className="flex items-center gap-2">
            <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">Trước</button>
            <span className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold tabular-nums text-slate-700 ring-1 ring-slate-100">{safePage}/{totalPages}</span>
            <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">Sau</button>
          </div>
        </div>

        <AdminConfirmDialog
          open={!!deleteTarget}
          title="Xóa sản phẩm"
          description={`Bạn có chắc chắn muốn xóa sản phẩm “${deleteTarget?.name || ''}”? Thao tác này không thể hoàn tác.`}
          confirmText="Xóa sản phẩm"
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
