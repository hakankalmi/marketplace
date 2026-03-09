'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { slugify, toTitleCase } from '@/lib/utils';
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
                {...(index < 3 ? { priority: true } : { loading: 'lazy' })}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/5 to-brand-primary/15">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-brand-primary">
                    {company.companyName[0]}
                  </span>
                </div>
              </div>
            )}

            {/* Bottom gradient overlay for readability */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Puan Badge */}
            {company.averageRating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                <Star size={14} className="fill-brand-rating text-brand-rating" />
                <span className="text-white text-sm font-semibold">
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

            {/* Quick stats on photo — bottom-left */}
            <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
              {company.responseTimeMinutes > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[11px] text-white font-medium">
                  <Zap size={10} />
                  {company.responseTimeMinutes < 60
                    ? `${company.responseTimeMinutes} dk`
                    : `${Math.round(company.responseTimeMinutes / 60)} sa`}
                </span>
              )}
              {company.completedOrderCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[11px] text-white font-medium">
                  {company.completedOrderCount} sipariş
                </span>
              )}
            </div>
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
                {company.distanceKm != null && company.distanceKm > 0 && (
                  <span className="ml-1 text-brand-primary font-medium">
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
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-brand-border">
              {company.averageRating > 0 && (
                <div className="flex items-center gap-1 text-xs text-brand-text-muted">
                  <Star size={12} className="fill-brand-rating text-brand-rating" />
                  <span className="font-medium">{company.totalReviewCount} yorum</span>
                </div>
              )}
              {company.categoryKeys?.length > 0 && (
                <div className="flex items-center gap-1 ml-auto">
                  {company.categoryKeys.slice(0, 2).map((key) => (
                    <span key={key} className="px-1.5 py-0.5 bg-brand-primary/8 text-brand-primary text-[10px] font-medium rounded-md">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toLocaleUpperCase('tr-TR')).replace('Hali', 'Halı').replace('Yikama', 'Yık.')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
