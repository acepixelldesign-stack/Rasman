'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  getBlogCategoryById,
  getBlogLocalizedText,
  type BlogPost,
} from '@/lib/data/blog';
import { useAppContext } from '@/components/providers/app-provider';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  readonly post: BlogPost;
  readonly priority?: boolean;
}

/**
 * Full-width architectural editorial blog row with smooth lazy image dissolve
 */
export function BlogCard({ post, priority = false }: BlogCardProps) {
  const { locale, dictionary } = useAppContext();

  const category = getBlogCategoryById(post.categoryId);
  const title = getBlogLocalizedText(post.title, locale);
  const excerpt = getBlogLocalizedText(post.excerpt, locale);
  const monthLabel = getBlogLocalizedText(post.monthLabel, locale);
  const authorName = getBlogLocalizedText(post.author.name, locale);
  const categoryLabel = getBlogLocalizedText(category.label, locale);
  const coverAlt = getBlogLocalizedText(post.coverAlt, locale);

  return (
    <article className="py-6 desktop:py-8">
      <Link
        href={`/magazine/${post.slug}`}
        className="group flex flex-col-reverse justify-between gap-5 desktop:flex-row desktop:items-stretch desktop:gap-8"
      >
        {/* Start Column: Date Stamp + Editorial Text Stack */}
        <div className="flex min-w-0 flex-1 items-start gap-4 desktop:gap-6">
          {/* Calendar Date Stamp (4px border radius) */}
          <time
            dateTime={post.isoDate}
            className={cn(
              'flex h-[54px] w-[50px] shrink-0 flex-col overflow-hidden rounded-[4px]',
              'border border-[var(--grid-line-strong)] bg-[var(--bg-canvas)] text-center'
            )}
          >
            <span className="flex h-[20px] items-center justify-center border-b border-[var(--grid-line)] bg-[var(--surface-hover)] text-[11px] font-medium leading-none text-[var(--ink-secondary)]">
              {monthLabel}
            </span>
            <span
              dir="ltr"
              className="bidi-isolate flex flex-1 items-center justify-center text-[15px] font-normal leading-none tabular-nums text-[var(--ink-secondary)]"
            >
              {post.dayNumber}
            </span>
          </time>

          {/* Title, Excerpt & Meta Footer */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
            <div className="flex flex-col gap-2">
              <h2
                className={cn(
                  'text-[18px] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--ink-primary)] desktop:text-[22px]',
                  'rtl:leading-[1.5] rtl:tracking-normal',
                  'transition-colors duration-250 group-hover:text-[var(--brand-text-hover)]'
                )}
              >
                {title}
              </h2>

              <p className="line-clamp-2 max-w-2xl text-[14px] font-normal leading-[1.6] text-[var(--ink-secondary)] rtl:leading-[1.8]">
                {excerpt}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-[12px] text-[var(--ink-muted)] tabular-nums desktop:text-[13px]">
              <span>
                {dictionary.blog.byPrefix}{' '}
                <span className="text-[var(--ink-secondary)]">{authorName}</span>
              </span>
              <span aria-hidden="true" className="text-[var(--grid-line-strong)]">
                /
              </span>
              <span className="text-[var(--ink-secondary)]">{categoryLabel}</span>
              <span aria-hidden="true" className="text-[var(--grid-line-strong)]">
                /
              </span>
              <span>
                <span dir="ltr" className="bidi-isolate">
                  {post.readMinutes}
                </span>{' '}
                {dictionary.blog.minReadSuffix}
              </span>
            </div>
          </div>
        </div>

        {/* End Column: Square Editorial Thumbnail (4px border radius, lazy-loaded) */}
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] desktop:h-[164px] desktop:w-[164px]">
          <Image
            src={post.coverImage}
            alt={coverAlt}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            sizes="(max-width: 640px) 100vw, 164px"
            referrerPolicy="no-referrer"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
    </article>
  );
}
