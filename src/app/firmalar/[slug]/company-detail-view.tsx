'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { formatCurrency, formatDate } from '@/lib/utils';
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className="relative aspect-[4/3] rounded-brand overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={url}
                      alt={`${company.companyName} foto ${i + 1}`}
                      fill
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
                          key={product.id}
                          className="border-t border-brand-border hover:bg-brand-surface-hover transition-colors"
                        >
                          <td className="px-4 py-3 text-brand-text">
                            {product.productName}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-brand-text">
                            {formatCurrency(product.unitPrice)}
                            <span className="text-brand-text-muted font-normal text-xs ml-1">
                              / {product.unitType === 'SquareMeter' ? 'm²' : product.unitType === 'Piece' ? 'adet' : product.unitType === 'Kilogram' ? 'kg' : 'm'}
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
                    {review.comment && (
                      <p className="text-sm text-brand-text-muted mt-2">
                        {review.comment}
                      </p>
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

              <Link
                href={`/firmalar/${company.slug || company.companyId}/siparis`}
              >
                <Button size="lg" className="w-full">
                  Sipariş Oluştur
                </Button>
              </Link>

              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="mt-3 w-full"
                >
                  <Button variant="outline" size="lg" className="w-full mt-3">
                    <Phone size={16} />
                    Ara: {company.phone}
                  </Button>
                </a>
              )}
            </motion.div>

            {/* Hizmet Alanı */}
            {company.serviceAreaDescription && (
              <div className="mt-4 p-4 bg-brand-surface rounded-brand border border-brand-border">
                <h4 className="text-sm font-medium text-brand-text mb-2">
                  Hizmet Alanı
                </h4>
                <p className="text-sm text-brand-text-muted">
                  {company.serviceAreaDescription}
                </p>
              </div>
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
