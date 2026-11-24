'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  MdCheck,
  MdClose,
  MdEnergySavingsLeaf,
  MdLocationCity,
  MdRestartAlt,
  MdTune,
} from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  ARCHITECTURAL_PROJECTS,
  PROJECT_LOCATION_OPTIONS,
  PROJECT_MODE_ARTWORK,
  PROJECT_MODE_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  type ProjectLocationId,
  type ProjectMode,
  type ProjectStatusId,
  type ProjectTypeId,
} from '@/lib/data/projects';
import {
  markRouteContentHydrated,
  useAppContext,
} from '@/components/providers/app-provider';
import {
  ARCHITECTURAL_EASE,
  CARD_STAGGER_CONTAINER_VARIANTS,
  CARD_STAGGER_ITEM_VARIANTS,
  useArchitecturalEntrance,
} from '@/components/motion/architectural-motion';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { ProjectCard } from '@/components/projects/project-card';
import {
  ProjectFilterDropdown,
  type FilterDropdownOption,
} from '@/components/projects/project-filter-dropdown';
import { cn } from '@/lib/utils';

const HORIZONTAL_LERP = 0.095;
const STOP_THRESHOLD_PX = 0.35;
const DRAG_THRESHOLD_PX = 8;

interface ProjectsStageProps {
  readonly initialMode?: ProjectMode;
}

/**
 * Primary Horizontal Projects Architectural Stage:
 * - Segmented 2-mode pill toggle (Sustainable Architecture vs. Urban Architecture) with icons
 * - Three glassmorphic dropdown filters: TYPE, STATUS (Concept / In Progress / Completed), and LOCATION (Cities)
 * - Large square project cards in a smooth horizontal inertial gallery (wheel-to-horizontal, drag-pan, touch-swipe, RTL parity)
 */
