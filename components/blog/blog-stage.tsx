'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
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
import { cn } from '@/lib/utils';

/**
 * Primary Blog / Magazine Architectural Stage:
 * - Calm Framer Motion staggered category drawer on mobile & staggered card entrance
 * - GSAP hierarchical entrance for sidebar items & stage structure
 */
export function BlogStage() {
  const { locale, isRtl, dictionary } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<BlogCategoryId>('all');
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const mobileCategoriesPanelId = useId();
  const stageRef = useRef<HTMLElement>(null);

  useArchitecturalEntrance(stageRef, { isRtl });

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

  const handleSelectMobileCategory = (categoryId: BlogCategoryId) => {
    setActiveCategory(categoryId);
    setIsMobileCategoriesOpen(false);
  };

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
                          onClick={() => handleSelectMobileCategory(category.id)}
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
          onSelectCategory={setActiveCategory}
        />
      </div>

      {/* End Main Blog Stories Feed (Staggered Calm Entrance) */}
      <SmoothVerticalPane className="flex min-w-0 flex-1 flex-col bg-[var(--bg-canvas)] desktop:h-full desktop:overflow-y-auto">
        <div className="w-full px-4 desktop:px-8">
          <AnimatePresence mode="wait" initial={false}>
            {filteredPosts.length > 0 ? (
              <motion.ul
                key={activeCategory}
                variants={CARD_STAGGER_CONTAINER_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col divide-y divide-[var(--grid-line)]"
              >
                {filteredPosts.map((post, idx) => (
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
                  onClick={() => setActiveCategory('all')}
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
      </SmoothVerticalPane>
    </section>
  );
}
