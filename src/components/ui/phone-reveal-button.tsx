'use client';

import { useState } from 'react';
import { Phone, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { revealPhone } from '@/lib/api/companies';

interface PhoneRevealButtonProps {
  companyId: string;
  className?: string;
}

function parsePhones(raw: string): string[] {
  // Extract all phone numbers by finding digit sequences that form valid Turkish numbers
  // Turkish numbers: 0XXX XXX XX XX (11 digits) or 0XXX XXXXXXX etc.
  // Strip all non-digit chars first, then find 10-11 digit sequences starting with 0 or 90
  const digits = raw.replace(/[^\d\s\-()]/g, '');

  // Strategy: split by separators that indicate number boundaries
  // A dash/comma/slash between two digit groups = separator
  const parts = raw.split(/\s*[-–—,/;|]\s*(?=\s*0\d)/).map(p => p.trim()).filter(Boolean);

  if (parts.length > 1) {
    // Multiple numbers found via separator splitting
    return parts
      .map(p => p.replace(/\D/g, ''))
      .filter(d => d.length >= 10 && d.length <= 12);
  }

  // Fallback: extract all 10-12 digit sequences starting with 0 or 90
  const allDigits = raw.replace(/\D/g, '');

  // Try to find multiple numbers concatenated
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
      // Try 10-digit (without leading 0)
      numbers.push('0' + remaining.slice(0, 10));
      remaining = remaining.slice(10);
    }
  }

  return numbers.length > 0 ? numbers : [allDigits].filter(d => d.length >= 7);
}

function formatPhone(phone: string): string {
  // Format Turkish numbers: 05XX XXX XX XX
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

export function PhoneRevealButton({ companyId, className = '' }: PhoneRevealButtonProps) {
  const [loading, setLoading] = useState(false);
  const [phones, setPhones] = useState<string[] | null>(null);

  const handleClick = async () => {
    // If already revealed, toggle visibility
    if (phones) {
      setPhones(null);
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      const { phone } = await revealPhone(companyId);
      if (phone) {
        const parsed = parsePhones(phone);
        if (parsed.length === 1) {
          // Single number — call directly
          window.location.href = `tel:${cleanForTel(parsed[0])}`;
        } else if (parsed.length > 1) {
          // Multiple numbers — show selection
          setPhones(parsed);
        }
      }
    } catch {
      // Silently fail — phone not available
    } finally {
      setLoading(false);
    }
  };

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

      {/* Phone number list */}
      {phones && phones.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {phones.map((p, i) => (
            <a
              key={i}
              href={`tel:${cleanForTel(p)}`}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
            >
              <Phone size={14} className="text-green-600 shrink-0" />
              <span className="text-sm font-medium text-green-800">
                {formatPhone(p)}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
