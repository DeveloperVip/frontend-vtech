'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminDelete } from '@/services/adminService';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Review {
  id: number;
  userName: string;
  email: string;
  rating: number;
  content: string;
  createdAt: string;
  isActive: boolean;
  Product: {
    id: number;
    name: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminGet(`/product-reviews?page=${page}&limit=10`);
      setReviews(res.data || []);
      setPagination(res.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      toast.error('Lỗi lấy danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await adminDelete(`/product-reviews/${id}`);
      toast.success('Đã xóa đánh giá');
      fetchReviews(pagination.page);
    } catch (err) {
      toast.error('Lỗi khi xóa');
    }
  };

  const handleToggle = async (review: Review) => {
    try {
      const { adminPut } = await import('@/services/adminService');
      const newValue = !review.isActive;
      await adminPut(`/product-reviews/${review.id}`, { isActive: newValue });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, isActive: newValue } : r));
      toast.success('Đã cập nhật trạng thái');
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đánh giá</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Khách hàng</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Sản phẩm</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Đánh giá</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nội dung</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">Đang tải...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">Chưa có đánh giá nào</td></tr>
            ) : reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{r.userName}</div>
                  <div className="text-xs text-gray-500">{r.email}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</div>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/san-pham/${r.Product?.slug}`} target="_blank" className="text-sm text-primary-700 hover:underline flex items-center gap-1">
                    {r.Product?.name} <ExternalLink size={12} />
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'fill-current' : 'text-gray-200'} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{r.content}</p>
                </td>
                <td className="px-6 py-4">
                  <span 
                    onClick={() => handleToggle(r)}
                    className={`inline-block w-28 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer select-none transition-all hover:opacity-80 text-center ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 opacity-60'}`}>
                    {r.isActive ? 'Hiển thị' : 'Không hiển thị'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(r.id)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => fetchReviews(i + 1)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                pagination.page === i + 1 ? 'bg-primary-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
