'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MdArrowBack,
  MdArrowForward,
  MdCheck,
  MdOutlineShare,
} from 'react-icons/md';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  getBlogCategoryById,
  getBlogLocalizedText,
  getBlogPostBySlug,
  getNextBlogPost,
  getPreviousBlogPost,
  type AuthorSocialPlatform,
} from '@/lib/data/blog';
import { useAppContext } from '@/components/providers/app-provider';
import {
  setNextStickyBarDirection,
  useStickySubBar,
} from '@/components/frame/sticky-sub-bar-context';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

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
 * - Fixed top architectural bar on mobile & desktop: Back + Article Title (start) | Share icon (end) + rail '+' crosshairs
 * - Clean captionless cover photograph + Author block + Essay body
 * - 3.00s staged GSAP entrance choreography on load and on every Previous/Next story transition
 * - Fixed bottom edge-to-edge 2-column Previous / Next navigation blocks (icon + text only, zero images)
 *   appearing smoothly when the reader reaches the end of the article
 */
export function BlogDetailStage({ slug }: BlogDetailStageProps) {
  const { locale, isRtl, dictionary, announce } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [isAtArticleEnd, setIsAtArticleEnd] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const endSentinelRef = useRef<HTMLDivElement>(null);

  const post = getBlogPostBySlug(slug);

  // Reset scroll & end-bar state on story switch and detect when reader reaches article end
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'auto' });

    const checkBottom = () => {
      const sentinel = endSentinelRef.current;
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      const nearBottom = rect.top <= window.innerHeight + 32;
      setIsAtArticleEnd(nearBottom);
    };

    const rafId = window.requestAnimationFrame(checkBottom);
    const sentinel = endSentinelRef.current;

    let observer: IntersectionObserver | null = null;
    if (sentinel && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            setIsAtArticleEnd(true);
          } else {
            const rect = entry.boundingClientRect;
            setIsAtArticleEnd(rect.top <= window.innerHeight + 24);
          }
        },
        {
          threshold: 0,
          rootMargin: '0px 0px 24px 0px',
        }
      );
      observer.observe(sentinel);
    }

    window.addEventListener('scroll', checkBottom, { passive: true });
    window.addEventListener('resize', checkBottom, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('scroll', checkBottom);
      window.removeEventListener('resize', checkBottom);
    };
  }, [slug]);

  // 3.00s staged entrance choreography whenever the article loads or switches
  // (Desktop sticky sidebar remains strictly stationary; dividers draw start->end & content descends smoothly)
  useGSAP(
    () => {
      const container = articleRef.current;
      if (!container || typeof window === 'undefined') return;

      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const isDesktop = window.matchMedia(
        '(min-width: 768px) and (min-height: 520px) and (orientation: landscape)'
      ).matches;

      const heading = container.querySelector<HTMLElement>(
        '[data-blog-anim="heading"]'
      );
      const metas = Array.from(
        container.querySelectorAll<HTMLElement>('[data-blog-anim="meta"]')
      );
      const cover = !isDesktop
        ? container.querySelector<HTMLElement>('[data-blog-anim="cover"]')
        : null;
      const divider = container.querySelector<HTMLElement>(
        '[data-blog-anim="divider"]'
      );
      const authorItems = !isDesktop
        ? Array.from(
            container.querySelectorAll<HTMLElement>('[data-blog-anim="author"]')
          )
        : [];
      const bodySections = Array.from(
        container.querySelectorAll<HTMLElement>('[data-blog-anim="section"]')
      );

      const allTargets = [
        ...(heading ? [heading] : []),
        ...metas,
        ...(cover ? [cover] : []),
        ...(divider ? [divider] : []),
        ...authorItems,
        ...bodySections,
      ];

      if (reduced) {
        gsap.set(allTargets, { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
          clearProps: 'transform,filter',
        },
      });

      // Phase 1: Divider draws Left->Right (LTR) / Right->Left (RTL) while headline & metadata descend smoothly
      if (divider) {
        tl.fromTo(
          divider,
          {
            scaleX: 0,
            transformOrigin: isRtl ? 'right center' : 'left center',
          },
          { scaleX: 1, duration: 1.05, ease: 'power2.out' },
          0
        );
      }

      if (heading) {
        tl.fromTo(
          heading,
          { autoAlpha: 0, y: -16, filter: 'blur(5px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.72 },
          0.12
        );
      }

      if (metas.length > 0) {
        tl.fromTo(
          metas,
          { autoAlpha: 0, y: -12, filter: 'blur(4px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.62,
            stagger: 0.14,
          },
          0.34
        );
      }

      // Mobile inline cover & author bio (stationary on desktop)
      if (cover) {
        tl.fromTo(
          cover,
          { autoAlpha: 0, y: -16, scale: 0.98, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.85,
          },
          0.56
        );
      }

      if (authorItems.length > 0) {
        const authorDur = 0.56;
        const authorWindow = 0.92;
        const authorStagger =
          authorItems.length > 1
            ? (authorWindow - authorDur) / (authorItems.length - 1)
            : 0;

        tl.fromTo(
          authorItems,
          { autoAlpha: 0, y: -12, filter: 'blur(4px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: authorDur,
            stagger: authorStagger,
          },
          0.96
        );
      }

      // Essay sections descend cleanly over the remaining timeline up to 3.00s
      if (bodySections.length > 0) {
        const startAt = isDesktop ? 0.72 : 1.54;
        const sectionDur = 0.74;
        const sectionWindow = Math.max(sectionDur, 3.0 - startAt);
        const sectionStagger =
          bodySections.length > 1
            ? (sectionWindow - sectionDur) / (bodySections.length - 1)
            : 0;

        tl.fromTo(
          bodySections,
          { autoAlpha: 0, y: -16, filter: 'blur(3px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: sectionDur,
            stagger: sectionStagger,
          },
          startAt
        );
      }
    },
    { scope: articleRef, dependencies: [slug, locale, isRtl] }
  );

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

  const resolvedTitle = post ? getBlogLocalizedText(post.title, locale) : '';

  useStickySubBar(
    post
      ? {
          id: `blog-detail-${post.slug}`,
          depth: 2,
          mobileOnly: false,
          content: (
            <div className="flex h-12 w-full items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center">
                <Link
                  href="/magazine"
                  onClick={() => setNextStickyBarDirection('back')}
                  aria-label={dictionary.blog.backToMagazine}
                  className="inline-flex h-12 shrink-0 items-center gap-2 ps-4 pe-3 text-[13px] font-medium text-[var(--ink-secondary)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
                >
                  <MdArrowBack
                    size={18}
                    aria-hidden="true"
                    className={cn('shrink-0', isRtl && '-scale-x-100')}
                  />
                  <span className="hidden whitespace-nowrap desktop:inline">
                    {dictionary.blog.backToMagazine}
                  </span>
                </Link>

                <span
                  aria-hidden="true"
                  className="h-4 w-px shrink-0 bg-[var(--grid-line)]"
                />

                <span className="min-w-0 flex-1 truncate px-3 text-start text-[14px] font-medium text-[var(--ink-primary)] desktop:px-4 desktop:text-[15px]">
                  {resolvedTitle}
                </span>
              </div>

              <button
                type="button"
                onClick={handleShare}
                aria-label={
                  copied
                    ? dictionary.blog.shareCopiedLabel
                    : dictionary.blog.shareStoryLabel
                }
                title={
                  copied
                    ? dictionary.blog.shareCopiedLabel
                    : dictionary.blog.shareStoryLabel
                }
                className={cn(
                  'inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border-s border-[var(--grid-line)] transition-colors duration-200',
                  copied
                    ? 'text-[var(--brand-text-hover)]'
                    : 'text-[var(--ink-primary)] hover:text-[var(--brand-text-hover)]'
                )}
              >
                {copied ? (
                  <MdCheck size={19} aria-hidden="true" />
                ) : (
                  <MdOutlineShare size={19} aria-hidden="true" />
                )}
              </button>
            </div>
          ),
        }
      : null
  );

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
  const previousPost = getPreviousBlogPost(post.slug);
  const nextPost = getNextBlogPost(post.slug);

  const title = getBlogLocalizedText(post.title, locale);
  const excerpt = getBlogLocalizedText(post.excerpt, locale);
  const fullDate = getBlogLocalizedText(post.fullDate, locale);
  const categoryLabel = getBlogLocalizedText(category.label, locale);
  const coverAlt = getBlogLocalizedText(post.coverAlt, locale);
  const authorName = getBlogLocalizedText(post.author.name, locale);
  const authorRole = getBlogLocalizedText(post.author.role, locale);
  const authorBio = getBlogLocalizedText(post.author.bio, locale);

  const previousTitle = getBlogLocalizedText(previousPost.title, locale);
  const nextTitle = getBlogLocalizedText(nextPost.title, locale);

  return (
    <article
      ref={articleRef}
      aria-label={title}
      className="relative grid min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full grid-cols-1 bg-[var(--bg-canvas)] pt-12 desktop:grid-cols-[320px_minmax(0,1fr)] desktop:grid-rows-[auto_1fr] desktop-wide:grid-cols-[384px_minmax(0,1fr)]"
    >
      {/* 1. Article Header (Mobile: First | Desktop: End Column Row 1) */}
      <header className="order-1 flex w-full flex-col px-4 pt-6 pb-6 desktop:col-start-2 desktop:row-start-1 desktop:px-12 desktop:pt-10 desktop:pb-0">
        <div className="relative flex w-full max-w-3xl flex-col gap-4 desktop:pb-8">
          <h1
            data-blog-anim="heading"
            className="text-[24px] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--ink-primary)] rtl:leading-[1.45] rtl:tracking-normal"
          >
            {title}
          </h1>

          <p
            data-blog-anim="meta"
            className="text-[16px] leading-[1.65] text-[var(--ink-secondary)] desktop:text-[18px] rtl:leading-[1.85]"
          >
            {excerpt}
          </p>

          {/* Date / Category / Read Time below description */}
          <div
            data-blog-anim="meta"
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
            data-blog-anim="divider"
            aria-hidden="true"
            className="pointer-events-none hidden desktop:block absolute inset-x-0 bottom-0 h-px bg-[var(--grid-line)]"
          />
        </div>
      </header>

      {/* 2. Clean Captionless Square Cover Photo + Author Profile + Socials (Mobile: Second | Desktop: Sticky Start Column with 24px Padding) */}
      <aside
        data-smooth-prevent-desktop=""
        className="order-2 flex w-full flex-col gap-5 border-y border-[var(--grid-line)] px-4 py-6 desktop:sticky desktop:top-[calc(var(--grid-header)+48px)] desktop:col-start-1 desktop:row-span-2 desktop:row-start-1 desktop:h-[calc(100dvh-var(--grid-header)-var(--grid-bottom)-48px)] desktop:overflow-y-auto desktop:border-y-0 desktop:border-e desktop:p-6"
      >
        {/* Square Cover Photography (Clean, zero overlay text) */}
        <figure
          data-blog-anim="cover"
          className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)]"
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
        </figure>

        {/* Author Identity + Bio + Social Network Buttons */}
        <div className="flex flex-col gap-4 border-t border-[var(--grid-line)] pt-5">
          <div data-blog-anim="author" className="flex items-center gap-3.5">
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

          <p
            data-blog-anim="author"
            className="text-[13px] leading-[1.6] text-[var(--ink-secondary)] rtl:leading-[1.8]"
          >
            {authorBio}
          </p>

          {/* Author Social Network Buttons */}
          <nav
            data-blog-anim="author"
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

      {/* 3. Essay Body (Mobile: Third | Desktop: End Column Row 2) */}
      <div className="order-3 flex min-w-0 flex-col px-4 pt-8 pb-28 desktop:col-start-2 desktop:row-start-2 desktop:px-12 desktop:pt-8 desktop:pb-32">
        <div className="w-full max-w-3xl">
          <div className="flex flex-col gap-7">
            {post.sections.map((section, index) => (
              <section
                key={`${post.slug}-section-${index}`}
                data-blog-anim="section"
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

          {/* End-of-article sentinel triggering fixed bottom Previous / Next blocks */}
          <div ref={endSentinelRef} aria-hidden="true" className="h-2 w-full" />
        </div>
      </div>

      {/* Fixed Bottom Edge-to-Edge Previous / Next Article Blocks (Appears at Article End, Zero Images) */}
      <AnimatePresence>
        {isAtArticleEnd && (
          <motion.nav
            key={`article-nav-${post.slug}`}
            aria-label={`${dictionary.blog.previousStoryLabel} / ${dictionary.blog.nextStoryLabel}`}
            initial={{ y: 24, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.48,
                ease: SITE_CONFIG.motion.ease,
              },
            }}
            exit={{
              y: 24,
              opacity: 0,
              transition: {
                duration: 0.28,
                ease: SITE_CONFIG.motion.ease,
              },
            }}
            className={cn(
              'fixed bottom-[var(--grid-bottom)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-[34]',
              'grid grid-cols-2 border-t border-[var(--grid-line)]',
              'bg-[var(--bg-header-glass)] backdrop-blur-md backdrop-saturate-150 [transform:translateZ(0)]'
            )}
          >
            {/* Top Left & Right Frame Rail Intersection '+' Crosshairs */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] -start-[7px] z-[35] block h-[13px] w-[13px]"
            >
              <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] -end-[7px] z-[35] block h-[13px] w-[13px]"
            >
              <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            </span>

            {/* Previous Story Block (Start Half — Icon + Text Only, 16px Padding) */}
            <Link
              href={`/magazine/${previousPost.slug}`}
              prefetch={true}
              onClick={() => setNextStickyBarDirection('back')}
              className="group flex min-w-0 items-center gap-3 border-e border-[var(--grid-line)] p-4 text-start transition-colors duration-250 hover:bg-[var(--surface-hover)] desktop:gap-4"
            >
              <MdArrowBack
                size={20}
                aria-hidden="true"
                className={cn(
                  'shrink-0 text-[var(--ink-muted)] transition-all duration-250',
                  'group-hover:text-[var(--brand-text-hover)] group-hover:-translate-x-0.5',
                  isRtl && '-scale-x-100 group-hover:translate-x-0.5'
                )}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-medium text-[var(--ink-muted)] desktop:text-[12px]">
                  {dictionary.blog.previousStoryLabel}
                </span>
                <span className="truncate text-[13px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-250 group-hover:text-[var(--brand-text-hover)] desktop:text-[15px] rtl:leading-[1.5]">
                  {previousTitle}
                </span>
              </span>
            </Link>

            {/* Next Story Block (End Half — Text + Icon Only, 16px Padding) */}
            <Link
              href={`/magazine/${nextPost.slug}`}
              prefetch={true}
              onClick={() => setNextStickyBarDirection('forward')}
              className="group flex min-w-0 items-center justify-end gap-3 p-4 text-end transition-colors duration-250 hover:bg-[var(--surface-hover)] desktop:gap-4"
            >
              <span className="flex min-w-0 flex-1 flex-col items-end gap-0.5">
                <span className="text-[11px] font-medium text-[var(--ink-muted)] desktop:text-[12px]">
                  {dictionary.blog.nextStoryLabel}
                </span>
                <span className="w-full truncate text-end text-[13px] font-medium leading-[1.35] text-[var(--ink-primary)] transition-colors duration-250 group-hover:text-[var(--brand-text-hover)] desktop:text-[15px] rtl:leading-[1.5]">
                  {nextTitle}
                </span>
              </span>
              <MdArrowForward
                size={20}
                aria-hidden="true"
                className={cn(
                  'shrink-0 text-[var(--ink-muted)] transition-all duration-250',
                  'group-hover:text-[var(--brand-text-hover)] group-hover:translate-x-0.5',
                  isRtl && '-scale-x-100 group-hover:-translate-x-0.5'
                )}
              />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </article>
  );
}
