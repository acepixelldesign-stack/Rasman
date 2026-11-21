'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, LogOut, UserRound } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config/site';
import { useAppContext } from '@/components/providers/app-provider';
import { useArchitecturalEntrance } from '@/components/motion/architectural-motion';
import { cn } from '@/lib/utils';

export function UserPanelStage() {
  const {
    userProfile,
    dictionary,
    isRtl,
    signOut,
    openStartProjectModal,
  } = useAppContext();

  const stageRef = useRef<HTMLDivElement>(null);
  useArchitecturalEntrance(stageRef, {
    isRtl,
    dependencies: [Boolean(userProfile)],
  });

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  if (!userProfile) {
    return (
      <div
        ref={stageRef}
        role="region"
        aria-label={dictionary.panel.regionAriaLabel}
        className="flex min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col items-center justify-center px-6 py-16 text-center desktop:px-12"
      >
        <div className="flex max-w-md flex-col items-center gap-6">
          <span
            data-gsap="kicker"
            aria-hidden="true"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--grid-line)] text-[var(--ink-muted)]"
          >
            <UserRound className="h-5 w-5" />
          </span>

          <div className="space-y-2">
            <h1
              data-gsap="heading"
              className={cn(
                'text-[clamp(1.5rem,2.6vw,2.15rem)] font-light leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)]',
                'rtl:leading-[1.45] rtl:tracking-normal'
              )}
            >
              {dictionary.panel.unauthenticatedTitle}
            </h1>
          </div>

          <div
            data-gsap="control"
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              type="button"
              onClick={openStartProjectModal}
              className={cn(
                'inline-flex h-11 cursor-pointer items-center justify-center rounded-full px-6',
                'bg-[var(--brand-primary)] text-[13px] font-medium text-[var(--brand-ink-on-primary)]',
                'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
              )}
            >
              {dictionary.panel.unauthenticatedCta}
            </button>

            <Link
              href="/"
              className={cn(
                'rasman-glass inline-flex h-11 items-center gap-2 rounded-full px-5',
                'text-[13px] text-[var(--ink-secondary)] transition-colors duration-200',
                'hover:bg-[var(--glass-control-hover)] hover:text-[var(--ink-primary)]'
              )}
            >
              <BackArrow className="h-4 w-4 shrink-0" />
              <span>{dictionary.panel.backHomeCta}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${userProfile.firstName} ${userProfile.lastName}`.trim();
  const accountTypeLabel = dictionary.auth.accountTypes[userProfile.accountType];
  const userRoleLabel = dictionary.auth.userRoles[userProfile.userRole];

  return (
    <div
      ref={stageRef}
      role="region"
      aria-label={dictionary.panel.regionAriaLabel}
      className="flex min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col justify-between"
    >
      <div className="flex w-full flex-1 flex-col p-6 desktop:p-10">
        {/* Panel Top Header & Identity Summary Strip */}
        <header className="relative flex flex-col gap-6 pb-8 desktop:flex-row desktop:items-end desktop:justify-between">
          <div className="space-y-2 text-start">
            <h1
              data-gsap="heading"
              className={cn(
                'text-[clamp(1.75rem,3.2vw,2.75rem)] font-light leading-[1.18] tracking-[-0.025em] text-[var(--ink-primary)]',
                'rtl:leading-[1.4] rtl:tracking-normal'
              )}
            >
              {dictionary.panel.title}
            </h1>
            <p
              data-gsap="body"
              className="text-[15px] font-medium text-[var(--ink-secondary)]"
            >
              {fullName}
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-6 text-start desktop:gap-8">
            <div data-gsap="body" className="space-y-1">
              <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)] rtl:tracking-normal">
                {dictionary.panel.accountTypeLabel}
              </dt>
              <dd className="text-[13px] font-medium text-[var(--ink-primary)]">
                {accountTypeLabel}
              </dd>
            </div>

            <div data-gsap="body" className="space-y-1">
              <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)] rtl:tracking-normal">
                {dictionary.panel.userRoleLabel}
              </dt>
              <dd className="text-[13px] font-medium text-[var(--ink-primary)]">
                {userRoleLabel}
              </dd>
            </div>

            <div data-gsap="body" className="space-y-1">
              <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)] rtl:tracking-normal">
                {dictionary.panel.phoneLabel}
              </dt>
              <dd
                dir="ltr"
                className="bidi-isolate tabular-nums text-[13px] font-medium text-[var(--ink-primary)] text-start"
              >
                {userProfile.phone}
              </dd>
            </div>
          </dl>

          <span
            data-gsap="divider"
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--grid-line)]"
          />
        </header>

        {/* Intentionally Minimal Empty Architectural Workspace Frame */}
        <div
          data-gsap="media"
          className="my-8 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[var(--grid-line)] px-6 py-16 text-center desktop:my-10"
        >
          <p className="max-w-md text-[14px] leading-[1.7] text-[var(--ink-muted)] rtl:leading-[1.85]">
            {dictionary.panel.emptyNotice}
          </p>
        </div>

        {/* Bottom Minimal Action Strip */}
        <div
          data-gsap="control"
          className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--grid-line)] pt-6"
        >
          <Link
            href="/"
            className={cn(
              'rasman-glass inline-flex h-10 items-center gap-2 rounded-full px-5',
              'text-[13px] text-[var(--ink-secondary)] transition-colors duration-200',
              'hover:bg-[var(--glass-control-hover)] hover:text-[var(--ink-primary)]'
            )}
          >
            <BackArrow className="h-4 w-4 shrink-0" />
            <span>{dictionary.panel.backHomeCta}</span>
          </Link>

          <button
            type="button"
            onClick={signOut}
            className={cn(
              'rasman-glass inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-5',
              'text-[13px] text-[var(--ink-secondary)] transition-colors duration-200',
              'hover:bg-[var(--glass-control-hover)] hover:text-[var(--ink-primary)]'
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{dictionary.panel.signOutCta}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
