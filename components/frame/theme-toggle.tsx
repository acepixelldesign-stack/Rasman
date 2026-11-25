'use client';

import { AnimatePresence, motion } from 'motion/react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { MOTION_VARIANTS } from '@/lib/motion/system';
import { useAppContext } from '@/components/providers/app-provider';
import { cn } from '@/lib/utils';

/**
 * Full-radius filled Material Design sun/moon dark & light mode toggle button.
 * Optically tight width (w-6) ensures equal visual spacing between language switcher and CTA button.
 */
export function ThemeToggle() {
  const { isDark, dictionary, toggleTheme } = useAppContext();

  const ariaLabel = isDark
    ? dictionary.header.themeToggleToLightLabel
    : dictionary.header.themeToggleToDarkLabel;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        'relative inline-flex h-8 w-6 cursor-pointer items-center justify-center rounded-full',
        'text-[var(--ink-primary)] transition-colors duration-200',
        'hover:text-[var(--brand-text-hover)]'
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            variants={MOTION_VARIANTS.iconSwap}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center justify-center"
          >
            <MdLightMode size={19} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            variants={MOTION_VARIANTS.iconSwap}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center justify-center"
          >
            <MdDarkMode size={19} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
