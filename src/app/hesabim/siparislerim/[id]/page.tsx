'use client';

import { use, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShoppingBag,
  Ruler,
  Info,
  ImageIcon,
  MessageCircle,
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
import type { MarketplaceOrderStatus, OrderResponseDto, OrderItemDto } from '@/lib/api/types';
import { OrderChat } from '@/components/chat/OrderChat';

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
  const ios = order.internalOrderStatus;
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
    steps.push({ label: t.label, description: t.desc, icon: XCircle, status: 'error', timestamp: null });
    return steps;
  }

  const iosPast = (threshold: number) => ios != null && ios >= threshold;
  const iosAt = (val: number) => ios != null && ios === val;

  steps.push({
    label: s === 0 ? 'Firma Onayı Bekleniyor' : 'Firma Onayladı',
    description: s === 0
      ? 'Firma siparişinizi değerlendiriyor'
      : (order.estimatedPickupByCompany
        ? `Tahmini teslim alma: ${formatDate(order.estimatedPickupByCompany)}`
        : 'Firma en kısa sürede sizinle iletişime geçecek'),
    icon: CheckCircle,
    status: s === 0 ? 'active' : 'completed',
    timestamp: order.acceptedAt,
  });

  steps.push({
    label: 'Teslim Alındı',
    description: iosPast(1) ? 'Ürünleriniz firmaya teslim edildi' : 'Firma ürünlerinizi teslim almak için gelecek',
    icon: Truck,
    status: iosPast(1) ? 'completed' : (s >= 1 && !iosPast(1) ? 'active' : 'upcoming'),
    timestamp: null,
  });

  steps.push({
    label: 'Yıkamada',
    description: iosPast(2) ? 'Yıkama işlemi tamamlandı' : (iosAt(1) ? 'Ürünleriniz yıkanıyor' : 'Ürünleriniz yıkanacak'),
    icon: CircleDot,
    status: iosPast(2) ? 'completed' : (iosAt(1) ? 'active' : 'upcoming'),
    timestamp: null,
  });

  steps.push({
    label: 'Teslimata Hazır',
    description: iosPast(3) ? 'Dağıtıma çıkarıldı' : (iosAt(2) ? 'Ürünleriniz hazır, teslimat bekleniyor' : 'Ürünleriniz hazırlanacak'),
    icon: CheckCircle,
    status: iosPast(3) ? 'completed' : (iosAt(2) ? 'active' : 'upcoming'),
    timestamp: null,
  });

  steps.push({
    label: 'Dağıtımda',
    description: iosPast(4) ? 'Ürünleriniz teslim edildi' : (iosAt(3) ? 'Ürünleriniz yolda!' : 'Ürünleriniz adresinize getirilecek'),
    icon: Truck,
    status: iosPast(4) ? 'completed' : (iosAt(3) ? 'active' : 'upcoming'),
    timestamp: null,
  });

  steps.push({
    label: 'Tamamlandı',
    description: s === 6 ? 'Siparişiniz başarıyla tamamlandı!' : 'Siparişiniz tamamlanacak',
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
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 shrink-0 ${dotColor}`}>
                <StepIcon size={16} className="text-white" />
              </div>
              {!isLast && <div className={`w-0.5 flex-1 min-h-[32px] ${lineColor}`} />}
            </div>
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <p className={`text-sm font-semibold ${step.status === 'error' ? 'text-red-600' : textColor}`}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-brand-text-muted mt-0.5 leading-relaxed">{step.description}</p>
              )}
              {step.timestamp && (
                <p className="text-[11px] text-brand-text-muted/60 mt-1 font-mono">{formatDate(step.timestamp)}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────── Tab System ─────────── */

type TabKey = 'tracking' | 'items' | 'details' | 'photos' | 'chat';

interface TabDef {
  key: TabKey;
  label: string;
  icon: typeof CheckCircle;
  badge?: number;
}

function buildTabs(order: OrderResponseDto): TabDef[] {
  const tabs: TabDef[] = [
    { key: 'tracking', label: 'Takip', icon: CircleDot },
  ];

  // Show items tab when order has items or is accepted (items will come)
  const itemCount = order.orderItems?.length ?? 0;
  tabs.push({
    key: 'items',
    label: 'Ürünler',
    icon: ShoppingBag,
    badge: itemCount > 0 ? itemCount : undefined,
  });

  tabs.push({ key: 'details', label: 'Detaylar', icon: Info });

  const photoCount = (order.beforePhotoUrls?.length ?? 0) + (order.afterPhotoUrls?.length ?? 0);
  if (photoCount > 0 || order.status === 6) {
    tabs.push({
      key: 'photos',
      label: 'Fotoğraflar',
      icon: ImageIcon,
      badge: photoCount > 0 ? photoCount : undefined,
    });
  }

  // Chat tab: show after acceptance (status 1, 5, 6, 7)
  const chatEligibleStatuses = [1, 5, 6, 7];
  if (chatEligibleStatuses.includes(order.status)) {
    tabs.push({
      key: 'chat',
      label: 'Mesajlar',
      icon: MessageCircle,
    });
  }

  return tabs;
}

/* ─────────── Tab: Items ─────────── */

function OrderItemsTab({ order }: { order: OrderResponseDto }) {
  const items = order.orderItems;
  const hasItems = items && items.length > 0;

  if (!hasItems) {
    const isAccepted = order.status >= 1 && order.status <= 6;
    return (
      <div className="text-center py-10">
        <ShoppingBag size={40} className="mx-auto text-brand-text-muted/20 mb-3" />
        <p className="text-sm font-medium text-brand-text-muted">
          {isAccepted
            ? 'Ürünleriniz henüz sisteme girilmedi'
            : 'Sipariş onaylandıktan sonra ürünler görünecek'}
        </p>
        {isAccepted && (
          <p className="text-xs text-brand-text-muted/60 mt-1">
            Firma teslim aldıktan sonra ürünleri sisteme girecek
          </p>
        )}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: order.currency || 'TRY' }).format(amount);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-brand-surface rounded-xl border border-brand-border p-3.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-text truncate">{item.productName}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-brand-text-muted">
                <span>{item.quantity} adet</span>
                {item.area != null && item.area > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Ruler size={11} />
                    {Number(item.area).toFixed(1)} m²
                  </span>
                )}
                {item.width != null && item.height != null && item.width > 0 && item.height > 0 && (
                  <span>{Number(item.width).toFixed(1)} × {Number(item.height).toFixed(1)} m</span>
                )}
              </div>
              {item.itemNotes && (
                <p className="text-[11px] text-brand-text-muted/70 mt-1 italic">{item.itemNotes}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-brand-text">{formatCurrency(item.total)}</p>
              {item.quantity > 1 && (
                <p className="text-[11px] text-brand-text-muted">{formatCurrency(item.unitPrice)} / adet</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Total */}
      {order.totalAmount != null && (
        <div className="bg-brand-primary/5 rounded-xl border border-brand-primary/20 p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-text">Toplam</span>
          <span className="text-lg font-heading font-bold text-brand-primary">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────── Tab: Details ─────────── */

function OrderDetailsTab({ order }: { order: OrderResponseDto }) {
  return (
    <div className="space-y-3">
      {/* Company */}
      <div className="bg-brand-surface rounded-xl border border-brand-border p-4">
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
                <span className="text-base font-bold text-brand-primary">{order.companyName[0]}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-brand-text truncate">{order.companyName}</p>
              {order.city && <p className="text-xs text-brand-text-muted">{order.city}</p>}
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

      {/* Info rows */}
      <div className="bg-brand-surface rounded-xl border border-brand-border divide-y divide-brand-border">
        <div className="p-3.5 flex items-start gap-3">
          <MapPin size={16} className="text-brand-text-muted mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide">Adres</p>
            <p className="text-sm text-brand-text mt-0.5 break-words">{order.addressSnapshot}</p>
          </div>
        </div>

        {order.preferredPickupDate && (
          <div className="p-3.5 flex items-start gap-3">
            <Calendar size={16} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide">Tercih Edilen Tarih</p>
              <p className="text-sm text-brand-text mt-0.5">{formatDate(order.preferredPickupDate)}</p>
            </div>
          </div>
        )}

        {order.customerNotes && (
          <div className="p-3.5 flex items-start gap-3">
            <FileText size={16} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide">Notunuz</p>
              <p className="text-sm text-brand-text mt-0.5 break-words">{order.customerNotes}</p>
            </div>
          </div>
        )}

        <div className="p-3.5 flex items-start gap-3">
          <Clock size={16} className="text-brand-text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide">Sipariş Tarihi</p>
            <p className="text-sm text-brand-text mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {order.acceptedAt && (
          <div className="p-3.5 flex items-start gap-3">
            <CheckCircle size={16} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide">Onaylanma Tarihi</p>
              <p className="text-sm text-brand-text mt-0.5">{formatDate(order.acceptedAt)}</p>
            </div>
          </div>
        )}

        {order.completedAt && (
          <div className="p-3.5 flex items-start gap-3">
            <Star size={16} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide">Tamamlanma Tarihi</p>
              <p className="text-sm text-brand-text mt-0.5">{formatDate(order.completedAt)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────── Tab: Photos ─────────── */

function OrderPhotosTab({
  order,
  queryClient,
}: {
  order: OrderResponseDto;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const [afterPhotos, setAfterPhotos] = useState<string[]>(order.afterPhotoUrls || []);
  const [saving, setSaving] = useState(false);

  const hasBeforePhotos = order.beforePhotoUrls && order.beforePhotoUrls.length > 0;
  const hasAfterPhotos = afterPhotos.length > 0;
  const isCompleted = order.status === 6;
  const hasComparison = hasBeforePhotos && hasAfterPhotos;

  const handleSaveAfterPhotos = async () => {
    setSaving(true);
    try {
      await uploadOrderPhotos(order.id, { afterPhotoUrls: afterPhotos });
      toast.success('Fotoğraflar kaydedildi!');
      queryClient.invalidateQueries({ queryKey: ['order', String(order.id)] });
    } catch {
      toast.error('Fotoğraflar kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {hasComparison && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-amber-500" />
            <h3 className="text-sm font-heading font-semibold text-brand-text">Öncesi & Sonrası</h3>
          </div>
          <BeforeAfterSlider beforeUrl={order.beforePhotoUrls![0]} afterUrl={afterPhotos[0]} />
        </div>
      )}

      {hasBeforePhotos && (
        <div>
          <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">Temizlik Öncesi</p>
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

      {hasAfterPhotos && !hasComparison && (
        <div>
          <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">Temizlik Sonrası</p>
          <div className="flex flex-wrap gap-2">
            {afterPhotos.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-brand-border">
                <Image src={url} alt={`Sonra ${i + 1}`} fill className="object-cover" sizes="80px" />
                <div className="absolute bottom-0 inset-x-0 bg-emerald-500/70 text-center">
                  <span className="text-[8px] font-semibold text-white uppercase">Sonra</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCompleted && !order.afterPhotoUrls?.length && (
        <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl border border-emerald-200/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Camera size={16} className="text-emerald-600" />
            <h3 className="text-sm font-heading font-semibold text-brand-text">Sonuç Fotoğrafı Ekle</h3>
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
            orderId={String(order.id)}
          />
          {afterPhotos.length > 0 && (
            <Button size="sm" className="mt-3 w-full" loading={saving} onClick={handleSaveAfterPhotos}>
              Fotoğrafları Kaydet
            </Button>
          )}
        </div>
      )}

      {!hasBeforePhotos && !hasAfterPhotos && !isCompleted && (
        <div className="text-center py-10">
          <ImageIcon size={40} className="mx-auto text-brand-text-muted/20 mb-3" />
          <p className="text-sm font-medium text-brand-text-muted">Henüz fotoğraf yok</p>
        </div>
      )}
    </div>
  );
}

/* ─────────── Review Section ─────────── */

function ReviewThankYou() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
        <CheckCircle size={24} className="text-emerald-600" />
      </div>
      <div>
        <p className="text-base font-heading font-semibold text-emerald-800">Yorumunuz için teşekkürler!</p>
        <p className="text-sm text-emerald-600 mt-0.5">
          Değerlendirmeniz diğer müşterilere yol gösterecek.
        </p>
      </div>
    </motion.div>
  );
}

function OrderReviewSection({
  orderId,
  companyName,
  hasReview,
  beforePhotoUrls,
  afterPhotoUrls,
}: {
  orderId: number;
  companyName: string;
  hasReview: boolean;
  beforePhotoUrls: string[] | null;
  afterPhotoUrls: string[] | null;
}) {
  const [justReviewed, setJustReviewed] = useState(false);

  if (hasReview || justReviewed) {
    return <ReviewThankYou />;
  }

  return (
    <ReviewForm
      orderId={orderId}
      companyName={companyName}
      beforePhotoUrls={beforePhotoUrls}
      afterPhotoUrls={afterPhotoUrls}
      onSuccess={() => setJustReviewed(true)}
    />
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
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'tracking';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

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
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package size={48} className="mx-auto text-brand-text-muted/30 mb-4" />
        <h3 className="text-lg font-heading font-medium text-brand-text">Sipariş bulunamadı</h3>
        <Link href="/hesabim/siparislerim" className="mt-4 inline-block">
          <Button variant="secondary">Siparişlerime Dön</Button>
        </Link>
      </div>
    );
  }

  const cfg = statusConfig[order.status] || statusConfig[0];
  const StatusIcon = cfg.icon;
  const tabs = buildTabs(order);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
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
            <h1 className="text-xl font-heading font-bold text-brand-text">Sipariş Detayı</h1>
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

      {/* ── Status Banners ── */}
      {order.status === 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock size={16} className="text-amber-600" />
              </div>
              <p className="text-sm font-semibold text-amber-800">Firma Onayı Bekleniyor</p>
            </div>
            <AutoRejectCountdown autoRejectAt={order.autoRejectAt} />
          </div>
          <p className="text-xs text-amber-600 ml-10">
            Firma belirtilen süre içinde siparişinizi değerlendirip yanıt verecek.
          </p>
        </motion.div>
      )}

      {order.status === 6 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Siparişiniz tamamlandı!</p>
              {order.completedAt && (
                <p className="text-xs text-emerald-600 mt-0.5">Tamamlanma: {formatDate(order.completedAt)}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Total Amount (always visible above tabs) ── */}
      {order.totalAmount != null && order.totalAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-brand-surface rounded-2xl border border-brand-border"
        >
          <span className="text-sm font-medium text-brand-text-muted">Sipariş Tutarı</span>
          <span className="text-xl font-heading font-bold text-brand-primary">
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: order.currency || 'TRY', minimumFractionDigits: 0 }).format(order.totalAmount)}
          </span>
        </motion.div>
      )}

      {/* ── Tabs ── */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-brand-border">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors relative ${
                  isActive
                    ? 'text-brand-primary'
                    : 'text-brand-text-muted hover:text-brand-text'
                }`}
              >
                <TabIcon size={14} />
                <span>{tab.label}</span>
                {tab.badge != null && (
                  <span className={`w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center font-bold ${
                    isActive ? 'bg-brand-primary text-white' : 'bg-brand-border text-brand-text-muted'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'tracking' && <OrderTimeline order={order} />}
              {activeTab === 'items' && <OrderItemsTab order={order} />}
              {activeTab === 'details' && <OrderDetailsTab order={order} />}
              {activeTab === 'photos' && <OrderPhotosTab order={order} queryClient={queryClient} />}
              {activeTab === 'chat' && (
                <OrderChat
                  orderId={order.id}
                  isWritable={[1, 5, 6].includes(order.status)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Cancel Button (only when pending) ── */}
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

      {/* ── Review (only when completed) ── */}
      {order.status === 6 && (
        <OrderReviewSection
          orderId={order.id}
          companyName={order.companyName}
          hasReview={order.hasReview}
          beforePhotoUrls={order.beforePhotoUrls}
          afterPhotoUrls={order.afterPhotoUrls}
        />
      )}
    </motion.div>
  );
}
