'use client';

import { useState } from 'react';
import { Phone, Mail, Bell, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { API_URL, BRAND_CODE } from '@/lib/constants';

const FREQUENCY_OPTIONS = [
  { value: '1', label: 'Ayda bir', desc: 'Her ay en iyi fırsatlar' },
  { value: '3', label: '3 ayda bir', desc: 'Sezon geçişlerinde' },
  { value: '6', label: '6 ayda bir', desc: 'Yılda iki kez hatırlatma' },
  { value: '12', label: 'Yılda bir', desc: 'Sadece büyük kampanyalarda' },
];

const CHANNEL_OPTIONS = [
  { value: 'sms', label: 'SMS', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
  { value: 'email', label: 'E-posta', icon: Mail },
];

export function FirsatForm() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('3');
  const [channels, setChannels] = useState<string[]>(['sms']);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleChannel = (ch: string) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Geçerli bir telefon numarası girin.');
      return;
    }
    if (channels.length === 0) {
      setError('En az bir bildirim kanalı seçin.');
      return;
    }
    if (channels.includes('email') && !email.includes('@')) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/mp/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Marketplace-Brand': BRAND_CODE,
        },
        body: JSON.stringify({
          phone: cleaned,
          email: email || null,
          frequencyMonths: parseInt(frequency),
          channels,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Bir hata oluştu.');
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-brand-surface rounded-brand border border-brand-border p-8 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-heading font-bold text-brand-text mb-2">
          Abone Oldunuz!
        </h2>
        <p className="text-brand-text-muted text-sm max-w-sm mx-auto">
          Tercihleriniz kaydedildi. Bölgenizdeki en iyi fırsatları{' '}
          {frequency === '1'
            ? 'her ay'
            : frequency === '3'
              ? '3 ayda bir'
              : frequency === '6'
                ? '6 ayda bir'
                : 'yılda bir'}{' '}
          {channels.includes('whatsapp')
            ? 'WhatsApp'
            : channels.includes('sms')
              ? 'SMS'
              : 'e-posta'}{' '}
          ile ileteceğiz.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-surface rounded-brand border border-brand-border p-6 sm:p-8 space-y-6"
    >
      {/* Phone */}
      <Input
        label="Telefon Numarası *"
        type="tel"
        placeholder="05XX XXX XX XX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        icon={<Phone size={18} />}
      />

      {/* Email (optional) */}
      <Input
        label="E-posta (opsiyonel)"
        type="email"
        placeholder="ornek@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail size={18} />}
      />

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-brand-text mb-2">
          <Bell size={14} className="inline mr-1.5 -mt-0.5" />
          Ne sıklıkla bildirim almak istersiniz?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFrequency(opt.value)}
              className={`p-3 rounded-brand border text-left transition-all ${
                frequency === opt.value
                  ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20'
                  : 'border-brand-border hover:border-brand-primary/40'
              }`}
            >
              <span className="block text-sm font-medium text-brand-text">
                {opt.label}
              </span>
              <span className="block text-xs text-brand-text-muted mt-0.5">
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Channel */}
      <div>
        <label className="block text-sm font-medium text-brand-text mb-2">
          Hangi kanallardan bildirim almak istersiniz?
        </label>
        <div className="flex flex-wrap gap-2">
          {CHANNEL_OPTIONS.map((opt) => {
            const selected = channels.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleChannel(opt.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-brand border text-sm font-medium transition-all ${
                  selected
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary ring-2 ring-brand-primary/20'
                    : 'border-brand-border text-brand-text-muted hover:border-brand-primary/40'
                }`}
              >
                <opt.icon size={16} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-brand px-4 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" size="lg" loading={loading} className="w-full">
        Fırsat Bildirimlerine Abone Ol
      </Button>
    </form>
  );
}
