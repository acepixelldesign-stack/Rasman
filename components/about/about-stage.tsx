'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import type { AuthorSocialPlatform } from '@/lib/data/blog';
import {
  CORE_TEAM_MEMBERS,
  PREVIOUS_TEAM_MEMBERS,
  STUDIO_FOUNDER,
  STUDIO_PROFILE,
  getAboutLocalizedText,
} from '@/lib/data/about';
import { MOTION_TRANSITIONS } from '@/lib/motion/system';
import { useAppContext } from '@/components/providers/app-provider';
import { useStickySubBar } from '@/components/frame/sticky-sub-bar-context';
import { cn } from '@/lib/utils';

type ChapterId = 'studio' | 'founder' | 'current' | 'previous';

/** Time-calibrated exponential damping rates (frame-rate independent across 60Hz/120Hz displays) */
const COAST_DAMPING = 7.2;
const DRAG_DAMPING = 22;
const STOP_THRESHOLD_PX = 0.25;
const TOUCH_MOMENTUM_MS = 320;
const MAX_TOUCH_VELOCITY_PX_PER_MS = 3.6;

function renderSocialIcon(platform: AuthorSocialPlatform) {
  switch (platform) {
    case 'facebook':
      return <FaFacebookF size={13} aria-hidden="true" />;
    case 'x':
      return <FaXTwitter size={13} aria-hidden="true" />;
    case 'instagram':
      return <FaInstagram size={14} aria-hidden="true" />;
    case 'linkedin':
      return <FaLinkedinIn size={13} aria-hidden="true" />;
  }
}

/**
 * Rasman Team Continuous Horizontal Architectural Ribbon (Desktop & Mobile):
 * - Fixed top 48px segmented square progress bar directly below header (unbroken bottom hairline, zero green bar)
 * - Frame-rate-independent kinetic inertial scroll engine (desktop wheel + mobile upward/downward/horizontal touch flick):
 *     - Silky frame-by-frame gliding with momentum coast after finger release
 *     - Vertical dividers between sections glide smoothly toward logical start (left in EN, right in FA/AR)
 * - Mobile titles 28px (4px smaller than desktop 32px)
 * - Section 3 (Current Members): portrait scaled ~24px narrower (proportionally shorter) with name & role matching Founder typography
 * - Section 4 (Previous Members): 2 stacked sequential horizontal rows with compact square portraits and RTL-right-aligned tenure
 */
