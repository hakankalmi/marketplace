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
  Camera,
  Sparkles,
  Timer,
  Truck,
  Package,
  CircleDot,
  Phone,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderDetail, cancelOrder, uploadOrderPhotos } from '@/lib/api/orders';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PhotoUploader } from '@/components/ui/photo-uploader';
import { BeforeAfterSlider } from '@/components/ui/before-after';
import { ReviewForm } from '@/components/order/ReviewForm';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { MarketplaceOrderStatus, OrderResponseDto } from '@/lib/api/types';

/* ─────────── Status Helpers ─────────── */

const statusConfig: Record<number, { label: string; color: string; bgColor: string; icon: typeof CheckCircle }> = {
  0: { label: 'Firma Onayı Bekleniyor', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200', icon: Clock },
  1: { label: 'Kabul Edildi', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', icon: CheckCircle },
  2: { label: 'Reddedildi', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', icon: XCircle },
  3: { label: 'Süre Doldu', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', icon: XCircle },
  4: { label: 'İptal Edildi', color: 'text-gray-600', bgColor: 'bg-gray-50 border-gray-200', icon: AlertCircle },
  5: { label: 'İşleniyor', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', icon: Truck },
  6: { label: 'Tamamlandı', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
  7: { label: 'İtiraz', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', icon: AlertCircle },
};

/* ─────────── Countdown Timer ─────────── */

function AutoRejectCountdown({ autoRejectAt }: { autoRejectAt: string }) {
  const [remaining, setRemaining] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(autoRejectAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('Süre doldu');
        setIsUrgent(true);
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(hours > 0 ? `${hours}s ${mins}dk` : `${mins}dk ${secs}sn`);
      setIsUrgent(diff < 600000);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [autoRejectAt]);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      isUrgent ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
    }`}>
      <Timer size={12} className={isUrgent ? 'animate-pulse' : ''} />
      {remaining}
    </div>
  );
}

/* ─────────── Timeline ─────────── */

interface TimelineStep {
  label: string;
  description?: string;
  icon: typeof CheckCircle;
  status: 'completed' | 'active' | 'upcoming' | 'error';
  timestamp?: string | null;
}

function buildTimeline(order: OrderResponseDto): TimelineStep[] {
  const s = order.status;
  const isTerminal = s === 2 || s === 3 || s === 4;

  const steps: TimelineStep[] = [
    {
      label: 'Sipariş Oluşturuldu',
      description: 'Siparişiniz firmaya iletildi',
      icon: Package,
      status: 'completed',
      timestamp: order.createdAt,
    },
  ];

  if (isTerminal) {
    const terminalLabels: Record<number, { label: string; desc: string }> = {
      2: { label: 'Firma Reddetti', desc: order.rejectionReason || 'Firma siparişinizi kabul edemedi' },
      3: { label: 'Süre Doldu', desc: 'Firma belirlenen sürede yanıt vermedi' },
      4: { label: 'İptal Edildi', desc: 'Sipariş iptal edildi' },
    };
    const t = terminalLabels[s] || terminalLabels[4];
    steps.push({
      label: t.label,
      description: t.desc,
      icon: XCircle,
      status: 'error',
      timestamp: null,
    });
    return steps;
  }

  // Firma Onayı
  steps.push({
    label: s === 0 ? 'Firma Onayı Bekleniyor' : 'Firma Onayladı',
    description: s === 0
      ? 'Firma siparişinizi değerlendiriyor'
      : (order.estimatedPickupByCompany
        ? `Tahmini teslim alma: ${formatDate(order.estimatedPickupByCompany)}`
        : 'Firma en kısa sürede sizinle iletişime geçecek'),
    icon: CheckCircle,
    status: s === 0 ? 'active' : (s === 1 ? 'active' : 'completed'),
    timestamp: order.acceptedAt,
  });

  // Teslim Alınıyor
  steps.push({
    label: 'Teslim Alınıyor',
    description: s >= 5
      ? 'Ürünleriniz teslim alındı, işlem başladı'
      : 'Firma ürünlerinizi teslim almak için gelecek',
    icon: Truck,
    status: s >= 5 ? (s === 6 ? 'completed' : 'active') : 'upcoming',
    timestamp: null,
  });

  // Tamamlandı
  steps.push({
    label: 'Tamamlandı',
    description: s === 6
      ? 'Siparişiniz başarıyla tamamlandı!'
      : 'Ürünleriniz temizlenip teslim edilecek',
    icon: Star,
    status: s === 6 ? 'completed' : 'upcoming',
    timestamp: order.completedAt,
  });

  return steps;
}

function OrderTimeline({ order }: { order: OrderResponseDto }) {
  const steps = buildTimeline(order);

  return (
    <div className="relative">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const dotColor = {
          completed: 'bg-emerald-500 ring-emerald-100',
          active: 'bg-brand-primary ring-brand-primary/20 animate-pulse',
          upcoming: 'bg-brand-border ring-0',
          error: 'bg-red-500 ring-red-100',
        }[step.status];
        const lineColor = step.status === 'completed' ? 'bg-emerald-300' : 'bg-brand-border';
        const textColor = step.status === 'upcoming' ? 'text-brand-text-muted' : 'text-brand-text';
        const StepIcon = step.icon;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-3"
          >
            {/* Left: dot + line */}
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 shrink-0 ${dotColor}`}>
                <StepIcon size={16} className="text-white" />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[32px] ${lineColor}`} />
              )}
            </div>
            {/* Right: content */}
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <p className={`text-sm font-semibold ${
                step.status === 'error' ? 'text-red-600' : textColor
              }`}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-brand-text-muted mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              )}
              {step.timestamp && (
                <p className="text-[11px] text-brand-text-muted/60 mt-1 font-mono">
                  {formatDate(step.timestamp)}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────── Main Page ─────────── */

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
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package size={48} className="mx-auto text-brand-text-muted/30 mb-4" />
        <h3 className="text-lg font-heading font-medium text-brand-text">
          Sipariş bulunamadı
        </h3>
        <Link href="/hesabim/siparislerim" className="mt-4 inline-block">
          <Button variant="secondary">Siparişlerime Dön</Button>
        </Link>
      </div>
    );
  }

  const cfg = statusConfig[order.status] || statusConfig[0];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* ── Header ── */}
      <div>
        <Link
          href="/hesabim/siparislerim"
          className="inline-flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-text transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Siparişlerim
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-heading font-bold text-brand-text">
              Sipariş Detayı
            </h1>
            <button
              onClick={copyCode}
              className="flex items-center gap-1 text-xs text-brand-text-muted active:text-brand-primary transition-colors mt-0.5"
            >
              <Copy size={11} />
              {order.marketplaceOrderCode}
            </button>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${cfg.bgColor} ${cfg.color}`}>
            <StatusIcon size={13} />
            {cfg.label}
          </div>
        </div>
      </div>

      {/* ── Status Banner ── */}
      {order.status === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 border border-amber-200 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock size={16} className="text-amber-600" />
              </div>
              <p className="text-sm font-semibold text-amber-800">
                Firma Onayı Bekleniyor
              </p>
            </div>
            <AutoRejectCountdown autoRejectAt={order.autoRejectAt} />
          </div>
          <p className="text-xs text-amber-600 ml-10">
            Firma belirtilen süre içinde siparişinizi değerlendirip yanıt verecek. Süre aşılırsa sipariş otomatik iptal edilir.
          </p>
        </motion.div>
      )}

      {order.status === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Truck size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Siparişiniz onaylandı!
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                {order.estimatedPickupByCompany
                  ? `Tahmini teslim alma: ${formatDate(order.estimatedPickupByCompany)}`
                  : 'Firma en kısa sürede sizinle iletişime geçecek.'}
              </p>
              {order.acceptedAt && (
                <p className="text-[11px] text-blue-400 mt-1">
                  Onaylanma: {formatDate(order.acceptedAt)}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {order.status === 6 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Siparişiniz tamamlandı!
              </p>
              {order.completedAt && (
                <p className="text-xs text-emerald-600 mt-0.5">
                  Tamamlanma: {formatDate(order.completedAt)}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Sipariş Aşamaları (Timeline) ── */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-5">
        <h2 className="text-sm font-heading font-semibold text-brand-text mb-4 flex items-center gap-2">
          <CircleDot size={15} className="text-brand-primary" />
          Sipariş Aşamaları
        </h2>
        <OrderTimeline order={order} />
      </div>

      {/* ── Firma Bilgisi ── */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {order.companyLogoUrl ? (
              <Image
                src={order.companyLogoUrl}
                alt={order.companyName}
                width={44}
                height={44}
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <span className="text-base font-bold text-brand-primary">
                  {order.companyName[0]}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-brand-text truncate">{order.companyName}</p>
              {order.city && (
                <p className="text-xs text-brand-text-muted">{order.city}</p>
              )}
            </div>
          </div>
          <Link
            href={`/firmalar/${order.companyId}`}
            className="text-xs text-brand-primary font-medium hover:underline shrink-0"
          >
            Firma Profili
          </Link>
        </div>
      </div>

      {/* ── Sipariş Detayları ── */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border divide-y divide-brand-border">
        <div className="p-4 flex items-start gap-3">
          <MapPin size={17} className="text-brand-text-muted mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide">Adres</p>
            <p className="text-sm text-brand-text mt-0.5 break-words">{order.addressSnapshot}</p>
          </div>
        </div>

        {order.preferredPickupDate && (
          <div className="p-4 flex items-start gap-3">
            <Calendar size={17} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide">Tercih Edilen Tarih</p>
              <p className="text-sm text-brand-text mt-0.5">{formatDate(order.preferredPickupDate)}</p>
            </div>
          </div>
        )}

        {order.customerNotes && (
          <div className="p-4 flex items-start gap-3">
            <FileText size={17} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide">Notunuz</p>
              <p className="text-sm text-brand-text mt-0.5 break-words">{order.customerNotes}</p>
            </div>
          </div>
        )}

        <div className="p-4 flex items-start gap-3">
          <Clock size={17} className="text-brand-text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide">Sipariş Tarihi</p>
            <p className="text-sm text-brand-text mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* ── İptal Butonu (sadece beklemede) ── */}
      {order.status === 0 && (
        <Button
          variant="outline"
          className="w-full text-brand-error border-brand-error/30 hover:bg-brand-error hover:text-white"
          onClick={() => {
            if (confirm('Siparişi iptal etmek istediğinize emin misiniz?')) {
              cancelMutation.mutate();
            }
          }}
          loading={cancelMutation.isPending}
        >
          <XCircle size={16} />
          Siparişi İptal Et
        </Button>
      )}

      {/* ── Before/After Photos ── */}
      <OrderPhotosSection orderId={order.id} order={order} queryClient={queryClient} />

      {/* ── Review (sadece tamamlanmış) ── */}
      {order.status === 6 && (
        <OrderReviewSection
          orderId={order.id}
          companyName={order.companyName}
          beforePhotoUrls={order.beforePhotoUrls}
          afterPhotoUrls={order.afterPhotoUrls}
        />
      )}
    </motion.div>
  );
}

/* ─────────── Photo Section ─────────── */

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
  const isCompleted = order.status === 6;
  const hasComparison = hasBeforePhotos && hasAfterPhotos;

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
      {hasComparison && (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-4">
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

      {hasBeforePhotos && !hasAfterPhotos && (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-4">
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

      {isCompleted && !order.afterPhotoUrls?.length && (
        <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl border border-emerald-200/50 p-4">
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

/* ─────────── Review Section ─────────── */

function OrderReviewSection({
  orderId,
  companyName,
  beforePhotoUrls,
  afterPhotoUrls,
}: {
  orderId: number;
  companyName: string;
  beforePhotoUrls: string[] | null;
  afterPhotoUrls: string[] | null;
}) {
  const [reviewed, setReviewed] = useState(false);

  if (reviewed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center gap-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"
        >
          <CheckCircle size={24} className="text-emerald-600" />
        </motion.div>
        <div>
          <p className="text-base font-heading font-semibold text-emerald-800">
            Yorumunuz gönderildi!
          </p>
          <p className="text-sm text-emerald-600 mt-0.5">
            Teşekkürler, değerlendirmeniz diğer müşterilere yol gösterecek.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <ReviewForm
      orderId={orderId}
      companyName={companyName}
      beforePhotoUrls={beforePhotoUrls}
      afterPhotoUrls={afterPhotoUrls}
      onSuccess={() => setReviewed(true)}
    />
  );
}
