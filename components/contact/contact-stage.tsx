'use client';

import { useId, useMemo, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import {
  MdCall,
  MdCheckCircle,
  MdChevronRight,
  MdKeyboardArrowDown,
  MdLocationOn,
  MdMailOutline,
} from 'react-icons/md';
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  getContactLocalizedText,
  STUDIO_CONTACT,
  type ContactSocialPlatform,
} from '@/lib/data/contact';
import { useAppContext } from '@/components/providers/app-provider';
import { SmoothVerticalPane } from '@/components/providers/smooth-vertical-pane';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const CONTACT_FORM_STAGGER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.25,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const CONTACT_FORM_ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: 'blur(6px)',
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
    y: 6,
    filter: 'blur(3px)',
    transition: {
      duration: 0.25,
      ease: SITE_CONFIG.motion.ease,
    },
  },
};

type ActiveField = 'name' | 'contact' | 'message' | null;

interface FormErrors {
  name?: string;
  contact?: string;
  message?: string;
}

function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 0x0660));
}

function isValidEmailOrPhone(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  if (trimmed.includes('@')) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }
  const digits = normalizeDigits(trimmed).replace(/\D/g, '');
  return digits.length >= 8;
}

function renderSocialIcon(platform: ContactSocialPlatform) {
  switch (platform) {
    case 'instagram':
      return <FaInstagram size={15} aria-hidden="true" />;
    case 'linkedin':
      return <FaLinkedinIn size={14} aria-hidden="true" />;
    case 'x':
      return <FaXTwitter size={14} aria-hidden="true" />;
  }
}

/**
 * Contact Us Editorial Stage:
 * - Light/Dark adaptive ink + foliage artwork:
 *   Light mode uses multiply blend on pure white canvas;
 *   Dark mode applies invert + hue-rotate(180deg) + screen blend on pure black canvas
 *   so background ink becomes crisp white while botanical greens preserve their natural hue.
 * - Artwork mirrors horizontally in RTL (Persian) to balance the mirrored start form column.
 * - Direct tel:, mailto:, and Google Maps deep links + accordion message drawer with Apple-style underline inputs.
 */
