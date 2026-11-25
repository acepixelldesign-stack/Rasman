'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Globe } from 'lucide-react';
import { SITE_CONFIG, type Locale } from '@/lib/config/site';
import {
  MOTION_EASE,
  MOTION_STAGGER,
  MOTION_VARIANTS,
} from '@/lib/motion/system';
import { useAppContext } from '@/components/providers/app-provider';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useSwipeUpDismiss } from '@/hooks/use-swipe-up-dismiss';
import { cn } from '@/lib/utils';

/**
 * Architectural Language Switcher Drawer:
 * - Triggered from the header; opens a sleek content-fitted sliding drawer
 *   directly beneath the header, framed inside the side rails (never stretching to the bottom).
 * - Lists English (EN), Persian (FA), and Arabic (AR) with abbreviation + full name only (zero icons),
 *   separated by hairline dividers matching the Magazine category list.
 */
export function LanguageSwitcher() {
  const { locale, dictionary, setLocale } = useAppContext();
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useBodyScrollLock(isOpen);
  useSwipeUpDismiss(drawerRef, isOpen, closeMenu);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        drawerRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (nextLocale: Locale) => {
    setLocale(nextLocale);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const drawerNode = (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          id={menuId}
          role="listbox"
          data-scroll-lock-allow=""
          aria-label={dictionary.header.languageMenuAriaLabel}
          variants={MOTION_VARIANTS.sheetAuto}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed top-[var(--grid-header)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-[38]',
            'overflow-visible border-b border-[var(--grid-line)]',
            'bg-[var(--bg-header-glass)] backdrop-blur-xl backdrop-saturate-150 [transform:translateZ(0)]'
          )}
        >
          <div className="overflow-hidden px-4 desktop:px-6">
            <ul className="flex flex-col divide-y divide-[var(--grid-line)]">
              {SITE_CONFIG.supportedLocales.map((code, index) => {
                const item = dictionary.locales[code];
                const isSelected = code === locale;

                return (
                  <motion.li
                    key={code}
                    role="option"
                    aria-selected={isSelected}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -6 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.01 }
                        : {
                            duration: 0.3,
                            delay: 0.05 + index * MOTION_STAGGER.tight,
                            ease: MOTION_EASE.calm,
                          }
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(code)}
                      className={cn(
                        'group flex w-full cursor-pointer items-center gap-4 py-4 text-start transition-colors duration-200',
                        'hover:text-[var(--brand-text-hover)] focus-visible:text-[var(--brand-text-hover)]',
                        isSelected
                          ? 'font-medium text-[var(--brand-text-hover)]'
                          : 'font-normal text-[var(--ink-primary)]'
                      )}
                    >
                      <span
                        dir="ltr"
                        className={cn(
                          'bidi-isolate w-7 shrink-0 text-[12px] font-medium tracking-[0.08em] tabular-nums transition-colors duration-200',
                          isSelected
                            ? 'text-[var(--brand-text-hover)]'
                            : 'text-[var(--ink-muted)] group-hover:text-[var(--brand-text-hover)]'
                        )}
                      >
                        {item.shortCode}
                      </span>
                      <span className="text-[16px] leading-[1.35] tracking-[-0.01em] rtl:leading-[1.55] rtl:tracking-normal">
                        {item.nativeName}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Mobile Drag-Up Handle */}
          <div
            data-swipe-handle=""
            aria-hidden="true"
            className="flex h-5 w-full shrink-0 cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing desktop:hidden"
          >
            <span className="block h-[3px] w-9 rounded-full bg-[var(--grid-crosshair)]" />
          </div>

          {/* Bottom Left & Right Frame Rail Intersection '+' Crosshairs */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[6px] -start-[7px] z-[39] block h-[13px] w-[13px]"
          >
            <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[6px] -end-[7px] z-[39] block h-[13px] w-[13px]"
          >
            <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={dictionary.header.languageSwitcherAriaLabel}
        onClick={() => {
          setHasOpened(true);
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          'inline-flex h-full w-full cursor-pointer items-center justify-center rounded-none',
          'transition-colors duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--brand-text-hover)]',
          isOpen
            ? 'text-[var(--brand-text-hover)]'
            : 'text-[var(--ink-primary)]'
        )}
      >
        <Globe size={18} strokeWidth={1.65} aria-hidden="true" />
      </button>

      {hasOpened && typeof document !== 'undefined'
        ? createPortal(drawerNode, document.body)
        : null}
    </div>
  );
}
