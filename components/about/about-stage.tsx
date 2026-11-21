'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
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
import { SITE_CONFIG } from '@/lib/config/site';
import { useAppContext } from '@/components/providers/app-provider';
import { useArchitecturalEntrance } from '@/components/motion/architectural-motion';
import { cn } from '@/lib/utils';

type ChapterId = 'studio' | 'principal' | 'core' | 'previous';

const HORIZONTAL_LERP = 0.095;
const STOP_THRESHOLD_PX = 0.35;

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
 * Horizontal Architectural About & Rasman Team Stage:
 * - Always scrolls horizontally on both desktop AND mobile without visible scrollbar
 * - Vertical grid dividers separate sequential chapters (Studio | Principal | Core Team | Previous Team)
 * - Previous Team displays 2 stacked horizontal rows of square portraits with name/role/date to the side,
 *   sized and spaced so the combined height of 2 rows matches a single Core Team card
 */
export function AboutStage() {
  const { locale, isRtl, dictionary } = useAppContext();

  const stageRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const studioPanelRef = useRef<HTMLElement>(null);
  const principalPanelRef = useRef<HTMLElement>(null);
  const corePanelRef = useRef<HTMLElement>(null);
  const previousPanelRef = useRef<HTMLElement>(null);

  useArchitecturalEntrance(stageRef, { isRtl });

  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState<ChapterId>('studio');
  const [isDragging, setIsDragging] = useState(false);

  const targetOffsetRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startOffset: 0,
    pointerId: -1,
  });

  const chapters = useMemo(
    () =>
      [
        {
          id: 'studio' as ChapterId,
          label: dictionary.about.sectionStudio,
          ref: studioPanelRef,
        },
        {
          id: 'principal' as ChapterId,
          label: dictionary.about.sectionPrincipal,
          ref: principalPanelRef,
        },
        {
          id: 'core' as ChapterId,
          label: dictionary.about.sectionCoreTeam,
          ref: corePanelRef,
        },
        {
          id: 'previous' as ChapterId,
          label: dictionary.about.sectionPreviousTeam,
          ref: previousPanelRef,
        },
      ] as const,
    [dictionary.about]
  );

  const getLogicalOffset = useCallback(
    (el: HTMLDivElement): number => {
      return isRtl ? Math.abs(el.scrollLeft) : el.scrollLeft;
    },
    [isRtl]
  );

  const applyLogicalOffset = useCallback(
    (el: HTMLDivElement, logicalOffset: number) => {
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const clamped = Math.max(0, Math.min(maxScroll, logicalOffset));
      el.scrollLeft = isRtl ? -clamped : clamped;
    },
    [isRtl]
  );

  const updateProgressAndChapter = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = Math.max(1, el.scrollWidth - el.clientWidth);
    const logical = getLogicalOffset(el);
    const ratio = Math.max(0, Math.min(1, logical / maxScroll));
    setProgress(ratio);

    const containerRect = el.getBoundingClientRect();
    const probeX = isRtl
      ? containerRect.right - containerRect.width * 0.3
      : containerRect.left + containerRect.width * 0.3;

    let detected: ChapterId = 'studio';
    for (const chapter of chapters) {
      const node = chapter.ref.current;
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      if (isRtl) {
        if (probeX <= rect.right + 40) {
          detected = chapter.id;
        }
      } else {
        if (probeX >= rect.left - 40) {
          detected = chapter.id;
        }
      }
    }
    setActiveChapter(detected);
  }, [chapters, getLogicalOffset, isRtl]);

  const startInertiaLoop = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const tick = () => {
      const el = scrollerRef.current;
      if (!el) {
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        return;
      }

      const diff = targetOffsetRef.current - currentOffsetRef.current;
      if (Math.abs(diff) <= STOP_THRESHOLD_PX) {
        currentOffsetRef.current = targetOffsetRef.current;
        applyLogicalOffset(el, currentOffsetRef.current);
        updateProgressAndChapter();
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        return;
      }

      currentOffsetRef.current += diff * HORIZONTAL_LERP;
      applyLogicalOffset(el, currentOffsetRef.current);
      updateProgressAndChapter();
      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    rafIdRef.current = window.requestAnimationFrame(tick);
  }, [applyLogicalOffset, updateProgressAndChapter]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    targetOffsetRef.current = 0;
    currentOffsetRef.current = 0;
    el.scrollLeft = 0;
    const raf = window.requestAnimationFrame(() => {
      updateProgressAndChapter();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [isRtl, updateProgressAndChapter]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;

      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      if (maxScroll <= 0) return;

      event.preventDefault();

      const multiplier =
        event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? el.clientWidth : 1;
      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY * multiplier
          : (isRtl ? -event.deltaX : event.deltaX) * multiplier;

      if (!isAnimatingRef.current) {
        const current = getLogicalOffset(el);
        currentOffsetRef.current = current;
        targetOffsetRef.current = current;
      }

      targetOffsetRef.current = Math.max(
        0,
        Math.min(maxScroll, targetOffsetRef.current + dominantDelta * 1.15)
      );

      if (prefersReducedMotion) {
        currentOffsetRef.current = targetOffsetRef.current;
        applyLogicalOffset(el, currentOffsetRef.current);
        updateProgressAndChapter();
      } else {
        startInertiaLoop();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      if (maxScroll <= 0) return;

      const step = Math.round(el.clientWidth * 0.45);
      const direction =
        event.key === 'ArrowRight' ? (isRtl ? -1 : 1) : isRtl ? 1 : -1;

      if (!isAnimatingRef.current) {
        const current = getLogicalOffset(el);
        currentOffsetRef.current = current;
        targetOffsetRef.current = current;
      }

      targetOffsetRef.current = Math.max(
        0,
        Math.min(maxScroll, targetOffsetRef.current + direction * step)
      );

      if (prefersReducedMotion) {
        currentOffsetRef.current = targetOffsetRef.current;
        applyLogicalOffset(el, currentOffsetRef.current);
        updateProgressAndChapter();
      } else {
        startInertiaLoop();
      }
    };

    const handleScroll = () => {
      if (!isAnimatingRef.current) {
        const current = getLogicalOffset(el);
        currentOffsetRef.current = current;
        targetOffsetRef.current = current;
      }
      updateProgressAndChapter();
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updateProgressAndChapter);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateProgressAndChapter);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [
    applyLogicalOffset,
    getLogicalOffset,
    isRtl,
    startInertiaLoop,
    updateProgressAndChapter,
  ]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('a, button, input')) return;

    const el = scrollerRef.current;
    if (!el) return;

    const current = getLogicalOffset(el);
    currentOffsetRef.current = current;
    targetOffsetRef.current = current;

    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      startOffset: current,
      pointerId: event.pointerId,
    };
    setIsDragging(true);
    el.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return;
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const deltaX = event.clientX - dragStateRef.current.startX;
    const logicalDelta = isRtl ? deltaX : -deltaX;
    targetOffsetRef.current = Math.max(
      0,
      Math.min(maxScroll, dragStateRef.current.startOffset + logicalDelta * 1.25)
    );
    startInertiaLoop();
  };

  const handlePointerUp = () => {
    if (!dragStateRef.current.active) return;
    const el = scrollerRef.current;
    if (el && dragStateRef.current.pointerId !== -1) {
      try {
        el.releasePointerCapture(dragStateRef.current.pointerId);
      } catch {
        // Ignore if capture was already released
      }
    }
    dragStateRef.current.active = false;
    dragStateRef.current.pointerId = -1;
    setIsDragging(false);
  };

  const scrollToChapter = (chapterId: ChapterId) => {
    const chapter = chapters.find((item) => item.id === chapterId);
    const panel = chapter?.ref.current;
    const el = scrollerRef.current;
    if (!panel || !el) return;

    const containerRect = el.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const current = getLogicalOffset(el);
    const delta = isRtl
      ? containerRect.right - panelRect.right
      : panelRect.left - containerRect.left;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    currentOffsetRef.current = current;
    targetOffsetRef.current = Math.max(0, Math.min(maxScroll, current + delta));
    startInertiaLoop();
  };

  const studioParagraph = getAboutLocalizedText(
    STUDIO_PROFILE.paragraph,
    locale
  );
  const founderName = getAboutLocalizedText(STUDIO_FOUNDER.name, locale);
  const founderRole = getAboutLocalizedText(STUDIO_FOUNDER.role, locale);
  const founderBio = STUDIO_FOUNDER.bio
    ? getAboutLocalizedText(STUDIO_FOUNDER.bio, locale)
    : '';
  const founderPortraitAlt = getAboutLocalizedText(
    STUDIO_FOUNDER.portraitAlt,
    locale
  );

  return (
    <section
      ref={stageRef}
      aria-label={dictionary.about.regionAriaLabel}
      className="relative flex h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col overflow-hidden bg-[var(--bg-canvas)]"
    >
      {/* Unified Horizontal Gallery Track on BOTH Mobile and Desktop (Hidden Scrollbar) */}
      <div
        ref={scrollerRef}
        data-smooth-prevent=""
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          'no-scrollbar flex w-full flex-1 flex-row items-stretch overflow-x-auto overflow-y-hidden touch-pan-x',
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        )}
      >
        {/* PANEL 01: Rasman Team — Contact-scale Heading + Centered Editorial Paragraph */}
        <article
          ref={studioPanelRef}
          className="flex w-[86vw] shrink-0 flex-col border-e border-[var(--grid-line)] px-6 py-6 desktop:w-[540px] desktop:px-10 desktop:py-8 desktop-wide:w-[620px] desktop-wide:px-14 desktop-wide:py-8"
        >
          <h1
            data-gsap="heading"
            className="text-[24px] font-normal leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] desktop:text-[38px] desktop:leading-[1.15] desktop:tracking-[-0.025em] rtl:leading-[1.35] rtl:tracking-normal"
          >
            {dictionary.about.sectionStudio}
          </h1>

          <div className="flex flex-1 items-center py-4">
            <p
              data-gsap="body"
              className="max-w-xl text-[15px] font-normal leading-[1.85] text-[var(--ink-primary)] desktop:text-[17px] desktop:leading-[1.9] rtl:leading-[2.05]"
            >
              {studioParagraph}
            </p>
          </div>
        </article>

        {/* PANEL 02: Principal — Single 18px Title + Portrait + Name + Role + Bio + Socials */}
        <article
          ref={principalPanelRef}
          className="flex w-[90vw] shrink-0 flex-col border-e border-[var(--grid-line)] px-6 py-6 desktop:w-[660px] desktop:px-10 desktop:py-8 desktop-wide:w-[760px] desktop-wide:px-14 desktop-wide:py-8"
        >
          <h2
            data-gsap="heading"
            className="text-[18px] font-medium leading-[1.3] text-[var(--ink-primary)]"
          >
            {dictionary.about.sectionPrincipal}
          </h2>

          <div className="flex flex-1 flex-col items-start justify-center gap-5 py-4 desktop:flex-row desktop:items-center desktop:justify-start desktop:gap-8 desktop-wide:gap-10">
            {/* Tall Architectural Portrait (4px border radius, monochrome -> color on hover) */}
            <div
              data-gsap="media"
              className="group relative aspect-[3/4] w-[144px] shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] desktop:w-[228px] desktop-wide:h-[384px] desktop-wide:w-[288px]"
            >
              <Image
                src={STUDIO_FOUNDER.portrait}
                alt={founderPortraitAlt}
                fill
                priority
                sizes="(max-width: 640px) 144px, (max-width: 1024px) 228px, 300px"
                referrerPolicy="no-referrer"
                className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              />
            </div>

            {/* Founder Name, Role, Bio & Social Links */}
            <div className="flex min-w-0 flex-1 flex-col gap-3 desktop:gap-4">
              <div data-gsap="body" className="flex flex-col gap-1">
                <h3 className="text-[20px] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--ink-primary)] desktop:text-[26px] desktop-wide:text-[30px] rtl:leading-[1.45] rtl:tracking-normal">
                  {founderName}
                </h3>
                <p className="text-[13px] font-normal text-[var(--ink-secondary)] desktop:text-[14px]">
                  {founderRole}
                </p>
              </div>

              <p
                data-gsap="body"
                className="line-clamp-4 text-[13px] leading-[1.7] text-[var(--ink-secondary)] desktop:line-clamp-none desktop:text-[14px] desktop:leading-[1.8] rtl:leading-[1.95]"
              >
                {founderBio}
              </p>

              {/* Social Links Row */}
              <nav
                data-gsap="control"
                aria-label={`${founderName} — ${dictionary.about.memberSocialsAriaLabel}`}
                className="flex flex-wrap items-center gap-2 pt-1"
              >
                {STUDIO_FOUNDER.socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${founderName} — ${dictionary.socials[social.platform]}`}
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-full',
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

        {/* PANEL 03: Core Team — Single 18px Title + Horizontal Portrait Cards with Socials */}
        <article
          ref={corePanelRef}
          className="flex w-auto shrink-0 flex-col border-e border-[var(--grid-line)] px-6 py-6 desktop:px-10 desktop:py-8 desktop-wide:px-14 desktop-wide:py-8"
        >
          <h2
            data-gsap="heading"
            className="text-[18px] font-medium leading-[1.3] text-[var(--ink-primary)]"
          >
            {dictionary.about.sectionCoreTeam}
          </h2>

          <div className="flex flex-1 items-center py-4">
            <ul className="flex flex-row items-start gap-5 desktop:gap-6 desktop-wide:gap-8">
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
                  data-gsap="card"
                  className="group flex w-[184px] shrink-0 flex-col gap-3 desktop:w-[216px] desktop-wide:w-[248px] desktop-wide:gap-3.5"
                >
                  {/* Portrait Photo (4px border radius) */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-[var(--surface-hover)] desktop-wide:h-[312px]">
                    <Image
                      src={member.portrait}
                      alt={memberAlt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 184px, (max-width: 1024px) 216px, 248px"
                      referrerPolicy="no-referrer"
                      className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  </div>

                  {/* Name & Role */}
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    <h3 className="text-[15px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)] desktop:text-[16px]">
                      {memberName}
                    </h3>
                    <p className="text-[12px] leading-[1.5] text-[var(--ink-secondary)] desktop:text-[13px]">
                      {memberRole}
                    </p>
                  </div>

                  {/* Member Social Network Icons */}
                  <nav
                    aria-label={`${memberName} — ${dictionary.about.memberSocialsAriaLabel}`}
                    className="flex items-center gap-2 pt-0.5"
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
          </div>
        </article>

        {/* PANEL 04: Previous Team — 2 Stacked Rows, Vertically Centered */}
        <article
          ref={previousPanelRef}
          className="flex w-auto shrink-0 flex-col px-6 py-6 desktop:px-10 desktop:py-8 desktop-wide:px-14 desktop-wide:py-8"
        >
          <h2 className="text-[18px] font-medium leading-[1.3] text-[var(--ink-primary)]">
            {dictionary.about.sectionPreviousTeam}
          </h2>

          <div className="flex flex-1 items-center py-4">
            <ul className="grid grid-flow-col grid-rows-2 gap-x-6 gap-y-4 desktop:gap-x-8 desktop:gap-y-5 desktop-wide:gap-x-10 desktop-wide:gap-y-5">
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
                    className="group flex h-[164px] w-[336px] shrink-0 flex-row items-center gap-4 desktop:h-[184px] desktop:w-[372px] desktop-wide:h-[196px] desktop-wide:w-[404px] desktop-wide:gap-5"
                  >
                    {/* Square Portrait Photo (4px border radius, NO social buttons) */}
                    <div className="relative aspect-square h-[164px] w-[164px] shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] desktop:h-[184px] desktop:w-[184px] desktop-wide:h-[196px] desktop-wide:w-[196px]">
                      <Image
                        src={member.portrait}
                        alt={memberAlt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 164px, (max-width: 1024px) 184px, 204px"
                        referrerPolicy="no-referrer"
                        className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    </div>

                    {/* Name + Role + Tenure Date positioned beside photo (end side: right in LTR, left in RTL) */}
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 text-start">
                      <h3 className="text-[15px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)] desktop:text-[16px]">
                        {memberName}
                      </h3>
                      <p className="line-clamp-2 text-[12px] leading-[1.5] text-[var(--ink-secondary)] desktop:text-[13px]">
                        {memberRole}
                      </p>
                      <span
                        dir="ltr"
                        className="bidi-isolate pt-1 text-[12px] font-normal text-[var(--ink-muted)] tabular-nums"
                      >
                        {member.tenure}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </article>
      </div>

      {/* Chapter Progress Bar (Mobile: numbers only + active section text; Desktop: full labels) */}
      <nav
        aria-label={dictionary.about.chapterNavAriaLabel}
        className="relative flex h-11 shrink-0 items-center justify-between gap-3 border-t border-[var(--grid-line)] bg-[var(--bg-canvas)] px-4 desktop:gap-4 desktop:px-8"
      >
        <div className="no-scrollbar flex items-center gap-3.5 overflow-x-auto desktop:gap-6">
          {chapters.map((chapter, index) => {
            const isActive = activeChapter === chapter.id;
            const chapterNumber = String(index + 1).padStart(2, '0');
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => scrollToChapter(chapter.id)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${chapterNumber} ${chapter.label}`}
                className={cn(
                  'inline-flex shrink-0 cursor-pointer items-center whitespace-nowrap text-[12px] tracking-[0.04em] transition-colors duration-200 rtl:tracking-normal',
                  isActive
                    ? 'font-medium text-[var(--brand-text-hover)]'
                    : 'font-normal text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                )}
              >
                <span
                  dir="ltr"
                  className={cn(
                    'bidi-isolate text-[11px] tabular-nums transition-colors duration-200',
                    isActive
                      ? 'text-[var(--brand-text-hover)]'
                      : 'text-[var(--ink-muted)]'
                  )}
                >
                  {chapterNumber}
                </span>

                {/* Mobile (< desktop): Reveal label text only on active chapter */}
                <span className="inline-flex items-center overflow-hidden desktop:hidden">
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        key={`${chapter.id}-mobile-label`}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{
                          duration: SITE_CONFIG.motion.standardDuration,
                          ease: SITE_CONFIG.motion.ease,
                        }}
                        className="overflow-hidden whitespace-nowrap ps-1.5"
                      >
                        {chapter.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>

                {/* Desktop & Landscape Tablet: Always show full chapter label */}
                <span className="hidden desktop:inline desktop:ps-1.5">
                  {chapter.label}
                </span>
              </button>
            );
          })}
        </div>

        <span
          dir="ltr"
          className="bidi-isolate shrink-0 text-[12px] text-[var(--ink-muted)] tabular-nums"
        >
          {Math.round(progress * 100)}%
        </span>

        {/* Hairline Progress Indicator */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] bg-transparent"
        >
          <motion.span
            initial={false}
            animate={{ scaleX: Math.max(0.02, progress) }}
            transition={{ duration: 0.08, ease: 'linear' }}
            className="block h-full origin-left bg-[var(--brand-primary)] rtl:origin-right"
          />
        </span>
      </nav>
    </section>
  );
}
