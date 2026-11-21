'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { MdAdd, MdRemove } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  PODCAST_CATEGORIES,
  getLocalizedText,
  type PodcastCategoryId,
  type PodcastEpisode,
} from '@/lib/data/podcasts';
import { useAppContext } from '@/components/providers/app-provider';
import { SmoothVerticalPane } from '@/components/providers/smooth-vertical-pane';
import { cn } from '@/lib/utils';

interface PodcastSidebarProps {
  readonly activeCategory: PodcastCategoryId;
  readonly isCategoryOpen: boolean;
  readonly episodes: readonly PodcastEpisode[];
  readonly activeEpisodeId: string;
  readonly onToggleCategoryOpen: () => void;
  readonly onSelectCategory: (categoryId: PodcastCategoryId) => void;
  readonly onSelectEpisode: (episodeId: string) => void;
  readonly className?: string;
}

/**
 * Desktop docked podcast architectural sidebar:
 * - 'category' heading stays neutral ink (never turns green/colored)
 * - Subtle muted gray (+ / -) accordion icon
 * - Full-width bottom divider beneath 'category' hides cleanly when categories slide open
 * - Pure vertical sliding open/close animation for the categories list directly underneath
 */
export function PodcastSidebar({
  activeCategory,
  isCategoryOpen,
  episodes,
  activeEpisodeId,
  onToggleCategoryOpen,
  onSelectCategory,
  onSelectEpisode,
  className,
}: PodcastSidebarProps) {
  const { locale, dictionary } = useAppContext();

  const activeCategoryObj =
    PODCAST_CATEGORIES.find((cat) => cat.id === activeCategory) ??
    PODCAST_CATEGORIES[0];

  return (
    <aside
      aria-label={dictionary.podcast.sidebarAriaLabel}
      className={cn(
        'flex h-full w-full flex-col bg-[var(--bg-canvas)]',
        className
      )}
    >
      {/* Category Header Row (Divider disappears when categories open; text never turns green) */}
      <div
        className={cn(
          'flex shrink-0 items-center justify-between gap-2 border-b px-6 py-4 transition-colors duration-200',
          isCategoryOpen ? 'border-transparent' : 'border-[var(--grid-line)]'
        )}
      >
        <button
          type="button"
          onClick={onToggleCategoryOpen}
          aria-expanded={isCategoryOpen}
          aria-label={
            isCategoryOpen
              ? dictionary.podcast.closeCategoriesAriaLabel
              : dictionary.podcast.openCategoriesAriaLabel
          }
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-between text-start',
            'text-[22px] font-normal leading-[1.2] tracking-[-0.015em] text-[var(--ink-primary)] desktop:text-[24px]',
            'rtl:leading-[1.35] rtl:tracking-normal'
          )}
        >
          <span>{dictionary.podcast.categoryTitle}</span>
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-muted)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isCategoryOpen ? (
                <motion.span
                  key="minus"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{
                    duration: SITE_CONFIG.motion.fastDuration,
                    ease: SITE_CONFIG.motion.ease,
                  }}
                  className="flex items-center justify-center"
                >
                  <MdRemove size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{
                    duration: SITE_CONFIG.motion.fastDuration,
                    ease: SITE_CONFIG.motion.ease,
                  }}
                  className="flex items-center justify-center"
                >
                  <MdAdd size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>
      </div>

      {/* Vertical Sliding Body: Categories List (Open) OR Active Category Name + Episodes (Closed) */}
      <SmoothVerticalPane className="flex-1 overflow-y-auto px-6 pb-4">
        <AnimatePresence mode="wait" initial={false}>
          {isCategoryOpen ? (
            <motion.div
              key="category-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: SITE_CONFIG.motion.standardDuration,
                ease: SITE_CONFIG.motion.ease,
              }}
              className="overflow-hidden"
            >
              <ul className="flex flex-col items-start gap-3 pt-1 pb-2">
                {PODCAST_CATEGORIES.map((category) => {
                  const isActive = category.id === activeCategory;
                  return (
                    <li key={category.id} className="w-full">
                      <button
                        type="button"
                        onClick={() => onSelectCategory(category.id)}
                        className={cn(
                          'w-full cursor-pointer py-1 text-start text-[20px] leading-[1.35] tracking-[-0.015em] desktop:text-[22px]',
                          'rtl:leading-[1.5] rtl:tracking-normal transition-colors duration-200',
                          'hover:text-[var(--brand-text-hover)] focus-visible:text-[var(--brand-text-hover)]',
                          isActive
                            ? 'font-normal text-[var(--brand-text-hover)]'
                            : 'font-light text-[var(--ink-primary)]'
                        )}
                      >
                        {getLocalizedText(category.label, locale)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="episode-sidebar-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: SITE_CONFIG.motion.standardDuration,
                ease: SITE_CONFIG.motion.ease,
              }}
              className="flex flex-col overflow-hidden pt-4"
            >
              {/* Active Category Name directly beneath the full divider */}
              <p className="pb-3.5 text-[15px] font-normal text-[var(--ink-primary)]">
                {getLocalizedText(activeCategoryObj.label, locale)}
              </p>

              <ul className="flex flex-col divide-y divide-[var(--grid-line)]">
                {episodes.map((episode) => {
                  const isSelected = episode.id === activeEpisodeId;
                  const title = getLocalizedText(episode.title, locale);
                  const subtitle = getLocalizedText(episode.subtitle, locale);

                  return (
                    <li key={episode.id} className="py-3.5 first:pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectEpisode(episode.id)}
                        aria-current={isSelected ? 'true' : undefined}
                        className="group flex w-full cursor-pointer items-center gap-3.5 text-start"
                      >
                        <span
                          className={cn(
                            'relative h-14 w-14 shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)]',
                            'ring-1 transition-all duration-200',
                            isSelected
                              ? 'ring-[var(--brand-primary)]'
                              : 'ring-transparent group-hover:ring-[var(--brand-primary)]'
                          )}
                        >
                          <Image
                            src={episode.coverImage}
                            alt={getLocalizedText(episode.coverAlt, locale)}
                            fill
                            loading="lazy"
                            sizes="56px"
                            referrerPolicy="no-referrer"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </span>

                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                          <span
                            className={cn(
                              'line-clamp-2 text-[13px] leading-[1.35] transition-colors duration-200',
                              'group-hover:text-[var(--brand-text-hover)]',
                              isSelected
                                ? 'font-medium text-[var(--brand-text-hover)]'
                                : 'font-normal text-[var(--ink-primary)]'
                            )}
                          >
                            {title}
                          </span>
                          <span className="line-clamp-1 text-[11px] text-[var(--ink-muted)]">
                            {subtitle}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </SmoothVerticalPane>
    </aside>
  );
}
