'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuthStore } from '@/hooks/useUserAuthStore';
import { User, Phone, Mail, Lock, Camera, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, token, isAuthenticated, setUser } = useUserAuthStore();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [isAuthenticated, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        toast.success('Cập nhật thông tin thành công!');
      } else {
        toast.error(data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    
    setLoadingPassword(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('Đổi mật khẩu thành công!');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Cài đặt tài khoản</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="relative inline-block mx-auto mb-4">
              <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-3xl overflow-hidden shadow-inner">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
                <Camera size={16} className="text-gray-500" />
              </button>
            </div>
            <h2 className="font-bold text-lg text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">@{user?.username}</p>
            <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-500" />
              Thông tin cá nhân
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Họ và tên</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Số điện thoại</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400 mb-1 block">Email (Không thể thay đổi)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="text"
                      disabled
                      className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                      value={user?.email || ''}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingProfile ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock size={20} className="text-red-500" />
              Đổi mật khẩu
            </h3>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingPassword ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
