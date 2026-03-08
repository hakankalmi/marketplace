'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isAuthenticated } from '@/lib/api/auth';
import { useEffect, useState } from 'react';

const items = [
  { label: 'Anasayfa', href: '/', icon: Home, match: (p: string) => p === '/' },
  { label: 'Hizmetler', href: '/turkiye/hali-yikama', icon: Search, match: (p: string) => p.startsWith('/turkiye') || p.startsWith('/firmalar') },
  { label: 'Siparişler', href: '/hesabim/siparislerim', icon: ShoppingBag, match: (p: string) => p.startsWith('/hesabim/siparis') },
  { label: 'Hesabım', href: '/hesabim', icon: User, match: (p: string) => p.startsWith('/hesabim') && !p.startsWith('/hesabim/siparis') },
];

export function BottomNav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-stretch">
        {items.map((item) => {
          const isActive = item.match(pathname);
          const href = (item.href === '/hesabim' || item.href === '/hesabim/siparislerim') && !loggedIn
            ? '/giris?redirect=' + encodeURIComponent(item.href)
            : item.href;

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 pt-2.5 transition-colors min-h-[56px]',
                isActive
                  ? 'text-brand-primary'
                  : 'text-gray-400 active:text-gray-600'
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={cn(
                'text-[10px] leading-tight',
                isActive ? 'font-semibold' : 'font-medium'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
