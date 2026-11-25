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
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronsUpDown } from 'lucide-react';
import {
  MdClose,
  MdEnergySavingsLeaf,
  MdLocationCity,
  MdTune,
} from 'react-icons/md';
import { ARCHITECTURAL_PROJECTS, type ProjectMode } from '@/lib/data/projects';
import {
  MOTION_EASE,
  MOTION_TRANSITIONS,
  MOTION_VARIANTS,
} from '@/lib/motion/system';
import {
  markRouteContentHydrated,
  useAppContext,
} from '@/components/providers/app-provider';
import { useStickySubBar } from '@/components/frame/sticky-sub-bar-context';
import { useArchitecturalEntrance } from '@/components/motion/architectural-motion';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { ProjectCard } from '@/components/projects/project-card';
import {
  EMPTY_PROJECT_FILTERS,
  ProjectMegaFilter,
  countActiveProjectFilters,
  filterArchitecturalProjects,
  type ProjectMegaFilterState,
} from '@/components/projects/project-mega-filter';
import { cn } from '@/lib/utils';

const HORIZONTAL_LERP = 0.095;
const STOP_THRESHOLD_PX = 0.35;
const DRAG_THRESHOLD_PX = 8;

interface ProjectsStageProps {
  readonly initialMode?: ProjectMode;
}

/**
 * Unified Horizontal Projects Architectural Stage (Mobile & Desktop):
 * - Fixed 48px Architectural Floating Top Bar on BOTH Mobile and Desktop:
 *     - Start block: Projects Title
 *     - Center stretched block: Direct click-to-switch Mode Text + Icon (Green for Sustainable, Brown for Urban; no popup menu)
 *     - End square 48x48 block: Filter Settings icon triggering the ArchDaily-inspired Accordion Mega Filter
 * - Clean 10% brand-color background wash synchronized across Light & Dark mode (no background sketch image)
 * - Tall vertically stretched architectural project cards unified across mobile and desktop
 * - Mobile cards default collapsed like desktop and smoothly reveal descriptions when entering horizontally
 */
