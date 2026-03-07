import type { BrandFonts } from '@/types/brand';

/**
 * Google Fonts URL'si oluşturur.
 * Layout'ta <link> olarak enjekte edilir.
 */
export function getGoogleFontsUrl(fonts: BrandFonts): string {
  const families: string[] = [];

  const headingWeights = [fonts.headingWeight, 700, 900]
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort()
    .join(';');

  const bodyWeights = [fonts.bodyWeight, 400, 500, 600]
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort()
    .join(';');

  families.push(`family=${encodeURIComponent(fonts.heading)}:wght@${headingWeights}`);

  if (fonts.body !== fonts.heading) {
    families.push(`family=${encodeURIComponent(fonts.body)}:wght@${bodyWeights}`);
  }

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}
