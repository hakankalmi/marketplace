'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  getNewsletterPreferences,
  updateNewsletterPreferences,
  unsubscribeNewsletter,
  type NewsletterPreferencesDto,
} from '@/lib/api/customer';

const FREQUENCY_OPTIONS = [
  { value: 1, label: 'Ayda bir', desc: 'Her ay en iyi fırsatlar' },
  { value: 3, label: '3 ayda bir', desc: 'Sezon geçişlerinde' },
  { value: 6, label: '6 ayda bir', desc: 'Yılda iki kez hatırlatma' },
  { value: 12, label: 'Yılda bir', desc: 'Sadece büyük kampanyalarda' },
];

const CHANNEL_OPTIONS = [
  { value: 'sms', label: 'SMS', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
  { value: 'email', label: 'E-posta', icon: Mail },
];

export default function BildirimlerPage() {
  const [prefs, setPrefs] = useState<NewsletterPreferencesDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [frequency, setFrequency] = useState(3);
  const [channels, setChannels] = useState<string[]>(['sms']);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const loadPreferences = useCallback(async () => {
    try {
      const data = await getNewsletterPreferences();
      setPrefs(data);
      setFrequency(data.frequencyMonths);
      setChannels(data.channels);
      setIsSubscribed(data.isSubscribed);
    } catch {
      // Silently fail — show default state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const toggleChannel = (ch: string) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSave = async () => {
    if (channels.length === 0) {
      toast.error('En az bir bildirim kanalı seçin.');
      return;
    }

    setSaving(true);
    try {
      const phone = localStorage.getItem('mp_customer_phone') || '';
      await updateNewsletterPreferences({
        phone,
        frequencyMonths: frequency,
        channels,
      });
      setIsSubscribed(true);
      toast.success('Bildirim tercihleriniz kaydedildi.');
    } catch {
      toast.error('Tercihler kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribe = async () => {
    setSaving(true);
    try {
      await unsubscribeNewsletter();
      setIsSubscribed(false);
      toast.success('Bildirim aboneliğiniz iptal edildi.');
    } catch {
      toast.error('İşlem başarısız. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-brand-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-brand-text">
          Bildirim Tercihleri
        </h1>
        <p className="text-sm text-brand-text-muted mt-1">
          Bölgenizdeki fırsat ve kampanyalardan nasıl haberdar olmak istediğinizi
          seçin.
        </p>
      </div>

      {/* Status */}
      {isSubscribed && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-brand">
          <CheckCircle size={18} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-800">
            Fırsat bildirimleri aktif. Tercihlerinizi aşağıdan güncelleyebilirsiniz.
          </p>
        </div>
      )}

      {/* Frequency */}
      <div className="bg-brand-surface rounded-brand border border-brand-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-brand-primary" />
          <h2 className="text-base font-heading font-semibold text-brand-text">
            Bildirim Sıklığı
          </h2>
        </div>
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

      {/* Channels */}
      <div className="bg-brand-surface rounded-brand border border-brand-border p-5">
        <h2 className="text-base font-heading font-semibold text-brand-text mb-4">
          Bildirim Kanalları
        </h2>
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1"
          loading={saving}
          onClick={handleSave}
          disabled={channels.length === 0}
        >
          {isSubscribed ? 'Tercihleri Güncelle' : 'Fırsat Bildirimlerine Abone Ol'}
        </Button>

        {isSubscribed && (
          <Button
            size="lg"
            variant="outline"
            className="flex-1 !border-brand-error !text-brand-error hover:!bg-brand-error hover:!text-white"
            loading={saving}
            onClick={handleUnsubscribe}
          >
            Aboneliği İptal Et
          </Button>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-brand-text-muted">
        Bildirim tercihlerinizi istediğiniz zaman bu sayfadan güncelleyebilir
        veya aboneliğinizi iptal edebilirsiniz.
      </p>
    </div>
  );
}
