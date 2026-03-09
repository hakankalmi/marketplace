'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Camera } from 'lucide-react';
import Image from 'next/image';
import { getOrders } from '@/lib/api/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { MarketplaceOrderStatus } from '@/lib/api/types';

const statusConfig: Record<number, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'accent'; icon: typeof Clock }> = {
  0: { label: 'Beklemede', variant: 'warning', icon: Clock },
  1: { label: 'Kabul Edildi', variant: 'accent', icon: CheckCircle },
  2: { label: 'Reddedildi', variant: 'error', icon: XCircle },
  3: { label: 'Süre Doldu', variant: 'error', icon: XCircle },
  4: { label: 'İptal Edildi', variant: 'default', icon: AlertCircle },
  5: { label: 'İşleniyor', variant: 'accent', icon: Clock },
  6: { label: 'Tamamlandı', variant: 'success', icon: CheckCircle },
  7: { label: 'İtiraz', variant: 'error', icon: AlertCircle },
};

export default function SiparislerimPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => getOrders(page, pageSize),
    retry: false,
  });

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-brand-text">Siparişler yüklenemedi</h3>
        <p className="text-brand-text-muted mt-1 mb-4">Lütfen tekrar deneyin.</p>
        <Button onClick={() => window.location.reload()}>Yenile</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-7 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-heading font-bold text-brand-text mb-4 sm:mb-6">
        Siparişlerim
      </h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const photoUrl = order.beforePhotoUrls?.[0] || order.afterPhotoUrls?.[0];
            const photoCount = (order.beforePhotoUrls?.length || 0) + (order.afterPhotoUrls?.length || 0);
            return (
              <Link
                key={order.id}
                href={`/hesabim/siparislerim/${order.id}`}
                className="block p-3.5 sm:p-4 bg-brand-surface rounded-xl border border-brand-border active:bg-brand-surface-hover hover:border-brand-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {/* Photo thumbnail or icon */}
                  {photoUrl ? (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-brand-border shrink-0">
                      <Image src={photoUrl} alt="" fill className="object-cover" sizes="48px" />
                      {photoCount > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black/60 px-1 py-px rounded-tl-md">
                          <span className="text-[9px] font-medium text-white">{photoCount}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <ShoppingBag size={18} className="text-brand-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-brand-text group-hover:text-brand-primary transition-colors truncate">
                        {order.companyName}
                      </p>
                      <ChevronRight
                        size={18}
                        className="text-brand-text-muted group-hover:text-brand-primary transition-colors shrink-0"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs text-brand-text-muted truncate">
                        {order.marketplaceOrderCode} · {formatDate(order.createdAt)}
                      </p>
                      <Badge variant={status.variant}>
                        <StatusIcon size={12} />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Sayfalama */}
          {orders.length >= pageSize && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Önceki
              </Button>
              <span className="flex items-center px-3 text-sm text-brand-text-muted">
                Sayfa {page}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={orders.length < pageSize}
                onClick={() => setPage((p) => p + 1)}
              >
                Sonraki
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} className="text-brand-primary" />
          </div>
          <h3 className="text-lg font-medium text-brand-text">
            Henüz siparişiniz yok
          </h3>
          <p className="text-brand-text-muted mt-1 mb-6">
            Firmaları keşfedip ilk siparişinizi verin.
          </p>
          <Link href="/turkiye/hali-yikama">
            <Button>Firmaları Keşfet</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
