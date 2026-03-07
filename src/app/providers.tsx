'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { BrandProvider } from '@/lib/brand/context';
import type { BrandTheme } from '@/types/brand';

export function Providers({
  theme,
  children,
}: {
  theme: BrandTheme;
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <BrandProvider theme={theme}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: 'var(--brand-font-body)',
              },
            }}
          />
        </BrandProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
