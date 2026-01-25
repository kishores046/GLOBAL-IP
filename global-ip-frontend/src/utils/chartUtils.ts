/**
 * Chart and Visualization Styling
 * Consistent color palettes, tooltips, and themes for all charts
 */

export const chartColorPalettes = {
  // Primary palette - suitable for most charts
  primary: {
    light: '#3b82f6',    // Blue 500
    dark: '#1e40af',     // Blue 800
    text: '#1f2937',     // Gray 800
  },

  // Comprehensive color palette for multi-series charts
  default: [
    '#3b82f6', // Blue
    '#10b981', // Green/Emerald
    '#f59e0b', // Amber/Orange
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#14b8a6', // Teal
  ],

  // Dark theme palette
  dark: [
    '#60a5fa', // Blue light
    '#4ade80', // Green light
    '#fbbf24', // Amber light
    '#f87171', // Red light
    '#a78bfa', // Purple light
    '#f472b6', // Pink light
    '#22d3ee', // Cyan light
    '#2dd4bf', // Teal light
  ],

  // Semantic colors
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },

  // Trend indicators
  trend: {
    positive: '#10b981',    // Green
    negative: '#ef4444',    // Red
    neutral: '#6b7280',     // Gray
    growth: '#3b82f6',      // Blue
    decline: '#f59e0b',     // Orange
  },

  // Sequential scales
  sequential: {
    light: ['#f0f9ff', '#dbeafe', '#bfdbfe', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7'],
    dark: ['#001f3f', '#003d82', '#005ba3', '#0284c7', '#38bdf8', '#7dd3fc', '#bfdbfe'],
  },

  // Diverging scales
  diverging: {
    red: ['#1e3a8a', '#3b82f6', '#dbeafe', '#fee2e2', '#ef4444', '#991b1b'],
    blueRed: ['#1e40af', '#3b82f6', '#f3f4f6', '#fee2e2', '#dc2626', '#7f1d1d'],
  },
};

/**
 * Chart configuration for consistency
 */
export const chartConfig = {
  // Tooltip styling
  tooltip: {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textColor: '#1f2937',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: '#334155',
      textColor: '#f8fafc',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
    },
  },

  // Grid styling
  grid: {
    light: {
      strokeColor: '#e5e7eb',
      strokeDasharray: '0',
      opacity: 0.5,
    },
    dark: {
      strokeColor: '#334155',
      strokeDasharray: '0',
      opacity: 0.5,
    },
  },

  // Axis styling
  axis: {
    light: {
      textColor: '#6b7280',
      lineColor: '#d1d5db',
      labelColor: '#374151',
    },
    dark: {
      textColor: '#94a3b8',
      lineColor: '#475569',
      labelColor: '#cbd5e1',
    },
  },

  // Legend styling
  legend: {
    light: {
      textColor: '#374151',
      backgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
    },
    dark: {
      textColor: '#e2e8f0',
      backgroundColor: '#1a202c',
      borderColor: '#334155',
    },
  },

  // Card styling
  card: {
    light: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      backgroundColor: '#1a202c',
      borderColor: '#334155',
      shadowColor: 'rgba(0, 0, 0, 0.3)',
    },
  },

  // Animation settings
  animation: {
    duration: 300,
    easing: 'ease-in-out',
    enabled: true,
  },

  // Responsive settings
  responsive: {
    containerHeight: 300,
    containerHeightLarge: 400,
    containerHeightSmall: 250,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  },
};

/**
 * Get chart theme colors based on current theme
 */
export const getChartTheme = (isDark: boolean) => {
  const theme = isDark ? 'dark' : 'light';
  return {
    colors: isDark ? chartColorPalettes.dark : chartColorPalettes.default,
    tooltip: chartConfig.tooltip[theme],
    grid: chartConfig.grid[theme],
    axis: chartConfig.axis[theme],
    legend: chartConfig.legend[theme],
    card: chartConfig.card[theme],
  };
};

/**
 * Recharts specific configuration
 */
