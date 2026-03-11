import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

export function toTitleCase(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/(?:^|\s)\S/g, (c) => c.toLocaleUpperCase('tr-TR'));
}

const categoryNames: Record<string, string> = {
  'hali-yikama': 'Halı Yıkama',
  'koltuk-yikama': 'Koltuk Yıkama',
  'yorgan-yikama': 'Yorgan & Battaniye Yıkama',
  'perde-yikama': 'Perde Yıkama',
  'yatak-yikama': 'Yatak Yıkama',
  'ev-temizligi': 'Ev Temizliği',
  'ofis-temizligi': 'Ofis Temizliği',
};

export function getCategoryDisplayName(slug: string): string {
  return categoryNames[slug] || decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** Map category slug to backend CategoryId (MarketplaceProductCategory enum) */
const categorySlugToId: Record<string, number> = {
  'hali-yikama': 1,
  'koltuk-yikama': 2,
  'yorgan-yikama': 3,
  'perde-yikama': 4,
  'yatak-yikama': 5,
  'ev-temizligi': 7,
  'ofis-temizligi': 7,
};

export function getCategoryId(slug: string): number | undefined {
  return categorySlugToId[slug];
}

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
