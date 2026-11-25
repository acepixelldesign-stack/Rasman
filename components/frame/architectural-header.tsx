'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { SITE_CONFIG } from '@/lib/config/site';
import { MOTION_TRANSITIONS } from '@/lib/motion/system';
import { useAppContext } from '@/components/providers/app-provider';
import { RasmanWordmark } from '@/components/brand/rasman-wordmark';
import { LanguageSwitcher } from '@/components/frame/language-switcher';
import { ThemeToggle } from '@/components/frame/theme-toggle';
import { cn } from '@/lib/utils';

interface ArchitecturalHeaderProps {
  readonly isMenuOpen: boolean;
  readonly onToggleMenu: () => void;
  readonly menuId: string;
}

/**
 * 64px (desktop) / 56px (mobile) glassmorphic architectural top header.
 * - Desktop inner horizontal padding reduced by 8px (16px inset from side rails)
 * - Optically equal gaps between Language Switcher, Dark/Light Toggle, and Start Project CTA
 */
export function ArchitecturalHeader({
  isMenuOpen,
  onToggleMenu,
  menuId,
}: ArchitecturalHeaderProps) {
  const { dictionary, openStartProjectModal, userProfile } = useAppContext();

  const menuAriaLabel = isMenuOpen
    ? dictionary.header.closeMenuLabel
    : dictionary.header.openMenuLabel;

  return (
    <header
      aria-label={dictionary.header.primaryNavAriaLabel}
      className={cn(
        'fixed top-0 inset-x-0 z-40 h-[var(--grid-header)]',
        'border-b border-[var(--grid-line)]',
        'bg-[var(--bg-header-glass)] backdrop-blur-md backdrop-saturate-150 [transform:translateZ(0)]',
        'transition-colors duration-500'
      )}
    >
      {/* Continuous 1px vertical grid hairlines aligned to the side rails */}
      <span
        aria-hidden="true"
        className="header-rail-divider-start pointer-events-none absolute inset-y-0 w-px bg-[var(--grid-line)]"
      />
      <span
        aria-hidden="true"
        className="header-rail-divider-end pointer-events-none absolute inset-y-0 w-px bg-[var(--grid-line)]"
      />

      <div
        className={cn(
          'flex h-full w-full items-stretch justify-between',
          'ps-[var(--grid-rail)] pe-[var(--grid-rail)]'
        )}
      >
        {/* Logical Start Zone: Clean Hamburger Button + Short Hairline Divider (Matching Projects Bar) + RASMAN Wordmark */}
        <div className="flex h-full items-center">
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={menuAriaLabel}
            className={cn(
              'group inline-flex h-full shrink-0 cursor-pointer items-center justify-center',
              'ps-4 pe-3 desktop:ps-5 desktop:pe-4'
            )}
          >
            <span className="flex w-[20px] flex-col items-start justify-center gap-[5px]">
              {/* Short top bar aligned to logical start */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                  width: isMenuOpen ? 18 : 11,
                  y: isMenuOpen ? 3.5 : 0,
                  rotate: isMenuOpen ? 45 : 0,
                }}
                transition={MOTION_TRANSITIONS.base}
                className="block h-[2px] origin-center rounded-full bg-[var(--ink-primary)] transition-colors duration-200 group-hover:bg-[var(--brand-text-hover)]"
              />
              {/* Long bottom bar */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                  width: isMenuOpen ? 18 : 20,
                  y: isMenuOpen ? -3.5 : 0,
                  rotate: isMenuOpen ? -45 : 0,
                }}
                transition={MOTION_TRANSITIONS.base}
                className="block h-[2px] origin-center rounded-full bg-[var(--ink-primary)] transition-colors duration-200 group-hover:bg-[var(--brand-text-hover)]"
              />
            </span>
          </button>

          <span
            aria-hidden="true"
            className="h-4 w-px shrink-0 bg-[var(--grid-line)]"
          />

          <a
            href="#main-canvas"
            aria-label={dictionary.brand.homeAriaLabel}
            className={cn(
              'inline-flex h-full items-center ps-3.5 pe-3 select-none text-[var(--ink-primary)] desktop:ps-4',
              'transition-opacity duration-200 hover:opacity-75'
            )}
          >
            <RasmanWordmark label={dictionary.brand.logotype} />
          </a>
        </div>

        {/* Logical End Zone: Square Language Cell + Square Theme Cell + Flush Full-Height Start Project CTA */}
        <div className="flex h-full items-stretch">
          <div className="flex h-full w-[var(--grid-header)] shrink-0 items-center justify-center border-s border-[var(--grid-line)]">
            <LanguageSwitcher />
          </div>
          <div className="flex h-full w-[var(--grid-header)] shrink-0 items-center justify-center border-s border-[var(--grid-line)]">
            <ThemeToggle />
          </div>
          {userProfile ? (
            <Link
              href={SITE_CONFIG.routes.panel}
              className={cn(
                'hidden desktop:inline-flex h-full shrink-0 items-center justify-center rounded-none border-s border-[var(--grid-line)] px-6',
                'bg-[var(--btn-start-bg)] text-[12px] font-medium leading-none whitespace-nowrap text-[var(--btn-start-ink)]',
                'transition-colors duration-200 hover:bg-[var(--btn-start-hover)] active:bg-[var(--btn-start-active)]'
              )}
            >
              {dictionary.header.userPanelLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={openStartProjectModal}
              className={cn(
                'hidden desktop:inline-flex h-full shrink-0 cursor-pointer items-center justify-center rounded-none border-s border-[var(--grid-line)] px-6',
                'bg-[var(--btn-start-bg)] text-[12px] font-medium leading-none whitespace-nowrap text-[var(--btn-start-ink)]',
                'transition-colors duration-200 hover:bg-[var(--btn-start-hover)] active:bg-[var(--btn-start-active)]'
              )}
            >
              {dictionary.header.startProjectLabel}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