export function ProjectsStage({
  initialMode = 'sustainable',
}: ProjectsStageProps) {
  const { isRtl, dictionary } = useAppContext();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const urlMode: ProjectMode =
    modeParam === 'urban'
      ? 'urban'
      : modeParam === 'sustainable'
        ? 'sustainable'
        : initialMode;

  const [manualOverride, setManualOverride] = useState<{
    readonly param: string | null;
    readonly mode: ProjectMode;
  } | null>(null);

  const activeMode: ProjectMode =
    manualOverride && manualOverride.param === modeParam
      ? manualOverride.mode
      : urlMode;
  const [selectedType, setSelectedType] = useState<ProjectTypeId>('all');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatusId>('all');
  const [selectedLocation, setSelectedLocation] =
    useState<ProjectLocationId>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const stageRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const mobileFilterRef = useRef<HTMLDivElement>(null);
  const mobileFilterTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileFilterId = useId();
  useArchitecturalEntrance(stageRef, { isRtl });
  useBodyScrollLock(isMobileFiltersOpen);

  useEffect(() => {
    markRouteContentHydrated();
  }, []);
  const targetOffsetRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const dragStateRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startOffset: 0,
  });

  useEffect(() => {
    if (!isMobileFiltersOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        mobileFilterRef.current &&
        !mobileFilterRef.current.contains(event.target as Node)
      ) {
        setIsMobileFiltersOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileFiltersOpen(false);
        mobileFilterTriggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileFiltersOpen]);

  const handleModeChange = (nextMode: ProjectMode) => {
    if (nextMode === activeMode) return;
    setManualOverride({ param: modeParam, mode: nextMode });
    if (typeof window !== 'undefined') {
      const nextUrl = `/projects?mode=${nextMode}`;
      window.history.replaceState(null, '', nextUrl);
    }
  };

  const hasActiveDropdownFilter =
    selectedType !== 'all' ||
    selectedStatus !== 'all' ||
    selectedLocation !== 'all';

  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedLocation('all');
  };

  const filteredProjects = useMemo(() => {
    return ARCHITECTURAL_PROJECTS.filter((project) => {
      if (project.mode !== activeMode) return false;
      if (selectedType !== 'all' && project.type !== selectedType) return false;
      if (selectedStatus !== 'all' && project.status !== selectedStatus)
        return false;
      if (selectedLocation !== 'all' && project.location !== selectedLocation)
        return false;
      return true;
    });
  }, [activeMode, selectedType, selectedStatus, selectedLocation]);

  const typeOptions = useMemo<readonly FilterDropdownOption<ProjectTypeId>[]>(
    () =>
      PROJECT_TYPE_OPTIONS.map((value) => ({
        value,
        label: dictionary.projects.typeOptions[value],
      })),
    [dictionary.projects.typeOptions]
  );

  const statusOptions = useMemo<
    readonly FilterDropdownOption<ProjectStatusId>[]
  >(
    () =>
      PROJECT_STATUS_OPTIONS.map((value) => ({
        value,
        label: dictionary.projects.statusOptions[value],
      })),
    [dictionary.projects.statusOptions]
  );

  const locationOptions = useMemo<
    readonly FilterDropdownOption<ProjectLocationId>[]
  >(
    () =>
      PROJECT_LOCATION_OPTIONS.map((value) => ({
        value,
        label: dictionary.projects.locationOptions[value],
      })),
    [dictionary.projects.locationOptions]
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
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        return;
      }

      currentOffsetRef.current += diff * HORIZONTAL_LERP;
      applyLogicalOffset(el, currentOffsetRef.current);
      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    rafIdRef.current = window.requestAnimationFrame(tick);
  }, [applyLogicalOffset]);

  // Reset horizontal track scroll whenever mode, filter, or text direction changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    targetOffsetRef.current = 0;
    currentOffsetRef.current = 0;
    el.scrollLeft = 0;
  }, [isRtl, activeMode, selectedType, selectedStatus, selectedLocation]);

  // Frame-by-frame smooth horizontal wheel & keyboard scrolling
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
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [applyLogicalOffset, getLogicalOffset, isRtl, startInertiaLoop]);

  // Smooth desktop mouse grab-drag without blocking clicks on project cards
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStateRef.current.active) return;
      const el = scrollerRef.current;
      if (!el) return;

      const deltaX = event.clientX - dragStateRef.current.startX;
      if (
        !dragStateRef.current.moved &&
        Math.abs(deltaX) > DRAG_THRESHOLD_PX
      ) {
        dragStateRef.current.moved = true;
        setIsDragging(true);
      }
      if (!dragStateRef.current.moved) return;

      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const logicalDelta = isRtl ? deltaX : -deltaX;
      targetOffsetRef.current = Math.max(
        0,
        Math.min(maxScroll, dragStateRef.current.startOffset + logicalDelta * 1.25)
      );
      startInertiaLoop();
    };

    const handleMouseUp = () => {
      if (!dragStateRef.current.active) return;
      dragStateRef.current.active = false;
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRtl, startInertiaLoop]);

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    const current = getLogicalOffset(el);
    currentOffsetRef.current = current;
    targetOffsetRef.current = current;

    dragStateRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startOffset: current,
    };
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (dragStateRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragStateRef.current.moved = false;
    }
  };

  return (
    <section
      ref={stageRef}
      aria-label={dictionary.projects.regionAriaLabel}
      className="relative flex min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col bg-[var(--bg-canvas)] desktop:h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] desktop:overflow-hidden"
    >
      {/* Mode-Specific Architectural Sketch Background (20% Opacity, Light/Dark/RTL Adaptive) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none opacity-20 mix-blend-multiply dark:mix-blend-screen"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.72,
              ease: ARCHITECTURAL_EASE,
            }}
            className="relative h-full w-full"
          >
            <Image
              src={PROJECT_MODE_ARTWORK[activeMode]}
              alt=""
              fill
              priority
              sizes="100vw"
              referrerPolicy="no-referrer"
              className="object-cover object-[78%_bottom] desktop:object-bottom contrast-[1.04] dark:invert dark:hue-rotate-180 dark:contrast-[1.06] rtl:-scale-x-100"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top Editorial Title + Segmented Mode Toggle & Dropdown Filters */}
      <header className="relative z-20 flex shrink-0 flex-col gap-6 px-4 pt-6 pb-4 desktop:gap-7 desktop:px-10 desktop:pt-8 desktop:pb-5 desktop-wide:px-14">
        <h1
          data-gsap="heading"
          className="text-[clamp(1.65rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--ink-primary)] rtl:leading-[1.35] rtl:tracking-normal"
        >
          {dictionary.projects.title}
        </h1>

        <div
          ref={mobileFilterRef}
          role="region"
          aria-label={dictionary.projects.filterBarAriaLabel}
          className="relative flex flex-nowrap items-center gap-2.5 desktop:flex-wrap desktop:gap-3"
        >
          {/* Two-Mode Shadowless Frosted Muted-Grey Glass Segmented Button (Full-Width Fill on Mobile) */}
          <div
            data-gsap="control"
            role="tablist"
            aria-label={dictionary.projects.modeToggleAriaLabel}
            className={cn(
              'rasman-glass no-scrollbar flex min-w-0 flex-1 items-center overflow-x-auto rounded-full p-1',
              'desktop:inline-flex desktop:w-auto desktop:flex-none'
            )}
          >
            {PROJECT_MODE_OPTIONS.map((mode) => {
              const isActive = activeMode === mode;
              const Icon =
                mode === 'sustainable' ? MdEnergySavingsLeaf : MdLocationCity;

              return (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleModeChange(mode)}
                  className={cn(
                    'relative inline-flex h-7 flex-1 justify-center desktop:flex-none cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12px] leading-none font-medium transition-colors duration-200',
                    'whitespace-nowrap',
                    isActive
                      ? 'text-[var(--brand-ink-on-primary)]'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="projects-mode-thumb"
                      transition={{
                        duration: 0.32,
                        ease: ARCHITECTURAL_EASE,
                      }}
                      className={cn(
                        'absolute inset-0 rounded-full',
                        mode === 'sustainable'
                          ? 'bg-[var(--brand-primary)]'
                          : 'bg-[var(--accent-khaki)]'
                      )}
                    />
                  )}
                  <Icon
                    size={15}
                    aria-hidden="true"
                    className={cn(
                      'relative z-10 shrink-0 transition-colors duration-200',
                      isActive
                        ? 'text-[var(--brand-ink-on-primary)]'
                        : 'text-[var(--ink-muted)]'
                    )}
                  />
                  <span className="relative z-10">
                    {dictionary.projects.modeTabs[mode]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Glassmorphic Shadowless Filter Icon Button beside Segmented Button */}
          <button
            data-gsap="control"
            ref={mobileFilterTriggerRef}
            type="button"
            aria-expanded={isMobileFiltersOpen}
            aria-controls={mobileFilterId}
            aria-label={dictionary.projects.filtersTriggerAriaLabel}
            onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            className={cn(
              'rasman-glass relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-250 desktop:hidden',
              'hover:bg-[var(--glass-control-hover)]',
              isMobileFiltersOpen || hasActiveDropdownFilter
                ? 'text-[var(--brand-text-hover)]'
                : 'text-[var(--ink-primary)]'
            )}
          >
            <MdTune size={18} aria-hidden="true" />
            {hasActiveDropdownFilter && !isMobileFiltersOpen && (
              <span
                aria-hidden="true"
                className="absolute top-1.5 end-1.5 h-1.5 w-1.5 rounded-full bg-[var(--brand-text-hover)]"
              />
            )}
          </button>

          {/* Desktop Inline Dropdown Filters */}
          <div
            data-gsap="control"
            className="hidden desktop:inline-flex desktop:flex-wrap desktop:items-center desktop:gap-3"
          >
            {/* Dropdown 1: Project Type */}
            <ProjectFilterDropdown
              label={dictionary.projects.typeLabel}
              value={selectedType}
              options={typeOptions}
              onChange={setSelectedType}
            />

            {/* Dropdown 2: Project Status (Concept / In Progress / Completed) */}
            <ProjectFilterDropdown
              label={dictionary.projects.statusLabel}
              value={selectedStatus}
              options={statusOptions}
              onChange={setSelectedStatus}
            />

            {/* Dropdown 3: Cities / Location */}
            <ProjectFilterDropdown
              label={dictionary.projects.locationLabel}
              value={selectedLocation}
              options={locationOptions}
              onChange={setSelectedLocation}
            />

            {/* Subtle Reset Filter Trigger when filtered */}
            <AnimatePresence>
              {hasActiveDropdownFilter && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{
                    duration: SITE_CONFIG.motion.fastDuration,
                    ease: ARCHITECTURAL_EASE,
                  }}
                  onClick={handleResetFilters}
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-[var(--ink-muted)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
                >
                  <MdRestartAlt size={15} aria-hidden="true" />
                  <span>{dictionary.projects.resetFilters}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Expanded Filter Panel (Shadowless Glass Container) */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <motion.div
                id={mobileFilterId}
                role="dialog"
                data-scroll-lock-allow=""
                aria-label={dictionary.projects.filtersPanelTitle}
                initial={{ opacity: 0, y: -8, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.985 }}
                transition={{
                  duration: 0.34,
                  ease: ARCHITECTURAL_EASE,
                }}
                className="rasman-glass-popover absolute top-[calc(100%+8px)] start-0 end-0 z-30 rounded-2xl p-4 desktop:hidden"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-[12px] font-medium tracking-[0.04em] text-[var(--ink-primary)] rtl:tracking-normal">
                    {dictionary.projects.filtersPanelTitle}
                  </span>
                  <div className="flex items-center gap-2">
                    {hasActiveDropdownFilter && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[12px] font-medium text-[var(--brand-text-hover)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
                      >
                        <MdRestartAlt size={14} aria-hidden="true" />
                        <span>{dictionary.projects.resetFilters}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={dictionary.projects.filtersTriggerAriaLabel}
                      onClick={() => {
                        setIsMobileFiltersOpen(false);
                        mobileFilterTriggerRef.current?.focus();
                      }}
                      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors duration-150 hover:bg-[var(--surface-hover)] hover:text-[var(--ink-primary)]"
                    >
                      <MdClose size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="flex max-h-[min(58dvh,420px)] flex-col gap-4 overflow-y-auto pe-1">
                  {/* Group 1: Type */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-medium tracking-[0.04em] text-[var(--ink-muted)] rtl:tracking-normal">
                      {dictionary.projects.typeLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {typeOptions.map((option) => {
                        const isSelected = option.value === selectedType;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedType(option.value)}
                            className={cn(
                              'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-200',
                              isSelected
                                ? 'bg-[var(--glass-control-thumb)] text-[var(--brand-text-hover)]'
                                : 'bg-[var(--glass-control-bg)] text-[var(--ink-secondary)] hover:bg-[var(--glass-control-hover)] hover:text-[var(--ink-primary)]'
                            )}
                          >
                            {isSelected && (
                              <MdCheck size={13} aria-hidden="true" />
                            )}
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 2: Status */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-medium tracking-[0.04em] text-[var(--ink-muted)] rtl:tracking-normal">
                      {dictionary.projects.statusLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {statusOptions.map((option) => {
                        const isSelected = option.value === selectedStatus;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedStatus(option.value)}
                            className={cn(
                              'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-200',
                              isSelected
                                ? 'bg-[var(--glass-control-thumb)] text-[var(--brand-text-hover)]'
                                : 'bg-[var(--glass-control-bg)] text-[var(--ink-secondary)] hover:bg-[var(--glass-control-hover)] hover:text-[var(--ink-primary)]'
                            )}
                          >
                            {isSelected && (
                              <MdCheck size={13} aria-hidden="true" />
                            )}
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 3: Location */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-medium tracking-[0.04em] text-[var(--ink-muted)] rtl:tracking-normal">
                      {dictionary.projects.locationLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {locationOptions.map((option) => {
                        const isSelected = option.value === selectedLocation;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedLocation(option.value)}
                            className={cn(
                              'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-200',
                              isSelected
                                ? 'bg-[var(--glass-control-thumb)] text-[var(--brand-text-hover)]'
                                : 'bg-[var(--glass-control-bg)] text-[var(--ink-secondary)] hover:bg-[var(--glass-control-hover)] hover:text-[var(--ink-primary)]'
                            )}
                          >
                            {isSelected && (
                              <MdCheck size={13} aria-hidden="true" />
                            )}
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Large Horizontal Scrolling Architectural Cards Stage (Staggered Cascade) */}
      <div
        ref={scrollerRef}
        data-smooth-prevent=""
        onMouseDown={handleMouseDown}
        onClickCapture={handleClickCapture}
        className={cn(
          'no-scrollbar relative z-10 flex w-full flex-1 flex-row items-center overflow-x-auto overflow-y-hidden touch-pan-x',
          'px-4 pt-2 pb-8 desktop:px-10 desktop:pt-2 desktop:pb-6 desktop-wide:px-14',
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {filteredProjects.length > 0 ? (
            <motion.ul
              key={`${activeMode}-${selectedType}-${selectedStatus}-${selectedLocation}`}
              variants={CARD_STAGGER_CONTAINER_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-row items-center gap-5 desktop:gap-7 desktop-wide:gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.li
                  key={project.slug}
                  variants={CARD_STAGGER_ITEM_VARIANTS}
                  className="shrink-0"
                >
                  <ProjectCard project={project} priority={index < 2} />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="projects-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: SITE_CONFIG.motion.fastDuration,
                ease: SITE_CONFIG.motion.ease,
              }}
              className="flex flex-col items-start gap-3 py-10"
            >
              <p className="text-[18px] font-medium text-[var(--ink-primary)]">
                {dictionary.projects.emptyTitle}
              </p>
              <p className="text-[14px] text-[var(--ink-secondary)]">
                {dictionary.projects.emptyDescription}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className={cn(
                  'mt-2 inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-5',
                  'bg-[var(--brand-primary)] text-[13px] font-medium text-[var(--brand-ink-on-primary)]',
                  'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)]'
                )}
              >
                {dictionary.projects.resetFilters}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
