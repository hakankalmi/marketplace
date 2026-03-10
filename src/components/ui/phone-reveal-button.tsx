'use client';

import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { revealPhone } from '@/lib/api/companies';

interface PhoneRevealButtonProps {
  companyId: string;
  className?: string;
}

export function PhoneRevealButton({ companyId, className = '' }: PhoneRevealButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { phone } = await revealPhone(companyId);
      if (phone) {
        window.location.href = `tel:${phone}`;
      }
    } catch {
      // Silently fail — phone not available
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={`w-full mt-3 ${className}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Phone size={16} />
      )}
      Ara & Sipariş Ver
    </Button>
  );
}
