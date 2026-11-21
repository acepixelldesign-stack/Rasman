'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowBack, MdCheck, MdOutlineShare } from 'react-icons/md';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import {
  getBlogCategoryById,
  getBlogLocalizedText,
  getBlogPostBySlug,
  getNextBlogPost,
  type AuthorSocialPlatform,
} from '@/lib/data/blog';
import { useAppContext } from '@/components/providers/app-provider';
import { useArchitecturalEntrance } from '@/components/motion/architectural-motion';
import { cn } from '@/lib/utils';

interface BlogDetailStageProps {
  readonly slug: string;
}

function renderSocialIcon(platform: AuthorSocialPlatform) {
  switch (platform) {
    case 'facebook':
      return <FaFacebookF size={14} aria-hidden="true" />;
    case 'x':
      return <FaXTwitter size={14} aria-hidden="true" />;
    case 'instagram':
      return <FaInstagram size={15} aria-hidden="true" />;
    case 'linkedin':
      return <FaLinkedinIn size={14} aria-hidden="true" />;
  }
}

/**
 * Editorial Blog Article Reader View:
 * - Mobile (< lg) vertical order:
 *     1) Back to Magazine + Title + Excerpt + Date / Category / Read Time
 *     2) Cover Photography (4px radius) + Author Identity + Author Social Network Buttons
 *     3) Essay Body + Share Strip + Next Story
 * - Desktop (lg+) split layout:
 *     - Sticky Start Column: Back to Magazine + Cover Photo + Author Identity + Author Social Buttons
 *     - End Reading Column: Title + Excerpt + Date / Category / Read Time + Hairline + Essay Body + Share + Next Story
 */
