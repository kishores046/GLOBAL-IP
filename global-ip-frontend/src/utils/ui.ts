/**
 * Typography Utilities
 * Consistent text styles across the application
 */

export const typographyClasses = {
  // Headings
  h1: 'text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3',
  h3: 'text-2xl md:text-3xl font-semibold tracking-tight leading-snug mb-2',
  h4: 'text-xl md:text-2xl font-semibold tracking-tight leading-snug mb-2',
  h5: 'text-lg font-semibold leading-normal mb-1',
  h6: 'text-base font-semibold leading-normal mb-1',

  // Page title
  pageTitle: 'text-4xl md:text-5xl font-bold tracking-tight mb-4',
  sectionTitle: 'text-2xl md:text-3xl font-bold tracking-tight mb-3',
  subsectionTitle: 'text-lg md:text-xl font-semibold tracking-tight mb-2',

  // Body text
  bodyLarge: 'text-lg leading-relaxed',
  body: 'text-base leading-relaxed',
  bodySmall: 'text-sm leading-relaxed',
  bodyXs: 'text-xs leading-relaxed',

  // Labels and captions
  label: 'text-sm font-semibold tracking-wide',
  labelSmall: 'text-xs font-semibold tracking-widest uppercase',
  caption: 'text-xs font-medium text-muted-foreground uppercase tracking-wider',
  hint: 'text-xs text-muted-foreground',

  // Code
  code: 'font-mono text-sm bg-muted px-2 py-1 rounded',
  codeBlock: 'font-mono text-sm',

  // Special styles
  emphasis: 'font-semibold',
  highlight: 'bg-yellow-100 dark:bg-yellow-900/50 px-1 py-0.5 rounded',
  muted: 'text-muted-foreground',
  subtle: 'text-muted-foreground/75',
  bold: 'font-bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'line-through',

  // Lists
  listItem: 'text-base leading-relaxed',
  listItemSmall: 'text-sm leading-relaxed',

  // Form labels
  formLabel: 'text-sm font-semibold text-foreground mb-1',
  formHint: 'text-xs text-muted-foreground mt-1',

  // Error and success messages
  errorMessage: 'text-sm text-error font-medium',
  successMessage: 'text-sm text-success font-medium',
  warningMessage: 'text-sm text-warning font-medium',
  infoMessage: 'text-sm text-info font-medium',
};

/**
 * Spacing Utilities
 * Consistent spacing throughout the application
 */
export const spacingClasses = {
  // Page sections
  pageSection: 'py-8 sm:py-12 md:py-16 lg:py-20',
  pageSectionSmall: 'py-4 sm:py-6 md:py-8',
  pageSectionLarge: 'py-12 sm:py-16 md:py-24 lg:py-32',

  // Page padding
  pagePadding: 'px-4 sm:px-6 lg:px-8',
  pageHorizontalPadding: 'px-4 sm:px-6 lg:px-8',
  pageVerticalPadding: 'py-4 sm:py-6 lg:py-8',

  // Cards
  cardPadding: 'p-6',
  cardHeaderPadding: 'p-6',
  cardContentPadding: 'p-6 pt-0',
  cardFooterPadding: 'p-6 pt-0',

  // Gaps
  sectionGap: 'gap-6 sm:gap-8 lg:gap-10',
  cardGap: 'gap-4 sm:gap-6',
  elementGap: 'gap-2 sm:gap-3',
  lineGap: 'gap-1 sm:gap-1.5',

  // Margin
  marginTop: 'mt-4 sm:mt-6 lg:mt-8',
  marginBottom: 'mb-4 sm:mb-6 lg:mb-8',
  marginVertical: 'my-4 sm:my-6 lg:my-8',
  marginHorizontal: 'mx-4 sm:mx-6 lg:mx-8',

  // Padding
  paddingTop: 'pt-4 sm:pt-6 lg:pt-8',
  paddingBottom: 'pb-4 sm:pb-6 lg:pb-8',
  paddingVertical: 'py-4 sm:py-6 lg:py-8',
  paddingHorizontal: 'px-4 sm:px-6 lg:px-8',
};

/**
 * Container Utilities
 */
