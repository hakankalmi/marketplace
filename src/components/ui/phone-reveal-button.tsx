'use client';

import { useState } from 'react';
import { Phone, Loader2, X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useBrand } from '@/lib/brand/context';
import { revealPhone } from '@/lib/api/companies';

interface PhoneRevealButtonProps {
  companyId: string;
  /** Current city slug for the "online sipariş kabul eden firmalar" link */
  citySlug?: string;
  /** Current category slug */
  categorySlug?: string;
  className?: string;
}

function parsePhones(raw: string): string[] {
  const parts = raw.split(/\s*[-–—,/;|]\s*(?=\s*0\d)/).map(p => p.trim()).filter(Boolean);

  if (parts.length > 1) {
    return parts
      .map(p => p.replace(/\D/g, ''))
      .filter(d => d.length >= 10 && d.length <= 12);
  }

  const allDigits = raw.replace(/\D/g, '');
  const numbers: string[] = [];
  let remaining = allDigits;

  while (remaining.length >= 10) {
    if (remaining.startsWith('90') && remaining.length >= 12) {
      numbers.push(remaining.slice(0, 12));
      remaining = remaining.slice(12);
    } else if (remaining.startsWith('0') && remaining.length >= 11) {
      numbers.push(remaining.slice(0, 11));
      remaining = remaining.slice(11);
    } else {
      numbers.push('0' + remaining.slice(0, 10));
      remaining = remaining.slice(10);
    }
  }

  return numbers.length > 0 ? numbers : [allDigits].filter(d => d.length >= 7);
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('90') && digits.length === 12) {
    const local = '0' + digits.slice(2);
    return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7, 9)} ${local.slice(9)}`;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  return phone;
}

function cleanForTel(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return '+90' + digits.slice(1);
  }
  if (digits.startsWith('90') && digits.length === 12) {
    return '+' + digits;
  }
  return '+' + digits;
}

export function PhoneRevealButton({ companyId, citySlug, categorySlug, className = '' }: PhoneRevealButtonProps) {
  const [loading, setLoading] = useState(false);
  const [phones, setPhones] = useState<string[] | null>(null);
  const brand = useBrand();

  const handleClick = async () => {
    if (phones) {
      setPhones(null);
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      const { phone, gsm } = await revealPhone(companyId);
      const allNumbers: string[] = [];
      if (phone) allNumbers.push(...parsePhones(phone));
      if (gsm) allNumbers.push(...parsePhones(gsm));
      const unique = [...new Map(allNumbers.map(n => [n.replace(/\D/g, ''), n])).values()];
      if (unique.length > 0) {
        setPhones(unique);
      }
    } catch {
      // Silently fail — phone not available
    } finally {
      setLoading(false);
    }
  };

  // Build the link for "online sipariş kabul eden firmalar" — always point to relevant listing with filter
  const cat = categorySlug || 'hali-yikama';
  const onlineOrdersHref = citySlug
    ? `/${citySlug}/${cat}?online=true`
    : `/turkiye/${cat}?online=true`;

  const domainDisplay = brand.domain || 'Haliyikamacilar.com';
  const brandDisplay = domainDisplay.charAt(0).toUpperCase() + domainDisplay.slice(1);

  return (
    <div className={`w-full mt-3 ${className}`}>
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : phones ? (
          <X size={16} />
        ) : (
          <Phone size={16} />
        )}
        {phones ? 'Kapat' : 'Ara & Sipariş Ver'}
      </Button>

      {/* Phone numbers + disclaimer — animated reveal */}
      <AnimatePresence>
        {phones && phones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 space-y-2">
              {/* Phone number cards */}
              {phones.map((p, i) => (
                <motion.a
                  key={i}
                  href={`tel:${cleanForTel(p)}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.25 }}
                  className="flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-all hover:shadow-sm active:scale-[0.98]"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-green-800 tracking-wide">
                    {formatPhone(p)}
                  </span>
                </motion.a>
              ))}

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phones.length * 0.08 + 0.1, duration: 0.3 }}
                className="relative p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl"
              >
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert size={12} className="text-amber-600" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] leading-[1.6] text-amber-800/80">
                      Bu işletme henüz <span className="font-semibold text-amber-900">{brandDisplay}</span> Online Sipariş
                      güvencesinde değildir. Telefonla yapılan görüşmeler ve anlaşmalar müşteri ile işletme
                      arasındadır ve platformumuzun herhangi bir güvence ve garantisini kapsamaz.
                    </p>
                    <Link
                      href={onlineOrdersHref}
                      className="inline-flex items-center text-[11px] font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
                    >
                      Online sipariş kabul eden güvenli işletmeleri görüntüleyin →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
