'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Liên hệ', href: '/lien-he' },
];

export default function Navbar({ config }: { config?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
