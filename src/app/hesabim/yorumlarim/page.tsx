'use client';

import { Star, MessageSquare } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';

export default function YorumlarimPage() {
  // Yorumlar orders üzerinden gelecek — şimdilik placeholder
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-brand-text mb-6">
        Yorumlarım
      </h1>

      <div className="text-center py-12">
        <MessageSquare size={48} className="mx-auto text-brand-text-muted mb-4" />
        <h3 className="text-lg font-medium text-brand-text">
          Henüz yorumunuz yok
        </h3>
        <p className="text-brand-text-muted mt-1">
          Tamamlanan siparişleriniz için yorum bırakabilirsiniz.
        </p>
      </div>
    </div>
  );
}
