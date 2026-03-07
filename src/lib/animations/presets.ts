import type { Variants } from 'framer-motion';
import type { AnimationStyle } from '@/types/brand';

/* ───── Fade In Up ───── */

const fadeInUpVariants: Record<AnimationStyle, Variants> = {
  subtle: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  },
  playful: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  },
  professional: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
  dramatic: {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

/* ───── Stagger Container ───── */

const staggerContainerVariants: Record<AnimationStyle, Variants> = {
  subtle: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  },
  playful: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  },
  professional: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  },
  dramatic: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  },
};

/* ───── Scale ───── */

const scaleVariants: Record<AnimationStyle, Variants> = {
  subtle: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  },
  playful: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
  },
  professional: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  },
  dramatic: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
};

/* ───── Hover ───── */

export const cardHoverVariants: Record<AnimationStyle, { scale?: number; y?: number }> = {
  subtle: { y: -2 },
  playful: { scale: 1.03, y: -4 },
  professional: { y: -3 },
  dramatic: { scale: 1.02, y: -6 },
};

/* ───── Exports ───── */

export function getFadeInUp(style: AnimationStyle): Variants {
  return fadeInUpVariants[style];
}

export function getStaggerContainer(style: AnimationStyle): Variants {
  return staggerContainerVariants[style];
}

export function getScale(style: AnimationStyle): Variants {
  return scaleVariants[style];
}
