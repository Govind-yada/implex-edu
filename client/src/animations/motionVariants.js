/**
 * Centralized Motion Variants & Animation Utilities
 * Built with Framer Motion for Implex Edu
 * Highly optimized, GPU-friendly (transform & opacity only), respects reduced-motion
 */

export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
  },
  smooth: {
    type: 'tween',
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.5,
  },
  fast: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.25,
  },
  slow: {
    type: 'tween',
    ease: [0.16, 1, 0.3, 1],
    duration: 0.75,
  },
};

export const fadeIn = (direction = 'up', delay = 0, duration = 0.5) => {
  return {
    hidden: {
      y: direction === 'up' ? 24 : direction === 'down' ? -24 : 0,
      x: direction === 'left' ? 24 : direction === 'right' ? -24 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
});

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const cardHover = {
  rest: { y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  hover: {
    y: -6,
    scale: 1.01,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.15 } },
  tap: { scale: 0.96, transition: { duration: 0.1 } },
};

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const modalVariants = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  dialog: {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 8,
      transition: { duration: 0.2 },
    },
  },
};

export const toastVariants = {
  initial: { opacity: 0, y: 24, scale: 0.92 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export const heroTextStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const heroWord = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
