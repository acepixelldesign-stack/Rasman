'use client';

import { useEffect } from 'react';

let activeLockCount = 0;
let savedHtmlOverflow = '';
let savedBodyOverflow = '';
let savedHtmlOverscroll = '';
let savedBodyOverscroll = '';

const lockListeners = new Set<() => void>();

function notifyLockListeners(): void {
  lockListeners.forEach((listener) => listener());
}

export function subscribeScrollLock(listener: () => void): () => void {
  lockListeners.add(listener);
  return () => {
    lockListeners.delete(listener);
  };
}

export function getScrollLockClientSnapshot(): boolean {
  return activeLockCount > 0;
}

export function getScrollLockServerSnapshot(): boolean {
  return false;
}

/**
 * Check if an event target lives inside an allowed scrollable drawer/menu region
 * marked with `data-scroll-lock-allow` that actually has room to scroll.
 */
function canScrollInsideAllowedContainer(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const allowedRoot = target.closest('[data-scroll-lock-allow]');
  if (!allowedRoot) return false;

  let el: Element | null = target;
  while (el) {
    const style = window.getComputedStyle(el);
    const hasYOverflow =
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      el.scrollHeight > el.clientHeight + 1;
    const hasXOverflow =
      (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
      el.scrollWidth > el.clientWidth + 1;
    if (hasYOverflow || hasXOverflow) {
      return true;
    }
    if (el === allowedRoot) break;
    el = el.parentElement;
  }

  return false;
}

function handleLockedWheel(event: WheelEvent): void {
  if (activeLockCount <= 0) return;
  if (canScrollInsideAllowedContainer(event.target)) return;
  event.preventDefault();
  event.stopPropagation();
}

function handleLockedTouchMove(event: TouchEvent): void {
  if (activeLockCount <= 0) return;
  if (canScrollInsideAllowedContainer(event.target)) return;
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
}

function acquireGlobalScrollLock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (activeLockCount === 0) {
    const html = document.documentElement;
    const body = document.body;

    savedHtmlOverflow = html.style.overflow;
    savedBodyOverflow = body.style.overflow;
    savedHtmlOverscroll = html.style.overscrollBehavior;
    savedBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    html.dataset.scrollLocked = 'true';

    window.addEventListener('wheel', handleLockedWheel, {
      passive: false,
      capture: true,
    });
    window.addEventListener('touchmove', handleLockedTouchMove, {
      passive: false,
      capture: true,
    });
  }

  activeLockCount += 1;
  notifyLockListeners();
}

function releaseGlobalScrollLock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  activeLockCount = Math.max(0, activeLockCount - 1);

  if (activeLockCount === 0) {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = savedHtmlOverflow;
    body.style.overflow = savedBodyOverflow;
    html.style.overscrollBehavior = savedHtmlOverscroll;
    body.style.overscrollBehavior = savedBodyOverscroll;
    delete html.dataset.scrollLocked;

    window.removeEventListener('wheel', handleLockedWheel, { capture: true });
    window.removeEventListener('touchmove', handleLockedTouchMove, {
      capture: true,
    });
  }

  notifyLockListeners();
}

/**
 * Reference-counted background scroll lock for menus, drawers, and overlays.
 * Freezes background page scroll (both native and custom wheel/touch listeners)
 * while allowing internal scrolling inside any descendant marked `data-scroll-lock-allow`.
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;
    acquireGlobalScrollLock();
    return () => {
      releaseGlobalScrollLock();
    };
  }, [isLocked]);
}
