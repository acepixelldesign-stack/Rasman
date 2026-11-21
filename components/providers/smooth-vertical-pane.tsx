'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SmoothVerticalPaneProps {
  readonly children: ReactNode;
  readonly className?: string;
}

const LERP_FACTOR = 0.1;
const STOP_THRESHOLD_PX = 0.35;

/**
 * Universal frame-by-frame inertial vertical scroll container:
 * - Uses data-smooth-prevent to isolate wheel scrolling from global window scroll handler
 * - Applies smooth rAF damping to wheel scrolling whenever the container overflows
 */
export function SmoothVerticalPane({
  children,
  className,
}: SmoothVerticalPaneProps) {
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = paneRef.current;
    if (!el || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let targetTop = el.scrollTop;
    let currentTop = el.scrollTop;
    let rafId: number | null = null;
    let isAnimating = false;

    const tick = () => {
      const diff = targetTop - currentTop;
      if (Math.abs(diff) <= STOP_THRESHOLD_PX) {
        currentTop = targetTop;
        el.scrollTop = currentTop;
        isAnimating = false;
        rafId = null;
        return;
      }

      currentTop += diff * LERP_FACTOR;
      el.scrollTop = currentTop;
      rafId = window.requestAnimationFrame(tick);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;

      const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
      if (maxScroll <= 2) return;

      event.preventDefault();

      if (!isAnimating) {
        currentTop = el.scrollTop;
        targetTop = el.scrollTop;
      }

      const multiplier =
        event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? el.clientHeight : 1;
      targetTop = Math.max(
        0,
        Math.min(maxScroll, targetTop + event.deltaY * multiplier)
      );

      if (!isAnimating) {
        isAnimating = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handleNativeScroll = () => {
      if (!isAnimating) {
        currentTop = el.scrollTop;
        targetTop = el.scrollTop;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', handleNativeScroll, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleNativeScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={paneRef}
      data-smooth-prevent=""
      className={cn(className)}
    >
      {children}
    </div>
  );
}
