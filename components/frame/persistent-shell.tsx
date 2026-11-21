'use client';

import {
  useCallback,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config/site';
import { useAppContext } from '@/components/providers/app-provider';
import { ArchitecturalHeader } from '@/components/frame/architectural-header';
import { CrosshairMark } from '@/components/frame/crosshair-mark';
import { NavigationDrawer } from '@/components/frame/navigation-drawer';
import { cn } from '@/lib/utils';

interface PersistentShellProps {
  readonly children: ReactNode;
}

/**
 * Persistent 4-sided architectural perimeter frame mounted once across route navigations:
 * - Prevents remounting the header, rails, crosshairs, and drawer when switching pages
 * - Derives drawer open state per pathname to close automatically on navigation without effect setState
 * - Prefetches primary studio routes immediately on mount for instant navigation
 */
export function PersistentShell({ children }: PersistentShellProps) {
  const { dictionary, announce } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const menuId = useId();
  const isMenuOpen = openPathname === pathname;

  // Warm route cache once after initial mount without competing with menu clicks
  useEffect(() => {
    const timer = window.setTimeout(() => {
      SITE_CONFIG.routes.prefetch.forEach((route) => {
        router.prefetch(route);
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [router]);

  // Ensure window scroll resets cleanly on route transitions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    const nextOpen = !isMenuOpen;
    setOpenPathname(nextOpen ? pathname : null);
    announce(
      nextOpen
        ? dictionary.announcements.menuOpened
        : dictionary.announcements.menuClosed
    );
  }, [announce, dictionary, isMenuOpen, pathname]);

  const handleCloseMenu = useCallback(() => {
    setOpenPathname(null);
    announce(dictionary.announcements.menuClosed);
  }, [announce, dictionary]);

  const handleNavigateClose = useCallback(() => {
    setOpenPathname(null);
  }, []);

  return (
    <div className="relative min-h-dvh w-full bg-[var(--bg-canvas)] text-[var(--ink-primary)] transition-colors duration-200">
      {/* Accessible Skip Link */}
      <a
        href="#main-canvas"
        className={cn(
          'sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50',
          'border border-[var(--ink-primary)] bg-[var(--bg-canvas)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink-primary)]'
        )}
      >
        {dictionary.header.skipToContent}
      </a>

      {/* Top Glassmorphic Header */}
      <ArchitecturalHeader
        isMenuOpen={isMenuOpen}
        onToggleMenu={handleToggleMenu}
        menuId={menuId}
      />

      {/* Logical Start Side Column — Strictly Opaque (Non-Glass) */}
      <aside
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed z-30',
          'top-[var(--grid-header)] bottom-[var(--grid-bottom)] start-0',
          'w-[var(--grid-rail)] border-e border-[var(--grid-line)]',
          'bg-[var(--bg-rail)] transition-colors duration-200'
        )}
      />

      {/* Logical End Side Column — Strictly Opaque (Non-Glass) */}
      <aside
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed z-30',
          'top-[var(--grid-header)] bottom-[var(--grid-bottom)] end-0',
          'w-[var(--grid-rail)] border-s border-[var(--grid-line)]',
          'bg-[var(--bg-rail)] transition-colors duration-200'
        )}
      />

      {/* Bottom Perimeter Grid Bar — Opaque with Continuous Vertical Hairlines */}
      <footer
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed bottom-0 inset-x-0 z-30',
          'h-[var(--grid-bottom)] border-t border-[var(--grid-line)]',
          'bg-[var(--bg-rail)] transition-colors duration-200'
        )}
      >
        <span className="header-rail-divider-start absolute inset-y-0 w-px bg-[var(--grid-line)]" />
        <span className="header-rail-divider-end absolute inset-y-0 w-px bg-[var(--grid-line)]" />
      </footer>

      {/* Four Architectural '+' Crosshair Intersection Markers */}
      <CrosshairMark corner="top-start" />
      <CrosshairMark corner="top-end" />
      <CrosshairMark corner="bottom-start" />
      <CrosshairMark corner="bottom-end" />

      {/* Framed Architectural Navigation Drawer */}
      <NavigationDrawer
        id={menuId}
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        onNavigate={handleNavigateClose}
      />

      {/* Persistent Central Single-Section Architectural Canvas */}
      <main
        id="main-canvas"
        aria-label={dictionary.stage.regionAriaLabel}
        className={cn(
          'relative min-h-dvh w-full bg-[var(--bg-canvas)] transition-colors duration-200',
          'pt-[var(--grid-header)] pb-[var(--grid-bottom)]',
          'ps-[var(--grid-rail)] pe-[var(--grid-rail)]'
        )}
      >
        {children}
      </main>
    </div>
  );
}