export function BlogDetailStage({ slug }: BlogDetailStageProps) {
  const { locale, isRtl, dictionary, announce } = useAppContext();
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  useArchitecturalEntrance(articleRef, { isRtl, dependencies: [slug] });

  const post = getBlogPostBySlug(slug);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      }
      setCopied(true);
      announce(dictionary.announcements.linkCopied);
    } catch {
      setCopied(true);
      announce(dictionary.announcements.linkCopied);
    }
  };

  if (!post) {
    return (
      <section
        aria-label={dictionary.blog.regionAriaLabel}
        className="flex min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col items-start justify-center gap-5 px-6 py-16 desktop:px-12"
      >
        <p className="text-[20px] font-normal text-[var(--ink-primary)]">
          {dictionary.blog.notFoundTitle}
        </p>
        <Link
          href="/magazine"
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-full px-5',
            'bg-[var(--brand-primary)] text-[14px] font-medium text-[var(--brand-ink-on-primary)]',
            'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)]'
          )}
        >
          <MdArrowBack
            size={18}
            aria-hidden="true"
            className={cn(isRtl && '-scale-x-100')}
          />
          <span>{dictionary.blog.backToMagazine}</span>
        </Link>
      </section>
    );
  }

  const category = getBlogCategoryById(post.categoryId);
  const nextPost = getNextBlogPost(post.slug);

  const title = getBlogLocalizedText(post.title, locale);
  const excerpt = getBlogLocalizedText(post.excerpt, locale);
  const fullDate = getBlogLocalizedText(post.fullDate, locale);
  const categoryLabel = getBlogLocalizedText(category.label, locale);
  const coverAlt = getBlogLocalizedText(post.coverAlt, locale);
  const coverCaption = getBlogLocalizedText(post.coverCaption, locale);
  const authorName = getBlogLocalizedText(post.author.name, locale);
  const authorRole = getBlogLocalizedText(post.author.role, locale);
  const authorBio = getBlogLocalizedText(post.author.bio, locale);

  const nextTitle = getBlogLocalizedText(nextPost.title, locale);
  const nextCoverAlt = getBlogLocalizedText(nextPost.coverAlt, locale);

  return (
    <article
      ref={articleRef}
      aria-label={title}
      className="grid min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full grid-cols-1 bg-[var(--bg-canvas)] desktop:grid-cols-[320px_minmax(0,1fr)] desktop:grid-rows-[auto_1fr] desktop-wide:grid-cols-[384px_minmax(0,1fr)]"
    >
      {/* 1. Article Header (Mobile: First | Desktop: End Column Row 1) */}
      <header className="order-1 flex w-full flex-col px-4 pt-6 pb-6 desktop:col-start-2 desktop:row-start-1 desktop:px-12 desktop:pt-12 desktop:pb-0">
        {/* Mobile Back Navigation */}
        <div data-gsap="kicker" className="mb-5 desktop:hidden">
          <Link
            href="/magazine"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--ink-secondary)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
          >
            <MdArrowBack
              size={18}
              aria-hidden="true"
              className={cn(isRtl && '-scale-x-100')}
            />
            <span>{dictionary.blog.backToMagazine}</span>
          </Link>
        </div>

        <div className="relative flex w-full max-w-3xl flex-col gap-4 desktop:pb-8">
          <h1
            data-gsap="heading"
            className="text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] rtl:leading-[1.4] rtl:tracking-normal"
          >
            {title}
          </h1>

          <p
            data-gsap="body"
            className="text-[16px] leading-[1.65] text-[var(--ink-secondary)] desktop:text-[18px] rtl:leading-[1.85]"
          >
            {excerpt}
          </p>

          {/* Date / Category / Read Time below description */}
          <div
            data-gsap="body"
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-[13px] font-normal text-[var(--ink-primary)] tabular-nums"
          >
            <time dateTime={post.isoDate}>{fullDate}</time>
            <span aria-hidden="true" className="text-[var(--grid-line-strong)]">
              /
            </span>
            <span>{categoryLabel}</span>
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

          <span
            data-gsap="divider"
            aria-hidden="true"
            className="pointer-events-none hidden desktop:block absolute inset-x-0 bottom-0 h-px bg-[var(--grid-line)]"
          />
        </div>
      </header>

      {/* 2. Cover Photo + Author Profile + Socials (Mobile: Second | Desktop: Sticky Start Column spanning rows) */}
      <aside
        data-smooth-prevent-desktop=""
        className="order-2 flex w-full flex-col gap-6 border-y border-[var(--grid-line)] px-4 py-6 desktop:sticky desktop:top-[var(--grid-header)] desktop:col-start-1 desktop:row-span-2 desktop:row-start-1 desktop:h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] desktop:overflow-y-auto desktop:border-y-0 desktop:border-e desktop:px-7 desktop:py-8"
      >
        {/* Desktop Back Navigation */}
        <div data-gsap="kicker" className="hidden desktop:block">
          <Link
            href="/magazine"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--ink-secondary)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
          >
            <MdArrowBack
              size={18}
              aria-hidden="true"
              className={cn(isRtl && '-scale-x-100')}
            />
            <span>{dictionary.blog.backToMagazine}</span>
          </Link>
        </div>

        {/* Cover Photography (4px border radius) */}
        <figure
          data-gsap="media"
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[var(--surface-hover)]"
        >
          <Image
            src={post.coverImage}
            alt={coverAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 340px"
            referrerPolicy="no-referrer"
            className="object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pt-10 pb-3.5 text-[12px] leading-[1.45] text-white/90">
            {coverCaption}
          </figcaption>
        </figure>

        {/* Author Identity + Bio + Social Network Buttons */}
        <div className="flex flex-col gap-4 border-t border-[var(--grid-line)] pt-5">
          <div className="flex items-center gap-3.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--surface-hover)]">
              <Image
                src={post.author.avatar}
                alt={authorName}
                fill
                sizes="48px"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[14px] font-medium leading-[1.3] text-[var(--ink-primary)]">
                <span className="font-normal text-[var(--ink-muted)]">
                  {dictionary.blog.byPrefix}{' '}
                </span>
                {authorName}
              </p>
              <p className="text-[12px] font-normal text-[var(--ink-muted)]">
                {authorRole}
              </p>
            </div>
          </div>

          <p className="text-[13px] leading-[1.6] text-[var(--ink-secondary)] rtl:leading-[1.8]">
            {authorBio}
          </p>

          {/* Author Social Network Buttons (Zero hover background fill, brand hover ink) */}
          <nav
            aria-label={dictionary.blog.authorSocialsAriaLabel}
            className="flex flex-wrap items-center gap-2 pt-1"
          >
            {post.author.socials.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${authorName} — ${dictionary.socials[social.platform]}`}
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-full',
                  'border border-[var(--grid-line-strong)] bg-transparent text-[var(--ink-primary)]',
                  'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                )}
              >
                {renderSocialIcon(social.platform)}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* 3. Essay Body, Share Strip & Next Story (Mobile: Third | Desktop: End Column Row 2) */}
      <div className="order-3 flex min-w-0 flex-col px-4 py-8 desktop:col-start-2 desktop:row-start-2 desktop:px-12 desktop:pt-8 desktop:pb-12">
        <div className="w-full max-w-3xl">
          {/* Essay Body Sections (Staggered Calm Reveal) */}
          <div className="flex flex-col gap-7 pb-8 desktop:pb-10">
            {post.sections.map((section, index) => (
              <section
                key={index}
                data-gsap-scroll=""
                className="flex flex-col gap-3"
              >
                {section.heading ? (
                  <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--ink-primary)] desktop:text-[22px] rtl:leading-[1.5] rtl:tracking-normal">
                    {getBlogLocalizedText(section.heading, locale)}
                  </h2>
                ) : null}
                <p className="text-[16px] font-normal leading-[1.8] text-[var(--ink-secondary)] desktop:text-[17px] rtl:leading-[2]">
                  {getBlogLocalizedText(section.paragraph, locale)}
                </p>
              </section>
            ))}
          </div>

          {/* Share Strip (Zero hover background on icon button) */}
          <div
            data-gsap-scroll=""
            className="flex items-center justify-between border-t border-[var(--grid-line)] py-5"
          >
            <span className="text-[14px] text-[var(--ink-muted)]">
              {copied
                ? dictionary.blog.shareCopiedLabel
                : dictionary.blog.shareStoryLabel}
            </span>
            <button
              type="button"
              onClick={handleShare}
              aria-label={dictionary.blog.shareStoryLabel}
              className={cn(
                'inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200',
                copied
                  ? 'text-[var(--brand-text-hover)]'
                  : 'text-[var(--ink-primary)] hover:text-[var(--brand-text-hover)]'
              )}
            >
              {copied ? (
                <MdCheck size={20} aria-hidden="true" />
              ) : (
                <MdOutlineShare size={20} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Next Story Block */}
          <div
            data-gsap-scroll=""
            className="border-t border-[var(--grid-line)] pt-8 pb-4"
          >
            <Link
              href={`/magazine/${nextPost.slug}`}
              className="group flex items-center gap-5"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)]">
                <Image
                  src={nextPost.coverImage}
                  alt={nextCoverAlt}
                  fill
                  loading="lazy"
                  sizes="96px"
                  referrerPolicy="no-referrer"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--ink-muted)] rtl:normal-case rtl:tracking-normal">
                  {dictionary.blog.nextStoryLabel}
                </span>
                <span className="line-clamp-2 text-[18px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)] desktop:text-[20px] rtl:leading-[1.5]">
                  {nextTitle}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
