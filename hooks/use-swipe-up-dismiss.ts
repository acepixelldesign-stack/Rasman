'use client';

import { useEffect, type RefObject } from 'react';

/** Active drag capture zone measured upward from the lowest edge of the menu */
const BOTTOM_DRAG_ZONE_PX = 64;
/** Slight outer lip below the bottom border for comfortable thumb capture */
const BOTTOM_OUTER_TOLERANCE_PX = 16;
const ENGAGE_THRESHOLD_PX = 5;
const MIN_DISMISS_DISTANCE_PX = 68;
const MAX_DISMISS_DISTANCE_PX = 140;
const DISMISS_HEIGHT_RATIO = 0.24;
const FLICK_MIN_DISTANCE_PX = 28;
const FLICK_VELOCITY_THRESHOLD = 0.34;
const DESKTOP_MEDIA_QUERY =
  '(min-width: 768px) and (min-height: 520px) and (orientation: landscape)';

/**
 * Bulletproof mobile menu drag-to-dismiss hook:
 * - Captures drag gestures starting anywhere in the bottom 64px zone of the menu
 *   (from the lowest edge up to 64px height) or on `[data-swipe-handle]`.
 * - Resolves `containerRef.current` dynamically on touch/pointer start so portals and
 *   StickySubBarHost sheets never miss listener attachment.
 * - Moves the menu smoothly up AND down in real time with the user's finger:
 *     - Fixed drawers (`NavigationDrawer`, `LanguageSwitcher`) translate via GPU `translate3d`.
 *     - In-flow sticky-bar sheets (`BlogStage`, `PodcastStage`, `ProjectMegaFilter`) smoothly
 *       resize their height in lockstep with the sticky host container.
 * - Preserves normal taps on buttons inside the bottom 64px zone and suppresses synthetic
 *   clicks whenever an actual vertical drag occurred.
 */
