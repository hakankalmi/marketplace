'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { BeforeAfterGrid } from '@/components/ui/before-after';
import { PhoneRevealButton } from '@/components/ui/phone-reveal-button';
import { formatCurrency, formatDate, slugify } from '@/lib/utils';
import type { CompanyDetailDto } from '@/lib/api/types';

interface Props {
  company: CompanyDetailDto;
}

export function CompanyDetailView({ company }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = company.photoUrls || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-text-muted mb-6">
        <Link href="/firmalar" className="hover:text-brand-primary transition-colors">
          Firmalar
        </Link>
        <span>/</span>
        <span className="text-brand-text">{company.companyName}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sol: Ana İçerik */}
        <div className="lg:col-span-2 space-y-8">
          {/* Başlık + Temel Bilgiler */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            {/* Logo */}
            <div className="shrink-0">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.companyName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-brand object-cover border border-brand-border"
                />
              ) : (
                <div className="w-24 h-24 rounded-brand bg-brand-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-heading font-bold text-brand-primary">
                    {company.companyName[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">
                {company.companyName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <StarRating
                  rating={company.averageRating}
                  reviewCount={company.totalReviewCount}
                />
                {company.acceptingOrders && (
                  <Badge variant="success">
                    <CheckCircle size={12} />
                    Sipariş Alıyor
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-brand-text-muted">
                {company.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {company.city}
                  </span>
                )}
                {company.responseTimeMinutes > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    ~{company.responseTimeMinutes} dk yanıt
                  </span>
                )}
                {company.completedOrderCount > 0 && (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={14} />
                    {company.completedOrderCount} tamamlanan sipariş
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Fotoğraf Galerisi */}
          {photos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-heading font-semibold text-brand-text mb-3">
                Fotoğraflar
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={url}
                      alt={`${company.companyName} foto ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Açıklama */}
          {company.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-lg font-heading font-semibold text-brand-text mb-3">
                Firma Hakkında
              </h2>
              <p className="text-brand-text-muted leading-relaxed">
                {company.description}
              </p>
            </motion.div>
          )}

          {/* Fiyat Listesi */}
          {company.products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-heading font-semibold text-brand-text mb-3">
                Fiyat Listesi
              </h2>
              <div className="bg-brand-surface rounded-brand border border-brand-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-surface-hover">
                      <th className="text-left px-4 py-3 text-brand-text-muted font-medium">
                        Hizmet
                      </th>
                      <th className="text-right px-4 py-3 text-brand-text-muted font-medium">
                        Fiyat
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.products
                      .filter((p) => p.isActive)
                      .map((product) => (
                        <tr
                          key={product.productId}
                          className="border-t border-brand-border hover:bg-brand-surface-hover transition-colors"
                        >
                          <td className="px-4 py-3 text-brand-text">
                            {product.productName}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-brand-text">
                            {formatCurrency(product.unitPrice)}
                            <span className="text-brand-text-muted font-normal text-xs ml-1">
                              / {product.unitType === 0 ? 'm²' : product.unitType === 1 ? 'adet' : product.unitType === 2 ? 'kg' : 'm'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {company.minimumOrderAmount > 0 && (
                <p className="mt-2 text-sm text-brand-text-muted">
                  Minimum sipariş tutarı: {formatCurrency(company.minimumOrderAmount)}
                </p>
              )}
            </motion.div>
          )}

          {/* Yorumlar */}
          {company.recentReviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-lg font-heading font-semibold text-brand-text mb-3">
                Müşteri Yorumları ({company.totalReviewCount})
              </h2>
              <div className="space-y-4">
                {company.recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-brand-surface rounded-brand border border-brand-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-sm font-medium text-brand-primary">
                          {review.customerName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-text">
                            {review.customerName}
                          </p>
                          <p className="text-xs text-brand-text-muted">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <StarRating
                        rating={review.rating}
                        size={14}
                        showValue={false}
                      />
                    </div>
                    {/* Verified purchase badge with service + total */}
                    {review.isVerifiedPurchase && (review.serviceSummary || review.orderTotal) && (
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          Doğrulanmış Alışveriş
                        </span>
                        {review.serviceSummary && (
                          <span className="text-[11px] text-brand-text-muted">
                            {review.serviceSummary}
                          </span>
                        )}
                        {review.orderTotal != null && review.orderTotal > 0 && (
                          <span className="text-[11px] font-semibold text-brand-text">
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: review.orderCurrency || 'TRY', minimumFractionDigits: 0 }).format(review.orderTotal)}
                          </span>
                        )}
                      </div>
                    )}
                    {review.comment && (
                      <p className="text-sm text-brand-text-muted mt-2">
                        {review.comment}
                      </p>
                    )}
                    {(review.beforePhotoUrls?.length || review.afterPhotoUrls?.length) ? (
                      <div className="mt-3">
                        <BeforeAfterGrid
                          beforeUrls={review.beforePhotoUrls || []}
                          afterUrls={review.afterPhotoUrls || []}
                        />
                      </div>
                    ) : null}
                    {review.companyResponse && (
                      <div className="mt-3 ml-6 p-3 bg-brand-primary/5 rounded-brand border-l-2 border-brand-primary/30">
                        <p className="text-[11px] font-semibold text-brand-primary mb-1">
                          Firma Yanıtı
                        </p>
                        <p className="text-sm text-brand-text-muted">
                          {review.companyResponse}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sağ: Sidebar — Sipariş CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <motion.div
              className="p-6 bg-brand-surface rounded-brand border border-brand-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-heading font-semibold text-brand-text mb-4">
                Hemen Sipariş Verin
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                  <CheckCircle size={16} className="text-brand-success shrink-0" />
                  <span>Hızlı ve güvenilir hizmet</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                  <CheckCircle size={16} className="text-brand-success shrink-0" />
                  <span>Kapıda ödeme imkanı</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                  <CheckCircle size={16} className="text-brand-success shrink-0" />
                  <span>Ücretsiz teslim alma</span>
                </div>
              </div>

              {company.canAcceptOnlineOrders ? (
                <Link
                  href={`/firmalar/${company.slug || company.companyId}/siparis`}
                >
                  <Button size="lg" className="w-full">
                    Sipariş Oluştur
                  </Button>
                </Link>
              ) : (
                <div className="text-center py-3 px-4 bg-amber-50 border border-amber-200 rounded-brand">
                  <p className="text-sm text-amber-800 font-medium">Bu firma şu an online sipariş kabul edemiyor</p>
                  <p className="text-xs text-amber-600 mt-1">Telefonla iletişime geçebilirsiniz</p>
                </div>
              )}

              <PhoneRevealButton
                companyId={company.companyId}
                citySlug={company.city ? slugify(company.city) : undefined}
                categorySlug={(company.categories?.[0]?.key || 'hali_yikama').replace(/_/g, '-')}
              />
            </motion.div>

            {/* Servis Bölgeleri */}
            {company.serviceAreas && company.serviceAreas.length > 0 && (
              <motion.div
                className="mt-4 p-4 bg-brand-surface rounded-brand border border-brand-border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-sm font-medium text-brand-text mb-3 flex items-center gap-1.5">
                  <MapPin size={14} className="text-brand-primary" />
                  Servis Bölgeleri
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[...new Set(company.serviceAreas)].map((area) => {
                    const citySlug = company.city ? slugify(company.city) : '';
                    const districtSlug = slugify(area);
                    const catSlug = (company.categories?.[0]?.key || 'hali-yikama').replace(/_/g, '-');
                    const href = citySlug ? `/${citySlug}-${districtSlug}-${catSlug}-firmalari` : '#';
                    return (
                      <a
                        key={area}
                        href={href}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-primary/8 text-brand-primary border border-brand-primary/15 hover:bg-brand-primary/15 transition-colors"
                      >
                        {area}
                      </a>
                    );
                  })}
                </div>
                {company.serviceAreaDescription && (
                  <p className="text-xs text-brand-text-muted mt-3">
                    {company.serviceAreaDescription}
                  </p>
                )}
              </motion.div>
            )}

            {/* Hizmet Alanı Açıklama (servis bölgesi yoksa sadece açıklama) */}
            {(!company.serviceAreas || company.serviceAreas.length === 0) && company.serviceAreaDescription && (
              <motion.div
                className="mt-4 p-4 bg-brand-surface rounded-brand border border-brand-border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-sm font-medium text-brand-text mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-brand-primary" />
                  Hizmet Alanı
                </h4>
                <p className="text-sm text-brand-text-muted">
                  {company.serviceAreaDescription}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={28} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                lightboxIndex === 0 ? photos.length - 1 : lightboxIndex - 1
              );
            }}
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative max-w-4xl max-h-[80vh] w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIndex]}
              alt={`Foto ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[80vh]"
            />
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                lightboxIndex === photos.length - 1 ? 0 : lightboxIndex + 1
              );
            }}
          >
            <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
