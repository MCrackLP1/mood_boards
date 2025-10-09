/**
 * Canvas Animation Variants for Framer Motion
 * Organic, spring-like animations for the Customer View
 */

export const canvasTimings = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
};

export const canvasEasing = {
  enter: [0.34, 1.56, 0.64, 1] as [number, number, number, number], // Spring
  exit: [0.4, 0, 0.2, 1] as [number, number, number, number],         // EaseOut
  anticipate: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
};

// Zone hover animation
export const zoneHover = {
  scale: 1.03,
  y: -8,
  transition: {
    duration: canvasTimings.base,
    ease: canvasEasing.exit,
  },
};

// Zone entrance animation (staggered)
export const zoneEnter = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: canvasTimings.slow,
      ease: canvasEasing.enter,
      delay: custom * 0.06, // 60ms stagger
    },
  }),
};

// Panel open animation
export const panelOpen = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: canvasTimings.slow,
      ease: canvasEasing.enter,
    },
  },
};

// Panel close animation
export const panelClose = {
  opacity: 0,
  scale: 0.98,
  filter: 'blur(4px)',
  transition: {
    duration: canvasTimings.base,
    ease: canvasEasing.exit,
  },
};

// Stagger container for children
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04, // 40ms between children
      delayChildren: 0.1,
    },
  },
};

// Individual stagger item
export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: canvasTimings.base,
      ease: canvasEasing.exit,
    },
  },
};

// Fade in/out
export const fadeInOut = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: canvasTimings.base },
};

// Overlay backdrop
export const overlayBackdrop = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(12px)',
    transition: { duration: canvasTimings.base },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: canvasTimings.fast },
  },
};

