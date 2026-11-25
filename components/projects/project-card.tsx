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
  readonly isMobileActive?: boolean;
}

/**
 * Large Horizontal Gallery Project Card (4px Architectural Radius):
 * - Mobile & Desktop: tall vertically stretched proportion closely unified across breakpoints
 * - Mobile: description matches desktop default (hidden) and reveals smoothly as cards slide into view horizontally
 * - Desktop: hover/focus reveal with subtle masked bottom backdrop blur
 * - Full LTR/RTL logical alignment and arrow mirroring
 */
export function ProjectCard({
  project,
  priority = false,
  isMobileActive = false,
}: ProjectCardProps) {
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
        'h-full w-[72vw] max-w-[292px]',
        'desktop:h-full desktop:w-[clamp(284px,27vw,372px)] desktop:max-w-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'
      )}
    >
      {/* Full-bleed Architectural Photography (Grayscale by Default; Colorizes on Desktop Hover/Focus & Mobile Active Reveal) */}
      <Image
        src={project.heroImage}
        alt={heroAlt}
        fill
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes="(max-width: 767px) 72vw, 372px"
        referrerPolicy="no-referrer"
        className={cn(
          'object-cover transition-all duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]',
          isMobileActive
            ? 'scale-[1.025] grayscale-0 desktop:scale-100 desktop:grayscale desktop:group-hover:grayscale-0 desktop:group-focus-visible:grayscale-0'
            : 'grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0'
        )}
      />

      {/* Base Legibility Gradient Scrim */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-t from-black/82 via-black/26 to-black/10 transition-opacity duration-300 group-hover:from-black/88 group-hover:via-black/42',
          isMobileActive &&
            'from-black/88 via-black/42 desktop:from-black/82 desktop:via-black/26'
        )}
      />

      {/* Subtle Masked Backdrop Blur Revealing on Desktop Hover/Focus or Mobile Active Scroll */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-black/20 backdrop-blur-[5px] transition-opacity duration-350 [mask-image:linear-gradient(to_top,black_45%,transparent_100%)]',
          isMobileActive
            ? 'opacity-100 desktop:opacity-0 desktop:group-hover:opacity-100 desktop:group-focus-visible:opacity-100'
            : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
        )}
      />

      {/* Top-End Circular Action Indicator */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-4 end-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full',
          'text-white backdrop-blur-sm [transform:translateZ(0)] transition-all duration-300',
          isMobileActive
            ? 'bg-[var(--brand-primary)] desktop:bg-black/25 desktop:group-hover:bg-[var(--brand-primary)] desktop:group-focus-visible:bg-[var(--brand-primary)]'
            : 'bg-black/25 group-hover:bg-[var(--brand-primary)] group-focus-visible:bg-[var(--brand-primary)]'
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

      {/* Bottom Title & Expandable Summary (Default Collapsed on Both Desktop & Mobile) */}
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

        {/* Smooth CSS Grid Row Reveal: Default Collapsed Like Desktop; Reveals on Mobile Horizontal Slide-In or Desktop Hover/Focus */}
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-400 ease-out',
            isMobileActive
              ? 'grid-rows-[1fr] desktop:grid-rows-[0fr] desktop:group-hover:grid-rows-[1fr] desktop:group-focus-visible:grid-rows-[1fr]'
              : 'grid-rows-[0fr] desktop:group-hover:grid-rows-[1fr] desktop:group-focus-visible:grid-rows-[1fr]'
          )}
        >
          <div className="overflow-hidden">
            <p
              className={cn(
                'pt-2 text-[13px] leading-[1.6] text-white/85 transition-opacity duration-400 rtl:leading-[1.8]',
                isMobileActive
                  ? 'opacity-95 desktop:opacity-0 desktop:group-hover:opacity-100 desktop:group-focus-visible:opacity-100'
                  : 'opacity-0 desktop:group-hover:opacity-100 desktop:group-focus-visible:opacity-100'
              )}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
