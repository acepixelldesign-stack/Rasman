'use client';

import { AnimatePresence, motion } from 'motion/react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
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
            initial={{ opacity: 0, rotate: -45, scale: 0.75 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.75 }}
            transition={{
              duration: SITE_CONFIG.motion.fastDuration,
              ease: SITE_CONFIG.motion.ease,
            }}
            className="flex items-center justify-center"
          >
            <MdLightMode size={19} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 45, scale: 0.75 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.75 }}
            transition={{
              duration: SITE_CONFIG.motion.fastDuration,
              ease: SITE_CONFIG.motion.ease,
            }}
            className="flex items-center justify-center"
          >
            <MdDarkMode size={19} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
