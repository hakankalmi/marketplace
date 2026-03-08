'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, slugify, toTitleCase } from '@/lib/utils';
import type { CompanyListDto } from '@/lib/api/types';

interface CompanyCardProps {
  company: CompanyListDto;
  index?: number;
}

export function CompanyCard({ company, index = 0 }: CompanyCardProps) {
  const companySlug = company.slug || slugify(company.companyName);
  const citySlug = slugify(company.city || 'turkiye');
  const slug = `/${citySlug}/hali-yikama/${companySlug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={slug}>
        <div className="group bg-brand-surface rounded-brand border border-brand-border overflow-hidden transition-all duration-300 hover:shadow-brand hover:-translate-y-1">
          {/* Firma Fotoğrafı */}
          <div className="relative h-44 bg-brand-surface-hover overflow-hidden">
            {company.photoUrls?.[0] ? (
              <Image
                src={company.photoUrls[0]}
                alt={company.companyName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-brand-primary">
                    {company.companyName[0]}
                  </span>
                </div>
              </div>
            )}

            {/* Puan Badge */}
            {company.averageRating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                <Star size={14} className="fill-brand-rating text-brand-rating" />
                <span className="text-white text-sm font-medium">
                  {company.averageRating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Sipariş Kabul Durumu */}
            {company.acceptingOrders && (
              <div className="absolute top-3 left-3">
                <Badge variant="success">
                  <CheckCircle size={12} />
                  Sipariş Alıyor
                </Badge>
              </div>
            )}
          </div>

          {/* İçerik */}
          <div className="p-4">
            <h3 className="font-heading font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
              {toTitleCase(company.companyName)}
            </h3>

            {company.city && (
              <div className="flex items-center gap-1 mt-1.5 text-sm text-brand-text-muted">
                <MapPin size={14} />
                <span>{company.city}</span>
                {company.distanceKm && (
                  <span className="ml-1">
                    ({company.distanceKm.toFixed(1)} km)
                  </span>
                )}
              </div>
            )}

            {company.description && (
              <p className="mt-2 text-sm text-brand-text-muted line-clamp-2">
                {company.description}
              </p>
            )}

            {/* Alt Bilgiler */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-brand-border">
              <div className="flex items-center gap-1 text-xs text-brand-text-muted">
                <Star size={12} className="fill-brand-rating text-brand-rating" />
                <span>{company.totalReviewCount} değerlendirme</span>
              </div>
              {company.responseTimeMinutes > 0 && (
                <div className="flex items-center gap-1 text-xs text-brand-text-muted">
                  <Clock size={12} />
                  <span>~{company.responseTimeMinutes} dk yanıt</span>
                </div>
              )}
              {company.completedOrderCount > 0 && (
                <div className={cn('text-xs text-brand-text-muted ml-auto')}>
                  {company.completedOrderCount} sipariş
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
