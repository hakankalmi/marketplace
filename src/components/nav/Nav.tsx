'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, ShoppingBag, Sparkles, LogOut, ChevronRight } from 'lucide-react';
import { useBrand } from '@/lib/brand/context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { isAuthenticated, getStoredAuth, clearAuth } from '@/lib/api/auth';

export function Nav() {
  const theme = useBrand();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setLoggedIn(auth);
    if (auth) {
      const stored = getStoredAuth();
      setCustomerName(stored.name);
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    setCustomerName(null);
    setShowUserMenu(false);
    window.location.href = '/';
  };

  const navLinks = [
    { label: 'Anasayfa', href: '/' },
    { label: 'Halı Yıkama', href: '/turkiye/hali-yikama' },
    { label: 'Koltuk Yıkama', href: '/turkiye/koltuk-yikama' },
    { label: 'Yorgan Yıkama', href: '/turkiye/yorgan-yikama' },
    { label: 'Perde Yıkama', href: '/turkiye/perde-yikama' },
    { label: 'Yatak Yıkama', href: '/turkiye/yatak-yikama' },
    { label: 'Rehber', href: '/rehber' },
  ];

  const isSolid = theme.navVariant === 'solid';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isSolid && 'bg-brand-primary text-white shadow-md',
          !isSolid && 'bg-brand-bg/95 backdrop-blur-md border-b border-brand-border shadow-sm'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div
                className={cn(
                  'w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105',
                  isSolid
                    ? 'bg-white/20 text-white'
                    : 'bg-brand-primary text-white'
                )}
              >
                <Sparkles size={18} />
              </div>
              <span
                className={cn(
                  'text-base lg:text-lg font-heading font-bold tracking-tight',
                  isSolid ? 'text-white' : 'text-brand-text'
                )}
              >
                {theme.name}
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-brand text-sm font-medium transition-colors',
                    isSolid
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Desktop only: ShoppingBag + User */}
              <Link
                href="/hesabim/siparislerim"
                className={cn(
                  'hidden lg:flex p-2 rounded-brand transition-colors',
                  isSolid
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface'
                )}
              >
                <ShoppingBag size={20} />
              </Link>

              {/* Desktop: User menu */}
              {loggedIn ? (
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-brand text-sm font-medium transition-colors',
                      isSolid
                        ? 'text-white hover:bg-white/10'
                        : 'text-brand-text hover:bg-brand-surface'
                    )}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                      isSolid
                        ? 'bg-white/20 text-white'
                        : 'bg-brand-primary/10 text-brand-primary'
                    )}>
                      {customerName ? customerName[0].toUpperCase() : <User size={14} />}
                    </div>
                    <span className="max-w-[120px] truncate">
                      {customerName || 'Hesabım'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-2">
                        {customerName && (
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">{customerName}</p>
                            <p className="text-xs text-gray-500">Hoş geldiniz</p>
                          </div>
                        )}
                        <Link
                          href="/hesabim"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User size={16} className="text-gray-400" />
                          Hesabım
                        </Link>
                        <Link
                          href="/hesabim/siparislerim"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <ShoppingBag size={16} className="text-gray-400" />
                          Siparişlerim
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} />
                            Çıkış Yap
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/giris" className="hidden lg:block">
                  <Button
                    variant={isSolid ? 'secondary' : 'primary'}
                    size="sm"
                  >
                    <User size={16} />
                    Giriş Yap
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  'lg:hidden p-2 rounded-brand transition-colors',
                  isSolid
                    ? 'text-white/80 hover:text-white'
                    : 'text-brand-text-muted hover:text-brand-text'
                )}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile fullscreen menu overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-x-0 top-14 bottom-0 z-50 bg-white lg:hidden overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
                Hizmetler
              </p>
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-3.5 rounded-xl text-base font-medium text-gray-800 active:bg-gray-100 transition-colors"
                >
                  {link.label}
                  <ChevronRight size={18} className="text-gray-300" />
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 mx-4" />

            <div className="px-4 py-4 space-y-1">
              {loggedIn ? (
                <>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
                    Hesap
                  </p>
                  <Link
                    href="/hesabim"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-medium text-gray-800 active:bg-gray-100 transition-colors"
                  >
                    <User size={20} className="text-gray-400" />
                    Profil
                  </Link>
                  <Link
                    href="/hesabim/siparislerim"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-medium text-gray-800 active:bg-gray-100 transition-colors"
                  >
                    <ShoppingBag size={20} className="text-gray-400" />
                    Siparişlerim
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3.5 rounded-xl text-base font-medium text-red-500 active:bg-red-50 transition-colors"
                  >
                    <LogOut size={20} />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <Link
                  href="/giris"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-primary text-white font-medium text-base active:opacity-90 transition-opacity"
                >
                  <User size={18} />
                  Giriş Yap / Kayıt Ol
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
