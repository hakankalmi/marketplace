import type { BrandTheme, BorderRadius, ShadowIntensity } from '@/types/brand';

const radiusMap: Record<BorderRadius, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
};

const shadowMap: Record<ShadowIntensity, string> = {
  none: 'none',
  subtle: '0 1px 3px rgba(0,0,0,0.08)',
  medium: '0 4px 12px rgba(0,0,0,0.12)',
  dramatic: '0 8px 30px rgba(0,0,0,0.2)',
};

export function generateCSSVariables(theme: BrandTheme): string {
  const c = theme.colors;
  return `:root {
    --brand-primary: ${c.primary};
    --brand-primary-light: ${c.primaryLight};
    --brand-primary-dark: ${c.primaryDark};
    --brand-secondary: ${c.secondary};
    --brand-accent: ${c.accent};
    --brand-bg: ${c.background};
    --brand-surface: ${c.surface};
    --brand-surface-hover: ${c.surfaceHover};
    --brand-text: ${c.text};
    --brand-text-muted: ${c.textMuted};
    --brand-border: ${c.border};
    --brand-success: ${c.success};
    --brand-warning: ${c.warning};
    --brand-error: ${c.error};
    --brand-rating: ${c.rating};
    --brand-gradient: ${c.gradient || c.primary};
    --brand-radius: ${radiusMap[theme.borderRadius]};
    --brand-radius-sm: ${radiusMap[theme.borderRadius === 'none' ? 'none' : 'sm']};
    --brand-radius-lg: ${theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'sm' ? '8px' : theme.borderRadius === 'md' ? '16px' : '24px'};
    --brand-shadow: ${shadowMap[theme.shadowIntensity]};
    --brand-font-heading: '${theme.fonts.heading}', system-ui, sans-serif;
    --brand-font-body: '${theme.fonts.body}', system-ui, sans-serif;
  }`;
}

export function generateDarkCSSVariables(theme: BrandTheme): string {
  const dark = theme.darkColors;
  if (!dark) return '';

  const entries = Object.entries(dark)
    .filter(([, v]) => v !== undefined)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `    --brand-${cssKey}: ${value};`;
    })
    .join('\n');

  return `.dark {\n${entries}\n  }`;
}
