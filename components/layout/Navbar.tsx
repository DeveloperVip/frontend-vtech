'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, User as UserIcon, Heart, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useUserAuthStore } from '@/hooks/useUserAuthStore';

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Liên hệ', href: '/lien-he' },
];

export default function Navbar({ config }: { config?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const { user, isAuthenticated, logout } = useUserAuthStore();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href || (pathname === '/' && href === '/')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-50 bg-white relative" 
      style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
    >

      {/* Main navbar */}
      <div className="max-w-[1440px] mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/vitechs.png" alt="VITECHS Logo" className="h-10 w-auto object-contain" />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-primary-600 text-[22px] tracking-tight decoration-none">
              VITECHS., JSC
            </span>
          </Link>

          {/* Các chức năng */}
          <div className="flex items-center gap-8">
            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((l) => {
                const isActive = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
                return (
                  <Link key={l.href} href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className={`text-[15px] font-medium transition-colors relative py-2 ${
                      isActive 
                        ? 'text-primary-600' 
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    {l.label}
                    {isActive && (
                      <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-primary-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              {/* User Menu */}
              <div className="hidden md:ml-4 md:flex md:items-center relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm border border-primary-100">
                         {user?.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[60] animate-in fade-in zoom-in duration-200"
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-xs text-gray-400 font-medium">Tài khoản thành viên</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                        </div>
                        <Link href="/yeu-thich" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Heart size={18} className="text-red-400" />
                          Sản phẩm yêu thích
                        </Link>
                        <Link href="/thong-tin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings size={18} className="text-gray-400" />
                          Cài đặt tài khoản
                        </Link>
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button 
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                          >
                            <LogOut size={18} className="text-gray-400" />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-primary-600 px-4 py-2 transition-colors">
                      Đăng nhập
                    </Link>
                    <Link href="/register" className="text-sm font-bold text-white bg-gray-900 hover:bg-black px-5 py-2 rounded-lg transition-all shadow-md">
                      Tham gia
                    </Link>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link href="/lien-he"
                className="hidden md:inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded shadow-glow-blue hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ background: '#2563EB' }}>
                <Phone size={16} />
                Liên Hệ Mua Hàng
              </Link>

              {/* Mobile Toggle */}
              <button className="xl:hidden p-2 text-gray-700" onClick={() => setOpen(!open)}>
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-sm font-medium text-gray-700 py-2 border-b border-gray-100 last:border-0"
              onClick={(e) => handleNavClick(e, l.href)}>
              {l.label}
            </Link>
          ))}
          <Link href="/lien-he"
            className="text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-1"
            style={{ background: 'linear-gradient(90deg, #164DBC 0%, #7c3aed 100%)' }}
            onClick={() => setOpen(false)}>
            Liên hệ mua hàng
          </Link>
        </div>
      )}
    </header>
  );
}
