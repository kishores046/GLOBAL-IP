/**
 * Animations and Transitions
 * Smooth, professional animations for UI interactions
 */

/**
 * CSS animations keyframes
 */
export const keyframes = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },

  // Slide animations
  slideInFromTop: {
    from: {
      transform: 'translateY(-10px)',
      opacity: 0,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  slideInFromBottom: {
    from: {
      transform: 'translateY(10px)',
      opacity: 0,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  slideInFromLeft: {
    from: {
      transform: 'translateX(-10px)',
      opacity: 0,
    },
    to: {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
  slideInFromRight: {
    from: {
      transform: 'translateX(10px)',
      opacity: 0,
    },
    to: {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },

  // Scale animations
  scaleIn: {
    from: {
      transform: 'scale(0.95)',
      opacity: 0,
    },
    to: {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  scaleOut: {
    from: {
      transform: 'scale(1)',
      opacity: 1,
    },
    to: {
      transform: 'scale(0.95)',
      opacity: 0,
    },
  },

  // Bounce animations
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },

  // Shimmer/loading animation
  shimmer: {
    '0%': {
      backgroundPosition: '-1000px 0',
    },
    '100%': {
      backgroundPosition: '1000px 0',
    },
  },

  // Rotate animation
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },

  // Color shift
  colorShift: {
    '0%': { color: 'inherit' },
    '50%': { color: 'rgba(59, 130, 246, 0.7)' },
    '100%': { color: 'inherit' },
  },

  // Gradient animation
  gradientShift: {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },

  // Modal animations
  modalSlideIn: {
    from: {
      transform: 'translateY(20px)',
      opacity: 0,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },

  // Tooltip animations
  tooltipSlideIn: {
    from: {
      transform: 'translateY(-5px)',
      opacity: 0,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },

  // Underline animation
  underlineGrow: {
    from: {
      transform: 'scaleX(0)',
      transformOrigin: 'left',
    },
    to: {
      transform: 'scaleX(1)',
      transformOrigin: 'left',
    },
  },

  // Check animation
  checkmark: {
    '0%': { strokeDasharray: '30', strokeDashoffset: '30' },
    '100%': { strokeDasharray: '30', strokeDashoffset: '0' },
  },
};

/**
 * Transition durations (milliseconds)
 */
export const durations = {
  instant: 0,
  fastest: 150,
  fast: 200,
  base: 300,
  normal: 350,
  slow: 500,
  slower: 700,
  slowest: 1000,
};

/**
 * Easing functions
 */
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

/**
 * Transition utilities
 */
export const transitions = {
  // Quick transitions
  quick: `all ${durations.fast}ms ${easing.easeOut}`,
  quickColor: `color ${durations.fast}ms ${easing.easeOut}`,
  quickBackground: `background-color ${durations.fast}ms ${easing.easeOut}`,
  quickTransform: `transform ${durations.fast}ms ${easing.easeOut}`,
  quickOpacity: `opacity ${durations.fast}ms ${easing.easeOut}`,
  quickShadow: `box-shadow ${durations.fast}ms ${easing.easeOut}`,

  // Standard transitions
  standard: `all ${durations.base}ms ${easing.easeInOut}`,
  color: `color ${durations.base}ms ${easing.easeInOut}`,
  background: `background-color ${durations.base}ms ${easing.easeInOut}`,
  transform: `transform ${durations.base}ms ${easing.easeInOut}`,
  opacity: `opacity ${durations.base}ms ${easing.easeInOut}`,
  shadow: `box-shadow ${durations.base}ms ${easing.easeInOut}`,
  border: `border-color ${durations.base}ms ${easing.easeInOut}`,

  // Slow transitions
  slow: `all ${durations.slow}ms ${easing.easeInOut}`,
  slowColor: `color ${durations.slow}ms ${easing.easeInOut}`,
  slowBackground: `background-color ${durations.slow}ms ${easing.easeInOut}`,
  slowTransform: `transform ${durations.slow}ms ${easing.easeInOut}`,
  slowOpacity: `opacity ${durations.slow}ms ${easing.easeInOut}`,

  // Multiple properties
  multi: `color ${durations.base}ms ${easing.easeInOut}, background-color ${durations.base}ms ${easing.easeInOut}, border-color ${durations.base}ms ${easing.easeInOut}`,
  theme: `background-color ${durations.base}ms ${easing.easeInOut}, color ${durations.base}ms ${easing.easeInOut}, border-color ${durations.base}ms ${easing.easeInOut}`,
};

/**
 * Tailwind CSS animation utilities
 */
export const animationClasses = {
  // Fade
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-300',

  // Slide
  slideIn: 'animate-in slide-in-from-bottom-2 duration-300',
  slideInTop: 'animate-in slide-in-from-top-2 duration-300',
  slideInLeft: 'animate-in slide-in-from-left-2 duration-300',
  slideInRight: 'animate-in slide-in-from-right-2 duration-300',

  // Scale
  scaleIn: 'animate-in zoom-in-75 duration-300',
  scaleOut: 'animate-out zoom-out-75 duration-300',

  // Pulse
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  spin: 'animate-spin',

  // Combined
  modal: 'animate-in fade-in zoom-in-95 duration-300',
  dropdown: 'animate-in fade-in slide-in-from-top-2 duration-200',
  tooltip: 'animate-in fade-in slide-in-from-bottom-1 duration-150',
  popover: 'animate-in fade-in zoom-in-90 duration-200',
};

/**
 * Hover effect utilities
 */
export const hoverEffects = {
  // Transform effects
  lift: 'hover:-translate-y-1 transition-transform duration-300',
  scale: 'hover:scale-105 transition-transform duration-300',
  scaleDown: 'hover:scale-95 transition-transform duration-300',

  // Color effects
  brighten: 'hover:brightness-110 transition-all duration-300',
  darken: 'hover:brightness-90 transition-all duration-300',
  textColor: 'hover:text-primary transition-colors duration-300',

  // Shadow effects
  shadow: 'hover:shadow-lg transition-shadow duration-300',
  shadowLg: 'hover:shadow-xl transition-shadow duration-300',
  shadowMd: 'hover:shadow-md transition-shadow duration-300',

  // Combined effects
  card: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
  button: 'hover:shadow-md active:shadow-sm transition-all duration-200',
  link: 'hover:text-primary hover:underline transition-colors duration-300',
};

/**
 * Focus effect utilities
 */
export const focusEffects = {
  ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ringPrimary: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  ringNoOffset: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
};

/**
 * Scroll animation utilities
 */
export const scrollAnimations = {
  fadeInUp: 'scroll-mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500',
  fadeInLeft: 'scroll-mt-20 animate-in fade-in slide-in-from-left-4 duration-500',
  fadeInRight: 'scroll-mt-20 animate-in fade-in slide-in-from-right-4 duration-500',
};

/**
 * Loading/skeleton animation utilities
 */
export const loadingAnimations = {
  shimmer: 'animate-pulse',
  skeleton: 'bg-muted animate-pulse',
  wave: 'animate-pulse',
};

/**
 * Generate inline animation styles
 */
export const createAnimationStyle = (
  animationName: string,
  duration: number = durations.base,
  easingFunc: string = easing.easeInOut,
  delay: number = 0,
  iterationCount: number = 1
): React.CSSProperties => ({
  animation: `${animationName} ${duration}ms ${easingFunc} ${delay}ms ${iterationCount === Infinity ? 'infinite' : iterationCount}`,
});

/**
 * Stagger animation helper
 */
export const createStaggerDelay = (index: number, delayUnit: number = 50): number => {
  return index * delayUnit;
};

/**
 * Animation presets for common use cases
 */
export const presets = {
  pageEnter: {
    duration: durations.base,
    easing: easing.easeOut,
    delay: 0,
  },
  pageExit: {
    duration: durations.fast,
    easing: easing.easeIn,
    delay: 0,
  },
  cardEnter: {
    duration: durations.normal,
    easing: easing.easeOut,
    delay: 100,
  },
  modalEnter: {
    duration: durations.base,
    easing: easing.easeOut,
    delay: 0,
  },
  dropdownEnter: {
    duration: durations.fastest,
    easing: easing.easeOut,
    delay: 0,
  },
  tooltipEnter: {
    duration: durations.fastest,
    easing: easing.easeOut,
    delay: 100,
  },
};

export default {
  keyframes,
  durations,
  easing,
  transitions,
  animationClasses,
  hoverEffects,
  focusEffects,
  scrollAnimations,
  loadingAnimations,
  presets,
};
