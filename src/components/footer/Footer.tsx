'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useBrand } from '@/lib/brand/context';

export function Footer() {
  const theme = useBrand();

  const links = [
    { label: 'Halı Yıkama Firmaları', href: '/turkiye/hali-yikama' },
    { label: 'Hizmet Veren Olun', href: '/basvuru' },
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Gizlilik', href: '/gizlilik' },
    { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
  ];

  return (
    <footer className="bg-brand-surface border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start lg:gap-8">
          {/* Logo & Description */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-base lg:text-lg font-heading font-bold text-brand-text">
                {theme.name}
              </span>
            </Link>
            <p className="text-sm text-brand-text-muted leading-relaxed">
              {theme.seo.heroSubtitle}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-brand-text-muted hover:text-brand-text active:text-brand-primary transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          {theme.seo.socialLinks && (
            <div className="flex gap-4">
              {Object.entries(theme.seo.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-text-muted hover:text-brand-primary active:text-brand-primary transition-colors capitalize py-1"
                >
                  {platform}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-brand-border text-center">
          <p className="text-xs sm:text-sm text-brand-text-muted">
            {theme.seo.footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}