export function ContactStage() {
  const { locale, isRtl, dictionary, announce } = useAppContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<ActiveField>(null);
  const [nameValue, setNameValue] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [messageValue, setMessageValue] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const stageRef = useRef<HTMLElement>(null);
  const drawerId = useId();
  const nameFieldId = useId();
  const contactFieldId = useId();
  const messageFieldId = useId();

  const addressText = getContactLocalizedText(STUDIO_CONTACT.address, locale);
  const subtitleBeforeWords = useMemo(
    () => dictionary.contact.subtitleBeforeHours.trim().split(/\s+/),
    [dictionary.contact.subtitleBeforeHours]
  );

  // 2.00s staged entrance choreography:
  // 1) Heading -> 2) Description words with blur -> 3) Contact/Send buttons -> 4) Social links
  useGSAP(
    () => {
      const container = stageRef.current;
      if (!container || typeof window === 'undefined') return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const artwork = container.querySelector<HTMLElement>(
        '[data-contact-anim="artwork"]'
      );
      const artworkImg =
        artwork?.querySelector<HTMLImageElement>('img') ?? null;
      const heading = container.querySelector<HTMLElement>(
        '[data-contact-anim="heading"]'
      );
      const words = Array.from(
        container.querySelectorAll<HTMLElement>('[data-contact-anim="word"]')
      );
      const actionBlocks = Array.from(
        container.querySelectorAll<HTMLElement>('[data-contact-anim="block"]')
      );
      const socialLabel = container.querySelector<HTMLElement>(
        '[data-contact-anim="social-label"]'
      );
      const socialItems = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-contact-anim="social-item"]'
        )
      );

      const allTargets = [
        ...(heading ? [heading] : []),
        ...words,
        ...actionBlocks,
        ...(socialLabel ? [socialLabel] : []),
        ...socialItems,
      ];

      if (prefersReducedMotion) {
        gsap.set(allTargets, { clearProps: 'all' });
        if (artwork) {
          gsap.set(artwork, { autoAlpha: 1, clearProps: 'transform,filter' });
        }
        return;
      }

      let headingDone = false;
      let artworkPlayed = false;
      let imageReady = Boolean(
        artworkImg && artworkImg.complete && artworkImg.naturalWidth > 0
      );

      const playArtworkReveal = () => {
        if (!artwork || artworkPlayed) return;
        artworkPlayed = true;
        gsap.to(artwork, {
          autoAlpha: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: 1.5,
          ease: 'power2.out',
          clearProps: 'transform,filter',
        });
      };

      if (artwork) {
        gsap.set(artwork, {
          autoAlpha: 0,
          filter: 'blur(18px)',
          scale: 1.02,
        });
      }

      const handleImageReady = () => {
        imageReady = true;
        if (headingDone) {
          playArtworkReveal();
        }
      };

      if (artworkImg && !imageReady) {
        artworkImg.addEventListener('load', handleImageReady, { once: true });
        artworkImg.addEventListener('error', handleImageReady, { once: true });
      }

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
          clearProps: 'transform,filter',
        },
      });

      // Phase 1 (0.00s -> 0.42s): Contact Us heading
      if (heading) {
        tl.fromTo(
          heading,
          { autoAlpha: 0, y: 14, filter: 'blur(6px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.42 },
          0
        );
      }

      // Phase 2 (0.26s -> 1.00s): Description words one-by-one with blur
      if (words.length > 0) {
        const wordDuration = 0.36;
        const wordWindow = 0.74; // 0.26s + 0.74s = 1.00s
        const wordStagger =
          words.length > 1
            ? (wordWindow - wordDuration) / (words.length - 1)
            : 0;

        tl.fromTo(
          words,
          { autoAlpha: 0, y: 6, filter: 'blur(8px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: wordDuration,
            stagger: wordStagger,
          },
          0.26
        );
      }

      // Phase 3 (0.94s -> 1.66s): Button blocks (Call, Mail, Place, Send Message) one by one
      if (actionBlocks.length > 0) {
        const blockDuration = 0.42;
        const blockWindow = 0.72; // 0.94s + 0.72s = 1.66s
        const blockStagger =
          actionBlocks.length > 1
            ? (blockWindow - blockDuration) / (actionBlocks.length - 1)
            : 0;

        tl.fromTo(
          actionBlocks,
          { autoAlpha: 0, y: 14, filter: 'blur(4px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: blockDuration,
            stagger: blockStagger,
          },
          0.94
        );
      }

      // Phase 4 (1.54s -> 2.00s): Social label and social buttons
      if (socialLabel) {
        tl.fromTo(
          socialLabel,
          { autoAlpha: 0, y: 10, filter: 'blur(4px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.34 },
          1.54
        );
      }

      if (socialItems.length > 0) {
        const socialDuration = 0.32;
        const socialWindow = 0.42; // 1.58s + 0.42s = 2.00s total
        const socialStagger =
          socialItems.length > 1
            ? (socialWindow - socialDuration) / (socialItems.length - 1)
            : 0;

        tl.fromTo(
          socialItems,
          { autoAlpha: 0, y: 10, scale: 0.94, filter: 'blur(4px)' },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: socialDuration,
            stagger: socialStagger,
          },
          1.58
        );
      }

      // Trigger 1.50s blur-to-clear artwork reveal right after Contact Us heading appears (and image is loaded)
      tl.call(
        () => {
          headingDone = true;
          if (imageReady) {
            playArtworkReveal();
          }
        },
        [],
        0.42
      );

      return () => {
        if (artworkImg) {
          artworkImg.removeEventListener('load', handleImageReady);
          artworkImg.removeEventListener('error', handleImageReady);
        }
      };
    },
    { scope: stageRef, dependencies: [locale, isRtl] }
  );

  const isNameFloating = focusedField === 'name' || nameValue.length > 0;
  const isContactFloating =
    focusedField === 'contact' || contactValue.length > 0;
  const isMessageFloating =
    focusedField === 'message' || messageValue.length > 0;

  const handleToggleDrawer = () => {
    const next = !isFormOpen;
    setIsFormOpen(next);
    announce(
      next
        ? dictionary.announcements.contactFormOpened
        : dictionary.announcements.contactFormClosed
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (nameValue.trim().length < 2) {
      nextErrors.name = dictionary.contact.errors.nameRequired;
    }
    if (!isValidEmailOrPhone(contactValue)) {
      nextErrors.contact = dictionary.contact.errors.contactInvalid;
    }
    if (messageValue.trim().length < 4) {
      nextErrors.message = dictionary.contact.errors.messageRequired;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setFocusedField(null);
    setIsSubmitted(true);
    announce(dictionary.announcements.contactMessageSent);
  };

  const handleResetMessage = () => {
    setNameValue('');
    setContactValue('');
    setMessageValue('');
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section
      ref={stageRef}
      aria-label={dictionary.contact.regionAriaLabel}
      className="relative flex h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col overflow-hidden bg-[var(--bg-canvas)]"
    >
      {/* Architectural Paper Airplane & Cliff Botanical Background Artwork */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute bottom-0 end-0 z-0 select-none overflow-hidden',
          'mix-blend-multiply dark:mix-blend-screen',
          'aspect-[16/9] w-[132%] max-w-none',
          'desktop:inset-0 desktop:aspect-auto desktop:h-full desktop:w-full'
        )}
      >
        <div
          data-contact-anim="artwork"
          className="relative h-full w-full opacity-0 will-change-[opacity,filter,transform]"
        >
          <Image
            src={STUDIO_CONTACT.artworkSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 135vw, 100vw"
            referrerPolicy="no-referrer"
            className={cn(
              'object-cover object-right-bottom transition-transform duration-300',
              'contrast-[1.04]',
              'dark:invert dark:hue-rotate-180 dark:contrast-[1.06]',
              'rtl:-scale-x-100'
            )}
          />
        </div>
      </div>

      {/* Foreground Editorial & Action Column (Social footer anchored stationary at bottom) */}
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden px-4 py-6 desktop:px-14 desktop:py-12">
        <div className="flex h-full min-h-0 w-full max-w-[400px] flex-col justify-between gap-4">
          <SmoothVerticalPane className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col pb-2">
            {/* Heading & Working-Hours Introduction */}
            <header className="flex flex-col gap-2.5 pb-4 desktop:gap-3 desktop:pb-6">
              <h1
                data-contact-anim="heading"
                className="text-[24px] font-normal leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] desktop:text-[38px] desktop:leading-[1.15] desktop:tracking-[-0.025em] rtl:leading-[1.35] rtl:tracking-normal"
              >
                {dictionary.contact.title}
              </h1>
              <p className="text-[13.5px] leading-[1.7] text-[var(--ink-secondary)] desktop:text-[15px] rtl:leading-[1.95]">
                {subtitleBeforeWords.map((word, index) => (
                  <span key={`${locale}-word-${index}`}>
                    <span
                      data-contact-anim="word"
                      className="inline-block will-change-[opacity,transform,filter]"
                    >
                      {word}
                    </span>{' '}
                  </span>
                ))}
                <span
                  data-contact-anim="word"
                  className="inline-block will-change-[opacity,transform,filter]"
                >
                  <span
                    dir="ltr"
                    className="bidi-isolate font-medium text-[var(--ink-primary)] tabular-nums"
                  >
                    {dictionary.contact.workingHours}
                  </span>
                  {dictionary.contact.subtitleAfterHours}
                </span>
              </p>
            </header>

            {/* Direct Contact Channels — Calm collapse upward when Send Message opens */}
            <AnimatePresence initial={false}>
              {!isFormOpen && (
                <motion.div
                  key="contact-channels"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    transition: {
                      height: {
                        duration: SITE_CONFIG.motion.slowDuration,
                        ease: SITE_CONFIG.motion.ease,
                      },
                      opacity: {
                        duration: SITE_CONFIG.motion.standardDuration,
                        delay: 0.12,
                        ease: SITE_CONFIG.motion.ease,
                      },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: {
                      opacity: {
                        duration: 0.36,
                        ease: SITE_CONFIG.motion.ease,
                      },
                      height: {
                        duration: SITE_CONFIG.motion.slowDuration,
                        delay: 0.08,
                        ease: SITE_CONFIG.motion.ease,
                      },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-col">
                    <li data-contact-anim="block">
                      <a
                        href={STUDIO_CONTACT.phoneHref}
                        className="group flex items-center justify-between gap-3 border-t border-b border-[var(--grid-line)] py-3.5 transition-colors duration-300"
                      >
                        <div className="flex min-w-0 flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[var(--ink-muted)]">
                            <span
                              aria-hidden="true"
                              className="inline-flex shrink-0 items-center justify-center text-[var(--ink-muted)]"
                            >
                              <MdCall className="h-[14px] w-[14px] desktop:h-[16px] desktop:w-[16px]" />
                            </span>
                            <span className="text-[12px] font-normal leading-[1.35] text-[var(--ink-muted)] desktop:text-[14px]">
                              {dictionary.contact.callLabel}
                            </span>
                          </div>
                          <span
                            dir="ltr"
                            className="bidi-isolate truncate text-start text-[16px] font-normal leading-[1.45] text-[var(--ink-primary)] tabular-nums transition-colors duration-300 group-hover:text-[var(--brand-text-hover)] desktop:text-[18px]"
                          >
                            {STUDIO_CONTACT.phoneDisplay}
                          </span>
                        </div>
                        <MdChevronRight
                          size={20}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--ink-muted)] transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        />
                      </a>
                    </li>

                    <li data-contact-anim="block">
                      <a
                        href={STUDIO_CONTACT.emailHref}
                        className="group flex items-center justify-between gap-3 border-b border-[var(--grid-line)] py-3.5 transition-colors duration-300"
                      >
                        <div className="flex min-w-0 flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[var(--ink-muted)]">
                            <span
                              aria-hidden="true"
                              className="inline-flex shrink-0 items-center justify-center text-[var(--ink-muted)]"
                            >
                              <MdMailOutline className="h-[14px] w-[14px] desktop:h-[16px] desktop:w-[16px]" />
                            </span>
                            <span className="text-[12px] font-normal leading-[1.35] text-[var(--ink-muted)] desktop:text-[14px]">
                              {dictionary.contact.mailLabel}
                            </span>
                          </div>
                          <span
                            dir="ltr"
                            className="bidi-isolate truncate text-start text-[16px] font-normal leading-[1.45] text-[var(--ink-primary)] transition-colors duration-300 group-hover:text-[var(--brand-text-hover)] desktop:text-[18px]"
                          >
                            {STUDIO_CONTACT.email}
                          </span>
                        </div>
                        <MdChevronRight
                          size={20}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--ink-muted)] transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        />
                      </a>
                    </li>

                    <li data-contact-anim="block">
                      <a
                        href={STUDIO_CONTACT.mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 pt-3.5 pb-1.5 transition-colors duration-300"
                      >
                        <div className="flex min-w-0 flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[var(--ink-muted)]">
                            <span
                              aria-hidden="true"
                              className="inline-flex shrink-0 items-center justify-center text-[var(--ink-muted)]"
                            >
                              <MdLocationOn className="h-[14px] w-[14px] desktop:h-[16px] desktop:w-[16px]" />
                            </span>
                            <span className="text-[12px] font-normal leading-[1.35] text-[var(--ink-muted)] desktop:text-[14px]">
                              {dictionary.contact.placeLabel}
                            </span>
                          </div>
                          <span className="truncate text-start text-[16px] font-normal leading-[1.45] text-[var(--ink-primary)] transition-colors duration-300 group-hover:text-[var(--brand-text-hover)] desktop:text-[18px]">
                            {addressText}
                          </span>
                        </div>
                        <MdChevronRight
                          size={20}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--ink-muted)] transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        />
                      </a>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expandable Send Message Accordion Drawer */}
            <div data-contact-anim="block">
              <motion.div
                initial={false}
                animate={{ marginTop: isFormOpen ? 0 : 18 }}
                transition={{
                  duration: SITE_CONFIG.motion.slowDuration,
                  ease: SITE_CONFIG.motion.ease,
                }}
                className="overflow-hidden rounded-[4px] border border-[var(--grid-line)] bg-[var(--bg-canvas)]/88 backdrop-blur-md [transform:translateZ(0)] transition-colors duration-300"
              >
                <button
                  type="button"
                  aria-expanded={isFormOpen}
                  aria-controls={drawerId}
                  aria-label={
                    isFormOpen
                      ? dictionary.contact.closeFormAriaLabel
                      : dictionary.contact.openFormAriaLabel
                  }
                  onClick={handleToggleDrawer}
                  className="flex h-12 w-full cursor-pointer items-center justify-between ps-4 pe-0 text-start text-[15px] font-normal text-[var(--ink-primary)] transition-colors duration-300 hover:text-[var(--brand-text-hover)]"
                >
                  <span>{dictionary.contact.sendMessageTitle}</span>
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ rotate: isFormOpen ? 180 : 0 }}
                    transition={{
                      duration: SITE_CONFIG.motion.standardDuration,
                      ease: SITE_CONFIG.motion.ease,
                    }}
                    className="inline-flex shrink-0 items-center justify-center p-3 text-[var(--ink-muted)]"
                  >
                    <MdKeyboardArrowDown size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isFormOpen && (
                    <motion.div
                      id={drawerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: {
                            duration: 0.85,
                            ease: SITE_CONFIG.motion.ease,
                          },
                          opacity: {
                            duration: SITE_CONFIG.motion.standardDuration,
                            delay: 0.1,
                            ease: SITE_CONFIG.motion.ease,
                          },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          opacity: {
                            duration: 0.34,
                            ease: SITE_CONFIG.motion.ease,
                          },
                          height: {
                            duration: SITE_CONFIG.motion.slowDuration,
                            delay: 0.08,
                            ease: SITE_CONFIG.motion.ease,
                          },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      {isSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: SITE_CONFIG.motion.standardDuration,
                              delay: 0.12,
                              ease: SITE_CONFIG.motion.ease,
                            },
                          }}
                          exit={{
                            opacity: 0,
                            y: 6,
                            transition: {
                              duration: 0.3,
                              ease: SITE_CONFIG.motion.ease,
                            },
                          }}
                          className="flex flex-col items-start gap-3 px-4 pt-2 pb-5"
                        >
                          <div className="flex items-center gap-2 text-[var(--brand-text-hover)]">
                            <MdCheckCircle size={20} aria-hidden="true" />
                            <span className="text-[15px] font-medium text-[var(--ink-primary)]">
                              {dictionary.contact.successTitle}
                            </span>
                          </div>
                          <p className="text-[13px] leading-[1.7] text-[var(--ink-secondary)] rtl:leading-[1.9]">
                            {dictionary.contact.successSubtitle}
                          </p>
                          <button
                            type="button"
                            onClick={handleResetMessage}
                            className="mt-1 cursor-pointer text-[12px] font-medium text-[var(--brand-text-hover)] transition-opacity duration-300 hover:opacity-75"
                          >
                            {dictionary.contact.sendAnotherCta}
                          </button>
                        </motion.div>
                      ) : (
                        <motion.form
                          variants={CONTACT_FORM_STAGGER_VARIANTS}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          onSubmit={handleSubmit}
                          noValidate
                          className="flex flex-col gap-4 px-4 pt-1 pb-5"
                        >
                        {/* Field 1: Full Name (Apple-style floating label + underline) */}
                        <motion.div
                          variants={CONTACT_FORM_ITEM_VARIANTS}
                          className="relative flex flex-col pt-4"
                        >
                          <label
                            htmlFor={nameFieldId}
                            className={cn(
                              'pointer-events-none absolute start-0 transition-all duration-200 ease-out',
                              isNameFloating
                                ? 'top-0 text-[11px] font-medium'
                                : 'top-[23px] text-[14px] font-normal',
                              errors.name
                                ? 'text-red-500'
                                : focusedField === 'name'
                                  ? 'text-[var(--brand-text-hover)]'
                                  : 'text-[var(--ink-muted)]'
                            )}
                          >
                            {dictionary.contact.nameLabel}
                          </label>
                          <input
                            id={nameFieldId}
                            type="text"
                            autoComplete="name"
                            value={nameValue}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(event) => {
                              setNameValue(event.target.value);
                              if (errors.name) {
                                setErrors((prev) => ({
                                  ...prev,
                                  name: undefined,
                                }));
                              }
                            }}
                            aria-invalid={Boolean(errors.name)}
                            className={cn(
                              'h-9 w-full rounded-none border-0 border-b bg-transparent px-0 text-start text-[14px] text-[var(--ink-primary)]',
                              'transition-colors duration-200 focus:outline-none',
                              errors.name
                                ? 'border-red-500 focus:border-red-500'
                                : focusedField === 'name'
                                  ? 'border-[var(--brand-primary)]'
                                  : 'border-[var(--grid-line-strong)] focus:border-[var(--brand-primary)]'
                            )}
                          />
                          {errors.name ? (
                            <p
                              role="alert"
                              className="pt-1.5 text-[11px] leading-[1.45] text-red-500"
                            >
                              {errors.name}
                            </p>
                          ) : null}
                        </motion.div>

                        {/* Field 2: Email or Phone (Apple-style floating label + underline) */}
                        <motion.div
                          variants={CONTACT_FORM_ITEM_VARIANTS}
                          className="relative flex flex-col pt-4"
                        >
                          <label
                            htmlFor={contactFieldId}
                            className={cn(
                              'pointer-events-none absolute start-0 transition-all duration-200 ease-out',
                              isContactFloating
                                ? 'top-0 text-[11px] font-medium'
                                : 'top-[23px] text-[14px] font-normal',
                              errors.contact
                                ? 'text-red-500'
                                : focusedField === 'contact'
                                  ? 'text-[var(--brand-text-hover)]'
                                  : 'text-[var(--ink-muted)]'
                            )}
                          >
                            {dictionary.contact.contactFieldLabel}
                          </label>
                          <input
                            id={contactFieldId}
                            type="text"
                            autoComplete="email"
                            value={contactValue}
                            onFocus={() => setFocusedField('contact')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(event) => {
                              setContactValue(event.target.value);
                              if (errors.contact) {
                                setErrors((prev) => ({
                                  ...prev,
                                  contact: undefined,
                                }));
                              }
                            }}
                            aria-invalid={Boolean(errors.contact)}
                            className={cn(
                              'h-9 w-full rounded-none border-0 border-b bg-transparent px-0 text-start text-[14px] text-[var(--ink-primary)] tabular-nums',
                              'transition-colors duration-200 focus:outline-none',
                              errors.contact
                                ? 'border-red-500 focus:border-red-500'
                                : focusedField === 'contact'
                                  ? 'border-[var(--brand-primary)]'
                                  : 'border-[var(--grid-line-strong)] focus:border-[var(--brand-primary)]'
                            )}
                          />
                          {errors.contact ? (
                            <p
                              role="alert"
                              className="pt-1.5 text-[11px] leading-[1.45] text-red-500"
                            >
                              {errors.contact}
                            </p>
                          ) : null}
                        </motion.div>

                        {/* Field 3: Message Textarea (Apple-style floating label + underline) */}
                        <motion.div
                          variants={CONTACT_FORM_ITEM_VARIANTS}
                          className="relative flex flex-col pt-4"
                        >
                          <label
                            htmlFor={messageFieldId}
                            className={cn(
                              'pointer-events-none absolute start-0 transition-all duration-200 ease-out',
                              isMessageFloating
                                ? 'top-0 text-[11px] font-medium'
                                : 'top-[23px] text-[14px] font-normal',
                              errors.message
                                ? 'text-red-500'
                                : focusedField === 'message'
                                  ? 'text-[var(--brand-text-hover)]'
                                  : 'text-[var(--ink-muted)]'
                            )}
                          >
                            {dictionary.contact.messageLabel}
                          </label>
                          <textarea
                            id={messageFieldId}
                            rows={3}
                            value={messageValue}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(event) => {
                              setMessageValue(event.target.value);
                              if (errors.message) {
                                setErrors((prev) => ({
                                  ...prev,
                                  message: undefined,
                                }));
                              }
                            }}
                            aria-invalid={Boolean(errors.message)}
                            className={cn(
                              'w-full resize-none rounded-none border-0 border-b bg-transparent px-0 pt-1 pb-2 text-start text-[14px] leading-[1.6] text-[var(--ink-primary)]',
                              'transition-colors duration-200 focus:outline-none rtl:leading-[1.8]',
                              errors.message
                                ? 'border-red-500 focus:border-red-500'
                                : focusedField === 'message'
                                  ? 'border-[var(--brand-primary)]'
                                  : 'border-[var(--grid-line-strong)] focus:border-[var(--brand-primary)]'
                            )}
                          />
                          {errors.message ? (
                            <p
                              role="alert"
                              className="pt-1.5 text-[11px] leading-[1.45] text-red-500"
                            >
                              {errors.message}
                            </p>
                          ) : null}
                        </motion.div>

                        <motion.div
                          variants={CONTACT_FORM_ITEM_VARIANTS}
                          className="flex justify-end pt-2"
                        >
                          <button
                            type="submit"
                            className={cn(
                              'inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-6',
                              'bg-[var(--brand-primary)] text-[13px] font-medium text-[var(--brand-ink-on-primary)]',
                              'transition-colors duration-300 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
                            )}
                          >
                            {dictionary.contact.submitCta}
                          </button>
                        </motion.div>
                        </motion.form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            </div>
          </SmoothVerticalPane>

          {/* Bottom Studio Social Channels */}
          <div className="flex shrink-0 flex-col gap-2.5 pt-2">
            <span
              data-contact-anim="social-label"
              className="text-[13px] font-normal text-[var(--ink-muted)]"
            >
              {dictionary.contact.socialLabel}
            </span>
            <nav
              aria-label={dictionary.contact.socialLabel}
              className="flex items-center gap-2.5"
            >
              {STUDIO_CONTACT.socials.map((social) => (
                <a
                  key={social.platform}
                  data-contact-anim="social-item"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={dictionary.socials[social.platform]}
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-full',
                    'border border-[var(--grid-line-strong)] bg-[var(--bg-canvas)]/80 backdrop-blur-sm',
                    'text-[var(--ink-secondary)] transition-colors duration-300',
                    'hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                  )}
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
