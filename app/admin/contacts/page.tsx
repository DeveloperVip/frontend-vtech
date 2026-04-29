'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminDelete } from '@/services/adminService';
import { Trash2, RefreshCw, Mail } from 'lucide-react';

interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  read: 'bg-blue-100 text-blue-700',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý',
  read: 'Đã đọc',
  replied: 'Đã trả lời',
  archived: 'Lưu trữ',
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminGet('/contacts?limit=20&page=1');
      setContacts(res.data || []);
      setTotal(res.pagination?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa liên hệ này?')) return;
    await adminDelete(`/contacts/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý liên hệ ({total})</h1>
        <button
          id="admin-contacts-refresh"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-gray-400' : 'text-gray-600'} />
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-16 text-center text-gray-400">Đang tải liên hệ...</div>
      ) : contacts.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-16 text-center text-gray-400">
          <Mail size={40} className="mx-auto mb-2 text-gray-300" />
          Chưa có liên hệ nào
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {contacts.map((c) => (
              <div key={c.id} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{c.fullName}</p>
                    <p className="truncate text-xs text-gray-500">{c.email}</p>
                    <p className="mt-1 text-xs text-gray-500">{c.phone}</p>
                  </div>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[c.status]}`}>
                    {statusLabels[c.status] || c.status}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-700">{c.subject}</p>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</p>
                  <button
                    id={`admin-contact-delete-mobile-${c.id}`}
                    onClick={() => handleDelete(c.id)}
                    className="rounded-lg p-1.5 text-primary-600 transition hover:bg-primary-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Họ tên</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Chủ đề</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-left">Ngày</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.fullName}</td>
                      <td className="px-4 py-3 text-gray-500">{c.email}</td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-gray-600">{c.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.status]}`}>
                          {statusLabels[c.status] || c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          id={`admin-contact-delete-${c.id}`}
                          onClick={() => handleDelete(c.id)}
                          className="rounded p-1.5 text-gray-400 transition hover:text-primary-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
