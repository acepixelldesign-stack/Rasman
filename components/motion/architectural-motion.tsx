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
 * Shared Framer Motion Architectural Variants unified with `/lib/motion/system.ts`
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
 * Unified 3.00-Second Rasman Architectural Stage Choreography:
 * - Perimeter frame, header, and docked sticky sidebars remain strictly stationary
 * - Horizontal dividers (`[data-gsap="divider"]`) draw smoothly from left-to-right in LTR
 *   (and right-to-left in RTL)
 * - Content blocks (`kicker`, `heading`, `body`, `control`, `media`, `card`) glide calmly
 *   top-to-bottom (`y: -18 -> 0`) across a serene 3.00s total timeline
 * - Scroll-triggered lazy reveals (`[data-gsap-scroll]`) unveil below-the-fold sections smoothly
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

      const kickers = Array.from(
        container.querySelectorAll<HTMLElement>('[data-gsap="kicker"]')
      );
      const headings = Array.from(
        container.querySelectorAll<HTMLElement>('[data-gsap="heading"]')
      );
      const dividers = Array.from(
        container.querySelectorAll<HTMLElement>('[data-gsap="divider"]')
      );
      const bodies = Array.from(
        container.querySelectorAll<HTMLElement>('[data-gsap="body"]')
      );
      const controls = Array.from(
        container.querySelectorAll<HTMLElement>('[data-gsap="control"]')
      );
      const media = Array.from(
        container.querySelectorAll<HTMLElement>('[data-gsap="media"]')
      );
      const cards = Array.from(
        container.querySelectorAll<HTMLElement>('[data-gsap="card"]')
      );

      const allTargets = [
        ...kickers,
        ...headings,
        ...dividers,
        ...bodies,
        ...controls,
        ...media,
        ...cards,
      ];

      if (allTargets.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(allTargets, { clearProps: 'all' });
        return;
      }

      const calcStagger = (
        count: number,
        windowSec: number,
        itemDur: number
      ) => (count > 1 ? Math.max(0.03, (windowSec - itemDur) / (count - 1)) : 0);

      const tl = gsap.timeline({
        defaults: {
          ease: MOTION_EASE.gsapCalm,
          clearProps: 'transform',
        },
      });

      // Phase 1 (0.00s -> 1.15s): Horizontal dividers draw smoothly start -> end (left -> right in EN)
      if (dividers.length > 0) {
        const dur = 0.85;
        tl.fromTo(
          dividers,
          {
            scaleX: 0,
            transformOrigin: isRtl ? 'right center' : 'left center',
          },
          {
            scaleX: 1,
            duration: dur,
            stagger: calcStagger(dividers.length, 1.15, dur),
          },
          0
        );
      }

      // Phase 2 (0.12s -> 1.35s): Kickers & primary headings descend top -> bottom
      if (kickers.length > 0) {
        const dur = 0.62;
        tl.fromTo(
          kickers,
          { autoAlpha: 0, y: -14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: dur,
            stagger: calcStagger(kickers.length, 0.85, dur),
          },
          0.12
        );
      }

      if (headings.length > 0) {
        const dur = 0.78;
        tl.fromTo(
          headings,
          { autoAlpha: 0, y: -18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: dur,
            stagger: calcStagger(headings.length, 1.05, dur),
          },
          0.24
        );
      }

      // Phase 3 (0.58s -> 2.10s): Editorial copy, spec rows & interactive controls descend top -> bottom
      if (bodies.length > 0) {
        const dur = 0.72;
        tl.fromTo(
          bodies,
          { autoAlpha: 0, y: -14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: dur,
            stagger: calcStagger(bodies.length, 1.35, dur),
          },
          0.58
        );
      }

      if (controls.length > 0) {
        const dur = 0.68;
        tl.fromTo(
          controls,
          { autoAlpha: 0, y: -12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: dur,
            stagger: calcStagger(controls.length, 1.0, dur),
          },
          0.95
        );
      }

      // Phase 4 (1.15s -> 3.00s): Primary architectural photography & cards settle calmly top -> bottom
      if (media.length > 0) {
        const dur = 0.95;
        tl.fromTo(
          media,
          { autoAlpha: 0, y: -18, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: dur,
            stagger: calcStagger(media.length, 1.55, dur),
          },
          1.15
        );
      }

      if (cards.length > 0) {
        const dur = 0.82;
        tl.fromTo(
          cards,
          { autoAlpha: 0, y: -16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: dur,
            stagger: calcStagger(cards.length, 1.45, dur),
          },
          1.55
        );
      }
    },
    { scope: containerRef, dependencies: [isRtl, depKey] }
  );

  // Lazy Scroll-Triggered GSAP Reveals (Top-to-bottom calm reveal inside window or custom panes)
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

    gsap.set(scrollTargets, { autoAlpha: 0, y: -18 });

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
            duration: 0.78,
            stagger: 0.085,
            ease: MOTION_EASE.gsapCalm,
            clearProps: 'transform',
          });
        }
      },
      {
        threshold: 0.04,
        rootMargin: '0px 0px -12px 0px',
      }
    );

    scrollTargets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [containerRef, depKey]);
}
