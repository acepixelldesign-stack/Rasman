'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import {
  getProjectLocalizedText,
  type ArchitecturalProject,
} from '@/lib/data/projects';
import { useAppContext } from '@/components/providers/app-provider';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  readonly project: ArchitecturalProject;
  readonly priority?: boolean;
}

/**
 * Large Horizontal Gallery Project Card (4px Architectural Radius):
 * - Smooth lazy-load dissolve when imagery finishes decoding
 * - Borderless card, gradient scrim, bottom hover blur veil, top-end directional action button
 * - Full LTR/RTL logical alignment and arrow mirroring
 */
export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const { locale, isRtl, dictionary } = useAppContext();

  const title = getProjectLocalizedText(project.title, locale);
  const subtitle = getProjectLocalizedText(project.subtitle, locale);
  const heroAlt = getProjectLocalizedText(project.heroAlt, locale);
  const locationLabel = dictionary.projects.locationOptions[project.location];
  const statusLabel = dictionary.projects.statusOptions[project.status];

  return (
    <Link
      href={`/projects/${project.slug}`}
      prefetch={true}
      className={cn(
        'group relative block shrink-0 overflow-hidden rounded-[4px]',
        'bg-[var(--surface-hover)]',
        'h-auto w-[80vw] max-w-[348px] aspect-square',
        'desktop:h-[clamp(276px,calc(100dvh-var(--grid-header)-var(--grid-bottom)-204px),460px)] desktop:w-[clamp(276px,calc(100dvh-var(--grid-header)-var(--grid-bottom)-204px),460px)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'
      )}
    >
      {/* Full-bleed Architectural Photography */}
      <Image
        src={project.heroImage}
        alt={heroAlt}
        fill
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes="(max-width: 767px) 80vw, 460px"
        referrerPolicy="no-referrer"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
      />

      {/* Base Legibility Gradient Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/82 via-black/26 to-black/10 transition-opacity duration-300 group-hover:from-black/88 group-hover:via-black/42"
      />

      {/* Subtle Masked Backdrop Blur Revealing Cleanly on Hover / Focus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-black/20 opacity-0 backdrop-blur-[5px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [mask-image:linear-gradient(to_top,black_45%,transparent_100%)]"
      />

      {/* Top-End Circular Action Indicator */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-4 end-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full',
          'bg-black/25 text-white backdrop-blur-sm [transform:translateZ(0)]',
          'transition-all duration-300 group-hover:bg-[var(--brand-primary)] group-focus-visible:bg-[var(--brand-primary)]'
        )}
      >
        <MdArrowOutward
          size={17}
          className={cn(
            'transition-transform duration-300',
            isRtl
              ? '-scale-x-100 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5'
              : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
          )}
        />
      </span>

      {/* Bottom Title & Hover-Expandable Summary */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 desktop:p-6">
        <p className="mb-1.5 flex items-center gap-2 text-[11px] font-medium tracking-[0.05em] text-white/75 uppercase rtl:normal-case rtl:tracking-normal">
          <span>{locationLabel}</span>
          <span aria-hidden="true" className="text-white/45">
            /
          </span>
          <span>{statusLabel}</span>
          <span aria-hidden="true" className="text-white/45">
            /
          </span>
          <span dir="ltr" className="bidi-isolate tabular-nums">
            {project.year}
          </span>
        </p>

        <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.01em] text-white desktop:text-[22px] rtl:leading-[1.45] rtl:tracking-normal">
          {title}
        </h2>

        {/* Smooth CSS Grid Row Reveal on Hover / Focus (Always visible on mobile touch) */}
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-400 ease-out desktop:grid-rows-[0fr] desktop:group-hover:grid-rows-[1fr] desktop:group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="pt-2 text-[13px] leading-[1.6] text-white/85 opacity-95 transition-opacity duration-400 desktop:opacity-0 desktop:group-hover:opacity-100 desktop:group-focus-visible:opacity-100 rtl:leading-[1.8]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
