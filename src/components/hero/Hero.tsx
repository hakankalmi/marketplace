'use client';

import { useBrand } from '@/lib/brand/context';
import { HeroSplit } from './variants/HeroSplit';
import { HeroFullbleed } from './variants/HeroFullbleed';
import { HeroCentered } from './variants/HeroCentered';

const heroMap = {
  fullbleed: HeroFullbleed,
  split: HeroSplit,
  centered: HeroCentered,
  video: HeroCentered,
  'animated-search': HeroCentered,
} as const;

export function Hero() {
  const theme = useBrand();
  const Component = heroMap[theme.heroVariant];
  return <Component />;
}
