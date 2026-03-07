'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
} from 'lucide-react';
import Link from 'next/link';
import { getOrderDetail, cancelOrder } from '@/lib/api/orders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { MarketplaceOrderStatus } from '@/lib/api/types';

const statusSteps: { status: MarketplaceOrderStatus; label: string }[] = [
  { status: 'Pending', label: 'Sipariş Alındı' },
  { status: 'Accepted', label: 'Firma Kabul Etti' },
  { status: 'Completed', label: 'Tamamlandı' },
];

export default function SiparisDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderDetail(Number(id)),
    refetchInterval: 30000, // 30s polling for status updates
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(Number(id)),
    onSuccess: () => {
      toast.success('Sipariş iptal edildi');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: () => toast.error('Sipariş iptal edilemedi'),
  });

  const copyCode = () => {
    if (order?.marketplaceOrderCode) {
      navigator.clipboard.writeText(order.marketplaceOrderCode);
      toast.success('Sipariş kodu kopyalandı');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium text-brand-text">
          Sipariş bulunamadı
        </h3>
        <Link href="/hesabim/siparislerim" className="mt-4 inline-block">
          <Button variant="secondary">Siparişlerime Dön</Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(
    (s) => s.status === order.status
  );
  const isTerminal =
    order.status === 'Cancelled' || order.status === 'Rejected';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/hesabim/siparislerim"
            className="text-brand-text-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-heading font-bold text-brand-text">
              Sipariş Detayı
            </h1>
            <button
              onClick={copyCode}
              className="flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-primary transition-colors"
            >
              <Copy size={12} />
              {order.marketplaceOrderCode}
            </button>
          </div>
        </div>

        {order.status === 'Pending' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Siparişi iptal etmek istediğinize emin misiniz?')) {
                cancelMutation.mutate();
              }
            }}
            loading={cancelMutation.isPending}
            className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white"
          >
            İptal Et
          </Button>
        )}
      </div>

      {/* İlerleme Çubuğu */}
      {!isTerminal && (
        <div className="bg-brand-surface rounded-brand border border-brand-border p-4">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step.status} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= currentStepIndex
                        ? 'bg-brand-primary text-white'
                        : 'bg-brand-surface-hover text-brand-text-muted border border-brand-border'
                    }`}
                  >
                    {i < currentStepIndex ? (
                      <CheckCircle size={16} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-xs mt-1 text-brand-text-muted text-center">
                    {step.label}
                  </span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mt-[-16px] ${
                      i < currentStepIndex ? 'bg-brand-primary' : 'bg-brand-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected/Cancelled Status */}
      {isTerminal && (
        <div
          className={`p-4 rounded-brand border flex items-start gap-3 ${
            order.status === 'Rejected'
              ? 'bg-brand-error/10 border-brand-error/30'
              : 'bg-brand-surface border-brand-border'
          }`}
        >
          {order.status === 'Rejected' ? (
            <XCircle size={20} className="text-brand-error shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="text-brand-text-muted shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium text-brand-text">
              {order.status === 'Rejected' ? 'Sipariş Reddedildi' : 'Sipariş İptal Edildi'}
            </p>
            {order.rejectionReason && (
              <p className="text-sm text-brand-text-muted mt-1">
                Sebep: {order.rejectionReason}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sipariş Bilgileri */}
      <div className="bg-brand-surface rounded-brand border border-brand-border divide-y divide-brand-border">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-brand bg-brand-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-brand-primary">
              {order.companyName[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-brand-text">{order.companyName}</p>
            {order.city && (
              <p className="text-xs text-brand-text-muted">{order.city}</p>
            )}
          </div>
        </div>

        <div className="p-4 flex items-start gap-3">
          <MapPin size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-text">Adres</p>
            <p className="text-sm text-brand-text-muted">{order.addressSnapshot}</p>
          </div>
        </div>

        {order.preferredPickupDate && (
          <div className="p-4 flex items-start gap-3">
            <Calendar size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-text">Tarih</p>
              <p className="text-sm text-brand-text-muted">
                {formatDate(order.preferredPickupDate)}
              </p>
            </div>
          </div>
        )}

        {order.customerNotes && (
          <div className="p-4 flex items-start gap-3">
            <FileText size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-text">Not</p>
              <p className="text-sm text-brand-text-muted">{order.customerNotes}</p>
            </div>
          </div>
        )}

        <div className="p-4 flex items-start gap-3">
          <Clock size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-text">Sipariş Tarihi</p>
            <p className="text-sm text-brand-text-muted">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {order.trackingCode && (
          <div className="p-4">
            <p className="text-sm text-brand-text-muted">
              Takip Kodu:{' '}
              <span className="font-mono font-medium text-brand-text">
                {order.trackingCode}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Tracking Link */}
      {order.trackingId && (
        <a
          href={`https://siparis.protakip.com/${order.trackingId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full">
            Siparişi Takip Et
          </Button>
        </a>
      )}
    </motion.div>
  );
}
