'use client';

import { useQuery } from '@tanstack/react-query';
import { Star, MessageSquare, CheckCircle, Building2 } from 'lucide-react';
import Link from 'next/link';
import { getMyReviews } from '@/lib/api/customer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { ReviewDto } from '@/lib/api/types';

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-brand-border'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewDto }) {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-4 space-y-3">
      {/* Header — company + date */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
            <Building2 size={14} className="text-brand-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-text truncate">
              {review.companyName || 'Firma'}
            </p>
            <p className="text-xs text-brand-text-muted">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        {review.isVerifiedPurchase && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle size={10} />
            Doğrulanmış
          </span>
        )}
      </div>

      {/* Stars */}
      <Stars rating={review.rating} size={16} />

      {/* Sub-ratings */}
      {(review.qualityRating || review.punctualityRating || review.communicationRating || review.priceRating) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {review.qualityRating && (
            <span className="text-xs text-brand-text-muted">
              Kalite: <strong className="text-brand-text">{review.qualityRating}/5</strong>
            </span>
          )}
          {review.punctualityRating && (
            <span className="text-xs text-brand-text-muted">
              Dakiklik: <strong className="text-brand-text">{review.punctualityRating}/5</strong>
            </span>
          )}
          {review.communicationRating && (
            <span className="text-xs text-brand-text-muted">
              İletişim: <strong className="text-brand-text">{review.communicationRating}/5</strong>
            </span>
          )}
          {review.priceRating && (
            <span className="text-xs text-brand-text-muted">
              Fiyat: <strong className="text-brand-text">{review.priceRating}/5</strong>
            </span>
          )}
        </div>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-brand-text leading-relaxed">{review.comment}</p>
      )}

      {/* Company response */}
      {review.companyResponse && (
        <div className="bg-brand-bg rounded-lg border border-brand-border/50 p-3 ml-4">
          <p className="text-xs font-medium text-brand-text-muted mb-1">Firma Yanıtı</p>
          <p className="text-sm text-brand-text">{review.companyResponse}</p>
        </div>
      )}
    </div>
  );
}

export default function YorumlarimPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['myReviews'],
    queryFn: () => getMyReviews(1, 50),
  });

  const reviews = data?.items || [];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-heading font-bold text-brand-text mb-4 sm:mb-6">
        Yorumlarım
      </h1>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-brand-surface rounded-xl border border-brand-border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16">
          <p className="text-brand-text-muted mb-4">Yorumlar yüklenemedi.</p>
          <Button variant="secondary" onClick={() => refetch()}>Tekrar Dene</Button>
        </div>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} className="text-brand-primary" />
          </div>
          <h3 className="text-lg font-medium text-brand-text">
            Henüz yorumunuz yok
          </h3>
          <p className="text-brand-text-muted mt-1 mb-4">
            Tamamlanan siparişleriniz için yorum bırakabilirsiniz.
          </p>
          <Link href="/hesabim/siparislerim">
            <Button variant="secondary">Siparişlerime Git</Button>
          </Link>
        </div>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
