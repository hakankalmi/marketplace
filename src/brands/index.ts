import type { BrandTheme } from '@/types/brand';
import { haliSepetiConfig } from './configs/hali_sepeti';

const brandRegistry: Record<string, BrandTheme> = {
  hali_sepeti: haliSepetiConfig,
};

/**
 * Marka koduna göre config döndürür.
 * Build-time'da NEXT_PUBLIC_BRAND_CODE env var'ından çözümlenir.
 */
export function getBrandConfig(code?: string): BrandTheme {
  const brandCode = code || process.env.NEXT_PUBLIC_BRAND_CODE || 'hali_sepeti';
  const config = brandRegistry[brandCode];

  if (!config) {
    throw new Error(
      `Brand config not found: "${brandCode}". Available brands: ${Object.keys(brandRegistry).join(', ')}`
    );
  }

  return config;
}

export function getAllBrandCodes(): string[] {
  return Object.keys(brandRegistry);
}