export const containerClasses = {
  // Containers
  container: 'mx-auto max-w-7xl',
  containerSmall: 'mx-auto max-w-3xl',
  containerLarge: 'mx-auto max-w-full',
  containerFluid: 'w-full',

  // Grids
  gridAuto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  gridAutoFit: 'grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  gridAutoFitLarge: 'grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3',
  gridTwoCol: 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6',
  gridThreeCol: 'grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6',

  // Flex
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-start justify-start',
  flexEnd: 'flex items-end justify-end',
  flexColumn: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',
};

/**
 * Elevation/Shadow Utilities
 */
export const elevationClasses = {
  elevated0: 'shadow-none',
  elevated1: 'shadow-sm',
  elevated2: 'shadow',
  elevated3: 'shadow-md',
  elevated4: 'shadow-lg',
  elevated5: 'shadow-xl',
  elevated6: 'shadow-2xl',

  // With hover effects
  hoverElevated: 'shadow-md hover:shadow-lg transition-shadow duration-300',
  interactive: 'shadow-sm hover:shadow-md active:shadow-sm transition-shadow duration-200',
};

/**
 * Border and Outline Utilities
 */
export const borderClasses = {
  // Border radius
  roundedNone: 'rounded-none',
  roundedSm: 'rounded-sm',
  roundedBase: 'rounded',
  roundedMd: 'rounded-md',
  roundedLg: 'rounded-lg',
  roundedXl: 'rounded-xl',
  rounded2xl: 'rounded-2xl',
  roundedFull: 'rounded-full',

  // Dividers
  divider: 'border-b border-border',
  dividerLeft: 'border-l border-border',
  dividerRight: 'border-r border-border',
  dividerTop: 'border-t border-border',

  // Outlines
  outline: 'border border-border',
  outlineThick: 'border-2 border-border',
  outlinePrimary: 'border border-primary',
  outlineSuccess: 'border border-success',
  outlineError: 'border border-error',
  outlineWarning: 'border border-warning',
};

/**
 * Transition and Animation Utilities
 */
export const transitionClasses = {
  // Basic transitions
  transition: 'transition duration-300',
  transitionFast: 'transition duration-200',
  transitionSlow: 'transition duration-500',

  // Color transitions
  transitionColor: 'transition-colors duration-300',
  transitionBg: 'transition-background-color duration-300',

  // Transform transitions
  transitionTransform: 'transition-transform duration-300',
  transitionOpacity: 'transition-opacity duration-300',

  // Complex transitions
  transitionAll: 'transition-all duration-300',
  transitionTheme: 'transition-colors duration-300',

  // Hover effects
  hoverBrighten: 'hover:brightness-110 transition-all duration-300',
  hoverDarken: 'hover:brightness-90 transition-all duration-300',
  hoverScale: 'hover:scale-105 transition-transform duration-300',
  hoverLift: 'hover:-translate-y-1 transition-transform duration-300',

  // Focus states
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  focusRingPrimary: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
};

/**
 * Accessibility Utilities
 */
export const a11yClasses = {
  // Screen readers
  srOnly: 'sr-only',
  srOnlyFocusable: 'sr-only focus:not-sr-only',

  // High contrast
  highContrast: 'contrast-125',

  // Reduced motion
  reduceMotion: 'motion-reduce:transition-none',

  // Focus indicators
  focusIndicator: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
};

/**
 * Responsive Utilities
 */
export const responsiveClasses = {
  // Mobile-first
  hideOnMobile: 'hidden sm:block',
  showOnMobile: 'sm:hidden',
  hideOnTablet: 'hidden md:block',
  showOnTablet: 'md:hidden',
  hideOnDesktop: 'hidden lg:block',
  showOnDesktop: 'lg:hidden',

  // Display
  hideXs: 'hidden',
  hideSm: 'sm:hidden',
  hideMd: 'md:hidden',
  hideLg: 'lg:hidden',
  hideXl: 'xl:hidden',
  hide2xl: '2xl:hidden',

  showXs: 'block',
  showSm: 'sm:block',
  showMd: 'md:block',
  showLg: 'lg:block',
  showXl: 'xl:block',
  show2xl: '2xl:block',
};

export default {
  typography: typographyClasses,
  spacing: spacingClasses,
  container: containerClasses,
  elevation: elevationClasses,
  border: borderClasses,
  transition: transitionClasses,
  a11y: a11yClasses,
  responsive: responsiveClasses,
};
