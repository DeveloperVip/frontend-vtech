'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminGet, adminPatch } from '@/services/adminService';
import { Search, RefreshCw, ShieldCheck, ShieldOff, Users as UsersIcon } from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface UsersResponse {
  success: boolean;
  data: UserItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const PAGE_SIZE = 12;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const load = async (targetPage = page) => {
    try {
      setLoading(true);
      const res = (await adminGet('/admin/users', {
        page: targetPage,
        limit: PAGE_SIZE,
        search: search || undefined,
        status,
      })) as UsersResponse;

      setUsers(res.data || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
      setPage(res.pagination?.page || targetPage);
    } catch (error) {
      console.error('Lỗi tải danh sách người dùng:', error);
      setUsers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status]);

  const handleToggleStatus = async (user: UserItem) => {
    try {
      setUpdatingId(user.id);
      await adminPatch(`/admin/users/${user.id}/status`, {});
      setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, isActive: !item.isActive } : item)));
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái user:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const stats = useMemo(() => {
    const active = users.filter((u) => u.isActive).length;
    const inactive = users.length - active;
    return { active, inactive };
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon size={24} className="text-primary-700" />
            Quản lý người dùng
          </h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi tài khoản đã đăng ký và bật/tắt trạng thái hoạt động.</p>
        </div>
        <button
          onClick={() => load(page)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <RefreshCw size={15} />
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400">Tổng user</p>
          <p className="mt-2 text-2xl font-black text-gray-900">{total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-emerald-600">Đang hoạt động</p>
          <p className="mt-2 text-2xl font-black text-emerald-700">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-rose-600">Tạm khóa</p>
          <p className="mt-2 text-2xl font-black text-rose-700">{stats.inactive}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="admin-users-search"
              type="text"
              placeholder="Tìm theo tên, username, email, số điện thoại..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-primary-400"
            />
          </div>

          <select
            id="admin-users-status-filter"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as 'all' | 'active' | 'inactive');
              setPage(1);
            }}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-primary-400"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm khóa</option>
          </select>

          <div className="text-xs text-gray-500 text-right">Trang {page}/{totalPages}</div>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center text-gray-400">Đang tải dữ liệu...</div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center text-gray-400">Không có người dùng phù hợp</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                  <p className="mt-1 text-[11px] text-gray-500">ID #{user.id}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {user.isActive ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
                  {user.isActive ? 'Đang hoạt động' : 'Tạm khóa'}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p className="truncate text-gray-800">{user.email}</p>
                <p className="text-xs text-gray-500">{user.phone || 'Chưa cập nhật số điện thoại'}</p>
                <p className="text-xs text-gray-500">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('vi-VN') : 'Chưa từng đăng nhập'}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  id={`admin-user-toggle-mobile-${user.id}`}
                  disabled={updatingId === user.id}
                  onClick={() => handleToggleStatus(user)}
                  className={`inline-flex min-w-[124px] items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    user.isActive
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {updatingId === user.id ? 'Đang xử lý...' : user.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Người dùng</th>
                <th className="px-4 py-3 text-left">Liên hệ</th>
                <th className="px-4 py-3 text-left">Lần đăng nhập cuối</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-gray-400">Đang tải dữ liệu...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-gray-400">Không có người dùng phù hợp</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500">@{user.username}</span>
                        <span className="mt-1 inline-flex w-fit rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          ID #{user.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-0.5">
                        <p className="text-gray-800">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone || 'Chưa cập nhật số điện thoại'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-gray-600">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('vi-VN') : 'Chưa từng đăng nhập'}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {user.isActive ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
                        {user.isActive ? 'Đang hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <button
                        id={`admin-user-toggle-${user.id}`}
                        disabled={updatingId === user.id}
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex min-w-[124px] items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          user.isActive
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {updatingId === user.id ? 'Đang xử lý...' : user.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">Hiển thị tối đa {PAGE_SIZE} user mỗi trang</p>
          <div className="flex items-center gap-2">
            <button
              id="admin-users-prev-page"
              disabled={!canPrev}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>
            <button
              id="admin-users-next-page"
              disabled={!canNext}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
