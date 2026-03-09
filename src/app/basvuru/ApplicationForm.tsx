'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Monitor,
  Receipt,
  CheckCircle2,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';

// 81 il listesi (turkey-locations.ts'den)
const CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
];

interface FormData {
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  phone: string;
  email: string;
  city: string;
  serviceDistricts: string;
  hasTaxCertificate: boolean;
  currentSoftware: string;
  description: string;
}

const initialForm: FormData = {
  companyName: '',
  contactFirstName: '',
  contactLastName: '',
  phone: '',
  email: '',
  city: '',
  serviceDistricts: '',
  hasTaxCertificate: false,
  currentSoftware: '',
  description: '',
};

export function ApplicationForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (!form.companyName.trim()) e.companyName = 'Firma adı zorunludur';
    if (!form.contactFirstName.trim()) e.contactFirstName = 'Ad zorunludur';
    if (!form.contactLastName.trim()) e.contactLastName = 'Soyad zorunludur';
    if (!form.phone.trim()) e.phone = 'Telefon numarası zorunludur';
    else if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Geçerli bir telefon numarası giriniz';
    if (!form.email.trim()) e.email = 'E-posta zorunludur';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Geçerli bir e-posta adresi giriniz';
    if (!form.city) e.city = 'Şehir seçimi zorunludur';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      await api.post('/mp/applications', {
        companyName: form.companyName.trim(),
        contactFirstName: form.contactFirstName.trim(),
        contactLastName: form.contactLastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city,
        serviceDistricts: form.serviceDistricts.trim() || null,
        hasTaxCertificate: form.hasTaxCertificate,
        currentSoftware: form.currentSoftware.trim() || null,
        description: form.description.trim() || null,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { errorCode?: string; message?: string };
      if (error.errorCode === 'MARKETPLACE_APPLICATION_RATE_LIMITED') {
        setApiError('Çok fazla başvuru gönderdiniz. Lütfen daha sonra tekrar deneyin.');
      } else {
        setApiError('Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-brand-bg rounded-2xl border border-brand-border p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-heading font-bold text-brand-text mb-3">
          Başvurunuz Alındı!
        </h2>
        <p className="text-brand-text-muted leading-relaxed mb-6">
          Başvurunuz başarıyla iletildi. Ekibimiz en kısa sürede
          <strong className="text-brand-text"> WhatsApp </strong>
          üzerinden sizinle iletişime geçecektir.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-brand-text-muted">
          <MessageCircle size={16} className="text-green-600" />
          <span>Dönüşlerimiz WhatsApp üzerinden yapılmaktadır</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-bg rounded-2xl border border-brand-border p-6 sm:p-8">
      <h2 className="text-2xl font-heading font-bold text-brand-text mb-2 text-center">
        Firma Başvuru Formu
      </h2>
      <p className="text-brand-text-muted text-center mb-8 leading-relaxed">
        Aşağıdaki formu doldurun, ekibimiz <strong>WhatsApp</strong> üzerinden sizinle iletişime geçsin.
      </p>

      {apiError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {apiError}
        </div>
      )}

      <div className="space-y-5">
        {/* Firma Adı */}
        <Input
          label="Firma Adı *"
          placeholder="Örn: ABC Halı Yıkama"
          icon={<Building2 size={18} />}
          value={form.companyName}
          onChange={(e) => update('companyName', e.target.value)}
          error={errors.companyName}
        />

        {/* Ad Soyad */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Yetkili Adı *"
            placeholder="Ad"
            icon={<User size={18} />}
            value={form.contactFirstName}
            onChange={(e) => update('contactFirstName', e.target.value)}
            error={errors.contactFirstName}
          />
          <Input
            label="Yetkili Soyadı *"
            placeholder="Soyad"
            value={form.contactLastName}
            onChange={(e) => update('contactLastName', e.target.value)}
            error={errors.contactLastName}
          />
        </div>

        {/* Telefon + E-posta */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Telefon (WhatsApp) *"
            placeholder="05XX XXX XX XX"
            type="tel"
            icon={<Phone size={18} />}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            error={errors.phone}
          />
          <Input
            label="E-posta *"
            placeholder="info@firma.com"
            type="email"
            icon={<Mail size={18} />}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
        </div>

        {/* Şehir */}
        <div className="w-full">
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            Şehir *
          </label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
            <select
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 bg-brand-bg border rounded-brand text-brand-text transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary appearance-none ${
                errors.city ? 'border-brand-error' : 'border-brand-border'
              } ${!form.city ? 'text-brand-text-muted' : ''}`}
            >
              <option value="">Şehir seçiniz</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
          </div>
          {errors.city && <p className="mt-1 text-sm text-brand-error">{errors.city}</p>}
        </div>

        {/* Hizmet Bölgeleri */}
        <div className="w-full">
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            Hizmet Bölgeleri (İlçeler)
          </label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-3 text-brand-text-muted" />
            <textarea
              value={form.serviceDistricts}
              onChange={(e) => update('serviceDistricts', e.target.value)}
              placeholder="Hizmet verdiğiniz ilçeleri yazın (örn: Kadıköy, Ataşehir, Üsküdar)"
              rows={2}
              className="w-full pl-10 pr-4 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text placeholder:text-brand-text-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
            />
          </div>
        </div>

        {/* Vergi Levhası */}
        <div className="flex items-center gap-3 p-4 bg-brand-surface rounded-xl border border-brand-border/50">
          <button
            type="button"
            onClick={() => update('hasTaxCertificate', !form.hasTaxCertificate)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
              form.hasTaxCertificate ? 'bg-brand-primary' : 'bg-brand-border'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.hasTaxCertificate ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Receipt size={16} className="text-brand-text-muted" />
              <span className="text-sm font-medium text-brand-text">Vergi Levhası</span>
            </div>
            <p className="text-xs text-brand-text-muted mt-0.5">Vergi levhanız var mı?</p>
          </div>
        </div>

        {/* Kullanılan Program */}
        <Input
          label="Kullandığınız Program"
          placeholder="Entegrasyon için — örn: NegroPos, Halı Pratik, Portsis, Excel..."
          icon={<Monitor size={18} />}
          value={form.currentSoftware}
          onChange={(e) => update('currentSoftware', e.target.value)}
        />

        {/* Açıklama */}
        <div className="w-full">
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            Ek Bilgi / Açıklama
          </label>
          <div className="relative">
            <FileText size={18} className="absolute left-3 top-3 text-brand-text-muted" />
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Firmanız hakkında eklemek istediğiniz bilgiler..."
              rows={3}
              className="w-full pl-10 pr-4 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text placeholder:text-brand-text-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
            />
          </div>
        </div>

        {/* WhatsApp bilgisi */}
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-sm text-green-700 border border-green-200">
          <MessageCircle size={18} className="shrink-0" />
          <span>
            Dönüşlerimiz <strong>WhatsApp</strong> üzerinden yapılmaktadır. Lütfen WhatsApp kullandığınız numaranızı giriniz.
          </span>
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Başvuruyu Gönder
        </Button>

        <p className="text-xs text-brand-text-muted text-center">
          Başvurunuz ücretsizdir. Herhangi bir taahhüt gerektirmez.
        </p>
      </div>
    </form>
  );
}
