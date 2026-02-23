import { motion } from "framer-motion";

// --- TYPE HELPERS ---
// Workaround for React 19 / Framer Motion strict type conflicts
export const MotionDiv = motion.div as any;
export const MotionButton = motion.button as any;
export const MotionHeader = motion.header as any;
export const MotionFooter = motion.footer as any;

// --- DRAWER PHYSICS CONSTANTS ---

export const DRAWER = {
  /** Fraction of panel height user must drag past to trigger snap (0–1) */
  snapThreshold: 0.3,

  /** Minimum swipe velocity (px/ms) to trigger snap regardless of distance */
  velocityThreshold: 0.5,

  /** CSS variable name for panel height — keep in sync with index.css */
  heightVar: "--lotus-panel-height",
} as const;

// --- PHYSICS CONSTANTS ---

export const EASINGS = {
  // Mechanical, precise movement
  easeOutQuart: [0.165, 0.84, 0.44, 1] as [number, number, number, number],
  // Snappy, digital appearance
  easeOutExpo: [0.19, 1, 0.22, 1] as [number, number, number, number],
};

export const TRANSITIONS = {
  // Navigation layout changes (Heavy, needs spring)
  layout: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
  },

  // UI Elements appearing
  appear: {
    duration: 0.4,
    ease: EASINGS.easeOutExpo,
  },

  // Page/Panel transitions
  page: {
    duration: 0.5,
    ease: EASINGS.easeOutQuart,
  },

  // Quick UI feedback (hover, click)
  fast: {
    duration: 0.2,
    ease: "easeOut",
  },

  // Drawer open/close — GPU-only translateY, no reflow
  drawer: {
    type: "spring" as const,
    stiffness: 400,
    damping: 38,
    mass: 0.8,
  },

  // Lotus Grid cell transitions - optimized for smooth cross-dissolve
  cell: {
    duration: 0.5,
    ease: "easeOut",
  },

  // Image grayscale transitions
  imageGrayscale: {
    duration: 0.7,
    ease: "easeOut",
  },
};

// --- SHARED VARIANTS ---

export const FADE_UP_VARIANTS = {
  initial: { opacity: 0, y: 15, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: TRANSITIONS.page,
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(2px)",
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export const SCALE_FADE_VARIANTS = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: TRANSITIONS.appear },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

// Optimized cell variants for smooth cross-dissolve transitions
export const CELL_VARIANTS = {
  initial: {
    opacity: 0,
    zIndex: 10, // Incoming sits ON TOP
  },
  animate: {
    opacity: 1,
    zIndex: 10,
    transition: TRANSITIONS.cell,
  },
  exit: {
    opacity: 0,
    zIndex: 0, // Outgoing sits BELOW
    transition: {
      duration: TRANSITIONS.cell.duration,
      ease: "easeIn",
    },
  },
};
