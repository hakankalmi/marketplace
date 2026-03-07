'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useBrand } from '@/lib/brand/context';

export function Footer() {
  const theme = useBrand();

  const links = [
    { label: 'Firmalar', href: '/firmalar' },
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Gizlilik', href: '/gizlilik' },
    { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
  ];

  return (
    <footer className="bg-brand-surface border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo & Description */}
          <div className="max-w-sm">
            <Image
              src={theme.logoUrl}
              alt={theme.name}
              width={140}
              height={40}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-brand-text-muted">
              {theme.seo.heroSubtitle}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-brand-text-muted hover:text-brand-text transition-colors"
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
                  className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors capitalize"
                >
                  {platform}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-brand-border text-center">
          <p className="text-sm text-brand-text-muted">
            {theme.seo.footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}
