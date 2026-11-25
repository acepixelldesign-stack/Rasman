'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MdCheck,
  MdClose,
  MdKeyboardArrowDown,
  MdRestartAlt,
} from 'react-icons/md';
import {
  ARCHITECTURAL_PROJECTS,
  PROJECT_ARCHITECT_OPTIONS,
  PROJECT_AREA_OPTIONS,
  PROJECT_COLOR_OPTIONS,
  PROJECT_COLOR_SWATCHES,
  PROJECT_LOCATION_OPTIONS,
  PROJECT_MATERIAL_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  PROJECT_YEAR_OPTIONS,
  type ArchitecturalProject,
  type ProjectArchitectId,
  type ProjectAreaId,
  type ProjectColorId,
  type ProjectLocationId,
  type ProjectMaterialId,
  type ProjectMode,
  type ProjectStatusId,
  type ProjectTypeId,
  type ProjectYearId,
} from '@/lib/data/projects';
import { useAppContext } from '@/components/providers/app-provider';
import { useSwipeUpDismiss } from '@/hooks/use-swipe-up-dismiss';
import { MOTION_VARIANTS } from '@/lib/motion/system';
import { cn } from '@/lib/utils';

export type ProjectCategoryFilterId = Exclude<ProjectTypeId, 'all'>;
export type ProjectStatusFilterId = Exclude<ProjectStatusId, 'all'>;
export type ProjectLocationFilterId = Exclude<ProjectLocationId, 'all'>;

export interface ProjectMegaFilterState {
  readonly categories: readonly ProjectCategoryFilterId[];
  readonly locations: readonly ProjectLocationFilterId[];
  readonly statuses: readonly ProjectStatusFilterId[];
  readonly architects: readonly ProjectArchitectId[];
  readonly years: readonly ProjectYearId[];
  readonly materials: readonly ProjectMaterialId[];
  readonly areas: readonly ProjectAreaId[];
  readonly colors: readonly ProjectColorId[];
}

export const EMPTY_PROJECT_FILTERS: ProjectMegaFilterState = {
  categories: [],
  locations: [],
  statuses: [],
  architects: [],
  years: [],
  materials: [],
  areas: [],
  colors: [],
};

export function countActiveProjectFilters(
  filters: ProjectMegaFilterState
): number {
  return (
    filters.categories.length +
    filters.locations.length +
    filters.statuses.length +
    filters.architects.length +
    filters.years.length +
    filters.materials.length +
    filters.areas.length +
    filters.colors.length
  );
}

export function filterArchitecturalProjects(
  projects: readonly ArchitecturalProject[],
  activeMode: ProjectMode,
  filters: ProjectMegaFilterState
): readonly ArchitecturalProject[] {
  return projects.filter((project) => {
    if (project.mode !== activeMode) return false;
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(project.type)
    ) {
      return false;
    }
    if (
      filters.locations.length > 0 &&
      !filters.locations.includes(project.location)
    ) {
      return false;
    }
    if (
      filters.statuses.length > 0 &&
      !filters.statuses.includes(project.status)
    ) {
      return false;
    }
    if (
      filters.architects.length > 0 &&
      !filters.architects.includes(project.architectId)
    ) {
      return false;
    }
    if (filters.years.length > 0 && !filters.years.includes(project.year)) {
      return false;
    }
    if (
      filters.materials.length > 0 &&
      !filters.materials.some((material) =>
        project.materials.includes(material)
      )
    ) {
      return false;
    }
    if (
      filters.areas.length > 0 &&
      !filters.areas.includes(project.areaRange)
    ) {
      return false;
    }
    if (
      filters.colors.length > 0 &&
      !filters.colors.includes(project.colorPalette)
    ) {
      return false;
    }
    return true;
  });
}

type AccordionSectionId =
  | 'categories'
  | 'locations'
  | 'statuses'
  | 'architects'
  | 'years'
  | 'materials'
  | 'areas'
  | 'colors';

interface AccordionOption {
  readonly value: string;
  readonly label: string;
  readonly swatch?: string;
  readonly isLtr?: boolean;
}

interface ProjectMegaFilterProps {
  readonly id: string;
  readonly activeMode: ProjectMode;
  readonly appliedFilters: ProjectMegaFilterState;
  readonly onApply: (nextFilters: ProjectMegaFilterState) => void;
  readonly onClear: () => void;
  readonly onClose?: () => void;
}

function toggleArrayItem<T extends string>(
  list: readonly T[],
  value: T
): readonly T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

