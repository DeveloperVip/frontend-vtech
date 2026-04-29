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
    } catch {
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
    } catch {
      toast.error('Lỗi khi xóa');
    }
  };

  const handleToggle = async (review: Review) => {
    try {
      const { adminPut } = await import('@/services/adminService');
      const newValue = !review.isActive;
      await adminPut(`/product-reviews/${review.id}`, { isActive: newValue });
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, isActive: newValue } : r)));
      toast.success('Đã cập nhật trạng thái');
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="mb-2 text-2xl font-bold text-gray-800">Quản lý Đánh giá</h1>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center font-medium text-gray-400">Đang tải...</div>
        ) : reviews.length === 0 ? (
          <div className="px-6 py-12 text-center font-medium text-gray-400">Chưa có đánh giá nào</div>
        ) : (
          <>
            <div className="space-y-3 p-3 md:hidden">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-gray-100 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{r.userName}</p>
                      <p className="truncate text-xs text-gray-500">{r.email}</p>
                    </div>
                    <span
                      id={`admin-review-status-mobile-${r.id}`}
                      onClick={() => handleToggle(r)}
                      className={`inline-block cursor-pointer select-none rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {r.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </div>

                  <Link
                    href={`/san-pham/${r.Product?.slug}`}
                    target="_blank"
                    className="mt-2 inline-flex max-w-full items-center gap-1 truncate text-xs text-primary-700 hover:underline"
                  >
                    {r.Product?.name} <ExternalLink size={12} />
                  </Link>

                  <div className="mt-2 flex items-center gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'fill-current' : 'text-gray-200'} />
                    ))}
                  </div>

                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">{r.content}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>
                    <button
                      id={`admin-review-delete-mobile-${r.id}`}
                      onClick={() => handleDelete(r.id)}
                      className="rounded-lg p-1.5 text-primary-600 transition-colors hover:bg-primary-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Khách hàng</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Sản phẩm</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Đánh giá</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Nội dung</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Trạng thái</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase text-gray-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{r.userName}</div>
                        <div className="text-xs text-gray-500">{r.email}</div>
                        <div className="mt-1 text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/san-pham/${r.Product?.slug}`}
                          target="_blank"
                          className="flex items-center gap-1 text-sm text-primary-700 hover:underline"
                        >
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
                        <p className="line-clamp-2 max-w-xs text-sm text-gray-600">{r.content}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          id={`admin-review-status-${r.id}`}
                          onClick={() => handleToggle(r)}
                          className={`inline-block w-24 cursor-pointer select-none rounded-full px-2 py-0.5 text-center text-xs font-medium transition-all hover:opacity-80 ${
                            r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          {r.isActive ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          id={`admin-review-delete-${r.id}`}
                          onClick={() => handleDelete(r.id)}
                          className="rounded-lg p-2 text-primary-600 transition-colors hover:bg-primary-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              id={`admin-review-page-${i + 1}`}
              onClick={() => fetchReviews(i + 1)}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
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
