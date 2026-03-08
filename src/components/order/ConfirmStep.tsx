'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, FileText, AlertCircle, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoUploader } from '@/components/ui/photo-uploader';
import { createOrder } from '@/lib/api/orders';
import { isAuthenticated } from '@/lib/api/auth';
import { BRAND_CODE } from '@/lib/constants';
import { gtmEvent } from '@/components/shared/GtmLoader';
import type { CompanyDetailDto } from '@/lib/api/types';
import type { OrderFormData } from './OrderFlow';

interface Props {
  company: CompanyDetailDto;
  formData: OrderFormData;
  onBack: () => void;
  onSuccess: (orderCode: string) => void;
}

export function ConfirmStep({ company, formData, onBack, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [showPhotoSection, setShowPhotoSection] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  const handleSubmit = async () => {
    if (!loggedIn) {
      // Save form data before redirect so it survives the login flow
      try {
        sessionStorage.setItem('mp_order_form', JSON.stringify({ step: 2, data: formData }));
      } catch { /* quota exceeded */ }
      window.location.href = `/giris?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Combine date + time into ISO datetime with Turkey timezone offset
      const dateStr = formData.preferredPickupDate;
      const combineDateTime = (time?: string) =>
        dateStr && time ? `${dateStr}T${time}:00+03:00` : undefined;

      const result = await createOrder({
        companyId: company.companyId,
        brandCode: BRAND_CODE,
        addressId: formData.addressId,
        addressSnapshot: formData.addressSnapshot,
        city: formData.city,
        district: formData.district,
        latitude: formData.latitude,
        longitude: formData.longitude,
        preferredPickupDate: dateStr ? `${dateStr}T00:00:00+03:00` : undefined,
        preferredPickupTimeStart: combineDateTime(formData.preferredPickupTimeStart),
        preferredPickupTimeEnd: combineDateTime(formData.preferredPickupTimeEnd),
        items: [],
        customerNotes: formData.customerNotes || undefined,
        paymentMethod: 0, // CashOnDelivery
        source: 'web',
        beforePhotoUrls: beforePhotos.length > 0 ? beforePhotos : undefined,
      });
      gtmEvent('marketplace_order_created', {
        orderCode: result.marketplaceOrderCode,
        companyId: company.companyId,
        city: formData.city,
        hasPhotos: beforePhotos.length > 0,
      });
      onSuccess(result.marketplaceOrderCode);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSlot = () => {
    if (!formData.preferredPickupTimeStart) return null;
    return `${formData.preferredPickupTimeStart} - ${formData.preferredPickupTimeEnd}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-heading font-semibold text-brand-text mb-1">
          Sipariş Özeti
        </h2>
        <p className="text-sm text-brand-text-muted">
          Bilgileri kontrol edip siparişi onaylayın
        </p>
      </div>

      {/* Özet Kartı */}
      <div className="bg-brand-surface rounded-brand border border-brand-border divide-y divide-brand-border">
        {/* Firma */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-brand bg-brand-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-brand-primary">
              {company.companyName[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-brand-text">{company.companyName}</p>
            {company.city && (
              <p className="text-xs text-brand-text-muted">{company.city}</p>
            )}
          </div>
        </div>

        {/* Adres */}
        <div className="p-4 flex items-start gap-3">
          <MapPin size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-text">Adres</p>
            <p className="text-sm text-brand-text-muted">
              {formData.addressSnapshot}
            </p>
            <p className="text-xs text-brand-text-muted">
              {formData.district}, {formData.city}
            </p>
          </div>
        </div>

        {/* Tarih & Saat */}
        {formData.preferredPickupDate && (
          <div className="p-4 flex items-start gap-3">
            <Calendar size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-text">
                Tercih Edilen Tarih
              </p>
              <p className="text-sm text-brand-text-muted">
                {new Date(formData.preferredPickupDate).toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              {formatTimeSlot() && (
                <p className="text-sm text-brand-text-muted flex items-center gap-1 mt-0.5">
                  <Clock size={14} />
                  {formatTimeSlot()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Not */}
        {formData.customerNotes && (
          <div className="p-4 flex items-start gap-3">
            <FileText size={18} className="text-brand-text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-text">Not</p>
              <p className="text-sm text-brand-text-muted">
                {formData.customerNotes}
              </p>
            </div>
          </div>
        )}

        {/* Ödeme */}
        <div className="p-4">
          <p className="text-sm text-brand-text-muted">
            Ödeme: <strong className="text-brand-text">Kapıda Ödeme</strong>
          </p>
          <p className="text-xs text-brand-text-muted mt-1">
            Ürün türleri ve ölçüler firma tarafından kapıda belirlenecektir.
          </p>
        </div>
      </div>

      {/* Fotoğraf Ekleme — Oyunlaştırma */}
      {!showPhotoSection ? (
        <button
          onClick={() => setShowPhotoSection(true)}
          className="w-full p-3.5 rounded-brand border border-dashed border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/8 transition-colors flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
            <Camera size={18} className="text-brand-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-brand-text flex items-center gap-1">
              Fotoğraf Ekle
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                Opsiyonel
              </span>
            </p>
            <p className="text-xs text-brand-text-muted">
              Temizlik öncesi fotoğraf ekleyin, tamamlandığında sonrası ile kıyaslayın!
            </p>
          </div>
          <Sparkles size={16} className="text-amber-500 shrink-0" />
        </button>
      ) : (
        <div className="p-4 rounded-brand border border-brand-border bg-brand-surface">
          <PhotoUploader
            photos={beforePhotos}
            onChange={setBeforePhotos}
            type="before"
            label="Temizlik Öncesi Fotoğraflar"
            hint="Siparişiniz tamamlandığında sonrası ile kıyaslama yapabileceksiniz. En fazla 5 fotoğraf."
          />
        </div>
      )}

      {error && (
        <div className="p-3 bg-brand-error/10 rounded-brand text-sm text-brand-error flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {!loggedIn && (
        <div className="p-3 bg-brand-warning/10 rounded-brand text-sm text-brand-warning">
          Siparişi tamamlamak için giriş yapmanız gerekiyor.
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onBack}>
          Geri
        </Button>
        <Button
          size="lg"
          className="flex-1"
          loading={loading}
          onClick={handleSubmit}
        >
          {loggedIn ? 'Siparişi Gönder' : 'Giriş Yap & Gönder'}
        </Button>
      </div>
    </div>
  );
}
