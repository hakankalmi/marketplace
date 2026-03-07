'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createOrder } from '@/lib/api/orders';
import { isAuthenticated } from '@/lib/api/auth';
import { BRAND_CODE } from '@/lib/constants';
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

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  const handleSubmit = async () => {
    if (!loggedIn) {
      // Redirect to login with return URL
      window.location.href = `/giris?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await createOrder({
        companyId: company.companyId,
        brandCode: BRAND_CODE,
        addressId: formData.addressId,
        addressSnapshot: formData.addressSnapshot,
        city: formData.city,
        district: formData.district,
        preferredPickupDate: formData.preferredPickupDate || undefined,
        preferredPickupTimeStart: formData.preferredPickupTimeStart || undefined,
        preferredPickupTimeEnd: formData.preferredPickupTimeEnd || undefined,
        items: [],
        customerNotes: formData.customerNotes || undefined,
        paymentMethod: 'CashOnDelivery',
        source: 'web',
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
