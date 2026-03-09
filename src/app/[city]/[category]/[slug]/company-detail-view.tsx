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
  BadgeCheck,
  MessageSquareReply,
  ShieldCheck,
  Truck,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { BeforeAfterGrid } from '@/components/ui/before-after';
import { formatCurrency, formatDate, toTitleCase, getCategoryDisplayName, slugify } from '@/lib/utils';
import type { CompanyDetailDto, ProductDto, MarketplaceProductCategory } from '@/lib/api/types';

/* ── Category display config (integer keys matching backend enum) ── */
const categoryConfig: Record<MarketplaceProductCategory, { label: string; icon: string }> = {
  1: { label: 'Halı Yıkama', icon: '🧶' },
  2: { label: 'Koltuk Yıkama', icon: '🛋️' },
  3: { label: 'Ev Tekstil Yıkama', icon: '🧺' },
  4: { label: 'Perde Yıkama', icon: '🪟' },
  5: { label: 'Yatak Yıkama', icon: '🛏️' },
  6: { label: 'Ek Hizmetler', icon: '✨' },
  7: { label: 'Genel Temizlik', icon: '🧹' },
};

const categoryOrder: MarketplaceProductCategory[] = [1, 2, 3, 4, 5, 7, 6];

function getUnitLabel(unitType: number | string): string {
  switch (unitType) {
    case 0: case 'SquareMeter': return 'm²';
    case 1: case 'Piece': return 'adet';
    case 2: case 'Kilogram': return 'kg';
    case 3: case 'Meter': return 'm';
    case 4: return 'parça';
    default: return 'adet';
  }
}

function groupProductsByCategory(products: ProductDto[]) {
  const active = products.filter(p => p.isActive);
  const grouped = new Map<MarketplaceProductCategory | 'uncategorized', ProductDto[]>();

  for (const product of active) {
    const key = product.marketplaceCategory || 'uncategorized';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(product);
  }

  // Sort by predefined order
  const sorted: { key: string; label: string; icon: string; products: ProductDto[] }[] = [];

  for (const cat of categoryOrder) {
    const items = grouped.get(cat);
    if (items && items.length > 0) {
      const cfg = categoryConfig[cat];
      sorted.push({ key: String(cat), label: cfg.label, icon: cfg.icon, products: items });
    }
  }

  // Uncategorized at end
  const uncategorized = grouped.get('uncategorized');
  if (uncategorized && uncategorized.length > 0) {
    sorted.push({ key: 'uncategorized', label: 'Diğer Hizmetler', icon: '📋', products: uncategorized });
  }

  return sorted;
}

/* ── Component ── */

interface Props {
  company: CompanyDetailDto;
  city?: string;
  category?: string;
}

