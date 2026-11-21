'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MdCheck, MdKeyboardArrowDown } from 'react-icons/md';
import { SITE_CONFIG, type Locale } from '@/lib/config/site';
import { useAppContext } from '@/components/providers/app-provider';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { locale, dictionary, setLocale } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
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

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={dictionary.header.languageSwitcherAriaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
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
            'shrink-0 text-[var(--ink-muted)] transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
        <span dir="ltr" className="bidi-isolate tabular-nums leading-none">
          {activeLocaleMeta.shortCode}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={menuId}
            role="listbox"
            aria-label={dictionary.header.languageMenuAriaLabel}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{
              duration: 0.32,
              ease: SITE_CONFIG.motion.ease,
            }}
            className="rasman-glass-popover absolute top-[calc(100%+8px)] end-0 z-50 min-w-[148px] rounded-xl p-1"
          >
            {SITE_CONFIG.supportedLocales.map((code) => {
              const item = dictionary.locales[code];
              const isSelected = code === locale;

              return (
                <li key={code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(code)}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-[13px]',
                      'transition-colors duration-150 hover:text-[var(--brand-text-hover)]',
                      isSelected
                        ? 'font-medium text-[var(--brand-text-hover)]'
                        : 'text-[var(--ink-secondary)]'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        dir="ltr"
                        className="bidi-isolate text-[11px] font-medium tracking-[0.06em] text-[var(--ink-muted)] tabular-nums"
                      >
                        {item.shortCode}
                      </span>
                      <span>{item.nativeName}</span>
                    </span>
                    {isSelected && (
                      <MdCheck
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 text-[var(--brand-text-hover)]"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
