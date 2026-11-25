'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
  MdArrowBack,
  MdArrowForward,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdEnergySavingsLeaf,
  MdLocationCity,
  MdOutlineShare,
} from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  getNextProject,
  getPreviousProject,
  getProjectBySlug,
  getProjectCategorizedMedia,
  getProjectLocalizedText,
  PROJECT_MODE_ARTWORK,
  type ProjectMediaCategoryId,
} from '@/lib/data/projects';
import { useAppContext } from '@/components/providers/app-provider';
import { useArchitecturalEntrance } from '@/components/motion/architectural-motion';
import { cn } from '@/lib/utils';

const ProjectMediaLightbox = dynamic(
  () =>
    import('@/components/projects/project-media-lightbox').then(
      (mod) => mod.ProjectMediaLightbox
    ),
  { ssr: false }
);

interface ProjectDetailStageProps {
  readonly slug: string;
}

/**
 * Architectural Project Dossier & Spatial Documentation Stage:
 * - Fixed top sticky bar matching Blog Detail: Back + Project Title (start) | Share icon (end) + rail '+' crosshairs
 * - Sticky edge-to-edge dossier sidebar (share button removed; lives strictly in top sticky bar)
 * - Content-matched Gallery heading with opposite "View All" trigger + single full-width gallery viewer
 * - Categorized fullscreen Lightbox grouping all project photography & design drawings
 * - Fixed bottom edge-to-edge Previous / Next bar matching Blog Detail, revealed cleanly at project end
 */
