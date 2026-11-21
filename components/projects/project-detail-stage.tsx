'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {
  MdArrowBack,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdEnergySavingsLeaf,
  MdLocationCity,
  MdOutlineShare,
} from 'react-icons/md';
import {
  getNextProject,
  getPreviousProject,
  getProjectBySlug,
  getProjectDesignDocuments,
  getProjectGalleryFrames,
  getProjectLocalizedText,
  PROJECT_MODE_ARTWORK,
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
 * - Full-bleed edge-to-edge sidebar dividers (`px-0` on aside, inner rows padded uniformly)
 * - Symmetric equal inset padding (`p-6 desktop:p-10`) & equal gap above/below header divider
 * - Full-container width content grid (`w-full`) matching exact stretch of title/subtitle divider
 * - Shadowless frosted muted-grey glass Next/Prev buttons & lazy-loaded Lightbox
 * - Hierarchical GSAP staggered entrance + scroll intersection choreography
 */
export function ProjectDetailStage({ slug }: ProjectDetailStageProps) {
  const { locale, isRtl, dictionary, announce } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [lightboxState, setLightboxState] = useState<{
    readonly open: boolean;
    readonly index: number;
    readonly session: number;
  }>({ open: false, index: 0, session: 0 });
  const articleRef = useRef<HTMLElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  useArchitecturalEntrance(articleRef, { isRtl, dependencies: [slug] });

  const project = getProjectBySlug(slug);

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

  const handleGalleryStep = (direction: -1 | 1) => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const stepPx = Math.max(220, Math.round(el.clientWidth * 0.52));
    const deltaX = direction * (isRtl ? -stepPx : stepPx);
    el.scrollBy({ left: deltaX, behavior: 'smooth' });
  };

  const nextProject = getNextProject(project.slug);
  const previousProject = getPreviousProject(project.slug);
  const galleryFrames = getProjectGalleryFrames(project);
  const designDocuments = getProjectDesignDocuments(project);

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

  const startCard = isRtl
    ? {
        project: nextProject,
        title: nextTitle,
        label: dictionary.projects.detail.nextProjectLabel,
      }
    : {
        project: previousProject,
        title: previousTitle,
        label: dictionary.projects.detail.previousProjectLabel,
      };

  const endCard = isRtl
    ? {
        project: previousProject,
        title: previousTitle,
        label: dictionary.projects.detail.previousProjectLabel,
      }
    : {
        project: nextProject,
        title: nextTitle,
        label: dictionary.projects.detail.nextProjectLabel,
      };

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

  return (
    <article
      ref={articleRef}
      aria-label={title}
      className="relative grid min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full grid-cols-1 bg-[var(--bg-canvas)] desktop:grid-cols-[336px_minmax(0,1fr)] desktop:grid-rows-[auto_1fr] desktop-wide:grid-cols-[400px_minmax(0,1fr)]"
    >
      {/* Mode-Specific Sketch Artwork Backdrop (20% Opacity, Faded at Bottom, Light/Dark/RTL Adaptive) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[var(--grid-header)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-0 h-[min(78dvh,640px)] overflow-hidden select-none opacity-20 mix-blend-multiply dark:mix-blend-screen [mask-image:linear-gradient(to_bottom,black_52%,transparent_100%)]"
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
        <div className="mb-5 desktop:hidden">
          <Link
            data-gsap="kicker"
            href={`/projects?mode=${project.mode}`}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--ink-secondary)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
          >
            <MdArrowBack
              size={18}
              aria-hidden="true"
              className={cn(isRtl && '-scale-x-100')}
            />
            <span>{dictionary.projects.detail.backToProjects}</span>
          </Link>
        </div>

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

      {/* 2. Sticky Project Dossier Spec Sheet (Edge-to-Edge Full-Bleed Dividers) */}
      <aside
        data-smooth-prevent-desktop=""
        className="relative z-10 order-2 flex w-full flex-col justify-between gap-6 border-y border-[var(--grid-line)] py-6 desktop:sticky desktop:top-[var(--grid-header)] desktop:col-start-1 desktop:row-span-2 desktop:row-start-1 desktop:h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] desktop:overflow-y-auto desktop:border-y-0 desktop:border-e desktop:py-10"
      >
        <div className="flex flex-col gap-6">
          <div className="hidden px-6 desktop:block desktop:px-8">
            <Link
              data-gsap="kicker"
              href={`/projects?mode=${project.mode}`}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--ink-secondary)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
            >
              <MdArrowBack
                size={18}
                aria-hidden="true"
                className={cn(isRtl && '-scale-x-100')}
              />
              <span>{dictionary.projects.detail.backToProjects}</span>
            </Link>
          </div>

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
        </div>

        {/* Edge-to-Edge Share Row Divider */}
        <div
          data-gsap="control"
          className="flex items-center justify-between border-t border-[var(--grid-line)] px-6 pt-5 desktop:px-8 desktop:pt-6"
        >
          <span className="text-[13px] text-[var(--ink-muted)]">
            {copied
              ? dictionary.projects.detail.shareCopiedLabel
              : dictionary.projects.detail.shareProjectLabel}
          </span>
          <button
            type="button"
            onClick={handleShare}
            aria-label={dictionary.projects.detail.shareProjectLabel}
            className={cn(
              'inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200',
              copied
                ? 'text-[var(--brand-text-hover)]'
                : 'text-[var(--ink-primary)] hover:text-[var(--brand-text-hover)]'
            )}
          >
            {copied ? (
              <MdCheck size={20} aria-hidden="true" />
            ) : (
              <MdOutlineShare size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </aside>

      {/* 3. Full-Container Content Grid + Gallery + 50/50 Split Navigation */}
      <div className="relative z-10 order-3 flex min-w-0 flex-col justify-between desktop:col-start-2 desktop:row-start-2">
        <div className="flex w-full flex-col gap-8 p-6 desktop:gap-10 desktop:p-10">
          {/* Hero Frame (Full Container Width Matching Divider Above) */}
          <figure
            data-gsap="media"
            className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] bg-[var(--surface-hover)]"
          >
            <Image
              src={project.heroImage}
              alt={heroAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1120px"
              referrerPolicy="no-referrer"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pt-10 pb-3.5 text-[12px] leading-[1.45] text-white/90">
              {heroCaption}
            </figcaption>
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

          {/* Horizontal 2-Up Scrollable Gallery Grid (Captionless + Shadowless Glass Prev/Next Buttons) */}
          <section
            data-gsap-scroll=""
            aria-label={dictionary.projects.detail.galleryHeading}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)] rtl:normal-case rtl:tracking-normal">
                {dictionary.projects.detail.galleryHeading}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGalleryStep(-1)}
                  aria-label={dictionary.projects.detail.galleryPrevAriaLabel}
                  className="rasman-glass inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--ink-primary)] transition-colors duration-250 hover:bg-[var(--brand-primary)] hover:text-[var(--brand-ink-on-primary)]"
                >
                  {isRtl ? (
                    <MdChevronRight size={20} aria-hidden="true" />
                  ) : (
                    <MdChevronLeft size={20} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleGalleryStep(1)}
                  aria-label={dictionary.projects.detail.galleryNextAriaLabel}
                  className="rasman-glass inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--ink-primary)] transition-colors duration-250 hover:bg-[var(--brand-primary)] hover:text-[var(--brand-ink-on-primary)]"
                >
                  {isRtl ? (
                    <MdChevronLeft size={20} aria-hidden="true" />
                  ) : (
                    <MdChevronRight size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div
              ref={galleryScrollRef}
              data-smooth-prevent=""
              className="no-scrollbar flex flex-row gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x desktop:gap-6"
            >
              {galleryFrames.map((frame, index) => (
                <button
                  key={frame.image}
                  type="button"
                  onClick={() =>
                    setLightboxState((prev) => ({
                      open: true,
                      index,
                      session: prev.session + 1,
                    }))
                  }
                  className="group relative aspect-[16/11] w-[calc(50%-6px)] shrink-0 snap-start cursor-pointer overflow-hidden rounded-[4px] bg-[var(--surface-hover)] text-start desktop:w-[calc(50%-12px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                >
                  <Image
                    src={frame.image}
                    alt={getProjectLocalizedText(frame.alt, locale)}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 48vw, 560px"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Full-Width 50/50 Split Previous / Next Project Navigation Strip */}
        <nav
          data-gsap-scroll=""
          aria-label={`${dictionary.projects.detail.previousProjectLabel} / ${dictionary.projects.detail.nextProjectLabel}`}
          className="grid w-full grid-cols-2 border-t border-[var(--grid-line)]"
        >
          <Link
            href={`/projects/${startCard.project.slug}`}
            className="group flex min-w-0 items-center gap-3 border-e border-[var(--grid-line)] px-6 py-6 transition-colors duration-250 hover:bg-[var(--surface-hover)] desktop:gap-5 desktop:px-10 desktop:py-8"
          >
            <span
              aria-hidden="true"
              className="rasman-glass inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--ink-primary)] transition-colors duration-250 group-hover:bg-[var(--brand-primary)] group-hover:text-[var(--brand-ink-on-primary)] desktop:h-11 desktop:w-11"
            >
              {isRtl ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-start">
              <span className="text-[11px] font-medium text-[var(--ink-muted)]">
                {startCard.label}
              </span>
              <span className="line-clamp-2 text-[14px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-250 group-hover:text-[var(--brand-text-hover)] desktop:text-[17px] rtl:leading-[1.5]">
                {startCard.title}
              </span>
            </div>
          </Link>

          <Link
            href={`/projects/${endCard.project.slug}`}
            className="group flex min-w-0 items-center justify-end gap-3 px-6 py-6 transition-colors duration-250 hover:bg-[var(--surface-hover)] desktop:gap-5 desktop:px-10 desktop:py-8"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-end">
              <span className="text-[11px] font-medium text-[var(--ink-muted)]">
                {endCard.label}
              </span>
              <span className="line-clamp-2 text-[14px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-250 group-hover:text-[var(--brand-text-hover)] desktop:text-[17px] rtl:leading-[1.5]">
                {endCard.title}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="rasman-glass inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--ink-primary)] transition-colors duration-250 group-hover:bg-[var(--brand-primary)] group-hover:text-[var(--brand-ink-on-primary)] desktop:h-11 desktop:w-11"
            >
              {isRtl ? <MdChevronLeft size={20} /> : <MdChevronRight size={20} />}
            </span>
          </Link>
        </nav>
      </div>

      {lightboxState.open && (
        <ProjectMediaLightbox
          key={lightboxState.session}
          isOpen={lightboxState.open}
          initialTab="images"
          initialIndex={lightboxState.index}
          images={galleryFrames}
          documents={designDocuments}
          onClose={() =>
            setLightboxState((prev) => ({ ...prev, open: false }))
          }
        />
      )}
    </article>
  );
}
