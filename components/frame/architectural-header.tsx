'use client';

import Link from 'next/link';
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
 * 48px (desktop) / 40px (mobile) glassmorphic architectural top header.
 * - Borderless 2-line hamburger icon matched optically to RASMAN wordmark height (12px mobile / 14px desktop)
 * - Short vertical hairline divider separating hamburger from wordmark
 * - Square Language & Theme cells and flush Start Project CTA at logical end
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
        {/* Logical Start Zone: Clean Hamburger Button + Short Hairline Divider + RASMAN Wordmark */}
        <div className="flex h-full items-center">
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={menuAriaLabel}
            className={cn(
              'group inline-flex h-full shrink-0 cursor-pointer items-center justify-center',
              'ps-3.5 pe-3 desktop:ps-4 desktop:pe-3.5'
            )}
          >
            <span className="relative block h-[12px] w-[20px] desktop:h-[14px]">
              {/* Short top bar aligned to logical start, outer edge flush with logo top */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute start-0 block h-[2px] origin-center rounded-full bg-[var(--ink-primary)]',
                  'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[var(--brand-text-hover)]',
                  isMenuOpen
                    ? 'top-1/2 w-[18px] -translate-y-1/2 rotate-45'
                    : 'top-0 w-[11px] translate-y-0 rotate-0'
                )}
              />
              {/* Long bottom bar, outer edge flush with logo bottom */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute start-0 block h-[2px] origin-center rounded-full bg-[var(--ink-primary)]',
                  'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[var(--brand-text-hover)]',
                  isMenuOpen
                    ? 'top-1/2 w-[18px] -translate-y-1/2 -rotate-45'
                    : 'top-full w-[20px] -translate-y-full rotate-0'
                )}
              />
            </span>
          </button>

          <span
            aria-hidden="true"
            className="h-3.5 w-px shrink-0 bg-[var(--grid-line)] desktop:h-4"
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
