'use client';

import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitReview } from '@/lib/api/orders';
import { toast } from 'sonner';
import type { CreateReviewRequest } from '@/lib/api/types';

interface Props {
  orderId: number;
  companyName: string;
  onSuccess: () => void;
}

function StarRating({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={size}
            className={
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-brand-border'
            }
          />
        </button>
      ))}
    </div>
  );
}

const ratingLabels: Record<number, string> = {
  1: 'Çok Kötü',
  2: 'Kötü',
  3: 'Orta',
  4: 'İyi',
  5: 'Mükemmel',
};

export function ReviewForm({ orderId, companyName, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showSubRatings, setShowSubRatings] = useState(false);
  const [qualityRating, setQualityRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [priceRating, setPriceRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Lütfen bir puan verin');
      return;
    }

    setLoading(true);
    try {
      const data: CreateReviewRequest = {
        rating,
        comment: comment.trim() || undefined,
        qualityRating: qualityRating || undefined,
        punctualityRating: punctualityRating || undefined,
        communicationRating: communicationRating || undefined,
        priceRating: priceRating || undefined,
      };
      await submitReview(orderId, data);
      toast.success('Yorumunuz gönderildi!');
      onSuccess();
    } catch (err) {
      const error = err as { status?: number; message?: string };
      if (error.status === 409) {
        toast.error('Bu sipariş için zaten yorum yapmışsınız.');
        onSuccess(); // Hide form
      } else {
        toast.error('Yorum gönderilemedi. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 p-4 sm:p-5">
      <h3 className="text-sm font-heading font-semibold text-brand-text mb-1">
        {companyName} için değerlendirme yapın
      </h3>
      <p className="text-xs text-brand-text-muted mb-4">
        Deneyiminizi paylaşarak diğer müşterilere yardımcı olun
      </p>

      {/* Main Rating */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <StarRating value={rating} onChange={setRating} size={36} />
        {rating > 0 && (
          <span className="text-sm font-medium text-amber-700">
            {ratingLabels[rating]}
          </span>
        )}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deneyiminizi anlatın... (opsiyonel)"
        rows={3}
        maxLength={1000}
        className="w-full px-3 py-2.5 bg-white border border-brand-border rounded-xl text-sm text-brand-text placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 resize-none"
      />
      {comment.length > 0 && (
        <p className="text-xs text-brand-text-muted text-right mt-1">
          {comment.length}/1000
        </p>
      )}

      {/* Sub-ratings toggle */}
      <button
        type="button"
        onClick={() => setShowSubRatings(!showSubRatings)}
        className="flex items-center gap-1.5 text-xs text-brand-text-muted hover:text-brand-text mt-3 transition-colors"
      >
        {showSubRatings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        Detaylı puanlama (opsiyonel)
      </button>

      {showSubRatings && (
        <div className="mt-3 space-y-3 bg-white/60 rounded-lg p-3">
          {[
            { label: 'Temizlik Kalitesi', value: qualityRating, set: setQualityRating },
            { label: 'Dakiklik', value: punctualityRating, set: setPunctualityRating },
            { label: 'İletişim', value: communicationRating, set: setCommunicationRating },
            { label: 'Fiyat/Performans', value: priceRating, set: setPriceRating },
          ].map((sub) => (
            <div key={sub.label} className="flex items-center justify-between gap-2">
              <span className="text-xs text-brand-text-muted">{sub.label}</span>
              <StarRating value={sub.value} onChange={sub.set} size={18} />
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <Button
        size="md"
        className="w-full mt-4"
        loading={loading}
        onClick={handleSubmit}
        disabled={rating === 0}
      >
        <Send size={16} />
        Yorumu Gönder
      </Button>
    </div>
  );
}
