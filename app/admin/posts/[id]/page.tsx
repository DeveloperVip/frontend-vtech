'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminGet, adminPost, adminPut } from '@/services/adminService';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Star, Eye, EyeOff, X, Plus } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CKEditorField = dynamic(() => import('@/components/ui/CKEditorField'), { ssr: false });

// Auto-generate slug from Vietnamese title
function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

interface Form {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string;
  categoryId: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
}

const defaultForm: Form = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  isPublished: false,
  isFeatured: false,
  publishedAt: '',
  categoryId: '',
  tags: [],
  metaTitle: '',
  metaDescription: '',
};

export default function PostFormPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState<Form>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [slugManual, setSlugManual] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  // Load categories
  useEffect(() => {
    adminGet('/categories').then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  // Load post for edit
  useEffect(() => {
    if (!isNew) {
      adminGet(`/posts/${params.id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            title: p.title || '',
            slug: p.slug || '',
            excerpt: p.excerpt || '',
            content: p.content || '',
            thumbnail: p.thumbnail || '',
            isPublished: p.isPublished || false,
            isFeatured: p.isFeatured || false,
            publishedAt: p.publishedAt ? p.publishedAt.slice(0, 16) : '',
            categoryId: p.category?.id?.toString() || '',
            tags: (p.tags || []).map((t: { name: string }) => t.name),
            metaTitle: p.metaTitle || '',
            metaDescription: p.metaDescription || '',
          });
          setSlugManual(true); // editing: don't auto-overwrite slug
        })
        .catch(() => toast.error('Không thể tải bài viết'))
        .finally(() => setFetching(false));
    }
  }, []);

  const setField = useCallback(<K extends keyof Form>(field: K, value: Form[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Auto-slug from title when creating new
  const handleTitleChange = (val: string) => {
    setField('title', val);
    if (!slugManual) setField('slug', toSlug(val));
  };

  const handleSlugChange = (val: string) => {
    setSlugManual(true);
    setField('slug', toSlug(val));
  };

  // Tags
  const addTag = (raw: string) => {
    const name = raw.trim().toLowerCase();
    if (!name || form.tags.includes(name)) return;
    setField('tags', [...form.tags, name]);
    setTagInput('');
  };
  const removeTag = (tag: string) => setField('tags', form.tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    if (!form.slug.trim()) { toast.error('Slug không được để trống'); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        publishedAt: form.publishedAt || null,
      };
      if (isNew) {
        await adminPost('/posts', payload);
        toast.success('Đã tạo bài viết');
      } else {
        await adminPut(`/posts/${params.id}`, payload);
        toast.success('Đã cập nhật bài viết');
      }
      router.push('/admin/posts');
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || 'Lưu thất bại');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <span className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mr-2" />
        Đang tải...
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {isNew ? 'Thêm bài viết' : 'Chỉnh sửa bài viết'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* ── LEFT MAIN ── */}
          <div className="space-y-5">
            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
              <input
                className="input-field text-lg font-semibold"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                required
              />

              {/* Slug */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  URL: <span className="text-gray-400">/tin-tuc/</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200 whitespace-nowrap">/tin-tuc/</span>
                  <input
                    className="input-field text-sm py-2 flex-1"
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="slug-bai-viet"
                  />
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                value={form.excerpt}
                onChange={(e) => setField('excerpt', e.target.value)}
                placeholder="Mô tả ngắn hiển thị ở trang danh sách và hero banner..."
                maxLength={300}
              />
              <div className="text-right text-xs text-gray-400 mt-1">{form.excerpt.length}/300</div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
              <CKEditorField
                value={form.content}
                onChange={(val) => setField('content', val)}
                placeholder="Nhập nội dung bài viết..."
              />
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <ImageUpload
                label="Ảnh đại diện (Thumbnail)"
                value={form.thumbnail}
                onChange={(url) => setField('thumbnail', url)}
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                SEO
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  className="input-field"
                  value={form.metaTitle}
                  onChange={(e) => setField('metaTitle', e.target.value)}
                  placeholder="Để trống = dùng tiêu đề bài viết"
                  maxLength={70}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{form.metaTitle.length}/70</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  value={form.metaDescription}
                  onChange={(e) => setField('metaDescription', e.target.value)}
                  placeholder="Mô tả SEO..."
                  maxLength={160}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{form.metaDescription.length}/160</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">
            {/* Publish settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="font-semibold text-gray-700 text-sm">Xuất bản</h2>

              {/* Status toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  {form.isPublished ? <Eye size={14} className="text-green-600" /> : <EyeOff size={14} className="text-gray-400" />}
                  {form.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                </div>
                <div
                  onClick={() => setField('isPublished', !form.isPublished)}
                  className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${form.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-4' : ''}`} />
                </div>
              </label>

              {/* Featured toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Star size={14} className={form.isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'} />
                  Bài viết nổi bật
                </div>
                <div
                  onClick={() => setField('isFeatured', !form.isFeatured)}
                  className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${form.isFeatured ? 'bg-yellow-400' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured ? 'translate-x-4' : ''}`} />
                </div>
              </label>

              {/* PublishedAt */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hẹn giờ đăng</label>
                <input
                  type="datetime-local"
                  className="input-field text-sm py-2"
                  value={form.publishedAt}
                  onChange={(e) => setField('publishedAt', e.target.value)}
                />
                <p className="text-[11px] text-gray-400 mt-1">Để trống = đăng ngay khi bật xuất bản</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save size={15} />
                  )}
                  {loading ? 'Đang lưu...' : isNew ? 'Tạo bài viết' : 'Lưu thay đổi'}
                </button>
                <Link
                  href="/admin/posts"
                  className="w-full text-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </Link>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <select
                className="input-field text-sm py-2"
                value={form.categoryId}
                onChange={(e) => setField('categoryId', e.target.value)}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>

              {/* Tag chips */}
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100"
                    >
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tag input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input-field text-sm py-2 flex-1"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Nhập tag, nhấn Enter"
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  className="p-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-100"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Nhập tag rồi nhấn Enter hoặc dấu phẩy</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