export function CompanyDetailView({ company, city, category }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = company.photoUrls || [];
  const productGroups = groupProductsByCategory(company.products);
  const hasProducts = productGroups.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-brand-text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-primary transition-colors">
          Anasayfa
        </Link>
        <span>/</span>
        {city && (
          <>
            <Link
              href={`/${city}`}
              className="hover:text-brand-primary transition-colors"
            >
              {company.city || decodeURIComponent(city).replace(/-/g, ' ')}
            </Link>
            <span>/</span>
          </>
        )}
        {category && (
          <>
            <Link
              href={`/${city}/${category}`}
              className="hover:text-brand-primary transition-colors"
            >
              {getCategoryDisplayName(category)}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-brand-text font-medium">{toTitleCase(company.companyName)}</span>
      </nav>

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
                  priority
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
                {toTitleCase(company.companyName)}
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

          {/* Mobile CTA — firma bilgisinin hemen altında (desktop sidebar var) */}
          <div className="lg:hidden">
            <Link
              href={`/${city || 'turkiye'}/${category || 'hali-yikama'}/${company.slug || company.companyId}/siparis`}
            >
              <Button size="lg" className="w-full text-base">
                Sipariş Oluştur
              </Button>
            </Link>
          </div>

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
                      sizes="(max-width: 640px) 50vw, 33vw"
                      {...(i === 0 ? { priority: true } : { loading: 'lazy' })}
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

          {/* Fiyat Listesi — Kategorize */}
          {hasProducts && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-heading font-semibold text-brand-text mb-4">
                Fiyat Listesi
              </h2>

              <div className="space-y-4">
                {productGroups.map((group, gi) => (
                  <motion.div
                    key={group.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + gi * 0.05 }}
                    className="bg-brand-surface rounded-brand border border-brand-border overflow-hidden"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-brand-primary/5 border-b border-brand-border">
                      <span className="text-lg">{group.icon}</span>
                      <h3 className="font-heading font-semibold text-brand-text text-sm">
                        {group.label}
                      </h3>
                      <span className="ml-auto text-xs text-brand-text-muted bg-brand-border/50 px-2 py-0.5 rounded-full">
                        {group.products.length} hizmet
                      </span>
                    </div>

                    {/* Products */}
                    <div className="divide-y divide-brand-border">
                      {group.products.map((product) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between px-4 py-3 hover:bg-brand-surface-hover transition-colors"
                        >
                          <span className="text-sm text-brand-text">
                            {product.productName}
                          </span>
                          <span className="text-sm font-semibold text-brand-primary whitespace-nowrap ml-4">
                            {formatCurrency(product.unitPrice)}
                            <span className="text-brand-text-muted font-normal text-xs ml-1">
                              / {getUnitLabel(product.unitType)}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {company.minimumOrderAmount > 0 && (
                <p className="mt-3 text-sm text-brand-text-muted flex items-center gap-1.5">
                  <Sparkles size={14} className="text-brand-primary" />
                  Minimum sipariş tutarı: <strong>{formatCurrency(company.minimumOrderAmount)}</strong>
                </p>
              )}
            </motion.div>
          )}

          {/* Yorumlar ve Değerlendirmeler */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            id="yorumlar"
          >
            <h2 className="text-xl font-heading font-bold text-brand-text mb-6">
              Değerlendirmeler ve Yorumlar
            </h2>

            {/* Puan Özet Kartı */}
            <div className="p-6 bg-brand-surface rounded-brand border border-brand-border mb-6">
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                {/* Sol: Büyük Puan */}
                <div className="text-center">
                  <div className="text-5xl font-heading font-bold text-brand-text">
                    {company.averageRating > 0 ? company.averageRating.toFixed(1) : '—'}
                  </div>
                  <div className="mt-1">
                    <StarRating rating={company.averageRating} size={18} showValue={false} />
                  </div>
                  <p className="text-sm text-brand-text-muted mt-1">
                    {company.totalReviewCount} değerlendirme
                  </p>
                </div>

                {/* Sağ: Puan Dağılımı */}
                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = company.recentReviews.filter(r => r.rating === star).length;
                    const total = company.recentReviews.length || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm text-brand-text-muted w-8 text-right">{star} ★</span>
                        <div className="flex-1 h-2.5 bg-brand-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: star >= 4 ? '#10B981' : star === 3 ? '#F59E0B' : '#EF4444',
                            }}
                          />
                        </div>
                        <span className="text-xs text-brand-text-muted w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Alt Detay Puanları */}
              {company.recentReviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-brand-border">
                  {[
                    { label: 'Kalite', key: 'qualityRating' as const },
                    { label: 'Dakiklik', key: 'punctualityRating' as const },
                    { label: 'İletişim', key: 'communicationRating' as const },
                    { label: 'Fiyat', key: 'priceRating' as const },
                  ].map((item) => {
                    const vals = company.recentReviews
                      .map(r => r[item.key])
                      .filter((v): v is number => v != null && v > 0);
                    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
                    return (
                      <div key={item.key} className="text-center">
                        <p className="text-lg font-bold text-brand-text">{avg > 0 ? avg.toFixed(1) : '—'}</p>
                        <p className="text-xs text-brand-text-muted">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Yorum Listesi */}
            {company.recentReviews.length > 0 ? (
              <div className="space-y-4">
                {company.recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-5 bg-brand-surface rounded-brand border border-brand-border"
                  >
                    {/* Müşteri Yorumu */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-sm font-bold text-brand-primary">
                          {review.customerName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-brand-text">
                              {review.customerName}
                            </p>
                            {review.isVerifiedPurchase && (
                              <BadgeCheck size={14} className="text-brand-primary" />
                            )}
                          </div>
                          <p className="text-xs text-brand-text-muted">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-brand-primary/5 rounded-full">
                        <Star size={14} className="fill-brand-rating text-brand-rating" />
                        <span className="text-sm font-semibold text-brand-text">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    {/* Verified purchase badge with service + total */}
                    {review.isVerifiedPurchase && (review.serviceSummary || review.orderTotal) && (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                      <p className="text-brand-text-muted leading-relaxed">
                        {review.comment}
                      </p>
                    )}

                    {/* Before/After Photos */}
                    {(review.beforePhotoUrls?.length || review.afterPhotoUrls?.length) ? (
                      <div className="mt-3">
                        <BeforeAfterGrid
                          beforeUrls={review.beforePhotoUrls || []}
                          afterUrls={review.afterPhotoUrls || []}
                        />
                      </div>
                    ) : null}

                    {/* Firma Cevabı */}
                    {review.companyResponse && (
                      <div className="mt-4 ml-6 pl-4 border-l-2 border-brand-primary/30 bg-brand-primary/[0.03] rounded-r-lg py-3 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquareReply size={14} className="text-brand-primary" />
                          <span className="text-xs font-semibold text-brand-primary">
                            Firma Yanıtı
                          </span>
                          {review.companyRespondedAt && (
                            <span className="text-xs text-brand-text-muted">
                              · {formatDate(review.companyRespondedAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-brand-text leading-relaxed">
                          {review.companyResponse}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-brand-surface rounded-brand border border-brand-border">
                <Star size={40} className="mx-auto text-brand-text-muted/30 mb-3" />
                <p className="text-brand-text font-medium">Henüz değerlendirme yok</p>
                <p className="text-sm text-brand-text-muted mt-1">
                  Bu firmadan hizmet aldığınızda yorum bırakabilirsiniz.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sağ: Sidebar — Sipariş CTA (desktop only, mobilde bottom bar var) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20 space-y-4">
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
                <div className="flex items-center gap-2.5 text-sm text-brand-text-muted">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} className="text-green-600" />
                  </div>
                  <span>Güvenli ve sigortalı hizmet</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-brand-text-muted">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Truck size={16} className="text-blue-600" />
                  </div>
                  <span>Ücretsiz teslim alma ve bırakma</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-brand-text-muted">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <CreditCard size={16} className="text-amber-600" />
                  </div>
                  <span>Kapıda nakit veya kart ile ödeme</span>
                </div>
              </div>

              <Link
                href={`/${city || 'turkiye'}/${category || 'hali-yikama'}/${company.slug || company.companyId}/siparis`}
              >
                <Button size="lg" className="w-full text-base">
                  Sipariş Oluştur
                </Button>
              </Link>

              <p className="text-xs text-brand-text-muted text-center mt-3">
                Ürün türleri ve ölçüler firma tarafından belirlenir
              </p>
            </motion.div>

            {/* Servis Bölgeleri */}
            {company.serviceAreas && company.serviceAreas.length > 0 && (
              <motion.div
                className="p-4 bg-brand-surface rounded-brand border border-brand-border"
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
                className="p-4 bg-brand-surface rounded-brand border border-brand-border"
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

            {/* Çalışma Saatleri */}
            {company.workingHours && Object.keys(company.workingHours).length > 0 && (
              <motion.div
                className="p-4 bg-brand-surface rounded-brand border border-brand-border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h4 className="text-sm font-medium text-brand-text mb-2 flex items-center gap-1.5">
                  <Clock size={14} className="text-brand-primary" />
                  Çalışma Saatleri
                </h4>
                <div className="space-y-1">
                  {Object.entries(company.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-xs text-brand-text-muted">
                      <span>{day}</span>
                      <span>{hours as string}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar — sits above BottomNav (56px) */}
      <div className="fixed bottom-14 inset-x-0 z-40 lg:hidden bg-brand-surface/95 backdrop-blur-sm border-t border-brand-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-heading font-semibold text-brand-text truncate">{company.companyName}</p>
            {company.averageRating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-xs text-brand-text-muted">{company.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <Link href={`/${city || 'turkiye'}/${category || 'hali-yikama'}/${company.slug || company.companyId}/siparis`}>
            <Button size="lg" className="whitespace-nowrap px-6">
              Sipariş Oluştur
            </Button>
          </Link>
        </div>
      </div>
      {/* Bottom spacer for mobile (BottomNav 56px + CTA bar ~68px) */}
      <div className="h-32 lg:hidden" />

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
