'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { BrandTheme } from '@/types/brand';

interface BrandContextValue {
  theme: BrandTheme;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({
  theme,
  children,
}: {
  theme: BrandTheme;
  children: ReactNode;
}) {
  return (
    <BrandContext.Provider value={{ theme }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandTheme {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within BrandProvider');
  return ctx.theme;
}
