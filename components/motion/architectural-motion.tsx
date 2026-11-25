'use client';

import { useEffect, type DependencyList, type RefObject } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Variants } from 'motion/react';
import {
  MOTION_EASE,
  MOTION_VARIANTS,
  createDirectionalItemVariants,
} from '@/lib/motion/system';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

/**
 * Shared Framer Motion Architectural Variants unified with `/lib/motion/system.ts`:
 * - Re-exported for clean backward compatibility across drawer, feed, and card stages.
 */
export const ARCHITECTURAL_EASE = MOTION_EASE.calm;

export const MENU_OVERLAY_VARIANTS: Variants = MOTION_VARIANTS.overlay;

export const MENU_LIST_VARIANTS: Variants = MOTION_VARIANTS.listContainer;

export const createMenuItemVariants = (isRtl: boolean): Variants =>
  createDirectionalItemVariants(isRtl, 22);

export const SUBMENU_LIST_VARIANTS: Variants = MOTION_VARIANTS.submenuContainer;

export const createSubmenuItemVariants = (isRtl: boolean): Variants =>
  createDirectionalItemVariants(isRtl, 14);

export const CARD_STAGGER_CONTAINER_VARIANTS: Variants =
  MOTION_VARIANTS.cardContainer;

export const CARD_STAGGER_ITEM_VARIANTS: Variants = MOTION_VARIANTS.cardItem;

interface UseArchitecturalEntranceOptions {
  readonly isRtl?: boolean;
  readonly dependencies?: DependencyList;
}

/**
 * GSAP Hierarchical Stage Choreography:
 * - Animates tagged architectural layers inside `containerRef` sequentially by hierarchy:
 *   1) `[data-gsap="kicker"]`   -> quiet directional eyebrow
 *   2) `[data-gsap="heading"]`  -> display titles (y + subtle opacity sweep)
 *   3) `[data-gsap="divider"]`  -> hairline rule drawing from logical start -> end
 *   4) `[data-gsap="body"]`     -> editorial copy & spec rows
 *   5) `[data-gsap="control"]`  -> filters, switches, interactive actions
 *   6) `[data-gsap="media"]`    -> primary hero photography & stage frames
 *   7) `[data-gsap="card"]`     -> card stacks / tracklist items
 * - Automatically attaches IntersectionObserver + GSAP reveals to `[data-gsap-scroll]` elements
 *   so below-the-fold sections animate calmly as the user scrolls inside custom panes or window.
 */
export function useArchitecturalEntrance(
  containerRef: RefObject<HTMLElement | null>,
  options: UseArchitecturalEntranceOptions = {}
) {
  const { isRtl = false, dependencies = [] } = options;

  const depKey = dependencies.map((dep) => String(dep ?? '')).join('::');

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || typeof window === 'undefined') return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const kickers = container.querySelectorAll<HTMLElement>('[data-gsap="kicker"]');
      const headings = container.querySelectorAll<HTMLElement>('[data-gsap="heading"]');
      const dividers = container.querySelectorAll<HTMLElement>('[data-gsap="divider"]');
      const bodies = container.querySelectorAll<HTMLElement>('[data-gsap="body"]');
      const controls = container.querySelectorAll<HTMLElement>('[data-gsap="control"]');
      const media = container.querySelectorAll<HTMLElement>('[data-gsap="media"]');
      const cards = container.querySelectorAll<HTMLElement>('[data-gsap="card"]');

      if (prefersReducedMotion) {
        gsap.set(
          [kickers, headings, dividers, bodies, controls, media, cards],
          { clearProps: 'all' }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: {
          ease: MOTION_EASE.gsapCalm,
          clearProps: 'transform',
        },
      });

      if (kickers.length) {
        tl.fromTo(
          kickers,
          { autoAlpha: 0, x: isRtl ? 14 : -14 },
          { autoAlpha: 1, x: 0, duration: 0.38, stagger: 0.045 },
          0
        );
      }

      if (headings.length) {
        tl.fromTo(
          headings,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.06 },
          0.02
        );
      }

      if (dividers.length) {
        tl.fromTo(
          dividers,
          {
            scaleX: 0,
            transformOrigin: isRtl ? 'right center' : 'left center',
          },
          { scaleX: 1, duration: 0.48, stagger: 0.05 },
          0.06
        );
      }

      if (bodies.length) {
        tl.fromTo(
          bodies,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.05 },
          0.06
        );
      }

      if (controls.length) {
        tl.fromTo(
          controls,
          { autoAlpha: 0, y: 10, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.045 },
          0.08
        );
      }

      if (media.length) {
        tl.fromTo(
          media,
          { autoAlpha: 0, y: 16, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.52, stagger: 0.07 },
          0.1
        );
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          { autoAlpha: 0, y: 16, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.055 },
          0.12
        );
      }
    },
    { scope: containerRef, dependencies: [isRtl, depKey] }
  );

  // Lazy Scroll-Triggered GSAP Reveals (Works inside both custom scroll panes and window)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const scrollTargets = Array.from(
      container.querySelectorAll<HTMLElement>('[data-gsap-scroll]')
    );
    if (scrollTargets.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      gsap.set(scrollTargets, { clearProps: 'all' });
      return;
    }

    gsap.set(scrollTargets, { autoAlpha: 0, y: 26 });

    const observer = new IntersectionObserver(
      (entries) => {
        const revealed: HTMLElement[] = [];
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            revealed.push(el);
            observer.unobserve(el);
          }
        }
        if (revealed.length > 0) {
          gsap.to(revealed, {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.075,
            ease: MOTION_EASE.gsapCalm,
            clearProps: 'transform',
          });
        }
      },
      {
        threshold: 0.04,
        rootMargin: '0px 0px -16px 0px',
      }
    );

    scrollTargets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [containerRef, depKey]);
}
