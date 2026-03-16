'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminGet, adminDelete } from '@/services/adminService';
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

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa danh mục "${name}"?`)) return;
    setDeleting(id);
    try {
      await adminDelete(`/categories/${id}`);
      toast.success('Đã xóa danh mục');
      setCategories(c => c.filter(x => x.id !== id));
    } catch {
      toast.error('Xóa thất bại');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Vui lòng nhập tên danh mục'); return; }
    setSaving(true);
    try {
      const { adminPost, adminPut } = await import('@/services/adminService');
      if (form.id) {
        await adminPut(`/categories/${form.id}`, { name: form.name, description: form.description });
        toast.success('Đã cập nhật danh mục');
      } else {
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh mục</h1>
        <div className="flex items-center gap-2">
          <button onClick={loadCategories}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin text-gray-400' : 'text-gray-600'} />
          </button>
          <button
            onClick={() => setForm({ show: true, id: null, name: '', description: '' })}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <Plus size={16} /> Thêm danh mục
          </button>
        </div>
      </div>

      {/* Form thêm/sửa */}
      {form.show && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">
            {form.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Tên danh mục *</label>
              <input
                type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ví dụ: Thiết bị ô tô"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Mô tả</label>
              <input
                type="text" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Mô tả ngắn về danh mục"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-400"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors disabled:opacity-60">
              {saving ? <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" /> : null}
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              onClick={() => setForm({ show: false, id: null, name: '', description: '' })}
              className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw size={24} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FolderOpen size={40} className="mx-auto mb-2 text-gray-300" />
            <p>Chưa có danh mục nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Tên danh mục</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Danh mục cha</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {cat.parent?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {cat.isActive ? 'Hiện' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setForm({ show: true, id: cat.id, name: cat.name, description: '' })}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          disabled={deleting === cat.id}
                          className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors disabled:opacity-40">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
