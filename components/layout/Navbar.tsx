'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Heart, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useUserAuthStore } from '@/hooks/useUserAuthStore';
import { applyHeartEffect } from '@/ultilites/animations';
import { animate, splitText, stagger } from 'animejs';

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Liên hệ', href: '/lien-he' },
];

export default function Navbar({ config: _config }: { config?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const textRef = useRef<HTMLSpanElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 });

  const activeHref = useMemo(() => {
    const found = navLinks.find((l) => pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href)));
    return found?.href || '/';
  }, [pathname]);

  const { user, isAuthenticated, logout } = useUserAuthStore();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href || (pathname === '/' && href === '/')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setOpen(false);
  };

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const splitter = splitText(el, { chars: true });
    splitter.chars.forEach((c) => {
      c.style.background = 'linear-gradient(90deg,#7c3aed,#2563eb,#06b6d4)';
      c.style.backgroundSize = '200% 200%';
      c.style.webkitBackgroundClip = 'text';
      c.style.color = 'transparent';
      c.style.display = 'inline-block';
    });

    const anim = animate(splitter.chars, {
      y: [
        { to: '-0.35rem', ease: 'outQuad', duration: 260 },
        { to: '0rem', ease: 'outQuad', duration: 260, delay: 60 },
      ],
      delay: stagger(45),
      loop: true,
      loopDelay: 1200,
    });

    return () => {
      anim.pause();
      splitter.revert();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const attach = () => {
      applyHeartEffect('.navbar-cta-heart', {
        count: 14,
        duration: 980,
        size: 10,
        burstOnInit: true,
        overflowHidden: false,
      });

      applyHeartEffect('.navbar-tab-fx', {
        count: 6,
        duration: 760,
        size: 6,
        overflowHidden: false,
      });
    };

    attach();
    const t = window.setTimeout(attach, 0);
    return () => window.clearTimeout(t);
  }, [open]); // bind lại khi menu mobile render/unrender

  const handleMobileToggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const update = () => {
      const active = nav.querySelector<HTMLElement>(`[data-nav-item="${activeHref}"]`);
      if (!active) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      setIndicatorStyle({
        left: active.offsetLeft,
        width: active.offsetWidth,
        opacity: 1,
      });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [activeHref]);

  const handleNavMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const item = target.closest<HTMLElement>('[data-nav-item]');
    if (!item) return;

    setIndicatorStyle({
      left: item.offsetLeft,
      width: item.offsetWidth,
      opacity: 1,
    });
  };

  const handleNavMouseLeave = () => {
    const nav = navRef.current;
    if (!nav) return;

    const active = nav.querySelector<HTMLElement>(`[data-nav-item="${activeHref}"]`);
    if (!active) return;

    setIndicatorStyle({
      left: active.offsetLeft,
      width: active.offsetWidth,
      opacity: 1,
    });
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white relative"
      style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
    >
      <div className="max-w-[1440px] mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <img src="/vitechs.png" alt="VITECHS Logo" className="h-10 w-auto object-contain" />
            <span
              ref={textRef}
              className="font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,#7c3aed_0%,#2563eb_45%,#06b6d4_100%)] bg-[length:200%_200%] text-[22px] tracking-tight decoration-none"
            >
              VITECHS., JSC
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <nav
              ref={navRef}
              onMouseMove={handleNavMouseMove}
              onMouseLeave={handleNavMouseLeave}
              className="hidden xl:flex items-center gap-2 relative"
            >
              <span
                className="absolute bottom-[-4px] h-[2px] bg-primary-600 rounded-full transition-all duration-300 ease-out"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                }}
              />

              {navLinks.map((l) => {
                const isActive = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    data-nav-item={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className={`navbar-tab-fx text-[15px] font-medium transition-all duration-300 ease-out relative py-2 px-3 rounded-md hover:tracking-[0.01em] hover:scale-[1.04] ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/40'}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:ml-4 md:flex md:items-center relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm border border-primary-100">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user?.name || 'Thành viên'}</span>
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
                        <Link
                          href="/yeu-thich"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Heart size={18} className="text-red-400" />
                          Sản phẩm yêu thích
                        </Link>
                        <Link
                          href="/thong-tin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings size={18} className="text-gray-400" />
                          Cài đặt tài khoản
                        </Link>
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
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
                    <Link href="/login" className="navbar-cta-heart text-sm font-bold text-gray-600 hover:text-primary-600 px-4 py-2 transition-colors">
                      Đăng nhập
                    </Link>
                    <Link href="/register" className="navbar-cta-heart text-sm font-bold text-white bg-gray-900 hover:bg-black px-5 py-2 rounded-lg transition-all shadow-md">
                      Tham gia
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/lien-he"
                className="navbar-cta-heart hidden md:inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded shadow-glow-blue hover:opacity-90 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 ease-out whitespace-nowrap"
                style={{ background: '#2563EB' }}
              >
                <Phone size={16} />
                Liên Hệ Mua Hàng
              </Link>

              <button className="xl:hidden p-2 text-gray-700" onClick={handleMobileToggle}>
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="navbar-tab-fx text-sm font-medium text-gray-700 py-2 border-b border-gray-100 last:border-0"
              onClick={(e) => handleNavClick(e, l.href)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/lien-he"
            className="navbar-cta-heart text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-1"
            style={{ background: 'linear-gradient(90deg, #164DBC 0%, #7c3aed 100%)' }}
            onClick={() => setOpen(false)}
          >
            Liên hệ mua hàng
          </Link>
        </div>
      )}
    </header>
  );
}
