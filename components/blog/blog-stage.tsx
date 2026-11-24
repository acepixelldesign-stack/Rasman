'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MdArrowBack,
  MdArrowForward,
  MdKeyboardArrowDown,
} from 'react-icons/md';
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  getBlogLocalizedText,
  type BlogCategoryId,
} from '@/lib/data/blog';
import { useAppContext } from '@/components/providers/app-provider';
import {
  ARCHITECTURAL_EASE,
  CARD_STAGGER_CONTAINER_VARIANTS,
  CARD_STAGGER_ITEM_VARIANTS,
  MENU_LIST_VARIANTS,
  createMenuItemVariants,
  useArchitecturalEntrance,
} from '@/components/motion/architectural-motion';
import { BlogSidebar } from '@/components/blog/blog-sidebar';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogCategoryIcon } from '@/components/blog/blog-category-icon';
import { SmoothVerticalPane } from '@/components/providers/smooth-vertical-pane';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { cn } from '@/lib/utils';

const POSTS_PER_PAGE = 3;

/**
 * Primary Blog / Magazine Architectural Stage:
 * - Calm Framer Motion staggered category drawer on mobile & staggered card entrance
 * - Architectural pagination anchored cleanly after the last blog card in the feed
 *   with 16px (p-4) padding on Previous and Next controls
 */
