'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Camera,
  Sparkles,
  Send,
  ThumbsDown,
  Meh,
  ThumbsUp,
  Heart,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoUploader } from '@/components/ui/photo-uploader';
import { submitReview } from '@/lib/api/orders';
import { uploadOrderPhotos } from '@/lib/api/orders';
import { toast } from 'sonner';
import type { CreateReviewRequest } from '@/lib/api/types';

interface Props {
  orderId: number;
  companyName: string;
  beforePhotoUrls?: string[] | null;
  afterPhotoUrls?: string[] | null;
  onSuccess: () => void;
}

/* ───── Interactive Star Rating ───── */

function InteractiveStars({
  value,
  onChange,
  size = 40,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hover || value);
        return (
          <motion.button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.15 }}
            animate={active && star === (hover || value) ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.2 }}
            className="focus:outline-none"
          >
            <Star
              size={size}
              className={`transition-colors duration-150 ${
                active
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                  : 'text-gray-200'
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

/* ───── Mini Stars for sub-ratings ───── */

function MiniStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === value ? 0 : star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 active:scale-90 focus:outline-none p-0.5"
        >
          <Star
            size={20}
            className={`transition-colors duration-100 ${
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ───── Rating Feedback Config ───── */

const ratingConfig: Record<number, { label: string; emoji: React.ReactNode; color: string; bg: string }> = {
  1: { label: 'Çok Kötü', emoji: <ThumbsDown size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
  2: { label: 'Kötü', emoji: <Meh size={20} />, color: 'text-orange-500', bg: 'bg-orange-50' },
  3: { label: 'Fena Değil', emoji: <ThumbsUp size={20} />, color: 'text-amber-500', bg: 'bg-amber-50' },
  4: { label: 'Çok İyi', emoji: <Heart size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  5: { label: 'Mükemmel!', emoji: <Flame size={20} />, color: 'text-amber-500', bg: 'bg-amber-50' },
};

/* ───── Sub-rating Item ───── */

const subRatingItems = [
  { key: 'quality', label: 'Temizlik Kalitesi', icon: '✨' },
  { key: 'punctuality', label: 'Dakiklik', icon: '⏰' },
  { key: 'communication', label: 'İletişim', icon: '💬' },
  { key: 'price', label: 'Fiyat / Performans', icon: '💰' },
] as const;

/* ───── Main Component ───── */

export function ReviewForm({ orderId, companyName, beforePhotoUrls, afterPhotoUrls, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [subRatings, setSubRatings] = useState({ quality: 0, punctuality: 0, communication: 0, price: 0 });
  const [afterPhotos, setAfterPhotos] = useState<string[]>(afterPhotoUrls || []);
  const [showPhotos, setShowPhotos] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasBeforePhotos = beforePhotoUrls && beforePhotoUrls.length > 0;
  const hasNewAfterPhotos = afterPhotos.length > (afterPhotoUrls?.length || 0);
  const config = rating > 0 ? ratingConfig[rating] : null;

  const updateSubRating = (key: string, value: number) => {
    setSubRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Lütfen bir puan verin');
      return;
    }

    setLoading(true);
    try {
      // Save after photos first if new ones were added
      if (hasNewAfterPhotos) {
        await uploadOrderPhotos(orderId, { afterPhotoUrls: afterPhotos });
      }

      const data: CreateReviewRequest = {
        rating,
        comment: comment.trim() || undefined,
        qualityRating: subRatings.quality || undefined,
        punctualityRating: subRatings.punctuality || undefined,
        communicationRating: subRatings.communication || undefined,
        priceRating: subRatings.price || undefined,
      };
      await submitReview(orderId, data);
      toast.success('Yorumunuz gönderildi! Teşekkürler 🎉');
      onSuccess();
    } catch (err) {
      const error = err as { status?: number; message?: string };
      if (error.status === 409) {
        toast.error('Bu sipariş için zaten yorum yapmışsınız.');
        onSuccess();
      } else {
        toast.error('Yorum gönderilemedi. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden"
    >
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-white/90" />
          <h3 className="text-base sm:text-lg font-heading font-bold text-white">
            Deneyiminizi Paylaşın
          </h3>
        </div>
        <p className="text-sm text-white/80">
          <strong>{companyName}</strong> hakkındaki yorumunuz diğer müşterilere yol gösterecek
        </p>
      </div>

      <div className="bg-white border border-t-0 border-brand-border rounded-b-2xl p-5 sm:p-6 space-y-6">
        {/* ───── Main Rating ───── */}
        <div className="text-center">
          <p className="text-sm text-brand-text-muted mb-3">Genel puanınız</p>
          <div className="flex justify-center">
            <InteractiveStars value={rating} onChange={setRating} />
          </div>

          <AnimatePresence mode="wait">
            {config && (
              <motion.div
                key={rating}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full ${config.bg}`}
              >
                <span className={config.color}>{config.emoji}</span>
                <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ───── Sub-Ratings (always visible after main rating) ───── */}
        <AnimatePresence>
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-brand-surface/50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                  Detaylı Puanlama
                  <span className="text-brand-text-muted/50 normal-case tracking-normal ml-1">(opsiyonel)</span>
                </p>
                {subRatingItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-brand-text flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      {item.label}
                    </span>
                    <MiniStars
                      value={subRatings[item.key]}
                      onChange={(v) => updateSubRating(item.key, v)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───── Comment ───── */}
        <AnimatePresence>
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="overflow-hidden"
            >
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">
                  Yorumunuz
                  <span className="text-brand-text-muted font-normal ml-1">(opsiyonel)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Temizlik sonucundan memnun kaldınız mı? Firmanın hizmetini nasıl buldunuz?"
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-3 bg-brand-surface/30 border border-brand-border rounded-xl text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 resize-none transition-all"
                />
                <div className="flex justify-between mt-1.5">
                  <p className="text-xs text-brand-text-muted/60">
                    Detaylı yorumlar diğer müşterilere daha çok yardımcı olur
                  </p>
                  {comment.length > 0 && (
                    <p className="text-xs text-brand-text-muted">
                      {comment.length}/1000
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───── Photo Upload ───── */}
        <AnimatePresence>
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="overflow-hidden"
            >
              {!showPhotos ? (
                <button
                  type="button"
                  onClick={() => setShowPhotos(true)}
                  className="w-full p-3.5 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/10 transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 flex items-center justify-center shrink-0 transition-colors">
                    <Camera size={18} className="text-brand-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-brand-text">
                      Fotoğraf Ekle
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold align-middle">
                        Bonus
                      </span>
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      {hasBeforePhotos
                        ? 'Sonuç fotoğrafı ekleyin — öncesi/sonrası karşılaştırması oluşsun!'
                        : 'Temizlik sonucu fotoğrafı ekleyin, yorumunuz daha etkili olsun!'}
                    </p>
                  </div>
                  <Sparkles size={16} className="text-amber-500 shrink-0 group-hover:rotate-12 transition-transform" />
                </button>
              ) : (
                <div className="p-4 rounded-xl border border-brand-border bg-brand-surface/30">
                  <PhotoUploader
                    photos={afterPhotos}
                    onChange={setAfterPhotos}
                    type="after"
                    orderId={String(orderId)}
                    label="Temizlik Sonrası Fotoğrafları"
                    hint={
                      hasBeforePhotos
                        ? 'Öncesi fotoğraflarınız var — sonrasını da ekleyerek harika bir karşılaştırma oluşturabilirsiniz!'
                        : 'En fazla 5 fotoğraf ekleyebilirsiniz.'
                    }
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───── Submit ───── */}
        <AnimatePresence>
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
                loading={loading}
                onClick={handleSubmit}
              >
                <Send size={18} />
                Değerlendirmeyi Gönder
              </Button>
              <p className="text-xs text-brand-text-muted text-center mt-2">
                Yorumunuz firma sayfasında görünecektir
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
