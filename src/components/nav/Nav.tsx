'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, ShoppingBag } from 'lucide-react';
import { useBrand } from '@/lib/brand/context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Nav() {
  const theme = useBrand();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Anasayfa', href: '/' },
    { label: 'Firmalar', href: '/firmalar' },
  ];

  const isSolid = theme.navVariant === 'solid';
  const isTransparent = theme.navVariant === 'transparent';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isSolid && 'bg-brand-primary text-white shadow-md',
        isTransparent && 'bg-brand-bg/80 backdrop-blur-md border-b border-brand-border',
        theme.navVariant === 'pill-tabs' && 'bg-brand-bg border-b border-brand-border',
        theme.navVariant === 'slim' && 'bg-brand-bg border-b border-brand-border'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src={theme.logoUrl}
              alt={theme.name}
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-brand text-sm font-medium transition-colors',
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
          <div className="flex items-center gap-2">
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
                Giriş Yap
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'md:hidden p-2 rounded-brand transition-colors',
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
          <div className="md:hidden pb-4 border-t border-brand-border/20 mt-2 pt-2 space-y-1">
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