export function useSwipeUpDismiss(
  containerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void
): void {
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    let activeEl: HTMLElement | null = null;
    let lastAnimatedEl: HTMLElement | null = null;
    let mode: 'transform' | 'height' = 'transform';
    let active = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startHeight = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocityY = 0;
    let currentOffset = 0;
    let savedOverflow = '';
    let savedHeight = '';
    let isSettlingDismiss = false;
    let settleTimer: number | null = null;
    let clickBlockTimer: number | null = null;

    const clearSwipeFlag = () => {
      delete document.documentElement.dataset.swipeDragging;
    };

    const suppressNextClick = () => {
      const blockClick = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      window.addEventListener('click', blockClick, {
        capture: true,
        once: true,
      });
      if (clickBlockTimer !== null) {
        window.clearTimeout(clickBlockTimer);
      }
      clickBlockTimer = window.setTimeout(() => {
        window.removeEventListener('click', blockClick, { capture: true });
        clickBlockTimer = null;
      }, 320);
    };

    const clearInlineStyles = (el: HTMLElement) => {
      el.style.transition = '';
      el.style.willChange = '';
      if (mode === 'transform') {
        el.style.transform = '';
      } else {
        el.style.height = savedHeight;
        el.style.overflow = savedOverflow;
      }
    };

    const isInsideBottomDragZone = (
      el: HTMLElement,
      clientX: number,
      clientY: number,
      target: EventTarget | null
    ): boolean => {
      const rect = el.getBoundingClientRect();
      if (rect.height <= 0 || rect.width <= 0) return false;

      const targetEl = target instanceof Element ? target : null;
      if (targetEl?.closest('[data-swipe-handle]')) {
        return el.contains(targetEl);
      }

      const withinX = clientX >= rect.left - 8 && clientX <= rect.right + 8;
      const withinBottom64 =
        clientY >= rect.bottom - BOTTOM_DRAG_ZONE_PX &&
        clientY <= rect.bottom + BOTTOM_OUTER_TOLERANCE_PX;

      return withinX && withinBottom64;
    };

    const beginGesture = (
      clientX: number,
      clientY: number,
      target: EventTarget | null
    ): boolean => {
      if (isSettlingDismiss) return false;
      if (window.matchMedia(DESKTOP_MEDIA_QUERY).matches) return false;

      const el = containerRef.current;
      if (!el) return false;
      if (!isInsideBottomDragZone(el, clientX, clientY, target)) return false;

      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
        settleTimer = null;
      }

      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      mode = computed.position === 'fixed' ? 'transform' : 'height';
      activeEl = el;
      lastAnimatedEl = el;
      startX = clientX;
      startY = clientY;
      startHeight = rect.height;
      lastY = clientY;
      lastTime = performance.now();
      velocityY = 0;
      currentOffset = 0;
      savedOverflow = el.style.overflow;
      savedHeight = el.style.height;
      active = true;
      dragging = false;
      return true;
    };

    const moveGesture = (
      clientX: number,
      clientY: number,
      cancelEvent: () => void
    ) => {
      if (!active || !activeEl) return;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      if (!dragging) {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          active = false;
          activeEl = null;
          return;
        }
        if (Math.abs(deltaY) < ENGAGE_THRESHOLD_PX) {
          return;
        }
        dragging = true;
        document.documentElement.dataset.swipeDragging = 'true';
        activeEl.style.transition = 'none';
        if (mode === 'transform') {
          activeEl.style.willChange = 'transform';
        } else {
          activeEl.style.willChange = 'height';
          activeEl.style.overflow = 'hidden';
        }
      }

      cancelEvent();

      const now = performance.now();
      const dt = Math.max(4, now - lastTime);
      const instantVelocity = (clientY - lastY) / dt;
      velocityY = velocityY * 0.45 + instantVelocity * 0.55;
      lastY = clientY;
      lastTime = now;

      if (mode === 'transform') {
        // Track finger 1:1 upward & back down without detaching top edge from header
        const clampedY =
          deltaY <= 0
            ? Math.max(-startHeight, deltaY)
            : Math.min(14, deltaY * 0.22);
        currentOffset = clampedY;
        activeEl.style.transform = `translate3d(0, ${Math.round(clampedY)}px, 0)`;
      } else {
        // Track finger 1:1 upward & back down by collapsing/expanding sheet height cleanly
        const elasticDown = deltaY > 0 ? Math.min(20, deltaY * 0.25) : deltaY;
        const nextHeight = Math.max(
          0,
          Math.min(startHeight + 20, startHeight + elasticDown)
        );
        currentOffset = nextHeight - startHeight;
        activeEl.style.height = `${Math.round(nextHeight)}px`;
      }
    };

    const endGesture = (cancelled: boolean) => {
      if (!active || !activeEl) return;
      const el = activeEl;
      const wasDragging = dragging;
      const offset = currentOffset;
      const releaseVelocity = velocityY;

      active = false;
      dragging = false;
      activeEl = null;
      clearSwipeFlag();

      if (!wasDragging) return;

      suppressNextClick();

      const dismissThreshold = Math.min(
        MAX_DISMISS_DISTANCE_PX,
        Math.max(MIN_DISMISS_DISTANCE_PX, startHeight * DISMISS_HEIGHT_RATIO)
      );
      const isFlickingDown = releaseVelocity > 0.22;
      const shouldDismiss =
        !cancelled &&
        !isFlickingDown &&
        (offset <= -dismissThreshold ||
          (offset <= -FLICK_MIN_DISTANCE_PX &&
            releaseVelocity <= -FLICK_VELOCITY_THRESHOLD));

      if (shouldDismiss) {
        isSettlingDismiss = true;
        if (mode === 'transform') {
          el.style.transition =
            'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.transform = `translate3d(0, ${-Math.ceil(startHeight + 24)}px, 0)`;
        } else {
          el.style.transition = 'height 200ms cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.height = '0px';
        }
        settleTimer = window.setTimeout(() => {
          settleTimer = null;
          isSettlingDismiss = false;
          onDismiss();
        }, 190);
      } else {
        if (mode === 'transform') {
          el.style.transition =
            'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.transform = 'translate3d(0, 0, 0)';
        } else {
          el.style.transition = 'height 260ms cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.height = `${Math.round(startHeight)}px`;
        }
        settleTimer = window.setTimeout(() => {
          settleTimer = null;
          clearInlineStyles(el);
        }, 270);
      }
    };

    // Native Touch Events (iOS Safari, Android Chrome, PWA, DevTools mobile emulation)
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;
      beginGesture(touch.clientX, touch.clientY, event.target);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!active || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;
      moveGesture(touch.clientX, touch.clientY, () => {
        if (event.cancelable) {
          event.preventDefault();
        }
      });
    };

    const handleTouchEnd = () => endGesture(false);
    const handleTouchCancel = () => endGesture(true);

    // Mouse Pointer Fallback (narrow mobile-width desktop preview testing)
    let activePointerId: number | null = null;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      if (beginGesture(event.clientX, event.clientY, event.target)) {
        activePointerId = event.pointerId;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || activePointerId !== event.pointerId) {
        return;
      }
      moveGesture(event.clientX, event.clientY, () => {
        event.preventDefault();
      });
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || activePointerId !== event.pointerId) {
        return;
      }
      activePointerId = null;
      endGesture(false);
    };

    const handlePointerCancel = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || activePointerId !== event.pointerId) {
        return;
      }
      activePointerId = null;
      endGesture(true);
    };

    window.addEventListener('touchstart', handleTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener('touchmove', handleTouchMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener('touchend', handleTouchEnd, {
      passive: true,
      capture: true,
    });
    window.addEventListener('touchcancel', handleTouchCancel, {
      passive: true,
      capture: true,
    });
    window.addEventListener('pointerdown', handlePointerDown, {
      passive: true,
      capture: true,
    });
    window.addEventListener('pointermove', handlePointerMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener('pointerup', handlePointerUp, {
      passive: true,
      capture: true,
    });
    window.addEventListener('pointercancel', handlePointerCancel, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, {
        capture: true,
      });
      window.removeEventListener('touchmove', handleTouchMove, {
        capture: true,
      });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('touchcancel', handleTouchCancel, {
        capture: true,
      });
      window.removeEventListener('pointerdown', handlePointerDown, {
        capture: true,
      });
      window.removeEventListener('pointermove', handlePointerMove, {
        capture: true,
      });
      window.removeEventListener('pointerup', handlePointerUp, {
        capture: true,
      });
      window.removeEventListener('pointercancel', handlePointerCancel, {
        capture: true,
      });
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }
      if (clickBlockTimer !== null) {
        window.clearTimeout(clickBlockTimer);
      }
      clearSwipeFlag();
      if (lastAnimatedEl) {
        lastAnimatedEl.style.transition = '';
        lastAnimatedEl.style.willChange = '';
        lastAnimatedEl.style.transform = '';
      }
    };
  }, [containerRef, isOpen, onDismiss]);
}
