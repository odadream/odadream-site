// Type workarounds for strict framer-motion versions or React 19 conflicts
type Transition = any;
type Variants = any;

// --- PHYSICS CONSTANTS ---

export const EASINGS = {
  // Mechanical, precise movement
  easeOutQuart: [0.165, 0.84, 0.44, 1] as [number, number, number, number],
  // Snappy, digital appearance
  easeOutExpo: [0.19, 1, 0.22, 1] as [number, number, number, number],
  // Cyberpunk "glitch" feel
  steps: (steps: number) => `steps(${steps}, end)`,
};

export const TRANSITIONS = {
  // Navigation layout changes
  layout: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
  } as Transition,

  // UI Elements appearing
  appear: {
    duration: 0.4,
    ease: EASINGS.easeOutExpo,
  } as Transition,

  // Page/Panel transitions
  page: {
    duration: 0.5,
    ease: EASINGS.easeOutQuart,
  } as Transition,

  // Quick UI feedback (hover, click)
  fast: {
    duration: 0.2,
    ease: "easeOut",
  } as Transition,
};

// --- SHARED VARIANTS ---

export const FADE_UP_VARIANTS: Variants = {
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

export const SCALE_FADE_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: TRANSITIONS.appear },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};
