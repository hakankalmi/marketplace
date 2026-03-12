'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle, Zap, ShoppingCart } from 'lucide-react';
import { slugify, toTitleCase } from '@/lib/utils';
import type { CompanyListDto } from '@/lib/api/types';

interface Props {
  company: CompanyListDto;
  index?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  hali_yikama: 'Halı Yıkama',
  koltuk_yikama: 'Koltuk Yıkama',
  yorgan_yikama: 'Yorgan Yıkama',
  perde_yikama: 'Perde Yıkama',
  yatak_yikama: 'Yatak Yıkama',
  ev_temizligi: 'Ev Temizliği',
  ofis_temizligi: 'Ofis Temizliği',
};

export function CompanyListItem({ company, index = 0 }: Props) {
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.6), duration: 0.3 }}
    >
      <Link href={href} className="block group">
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-brand-surface rounded-xl border border-brand-border hover:border-brand-primary/30 hover:shadow-md transition-all duration-200">
          {/* Logo / Avatar */}
          <div className="shrink-0">
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.companyName}
                width={64}
                height={64}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-brand-border"
              />
            ) : company.photoUrls?.[0] ? (
              <Image
                src={company.photoUrls[0]}
                alt={company.companyName}
                width={64}
                height={64}
                {...(index < 6 ? { priority: true } : { loading: 'lazy' as const })}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-brand-border"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-primary/20 flex items-center justify-center border border-brand-primary/10">
                <span className="text-xl font-heading font-bold text-brand-primary">
                  {company.companyName[0]}
                </span>
              </div>
            )}
          </div>

          {/* Content — Middle */}
          <div className="flex-1 min-w-0">
            {/* Row 1: Name + Rating */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading font-semibold text-brand-text group-hover:text-brand-primary transition-colors text-sm sm:text-base truncate">
                {toTitleCase(company.companyName)}
              </h3>

              {/* Rating — desktop */}
              {company.averageRating > 0 && (
                <div className="hidden sm:flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg bg-brand-rating/10">
                  <Star size={13} className="fill-brand-rating text-brand-rating" />
                  <span className="text-sm font-bold text-brand-rating">
                    {company.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-brand-text-muted">
                    ({company.totalReviewCount})
                  </span>
                </div>
              )}
            </div>

            {/* Row 2: Location + Quick Stats */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-brand-text-muted">
              {company.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-brand-primary/60" />
                  {company.city}
                </span>
              )}
              {responseLabel && (
                <span className="flex items-center gap-1">
                  <Zap size={11} className="text-amber-500" />
                  {responseLabel}
                </span>
              )}
              {company.completedOrderCount > 0 && (
                <span className="flex items-center gap-1">
                  <CheckCircle size={11} className="text-emerald-500" />
                  {company.completedOrderCount} sipariş
                </span>
              )}
            </div>

            {/* Row 3: Categories + Online badge */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {company.categoryKeys?.slice(0, 3).map((key) => (
                <span
                  key={key}
                  className="px-2 py-0.5 bg-brand-primary/6 text-brand-primary text-[10px] sm:text-[11px] font-medium rounded-md"
                >
                  {CATEGORY_LABELS[key] || key.replace(/_/g, ' ')}
                </span>
              ))}
              {company.canAcceptOnlineOrders && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] sm:text-[11px] font-medium rounded-md">
                  <ShoppingCart size={9} />
                  Online Sipariş
                </span>
              )}

              {/* Rating — mobile only */}
              {company.averageRating > 0 && (
                <div className="flex sm:hidden items-center gap-1 ml-auto shrink-0">
                  <Star size={11} className="fill-brand-rating text-brand-rating" />
                  <span className="text-xs font-bold text-brand-rating">
                    {company.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
