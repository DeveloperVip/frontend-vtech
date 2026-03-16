'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminDelete } from '@/services/adminService';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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

  const load = () => {
    adminGet('/contacts?limit=20&page=1').then((res) => {
      setContacts(res.data || []);
      setTotal(res.pagination?.total || 0);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa liên hệ này?')) return;
    await adminDelete(`/contacts/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý liên hệ ({total})</h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
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
                <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{c.subject}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                    {statusLabels[c.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 rounded transition">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400">Chưa có liên hệ nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
