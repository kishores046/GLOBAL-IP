/**
 * Enhanced Design System
 * Professional brand colors, typography, spacing, and semantic color system
 * Supports both light and dark themes with comprehensive accessibility
 */

// Color Palette
export const colors = {
  // Primary Brand (Professional Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main brand color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Secondary (Complementary)
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    light: '#d1fae5',
    DEFAULT: '#10b981',
    600: '#16a34a',
    dark: '#065f46',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    600: '#d97706',
    dark: '#92400e',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    600: '#dc2626',
    dark: '#991b1b',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    600: '#2563eb',
    dark: '#1e40af',
  },

  // Neutrals - Light Theme
  neutral: {
    light: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Dark Theme
    dark: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },

  // Background Colors
  background: {
    light: '#ffffff',
    lightAlt: '#f9fafb',
    dark: '#0f172a',
    darkAlt: '#1e293b',
    darkCard: '#1a202c',
  },

  // Chart/Visualization Colors
  chart: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    warning: '#ef4444',
    info: '#0ea5e9',
    success: '#10b981',
    dark1: '#4f46e5',
    dark2: '#8b5cf6',
    dark3: '#ec4899',
  },
};

// Typography System
export const typography = {
  // Font families
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    secondary: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Heading Styles
  headings: {
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      marginBottom: '1.5rem',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      marginBottom: '1.25rem',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.005em',
      marginBottom: '1rem',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
      marginBottom: '0.875rem',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.5,
      marginBottom: '0.75rem',
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.5,
      marginBottom: '0.5rem',
    },
  },

  // Body Text Styles
  body: {
    large: {
      fontSize: '1.125rem', // 18px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em',
    },
    base: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em',
    },
    small: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    xs: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
  },

  // Label & Caption Styles
  labels: {
    large: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
    base: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
    small: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
  },

  // Code Styles
  code: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
    fontFamily: '"Fira Code", monospace',
    letterSpacing: '0.02em',
  },

  // Tailwind CSS Class Strings
  classes: {
    h1: 'text-4xl font-bold tracking-tight leading-tight md:text-5xl',
    h2: 'text-3xl font-bold tracking-tight leading-tight md:text-4xl',
    h3: 'text-2xl font-semibold tracking-tight leading-snug md:text-3xl',
    h4: 'text-xl font-semibold tracking-tight leading-snug',
    h5: 'text-lg font-semibold tracking-tight',
    h6: 'text-base font-semibold tracking-tight',

    bodyLarge: 'text-lg leading-relaxed',
    body: 'text-base leading-relaxed',
    bodySmall: 'text-sm leading-relaxed',
    bodyXs: 'text-xs leading-relaxed',

    label: 'text-sm font-semibold tracking-wide',
    labelSmall: 'text-xs font-semibold tracking-widest uppercase',
    caption: 'text-xs font-medium text-muted-foreground uppercase tracking-wide',
    code: 'font-mono text-sm bg-muted px-2 py-1 rounded',
  },
};

// Spacing System (8px base unit)
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px

  // Common combinations
  page: '2rem',           // Page padding
  sectionGap: '2.5rem',   // Gap between sections
  cardPadding: '1.5rem',  // Card internal padding
  cardGap: '1.5rem',      // Gap between cards
  elementGap: '1rem',     // Gap between elements
};

// Shadows
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Dark theme shadows
  dark: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  },

  // Tailwind CSS classes
  classes: {
    none: 'shadow-none',
    xs: 'shadow-sm',
    sm: 'shadow-sm',
    base: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
};

// Border Radius
export const radius = {
  none: '0',
  xs: '0.25rem',   // 4px
  sm: '0.375rem',  // 6px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  full: '9999px',

  // Tailwind CSS classes
  classes: {
    none: 'rounded-none',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    base: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  },
};

// Breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-Index Scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  backdrop: 1300,
  offcanvas: 1400,
  modal: 1500,
  popover: 1600,
  tooltip: 1700,
};

// Transitions
export const transitions = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    ease: 'ease',
  },
};

// Accessibility
export const a11y = {
  // WCAG AAA contrast ratios
  contrast: {
    light: {
      text: '#000000',           // Pure black on light background
      mutedText: '#333333',      // Dark gray on light background
      border: '#cccccc',         // Medium gray borders
    },
    dark: {
      text: '#ffffff',           // Pure white on dark background
      mutedText: '#e5e5e5',      // Light gray on dark background
      border: '#404040',         // Dark gray borders
    },
  },

  // Focus states
  focusRing: '2px solid #3b82f6 offset 2px',
  focusOutline: 'outline-2 outline-offset-2 outline-blue-500',
};

// Complete Design System Export
export const designSystem = {
  colors,
  typography,
  spacing,
  shadows,
  radius,
  breakpoints,
  zIndex,
  transitions,
  a11y,
};

export default designSystem;
