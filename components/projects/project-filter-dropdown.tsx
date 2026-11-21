'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MdCheck, MdKeyboardArrowDown } from 'react-icons/md';
import { ARCHITECTURAL_EASE } from '@/components/motion/architectural-motion';
import { cn } from '@/lib/utils';

export interface FilterDropdownOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface ProjectFilterDropdownProps<T extends string> {
  readonly label: string;
  readonly value: T;
  readonly options: readonly FilterDropdownOption<T>[];
  readonly onChange: (nextValue: T) => void;
}

/**
 * Architectural capsule dropdown filter for Project Type, Status, and City:
 * - Borderless, shadowless muted-grey frosted glass surface across all browsers
 * - Calm staggered option entrance and keyboard navigation
 */
export function ProjectFilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: ProjectFilterDropdownProps<T>) {
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

  const activeOption = options.find((opt) => opt.value === value) ?? options[0];
  const isFiltered = value !== 'all';

  return (
    <div ref={containerRef} className="relative inline-flex shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'rasman-glass inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5 text-[12px] leading-none font-medium transition-colors duration-250',
          'hover:bg-[var(--glass-control-hover)]',
          'tracking-[0.04em] rtl:tracking-normal',
          isFiltered
            ? 'text-[var(--brand-text-hover)]'
            : 'text-[var(--ink-primary)]'
        )}
      >
        <span className="whitespace-nowrap">
          {isFiltered ? `${label}: ${activeOption?.label}` : label}
        </span>
        <MdKeyboardArrowDown
          size={17}
          aria-hidden="true"
          className={cn(
            'shrink-0 text-[var(--ink-muted)] transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={menuId}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{
              duration: 0.32,
              ease: ARCHITECTURAL_EASE,
            }}
            className="rasman-glass-popover absolute top-[calc(100%+6px)] start-0 z-30 min-w-[184px] rounded-xl p-1"
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value;

              return (
                <motion.li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.28,
                      delay: idx * 0.035,
                      ease: ARCHITECTURAL_EASE,
                    },
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-[13px]',
                      'transition-colors duration-200 hover:text-[var(--brand-text-hover)]',
                      isSelected
                        ? 'font-medium text-[var(--brand-text-hover)]'
                        : 'text-[var(--ink-secondary)]'
                    )}
                  >
                    <span className="whitespace-nowrap">{option.label}</span>
                    {isSelected && (
                      <MdCheck
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 text-[var(--brand-text-hover)]"
                      />
                    )}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
