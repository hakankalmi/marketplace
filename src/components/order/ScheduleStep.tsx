'use client';

import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { OrderFormData } from './OrderFlow';

interface Props {
  formData: OrderFormData;
  onUpdate: (data: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const timeSlots = [
  { label: '09:00 - 12:00', start: '09:00', end: '12:00' },
  { label: '12:00 - 15:00', start: '12:00', end: '15:00' },
  { label: '15:00 - 18:00', start: '15:00', end: '18:00' },
  { label: '18:00 - 21:00', start: '18:00', end: '21:00' },
];

export function ScheduleStep({ formData, onUpdate, onNext, onBack }: Props) {
  const [date, setDate] = useState(formData.preferredPickupDate);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(() => {
    if (formData.preferredPickupTimeStart) {
      return timeSlots.findIndex(
        (s) => s.start === formData.preferredPickupTimeStart
      );
    }
    return null;
  });
  const [notes, setNotes] = useState(formData.customerNotes);

  // Min date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleNext = () => {
    const slot = selectedSlot !== null ? timeSlots[selectedSlot] : null;
    onUpdate({
      preferredPickupDate: date,
      preferredPickupTimeStart: slot?.start || '',
      preferredPickupTimeEnd: slot?.end || '',
      customerNotes: notes.trim(),
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-heading font-semibold text-brand-text mb-1">
          Tarih & Not
        </h2>
        <p className="text-sm text-brand-text-muted">
          Tercih ettiğiniz teslim alma tarihini seçin
        </p>
      </div>

      {/* Tarih */}
      <div>
        <Input
          label="Tercih Edilen Tarih"
          type="date"
          icon={<Calendar size={18} />}
          value={date}
          min={minDate}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Saat Aralığı */}
      <div>
        <label className="block text-sm font-medium text-brand-text mb-2">
          Saat Aralığı
        </label>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelectedSlot(i)}
              className={`flex items-center justify-center gap-2 p-3 rounded-brand border text-sm transition-colors ${
                selectedSlot === i
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-medium'
                  : 'border-brand-border text-brand-text-muted hover:border-brand-primary/30'
              }`}
            >
              <Clock size={14} />
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Müşteri Notu */}
      <div>
        <label className="block text-sm font-medium text-brand-text mb-1.5">
          Not (isteğe bağlı)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Firmaya iletmek istediğiniz notları yazın..."
          rows={3}
          maxLength={1000}
          className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
        />
        <p className="mt-1 text-xs text-brand-text-muted text-right">
          {notes.length}/1000
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onBack}>
          Geri
        </Button>
        <Button size="lg" className="flex-1" onClick={handleNext}>
          Devam Et
        </Button>
      </div>
    </div>
  );
}
