'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, ShoppingBag, Search, Sparkles } from 'lucide-react';
import { useBrand } from '@/lib/brand/context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Nav() {
  const theme = useBrand();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Anasayfa', href: '/' },
    { label: 'Halı Yıkama', href: '/turkiye/hali-yikama' },
    { label: 'Koltuk Yıkama', href: '/turkiye/koltuk-yikama' },
    { label: 'Yorgan Yıkama', href: '/turkiye/yorgan-yikama' },
    { label: 'Perde Yıkama', href: '/turkiye/perde-yikama' },
    { label: 'Yatak Yıkama', href: '/turkiye/yatak-yikama' },
  ];

  const isSolid = theme.navVariant === 'solid';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isSolid && 'bg-brand-primary text-white shadow-md',
        !isSolid && 'bg-brand-bg/95 backdrop-blur-md border-b border-brand-border shadow-sm'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — text-based */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105',
                isSolid
                  ? 'bg-white/20 text-white'
                  : 'bg-brand-primary text-white'
              )}
            >
              <Sparkles size={20} />
            </div>
            <span
              className={cn(
                'text-lg font-heading font-bold tracking-tight',
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
            <Link
              href="/firmalar"
              className={cn(
                'lg:hidden p-2 rounded-brand transition-colors',
                isSolid
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface'
              )}
            >
              <Search size={20} />
            </Link>

            <Link
              href="/hesabim/siparislerim"
              className={cn(
                'p-2 rounded-brand transition-colors',
                isSolid
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface'
              )}
            >
              <ShoppingBag size={20} />
            </Link>

            <Link href="/giris">
              <Button
                variant={isSolid ? 'secondary' : 'primary'}
                size="sm"
              >
                <User size={16} />
                <span className="hidden sm:inline">Giriş Yap</span>
              </Button>
            </Link>

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
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-brand-border/20 mt-2 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-brand text-sm font-medium transition-colors',
                  isSolid
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
