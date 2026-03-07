'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, MapPin, Star, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearAuth } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Profil', href: '/hesabim', icon: User },
  { label: 'Siparişlerim', href: '/hesabim/siparislerim', icon: ShoppingBag },
  { label: 'Adreslerim', href: '/hesabim/adreslerim', icon: MapPin },
  { label: 'Yorumlarım', href: '/hesabim/yorumlarim', icon: Star },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <aside className="space-y-1">
      <h2 className="text-lg font-heading font-semibold text-brand-text mb-4 hidden lg:block">
        Hesabım
      </h2>

      {/* Mobile: horizontal scroll tabs, Desktop: vertical list */}
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {menuItems.map((item) => {
          const isActive =
            item.href === '/hesabim'
              ? pathname === '/hesabim'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-brand text-sm font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 rounded-brand text-sm font-medium text-brand-error hover:bg-brand-error/10 transition-colors whitespace-nowrap"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </nav>
    </aside>
  );
}
