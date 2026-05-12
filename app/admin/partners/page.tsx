'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminGet, adminPost, adminPut, adminDelete, adminPatch } from '@/services/adminService';
import ImageUpload from '@/components/ui/ImageUpload';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  X,
  GripVertical,
  Globe,
  Handshake,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Partner {
  id: number;
  name: string;
  logoUrl: string | null;
  website: string | null;
  country: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  name: '',
  logoUrl: '',
  website: '',
  country: '',
  description: '',
  sortOrder: 0,
  isActive: true,
};

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { message?: string })?.message || fallback;

const normalizeWebsite = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filterActive, setFilterActive] = useState<'all' | 'true' | 'false'>('all');
  const [movingId, setMovingId] = useState<number | null>(null);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterActive !== 'all') params.active = filterActive;
      const res = await adminGet('/partners', params);
      if (res.success) setPartners(res.data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi tải danh sách đối tác'));
    } finally {
      setLoading(false);
    }
  }, [filterActive]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sortOrder: partners.length });
    setShowModal(true);
  };

  const openEdit = (p: Partner) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      logoUrl: p.logoUrl || '',
      website: p.website || '',
      country: p.country || '',
      description: p.description || '',
      sortOrder: p.sortOrder,
      isActive: p.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Tên đối tác là bắt buộc');
      return;
    }
    if (form.website.trim() && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(form.website.trim())) {
      toast.error('Website không hợp lệ');
      return;
    }

    const payload = {
      name: form.name.trim(),
      logoUrl: form.logoUrl.trim(),
      website: normalizeWebsite(form.website),
      country: form.country.trim(),
      description: form.description.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (editingId) {
        await adminPut(`/partners/${editingId}`, payload);
        toast.success('Cập nhật đối tác thành công');
      } else {
        await adminPost('/partners', payload);
        toast.success('Thêm đối tác thành công');
      }
      setShowModal(false);
      fetchPartners();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi lưu đối tác'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminDelete(`/partners/${id}`);
      toast.success('Xoá đối tác thành công');
      setDeleteConfirm(null);
      fetchPartners();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi xoá đối tác'));
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await adminPatch(`/partners/${id}/toggle`, {});
      fetchPartners();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi chuyển trạng thái'));
    }
  };

  const orderedPartners = [...partners].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

  const handleMove = async (id: number, direction: -1 | 1) => {
    const currentIndex = orderedPartners.findIndex((p) => p.id === id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedPartners.length) return;

    const nextOrder = [...orderedPartners];
    [nextOrder[currentIndex], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[currentIndex]];
    setMovingId(id);

    try {
      await Promise.all(
        nextOrder.map((partner, index) =>
          partner.sortOrder === index ? Promise.resolve() : adminPut(`/partners/${partner.id}`, { sortOrder: index }),
        ),
      );
      setPartners(nextOrder.map((partner, index) => ({ ...partner, sortOrder: index })));
      toast.success('Đã cập nhật thứ tự hiển thị');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi cập nhật thứ tự'));
      fetchPartners();
    } finally {
      setMovingId(null);
    }
  };

  const filtered = orderedPartners.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.country || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.website || '').toLowerCase().includes(search.toLowerCase())
  );

  const inputCls =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm placeholder-gray-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Handshake size={22} />
            </div>
            Quản lý Đối tác
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {partners.length} đối tác · {partners.filter((p) => p.isActive).length} đang hiển thị
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary-700 hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} /> Thêm đối tác
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm đối tác..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm shadow-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
          />
        </div>
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value as 'all' | 'true' | 'false')}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="all">Tất cả</option>
          <option value="true">Đang hiển thị</option>
          <option value="false">Đã ẩn</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Đối tác
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Quốc gia
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Thứ tự
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <Handshake size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Chưa có đối tác nào</p>
                    <p className="text-xs mt-1">Nhấn &ldquo;Thêm đối tác&rdquo; để bắt đầu</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const orderIndex = orderedPartners.findIndex((item) => item.id === p.id);
                  return (
                  <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {p.logoUrl ? (
                            <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain p-1.5" />
                          ) : (
                            <Handshake size={20} className="text-gray-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                          {p.website && (
                            <a
                              href={p.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1 mt-0.5"
                            >
                              <Globe size={10} /> Website
                              <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{p.country || '—'}</span>
                    </td>
                    <td className="px-5 py-4 text-center hidden sm:table-cell">
                      <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                        <button
                          onClick={() => handleMove(p.id, -1)}
                          disabled={orderIndex <= 0 || movingId !== null}
                          className="rounded-md p-1 text-gray-400 transition hover:bg-white hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Đưa lên"
                        >
                          {movingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <ChevronUp size={12} />}
                        </button>
                        <span className="inline-flex min-w-8 items-center justify-center gap-1 px-1 text-xs font-bold text-gray-500">
                          <GripVertical size={12} />
                          {p.sortOrder}
                        </span>
                        <button
                          onClick={() => handleMove(p.id, 1)}
                          disabled={orderIndex === orderedPartners.length - 1 || movingId !== null}
                          className="rounded-md p-1 text-gray-400 transition hover:bg-white hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Đưa xuống"
                        >
                          {movingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggle(p.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          p.isActive
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {p.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {p.isActive ? 'Hiển thị' : 'Đã ẩn'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-primary-50 text-gray-400 hover:text-primary-600 flex items-center justify-center transition-colors"
                          title="Sửa"
                        >
                          <Pencil size={14} />
                        </button>
                        {deleteConfirm === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                            title="Xoá"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingId ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Tên đối tác <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="VD: Bosch – Đức"
                      className={inputCls}
                    />
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                    <ImageUpload
                      label="Logo đối tác"
                      value={form.logoUrl}
                      onChange={(url) => setForm({ ...form, logoUrl: url })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Quốc gia</label>
                      <input
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        placeholder="VD: Đức, Nhật Bản..."
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Thứ tự</label>
                      <input
                        type="number"
                        value={form.sortOrder}
                        onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Website</label>
                    <input
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://www.example.com"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Mô tả</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Mô tả ngắn về đối tác..."
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Hiển thị trên website</p>
                      <p className="text-xs text-gray-400">Đối tác sẽ xuất hiện ở trang chính</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-primary-600' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Huỷ
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {editingId ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
