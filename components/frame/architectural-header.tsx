'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { SITE_CONFIG } from '@/lib/config/site';
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
        'transition-colors duration-200'
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
          'flex h-full w-full items-center justify-between gap-2',
          'ps-[calc(var(--grid-rail)+12px)] pe-[calc(var(--grid-rail)+12px)]',
          'desktop:ps-[calc(var(--grid-rail)+16px)] desktop:pe-[calc(var(--grid-rail)+16px)]'
        )}
      >
        {/* Logical Start Zone: Thicker 2-Line Hamburger + Formal English SVG Logotype */}
        <div className="flex items-center gap-2 desktop:gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={menuAriaLabel}
            className="group inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
          >
            <span className="flex w-[22px] flex-col items-start justify-center gap-[5px]">
              {/* Thicker short top bar aligned to logical start */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                  width: isMenuOpen ? 20 : 12,
                  y: isMenuOpen ? 3.75 : 0,
                  rotate: isMenuOpen ? 45 : 0,
                }}
                transition={{
                  duration: 0.42,
                  ease: SITE_CONFIG.motion.ease,
                }}
                className="block h-[2.5px] origin-center rounded-full bg-[var(--ink-primary)] transition-colors duration-200 group-hover:bg-[var(--brand-text-hover)]"
              />
              {/* Thicker long bottom bar */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{
                  width: isMenuOpen ? 20 : 22,
                  y: isMenuOpen ? -3.75 : 0,
                  rotate: isMenuOpen ? -45 : 0,
                }}
                transition={{
                  duration: 0.42,
                  ease: SITE_CONFIG.motion.ease,
                }}
                className="block h-[2.5px] origin-center rounded-full bg-[var(--ink-primary)] transition-colors duration-200 group-hover:bg-[var(--brand-text-hover)]"
              />
            </span>
          </button>

          <a
            href="#main-canvas"
            aria-label={dictionary.brand.homeAriaLabel}
            className={cn(
              'inline-flex items-center select-none text-[var(--ink-primary)]',
              'transition-opacity duration-200 hover:opacity-75'
            )}
          >
            <RasmanWordmark label={dictionary.brand.logotype} />
          </a>
        </div>

        {/* Logical End Zone: Optically Equal Gaps Between Language, Dark/Light, and Start Project */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          {userProfile ? (
            <Link
              href={SITE_CONFIG.routes.panel}
              className={cn(
                'hidden desktop:inline-flex h-9 shrink-0 items-center justify-center rounded-full px-5',
                'bg-[var(--brand-primary)] text-[12px] font-medium leading-none whitespace-nowrap text-[var(--brand-ink-on-primary)]',
                'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
              )}
            >
              {dictionary.header.userPanelLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={openStartProjectModal}
              className={cn(
                'hidden desktop:inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-5',
                'bg-[var(--brand-primary)] text-[12px] font-medium leading-none whitespace-nowrap text-[var(--brand-ink-on-primary)]',
                'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
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
