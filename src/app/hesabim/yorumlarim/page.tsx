'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Star,
  MessageSquare,
  CheckCircle,
  Building2,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { getMyReviews } from '@/lib/api/customer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BeforeAfterGrid } from '@/components/ui/before-after';
import { formatDate } from '@/lib/utils';
import type { ReviewDto } from '@/lib/api/types';

/* ───── Stars Display ───── */

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-200'
          }
        />
      ))}
    </div>
  );
}

/* ───── Sub-rating Pill ───── */

function SubRatingPill({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-surface border border-brand-border/50">
      <span className="text-xs">{icon}</span>
      <span className="text-xs text-brand-text-muted">{label}</span>
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={10}
            className={s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
          />
        ))}
      </div>
    </div>
  );
}

/* ───── Review Card ───── */

function ReviewCard({ review, index }: { review: ReviewDto; index: number }) {
  const hasBeforePhotos = review.beforePhotoUrls && review.beforePhotoUrls.length > 0;
  const hasAfterPhotos = review.afterPhotoUrls && review.afterPhotoUrls.length > 0;
  const hasPhotos = hasBeforePhotos || hasAfterPhotos;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden"
    >
      {/* Company header */}
      <div className="flex items-center justify-between gap-3 p-4 pb-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-brand-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-text truncate">
              {review.companyName || 'Firma'}
            </p>
            <p className="text-xs text-brand-text-muted">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {review.isVerifiedPurchase && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">
              <CheckCircle size={10} />
              Doğrulanmış
            </span>
          )}
          {/* Rating badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/50 rounded-full">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-amber-700">{review.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Stars row */}
        <Stars rating={review.rating} />

        {/* Sub-ratings */}
        {(review.qualityRating || review.punctualityRating || review.communicationRating || review.priceRating) && (
          <div className="flex flex-wrap gap-1.5">
            {review.qualityRating != null && review.qualityRating > 0 && (
              <SubRatingPill label="Kalite" value={review.qualityRating} icon="✨" />
            )}
            {review.punctualityRating != null && review.punctualityRating > 0 && (
              <SubRatingPill label="Dakiklik" value={review.punctualityRating} icon="⏰" />
            )}
            {review.communicationRating != null && review.communicationRating > 0 && (
              <SubRatingPill label="İletişim" value={review.communicationRating} icon="💬" />
            )}
            {review.priceRating != null && review.priceRating > 0 && (
              <SubRatingPill label="Fiyat" value={review.priceRating} icon="💰" />
            )}
          </div>
        )}

        {/* Comment */}
        {review.comment && (
          <p className="text-sm text-brand-text leading-relaxed">{review.comment}</p>
        )}

        {/* Before/After Photos */}
        {hasPhotos && (
          <div className="pt-1">
            <BeforeAfterGrid
              beforeUrls={review.beforePhotoUrls || []}
              afterUrls={review.afterPhotoUrls || []}
            />
          </div>
        )}

        {/* Company response */}
        {review.companyResponse && (
          <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <MessageCircle size={12} className="text-blue-500" />
              <p className="text-xs font-semibold text-blue-700">Firma Yanıtı</p>
              {review.companyRespondedAt && (
                <span className="text-[10px] text-blue-400">• {formatDate(review.companyRespondedAt)}</span>
              )}
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{review.companyResponse}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ───── Loading Skeleton ───── */

function ReviewSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-14 w-full rounded-lg" />
      <Skeleton className="h-36 w-full rounded-xl" />
    </div>
  );
}

/* ───── Page ───── */

export default function YorumlarimPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['myReviews'],
    queryFn: () => getMyReviews(1, 50),
  });

  const reviews = data?.items || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-brand-text">
          Yorumlarım
        </h1>
        {reviews.length > 0 && (
          <span className="text-sm text-brand-text-muted bg-brand-surface px-3 py-1 rounded-full border border-brand-border">
            {reviews.length} yorum
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          <ReviewSkeleton />
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-red-400" />
          </div>
          <p className="text-brand-text font-medium mb-1">Yorumlar yüklenemedi</p>
          <p className="text-sm text-brand-text-muted mb-4">Lütfen tekrar deneyin.</p>
          <Button variant="secondary" onClick={() => refetch()}>Tekrar Dene</Button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && reviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 rotate-3" />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 flex items-center justify-center -rotate-2">
              <Sparkles size={32} className="text-amber-400" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold text-brand-text">
            Henüz yorum yapmadınız
          </h3>
          <p className="text-sm text-brand-text-muted mt-1.5 mb-6 max-w-xs mx-auto leading-relaxed">
            Tamamlanan siparişlerinize yorum bırakarak diğer müşterilere yardımcı olun ve hizmet kalitesini artırın.
          </p>
          <Link href="/hesabim/siparislerim">
            <Button variant="primary">
              Siparişlerime Git
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Reviews list */}
      {!isLoading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
