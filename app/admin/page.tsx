'use client';

import { useEffect, useState } from 'react';
import { adminGet } from '@/services/adminService';
import { 
  Package, 
  MessageSquare, 
  FileText, 
  FolderOpen, 
  Users, 
  Heart, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Settings, 
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Box
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export default function AdminDashboard() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminGet('/admin/stats');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Lỗi lấy thống kê:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // Poll mỗi 30s để cập nhật số liệu
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const mainStats = [
    { label: 'Sản phẩm', value: data?.counts.products ?? 0, icon: <Package size={20} />, color: 'from-blue-600 to-blue-400', href: '/admin/products' },
    { label: 'Yêu thích', value: data?.counts.likes ?? 0, icon: <Heart size={20} />, color: 'from-rose-600 to-rose-400', href: '/admin/products' },
    { label: 'Thành viên', value: data?.counts.users ?? 0, icon: <Users size={20} />, color: 'from-indigo-600 to-indigo-400', href: '/admin/users' },
    { label: 'Bài viết', value: data?.counts.posts ?? 0, icon: <FileText size={20} />, color: 'from-emerald-600 to-emerald-400', href: '/admin/posts' },
  ];

  const interactions = [
    { label: 'Liên hệ mới', value: data?.counts.unreadContacts ?? 0, icon: <MessageSquare size={18} />, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/contacts' },
    { label: 'Chat đang chờ', value: data?.counts.waitingChats ?? 0, icon: <Zap size={18} />, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/chats' },
  ];

  const aiSummary = [
    { label: 'Thành công', value: data?.aiStats.succeeded ?? 0, icon: <CheckCircle2 size={16} />, color: 'text-emerald-600' },
    { label: 'Đang xử lý', value: data?.aiStats.processing ?? 0, icon: <Clock size={16} />, color: 'text-blue-600' },
    { label: 'Thất bại', value: data?.aiStats.failed ?? 0, icon: <AlertCircle size={16} />, color: 'text-rose-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hệ thống Quản trị</h1>
          <p className="text-gray-500 mt-1">Chào mừng bạn trở lại! Đây là cái nhìn tổng quan về hệ thống hôm nay.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          <Clock size={14} />
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Link href={stat.href} className="group block bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-primary-600 group-hover:bg-primary-50 transition-colors">
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Secondary Row: Interactions & AI Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactions & Shortcuts */}
        <div className="lg:col-span-1 space-y-8">
          {/* Urgent Interactions */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary-600" />
              Tương tác cần xử lý
            </h2>
            <div className="space-y-4">
              {interactions.map((item, idx) => (
                <Link key={idx} href={item.href} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400">Yêu cầu mới từ khách hàng</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${item.bg} ${item.color} text-xs font-black`}>
                    {item.value}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl shadow-gray-200">
            <h2 className="text-lg font-bold mb-5">Truy cập nhanh</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/products/new" className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition text-center group">
                <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                <span className="text-xs font-semibold">Thêm Sản phẩm</span>
              </Link>
              <Link href="/admin/chats" className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition text-center">
                <MessageSquare size={24} />
                <span className="text-xs font-semibold">Tư vấn Chat</span>
              </Link>
              <Link href="/admin/settings" className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition text-center">
                <Settings size={24} />
                <span className="text-xs font-semibold">Cấu hình</span>
              </Link>
              <Link href="/" target="_blank" className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition text-center">
                <ExternalLink size={24} />
                <span className="text-xs font-semibold">Xem Website</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column: AI Model Tracker */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center">
                    <Box size={24} />
                  </div>
                  Trạng thái AI 3D Model
                </h2>
                <p className="text-sm text-gray-400 mt-1">Giám sát các tác vụ tạo mô hình tự động bằng Hunyuan3D-2.1</p>
              </div>
              <div className="flex gap-4">
                {aiSummary.map((sum, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg flex-col md:flex-row text-center md:text-left">
                    <span className={sum.color}>{sum.icon}</span>
                    <span className="text-xs font-bold text-gray-700">{sum.value}</span>
                    <span className="text-[10px] text-gray-400 uppercase hidden md:inline">{sum.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Tác vụ vừa thực hiện</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase">
                      <th className="pb-4 font-bold">Sản phẩm</th>
                      <th className="pb-4 font-bold">Trạng thái</th>
                      <th className="pb-4 font-bold text-right">Cập nhật</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.recentTasks?.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-10 text-center text-gray-400 italic">Chưa có tác vụ tạo 3D nào</td>
                      </tr>
                    ) : (
                      data?.recentTasks.map((task) => (
                        <tr key={task.id} className="group">
                          <td className="py-4">
                            <Link href={`/admin/products/${task.productId}`} className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-50">
                                {task.thumbnail ? (
                                  <img src={task.thumbnail} alt={task.productName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Package size={20} />
                                  </div>
                                )}
                              </div>
                              <span className="text-sm font-bold text-gray-800 group-hover:text-primary-600 transition-colors uppercase truncate max-w-[150px] md:max-w-[250px]">
                                {task.productName}
                              </span>
                            </Link>
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${
                              task.status === 'succeeded' ? 'bg-emerald-50 text-emerald-600' :
                              task.status === 'failed' ? 'bg-rose-50 text-rose-600' :
                              'bg-blue-50 text-blue-600 animate-pulse'
                            }`}>
                              {task.status === 'succeeded' && <CheckCircle2 size={12} />}
                              {task.status === 'failed' && <AlertCircle size={12} />}
                              {task.status === 'processing' && <Clock size={12} />}
                              {task.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-xs text-gray-500 font-medium">
                              {new Date(task.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pt-4 mt-auto">
                <Link href="/admin/products" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-2 group">
                  Xem tất cả sản phẩm
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
