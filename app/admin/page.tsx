'use client';

import { useEffect, useState } from 'react';
import { adminGet } from '@/services/adminService';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Package,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface AIRecentTask {
  id: number;
  productId: number;
  productName: string;
  thumbnail: string | null;
  status: 'none' | 'pending' | 'processing' | 'succeeded' | 'failed';
  updatedAt: string;
}

interface StatsData {
  counts: {
    products: number;
    categories: number;
    posts: number;
    contacts: number;
    unreadContacts: number;
    users: number;
    likes: number;
    waitingChats: number;
  };
  aiStats: {
    none: number;
    pending: number;
    processing: number;
    succeeded: number;
    failed: number;
  };
  recentTasks: AIRecentTask[];
}

const formatDate = () => new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const statusMeta: Record<AIRecentTask['status'], { label: string; className: string; icon: React.ReactNode }> = {
  succeeded: { label: 'Thành công', className: 'bg-emerald-50 text-emerald-700 ring-emerald-100', icon: <CheckCircle2 size={12} /> },
  failed: { label: 'Thất bại', className: 'bg-rose-50 text-rose-700 ring-rose-100', icon: <AlertCircle size={12} /> },
  processing: { label: 'Đang xử lý', className: 'bg-indigo-50 text-indigo-700 ring-indigo-100', icon: <Clock size={12} /> },
  pending: { label: 'Chờ xử lý', className: 'bg-amber-50 text-amber-700 ring-amber-100', icon: <Clock size={12} /> },
  none: { label: 'Chưa tạo', className: 'bg-slate-50 text-slate-500 ring-slate-100', icon: <Clock size={12} /> },
};

export default function AdminDashboard() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminGet('/admin/stats');
        if (res.success) setData(res.data);
      } catch (err) {
        console.error('Lỗi lấy thống kê:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const customerTotal = (data?.counts.users ?? 0) + (data?.counts.contacts ?? 0) + (data?.counts.waitingChats ?? 0) + (data?.counts.likes ?? 0);
  const activeCustomerRate = customerTotal ? Math.round(((data?.counts.users ?? 0) / customerTotal) * 100) : 0;
  const needsAttention = (data?.counts.unreadContacts || 0) + (data?.counts.waitingChats || 0);

  const overviewStats = [
    { label: 'Sản phẩm', value: data?.counts.products ?? 0, icon: <Package size={18} />, href: '/admin/products', sub: `${data?.counts.categories ?? 0} danh mục` },
    { label: 'Thành viên', value: data?.counts.users ?? 0, icon: <Users size={18} />, href: '/admin/users', sub: `${data?.counts.likes ?? 0} lượt yêu thích` },
    { label: 'Bài viết', value: data?.counts.posts ?? 0, icon: <FileText size={18} />, href: '/admin/posts', sub: 'Nội dung website' },
    { label: 'Liên hệ', value: data?.counts.contacts ?? 0, icon: <MessageSquare size={18} />, href: '/admin/contacts', sub: `${data?.counts.unreadContacts ?? 0} chưa xử lý` },
  ];

  const contentChart = [
    { label: 'Sản phẩm', value: data?.counts.products ?? 0, color: 'bg-indigo-500' },
    { label: 'Danh mục', value: data?.counts.categories ?? 0, color: 'bg-sky-500' },
    { label: 'Bài viết', value: data?.counts.posts ?? 0, color: 'bg-emerald-500' },
    { label: 'Liên hệ', value: data?.counts.contacts ?? 0, color: 'bg-amber-500' },
  ];

  const customerChart = [
    { label: 'Thành viên', value: data?.counts.users ?? 0, color: 'bg-indigo-500', href: '/admin/users' },
    { label: 'Liên hệ', value: data?.counts.contacts ?? 0, color: 'bg-amber-500', href: '/admin/contacts' },
    { label: 'Chat chờ', value: data?.counts.waitingChats ?? 0, color: 'bg-sky-500', href: '/admin/chats' },
    { label: 'Yêu thích', value: data?.counts.likes ?? 0, color: 'bg-rose-500', href: '/admin/users' },
  ];

  const maxContentValue = Math.max(...contentChart.map((item) => item.value), 1);
  const maxCustomerValue = Math.max(...customerChart.map((item) => item.value), 1);

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[18px] border border-slate-200 bg-white px-5 py-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 inline-flex items-center border-b-2 border-indigo-600 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Tổng quan hệ thống
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Dashboard</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Theo dõi các chỉ số vận hành chính của website.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-500">
              <Clock size={14} />
              {formatDate()}
            </div>
            <div className={`inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold ring-1 ${needsAttention > 0 ? 'bg-amber-50 text-amber-700 ring-amber-100' : 'bg-emerald-50 text-emerald-700 ring-emerald-100'}`}>
              {needsAttention > 0 ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              {needsAttention > 0 ? `${needsAttention} việc cần xử lý` : 'Ổn định'}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_18px_42px_rgba(79,70,229,0.10)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                {stat.icon}
              </div>
              <ArrowRight size={15} className="mt-1 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{stat.label}</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-950">{stat.value}</p>
              <p className="pb-1 text-xs font-medium text-slate-500">{stat.sub}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-950">Phân bổ dữ liệu</h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Tổng quan các nhóm dữ liệu đang quản lý.</p>
            </div>
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold tabular-nums text-indigo-700 ring-1 ring-indigo-100">
              {(data?.counts.products ?? 0) + (data?.counts.categories ?? 0) + (data?.counts.posts ?? 0) + (data?.counts.contacts ?? 0)}
            </span>
          </div>

          <div className="space-y-4">
            {contentChart.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="tabular-nums text-slate-900">{item.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.max(6, (item.value / maxContentValue) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-950">Khách hàng</h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Tổng quan thành viên, liên hệ và nhu cầu hỗ trợ.</p>
            </div>
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold tabular-nums text-indigo-700 ring-1 ring-indigo-100">{activeCustomerRate}%</span>
          </div>

          <div className="mb-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
            {customerChart.map((item) => (
              <div key={item.label} className={item.color} style={{ width: `${customerTotal ? (item.value / customerTotal) * 100 : 0}%` }} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {customerChart.map((item) => (
              <Link key={item.label} href={item.href} className="group rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-indigo-100 hover:bg-white hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                  </div>
                  <ArrowRight size={13} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums text-slate-950">{item.value}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.max(6, (item.value / maxCustomerValue) * 100)}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
