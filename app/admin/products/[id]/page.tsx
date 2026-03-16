'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminGet, adminPost, adminPut } from '@/services/adminService';
import ImageUpload from '@/components/ui/ImageUpload';

interface Category { id: number; name: string; }

export default function ProductFormPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState({
    name: '', description: '', price: '', priceType: 'contact',
    thumbnail: '', categoryId: '', isFeatured: false, isActive: true,
    metaTitle: '', metaDescription: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminGet('/categories').then((res) => setCategories(res.data || []));
    if (!isNew) {
      adminGet(`/products/${params.id}`).then((res) => {
        const p = res.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price ? String(p.price) : '',
          priceType: p.priceType || 'contact',
          thumbnail: p.thumbnail || '',
          categoryId: p.categoryId ? String(p.categoryId) : '',
          isFeatured: p.isFeatured || false,
          isActive: p.isActive !== false,
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
        });
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      };
      if (isNew) await adminPost('/products', payload);
      else await adminPut(`/products/${params.id}`, payload);
      router.push('/admin/products');
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Lỗi lưu dữ liệu');
      setLoading(false);
    }
  };

  const f = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}</h1>
      {error && <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
          <input className="input-field" value={form.name} onChange={(e) => f('name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea className="input-field resize-none" rows={3} value={form.description} onChange={(e) => f('description', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kiểu giá</label>
            <select className="input-field" value={form.priceType} onChange={(e) => f('priceType', e.target.value)}>
              <option value="contact">Liên hệ</option>
              <option value="fixed">Giá cố định</option>
            </select>
          </div>
          {form.priceType === 'fixed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
              <input type="number" className="input-field" value={form.price} onChange={(e) => f('price', e.target.value)} />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select className="input-field" value={form.categoryId} onChange={(e) => f('categoryId', e.target.value)}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <ImageUpload
          label="Ảnh đại diện sản phẩm"
          value={form.thumbnail}
          onChange={(url) => f('thumbnail', url)}
        />
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => f('isFeatured', e.target.checked)} />
            Sản phẩm nổi bật
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => f('isActive', e.target.checked)} />
            Hiển thị
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="btn-primary bg-primary-700 hover:bg-primary-800 focus:ring-primary-500/50 flex-1">
            {loading ? 'Đang lưu...' : isNew ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
          </button>
          <button type="button" onClick={() => router.push('/admin/products')}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