export function BlogStage() {
  const { locale, isRtl, dictionary } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<BlogCategoryId>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const mobileCategoriesPanelId = useId();
  const stageRef = useRef<HTMLElement>(null);
  const feedTopRef = useRef<HTMLDivElement>(null);

  useArchitecturalEntrance(stageRef, { isRtl });
  useBodyScrollLock(isMobileCategoriesOpen);

  const mobileCategoryItemVariants = useMemo(
    () => createMenuItemVariants(isRtl),
    [isRtl]
  );

  useEffect(() => {
    if (!isMobileCategoriesOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileCategoriesOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileCategoriesOpen]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return BLOG_POSTS;
    return BLOG_POSTS.filter((post) => post.categoryId === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const startIndex = (safePage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, safePage]);

  const scrollFeedToTop = () => {
    if (typeof window === 'undefined') return;
    const desktopPane = feedTopRef.current?.closest(
      '[data-smooth-pane="vertical"]'
    );
    if (desktopPane instanceof HTMLElement && desktopPane.scrollTop > 0) {
      desktopPane.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (categoryId: BlogCategoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
    scrollFeedToTop();
  };

  const handleSelectMobileCategory = (categoryId: BlogCategoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
    setIsMobileCategoriesOpen(false);
    scrollFeedToTop();
  };

  const handlePageChange = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    if (clamped === safePage) return;
    setCurrentPage(clamped);
    scrollFeedToTop();
  };

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  return (
    <section
      ref={stageRef}
      aria-label={dictionary.blog.regionAriaLabel}
      className="relative flex min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col pt-12 desktop:h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] desktop:flex-row desktop:overflow-hidden desktop:pt-0"
    >
      {/* Mobile Fixed Category Bar + Full-Height Calm Vertical Sliding Sheet */}
      <div
        className={cn(
          'fixed top-[var(--grid-header)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-[34]',
          'flex flex-col bg-[var(--bg-header-glass)] backdrop-blur-xl backdrop-saturate-150 [transform:translateZ(0)] transition-colors duration-200 desktop:hidden',
          !isMobileCategoriesOpen && 'border-b border-[var(--grid-line)]'
        )}
      >
        <button
          type="button"
          onClick={() => setIsMobileCategoriesOpen((prev) => !prev)}
          aria-expanded={isMobileCategoriesOpen}
          aria-controls={mobileCategoriesPanelId}
          aria-label={
            isMobileCategoriesOpen
              ? dictionary.blog.closeCategoriesAriaLabel
              : dictionary.blog.openCategoriesAriaLabel
          }
          className={cn(
            'flex h-12 w-full shrink-0 cursor-pointer items-center justify-between gap-3 px-4 text-start',
            'text-[15px] font-normal text-[var(--ink-primary)]'
          )}
        >
          <span className="flex items-center gap-2.5">
            <BlogCategoryIcon
              categoryId={activeCategory}
              size={19}
              className="shrink-0 text-[var(--ink-primary)]"
            />
            <span>{dictionary.blog.categoryTitle}</span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-muted)] transition-transform duration-350',
              isMobileCategoriesOpen && 'rotate-180'
            )}
          >
            <MdKeyboardArrowDown size={20} />
          </span>
        </button>

        {/* Bottom Left & Right Frame Rail Intersection '+' Crosshairs (Matching Header) */}
        {!isMobileCategoriesOpen && (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[6px] -start-[7px] z-[35] block h-[13px] w-[13px]"
            >
              <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[6px] -end-[7px] z-[35] block h-[13px] w-[13px]"
            >
              <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            </span>
          </>
        )}

        <AnimatePresence initial={false}>
          {isMobileCategoriesOpen && (
            <motion.div
              id={mobileCategoriesPanelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height:
                  'calc(100dvh - var(--grid-header) - var(--grid-bottom) - 48px)',
                opacity: 1,
                transition: {
                  height: { duration: 0.48, ease: ARCHITECTURAL_EASE },
                  opacity: { duration: 0.36, ease: ARCHITECTURAL_EASE },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.36, ease: ARCHITECTURAL_EASE },
                  opacity: { duration: 0.24, ease: ARCHITECTURAL_EASE },
                },
              }}
              className="flex flex-col overflow-hidden"
            >
              <div data-scroll-lock-allow="" className="flex min-h-0 flex-1 flex-col">
                <SmoothVerticalPane className="flex-1 overflow-y-auto px-4 pt-2 pb-6">
                <motion.ul
                  variants={MENU_LIST_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col divide-y divide-[var(--grid-line)]"
                >
                  {BLOG_CATEGORIES.map((category) => {
                    const isActive = category.id === activeCategory;
                    const label = getBlogLocalizedText(category.label, locale);

                    return (
                      <motion.li
                        key={category.id}
                        variants={mobileCategoryItemVariants}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectMobileCategory(category.id)
                          }
                          aria-current={isActive ? 'true' : undefined}
                          className={cn(
                            'group flex w-full cursor-pointer items-center gap-3.5 py-4 text-start transition-colors duration-250',
                            'hover:text-[var(--brand-text-hover)] focus-visible:text-[var(--brand-text-hover)]',
                            isActive
                              ? 'font-medium text-[var(--brand-text-hover)]'
                              : 'font-normal text-[var(--ink-primary)]'
                          )}
                        >
                          <BlogCategoryIcon
                            categoryId={category.id}
                            size={20}
                            className={cn(
                              'shrink-0 transition-colors duration-250',
                              isActive
                                ? 'text-[var(--brand-text-hover)]'
                                : 'text-[var(--ink-muted)] group-hover:text-[var(--brand-text-hover)]'
                            )}
                          />
                          <span className="text-[16px] leading-[1.35] tracking-[-0.01em] rtl:leading-[1.55] rtl:tracking-normal">
                            {label}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </SmoothVerticalPane>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Docked Start Category Sidebar */}
      <div
        data-gsap="kicker"
        className="hidden w-[264px] shrink-0 border-e border-[var(--grid-line)] desktop:block desktop-wide:w-[304px]"
      >
        <BlogSidebar
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* End Main Blog Stories Feed (Staggered Calm Entrance + Bottom Pagination) */}
      <SmoothVerticalPane className="flex min-w-0 flex-1 flex-col bg-[var(--bg-canvas)] desktop:h-full desktop:overflow-y-auto">
        <div
          ref={feedTopRef}
          className="flex min-h-full w-full flex-col justify-between"
        >
          <div className="w-full px-4 desktop:px-8">
            <AnimatePresence mode="wait" initial={false}>
              {paginatedPosts.length > 0 ? (
                <motion.ul
                  key={`${activeCategory}-page-${safePage}`}
                  variants={CARD_STAGGER_CONTAINER_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col divide-y divide-[var(--grid-line)]"
                >
                  {paginatedPosts.map((post, idx) => (
                    <motion.li
                      key={post.slug}
                      variants={CARD_STAGGER_ITEM_VARIANTS}
                    >
                      <BlogCard post={post} priority={idx < 2} />
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  key="blog-empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.42,
                    ease: ARCHITECTURAL_EASE,
                  }}
                  className="flex flex-col items-start gap-4 py-16"
                >
                  <p className="text-[16px] text-[var(--ink-secondary)]">
                    {dictionary.blog.emptyTitle}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className={cn(
                      'inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-5',
                      'bg-[var(--brand-primary)] text-[14px] font-medium text-[var(--brand-ink-on-primary)]',
                      'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)]'
                    )}
                  >
                    {dictionary.blog.emptyResetLabel}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Architectural Pagination at End of Blog List (16px Padding on Prev/Next Buttons) */}
          {filteredPosts.length > 0 && (
            <nav
              aria-label={dictionary.blog.paginationAriaLabel}
              className="mt-4 flex w-full items-center justify-between border-t border-[var(--grid-line)] bg-[var(--bg-canvas)]"
            >
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => handlePageChange(safePage - 1)}
                className={cn(
                  'group inline-flex cursor-pointer items-center gap-2.5 border-e border-[var(--grid-line)] p-4 text-start text-[13px] font-medium transition-colors duration-200 desktop:text-[14px]',
                  safePage <= 1
                    ? 'cursor-not-allowed text-[var(--ink-muted)] opacity-45'
                    : 'text-[var(--ink-primary)] hover:bg-[var(--surface-hover)] hover:text-[var(--brand-text-hover)]'
                )}
              >
                <MdArrowBack
                  size={18}
                  aria-hidden="true"
                  className={cn('shrink-0', isRtl && '-scale-x-100')}
                />
                <span>{dictionary.blog.previousPageLabel}</span>
              </button>

              <div className="flex items-center justify-center gap-1 px-2">
                {pageNumbers.map((pageNum) => {
                  const isCurrent = pageNum === safePage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      aria-current={isCurrent ? 'page' : undefined}
                      aria-label={`${dictionary.blog.pageAriaLabel} ${pageNum}`}
                      className={cn(
                        'inline-flex h-9 w-9 cursor-pointer items-center justify-center text-[13px] tabular-nums transition-colors duration-200 desktop:text-[14px]',
                        isCurrent
                          ? 'font-medium text-[var(--brand-text-hover)]'
                          : 'font-normal text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                      )}
                    >
                      <span dir="ltr" className="bidi-isolate">
                        {pageNum}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => handlePageChange(safePage + 1)}
                className={cn(
                  'group inline-flex cursor-pointer items-center gap-2.5 border-s border-[var(--grid-line)] p-4 text-end text-[13px] font-medium transition-colors duration-200 desktop:text-[14px]',
                  safePage >= totalPages
                    ? 'cursor-not-allowed text-[var(--ink-muted)] opacity-45'
                    : 'text-[var(--ink-primary)] hover:bg-[var(--surface-hover)] hover:text-[var(--brand-text-hover)]'
                )}
              >
                <span>{dictionary.blog.nextPageLabel}</span>
                <MdArrowForward
                  size={18}
                  aria-hidden="true"
                  className={cn('shrink-0', isRtl && '-scale-x-100')}
                />
              </button>
            </nav>
          )}
        </div>
      </SmoothVerticalPane>
    </section>
  );
}
