'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAddresses } from '@/lib/api/customer';
import { isAuthenticated } from '@/lib/api/auth';
import type { OrderFormData } from './OrderFlow';
import type { AddressDto } from '@/lib/api/types';

interface Props {
  formData: OrderFormData;
  onUpdate: (data: Partial<OrderFormData>) => void;
  onNext: () => void;
}

export function AddressStep({ formData, onUpdate, onNext }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    formData.addressId || null
  );
  const [manualAddress, setManualAddress] = useState(formData.addressSnapshot);
  const [city, setCity] = useState(formData.city);
  const [district, setDistrict] = useState(formData.district);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    enabled: isLoggedIn,
  });

  const handleSelectAddress = (addr: AddressDto) => {
    setSelectedAddressId(addr.id);
    setManualAddress(addr.fullAddress);
    setCity(addr.city);
    setDistrict(addr.district);
  };

  const canProceed = manualAddress.trim().length > 5 && city.trim().length > 0;

  const handleNext = () => {
    onUpdate({
      addressId: selectedAddressId || undefined,
      addressSnapshot: manualAddress.trim(),
      city: city.trim(),
      district: district.trim(),
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-heading font-semibold text-brand-text mb-1">
          Adres Bilgileri
        </h2>
        <p className="text-sm text-brand-text-muted">
          Hizmet alacağınız adresi girin
        </p>
      </div>

      {/* Kayıtlı Adresler */}
      {isLoggedIn && addresses && addresses.length > 0 && (
        <div>
          <p className="text-sm font-medium text-brand-text mb-2">
            Kayıtlı Adreslerim
          </p>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`w-full text-left p-3 rounded-brand border transition-colors ${
                  selectedAddressId === addr.id
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-brand-border hover:border-brand-primary/30'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className={
                      selectedAddressId === addr.id
                        ? 'text-brand-primary mt-0.5'
                        : 'text-brand-text-muted mt-0.5'
                    }
                  />
                  <div>
                    <p className="text-sm font-medium text-brand-text">
                      {addr.title}
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      {addr.fullAddress}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                setSelectedAddressId(null);
                setManualAddress('');
                setCity('');
                setDistrict('');
              }}
              className="text-sm text-brand-primary hover:underline"
            >
              Farklı adres gir
            </button>
          </div>
        </div>
      )}

      {/* Manuel Adres Girişi */}
      {(!isLoggedIn || !selectedAddressId) && (
        <div className="space-y-4">
          <Input
            label="Şehir"
            placeholder="Şehir giriniz"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            label="İlçe"
            placeholder="İlçe giriniz"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">
              Adres Detayı
            </label>
            <textarea
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Mahalle, sokak, bina no, daire no..."
              rows={3}
              className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
            />
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="p-3 bg-brand-warning/10 rounded-brand text-sm text-brand-warning">
          Sipariş vermek için giriş yapmanız gerekecek. Bir sonraki adımda
          telefon numaranızla hızlıca giriş yapabilirsiniz.
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        disabled={!canProceed}
        onClick={handleNext}
      >
        Devam Et
      </Button>
    </div>
  );
}
