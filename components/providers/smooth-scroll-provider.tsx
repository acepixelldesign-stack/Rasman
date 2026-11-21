'use client';

import { useEffect, type ReactNode } from 'react';

interface SmoothScrollProviderProps {
  readonly isPaused?: boolean;
  readonly children: ReactNode;
}

const DESKTOP_MEDIA_QUERY =
  '(min-width: 768px) and (min-height: 520px) and (orientation: landscape)';
const LERP_FACTOR = 0.095;
const STOP_THRESHOLD_PX = 0.35;

/**
 * Global frame-by-frame inertial smooth scrolling provider:
 * - Zero external dependencies, powered by requestAnimationFrame exponential damping
 * - Gives native app-like momentum on desktop wheel/trackpad while preserving native touch inertia
 * - Respects prefers-reduced-motion, pauses when modals are open, and honors:
 *   - data-smooth-prevent (always bypasses global smoothing)
 *   - data-smooth-prevent-desktop (bypasses global smoothing only on lg+ viewports)
 */
export function SmoothScrollProvider({
  isPaused = false,
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isPaused) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId: number | null = null;
    let isAnimating = false;

    const getMaxScroll = () =>
      Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

    const shouldBypassTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      if (target.closest('[data-smooth-prevent]')) return true;
      if (
        window.matchMedia(DESKTOP_MEDIA_QUERY).matches &&
        target.closest('[data-smooth-prevent-desktop]')
      ) {
        return true;
      }

      let el: Element | null = target;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        const canScrollY =
          (overflowY === 'auto' || overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight + 2;
        if (canScrollY) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const tick = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) <= STOP_THRESHOLD_PX) {
        currentY = targetY;
        window.scrollTo(0, Math.round(currentY));
        isAnimating = false;
        rafId = null;
        return;
      }

      currentY += diff * LERP_FACTOR;
      window.scrollTo(0, currentY);
      rafId = window.requestAnimationFrame(tick);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.2) return;
      if (shouldBypassTarget(event.target)) return;

      const maxScroll = getMaxScroll();
      if (maxScroll <= 0) return;

      event.preventDefault();

      if (!isAnimating) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }

      const multiplier =
        event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? window.innerHeight : 1;
      targetY = Math.max(
        0,
        Math.min(maxScroll, targetY + event.deltaY * multiplier)
      );

      if (!isAnimating) {
        isAnimating = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handleNativeScroll = () => {
      if (!isAnimating) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleNativeScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleNativeScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isPaused]);

  return <>{children}</>;
}