export function ProjectsStage({
  initialMode = 'sustainable',
}: ProjectsStageProps) {
  const { isRtl, dictionary, setAmbientMode } = useAppContext();
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

  const [appliedFilters, setAppliedFilters] = useState<ProjectMegaFilterState>(
    EMPTY_PROJECT_FILTERS
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isMegaFilterOpen, setIsMegaFilterOpen] = useState(false);
  const [mobileRevealState, setMobileRevealState] = useState<{
    readonly key: string;
    readonly slug: string | null;
  }>({ key: '', slug: null });

  const stageRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const cardItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const hasMobileScrolledRef = useRef(false);
  const megaFilterId = useId();

  useArchitecturalEntrance(stageRef, { isRtl });
  useBodyScrollLock(isMegaFilterOpen);

  const activeFilterCount = useMemo(
    () => countActiveProjectFilters(appliedFilters),
    [appliedFilters]
  );

  const filterKey = useMemo(
    () =>
      [
        activeMode,
        isRtl ? 'rtl' : 'ltr',
        appliedFilters.categories.join(','),
        appliedFilters.locations.join(','),
        appliedFilters.statuses.join(','),
        appliedFilters.architects.join(','),
        appliedFilters.years.join(','),
        appliedFilters.materials.join(','),
        appliedFilters.areas.join(','),
        appliedFilters.colors.join(','),
      ].join('|'),
    [activeMode, appliedFilters, isRtl]
  );

  const activeMobileSlug =
    mobileRevealState.key === filterKey ? mobileRevealState.slug : null;

  useEffect(() => {
    markRouteContentHydrated();
  }, []);

  // Drive full-viewport ambient palette behind grids & cross-browser toolbar color
  // (AppProvider automatically clears ambient mode when leaving /projects* routes)
  useEffect(() => {
    setAmbientMode(activeMode);
  }, [activeMode, setAmbientMode]);

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
    if (!isMegaFilterOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMegaFilterOpen(false);
        filterTriggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMegaFilterOpen]);

  const handleModeChange = (nextMode: ProjectMode) => {
    if (nextMode === activeMode) return;
    setManualOverride({ param: modeParam, mode: nextMode });
    if (typeof window !== 'undefined') {
      const nextUrl = `/projects?mode=${nextMode}`;
      window.history.replaceState(null, '', nextUrl);
    }
  };

  const handleApplyFilters = (nextFilters: ProjectMegaFilterState) => {
    setAppliedFilters(nextFilters);
    setIsMegaFilterOpen(false);
  };

  const handleClearFilters = () => {
    setAppliedFilters(EMPTY_PROJECT_FILTERS);
  };

  const filteredProjects = useMemo(
    () =>
      filterArchitecturalProjects(
        ARCHITECTURAL_PROJECTS,
        activeMode,
        appliedFilters
      ),
    [activeMode, appliedFilters]
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

  // Reset horizontal track scroll & mobile scroll-reveal whenever mode, filter, or text direction changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    targetOffsetRef.current = 0;
    currentOffsetRef.current = 0;
    hasMobileScrolledRef.current = false;
    el.scrollLeft = 0;
  }, [filterKey]);

  // Frame-by-frame smooth horizontal wheel & keyboard scrolling + mobile horizontal slide-in description reveal
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const desktopMediaQuery = window.matchMedia(
      '(min-width: 768px) and (min-height: 520px) and (orientation: landscape)'
    );

    const updateMobileActiveCard = () => {
      if (desktopMediaQuery.matches) return;
      const logicalOffset = getLogicalOffset(el);
      if (logicalOffset > 10) {
        hasMobileScrolledRef.current = true;
      }
      if (!hasMobileScrolledRef.current) return;

      const elRect = el.getBoundingClientRect();
      const elCenter = elRect.left + elRect.width / 2;
      let bestSlug: string | null = null;
      let bestScore = -1;

      cardItemRefs.current.forEach((node, slug) => {
        const rect = node.getBoundingClientRect();
        if (rect.width <= 0) return;
        const visibleWidth = Math.max(
          0,
          Math.min(elRect.right, rect.right) - Math.max(elRect.left, rect.left)
        );
        const visibleRatio = visibleWidth / rect.width;
        if (visibleRatio < 0.6) return;

        const cardCenter = rect.left + rect.width / 2;
        const centerProximity =
          1 -
          Math.min(
            1,
            Math.abs(cardCenter - elCenter) / Math.max(1, elRect.width)
          );
        const score = visibleRatio * 1.4 + centerProximity;

        if (score > bestScore) {
          bestScore = score;
          bestSlug = slug;
        }
      });

      setMobileRevealState((prev) =>
        prev.key === filterKey && prev.slug === bestSlug
          ? prev
          : { key: filterKey, slug: bestSlug }
      );
    };

    const handleWheel = (event: WheelEvent) => {
      if (document.documentElement.dataset.scrollLocked === 'true') return;
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
      if (document.documentElement.dataset.scrollLocked === 'true') return;
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
      updateMobileActiveCard();
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
  }, [applyLogicalOffset, filterKey, getLogicalOffset, isRtl, startInertiaLoop]);

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
        Math.min(
          maxScroll,
          dragStateRef.current.startOffset + logicalDelta * 1.25
        )
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

  const nextToggleMode: ProjectMode =
    activeMode === 'sustainable' ? 'urban' : 'sustainable';

  const ActiveModeIcon =
    activeMode === 'sustainable' ? MdEnergySavingsLeaf : MdLocationCity;

  const projectTrackListVariants = useMemo(
    () => ({
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.085,
          delayChildren: 0.08,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: MOTION_EASE.exit,
        },
      },
    }),
    []
  );

  // Horizontal card entrance: Right-to-Left in English (LTR), mirrored Left-to-Right in RTL,
  // settling Project #1 cleanly at the logical start edge
  const projectTrackItemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: isRtl ? -88 : 88 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.72,
          ease: MOTION_EASE.silk,
        },
      },
      exit: {
        opacity: 0,
        x: isRtl ? 28 : -28,
        transition: {
          duration: 0.24,
          ease: MOTION_EASE.exit,
        },
      },
    }),
    [isRtl]
  );

  useStickySubBar({
    id: 'projects-list',
    depth: 1,
    mobileOnly: false,
    ariaLabel: dictionary.projects.filterBarAriaLabel,
    onOutsideClick: isMegaFilterOpen
      ? () => setIsMegaFilterOpen(false)
      : undefined,
    content: (
      <div
        role="region"
        aria-label={dictionary.projects.filterBarAriaLabel}
        className="flex h-12 w-full items-stretch"
      >
        {/* Block 1 (Start): Projects Title + Short Hairline Divider Matching Project Detail */}
        <div className="flex shrink-0 items-center ps-4 pe-3 desktop:ps-6 desktop:pe-4">
          <h1 className="text-[15px] font-medium leading-none text-[var(--ink-primary)] desktop:text-[16px]">
            {dictionary.projects.title}
          </h1>
        </div>

        <span
          aria-hidden="true"
          className="h-4 w-px shrink-0 self-center bg-[var(--grid-line)]"
        />

        {/* Block 2 (Center Stretched): Mode Icon + Direct Click-to-Switch Mode Text (Green / Brown) */}
        <button
          type="button"
          onClick={() => handleModeChange(nextToggleMode)}
          aria-label={`${dictionary.projects.modeToggleAriaLabel}: ${dictionary.projects.modes[activeMode]}`}
          className={cn(
            'flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-2.5 px-3.5 text-start transition-colors duration-250 hover:bg-[var(--surface-hover)] desktop:px-5',
            activeMode === 'sustainable'
              ? 'text-[var(--brand-text-hover)]'
              : 'text-[var(--accent-khaki)]'
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activeMode}
              variants={MOTION_VARIANTS.textSwap}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex min-w-0 items-center gap-2"
            >
              <ActiveModeIcon
                size={17}
                aria-hidden="true"
                className="shrink-0"
              />
              <span className="truncate text-[14px] font-medium leading-none desktop:text-[15px]">
                {dictionary.projects.modes[activeMode]}
              </span>
            </motion.span>
          </AnimatePresence>

          <ChevronsUpDown
            size={17}
            strokeWidth={1.75}
            aria-hidden="true"
            className="shrink-0 opacity-85"
          />
        </button>

        {/* Block 3 (End Square 48x48): ArchDaily-Style Accordion Mega Filter Trigger */}
        <button
          ref={filterTriggerRef}
          type="button"
          aria-expanded={isMegaFilterOpen}
          aria-controls={megaFilterId}
          aria-label={
            isMegaFilterOpen
              ? dictionary.projects.closeFiltersAriaLabel
              : dictionary.projects.filtersTriggerAriaLabel
          }
          onClick={() => setIsMegaFilterOpen((prev) => !prev)}
          className={cn(
            'relative inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border-s border-[var(--grid-line)] transition-colors duration-200 hover:bg-[var(--surface-hover)]',
            isMegaFilterOpen || activeFilterCount > 0
              ? activeMode === 'sustainable'
                ? 'text-[var(--brand-text-hover)]'
                : 'text-[var(--accent-khaki)]'
              : 'text-[var(--ink-primary)]'
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMegaFilterOpen ? (
              <motion.span
                key="filter-close"
                variants={MOTION_VARIANTS.iconSwap}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="inline-flex items-center justify-center"
              >
                <MdClose size={20} aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span
                key="filter-tune"
                variants={MOTION_VARIANTS.iconSwap}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="inline-flex items-center justify-center"
              >
                <MdTune size={19} aria-hidden="true" />
              </motion.span>
            )}
          </AnimatePresence>
          {activeFilterCount > 0 && !isMegaFilterOpen && (
            <span
              dir="ltr"
              aria-hidden="true"
              className={cn(
                'bidi-isolate absolute top-1.5 end-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-medium tabular-nums text-[var(--brand-ink-on-primary)]',
                activeMode === 'sustainable'
                  ? 'bg-[var(--brand-primary)]'
                  : 'bg-[var(--accent-khaki)]'
              )}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    ),
    sheet: (
      <AnimatePresence initial={false}>
        {isMegaFilterOpen && (
          <ProjectMegaFilter
            key={`mega-filter-${filterKey}`}
            id={megaFilterId}
            activeMode={activeMode}
            appliedFilters={appliedFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        )}
      </AnimatePresence>
    ),
  });

  return (
    <section
      ref={stageRef}
      aria-label={dictionary.projects.regionAriaLabel}
      className="relative flex h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col overflow-hidden bg-transparent pt-12"
    >
      {/* Unified Horizontal Scrolling Architectural Cards Stage (24px Desktop Padding, Right-to-Left Initial Entrance) */}
      <div
        ref={scrollerRef}
        data-smooth-prevent=""
        onMouseDown={handleMouseDown}
        onClickCapture={handleClickCapture}
        className={cn(
          'no-scrollbar relative z-10 flex min-h-0 w-full flex-1 flex-row items-center overflow-x-auto overflow-y-hidden touch-pan-x',
          'px-4 py-4 desktop:px-6 desktop:py-6',
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        )}
      >
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.ul
              key={filterKey}
              variants={projectTrackListVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex h-full flex-row items-center gap-4 desktop:gap-5"
            >
              {filteredProjects.map((project, index) => (
                <motion.li
                  key={project.slug}
                  ref={(node) => {
                    if (node) {
                      cardItemRefs.current.set(project.slug, node);
                    } else {
                      cardItemRefs.current.delete(project.slug);
                    }
                  }}
                  variants={projectTrackItemVariants}
                  className="flex h-full shrink-0 items-center"
                >
                  <ProjectCard
                    project={project}
                    priority={index < 2}
                    isMobileActive={activeMobileSlug === project.slug}
                  />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="projects-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION_TRANSITIONS.fast}
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
                onClick={handleClearFilters}
                className={cn(
                  'mt-2 inline-flex h-10 cursor-pointer items-center justify-center rounded-[3px] px-5',
                  'text-[13px] font-medium text-[var(--brand-ink-on-primary)] transition-colors duration-200',
                  activeMode === 'sustainable'
                    ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]'
                    : 'bg-[var(--accent-khaki)] hover:opacity-90'
                )}
              >
                {dictionary.projects.clearFiltersLabel}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
