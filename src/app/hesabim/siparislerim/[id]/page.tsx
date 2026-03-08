'use client';

import { use, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Camera,
  Sparkles,
  Timer,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderDetail, cancelOrder, uploadOrderPhotos } from '@/lib/api/orders';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PhotoUploader } from '@/components/ui/photo-uploader';
import { BeforeAfterSlider } from '@/components/ui/before-after';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { MarketplaceOrderStatus } from '@/lib/api/types';

const statusSteps: { status: MarketplaceOrderStatus; label: string }[] = [
  { status: 'Pending', label: 'Siparis Alindi' },
  { status: 'Accepted', label: 'Kabul Edildi' },
  { status: 'Completed', label: 'Tamamlandi' },
];

/** Live countdown timer for pending orders */
function AutoRejectCountdown({ autoRejectAt }: { autoRejectAt: string }) {
  const [remaining, setRemaining] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(autoRejectAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('Sure doldu');
        setIsUrgent(true);
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (hours > 0) {
        setRemaining(`${hours}s ${mins}dk`);
      } else {
        setRemaining(`${mins}dk ${secs}sn`);
      }
      setIsUrgent(diff < 600000); // < 10 min
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [autoRejectAt]);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      isUrgent
        ? 'bg-red-50 border border-red-200 text-red-700'
        : 'bg-amber-50 border border-amber-200 text-amber-700'
    }`}>
      <Timer size={14} className={isUrgent ? 'animate-pulse' : ''} />
      <span className="font-medium">{remaining}</span>
      <span className="text-xs opacity-75">firma onay suresi</span>
    </div>
  );
}

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
    refetchInterval: 30000,
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
      <div className="space-y-3">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
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
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/hesabim/siparislerim"
            className="p-1.5 -ml-1.5 text-brand-text-muted hover:text-brand-text transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-heading font-bold text-brand-text">
              Sipariş Detayı
            </h1>
            <button
              onClick={copyCode}
              className="flex items-center gap-1 text-xs sm:text-sm text-brand-text-muted active:text-brand-primary transition-colors"
            >
              <Copy size={12} />
              <span className="truncate">{order.marketplaceOrderCode}</span>
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
            className="text-brand-error border-brand-error hover:bg-brand-error hover:text-white shrink-0"
          >
            İptal Et
          </Button>
        )}
      </div>

      {/* İlerleme Çubuğu */}
      {!isTerminal && (
        <div className="bg-brand-surface rounded-xl border border-brand-border p-4">
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
                  <span className="text-[10px] sm:text-xs mt-1 text-brand-text-muted text-center leading-tight">
                    {step.label}
                  </span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 sm:mx-2 mt-[-16px] ${
                      i < currentStepIndex ? 'bg-brand-primary' : 'bg-brand-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending — countdown + info */}
      {order.status === 'Pending' && order.autoRejectAt && (
        <div className="space-y-2">
          <AutoRejectCountdown autoRejectAt={order.autoRejectAt} />
          <p className="text-xs text-brand-text-muted px-1">
            Firma belirtilen sure icinde siparisinizi degerlendirip size donecek. Sureyi asarsa siparis otomatik iptal edilir.
          </p>
        </div>
      )}

      {/* Accepted — estimated pickup info */}
      {order.status === 'Accepted' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <Truck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-800">
              Siparisiniz onaylandi!
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              {order.estimatedPickupByCompany
                ? `Tahmini teslim alma: ${formatDate(order.estimatedPickupByCompany)}`
                : 'Firma en kisa surede sizinle iletisime gececek.'}
            </p>
            {order.acceptedAt && (
              <p className="text-xs text-emerald-500 mt-1">
                Onay tarihi: {formatDate(order.acceptedAt)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Rejected/Cancelled */}
      {isTerminal && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
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
      <div className="bg-brand-surface rounded-xl border border-brand-border divide-y divide-brand-border">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-brand-primary">
              {order.companyName[0]}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-brand-text truncate">{order.companyName}</p>
            {order.city && (
              <p className="text-xs text-brand-text-muted">{order.city}</p>
            )}
          </div>
        </div>

        <div className="p-4 flex items-start gap-3">
          <MapPin size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-text">Adres</p>
            <p className="text-sm text-brand-text-muted break-words">{order.addressSnapshot}</p>
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-brand-text">Not</p>
              <p className="text-sm text-brand-text-muted break-words">{order.customerNotes}</p>
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
            <ExternalLink size={16} />
            Siparişi Takip Et
          </Button>
        </a>
      )}

      {/* Before/After Photo Section */}
      <OrderPhotosSection orderId={order.id} order={order} queryClient={queryClient} />
    </motion.div>
  );
}

/** Photo section: shows before photos, allows after upload when completed */
function OrderPhotosSection({
  orderId,
  order,
  queryClient,
}: {
  orderId: number;
  order: { status: MarketplaceOrderStatus; beforePhotoUrls: string[] | null; afterPhotoUrls: string[] | null };
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const [afterPhotos, setAfterPhotos] = useState<string[]>(order.afterPhotoUrls || []);
  const [saving, setSaving] = useState(false);

  const hasBeforePhotos = order.beforePhotoUrls && order.beforePhotoUrls.length > 0;
  const hasAfterPhotos = afterPhotos.length > 0;
  const isCompleted = order.status === 'Completed';
  const hasComparison = hasBeforePhotos && hasAfterPhotos;

  // Nothing to show if no photos and not completed
  if (!hasBeforePhotos && !isCompleted) return null;

  const handleSaveAfterPhotos = async () => {
    setSaving(true);
    try {
      await uploadOrderPhotos(orderId, { afterPhotoUrls: afterPhotos });
      toast.success('Fotoğraflar kaydedildi!');
      queryClient.invalidateQueries({ queryKey: ['order', String(orderId)] });
    } catch {
      toast.error('Fotoğraflar kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Before/After Comparison */}
      {hasComparison && (
        <div className="bg-brand-surface rounded-xl border border-brand-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-amber-500" />
            <h3 className="text-sm font-heading font-semibold text-brand-text">
              Öncesi & Sonrası
            </h3>
          </div>
          <BeforeAfterSlider
            beforeUrl={order.beforePhotoUrls![0]}
            afterUrl={afterPhotos[0]}
          />
        </div>
      )}

      {/* Before photos only (no after yet) */}
      {hasBeforePhotos && !hasAfterPhotos && (
        <div className="bg-brand-surface rounded-xl border border-brand-border p-4">
          <p className="text-sm font-medium text-brand-text mb-2">Temizlik Öncesi</p>
          <div className="flex flex-wrap gap-2">
            {order.beforePhotoUrls!.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-brand-border">
                <Image src={url} alt={`Önce ${i + 1}`} fill className="object-cover" sizes="80px" />
                <div className="absolute bottom-0 inset-x-0 bg-red-500/70 text-center">
                  <span className="text-[8px] font-semibold text-white uppercase">Önce</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* After photo upload — only when completed */}
      {isCompleted && !order.afterPhotoUrls?.length && (
        <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl border border-emerald-200/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Camera size={16} className="text-emerald-600" />
            <h3 className="text-sm font-heading font-semibold text-brand-text">
              Sonuç Fotoğrafı Ekle
            </h3>
            <Sparkles size={14} className="text-amber-500" />
          </div>
          <p className="text-xs text-brand-text-muted mb-3">
            {hasBeforePhotos
              ? 'Temizlik sonrası fotoğrafını ekleyerek muhteşem dönüşümü kaydedin!'
              : 'Temizlik sonrasının fotoğrafını ekleyin, yorumunuzda gösterelim!'}
          </p>
          <PhotoUploader
            photos={afterPhotos}
            onChange={setAfterPhotos}
            type="after"
            orderId={String(orderId)}
          />
          {afterPhotos.length > 0 && (
            <Button
              size="sm"
              className="mt-3 w-full"
              loading={saving}
              onClick={handleSaveAfterPhotos}
            >
              Fotoğrafları Kaydet
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
