'use client';

import Link from 'next/link';
import { useState } from 'react';
<<<<<<< HEAD
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
=======
import { Menu, X, Phone, ShoppingCart } from 'lucide-react';
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Tin tức', href: '/tin-tuc' },
<<<<<<< HEAD
=======
  { label: 'Giới thiệu', href: '/#gioi-thieu' },
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
  { label: 'Liên hệ', href: '/lien-he' },
];

export default function Navbar({ config }: { config?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
<<<<<<< HEAD
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href || (pathname === '/' && href === '/')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm relative">

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/vitechs.png" alt="VITECHS Logo" className="h-10 w-auto object-contain" />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-primary-600 text-[22px] tracking-tight">
              VITECHS., JSC
            </span>
          </Link>

          {/* Các chức năng */}
          <div className="flex items-center gap-8">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
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

            {/* CTA Button */}
            <Link href="/lien-he"
              className="hidden md:inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded shadow-glow-blue hover:opacity-90 transition-opacity"
              style={{ background: '#2563EB' }}>
              <Phone size={16} />
              Liên Hệ Mua Hàng
            </Link>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-gray-700" onClick={() => setOpen(!open)}>
=======

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Phone size={12} />
            {config?.contact_phone || '024.6682.8899'}
          </span>
          <span>{config?.contact_hours || 'Từ 8h–20h hàng ngày'}</span>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-700 rounded flex items-center justify-center text-white font-bold text-lg">V</div>
            <div>
              <p className="font-bold text-primary-700 leading-tight text-sm">VITECHS., JSC</p>
              <p className="text-gray-500 text-xs leading-tight">Thiết bị đào tạo dạy nghề</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-700 transition">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/lien-he"
              className="hidden md:inline-flex items-center gap-2 bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-800 transition">
              Liên hệ ngay
            </Link>
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
<<<<<<< HEAD
              className="text-sm font-medium text-gray-700 py-2 border-b border-gray-100 last:border-0"
              onClick={(e) => handleNavClick(e, l.href)}>
=======
              className="text-sm font-medium text-gray-700 py-2 border-b last:border-0"
              onClick={() => setOpen(false)}>
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
              {l.label}
            </Link>
          ))}
          <Link href="/lien-he"
<<<<<<< HEAD
            className="text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-1"
            style={{ background: 'linear-gradient(90deg, #164DBC 0%, #7c3aed 100%)' }}
            onClick={() => setOpen(false)}>
            Liên hệ mua hàng
=======
            className="bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center"
            onClick={() => setOpen(false)}>
            Liên hệ ngay
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
          </Link>
        </div>
      )}
    </header>
  );
}
