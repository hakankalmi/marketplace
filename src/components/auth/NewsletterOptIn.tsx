'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Phone, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL, BRAND_CODE } from '@/lib/constants';

const FREQUENCY_OPTIONS = [
  { value: 1, label: 'Ayda bir', desc: 'Her ay en iyi fırsatlar' },
  { value: 3, label: '3 ayda bir', desc: 'Sezon geçişlerinde' },
  { value: 6, label: '6 ayda bir', desc: 'Yılda iki kez hatırlatma' },
];

const CHANNEL_OPTIONS = [
  { value: 'sms', label: 'SMS', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
  { value: 'email', label: 'E-posta', icon: Mail },
];

interface NewsletterOptInProps {
  phone: string;
  onComplete: () => void;
}

export function NewsletterOptIn({ phone, onComplete }: NewsletterOptInProps) {
  const [frequency, setFrequency] = useState(3);
  const [channels, setChannels] = useState<string[]>(['sms']);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggleChannel = (ch: string) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSubscribe = async () => {
    if (channels.length === 0) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('mp_token');
      await fetch(`${API_URL}/api/mp/me/newsletter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Marketplace-Brand': BRAND_CODE,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          frequencyMonths: frequency,
          channels,
        }),
      });
      setDone(true);
      setTimeout(onComplete, 2000);
    } catch {
      // Non-critical — just proceed
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div
        key="done"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
        <p className="text-sm text-brand-text-muted">
          Tercihleriniz kaydedildi!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="newsletter"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="text-center mb-5">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <Bell size={24} className="text-brand-primary" />
        </div>
        <h2 className="text-lg font-heading font-bold text-brand-text">
          Fırsat Bildirimleri
        </h2>
        <p className="text-sm text-brand-text-muted mt-1">
          Bölgenizdeki en iyi halı yıkama fırsatlarından haberdar olun.
        </p>
      </div>

      {/* Frequency */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-brand-text-muted mb-2">
          Ne sıklıkla bildirim almak istersiniz?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFrequency(opt.value)}
              className={`p-2.5 rounded-brand border text-center transition-all ${
                frequency === opt.value
                  ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20'
                  : 'border-brand-border hover:border-brand-primary/40'
              }`}
            >
              <span className="block text-sm font-medium text-brand-text">
                {opt.label}
              </span>
              <span className="block text-[10px] text-brand-text-muted mt-0.5">
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-brand-text-muted mb-2">
          Hangi kanallardan bildirim istersiniz?
        </label>
        <div className="flex gap-2">
          {CHANNEL_OPTIONS.map((opt) => {
            const selected = channels.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleChannel(opt.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-brand border text-sm font-medium transition-all ${
                  selected
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary ring-2 ring-brand-primary/20'
                    : 'border-brand-border text-brand-text-muted hover:border-brand-primary/40'
                }`}
              >
                <opt.icon size={14} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={onComplete}
        >
          Atla
        </Button>
        <Button
          size="lg"
          className="flex-1"
          loading={loading}
          onClick={handleSubscribe}
          disabled={channels.length === 0}
        >
          Abone Ol
        </Button>
      </div>
    </motion.div>
  );
}