export function AboutStage() {
  const { locale, dir, isRtl, dictionary } = useAppContext();
  const prefersReducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const stageRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const targetScrollPosRef = useRef<number>(0);
  const currentScrollPosRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const lastFrameTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const chapters = useMemo(
    () =>
      [
        {
          id: 'studio' as ChapterId,
          number: '1',
          label: dictionary.about.sectionStudio,
        },
        {
          id: 'founder' as ChapterId,
          number: '2',
          label: dictionary.about.sectionPrincipal,
        },
        {
          id: 'current' as ChapterId,
          number: '3',
          label: dictionary.about.sectionCoreTeam,
        },
        {
          id: 'previous' as ChapterId,
          number: '4',
          label: dictionary.about.sectionPreviousTeam,
        },
      ] as const,
    [dictionary.about]
  );

  const stopSmoothScroll = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    isAnimatingRef.current = false;
  }, []);

  /** Read normalized logical horizontal offset from start (0 -> maxScroll) in both LTR and RTL */
  const readLogicalScrollPos = useCallback((track: HTMLDivElement): number => {
    return Math.abs(track.scrollLeft);
  }, []);

  /** Write normalized logical horizontal offset (0 -> maxScroll) into browser scrollLeft */
  const writeLogicalScrollPos = useCallback(
    (track: HTMLDivElement, logicalPos: number) => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const clamped = Math.max(0, Math.min(maxScroll, logicalPos));
      track.scrollLeft = isRtl ? -clamped : clamped;
    },
    [isRtl]
  );

  /** Compute exact logical distance from track start edge to each section's leading divider */
  const getSectionLogicalOffset = useCallback(
    (index: number): number => {
      const track = trackRef.current;
      const section = sectionRefs.current[index];
      if (!track || !section) return 0;

      const trackRect = track.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const currentPos = readLogicalScrollPos(track);

      if (isRtl) {
        return Math.max(0, currentPos + (trackRect.right - sectionRect.right));
      }
      return Math.max(0, currentPos + (sectionRect.left - trackRect.left));
    },
    [isRtl, readLogicalScrollPos]
  );

  /** Sync active section index and continuous percentage from live horizontal scroll */
  const syncProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);
    const pos = Math.min(maxScroll, readLogicalScrollPos(track));
    const ratio = pos / maxScroll;
    setProgressPercent(Math.round(ratio * 100));

    const trackRect = track.getBoundingClientRect();
    const thresholdPx = track.clientWidth * 0.28;
    let resolvedIndex = 0;

    for (let i = 0; i < chapters.length; i += 1) {
      const el = sectionRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const leadingGap = isRtl
        ? trackRect.right - rect.right
        : rect.left - trackRect.left;
      if (leadingGap <= thresholdPx) {
        resolvedIndex = i;
      }
    }

    setActiveIndex(resolvedIndex);
  }, [chapters.length, isRtl, readLogicalScrollPos]);

  /** Frame-rate-independent exponential damping loop for buttery-smooth wheel & touch inertia */
  const ensureSmoothLoop = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    lastFrameTimeRef.current = performance.now();

    const tick = (now: number) => {
      const track = trackRef.current;
      if (!track) {
        isAnimatingRef.current = false;
        rafRef.current = null;
        return;
      }

      const dtSeconds = Math.min(
        0.05,
        Math.max(0.001, (now - lastFrameTimeRef.current) / 1000)
      );
      lastFrameTimeRef.current = now;

      const diff = targetScrollPosRef.current - currentScrollPosRef.current;
      if (!isDraggingRef.current && Math.abs(diff) <= STOP_THRESHOLD_PX) {
        currentScrollPosRef.current = targetScrollPosRef.current;
        writeLogicalScrollPos(track, currentScrollPosRef.current);
        syncProgress();
        isAnimatingRef.current = false;
        rafRef.current = null;
        return;
      }

      const damping = isDraggingRef.current ? DRAG_DAMPING : COAST_DAMPING;
      const alpha = 1 - Math.exp(-damping * dtSeconds);
      currentScrollPosRef.current += diff * alpha;
      writeLogicalScrollPos(track, currentScrollPosRef.current);
      syncProgress();
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [syncProgress, writeLogicalScrollPos]);

  const scrollToLogicalPos = useCallback(
    (nextPos: number) => {
      const track = trackRef.current;
      if (!track) return;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const clamped = Math.max(0, Math.min(maxScroll, nextPos));

      if (prefersReducedMotion) {
        stopSmoothScroll();
        currentScrollPosRef.current = clamped;
        targetScrollPosRef.current = clamped;
        writeLogicalScrollPos(track, clamped);
        syncProgress();
        return;
      }

      if (!isAnimatingRef.current) {
        currentScrollPosRef.current = readLogicalScrollPos(track);
      }
      targetScrollPosRef.current = clamped;
      ensureSmoothLoop();
    },
    [
      ensureSmoothLoop,
      prefersReducedMotion,
      readLogicalScrollPos,
      stopSmoothScroll,
      syncProgress,
      writeLogicalScrollPos,
    ]
  );

  const handleJumpToChapter = useCallback(
    (index: number) => {
      const offset = getSectionLogicalOffset(index);
      scrollToLogicalPos(offset);
    },
    [getSectionLogicalOffset, scrollToLogicalPos]
  );

  // Reset ribbon cleanly to start whenever direction/locale flips and sync on resize
  useEffect(() => {
    stopSmoothScroll();
    isDraggingRef.current = false;

    const rafId = window.requestAnimationFrame(() => {
      const track = trackRef.current;
      if (track) {
        track.scrollLeft = 0;
        currentScrollPosRef.current = 0;
        targetScrollPosRef.current = 0;
      }
      syncProgress();
    });

    const handleResize = () => syncProgress();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [locale, isRtl, stopSmoothScroll, syncProgress]);

  // Continuous Wheel, Non-Passive Bidirectional Touch + Kinetic Inertia, & Keyboard Navigation
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof window === 'undefined') return;

    let touchLastX = 0;
    let touchLastY = 0;
    let touchLastTime = 0;
    let touchVelocity = 0;
    let touchMoved = false;

    const isBackgroundLocked = () =>
      document.documentElement.dataset.scrollLocked === 'true';

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || isBackgroundLocked()) return;
      const track = trackRef.current;
      if (!track) return;

      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      if (maxScroll <= 1) return;

      event.preventDefault();

      const multiplier =
        event.deltaMode === 1
          ? 32
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;

      const rawX = event.deltaX * multiplier;
      const rawY = event.deltaY * multiplier;
      const logicalDelta =
        Math.abs(rawX) > Math.abs(rawY) ? (isRtl ? -rawX : rawX) : rawY;

      if (Math.abs(logicalDelta) < 0.2) return;

      if (!isAnimatingRef.current) {
        const livePos = readLogicalScrollPos(track);
        currentScrollPosRef.current = livePos;
        targetScrollPosRef.current = livePos;
      }

      const nextTarget = Math.max(
        0,
        Math.min(maxScroll, targetScrollPosRef.current + logicalDelta)
      );
      targetScrollPosRef.current = nextTarget;

      if (prefersReducedMotion) {
        currentScrollPosRef.current = nextTarget;
        writeLogicalScrollPos(track, nextTarget);
        syncProgress();
      } else {
        ensureSmoothLoop();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (isBackgroundLocked()) return;
      if (event.touches.length !== 1) return;

      // Let taps on interactive controls (links/buttons in progress bar or social icons) click normally
      const target = event.target as Element | null;
      if (target?.closest('nav[aria-label]')) return;

      const touch = event.touches[0];
      const track = trackRef.current;
      if (!touch || !track) return;

      const livePos = readLogicalScrollPos(track);
      currentScrollPosRef.current = livePos;
      targetScrollPosRef.current = livePos;
      isDraggingRef.current = true;
      touchLastX = touch.clientX;
      touchLastY = touch.clientY;
      touchLastTime = performance.now();
      touchVelocity = 0;
      touchMoved = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDraggingRef.current || isBackgroundLocked()) return;
      const touch = event.touches[0];
      const track = trackRef.current;
      if (!touch || !track) return;

      const now = performance.now();
      const dx = touchLastX - touch.clientX; // positive when dragging finger left
      const dy = touchLastY - touch.clientY; // positive when dragging finger up, negative when dragging down (scroll up!)
      const dt = Math.max(4, now - touchLastTime);

      touchLastX = touch.clientX;
      touchLastY = touch.clientY;
      touchLastTime = now;

      // Choose dominant axis so BOTH vertical up/down swipes and horizontal swipes work reliably
      const logicalDelta =
        Math.abs(dy) >= Math.abs(dx) ? dy : isRtl ? -dx : dx;

      if (Math.abs(logicalDelta) > 0.4) {
        touchMoved = true;
      }

      // Prevent mobile browser pull-to-refresh / native page scroll takeover on both upward and downward swipes
      if (event.cancelable) {
        event.preventDefault();
      }

      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const scaledDelta = logicalDelta * 1.25;
      targetScrollPosRef.current = Math.max(
        0,
        Math.min(maxScroll, targetScrollPosRef.current + scaledDelta)
      );

      // Exponentially smoothed velocity (px / ms) for buttery kinetic throw upon release
      const instantVelocity = Math.max(
        -MAX_TOUCH_VELOCITY_PX_PER_MS,
        Math.min(MAX_TOUCH_VELOCITY_PX_PER_MS, scaledDelta / dt)
      );
      touchVelocity = touchVelocity * 0.55 + instantVelocity * 0.45;

      if (prefersReducedMotion) {
        currentScrollPosRef.current = targetScrollPosRef.current;
        writeLogicalScrollPos(track, currentScrollPosRef.current);
        syncProgress();
      } else {
        ensureSmoothLoop();
      }
    };

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const track = trackRef.current;
      if (!track || !touchMoved) {
        touchVelocity = 0;
        return;
      }

      if (!prefersReducedMotion && Math.abs(touchVelocity) > 0.08) {
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const momentumThrow = touchVelocity * TOUCH_MOMENTUM_MS;
        targetScrollPosRef.current = Math.max(
          0,
          Math.min(maxScroll, targetScrollPosRef.current + momentumThrow)
        );
        ensureSmoothLoop();
      }
      touchVelocity = 0;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isBackgroundLocked()) return;
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const track = trackRef.current;
      if (!track) return;
      const stepPx = Math.max(220, Math.round(track.clientWidth * 0.45));
      const basePos = isAnimatingRef.current
        ? targetScrollPosRef.current
        : readLogicalScrollPos(track);

      if (
        event.key === 'ArrowDown' ||
        event.key === 'PageDown' ||
        (!isRtl && event.key === 'ArrowRight') ||
        (isRtl && event.key === 'ArrowLeft')
      ) {
        event.preventDefault();
        scrollToLogicalPos(basePos + stepPx);
      } else if (
        event.key === 'ArrowUp' ||
        event.key === 'PageUp' ||
        (!isRtl && event.key === 'ArrowLeft') ||
        (isRtl && event.key === 'ArrowRight')
      ) {
        event.preventDefault();
        scrollToLogicalPos(basePos - stepPx);
      }
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    stage.addEventListener('touchstart', handleTouchStart, { passive: true });
    stage.addEventListener('touchmove', handleTouchMove, { passive: false });
    stage.addEventListener('touchend', handleTouchEnd, { passive: true });
    stage.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      stage.removeEventListener('wheel', handleWheel);
      stage.removeEventListener('touchstart', handleTouchStart);
      stage.removeEventListener('touchmove', handleTouchMove);
      stage.removeEventListener('touchend', handleTouchEnd);
      stage.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      isDraggingRef.current = false;
      stopSmoothScroll();
    };
  }, [
    ensureSmoothLoop,
    isRtl,
    prefersReducedMotion,
    readLogicalScrollPos,
    scrollToLogicalPos,
    stopSmoothScroll,
    syncProgress,
    writeLogicalScrollPos,
  ]);

  const studioParagraph = getAboutLocalizedText(
    STUDIO_PROFILE.paragraph,
    locale
  );
  const studioImageAlt = getAboutLocalizedText(STUDIO_PROFILE.imageAlt, locale);
  const founderName = getAboutLocalizedText(STUDIO_FOUNDER.name, locale);
  const founderRole = getAboutLocalizedText(STUDIO_FOUNDER.role, locale);
  const founderBio = STUDIO_FOUNDER.bio
    ? getAboutLocalizedText(STUDIO_FOUNDER.bio, locale)
    : '';
  const founderPortraitAlt = getAboutLocalizedText(
    STUDIO_FOUNDER.portraitAlt,
    locale
  );

  useStickySubBar({
    id: 'about-team',
    depth: 1,
    mobileOnly: false,
    ariaLabel: dictionary.about.chapterNavAriaLabel,
    content: (
      <nav
        aria-label={dictionary.about.chapterNavAriaLabel}
        className="flex h-[var(--grid-subbar)] w-full items-stretch"
      >
        {/* 4 Segmented Step Cells: 40px Inactive Cells | Stretched Active Step Container */}
        <div className="flex h-full min-w-0 flex-1 items-stretch">
          {chapters.map((chapter, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => handleJumpToChapter(index)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${chapter.number} ${chapter.label}`}
                style={{
                  flexGrow: isActive ? 1 : 0,
                  flexShrink: isActive ? 1 : 0,
                  flexBasis: 'var(--grid-cell)',
                }}
                className={cn(
                  'relative flex h-full min-w-[var(--grid-cell)] cursor-pointer items-center overflow-hidden border-e border-[var(--grid-line)]',
                  'transition-[flex-grow,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isActive
                    ? 'justify-start gap-2.5 bg-transparent px-3.5 text-start text-[var(--ink-primary)] desktop:px-5'
                    : 'justify-center px-0 text-center text-[var(--ink-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink-primary)]'
                )}
              >
                <span
                  dir="ltr"
                  className={cn(
                    'bidi-isolate shrink-0 text-[13px] leading-none tabular-nums transition-colors duration-300 desktop:text-[14px]',
                    isActive
                      ? 'font-medium text-[var(--brand-text-hover)]'
                      : 'font-normal text-current'
                  )}
                >
                  {chapter.number}
                </span>

                {isActive ? (
                  <motion.span
                    key={`${chapter.id}-${locale}`}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 5 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={MOTION_TRANSITIONS.fast}
                    className="min-w-0 flex-1 truncate text-start text-[13px] font-medium leading-none text-[var(--ink-primary)] desktop:text-[14px]"
                  >
                    {chapter.label}
                  </motion.span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* 40px Percentage Cell at Logical End */}
        <div
          aria-live="polite"
          className="flex h-full w-[var(--grid-cell)] shrink-0 items-center justify-center"
        >
          <span
            dir="ltr"
            className="bidi-isolate text-[12px] font-normal leading-none text-[var(--ink-secondary)] tabular-nums"
          >
            {progressPercent}%
          </span>
        </div>
      </nav>
    ),
  });

  return (
    <section
      ref={stageRef}
      data-smooth-prevent=""
      aria-label={dictionary.about.regionAriaLabel}
      className="relative flex h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col overflow-hidden bg-[var(--bg-canvas)] pt-[var(--grid-subbar)] touch-none overscroll-none"
    >

      {/* Container-Queried Stage Viewport Below the 48px Progress Bar (Exact 100cqw / 100cqh) */}
      <div className="relative min-h-0 flex-1 w-full [container-type:size]">
        {/* Continuous Horizontal Scrolling Architectural Ribbon (All 4 Sections Separated by Moving Vertical Dividers) */}
        <div
          ref={trackRef}
          dir={dir}
          onScroll={syncProgress}
          className="no-scrollbar flex h-full w-full flex-row items-stretch overflow-x-auto overflow-y-hidden touch-none overscroll-none"
        >
          {/* SECTION 1: RASMAN TEAM (Sticky Title -> Full-Width Viewport-Scaled Photo -> Description; Gap == Top Padding) */}
          <article
            ref={(el) => {
              sectionRefs.current[0] = el;
            }}
            className="flex h-full w-[100cqw] shrink-0 flex-col justify-start gap-6 border-e border-[var(--grid-line)] px-4 py-6 desktop:gap-12 desktop:px-14 desktop:py-12"
          >
            <div className="sticky start-4 z-10 w-fit shrink-0 desktop:start-14">
              <h1 className="text-[26px] font-normal leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] desktop:text-[32px] rtl:leading-[1.35] rtl:tracking-normal">
                {dictionary.about.sectionStudio}
              </h1>
            </div>

            {/* Full-Width Studio Photo Dynamically Scaling Vertically with Viewport Height */}
            <div className="relative min-h-[120px] w-full flex-1 overflow-hidden rounded-[4px] bg-[var(--surface-hover)]">
              <Image
                src={STUDIO_PROFILE.image}
                alt={studioImageAlt}
                fill
                priority
                sizes="(max-width: 768px) calc(100vw - 64px), calc(100vw - 160px)"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>

            {/* Studio Editorial Copy Below Image */}
            <div className="w-full shrink-0 text-start">
              <p className="text-[13px] font-normal leading-[1.7] text-[var(--ink-secondary)] sm:text-[14px] desktop:text-[17px] desktop:leading-[1.9] rtl:leading-[1.9] desktop:rtl:leading-[2.05]">
                {studioParagraph}
              </p>
            </div>
          </article>

          {/* SECTION 2: FOUNDER / بنیان‌گذار / المؤسس (Sticky Title, Square Portrait, Vertically Centered Details) */}
          <article
            ref={(el) => {
              sectionRefs.current[1] = el;
            }}
            className="flex h-full w-[100cqw] shrink-0 flex-col justify-start gap-6 border-e border-[var(--grid-line)] px-4 py-6 desktop:gap-12 desktop:px-14 desktop:py-12"
          >
            <div className="sticky start-4 z-10 w-fit shrink-0 desktop:start-14">
              <h2 className="text-[26px] font-normal leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] desktop:text-[32px] rtl:leading-[1.35] rtl:tracking-normal">
                {dictionary.about.sectionPrincipal}
              </h2>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-start justify-start gap-4 desktop:flex-row desktop:items-center desktop:justify-start desktop:gap-12">
              {/* Dynamically Scaled Square Founder Portrait: Desktop spans exact flex-1 height so top, bottom, and text gaps all equal title top padding (48px) */}
              <div className="group relative aspect-square h-[min(calc(100cqw-32px),calc(100cqh-304px))] w-[min(calc(100cqw-32px),calc(100cqh-304px))] min-h-[120px] min-w-[120px] shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] desktop:h-full desktop:w-auto desktop:max-h-full desktop:max-w-[46cqw] desktop:self-stretch">
                <Image
                  src={STUDIO_FOUNDER.portrait}
                  alt={founderPortraitAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) calc(100vw - 64px), 420px"
                  referrerPolicy="no-referrer"
                  className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>

              {/* Founder Name, Role, 2-Line Bio & Social Links (Start-Aligned) */}
              <div className="flex min-w-0 max-w-2xl flex-1 flex-col items-start gap-2.5 text-start desktop:gap-4">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[20px] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--ink-primary)] desktop:text-[28px] rtl:leading-[1.45] rtl:tracking-normal">
                    {founderName}
                  </h3>
                  <p className="text-[13px] font-normal text-[var(--ink-secondary)] desktop:text-[15px]">
                    {founderRole}
                  </p>
                </div>

                <p className="line-clamp-2 text-[13px] leading-[1.65] text-[var(--ink-secondary)] sm:text-[14px] desktop:text-[16px] desktop:leading-[1.85] rtl:leading-[1.85] desktop:rtl:leading-[2]">
                  {founderBio}
                </p>

                <nav
                  aria-label={`${founderName} — ${dictionary.about.memberSocialsAriaLabel}`}
                  className="flex flex-wrap items-center gap-2 pt-0.5"
                >
                  {STUDIO_FOUNDER.socials.map((social) => (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${founderName} — ${dictionary.socials[social.platform]}`}
                      className={cn(
                        'inline-flex h-9 w-9 items-center justify-center rounded-full desktop:h-10 desktop:w-10',
                        'border border-[var(--grid-line-strong)] bg-transparent text-[var(--ink-primary)]',
                        'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                      )}
                    >
                      {renderSocialIcon(social.platform)}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </article>

          {/* SECTION 3: CURRENT MEMBERS (Sticky Title + Exact Padding-Matched Gap + Scaled Side-by-Side Row) */}
          <article
            ref={(el) => {
              sectionRefs.current[2] = el;
            }}
            className="flex h-full min-w-[100cqw] w-max shrink-0 flex-col justify-start gap-6 border-e border-[var(--grid-line)] px-4 py-6 desktop:gap-12 desktop:px-14 desktop:py-12"
          >
            <div className="sticky start-4 z-10 w-fit shrink-0 desktop:start-14">
              <h2 className="text-[26px] font-normal leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] desktop:text-[32px] rtl:leading-[1.35] rtl:tracking-normal">
                {dictionary.about.sectionCoreTeam}
              </h2>
            </div>

            {/* Single Side-by-Side Horizontal Row Stretching Cleanly From Title Gap to Bottom Padding */}
            <ul className="flex min-h-0 flex-1 flex-row items-stretch gap-6 pe-4 desktop:gap-9 desktop:pe-8">
              {CORE_TEAM_MEMBERS.map((member) => {
                const memberName = getAboutLocalizedText(member.name, locale);
                const memberRole = getAboutLocalizedText(member.role, locale);
                const memberAlt = getAboutLocalizedText(
                  member.portraitAlt,
                  locale
                );

                return (
                  <li
                    key={member.id}
                    className="group flex h-full min-h-0 w-[min(72cqw,clamp(184px,calc((100cqh-218px)*0.75),304px))] shrink-0 flex-col justify-start gap-3 desktop:w-[clamp(196px,calc((100cqh-312px)*0.75),340px)]"
                  >
                    {/* Dynamic 3:4 Portrait Bounded Strictly by Explicit Card Width & Exact Remaining Stage Height */}
                    <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[4px] bg-[var(--surface-hover)]">
                      <Image
                        src={member.portrait}
                        alt={memberAlt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 280px, 340px"
                        referrerPolicy="no-referrer"
                        className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    </div>

                    {/* Member Name & Role Matching Founder Font Sizes */}
                    <div className="flex w-full min-w-0 shrink-0 flex-col gap-0.5 text-start">
                      <h3 className="truncate text-[20px] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--ink-primary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)] desktop:text-[28px] rtl:leading-[1.45] rtl:tracking-normal">
                        {memberName}
                      </h3>
                      <p className="truncate text-[13px] font-normal leading-[1.45] text-[var(--ink-secondary)] desktop:text-[15px]">
                        {memberRole}
                      </p>
                    </div>

                    <nav
                      aria-label={`${memberName} — ${dictionary.about.memberSocialsAriaLabel}`}
                      className="flex shrink-0 items-center gap-2"
                    >
                      {member.socials.map((social) => (
                        <a
                          key={social.platform}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${memberName} — ${dictionary.socials[social.platform]}`}
                          className={cn(
                            'inline-flex h-8 w-8 items-center justify-center rounded-full',
                            'border border-[var(--grid-line-strong)] bg-transparent text-[var(--ink-secondary)]',
                            'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                          )}
                        >
                          {renderSocialIcon(social.platform)}
                        </a>
                      ))}
                    </nav>
                  </li>
                );
              })}
            </ul>
          </article>

          {/* SECTION 4: PREVIOUS MEMBERS (Exact Title-Gap-to-Bottom-Padding Dual Rows Matching Section 3 Total Height, 16px Row Gap) */}
          <article
            ref={(el) => {
              sectionRefs.current[3] = el;
            }}
            className="flex h-full min-w-[100cqw] w-max shrink-0 flex-col justify-start gap-6 px-4 py-6 desktop:gap-12 desktop:px-14 desktop:py-12"
          >
            <div className="sticky start-4 z-10 w-fit shrink-0 desktop:start-14">
              <h2 className="text-[26px] font-normal leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] desktop:text-[32px] rtl:leading-[1.35] rtl:tracking-normal">
                {dictionary.about.sectionPreviousTeam}
              </h2>
            </div>

            {/* 2 Stacked Equal Rows (16px Vertical Gap) Scaling From Title Gap to Bottom Padding — Exact Total Height Parity with Section 3 */}
            <ul className="grid min-h-0 h-full w-full flex-1 grid-flow-col grid-rows-[repeat(2,minmax(0,1fr))] items-stretch gap-x-5 gap-y-4 pe-4 desktop:justify-between desktop:gap-x-8 desktop:gap-y-4 desktop:pe-0">
              {PREVIOUS_TEAM_MEMBERS.map((member) => {
                const memberName = getAboutLocalizedText(member.name, locale);
                const memberRole = getAboutLocalizedText(member.role, locale);
                const memberAlt = getAboutLocalizedText(
                  member.portraitAlt,
                  locale
                );

                return (
                  <li
                    key={member.id}
                    className="group flex h-full min-h-0 shrink-0 flex-col justify-between gap-1.5 desktop:flex-row desktop:items-center desktop:justify-start desktop:gap-4"
                  >
                    {/* Dynamically Scaled Square Portrait Spanning Exact Row Height With Explicit Horizontal Floor */}
                    <div className="relative aspect-square h-[clamp(96px,calc(50cqh-118px),210px)] w-[clamp(96px,calc(50cqh-118px),210px)] shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] desktop:h-full desktop:w-auto desktop:min-w-[clamp(96px,calc(50cqh-104px),260px)] desktop:self-stretch">
                      <Image
                        src={member.portrait}
                        alt={memberAlt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 180px, 240px"
                        referrerPolicy="no-referrer"
                        className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    </div>

                    {/* Name, Role & Tenure Date (Below Portrait on Mobile | Vertically Centered Beside Portrait on Desktop) */}
                    <div className="flex w-[clamp(112px,34vw,160px)] shrink-0 min-w-0 flex-col gap-0.5 text-start desktop:w-[clamp(132px,13cqw,184px)] desktop:gap-1">
                      <h3 className="truncate text-[13px] font-medium leading-[1.3] text-[var(--ink-primary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)] desktop:text-[15px]">
                        {memberName}
                      </h3>
                      <p className="truncate text-[11px] leading-[1.4] text-[var(--ink-secondary)] desktop:text-[13px]">
                        {memberRole}
                      </p>
                      <p className="text-start text-[11px] font-normal leading-[1.35] text-[var(--ink-muted)] desktop:text-[12px]">
                        <span
                          dir="ltr"
                          className="bidi-isolate inline-block tabular-nums"
                        >
                          {member.tenure}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
