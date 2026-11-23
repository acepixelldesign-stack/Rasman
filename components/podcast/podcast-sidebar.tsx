'use client';

import Image from 'next/image';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
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
  readonly hasSelectedCategory: boolean;
  readonly isCategoryOpen: boolean;
  readonly episodes: readonly PodcastEpisode[];
  readonly activeEpisodeId: string;
  readonly onToggleCategoryOpen: () => void;
  readonly onSelectCategory: (categoryId: PodcastCategoryId) => void;
  readonly onSelectEpisode: (episodeId: string) => void;
  readonly className?: string;
}

const CATEGORY_LIST_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.23,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const CATEGORY_ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: SITE_CONFIG.motion.ease,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.32,
      ease: SITE_CONFIG.motion.ease,
    },
  },
};

/**
 * Desktop docked podcast architectural sidebar:
 * - 16px side padding on category dropdown header; label updates to active category on selection
 * - 2.00s top-to-bottom sliding reveal with staggered categories; 1.00s upward collapse on selection
 * - 24px horizontal list padding, 14px episode titles, zero subtitles, zero duplicate category heading
 */
export function PodcastSidebar({
  activeCategory,
  hasSelectedCategory,
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

  const headerLabel = hasSelectedCategory
    ? getLocalizedText(activeCategoryObj.label, locale)
    : dictionary.podcast.categoryTitle;

  return (
    <aside
      aria-label={dictionary.podcast.sidebarAriaLabel}
      className={cn(
        'flex h-full w-full flex-col bg-[var(--bg-canvas)]',
        className
      )}
    >
      {/* Category Dropdown Header Row (16px horizontal padding, bottom divider hides when open) */}
      <div
        data-podcast-anim="sidebar-header"
        className={cn(
          'flex shrink-0 items-center justify-between gap-2 border-b px-4 py-4 transition-colors duration-300',
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
            'flex flex-1 cursor-pointer items-center justify-between gap-3 text-start',
            'text-[20px] font-normal leading-[1.25] tracking-[-0.015em] text-[var(--ink-primary)] desktop:text-[22px]',
            'rtl:leading-[1.4] rtl:tracking-normal'
          )}
        >
          <span className="truncate">{headerLabel}</span>
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{ rotate: isCategoryOpen ? 180 : 0 }}
            transition={{
              duration: 0.65,
              ease: SITE_CONFIG.motion.ease,
            }}
            className="inline-flex shrink-0 items-center justify-center text-[var(--ink-muted)]"
          >
            <MdKeyboardArrowDown size={22} />
          </motion.span>
        </button>
      </div>

      {/* Vertical Sliding Body: Categories List (2s open / 1s collapse) OR Episodes (24px side padding) */}
      <SmoothVerticalPane className="flex-1 overflow-y-auto px-6 pb-4">
        <AnimatePresence mode="wait" initial={false}>
          {isCategoryOpen ? (
            <motion.div
              key="category-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: { duration: 0.9, ease: SITE_CONFIG.motion.ease },
                  opacity: { duration: 0.5, ease: SITE_CONFIG.motion.ease },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 1.0, ease: SITE_CONFIG.motion.ease },
                  opacity: { duration: 0.7, ease: SITE_CONFIG.motion.ease },
                },
              }}
              className="overflow-hidden"
            >
              <motion.ul
                variants={CATEGORY_LIST_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-start gap-3 pt-1 pb-2"
              >
                {PODCAST_CATEGORIES.map((category) => {
                  const isActive = category.id === activeCategory;
                  return (
                    <motion.li
                      key={category.id}
                      variants={CATEGORY_ITEM_VARIANTS}
                      className="w-full"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectCategory(category.id)}
                        className={cn(
                          'w-full cursor-pointer py-1 text-start text-[19px] leading-[1.35] tracking-[-0.015em] desktop:text-[21px]',
                          'rtl:leading-[1.5] rtl:tracking-normal transition-colors duration-300',
                          'hover:text-[var(--brand-text-hover)] focus-visible:text-[var(--brand-text-hover)]',
                          isActive
                            ? 'font-normal text-[var(--brand-text-hover)]'
                            : 'font-light text-[var(--ink-primary)]'
                        )}
                      >
                        {getLocalizedText(category.label, locale)}
                      </button>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </motion.div>
          ) : (
            <motion.div
              key="episode-sidebar-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: {
                    duration: SITE_CONFIG.motion.standardDuration,
                    ease: SITE_CONFIG.motion.ease,
                  },
                  opacity: {
                    duration: SITE_CONFIG.motion.standardDuration,
                    ease: SITE_CONFIG.motion.ease,
                  },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    duration: SITE_CONFIG.motion.fastDuration,
                    ease: SITE_CONFIG.motion.ease,
                  },
                  opacity: {
                    duration: SITE_CONFIG.motion.fastDuration,
                    ease: SITE_CONFIG.motion.ease,
                  },
                },
              }}
              className="flex flex-col overflow-hidden pt-4"
            >
              <ul className="flex flex-col divide-y divide-[var(--grid-line)]">
                {episodes.map((episode) => {
                  const isSelected = episode.id === activeEpisodeId;
                  const title = getLocalizedText(episode.title, locale);

                  return (
                    <li
                      key={episode.id}
                      data-podcast-anim="sidebar-item"
                      className="py-3.5 first:pt-1"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectEpisode(episode.id)}
                        aria-current={isSelected ? 'true' : undefined}
                        className="group flex w-full cursor-pointer items-center gap-3.5 text-start"
                      >
                        <span
                          className={cn(
                            'relative h-14 w-14 shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)]',
                            'ring-1 transition-all duration-300',
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

                        <span className="flex min-w-0 flex-1 items-center">
                          <span
                            className={cn(
                              'line-clamp-2 text-[14px] leading-[1.4] transition-colors duration-300',
                              'group-hover:text-[var(--brand-text-hover)]',
                              isSelected
                                ? 'font-medium text-[var(--brand-text-hover)]'
                                : 'font-normal text-[var(--ink-primary)]'
                            )}
                          >
                            {title}
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
