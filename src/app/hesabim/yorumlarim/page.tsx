'use client';

import { MessageSquare } from 'lucide-react';

export default function YorumlarimPage() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-heading font-bold text-brand-text mb-4 sm:mb-6">
        Yorumlarım
      </h1>

      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={28} className="text-brand-primary" />
        </div>
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
