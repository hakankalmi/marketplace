'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Zap, CheckCircle, ShoppingCart, Award } from 'lucide-react';
import { slugify, toTitleCase } from '@/lib/utils';
import type { CompanyListDto } from '@/lib/api/types';

const CATEGORY_LABELS: Record<string, string> = {
  hali_yikama: 'Halı Yıkama',
  koltuk_yikama: 'Koltuk Yıkama',
  yorgan_yikama: 'Yorgan Yıkama',
  perde_yikama: 'Perde Yıkama',
  yatak_yikama: 'Yatak Yıkama',
  ev_temizligi: 'Ev Temizliği',
  ofis_temizligi: 'Ofis Temizliği',
};

interface Props {
  company: CompanyListDto;
  index?: number;
}

export function FeaturedCompanyCard({ company, index = 0 }: Props) {
  const companySlug = company.slug || slugify(company.companyName);
  const citySlug = slugify(company.city || 'turkiye');
  const href = `/${citySlug}/hali-yikama/${companySlug}`;

  const responseLabel =
    company.responseTimeMinutes > 0
      ? company.responseTimeMinutes < 60
        ? `${company.responseTimeMinutes} dk`
        : `${Math.round(company.responseTimeMinutes / 60)} sa`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link href={href} className="block group">
        <div className="relative bg-brand-surface rounded-2xl border-2 border-brand-primary/20 overflow-hidden hover:border-brand-primary/40 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300">
          {/* Önerilen rozeti */}
          <div className="absolute top-0 right-0 z-10">
            <div className="flex items-center gap-1 px-3 py-1 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
              <Award size={10} />
              Önerilen
            </div>
          </div>

          <div className={`flex ${company.photoUrls?.[0] && !company.logoUrl ? 'flex-col sm:flex-row' : 'flex-row'}`}>
            {/* Photo/Logo area */}
            <div className={`relative shrink-0 overflow-hidden ${
              company.photoUrls?.[0] && !company.logoUrl
                ? 'w-full sm:w-48 h-36 sm:h-auto'
                : 'w-36 sm:w-56 h-auto'
            }`}>
              {company.photoUrls?.[0] ? (
                <Image
                  src={company.photoUrls[0]}
                  alt={company.companyName}
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  priority={index < 3}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.companyName}
                  fill
                  sizes="(max-width: 640px) 112px, 192px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[112px] bg-gradient-to-br from-brand-primary/5 to-brand-primary/15 flex items-center justify-center">
                  <span className="text-4xl font-heading font-bold text-brand-primary/30">
                    {company.companyName[0]}
                  </span>
                </div>
              )}
              {/* Gradient overlay — only for photos */}
              {company.photoUrls?.[0] && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-brand-surface/80 hidden sm:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:hidden" />
                </>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-5">
              {/* Name + Rating */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base sm:text-lg font-heading font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                  {toTitleCase(company.companyName)}
                </h3>
                {company.averageRating > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-xl bg-brand-rating/10">
                    <Star size={14} className="fill-brand-rating text-brand-rating" />
                    <span className="text-sm font-bold text-brand-rating">
                      {company.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-brand-text-muted hidden sm:inline">
                      ({company.totalReviewCount} yorum)
                    </span>
                  </div>
                )}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-brand-text-muted">
                {company.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-brand-primary/60" />
                    {company.city}
                  </span>
                )}
                {responseLabel && (
                  <span className="flex items-center gap-1">
                    <Zap size={12} className="text-amber-500" />
                    {responseLabel} yanıt
                  </span>
                )}
                {company.completedOrderCount > 0 && (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-emerald-500" />
                    {company.completedOrderCount} tamamlanan
                  </span>
                )}
              </div>

              {/* Description */}
              {company.description && (
                <p className="mt-2 text-sm text-brand-text-muted line-clamp-2">
                  {company.description}
                </p>
              )}

              {/* Bottom: Categories + Online */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {company.categoryKeys?.slice(0, 4).map((key) => (
                  <span
                    key={key}
                    className="px-2 py-0.5 bg-brand-primary/8 text-brand-primary text-[11px] font-medium rounded-md"
                  >
                    {CATEGORY_LABELS[key] || key.replace(/_/g, ' ')}
                  </span>
                ))}
                {company.canAcceptOnlineOrders && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold rounded-md">
                    <ShoppingCart size={10} />
                    Online Sipariş
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