export function ProjectDetailStage({ slug }: ProjectDetailStageProps) {
  const { locale, isRtl, dictionary, announce } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [isAtProjectEnd, setIsAtProjectEnd] = useState(false);
  const [galleryCursor, setGalleryCursor] = useState<{
    readonly slug: string;
    readonly index: number;
  }>({ slug, index: 0 });
  const [lightboxState, setLightboxState] = useState<{
    readonly open: boolean;
    readonly category: ProjectMediaCategoryId;
    readonly imageId?: string;
    readonly session: number;
  }>({ open: false, category: 'all', session: 0 });

  const articleRef = useRef<HTMLElement>(null);
  const endSentinelRef = useRef<HTMLDivElement>(null);

  useArchitecturalEntrance(articleRef, { isRtl, dependencies: [slug] });

  const project = getProjectBySlug(slug);

  const categorizedMedia = useMemo(
    () => (project ? getProjectCategorizedMedia(project) : []),
    [project]
  );

  // Photography-only slides for the inline single-photo Gallery viewer
  const galleryPhotos = useMemo(
    () => categorizedMedia.filter((item) => item.category !== 'documents'),
    [categorizedMedia]
  );

  // Reset scroll, gallery slide, and end-bar visibility on project navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'auto' });

    const checkBottom = () => {
      const sentinel = endSentinelRef.current;
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      const nearBottom = rect.top <= window.innerHeight + 32;
      setIsAtProjectEnd(nearBottom);
    };

    const rafId = window.requestAnimationFrame(checkBottom);
    const sentinel = endSentinelRef.current;

    let observer: IntersectionObserver | null = null;
    if (sentinel && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            setIsAtProjectEnd(true);
          } else {
            const rect = entry.boundingClientRect;
            setIsAtProjectEnd(rect.top <= window.innerHeight + 24);
          }
        },
        {
          threshold: 0,
          rootMargin: '0px 0px 24px 0px',
        }
      );
      observer.observe(sentinel);
    }

    window.addEventListener('scroll', checkBottom, { passive: true });
    window.addEventListener('resize', checkBottom, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('scroll', checkBottom);
      window.removeEventListener('resize', checkBottom);
    };
  }, [slug]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      }
      setCopied(true);
      announce(dictionary.announcements.linkCopied);
    } catch {
      setCopied(true);
      announce(dictionary.announcements.linkCopied);
    }
  };

  if (!project) {
    return (
      <section
        aria-label={dictionary.projects.regionAriaLabel}
        className="flex min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col items-start justify-center gap-5 p-6 desktop:p-10"
      >
        <p className="text-[20px] font-normal text-[var(--ink-primary)]">
          {dictionary.projects.detail.notFoundTitle}
        </p>
        <Link
          href="/projects"
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-full px-5',
            'bg-[var(--brand-primary)] text-[14px] font-medium text-[var(--brand-ink-on-primary)]',
            'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)]'
          )}
        >
          <MdArrowBack
            size={18}
            aria-hidden="true"
            className={cn(isRtl && '-scale-x-100')}
          />
          <span>{dictionary.projects.detail.backToProjects}</span>
        </Link>
      </section>
    );
  }

  const photoCount = galleryPhotos.length;
  const activeGalleryIndex =
    galleryCursor.slug === slug ? galleryCursor.index : 0;
  const safeGalleryIndex =
    photoCount > 0
      ? ((activeGalleryIndex % photoCount) + photoCount) % photoCount
      : 0;
  const activeGalleryFrame = galleryPhotos[safeGalleryIndex];

  const handleGalleryStep = (delta: -1 | 1) => {
    if (photoCount <= 1) return;
    setGalleryCursor((prev) => {
      const base = prev.slug === slug ? prev.index : 0;
      return { slug, index: (base + delta + photoCount) % photoCount };
    });
  };

  const openLightbox = (
    category: ProjectMediaCategoryId = 'all',
    imageId?: string
  ) => {
    setLightboxState((prev) => ({
      open: true,
      category,
      imageId,
      session: prev.session + 1,
    }));
  };

  const nextProject = getNextProject(project.slug);
  const previousProject = getPreviousProject(project.slug);

  const title = getProjectLocalizedText(project.title, locale);
  const subtitle = getProjectLocalizedText(project.subtitle, locale);
  const overview = getProjectLocalizedText(project.overview, locale);
  const heroAlt = getProjectLocalizedText(project.heroAlt, locale);
  const heroCaption = getProjectLocalizedText(project.heroCaption, locale);
  const client = getProjectLocalizedText(project.client, locale);
  const leadArchitect = getProjectLocalizedText(project.leadArchitect, locale);

  const modeLabel = dictionary.projects.modes[project.mode];
  const typeLabel = dictionary.projects.typeOptions[project.type];
  const statusLabel = dictionary.projects.statusOptions[project.status];
  const locationLabel = dictionary.projects.locationOptions[project.location];

  const nextTitle = getProjectLocalizedText(nextProject.title, locale);
  const previousTitle = getProjectLocalizedText(previousProject.title, locale);

  const ModeIcon =
    project.mode === 'sustainable' ? MdEnergySavingsLeaf : MdLocationCity;

  const specRows = [
    { label: dictionary.projects.detail.modeLabel, value: modeLabel },
    { label: dictionary.projects.detail.typeLabel, value: typeLabel },
    { label: dictionary.projects.detail.statusLabel, value: statusLabel },
    { label: dictionary.projects.detail.locationLabel, value: locationLabel },
    {
      label: dictionary.projects.detail.yearLabel,
      value: project.year,
      isNumeric: true,
    },
    {
      label: dictionary.projects.detail.areaLabel,
      value: `${project.areaSqm} ${dictionary.projects.detail.sqmUnit}`,
      isNumeric: true,
    },
    {
      label: dictionary.projects.detail.leadArchitectLabel,
      value: leadArchitect,
    },
    { label: dictionary.projects.detail.clientLabel, value: client },
  ];

  const heroMediaId = categorizedMedia[0]?.id;

  return (
    <article
      ref={articleRef}
      aria-label={title}
      className="relative grid min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full grid-cols-1 bg-[var(--bg-canvas)] pt-12 desktop:grid-cols-[336px_minmax(0,1fr)] desktop:grid-rows-[auto_1fr] desktop-wide:grid-cols-[400px_minmax(0,1fr)]"
    >
      {/* Fixed Top Sticky Bar Matching Blog Detail: Back + Title (Start) | Share Button (End) + Frame Rail '+' Crosshairs */}
      <div
        className={cn(
          'fixed top-[var(--grid-header)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-[34]',
          'flex h-12 items-center justify-between gap-2 border-b border-[var(--grid-line)]',
          'bg-[var(--bg-header-glass)] backdrop-blur-md backdrop-saturate-150 [transform:translateZ(0)] transition-colors duration-200'
        )}
      >
        <div className="flex min-w-0 flex-1 items-center">
          <Link
            href={`/projects?mode=${project.mode}`}
            aria-label={dictionary.projects.detail.backToProjects}
            className="inline-flex h-12 shrink-0 items-center gap-2 ps-4 pe-3 text-[13px] font-medium text-[var(--ink-secondary)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
          >
            <MdArrowBack
              size={18}
              aria-hidden="true"
              className={cn('shrink-0', isRtl && '-scale-x-100')}
            />
            <span className="hidden whitespace-nowrap desktop:inline">
              {dictionary.projects.detail.backToProjects}
            </span>
          </Link>

          <span
            aria-hidden="true"
            className="h-4 w-px shrink-0 bg-[var(--grid-line)]"
          />

          <span className="min-w-0 flex-1 truncate px-3 text-start text-[14px] font-medium text-[var(--ink-primary)] desktop:px-4 desktop:text-[15px]">
            {title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          aria-label={
            copied
              ? dictionary.projects.detail.shareCopiedLabel
              : dictionary.projects.detail.shareProjectLabel
          }
          title={
            copied
              ? dictionary.projects.detail.shareCopiedLabel
              : dictionary.projects.detail.shareProjectLabel
          }
          className={cn(
            'inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border-s border-[var(--grid-line)] transition-colors duration-200',
            copied
              ? 'text-[var(--brand-text-hover)]'
              : 'text-[var(--ink-primary)] hover:text-[var(--brand-text-hover)]'
          )}
        >
          {copied ? (
            <MdCheck size={19} aria-hidden="true" />
          ) : (
            <MdOutlineShare size={19} aria-hidden="true" />
          )}
        </button>

        {/* Bottom Left & Right Frame Rail Intersection '+' Crosshairs */}
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
      </div>

      {/* Mode-Specific Sketch Artwork Backdrop (20% Opacity, Faded at Bottom, Light/Dark/RTL Adaptive) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[calc(var(--grid-header)+48px)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-0 h-[min(78dvh,640px)] overflow-hidden select-none opacity-20 mix-blend-multiply dark:mix-blend-screen [mask-image:linear-gradient(to_bottom,black_52%,transparent_100%)]"
      >
        <Image
          src={PROJECT_MODE_ARTWORK[project.mode]}
          alt=""
          fill
          priority
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover object-[78%_bottom] desktop:object-bottom contrast-[1.04] dark:invert dark:hue-rotate-180 dark:contrast-[1.06] rtl:-scale-x-100"
        />
      </div>

      {/* 1. Project Header (Full Container Width Divider, Symmetric Top/Bottom/Start/End Padding) */}
      <header className="relative z-10 order-1 flex w-full flex-col px-6 pt-6 pb-0 desktop:col-start-2 desktop:row-start-1 desktop:px-10 desktop:pt-10 desktop:pb-0">
        <div className="relative flex w-full flex-col gap-4 pb-6 desktop:pb-10">
          <div
            data-gsap="kicker"
            className={cn(
              'inline-flex items-center gap-2 text-[12px] font-medium',
              project.mode === 'sustainable'
                ? 'text-[var(--brand-text-hover)]'
                : 'text-[var(--accent-khaki)]'
            )}
          >
            <ModeIcon size={16} aria-hidden="true" />
            <span>{modeLabel}</span>
          </div>

          <h1
            data-gsap="heading"
            className="text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] rtl:leading-[1.4] rtl:tracking-normal"
          >
            {title}
          </h1>

          <p
            data-gsap="body"
            className="text-[16px] leading-[1.65] text-[var(--ink-secondary)] desktop:text-[18px] rtl:leading-[1.85]"
          >
            {subtitle}
          </p>

          {/* Animated Hairline Divider Matching Exact Content Container Width */}
          <span
            data-gsap="divider"
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--grid-line)]"
          />
        </div>
      </header>

      {/* 2. Sticky Project Dossier Spec Sheet (Edge-to-Edge Full-Bleed Dividers, No Share Row) */}
      <aside
        data-smooth-prevent-desktop=""
        className="relative z-10 order-2 flex w-full flex-col gap-6 border-y border-[var(--grid-line)] py-6 desktop:sticky desktop:top-[calc(var(--grid-header)+48px)] desktop:col-start-1 desktop:row-span-2 desktop:row-start-1 desktop:h-[calc(100dvh-var(--grid-header)-var(--grid-bottom)-48px)] desktop:overflow-y-auto desktop:border-y-0 desktop:border-e desktop:py-10"
      >
        <div className="flex flex-col gap-3">
          <h2
            data-gsap="kicker"
            className="px-6 text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)] desktop:px-8 rtl:normal-case rtl:tracking-normal"
          >
            {dictionary.projects.detail.specsHeading}
          </h2>
          <dl className="w-full divide-y divide-[var(--grid-line)] border-t border-b border-[var(--grid-line)]">
            {specRows.map((row) => (
              <div
                key={row.label}
                data-gsap="body"
                className="flex items-baseline justify-between gap-4 px-6 py-3 text-[13px] desktop:px-8"
              >
                <dt className="text-[var(--ink-muted)]">{row.label}</dt>
                <dd
                  dir={row.isNumeric ? 'ltr' : undefined}
                  className={cn(
                    'text-end font-medium text-[var(--ink-primary)]',
                    row.isNumeric && 'bidi-isolate tabular-nums'
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      {/* 3. Full-Container Content Grid + Single-Image Gallery + End Sentinel */}
      <div className="relative z-10 order-3 flex min-w-0 flex-col desktop:col-start-2 desktop:row-start-2">
        <div className="flex w-full flex-col gap-8 px-6 pt-6 pb-28 desktop:gap-10 desktop:px-10 desktop:pt-10 desktop:pb-32">
          {/* Hero Frame (Full Container Width, Clickable to Open Categorized Lightbox) */}
          <figure
            data-gsap="media"
            className="group relative aspect-[16/10] w-full overflow-hidden rounded-[4px] bg-[var(--surface-hover)]"
          >
            <button
              type="button"
              onClick={() => openLightbox('all', heroMediaId)}
              aria-label={heroAlt}
              className="relative block h-full w-full cursor-pointer text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              <Image
                src={project.heroImage}
                alt={heroAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1120px"
                referrerPolicy="no-referrer"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pt-10 pb-3.5 text-[12px] leading-[1.45] text-white/90">
                {heroCaption}
              </figcaption>
            </button>
          </figure>

          {/* Overview Lead */}
          <p
            data-gsap-scroll=""
            className="w-full text-[16px] leading-[1.85] text-[var(--ink-primary)] desktop:text-[18px] rtl:leading-[2]"
          >
            {overview}
          </p>

          {/* Environmental & Spatial Performance Strip */}
          <section
            data-gsap-scroll=""
            aria-label={dictionary.projects.detail.metricsHeading}
          >
            <h2 className="mb-4 text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)] rtl:normal-case rtl:tracking-normal">
              {dictionary.projects.detail.metricsHeading}
            </h2>
            <div className="grid w-full grid-cols-1 divide-y divide-[var(--grid-line)] border border-[var(--grid-line)] desktop:grid-cols-3 desktop:divide-x desktop:divide-y-0">
              {project.metrics.map((metric) => (
                <div
                  key={metric.value + metric.label.en}
                  className="flex flex-col gap-1 px-5 py-4"
                >
                  <span
                    dir="ltr"
                    className="bidi-isolate text-start text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.02em] text-[var(--brand-text-hover)] tabular-nums rtl:text-end"
                  >
                    {metric.value}
                  </span>
                  <span className="text-[13px] text-[var(--ink-secondary)]">
                    {getProjectLocalizedText(metric.label, locale)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Architectural Narrative Sections */}
          <div className="flex w-full flex-col gap-7">
            {project.sections.map((section, index) => (
              <section
                key={index}
                data-gsap-scroll=""
                className="flex flex-col gap-2.5"
              >
                <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--ink-primary)] desktop:text-[22px] rtl:leading-[1.5] rtl:tracking-normal">
                  {getProjectLocalizedText(section.heading, locale)}
                </h2>
                <p className="text-[16px] font-normal leading-[1.8] text-[var(--ink-secondary)] desktop:text-[17px] rtl:leading-[2]">
                  {getProjectLocalizedText(section.paragraph, locale)}
                </p>
              </section>
            ))}
          </div>

          {/* Single-Image Gallery Section: Content-Matched Primary Title + Opposite "View All" Button */}
          {activeGalleryFrame && (
            <section
              data-gsap-scroll=""
              aria-label={dictionary.projects.detail.galleryHeading}
              className="flex w-full flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--ink-primary)] desktop:text-[22px] rtl:leading-[1.5] rtl:tracking-normal">
                  {dictionary.projects.detail.galleryHeading}
                </h2>

                <button
                  type="button"
                  onClick={() => openLightbox('all')}
                  className="group inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[var(--ink-secondary)] transition-colors duration-200 hover:text-[var(--brand-text-hover)] desktop:text-[14px]"
                >
                  <span>{dictionary.projects.detail.viewAllGalleryLabel}</span>
                  <span
                    dir="ltr"
                    className="bidi-isolate text-[12px] text-[var(--ink-muted)] tabular-nums transition-colors duration-200 group-hover:text-[var(--brand-text-hover)]"
                  >
                    ({categorizedMedia.length})
                  </span>
                  <MdArrowForward
                    size={16}
                    aria-hidden="true"
                    className={cn(
                      'shrink-0 transition-transform duration-200 group-hover:translate-x-0.5',
                      isRtl && '-scale-x-100 group-hover:-translate-x-0.5'
                    )}
                  />
                </button>
              </div>

              {/* Single Full-Width Architectural Photo Stage */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] bg-[var(--surface-hover)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.button
                    key={activeGalleryFrame.id}
                    type="button"
                    onClick={() => openLightbox('all', activeGalleryFrame.id)}
                    aria-label={getProjectLocalizedText(
                      activeGalleryFrame.alt,
                      locale
                    )}
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.25 }}
                    transition={{
                      duration: SITE_CONFIG.motion.fastDuration,
                      ease: SITE_CONFIG.motion.ease,
                    }}
                    className="group relative block h-full w-full cursor-pointer text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                  >
                    <Image
                      src={activeGalleryFrame.image}
                      alt={getProjectLocalizedText(
                        activeGalleryFrame.alt,
                        locale
                      )}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 1120px"
                      referrerPolicy="no-referrer"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </motion.button>
                </AnimatePresence>

                {/* Prev / Next Single-Slide Overlay Controls */}
                {photoCount > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleGalleryStep(-1);
                      }}
                      aria-label={
                        dictionary.projects.detail.galleryPrevAriaLabel
                      }
                      className="absolute start-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors duration-200 hover:bg-[var(--brand-primary)] hover:text-[var(--brand-ink-on-primary)] desktop:start-4"
                    >
                      {isRtl ? (
                        <MdChevronRight size={22} aria-hidden="true" />
                      ) : (
                        <MdChevronLeft size={22} aria-hidden="true" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleGalleryStep(1);
                      }}
                      aria-label={
                        dictionary.projects.detail.galleryNextAriaLabel
                      }
                      className="absolute end-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors duration-200 hover:bg-[var(--brand-primary)] hover:text-[var(--brand-ink-on-primary)] desktop:end-4"
                    >
                      {isRtl ? (
                        <MdChevronLeft size={22} aria-hidden="true" />
                      ) : (
                        <MdChevronRight size={22} aria-hidden="true" />
                      )}
                    </button>

                    {/* Minimal Bottom Slide Dots */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
                      {galleryPhotos.map((frame, index) => {
                        const isCurrent = index === safeGalleryIndex;
                        return (
                          <button
                            key={frame.id}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setGalleryCursor({ slug, index });
                            }}
                            aria-label={`${index + 1}`}
                            className={cn(
                              'pointer-events-auto h-1.5 cursor-pointer rounded-full transition-all duration-200',
                              isCurrent
                                ? 'w-6 bg-white'
                                : 'w-1.5 bg-white/45 hover:bg-white/75'
                            )}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* End-of-project sentinel triggering fixed bottom Previous / Next blocks */}
          <div ref={endSentinelRef} aria-hidden="true" className="h-2 w-full" />
        </div>
      </div>

      {/* Fixed Bottom Edge-to-Edge Previous / Next Project Blocks Matching Blog Detail */}
      <AnimatePresence>
        {isAtProjectEnd && (
          <motion.nav
            key={`project-nav-${project.slug}`}
            aria-label={`${dictionary.projects.detail.previousProjectLabel} / ${dictionary.projects.detail.nextProjectLabel}`}
            initial={{ y: 24, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.48,
                ease: SITE_CONFIG.motion.ease,
              },
            }}
            exit={{
              y: 24,
              opacity: 0,
              transition: {
                duration: 0.28,
                ease: SITE_CONFIG.motion.ease,
              },
            }}
            className={cn(
              'fixed bottom-[var(--grid-bottom)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-[34]',
              'grid grid-cols-2 border-t border-[var(--grid-line)]',
              'bg-[var(--bg-header-glass)] backdrop-blur-md backdrop-saturate-150 [transform:translateZ(0)]'
            )}
          >
            {/* Top Left & Right Frame Rail Intersection '+' Crosshairs */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] -start-[7px] z-[35] block h-[13px] w-[13px]"
            >
              <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] -end-[7px] z-[35] block h-[13px] w-[13px]"
            >
              <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            </span>

            {/* Previous Project Block (Start Half — Icon + Text Only, 16px Padding) */}
            <Link
              href={`/projects/${previousProject.slug}`}
              prefetch={true}
              className="group flex min-w-0 items-center gap-3 border-e border-[var(--grid-line)] p-4 text-start transition-colors duration-250 hover:bg-[var(--surface-hover)] desktop:gap-4"
            >
              <MdArrowBack
                size={20}
                aria-hidden="true"
                className={cn(
                  'shrink-0 text-[var(--ink-muted)] transition-all duration-250',
                  'group-hover:text-[var(--brand-text-hover)] group-hover:-translate-x-0.5',
                  isRtl && '-scale-x-100 group-hover:translate-x-0.5'
                )}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-medium text-[var(--ink-muted)] desktop:text-[12px]">
                  {dictionary.projects.detail.previousProjectLabel}
                </span>
                <span className="truncate text-[13px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-250 group-hover:text-[var(--brand-text-hover)] desktop:text-[15px] rtl:leading-[1.5]">
                  {previousTitle}
                </span>
              </span>
            </Link>

            {/* Next Project Block (End Half — Text + Icon Only, 16px Padding) */}
            <Link
              href={`/projects/${nextProject.slug}`}
              prefetch={true}
              className="group flex min-w-0 items-center justify-end gap-3 p-4 text-end transition-colors duration-250 hover:bg-[var(--surface-hover)] desktop:gap-4"
            >
              <span className="flex min-w-0 flex-1 flex-col items-end gap-0.5">
                <span className="text-[11px] font-medium text-[var(--ink-muted)] desktop:text-[12px]">
                  {dictionary.projects.detail.nextProjectLabel}
                </span>
                <span className="w-full truncate text-end text-[13px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-250 group-hover:text-[var(--brand-text-hover)] desktop:text-[15px] rtl:leading-[1.5]">
                  {nextTitle}
                </span>
              </span>
              <MdArrowForward
                size={20}
                aria-hidden="true"
                className={cn(
                  'shrink-0 text-[var(--ink-muted)] transition-all duration-250',
                  'group-hover:text-[var(--brand-text-hover)] group-hover:translate-x-0.5',
                  isRtl && '-scale-x-100 group-hover:-translate-x-0.5'
                )}
              />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>

      {lightboxState.open && (
        <ProjectMediaLightbox
          key={lightboxState.session}
          isOpen={lightboxState.open}
          initialCategory={lightboxState.category}
          initialImageId={lightboxState.imageId}
          items={categorizedMedia}
          onClose={() =>
            setLightboxState((prev) => ({ ...prev, open: false }))
          }
        />
      )}
    </article>
  );
}
