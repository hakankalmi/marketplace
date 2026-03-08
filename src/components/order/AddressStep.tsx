'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapPin, AlertTriangle, Plus, Check, LocateFixed, Loader2, Navigation } from 'lucide-react';
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
  serviceAreas: string[];
  companyCity: string;
}

interface GeoState {
  loading: boolean;
  error: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  lat: number | null;
  lng: number | null;
}

/** Reverse geocode coordinates using Nominatim (free, no API key) */
async function reverseGeocode(lat: number, lng: number): Promise<{
  address: string;
  city: string;
  district: string;
}> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=tr`,
    { headers: { 'User-Agent': 'ProTakip-Marketplace/1.0' } }
  );
  if (!res.ok) throw new Error('Konum bilgisi alınamadı');
  const data = await res.json();
  const addr = data.address || {};

  // In Turkey: county = ilçe (district), suburb = mahalle (neighbourhood)
  const district =
    addr.county || addr.town || addr.city_district || '';
  const city =
    addr.province || addr.state || addr.city || '';

  // Build a readable address string
  const parts = [
    addr.road,
    addr.neighbourhood || addr.quarter,
    addr.suburb,
  ].filter(Boolean);
  const address = parts.length > 0 ? parts.join(', ') : data.display_name?.split(',').slice(0, 3).join(',') || '';

  return { address, city, district };
}

/** Normalize district name for comparison (lowercase, trim, remove common suffixes) */
function normalizeDistrict(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/i̇/g, 'i') // Turkish İ normalization
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g');
}

/** Check if a district matches any service area */
function isDistrictCompatible(district: string, serviceAreas: string[]): boolean {
  if (!district || serviceAreas.length === 0) return true; // no filter = compatible
  const normalized = normalizeDistrict(district);
  return serviceAreas.some((sa) => normalizeDistrict(sa) === normalized);
}

export function AddressStep({ formData, onUpdate, onNext, serviceAreas: rawServiceAreas, companyCity }: Props) {
  const serviceAreas = useMemo(() => [...new Set(rawServiceAreas)], [rawServiceAreas]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    formData.addressId || null
  );
  const [manualAddress, setManualAddress] = useState(formData.addressSnapshot);
  const [city, setCity] = useState(formData.city || companyCity);
  const [district, setDistrict] = useState(formData.district);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [geo, setGeo] = useState<GeoState>({
    loading: false, error: null, address: null, city: null, district: null, lat: null, lng: null,
  });

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo((p) => ({ ...p, error: 'Tarayıcınız konum özelliğini desteklemiyor.' }));
      return;
    }
    setGeo((p) => ({ ...p, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const result = await reverseGeocode(latitude, longitude);

          // Auto-fill form fields
          setManualAddress(result.address);
          setCity(result.city || companyCity);

          // If the GPS district matches a service area, auto-select it
          if (result.district && serviceAreas.length > 0) {
            const match = serviceAreas.find(
              (sa) => normalizeDistrict(sa) === normalizeDistrict(result.district)
            );
            if (match) setDistrict(match);
            else setDistrict(result.district);
          } else if (result.district) {
            setDistrict(result.district);
          }

          setGeo({
            loading: false, error: null,
            address: result.address, city: result.city, district: result.district,
            lat: latitude, lng: longitude,
          });
          setSelectedAddressId(null);
          setShowNewAddressForm(true);
        } catch {
          setGeo((p) => ({ ...p, loading: false, error: 'Adres bilgisi alınamadı. Manuel girin.' }));
        }
      },
      (err) => {
        const msg =
          err.code === 1
            ? 'Konum izni verilmedi. Lütfen tarayıcı ayarlarından izin verin.'
            : err.code === 2
              ? 'Konum bilgisi alınamadı. GPS açık olduğundan emin olun.'
              : 'Konum isteği zaman aşımına uğradı.';
        setGeo((p) => ({ ...p, loading: false, error: msg }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, [companyCity, serviceAreas]);

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    enabled: isLoggedIn,
  });

  // Split addresses into compatible and incompatible
  const { compatibleAddresses, incompatibleAddresses } = useMemo(() => {
    if (!addresses || serviceAreas.length === 0) {
      return { compatibleAddresses: addresses || [], incompatibleAddresses: [] as AddressDto[] };
    }
    const compatible: AddressDto[] = [];
    const incompatible: AddressDto[] = [];
    for (const addr of addresses) {
      if (isDistrictCompatible(addr.district, serviceAreas)) {
        compatible.push(addr);
      } else {
        incompatible.push(addr);
      }
    }
    return { compatibleAddresses: compatible, incompatibleAddresses: incompatible };
  }, [addresses, serviceAreas]);

  const hasAddresses = addresses && addresses.length > 0;
  const hasCompatible = compatibleAddresses.length > 0;
  const showIncompatibleWarning = isLoggedIn && hasAddresses && !hasCompatible && !showNewAddressForm;

  const handleSelectAddress = (addr: AddressDto) => {
    setSelectedAddressId(addr.id);
    setManualAddress(addr.fullAddress);
    setCity(addr.city);
    setDistrict(addr.district);
    setShowNewAddressForm(false);
  };

  const handleSelectDistrict = (d: string) => {
    setDistrict(d);
  };

  const handleStartNewAddress = () => {
    setSelectedAddressId(null);
    setManualAddress('');
    setCity(companyCity);
    setDistrict('');
    setShowNewAddressForm(true);
  };

  const isManualMode = !isLoggedIn || !selectedAddressId || showNewAddressForm;
  const canProceed =
    manualAddress.trim().length > 5 &&
    city.trim().length > 0 &&
    (serviceAreas.length === 0 || district.trim().length > 0);

  const handleNext = () => {
    onUpdate({
      addressId: selectedAddressId || undefined,
      addressSnapshot: manualAddress.trim(),
      city: city.trim(),
      district: district.trim(),
      latitude: geo.lat || undefined,
      longitude: geo.lng || undefined,
    });
    onNext();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-heading font-semibold text-brand-text mb-1">
          Adres Bilgileri
        </h2>
        <p className="text-sm text-brand-text-muted">
          Hizmet alacağınız adresi girin
        </p>
      </div>

      {/* Uyumlu Kayıtlı Adresler */}
      {isLoggedIn && hasCompatible && !showNewAddressForm && (
        <div>
          <p className="text-sm font-medium text-brand-text mb-2">
            Kayıtlı Adreslerim
          </p>
          <div className="space-y-2">
            {compatibleAddresses.map((addr) => (
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
                        ? 'text-brand-primary mt-0.5 shrink-0'
                        : 'text-brand-text-muted mt-0.5 shrink-0'
                    }
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-brand-text truncate">
                        {addr.label}
                      </p>
                      {addr.district && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary/8 text-brand-primary shrink-0">
                          {addr.district}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-text-muted mt-0.5 line-clamp-2">
                      {addr.fullAddress}
                    </p>
                  </div>
                  {selectedAddressId === addr.id && (
                    <Check size={16} className="text-brand-primary shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleStartNewAddress}
            className="mt-3 flex items-center gap-1.5 text-sm text-brand-primary hover:underline mx-auto"
          >
            <Plus size={14} />
            Farklı adres gir
          </button>
        </div>
      )}

      {/* Uyumsuz Adres Uyarısı */}
      {showIncompatibleWarning && (
        <div className="space-y-3">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-brand">
            <div className="flex gap-3">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Mevcut adresleriniz bu firmanın hizmet bölgesinde değil
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Kayıtlı adreslerinizdeki ilçeler bu firmanın servis alanı dışında.
                  Firmanın hizmet verdiği bölgelerden bir adres ekleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Show incompatible addresses (dimmed) */}
          {incompatibleAddresses.length > 0 && (
            <div className="opacity-50">
              <p className="text-xs text-brand-text-muted mb-2">
                Uyumsuz adresleriniz:
              </p>
              {incompatibleAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-2.5 rounded-brand border border-brand-border mb-1.5 flex items-start gap-2"
                >
                  <MapPin size={14} className="text-brand-text-muted mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-brand-text truncate">{addr.label}</p>
                    <p className="text-[10px] text-brand-text-muted">
                      {addr.district} — hizmet bölgesi dışında
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={handleStartNewAddress}
          >
            <Plus size={16} />
            Yeni Adres Ekle
          </Button>
        </div>
      )}

      {/* No saved addresses at all — go straight to manual */}
      {isLoggedIn && !hasAddresses && !showNewAddressForm && (
        <div className="p-3 bg-brand-surface rounded-brand border border-brand-border text-center">
          <p className="text-sm text-brand-text-muted mb-2">
            Henüz kayıtlı adresiniz yok.
          </p>
          <button
            onClick={handleStartNewAddress}
            className="text-sm text-brand-primary hover:underline"
          >
            Adres bilgilerini girin
          </button>
        </div>
      )}

      {/* Manuel Adres Girişi */}
      {isManualMode && (showNewAddressForm || !isLoggedIn || (!hasAddresses && !hasCompatible)) && (
        <div className="space-y-4">
          {/* GPS Konum Butonu */}
          <button
            onClick={handleGetLocation}
            disabled={geo.loading}
            className="w-full p-3.5 rounded-brand border border-dashed border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/8 transition-colors flex items-center gap-3 disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              {geo.loading ? (
                <Loader2 size={18} className="text-brand-primary animate-spin" />
              ) : (
                <Navigation size={18} className="text-brand-primary" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-brand-text">
                {geo.loading ? 'Konum alınıyor...' : 'Konumumu Kullan'}
              </p>
              <p className="text-xs text-brand-text-muted">
                GPS ile adresinizi otomatik doldurun
              </p>
            </div>
            <LocateFixed size={16} className="text-brand-primary/50 shrink-0 ml-auto" />
          </button>

          {geo.error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-brand text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              {geo.error}
            </div>
          )}

          {geo.lat && !geo.error && (
            <div className="p-2.5 bg-green-50 border border-green-200 rounded-brand text-xs text-green-700 flex items-center gap-2">
              <Check size={14} className="shrink-0" />
              Konum başarıyla alındı. Gerekirse aşağıdan düzenleyebilirsiniz.
            </div>
          )}

          <Input
            label="Şehir"
            value={city}
            readOnly
            className="bg-brand-surface cursor-default opacity-75"
          />

          {/* İlçe Seçimi — Firmanın servis bölgelerinden */}
          {serviceAreas.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                İlçe Seçin
              </label>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => handleSelectDistrict(area)}
                    className={`px-3 py-2 text-sm rounded-full border transition-all ${
                      district === area
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-brand-bg text-brand-text border-brand-border hover:border-brand-primary/40'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              {district && (
                <p className="text-xs text-brand-text-muted mt-1.5">
                  Seçilen ilçe: <span className="font-medium text-brand-text">{district}</span>
                </p>
              )}
            </div>
          ) : (
            <Input
              label="İlçe"
              placeholder="İlçe giriniz"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          )}

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

      {/* Show button only when not showing the incompatible warning (that has its own CTA) */}
      {!showIncompatibleWarning && (
        <Button
          size="lg"
          className="w-full"
          disabled={!canProceed}
          onClick={handleNext}
        >
          Devam Et
        </Button>
      )}
    </div>
  );
}
