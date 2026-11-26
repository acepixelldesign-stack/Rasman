'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  getProjectLocalizedText,
  PROJECT_MEDIA_CATEGORIES,
  type CategorizedProjectMedia,
  type ProjectMediaCategoryId,
} from '@/lib/data/projects';
import { useAppContext } from '@/components/providers/app-provider';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { cn } from '@/lib/utils';

export type LightboxMediaTab = ProjectMediaCategoryId;

interface ProjectMediaLightboxProps {
  readonly isOpen: boolean;
  readonly initialCategory?: ProjectMediaCategoryId;
  readonly initialImageId?: string;
  readonly items: readonly CategorizedProjectMedia[];
  readonly onClose: () => void;
}

/**
 * Fullscreen Categorized Architectural Media Lightbox:
 * - Organizes all project photography & technical drawings into clean categories
 *   (All / Exterior / Interior / Details / Drawings) with live item counts
 * - Locks background scroll while open and supports keyboard navigation (Escape, ArrowLeft/Right)
 * - Includes direct thumbnail filmstrip navigation across the active category
 */
export function ProjectMediaLightbox({
  isOpen,
  initialCategory = 'all',
  initialImageId,
  items,
  onClose,
}: ProjectMediaLightboxProps) {
  const { locale, isRtl, dictionary } = useAppContext();

  const availableCategories = useMemo(() => {
    const present = new Set(items.map((item) => item.category));
    return PROJECT_MEDIA_CATEGORIES.filter(
      (cat) => cat === 'all' || present.has(cat)
    );
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<ProjectMediaCategoryId>(
    () =>
      availableCategories.includes(initialCategory) ? initialCategory : 'all'
  );

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (!initialImageId) return 0;
    const initialList =
      initialCategory === 'all'
        ? items
        : items.filter((item) => item.category === initialCategory);
    const matchIndex = initialList.findIndex(
      (item) => item.id === initialImageId
    );
    return matchIndex >= 0 ? matchIndex : 0;
  });

  useBodyScrollLock(isOpen);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const categoryCounts = useMemo(() => {
    const counts: Record<ProjectMediaCategoryId, number> = {
      all: items.length,
      exterior: 0,
      interior: 0,
      details: 0,
      documents: 0,
    };
    for (const item of items) {
      counts[item.category] += 1;
    }
    return counts;
  }, [items]);

  const totalCount = filteredItems.length;
  const safeIndex =
    totalCount > 0 ? ((currentIndex % totalCount) + totalCount) % totalCount : 0;
  const activeItem = filteredItems[safeIndex];

  const handleStep = useCallback(
    (delta: number) => {
      if (totalCount <= 1) return;
      setCurrentIndex((prev) => (prev + delta + totalCount) % totalCount);
    },
    [totalCount]
  );

  const handleCategoryChange = (nextCategory: ProjectMediaCategoryId) => {
    if (nextCategory === activeCategory) return;
    setActiveCategory(nextCategory);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        handleStep(isRtl ? -1 : 1);
      } else if (event.key === 'ArrowLeft') {
        handleStep(isRtl ? 1 : -1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isRtl, handleStep, onClose]);

  return (
    <AnimatePresence>
      {isOpen && activeItem && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={dictionary.projects.detail.lightbox.dialogAriaLabel}
          data-smooth-prevent=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: SITE_CONFIG.motion.fastDuration,
            ease: SITE_CONFIG.motion.ease,
          }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/90 p-4 text-white backdrop-blur-md desktop:p-8"
        >
          {/* Backdrop Click Layer */}
          <button
            type="button"
            aria-label={dictionary.projects.detail.lightbox.closeAriaLabel}
            onClick={onClose}
            className="fixed inset-0 cursor-default"
          />

          {/* Top Bar: Counter | Categorized Segmented Tabs | Close */}
          <div className="relative z-10 flex w-full items-center justify-between gap-3">
            <span
              dir="ltr"
              className="bidi-isolate hidden min-w-[64px] text-[12px] font-medium tracking-[0.06em] text-white/65 tabular-nums desktop:inline-block"
            >
              {String(safeIndex + 1).padStart(2, '0')} /{' '}
              {String(totalCount).padStart(2, '0')}
            </span>

            {/* Categorized Media Tabs (Scrollable on Mobile, Centered on Desktop) */}
            <div className="no-scrollbar flex min-w-0 flex-1 justify-start overflow-x-auto desktop:justify-center">
              <div
                role="tablist"
                aria-label={
                  dictionary.projects.detail.lightbox.categoriesAriaLabel
                }
                className="inline-flex shrink-0 items-center rounded-full bg-white/12 p-1 backdrop-blur-xl backdrop-saturate-150 [transform:translateZ(0)]"
              >
                {availableCategories.map((category) => {
                  const isSelected = activeCategory === category;
                  const count = categoryCounts[category];
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => handleCategoryChange(category)}
                      className={cn(
                        'relative inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-[12px] leading-none font-medium whitespace-nowrap transition-colors duration-250 desktop:px-3.5',
                        isSelected
                          ? 'text-black'
                          : 'text-white/75 hover:text-white'
                      )}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="lightbox-category-thumb"
                          transition={{
                            duration: 0.42,
                            ease: SITE_CONFIG.motion.ease,
                          }}
                          className="absolute inset-0 rounded-full bg-white"
                        />
                      )}
                      <span className="relative z-10">
                        {dictionary.projects.detail.lightbox.tabs[category]}
                      </span>
                      <span
                        dir="ltr"
                        className={cn(
                          'bidi-isolate relative z-10 text-[11px] tabular-nums',
                          isSelected ? 'text-black/65' : 'text-white/45'
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex min-w-[40px] shrink-0 justify-end desktop:min-w-[64px]">
              <button
                type="button"
                onClick={onClose}
                aria-label={dictionary.projects.detail.lightbox.closeAriaLabel}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors duration-250 hover:bg-white/24 [transform:translateZ(0)]"
              >
                <MdClose size={20} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Center Stage Canvas + Side Navigation Buttons */}
          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-4 desktop:px-16">
            {totalCount > 1 && (
              <button
                type="button"
                onClick={() => handleStep(isRtl ? 1 : -1)}
                aria-label={
                  isRtl
                    ? dictionary.projects.detail.lightbox.nextAriaLabel
                    : dictionary.projects.detail.lightbox.prevAriaLabel
                }
                className="hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25 hover:text-white desktop:absolute desktop:start-2 desktop:inline-flex"
              >
                {isRtl ? (
                  <MdChevronRight size={24} aria-hidden="true" />
                ) : (
                  <MdChevronLeft size={24} aria-hidden="true" />
                )}
              </button>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeCategory}-${activeItem.id}`}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{
                  duration: SITE_CONFIG.motion.fastDuration,
                  ease: SITE_CONFIG.motion.ease,
                }}
                className="relative h-full max-h-[64dvh] w-full max-w-5xl overflow-hidden rounded-[4px]"
              >
                <Image
                  src={activeItem.image}
                  alt={getProjectLocalizedText(activeItem.alt, locale)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 95vw, 1024px"
                  referrerPolicy="no-referrer"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {totalCount > 1 && (
              <button
                type="button"
                onClick={() => handleStep(isRtl ? -1 : 1)}
                aria-label={
                  isRtl
                    ? dictionary.projects.detail.lightbox.prevAriaLabel
                    : dictionary.projects.detail.lightbox.nextAriaLabel
                }
                className="hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25 hover:text-white desktop:absolute desktop:end-2 desktop:inline-flex"
              >
                {isRtl ? (
                  <MdChevronLeft size={24} aria-hidden="true" />
                ) : (
                  <MdChevronRight size={24} aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          {/* Bottom Bar: Category Tag + Caption + Thumbnail Filmstrip + Mobile Controls */}
          <div className="relative z-10 flex w-full flex-col items-center gap-3 pb-1">
            <div className="flex max-w-2xl flex-wrap items-center justify-center gap-2 text-center">
              <span className="rounded-[4px] bg-white/12 px-2 py-0.5 text-[11px] font-medium text-white/85">
                {dictionary.projects.detail.lightbox.tabs[activeItem.category]}
              </span>
              <p className="text-[12px] leading-[1.6] text-white/75 desktop:text-[13px]">
                {getProjectLocalizedText(activeItem.caption, locale)}
              </p>
            </div>

            <div className="flex w-full max-w-3xl items-center justify-center gap-3">
              {totalCount > 1 && (
                <button
                  type="button"
                  onClick={() => handleStep(isRtl ? 1 : -1)}
                  aria-label={
                    isRtl
                      ? dictionary.projects.detail.lightbox.nextAriaLabel
                      : dictionary.projects.detail.lightbox.prevAriaLabel
                  }
                  className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white transition-colors duration-200 hover:bg-white/25 hover:text-white desktop:hidden"
                >
                  {isRtl ? (
                    <MdChevronRight size={20} aria-hidden="true" />
                  ) : (
                    <MdChevronLeft size={20} aria-hidden="true" />
                  )}
                </button>
              )}

              {/* Categorized Thumbnail Strip */}
              <div className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto px-1 py-1">
                {filteredItems.map((item, index) => {
                  const isActiveThumb = index === safeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      aria-label={getProjectLocalizedText(item.alt, locale)}
                      aria-current={isActiveThumb ? 'true' : undefined}
                      className={cn(
                        'relative h-11 w-16 shrink-0 cursor-pointer overflow-hidden rounded-[4px] transition-all duration-200 desktop:h-12 desktop:w-20',
                        isActiveThumb
                          ? 'opacity-100 ring-2 ring-white'
                          : 'opacity-45 hover:opacity-80'
                      )}
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="80px"
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {totalCount > 1 && (
                <button
                  type="button"
                  onClick={() => handleStep(isRtl ? -1 : 1)}
                  aria-label={
                    isRtl
                      ? dictionary.projects.detail.lightbox.prevAriaLabel
                      : dictionary.projects.detail.lightbox.nextAriaLabel
                  }
                  className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white transition-colors duration-200 hover:bg-white/25 hover:text-white desktop:hidden"
                >
                  {isRtl ? (
                    <MdChevronLeft size={20} aria-hidden="true" />
                  ) : (
                    <MdChevronRight size={20} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
