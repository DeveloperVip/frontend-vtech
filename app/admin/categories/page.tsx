'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminGet, adminDelete, adminPut } from '@/services/adminService';
import { Plus, Pencil, Trash2, RefreshCw, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  parent: { name: string } | null;
}

interface FormState {
  show: boolean;
  id: number | null;
  name: string;
  description: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({ show: false, id: null, name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGet('/categories');
      setCategories(res.data || []);
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa danh mục "${name}"?`)) return;
    setDeleting(id);
    try {
      await adminDelete(`/categories/${id}`);
      toast.success('Đã xóa danh mục');
      setCategories((c) => c.filter((x) => x.id !== id));
    } catch {
      toast.error('Xóa thất bại');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }
    setSaving(true);
    try {
      if (form.id) {
        await adminPut(`/categories/${form.id}`, { name: form.name, description: form.description });
        toast.success('Đã cập nhật danh mục');
      } else {
        const { adminPost } = await import('@/services/adminService');
        await adminPost('/categories', { name: form.name, description: form.description });
        toast.success('Đã tạo danh mục');
      }
      setForm({ show: false, id: null, name: '', description: '' });
      loadCategories();
    } catch {
      toast.error('Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (cat: Category) => {
    try {
      const newValue = !cat.isActive;
      await adminPut(`/categories/${cat.id}`, { isActive: newValue });
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, isActive: newValue } : c)));
      toast.success('Đã cập nhật trạng thái');
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Danh mục</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={loadCategories}
            className="rounded-lg border border-gray-200 p-2 transition-colors hover:bg-gray-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-gray-400' : 'text-gray-600'} />
          </button>
          <button
            id="admin-category-create"
            onClick={() => setForm({ show: true, id: null, name: '', description: '' })}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
          >
            <Plus size={16} /> Thêm danh mục
          </button>
        </div>
      </div>

      {form.show && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 font-bold text-gray-800">{form.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Tên danh mục *</label>
              <input
                id="admin-category-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ví dụ: Thiết bị ô tô"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Mô tả</label>
              <input
                id="admin-category-description"
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Mô tả ngắn về danh mục"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              id="admin-category-save"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:opacity-60"
            >
              {saving ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              id="admin-category-cancel"
              onClick={() => setForm({ show: false, id: null, name: '', description: '' })}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw size={24} className="mr-2 animate-spin" /> Đang tải...
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FolderOpen size={40} className="mx-auto mb-2 text-gray-300" />
            <p>Chưa có danh mục nào</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-3 md:hidden">
              {categories.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-gray-100 p-3">
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  <p className="mt-1 truncate text-xs text-gray-400">{cat.slug}</p>
                  <p className="mt-1 text-xs text-gray-500">Danh mục cha: {cat.parent?.name || '—'}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      id={`admin-category-status-mobile-${cat.id}`}
                      onClick={() => handleToggle(cat)}
                      className={`inline-block cursor-pointer select-none rounded-full px-2.5 py-1 text-xs font-semibold transition-all hover:opacity-80 ${
                        cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {cat.isActive ? 'Hiển thị' : 'Không hiển thị'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        id={`admin-category-edit-mobile-${cat.id}`}
                        onClick={() => setForm({ show: true, id: cat.id, name: cat.name, description: '' })}
                        className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        id={`admin-category-delete-mobile-${cat.id}`}
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={deleting === cat.id}
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Tên danh mục</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Slug</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Danh mục cha</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{cat.slug}</td>
                      <td className="px-4 py-3 text-gray-500">{cat.parent?.name || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          id={`admin-category-status-${cat.id}`}
                          onClick={() => handleToggle(cat)}
                          className={`inline-block w-28 cursor-pointer select-none rounded-full px-2 py-0.5 text-center text-xs font-medium transition-all hover:opacity-80 ${
                            cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          {cat.isActive ? 'Hiển thị' : 'Không hiển thị'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`admin-category-edit-${cat.id}`}
                            onClick={() => setForm({ show: true, id: cat.id, name: cat.name, description: '' })}
                            className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            id={`admin-category-delete-${cat.id}`}
                            onClick={() => handleDelete(cat.id, cat.name)}
                            disabled={deleting === cat.id}
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
