'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MOTION_EASE } from '@/lib/motion/system';
import { useAppContext } from '@/components/providers/app-provider';
import { cn } from '@/lib/utils';

export type StickyBarDirection = 'forward' | 'back';

export interface StickySubBarConfig {
  /** Unique route/bar identifier — changing id triggers horizontal inner content transition */
  readonly id: string;
  /** Route depth (1 = list/section, 2 = detail) used to auto-detect forward vs back slide direction */
  readonly depth: number;
  /** When true, bar appears only on mobile viewports and retracts behind header on desktop */
  readonly mobileOnly?: boolean;
  /** Hides bottom border & corner crosshairs when an attached dropdown sheet is expanded */
  readonly hideBottomChrome?: boolean;
  /** Optional aria-label for the sticky bar container */
  readonly ariaLabel?: string;
  /** Main 48px horizontal bar content */
  readonly content: ReactNode;
  /** Optional expandable dropdown/sheet content rendered cleanly below the 48px bar row */
  readonly sheet?: ReactNode;
  /** Optional callback fired when clicking outside the sticky bar + sheet wrapper */
  readonly onOutsideClick?: () => void;
}

interface StickyBarStoreSnapshot {
  readonly activeOwner: symbol | null;
  readonly bar: StickySubBarConfig | null;
  readonly direction: StickyBarDirection;
}

const DESKTOP_MEDIA_QUERY =
  '(min-width: 768px) and (min-height: 520px) and (orientation: landscape)';

let storeSnapshot: StickyBarStoreSnapshot = {
  activeOwner: null,
  bar: null,
  direction: 'forward',
};
let pendingManualDirection: StickyBarDirection | null = null;
let pendingClearTimer: number | null = null;
const storeListeners = new Set<() => void>();

function emitStoreChange(): void {
  storeListeners.forEach((listener) => listener());
}

function subscribeStore(listener: () => void): () => void {
  storeListeners.add(listener);
  return () => {
    storeListeners.delete(listener);
  };
}

function getStoreSnapshot(): StickyBarStoreSnapshot {
  return storeSnapshot;
}

const SERVER_SNAPSHOT: StickyBarStoreSnapshot = {
  activeOwner: null,
  bar: null,
  direction: 'forward',
};

function getServerStoreSnapshot(): StickyBarStoreSnapshot {
  return SERVER_SNAPSHOT;
}

/**
 * Hint the next sticky-bar transition direction (e.g., clicking a Back link).
 */
export function setNextStickyBarDirection(direction: StickyBarDirection): void {
  pendingManualDirection = direction;
}

function registerOrUpdateBar(
  owner: symbol,
  config: StickySubBarConfig
): void {
  if (pendingClearTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(pendingClearTimer);
    pendingClearTimer = null;
  }

  const prevBar = storeSnapshot.bar;
  let nextDirection: StickyBarDirection = storeSnapshot.direction;

  if (!prevBar || prevBar.id !== config.id) {
    if (pendingManualDirection) {
      nextDirection = pendingManualDirection;
      pendingManualDirection = null;
    } else if (prevBar) {
      nextDirection = config.depth < prevBar.depth ? 'back' : 'forward';
    } else {
      nextDirection = 'forward';
    }
  }

  storeSnapshot = {
    activeOwner: owner,
    bar: config,
    direction: nextDirection,
  };
  emitStoreChange();
}

