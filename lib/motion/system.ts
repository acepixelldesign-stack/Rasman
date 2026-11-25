import type { Transition, Variants } from 'motion/react';

/**
 * Rasman Unified Calm Motion Design System
 * ---------------------------------------------------------------------------
 * Single source of truth for Framer Motion (`motion/react`) and GSAP timing,
 * easing curves, stagger choreography, and reusable directional variants.
 *
 * Philosophy:
 * - Zero overshoot / zero elastic bounce — serene architectural glide
 * - Harmonic durations (0.18s -> 0.28s -> 0.42s -> 0.56s -> 0.72s)
 * - Automatic LTR/RTL directional mirroring via `createDirectionalItemVariants`
 * - Respects OS `prefers-reduced-motion` via global `<MotionConfig reducedMotion="user">`
 */

export const MOTION_EASE = {
  /** Primary calm architectural decel curve (smooth settling, zero bounce) */
  calm: [0.22, 1, 0.36, 1] as const,
  /** Extended silk Expo-Out curve for large sheets, drawers, and route stages */
  silk: [0.16, 1, 0.3, 1] as const,
  /** Quiet acceleration for exits so surfaces recede cleanly */
  exit: [0.4, 0, 1, 1] as const,
  /** Matching GSAP easing identifier for timeline parity */
  gsapCalm: 'power3.out' as const,
} as const;

export const MOTION_DURATION = {
  micro: 0.2,
  fast: 0.28,
  base: 0.42,
  calm: 0.54,
  slow: 0.72,
  exit: 0.22,
  ambient: 0.52,
} as const;

export const MOTION_STAGGER = {
  tight: 0.045,
  base: 0.065,
  relaxed: 0.085,
} as const;

export const MOTION_TRANSITIONS = {
  micro: {
    duration: MOTION_DURATION.micro,
    ease: MOTION_EASE.calm,
  } satisfies Transition,
  fast: {
    duration: MOTION_DURATION.fast,
    ease: MOTION_EASE.calm,
  } satisfies Transition,
  base: {
    duration: MOTION_DURATION.base,
    ease: MOTION_EASE.calm,
  } satisfies Transition,
  calm: {
    duration: MOTION_DURATION.calm,
    ease: MOTION_EASE.silk,
  } satisfies Transition,
  slow: {
    duration: MOTION_DURATION.slow,
    ease: MOTION_EASE.silk,
  } satisfies Transition,
  exit: {
    duration: MOTION_DURATION.exit,
    ease: MOTION_EASE.exit,
  } satisfies Transition,
  layout: {
    duration: MOTION_DURATION.base,
    ease: MOTION_EASE.calm,
  } satisfies Transition,
} as const;

export const MOTION_VARIANTS = {
  /** Global Next.js route transition (used in app/template.tsx) */
  page: {
    hidden: {
      opacity: 0,
      y: 8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_DURATION.base,
        ease: MOTION_EASE.calm,
      },
    },
  } satisfies Variants,

  /** Full-frame frosted backdrop & navigation drawer overlay */
  overlay: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: MOTION_DURATION.base,
        ease: MOTION_EASE.silk,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: MOTION_DURATION.exit,
        ease: MOTION_EASE.exit,
      },
    },
  } satisfies Variants,

  /** Full remaining viewport height sheet below header + 48px floating bar */
  sheetFull: {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: 'calc(100dvh - var(--grid-header) - var(--grid-bottom) - 48px)',
      opacity: 1,
      transition: {
        height: { duration: MOTION_DURATION.base, ease: MOTION_EASE.silk },
        opacity: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.calm },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: MOTION_EASE.calm },
        opacity: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
      },
    },
  } satisfies Variants,

  /** Content-fitted sliding drawer / accordion expansion */
  sheetAuto: {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.34, ease: MOTION_EASE.calm },
        opacity: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.calm },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.24, ease: MOTION_EASE.calm },
        opacity: { duration: 0.16, ease: MOTION_EASE.exit },
      },
    },
  } satisfies Variants,

  /** Centered modal card surface */
  modalSurface: {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.985,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: MOTION_DURATION.base,
        ease: MOTION_EASE.silk,
      },
    },
    exit: {
      opacity: 0,
      y: 8,
      scale: 0.985,
      transition: {
        duration: MOTION_DURATION.exit,
        ease: MOTION_EASE.exit,
      },
    },
  } satisfies Variants,

  /** Emblem & architectural media reveal */
  mediaReveal: {
    hidden: {
      opacity: 0,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: MOTION_DURATION.calm,
        delay: 0.1,
        ease: MOTION_EASE.silk,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.985,
      transition: {
        duration: MOTION_DURATION.micro,
        ease: MOTION_EASE.exit,
      },
    },
  } satisfies Variants,

  /** Micro icon swap (theme sun/moon, filter tune/close) */
  iconSwap: {
    hidden: {
      opacity: 0,
      scale: 0.82,
      rotate: -32,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: MOTION_DURATION.micro,
        ease: MOTION_EASE.calm,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.82,
      rotate: 32,
      transition: {
        duration: 0.16,
        ease: MOTION_EASE.exit,
      },
    },
  } satisfies Variants,

  /** Micro label/mode crossfade swap */
  textSwap: {
    hidden: {
      opacity: 0,
      y: 4,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_DURATION.fast,
        ease: MOTION_EASE.calm,
      },
    },
    exit: {
      opacity: 0,
      y: -4,
      transition: {
        duration: 0.16,
        ease: MOTION_EASE.exit,
      },
    },
  } satisfies Variants,

  /** Staggered navigation & filter list container */
  listContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: MOTION_STAGGER.base,
        delayChildren: 0.06,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
      },
    },
  } satisfies Variants,

  /** Collapsible submenu container with staggered items */
  submenuContainer: {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: MOTION_DURATION.base, ease: MOTION_EASE.calm },
        opacity: { duration: 0.32, ease: MOTION_EASE.calm },
        staggerChildren: MOTION_STAGGER.tight,
        delayChildren: 0.08,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.28, ease: MOTION_EASE.calm },
        opacity: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
      },
    },
  } satisfies Variants,

  /** Staggered card feed container (Projects & Blog) */
  cardContainer: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: MOTION_STAGGER.base,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: MOTION_DURATION.exit,
        ease: MOTION_EASE.exit,
      },
    },
  } satisfies Variants,

  /** Individual calm card entrance */
  cardItem: {
    hidden: {
      opacity: 0,
      y: 16,
      scale: 0.985,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: MOTION_DURATION.calm,
        ease: MOTION_EASE.silk,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: {
        duration: MOTION_DURATION.exit,
        ease: MOTION_EASE.exit,
      },
    },
  } satisfies Variants,
} as const;

/**
 * Generates BiDi-mirrored horizontal item entrance variants:
 * - LTR slides subtly from logical start (-offsetPx -> 0)
 * - RTL slides subtly from logical start (+offsetPx -> 0)
 */
export function createDirectionalItemVariants(
  isRtl: boolean,
  offsetPx = 20
): Variants {
  const startX = isRtl ? offsetPx : -offsetPx;
  const exitX = isRtl ? Math.round(offsetPx * 0.4) : -Math.round(offsetPx * 0.4);

  return {
    hidden: {
      opacity: 0,
      x: startX,
      y: 6,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: MOTION_DURATION.base,
        ease: MOTION_EASE.silk,
      },
    },
    exit: {
      opacity: 0,
      x: exitX,
      transition: {
        duration: 0.16,
        ease: MOTION_EASE.exit,
      },
    },
  };
}
