/**
 * Design System - Color Palette
 * Professional brand colors and semantic color system
 */

export const designSystem = {
  // Primary Brand (Professional Blue)
  colors: {
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
    
    // Semantic Colors
    success: {
      light: '#d1fae5',
      DEFAULT: '#10b981',
      dark: '#065f46',
    },
    warning: {
      light: '#fef3c7',
      DEFAULT: '#f59e0b',
      dark: '#92400e',
    },
    error: {
      light: '#fee2e2',
      DEFAULT: '#ef4444',
      dark: '#991b1b',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#1e40af',
    },
    
    // Neutrals
    gray: {
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
  },

  // Typography Scale
  typography: {
    h1: 'text-4xl font-bold tracking-tight text-gray-900',
    h2: 'text-3xl font-bold tracking-tight text-gray-900',
    h3: 'text-2xl font-semibold text-gray-900',
    h4: 'text-xl font-semibold text-gray-900',
    h5: 'text-lg font-semibold text-gray-900',
    h6: 'text-base font-semibold text-gray-900',
    
    bodyLarge: 'text-base text-gray-700',
    body: 'text-sm text-gray-700',
    bodySmall: 'text-xs text-gray-600',
    
    caption: 'text-xs text-gray-500 uppercase tracking-wide',
    code: 'font-mono text-sm bg-gray-100 px-1 py-0.5 rounded',
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    DEFAULT: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    inner: 'shadow-inner',
  },

  // Border Radius
  radius: {
    sm: 'rounded-sm',
    DEFAULT: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
};

export default designSystem;
