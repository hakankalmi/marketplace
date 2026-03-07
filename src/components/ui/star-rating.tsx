'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  showValue = true,
  reviewCount,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;

          return (
            <Star
              key={i}
              size={size}
              className={cn(
                'transition-colors',
                filled
                  ? 'fill-brand-rating text-brand-rating'
                  : half
                    ? 'fill-brand-rating/50 text-brand-rating'
                    : 'fill-none text-brand-border'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-brand-text">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-brand-text-muted">
          ({reviewCount} değerlendirme)
        </span>
      )}
    </div>
  );
}
