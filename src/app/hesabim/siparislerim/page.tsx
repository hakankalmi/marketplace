'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getOrders } from '@/lib/api/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { MarketplaceOrderStatus } from '@/lib/api/types';

const statusConfig: Record<MarketplaceOrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'accent'; icon: typeof Clock }> = {
  Pending: { label: 'Beklemede', variant: 'warning', icon: Clock },
  Accepted: { label: 'Kabul Edildi', variant: 'accent', icon: CheckCircle },
  Completed: { label: 'Tamamlandı', variant: 'success', icon: CheckCircle },
  Rejected: { label: 'Reddedildi', variant: 'error', icon: XCircle },
  Cancelled: { label: 'İptal Edildi', variant: 'default', icon: AlertCircle },
};

export default function SiparislerimPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => getOrders(page, 10),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-brand-text mb-6">
        Siparişlerim
      </h1>

      {data && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <Link
                key={order.id}
                href={`/hesabim/siparislerim/${order.id}`}
                className="block p-4 bg-brand-surface rounded-brand border border-brand-border hover:border-brand-primary/30 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-brand bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <ShoppingBag size={18} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-text group-hover:text-brand-primary transition-colors">
                        {order.companyName}
                      </p>
                      <p className="text-xs text-brand-text-muted">
                        {order.marketplaceOrderCode} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={status.variant}>
                      <StatusIcon size={12} />
                      {status.label}
                    </Badge>
                    <ChevronRight
                      size={18}
                      className="text-brand-text-muted group-hover:text-brand-primary transition-colors"
                    />
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Sayfalama */}
          {data.totalCount > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Önceki
              </Button>
              <span className="flex items-center px-3 text-sm text-brand-text-muted">
                {page} / {Math.ceil(data.totalCount / 10)}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page * 10 >= data.totalCount}
                onClick={() => setPage((p) => p + 1)}
              >
                Sonraki
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="mx-auto text-brand-text-muted mb-4" />
          <h3 className="text-lg font-medium text-brand-text">
            Henüz siparişiniz yok
          </h3>
          <p className="text-brand-text-muted mt-1 mb-4">
            Firmaları keşfedip ilk siparişinizi verin.
          </p>
          <Link href="/firmalar">
            <Button>Firmaları Keşfet</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