function unregisterBar(owner: symbol): void {
  if (storeSnapshot.activeOwner !== owner) return;

  // Defer clearing by 1 frame so a newly mounting route with its own sticky bar
  // seamlessly replaces the active bar in-place without dropping the bar shell.
  if (typeof window === 'undefined') {
    storeSnapshot = { activeOwner: null, bar: null, direction: 'forward' };
    emitStoreChange();
    return;
  }

  if (pendingClearTimer !== null) {
    window.clearTimeout(pendingClearTimer);
  }
  pendingClearTimer = window.setTimeout(() => {
    pendingClearTimer = null;
    if (storeSnapshot.activeOwner === owner) {
      storeSnapshot = {
        activeOwner: null,
        bar: null,
        direction: storeSnapshot.direction,
      };
      emitStoreChange();
    }
  }, 40);
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Hook for any page/stage to mount its sticky 48px sub-bar into the persistent host
 * directly beneath ArchitecturalHeader.
 */
export function useStickySubBar(config: StickySubBarConfig | null): void {
  const [owner] = useState<symbol>(() => Symbol('rasman-sticky-sub-bar'));

  useIsomorphicLayoutEffect(() => {
    if (config) {
      registerOrUpdateBar(owner, config);
    } else {
      unregisterBar(owner);
    }
  });

  useEffect(() => {
    return () => {
      unregisterBar(owner);
    };
  }, [owner]);
}

/**
 * Persistent Sticky Sub-Bar Host mounted once inside PersistentShell directly under ArchitecturalHeader:
 * - No bar -> Has bar: glides smoothly down from behind the header (y: -48 -> 0)
 * - Has bar -> No bar: glides smoothly up behind the header and vanishes (y: 0 -> -48)
 * - Has bar -> Has bar: outer glass bar & crosshairs stay fixed while inner content slides horizontally:
 *     - Forward (LTR): Right -> Left (+44 -> 0 -> -44) | Back (LTR): Left -> Right (-44 -> 0 -> +44)
 *     - Automatically mirrored in RTL (FA / AR)
 */
export function StickySubBarHost() {
  const { isRtl } = useAppContext();
  const prefersReducedMotion = useReducedMotion();
  const snapshot = useSyncExternalStore(
    subscribeStore,
    getStoreSnapshot,
    getServerStoreSnapshot
  );

  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const sync = () => setIsDesktopViewport(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Browser back/forward button automatically reverses inner horizontal direction
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      pendingManualDirection = 'back';
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const bar = snapshot.bar;
  const isBarVisible = Boolean(
    bar && !(bar.mobileOnly && isDesktopViewport)
  );

  // Outside-click handler for attached dropdowns (Mega Filter, mobile sheets)
  useEffect(() => {
    if (!isBarVisible || !bar?.onOutsideClick) return;
    const callback = bar.onOutsideClick;

    const handlePointerDown = (event: MouseEvent) => {
      if (hostRef.current && !hostRef.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isBarVisible, bar]);

  // Directional offset:
  // Forward in LTR: enters from right (+44) -> 0 -> exits left (-44)
  // Back in LTR:    enters from left (-44) -> 0 -> exits right (+44)
  // RTL mirrors both automatically.
  const dirSign = snapshot.direction === 'back' ? -1 : 1;
  const rtlSign = isRtl ? -1 : 1;
  const enterOffsetX = prefersReducedMotion ? 0 : 44 * dirSign * rtlSign;
  const exitOffsetX = prefersReducedMotion ? 0 : -44 * dirSign * rtlSign;

  return (
    <AnimatePresence initial={false}>
      {isBarVisible && bar && (
        <motion.div
          key="rasman-persistent-sticky-subbar"
          ref={hostRef}
          aria-label={bar.ariaLabel}
          initial={
            prefersReducedMotion ? { opacity: 0 } : { y: -48, opacity: 0 }
          }
          animate={{
            y: 0,
            opacity: 1,
            transition: prefersReducedMotion
              ? { duration: 0.01 }
              : { duration: 0.46, ease: MOTION_EASE.silk },
          }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.01 } }
              : {
                  y: -48,
                  opacity: 0,
                  transition: { duration: 0.36, ease: MOTION_EASE.calm },
                }
          }
          className={cn(
            'fixed top-[var(--grid-header)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-[34]',
            'flex flex-col bg-[var(--bg-header-glass)] backdrop-blur-xl backdrop-saturate-150 [transform:translateZ(0)] transition-colors duration-500',
            !bar.hideBottomChrome && 'border-b border-[var(--grid-line)]'
          )}
        >
          {/* Clipped 48px Horizontal Stage for Smooth Right<->Left Content Swaps */}
          <div className="relative h-12 w-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={bar.id}
                initial={{ opacity: 0, x: enterOffsetX }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: prefersReducedMotion
                    ? { duration: 0.01 }
                    : { duration: 0.38, ease: MOTION_EASE.silk },
                }}
                exit={{
                  opacity: 0,
                  x: exitOffsetX,
                  transition: prefersReducedMotion
                    ? { duration: 0.01 }
                    : { duration: 0.24, ease: MOTION_EASE.exit },
                }}
                className="flex h-12 w-full items-stretch"
              >
                {bar.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Attached Expandable Sheet / Mega Filter / Mobile Category Drawer */}
          {bar.sheet}

          {/* Bottom Start & End Frame Rail Intersection '+' Crosshairs */}
          {!bar.hideBottomChrome && (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[6px] -start-[7px] z-[35] block h-[13px] w-[13px]"
              >
                <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
                <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[6px] -end-[7px] z-[35] block h-[13px] w-[13px]"
              >
                <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
                <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
