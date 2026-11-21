'use client';

import {
  BLOG_CATEGORIES,
  getBlogLocalizedText,
  type BlogCategoryId,
} from '@/lib/data/blog';
import { useAppContext } from '@/components/providers/app-provider';
import { BlogCategoryIcon } from '@/components/blog/blog-category-icon';
import { cn } from '@/lib/utils';

interface BlogSidebarProps {
  readonly activeCategory: BlogCategoryId;
  readonly onSelectCategory: (categoryId: BlogCategoryId) => void;
  readonly className?: string;
}

/**
 * Desktop docked architectural blog category sidebar:
 * - Mirrors the Podcast sidebar geometry and pure white/black canvas
 * - Displays ONLY Icon + Category Title (no descriptions, no article counts, no boxed cards)
 * - Active and hovered categories resolve to the Rasman Olivine brand hue
 */
export function BlogSidebar({
  activeCategory,
  onSelectCategory,
  className,
}: BlogSidebarProps) {
  const { locale, dictionary } = useAppContext();

  return (
    <aside
      aria-label={dictionary.blog.sidebarAriaLabel}
      className={cn(
        'flex h-full w-full flex-col bg-[var(--bg-canvas)]',
        className
      )}
    >
      <nav
        aria-label={dictionary.blog.categoriesAriaLabel}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        <ul className="flex flex-col divide-y divide-[var(--grid-line)]">
          {BLOG_CATEGORIES.map((category) => {
            const isActive = category.id === activeCategory;
            const label = getBlogLocalizedText(category.label, locale);

            return (
              <li key={category.id} className="first:pt-0">
                <button
                  type="button"
                  onClick={() => onSelectCategory(category.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'group flex w-full cursor-pointer items-center gap-3.5 py-4 text-start transition-colors duration-200',
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
                      'shrink-0 transition-colors duration-200',
                      isActive
                        ? 'text-[var(--brand-text-hover)]'
                        : 'text-[var(--ink-muted)] group-hover:text-[var(--brand-text-hover)]'
                    )}
                  />
                  <span className="text-[16px] leading-[1.35] tracking-[-0.01em] rtl:leading-[1.55] rtl:tracking-normal">
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
