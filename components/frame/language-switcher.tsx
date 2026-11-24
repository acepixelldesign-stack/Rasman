'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { SITE_CONFIG, type Locale } from '@/lib/config/site';
import { useAppContext } from '@/components/providers/app-provider';
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

  const activeLocaleMeta = dictionary.locales[locale];

  const drawerNode = (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          id={menuId}
          role="listbox"
          aria-label={dictionary.header.languageMenuAriaLabel}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: prefersReducedMotion
              ? { duration: 0.01 }
              : {
                  height: { duration: 0.44, ease: SITE_CONFIG.motion.ease },
                  opacity: { duration: 0.3, ease: SITE_CONFIG.motion.ease },
                },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: prefersReducedMotion
              ? { duration: 0.01 }
              : {
                  height: { duration: 0.34, ease: SITE_CONFIG.motion.ease },
                  opacity: { duration: 0.22, ease: SITE_CONFIG.motion.ease },
                },
          }}
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
                        : { opacity: 0, y: -8 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.01 }
                        : {
                            duration: 0.34,
                            delay: 0.06 + index * 0.06,
                            ease: SITE_CONFIG.motion.ease,
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
    <div className="relative flex items-center">
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
          'inline-flex h-8 cursor-pointer items-center gap-1 rounded-full px-0',
          'text-[12px] font-medium tracking-[0.04em] text-[var(--ink-primary)]',
          'transition-colors duration-200 hover:text-[var(--brand-text-hover)]'
        )}
      >
        <MdKeyboardArrowDown
          size={16}
          aria-hidden="true"
          className={cn(
            'shrink-0 text-[var(--ink-muted)] transition-transform duration-300',
            isOpen && 'rotate-180 text-[var(--brand-text-hover)]'
          )}
        />
        <span dir="ltr" className="bidi-isolate tabular-nums leading-none">
          {activeLocaleMeta.shortCode}
        </span>
      </button>

      {hasOpened && typeof document !== 'undefined'
        ? createPortal(drawerNode, document.body)
        : null}
    </div>
  );
}