export const rechartsConfig = {
  colors: chartColorPalettes.default,
  margin: { top: 20, right: 30, left: 0, bottom: 20 },
  
  // Tooltip configuration
  tooltip: {
    contentStyle: {
      backgroundColor: 'var(--color-bg-primary)',
      border: '1px solid var(--color-border)',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '0.75rem',
    },
    cursor: 'crosshair',
  },

  // Cartesian grid configuration
  cartesianGrid: {
    stroke: 'var(--color-border)',
    strokeDasharray: '0',
    vertical: false,
    opacity: 0.5,
  },

  // Axes configuration
  xAxis: {
    stroke: 'var(--color-border)',
    tick: { fill: 'var(--color-text-muted)' },
    label: { fill: 'var(--color-text-secondary)' },
    domain: ['dataMin - 5%', 'dataMax + 5%'],
  },

  yAxis: {
    stroke: 'var(--color-border)',
    tick: { fill: 'var(--color-text-muted)' },
    label: { fill: 'var(--color-text-secondary)', angle: -90, position: 'insideLeft' },
    domain: ['0', 'dataMax + 5%'],
  },

  // Legend configuration
  legend: {
    wrapperStyle: {
      paddingTop: '1rem',
    },
    iconType: 'line',
  },

  // Responsive container
  responsiveContainer: {
    width: '100%',
    height: 300,
  },
};

/**
 * Chart styling utilities
 */
export const chartUtils = {
  /**
   * Format axis label with units
   */
  formatAxisLabel: (value: number, unit?: string): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${unit ? ' ' + unit : ''}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${unit ? ' ' + unit : ''}`;
    }
    return `${value}${unit ? ' ' + unit : ''}`;
  },

  /**
   * Format tooltip value
   */
  formatTooltipValue: (value: number, formatter?: (v: number) => string): string => {
    return formatter ? formatter(value) : chartUtils.formatAxisLabel(value);
  },

  /**
   * Get color by index
   */
  getColorByIndex: (index: number, isDark: boolean = false): string => {
    const palette = isDark ? chartColorPalettes.dark : chartColorPalettes.default;
    return palette[index % palette.length];
  },

  /**
   * Get semantic color
   */
  getSemanticColor: (type: 'success' | 'error' | 'warning' | 'info'): string => {
    return chartColorPalettes.semantic[type];
  },

  /**
   * Lighten color
   */
  lightenColor: (color: string, amount: number = 0.2): string => {
    // Simple lightening - convert to hex, lighten, and return
    // This is a simplified version; use proper color library for production
    return color;
  },

  /**
   * Get contrasting text color
   */
  getContrastText: (backgroundColor: string, isDark: boolean = false): string => {
    return isDark ? '#f8fafc' : '#1f2937';
  },
};

/**
 * Common chart prop generators
 */
export const chartProps = {
  /**
   * Create tooltip props
   */
  getTooltipProps: (isDark: boolean) => ({
    contentStyle: {
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
      borderRadius: '0.5rem',
      boxShadow: isDark
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '0.75rem',
      color: isDark ? '#f8fafc' : '#1f2937',
    },
  }),

  /**
   * Create grid props
   */
  getGridProps: (isDark: boolean) => ({
    stroke: isDark ? '#334155' : '#e5e7eb',
    strokeDasharray: '0',
    vertical: false,
    opacity: 0.5,
  }),

  /**
   * Create axis props
   */
  getAxisProps: (isDark: boolean) => ({
    stroke: isDark ? '#475569' : '#d1d5db',
    tick: { fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 12 },
    axisLine: { stroke: isDark ? '#334155' : '#d1d5db' },
  }),

  /**
   * Create legend props
   */
  getLegendProps: () => ({
    wrapperStyle: {
      paddingTop: '1rem',
    },
    iconType: 'line',
  }),
};

export default {
  colorPalettes: chartColorPalettes,
  config: chartConfig,
  utils: chartUtils,
  props: chartProps,
  getTheme: getChartTheme,
  rechartsConfig,
};
