'use client';

import { useState, useMemo } from 'react';
import { Calendar, Clock, Info, ChevronLeft, ChevronRight } from 'lucide-react';
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

const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][date.getDay()];
  return `${d} ${monthNames[m - 1]} ${y}, ${dayName}`;
}

export function ScheduleStep({ formData, onUpdate, onNext, onBack }: Props) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayStr = useMemo(() => toDateStr(today), [today]);

  const tomorrowStr = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return toDateStr(d);
  }, [today]);

  // Default to tomorrow if no date selected
  const [date, setDate] = useState(formData.preferredPickupDate || tomorrowStr);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = formData.preferredPickupDate ? new Date(formData.preferredPickupDate) : new Date(today);
    if (!formData.preferredPickupDate) d.setDate(d.getDate() + 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const [selectedSlot, setSelectedSlot] = useState<number | null>(() => {
    if (formData.preferredPickupTimeStart) {
      return timeSlots.findIndex(
        (s) => s.start === formData.preferredPickupTimeStart
      );
    }
    return null;
  });
  const [notes, setNotes] = useState(formData.customerNotes);

  // Quick date options: today + next 6 days
  const quickDates = useMemo(() => {
    const dates: { label: string; dateStr: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dateStr = toDateStr(d);
      let label: string;
      if (i === 0) label = 'Bugün';
      else if (i === 1) label = 'Yarın';
      else {
        const dayIdx = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][d.getDay()];
        label = `${dayIdx}, ${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}`;
      }
      dates.push({ label, dateStr });
    }
    return dates;
  }, [today]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday = 0
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const days: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
    return days;
  }, [calendarMonth]);

  const isDateDisabled = (dateStr: string) => dateStr < todayStr;

  const handleSelectDate = (dateStr: string) => {
    if (!isDateDisabled(dateStr)) {
      setDate(dateStr);
      setShowCalendar(false);
    }
  };

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

  const prevMonth = () => {
    setCalendarMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCalendarMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const isPrevDisabled = calendarMonth.year === today.getFullYear() && calendarMonth.month <= today.getMonth();

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

      {/* Tarih Seçimi */}
      <div>
        <label className="block text-sm font-medium text-brand-text mb-2">
          Tercih Edilen Tarih
        </label>

        {/* Quick date chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {quickDates.map(({ label, dateStr }) => (
            <button
              key={dateStr}
              onClick={() => handleSelectDate(dateStr)}
              className={`shrink-0 px-3 py-2 rounded-brand border text-sm transition-colors ${
                date === dateStr
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-medium'
                  : 'border-brand-border text-brand-text-muted hover:border-brand-primary/30'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-brand border text-sm transition-colors ${
              !quickDates.some((q) => q.dateStr === date) && date
                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-medium'
                : 'border-brand-border text-brand-text-muted hover:border-brand-primary/30'
            }`}
          >
            <Calendar size={14} />
            Diğer
          </button>
        </div>

        {/* Selected date display */}
        {date && (
          <p className="mt-2 text-sm text-brand-text">
            <span className="text-brand-text-muted">Seçilen:</span>{' '}
            {formatDisplayDate(date)}
          </p>
        )}

        {/* Calendar dropdown */}
        {showCalendar && (
          <div className="mt-3 p-4 border border-brand-border rounded-brand bg-brand-bg">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={prevMonth}
                disabled={isPrevDisabled}
                aria-label="Önceki ay"
                className="p-1 rounded hover:bg-brand-surface disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} className="text-brand-text" />
              </button>
              <span className="text-sm font-medium text-brand-text">
                {monthNames[calendarMonth.month]} {calendarMonth.year}
              </span>
              <button
                onClick={nextMonth}
                aria-label="Sonraki ay"
                className="p-1 rounded hover:bg-brand-surface"
              >
                <ChevronRight size={18} className="text-brand-text" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs text-brand-text-muted font-medium py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const disabled = isDateDisabled(dateStr);
                const selected = date === dateStr;
                const isToday = dateStr === todayStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => handleSelectDate(dateStr)}
                    disabled={disabled}
                    className={`w-full aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                      selected
                        ? 'bg-brand-primary text-white font-medium'
                        : disabled
                          ? 'text-brand-text-muted/30 cursor-not-allowed'
                          : isToday
                            ? 'text-brand-primary font-medium hover:bg-brand-primary/10'
                            : 'text-brand-text hover:bg-brand-surface'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
        <div className="mt-3 flex gap-2.5 p-3 bg-brand-primary/5 border border-brand-primary/15 rounded-brand">
          <Info size={16} className="text-brand-primary shrink-0 mt-0.5" />
          <p className="text-xs text-brand-text-muted leading-relaxed">
            Saat tercihiniz firmaya iletilecektir. Ancak siparişler, firmanın
            servis güzergahına ve sipariş yoğunluğuna göre toplanmaktadır.
            Net bir saat vermek mümkün olmayabilir. Firma, adresinize gelmeden
            önce mutlaka sizi arayıp teyitleşecektir.
          </p>
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
