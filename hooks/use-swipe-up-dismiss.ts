'use client';

import { useEffect, type RefObject } from 'react';

const DISMISS_DISTANCE_PX = 64;
const DISMISS_VELOCITY_DISTANCE_PX = 26;
const DISMISS_VELOCITY_THRESHOLD = 0.42;
const DESKTOP_MEDIA_QUERY =
  '(min-width: 768px) and (min-height: 520px) and (orientation: landscape)';

function findScrollableAncestor(
  target: EventTarget | null,
  boundary: HTMLElement
): HTMLElement | null {
  let node = target instanceof HTMLElement ? target : null;
  while (node && node !== boundary) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight + 2;
    if (isScrollable) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Mobile touch gesture hook enabling any slide-down menu or sheet to be dragged
 * smoothly upward to close, without interfering with internal vertical scrolling:
 * - Touching a `[data-swipe-handle]` bottom bar ALWAYS drags the sheet upward immediately.
 * - Touching inside scrollable content drags the sheet upward once scrolled to the bottom.
 * - Touching non-scrollable content (e.g., short drawers, footers) drags upward immediately.
 */
export function useSwipeUpDismiss(
  containerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void
): void {
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;

    let active = false;
    let draggingUp = false;
    let startX = 0;
    let startY = 0;
    let lastDeltaY = 0;
    let startTime = 0;
    let isHandleStart = false;
    let scrollableNode: HTMLElement | null = null;

    const resetTransform = (animateBack: boolean) => {
      if (animateBack) {
        el.style.transition = 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = 'translate3d(0, 0, 0)';
        window.setTimeout(() => {
          el.style.transition = '';
          el.style.transform = '';
        }, 250);
      } else {
        el.style.transition = '';
        el.style.transform = '';
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (window.matchMedia(DESKTOP_MEDIA_QUERY).matches) return;
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];
      if (!touch) return;

      const targetEl = event.target instanceof HTMLElement ? event.target : null;
      isHandleStart = Boolean(targetEl?.closest('[data-swipe-handle]'));
      scrollableNode = isHandleStart
        ? null
        : findScrollableAncestor(event.target, el);

      active = true;
      draggingUp = false;
      startX = touch.clientX;
      startY = touch.clientY;
      lastDeltaY = 0;
      startTime = performance.now();
      el.style.transition = '';
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!active || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (!draggingUp) {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          active = false;
          return;
        }
        if (deltaY > 8) {
          active = false;
          return;
        }
        if (deltaY < -8) {
          const canDismissFromScroll =
            isHandleStart ||
            !scrollableNode ||
            scrollableNode.scrollTop + scrollableNode.clientHeight >=
              scrollableNode.scrollHeight - 4;

          if (!canDismissFromScroll) {
            return;
          }
          draggingUp = true;
        } else {
          return;
        }
      }

      if (draggingUp) {
        event.preventDefault();
        const clampedUp = Math.min(0, deltaY);
        lastDeltaY = clampedUp;
        el.style.transform = `translate3d(0, ${Math.round(clampedUp * 0.72)}px, 0)`;
      }
    };

    const handleTouchEnd = () => {
      if (!active) return;
      active = false;

      if (!draggingUp) return;
      draggingUp = false;

      const elapsed = Math.max(1, performance.now() - startTime);
      const velocity = Math.abs(lastDeltaY) / elapsed;
      const shouldDismiss =
        lastDeltaY <= -DISMISS_DISTANCE_PX ||
        (lastDeltaY <= -DISMISS_VELOCITY_DISTANCE_PX &&
          velocity >= DISMISS_VELOCITY_THRESHOLD);

      if (shouldDismiss) {
        resetTransform(false);
        onDismiss();
      } else {
        resetTransform(true);
      }
    };

    const handleTouchCancel = () => {
      if (!active && !draggingUp) return;
      active = false;
      draggingUp = false;
      resetTransform(true);
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchCancel);
      el.style.transition = '';
      el.style.transform = '';
    };
  }, [containerRef, isOpen, onDismiss]);
}
