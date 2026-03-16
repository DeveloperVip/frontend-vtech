'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Phone, ShoppingCart } from 'lucide-react';

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Giới thiệu', href: '/#gioi-thieu' },
  { label: 'Liên hệ', href: '/lien-he' },
];

export default function Navbar({ config }: { config?: Record<string, string> }) {
  const [open, setOpen] = useState(false);

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
              className="text-sm font-medium text-gray-700 py-2 border-b last:border-0"
              onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/lien-he"
            className="bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center"
            onClick={() => setOpen(false)}>
            Liên hệ ngay
          </Link>
        </div>
      )}
    </header>
  );
}