/**
 * Full-Screen Glassmorphic ArchDaily-Inspired Accordion Mega Filter (Mobile & Desktop):
 * - Slides down cleanly across the full remaining viewport height inside the architectural frame rails
 * - 8 collapsible accordion groups: Categories, City/Region, Status, Architects, Year, Materials, Area, Color
 * - Borderless footer with pure-white full-radius Apply button adjacent to circular full-radius Clear icon button
 */
export function ProjectMegaFilter({
  id,
  activeMode,
  appliedFilters,
  onApply,
  onClear,
  onClose,
}: ProjectMegaFilterProps) {
  const { dictionary } = useAppContext();
  const panelRef = useRef<HTMLDivElement>(null);
  const [draftFilters, setDraftFilters] =
    useState<ProjectMegaFilterState>(appliedFilters);
  const [openAccordions, setOpenAccordions] = useState<
    readonly AccordionSectionId[]
  >(['categories']);

  const handleDismiss = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useSwipeUpDismiss(panelRef, Boolean(onClose), handleDismiss);

  const toggleAccordion = (sectionId: AccordionSectionId) => {
    setOpenAccordions((prev) =>
      prev.includes(sectionId)
        ? prev.filter((item) => item !== sectionId)
        : [...prev, sectionId]
    );
  };

  const previewCount = useMemo(
    () =>
      filterArchitecturalProjects(
        ARCHITECTURAL_PROJECTS,
        activeMode,
        draftFilters
      ).length,
    [activeMode, draftFilters]
  );

  const draftActiveCount = useMemo(
    () => countActiveProjectFilters(draftFilters),
    [draftFilters]
  );

  const modeAccentTextClass =
    activeMode === 'sustainable'
      ? 'text-[var(--brand-text-hover)]'
      : 'text-[var(--accent-khaki)]';

  const isClearDisabled =
    draftActiveCount === 0 && countActiveProjectFilters(appliedFilters) === 0;

  const sections = useMemo<
    readonly {
      readonly id: AccordionSectionId;
      readonly label: string;
      readonly selectedValues: readonly string[];
      readonly options: readonly AccordionOption[];
      readonly onToggleValue: (value: string) => void;
    }[]
  >(() => {
    const categoryValues = PROJECT_TYPE_OPTIONS.filter(
      (value): value is ProjectCategoryFilterId => value !== 'all'
    );
    const locationValues = PROJECT_LOCATION_OPTIONS.filter(
      (value): value is ProjectLocationFilterId => value !== 'all'
    );
    const statusValues = PROJECT_STATUS_OPTIONS.filter(
      (value): value is ProjectStatusFilterId => value !== 'all'
    );

    return [
      {
        id: 'categories',
        label: dictionary.projects.categoriesLabel,
        selectedValues: draftFilters.categories,
        options: categoryValues.map((value) => ({
          value,
          label: dictionary.projects.typeOptions[value],
        })),
        onToggleValue: (value) =>
          setDraftFilters((prev) => ({
            ...prev,
            categories: toggleArrayItem(
              prev.categories,
              value as ProjectCategoryFilterId
            ),
          })),
      },
      {
        id: 'locations',
        label: dictionary.projects.cityRegionLabel,
        selectedValues: draftFilters.locations,
        options: locationValues.map((value) => ({
          value,
          label: dictionary.projects.locationOptions[value],
        })),
        onToggleValue: (value) =>
          setDraftFilters((prev) => ({
            ...prev,
            locations: toggleArrayItem(
              prev.locations,
              value as ProjectLocationFilterId
            ),
          })),
      },
      {
        id: 'statuses',
        label: dictionary.projects.statusLabel,
        selectedValues: draftFilters.statuses,
        options: statusValues.map((value) => ({
          value,
          label: dictionary.projects.statusOptions[value],
        })),
        onToggleValue: (value) =>
          setDraftFilters((prev) => ({
            ...prev,
            statuses: toggleArrayItem(
              prev.statuses,
              value as ProjectStatusFilterId
            ),
          })),
      },
      {
        id: 'architects',
        label: dictionary.projects.architectsLabel,
        selectedValues: draftFilters.architects,
        options: PROJECT_ARCHITECT_OPTIONS.map((value) => ({
          value,
          label: dictionary.projects.architectOptions[value],
        })),
        onToggleValue: (value) =>
          setDraftFilters((prev) => ({
            ...prev,
            architects: toggleArrayItem(
              prev.architects,
              value as ProjectArchitectId
            ),
          })),
      },
      {
        id: 'years',
        label: dictionary.projects.yearLabel,
        selectedValues: draftFilters.years,
        options: PROJECT_YEAR_OPTIONS.map((value) => ({
          value,
          label: dictionary.projects.yearOptions[value],
          isLtr: true,
        })),
        onToggleValue: (value) =>
          setDraftFilters((prev) => ({
            ...prev,
            years: toggleArrayItem(prev.years, value as ProjectYearId),
          })),
      },
      {
        id: 'materials',
        label: dictionary.projects.materialsLabel,
        selectedValues: draftFilters.materials,
        options: PROJECT_MATERIAL_OPTIONS.map((value) => ({
          value,
          label: dictionary.projects.materialOptions[value],
        })),
        onToggleValue: (value) =>
          setDraftFilters((prev) => ({
            ...prev,
            materials: toggleArrayItem(
              prev.materials,
              value as ProjectMaterialId
            ),
          })),
      },
      {
        id: 'areas',
        label: dictionary.projects.areaLabel,
        selectedValues: draftFilters.areas,
        options: PROJECT_AREA_OPTIONS.map((value) => ({
          value,
          label: dictionary.projects.areaOptions[value],
        })),
        onToggleValue: (value) =>
          setDraftFilters((prev) => ({
            ...prev,
            areas: toggleArrayItem(prev.areas, value as ProjectAreaId),
          })),
      },
      {
        id: 'colors',
        label: dictionary.projects.colorLabel,
        selectedValues: draftFilters.colors,
        options: PROJECT_COLOR_OPTIONS.map((value) => ({
          value,
          label: dictionary.projects.colorOptions[value],
          swatch: PROJECT_COLOR_SWATCHES[value],
        })),
        onToggleValue: (value) =>
          setDraftFilters((prev) => ({
            ...prev,
            colors: toggleArrayItem(prev.colors, value as ProjectColorId),
          })),
      },
    ];
  }, [dictionary.projects, draftFilters]);

  const activeFilterPills = useMemo(() => {
    const pills: {
      readonly key: string;
      readonly label: string;
      readonly swatch?: string;
      readonly onRemove: () => void;
    }[] = [];

    sections.forEach((section) => {
      section.selectedValues.forEach((value) => {
        const option = section.options.find((opt) => opt.value === value);
        if (!option) return;
        pills.push({
          key: `${section.id}-${value}`,
          label: option.label,
          swatch: option.swatch,
          onRemove: () => section.onToggleValue(value),
        });
      });
    });

    return pills;
  }, [sections]);

  const handleClearAll = () => {
    setDraftFilters(EMPTY_PROJECT_FILTERS);
    onClear();
  };

  return (
    <motion.div
      ref={panelRef}
      id={id}
      role="dialog"
      data-scroll-lock-allow=""
      aria-label={dictionary.projects.filtersPanelTitle}
      variants={MOTION_VARIANTS.sheetFull}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="rasman-glass-sheet flex flex-col overflow-hidden border-t border-[var(--grid-line)]"
    >
      {/* Removable Active Filters Summary Bar */}
      <AnimatePresence initial={false}>
        {activeFilterPills.length > 0 && (
          <motion.div
            variants={MOTION_VARIANTS.sheetAuto}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="shrink-0 overflow-hidden border-b border-[var(--grid-line)]"
          >
            <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 desktop:px-6">
              <span className="text-[11px] font-medium text-[var(--ink-muted)]">
                {dictionary.projects.activeFiltersLabel}:
              </span>
              {activeFilterPills.map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={pill.onRemove}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-1.5 rounded-[3px] border border-[var(--grid-line)] bg-[var(--surface-hover)] px-2.5 py-1 text-[12px] font-medium transition-colors duration-150 hover:border-[var(--grid-line-strong)]',
                    modeAccentTextClass
                  )}
                >
                  {pill.swatch && (
                    <span
                      aria-hidden="true"
                      style={{ backgroundColor: pill.swatch }}
                      className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/15 dark:border-white/20"
                    />
                  )}
                  <span>{pill.label}</span>
                  <MdClose size={13} aria-hidden="true" className="opacity-75" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Accordion Grid (1 Column on Mobile | 2 Columns on Desktop) */}
      <div
        data-scroll-lock-allow=""
        className="min-h-0 flex-1 overflow-y-auto px-4 py-2 desktop:px-6 desktop:py-3"
      >
        <div className="grid grid-cols-1 divide-y divide-[var(--grid-line)] desktop:grid-cols-2 desktop:gap-x-8 desktop:divide-y-0">
          {sections.map((section) => {
            const isOpen = openAccordions.includes(section.id);
            const selectedCount = section.selectedValues.length;

            return (
              <div
                key={section.id}
                className="flex flex-col desktop:border-b desktop:border-[var(--grid-line)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleAccordion(section.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 py-3.5 text-start transition-colors duration-200 hover:text-[var(--ink-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-[14px] font-medium leading-none transition-colors duration-200',
                        selectedCount > 0
                          ? modeAccentTextClass
                          : 'text-[var(--ink-primary)]'
                      )}
                    >
                      {section.label}
                    </span>
                    {selectedCount > 0 && (
                      <span
                        dir="ltr"
                        className={cn(
                          'bidi-isolate text-[11px] font-medium tabular-nums',
                          modeAccentTextClass
                        )}
                      >
                        ({selectedCount})
                      </span>
                    )}
                  </span>

                  <MdKeyboardArrowDown
                    size={19}
                    aria-hidden="true"
                    className={cn(
                      'shrink-0 text-[var(--ink-muted)] transition-transform duration-300',
                      isOpen && 'rotate-180 text-[var(--ink-primary)]'
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      variants={MOTION_VARIANTS.sheetAuto}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 pb-4">
                        {section.options.map((option) => {
                          const isSelected = section.selectedValues.includes(
                            option.value
                          );
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() =>
                                section.onToggleValue(option.value)
                              }
                              className={cn(
                                'inline-flex cursor-pointer items-center gap-2 rounded-[3px] border px-3 py-1.5 text-[12px] font-medium transition-colors duration-200 desktop:text-[13px]',
                                isSelected
                                  ? cn(
                                      'border-current bg-[var(--surface-hover)]',
                                      modeAccentTextClass
                                    )
                                  : 'border-[var(--grid-line)] bg-transparent text-[var(--ink-secondary)] hover:border-[var(--grid-line-strong)] hover:text-[var(--ink-primary)]'
                              )}
                            >
                              {option.swatch && (
                                <span
                                  aria-hidden="true"
                                  style={{ backgroundColor: option.swatch }}
                                  className="h-3 w-3 shrink-0 rounded-full border border-black/15 dark:border-white/20"
                                />
                              )}
                              <span
                                dir={option.isLtr ? 'ltr' : undefined}
                                className={
                                  option.isLtr
                                    ? 'bidi-isolate tabular-nums'
                                    : undefined
                                }
                              >
                                {option.label}
                              </span>
                              {isSelected && (
                                <MdCheck
                                  size={14}
                                  aria-hidden="true"
                                  className="shrink-0"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Borderless Footer Actions: Charcoal (Light) / Pure White (Dark) Full-Radius Apply + Adjacent Circular Clear Icon Button */}
      <div className="flex shrink-0 items-center justify-end gap-2.5 px-4 pt-4 pb-2 desktop:px-6 desktop:py-5">
        <button
          type="button"
          onClick={() => onApply(draftFilters)}
          className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--grid-line-strong)] bg-[var(--btn-contrast-bg)] px-6 text-[13px] font-medium text-[var(--btn-contrast-ink)] transition-all duration-200 hover:bg-[var(--btn-contrast-hover)] active:scale-[0.99] desktop:flex-initial desktop:min-w-[184px]"
        >
          <span>{dictionary.projects.applyFiltersLabel}</span>
          <span dir="ltr" className="bidi-isolate tabular-nums opacity-75">
            ({previewCount})
          </span>
        </button>

        <button
          type="button"
          onClick={handleClearAll}
          disabled={isClearDisabled}
          aria-label={dictionary.projects.clearFiltersLabel}
          title={dictionary.projects.clearFiltersLabel}
          className={cn(
            'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--grid-line-strong)] bg-[var(--surface-hover)] transition-all duration-200',
            isClearDisabled
              ? 'cursor-not-allowed text-[var(--ink-muted)] opacity-40'
              : 'cursor-pointer text-[var(--ink-primary)] hover:border-[var(--ink-primary)] active:scale-[0.96]'
          )}
        >
          <MdRestartAlt size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Drag-Up Handle to Dismiss Mega Filter */}
      <div
        data-swipe-handle=""
        aria-hidden="true"
        className="flex h-6 w-full shrink-0 items-center justify-center pb-1 desktop:hidden"
      >
        <span className="block h-[3px] w-9 rounded-full bg-[var(--grid-crosshair)]" />
      </div>
    </motion.div>
  );
}
