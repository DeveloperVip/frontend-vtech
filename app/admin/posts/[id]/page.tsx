'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminGet, adminPost, adminPut } from '@/services/adminService';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CKEditorField = dynamic(() => import('@/components/ui/CKEditorField'), { ssr: false });

interface Form {
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
}

export default function PostFormPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState<Form>({
    title: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    isPublished: false,
    metaTitle: '',
    metaDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      adminGet(`/posts/${params.id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            title: p.title || '',
            excerpt: p.excerpt || '',
            content: p.content || '',
            thumbnail: p.thumbnail || '',
            isPublished: p.isPublished || false,
            metaTitle: p.metaTitle || '',
            metaDescription: p.metaDescription || '',
          });
        })
        .catch(() => toast.error('Không thể tải bài viết'))
        .finally(() => setFetching(false));
    }
  }, []);

  const f = (field: keyof Form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    setLoading(true);
    try {
      if (isNew) {
        await adminPost('/posts', form);
        toast.success('Đã tạo bài viết');
      } else {
        await adminPut(`/posts/${params.id}`, form);
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
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {isNew ? 'Thêm bài viết' : 'Chỉnh sửa bài viết'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Main content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => f('title', e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.excerpt}
              onChange={(e) => f('excerpt', e.target.value)}
              placeholder="Mô tả ngắn hiển thị ở trang danh sách..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <CKEditorField
              value={form.content}
              onChange={(val) => f('content', val)}
              placeholder="Nhập nội dung bài viết..."
            />
          </div>

          <ImageUpload
            label="Ảnh đại diện"
            value={form.thumbnail}
            onChange={(url) => f('thumbnail', url)}
          />
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700 text-sm">Cài đặt & SEO</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => f('isPublished', !form.isPublished)}
              className={`relative w-10 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-primary-700' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-sm text-gray-700">
              {form.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
            </span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              className="input-field"
              value={form.metaTitle}
              onChange={(e) => f('metaTitle', e.target.value)}
              placeholder="Tiêu đề SEO (để trống = dùng tiêu đề bài viết)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.metaDescription}
              onChange={(e) => f('metaDescription', e.target.value)}
              placeholder="Mô tả SEO..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60">
            {loading
              ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              : <Save size={15} />}
            {loading ? 'Đang lưu...' : isNew ? 'Tạo bài viết' : 'Lưu thay đổi'}
          </button>
          <Link
            href="/admin/posts"
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
