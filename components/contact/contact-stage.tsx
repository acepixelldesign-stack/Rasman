'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import {
  MdAdd,
  MdCall,
  MdCheckCircle,
  MdChevronRight,
  MdLocationOn,
  MdMailOutline,
  MdRemove,
} from 'react-icons/md';
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  getContactLocalizedText,
  STUDIO_CONTACT,
  type ContactSocialPlatform,
} from '@/lib/data/contact';
import { useAppContext } from '@/components/providers/app-provider';
import { useArchitecturalEntrance } from '@/components/motion/architectural-motion';
import { SmoothVerticalPane } from '@/components/providers/smooth-vertical-pane';
import { cn } from '@/lib/utils';

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

  useArchitecturalEntrance(stageRef, { isRtl });

  const addressText = getContactLocalizedText(STUDIO_CONTACT.address, locale);

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
          'aspect-[16/9] w-[132%] max-w-none',
          'desktop:inset-0 desktop:aspect-auto desktop:h-full desktop:w-full'
        )}
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
            'mix-blend-multiply contrast-[1.04]',
            'dark:mix-blend-screen dark:invert dark:hue-rotate-180 dark:contrast-[1.06]',
            'rtl:-scale-x-100'
          )}
        />
      </div>

      {/* Scrollable Foreground Editorial & Action Column */}
      <SmoothVerticalPane className="relative z-10 flex h-full w-full flex-col overflow-y-auto px-4 py-6 desktop:px-14 desktop:py-12">
        <div className="flex min-h-full w-full max-w-[400px] flex-col justify-between gap-8">
          <div className="flex flex-col">
            {/* Heading & Working-Hours Introduction */}
            <header className="flex flex-col gap-2.5 pb-4 desktop:gap-3 desktop:pb-6">
              <h1
                data-gsap="heading"
                className="text-[24px] font-normal leading-[1.2] tracking-[-0.02em] text-[var(--ink-primary)] desktop:text-[38px] desktop:leading-[1.15] desktop:tracking-[-0.025em] rtl:leading-[1.35] rtl:tracking-normal"
              >
                {dictionary.contact.title}
              </h1>
              <p
                data-gsap="body"
                className="text-[13.5px] leading-[1.7] text-[var(--ink-secondary)] desktop:text-[15px] rtl:leading-[1.95]"
              >
                {dictionary.contact.subtitleBeforeHours}{' '}
                <span
                  dir="ltr"
                  className="bidi-isolate font-medium text-[var(--ink-primary)] tabular-nums"
                >
                  {dictionary.contact.workingHours}
                </span>
                {dictionary.contact.subtitleAfterHours}
              </p>
            </header>

            {/* Direct Contact Channels — Fade out & collapse upward when Send Message opens */}
            <AnimatePresence initial={false}>
              {!isFormOpen && (
                <motion.div
                  key="contact-channels"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: SITE_CONFIG.motion.drawerDuration,
                    ease: SITE_CONFIG.motion.ease,
                  }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-col">
                    <li data-gsap="card">
                      <a
                        href={STUDIO_CONTACT.phoneHref}
                        className="group flex items-center justify-between gap-3 border-b border-[var(--grid-line)] py-3.5 transition-colors duration-200"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-6 shrink-0 items-center justify-start text-[var(--ink-secondary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)]"
                          >
                            <MdCall size={18} />
                          </span>
                          <div className="flex min-w-0 flex-col">
                            <span className="text-[12px] font-normal leading-[1.35] text-[var(--ink-muted)]">
                              {dictionary.contact.callLabel}
                            </span>
                            <span
                              dir="ltr"
                              className="bidi-isolate truncate text-start text-[15px] font-normal leading-[1.45] text-[var(--ink-primary)] tabular-nums transition-colors duration-200 group-hover:text-[var(--brand-text-hover)]"
                            >
                              {STUDIO_CONTACT.phoneDisplay}
                            </span>
                          </div>
                        </div>
                        <MdChevronRight
                          size={20}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--ink-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--brand-text-hover)] rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        />
                      </a>
                    </li>

                    <li data-gsap="card">
                      <a
                        href={STUDIO_CONTACT.emailHref}
                        className="group flex items-center justify-between gap-3 border-b border-[var(--grid-line)] py-3.5 transition-colors duration-200"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-6 shrink-0 items-center justify-start text-[var(--ink-secondary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)]"
                          >
                            <MdMailOutline size={18} />
                          </span>
                          <div className="flex min-w-0 flex-col">
                            <span className="text-[12px] font-normal leading-[1.35] text-[var(--ink-muted)]">
                              {dictionary.contact.mailLabel}
                            </span>
                            <span
                              dir="ltr"
                              className="bidi-isolate truncate text-start text-[15px] font-normal leading-[1.45] text-[var(--ink-primary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)]"
                            >
                              {STUDIO_CONTACT.email}
                            </span>
                          </div>
                        </div>
                        <MdChevronRight
                          size={20}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--ink-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--brand-text-hover)] rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        />
                      </a>
                    </li>

                    <li data-gsap="card">
                      <a
                        href={STUDIO_CONTACT.mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 pt-3.5 pb-1.5 transition-colors duration-200"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-6 shrink-0 items-center justify-start text-[var(--ink-secondary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)]"
                          >
                            <MdLocationOn size={18} />
                          </span>
                          <div className="flex min-w-0 flex-col">
                            <span className="text-[12px] font-normal leading-[1.35] text-[var(--ink-muted)]">
                              {dictionary.contact.placeLabel}
                            </span>
                            <span className="truncate text-start text-[15px] font-normal leading-[1.45] text-[var(--ink-primary)] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)]">
                              {addressText}
                            </span>
                          </div>
                        </div>
                        <MdChevronRight
                          size={20}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--ink-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--brand-text-hover)] rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        />
                      </a>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expandable Send Message Accordion Drawer */}
            <div
              data-gsap="control"
              className={cn(
                'overflow-hidden rounded-[4px] border border-[var(--grid-line)] bg-[var(--bg-canvas)]/88 backdrop-blur-md [transform:translateZ(0)] transition-all duration-250',
                isFormOpen ? 'mt-0' : 'mt-1.5'
              )}
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
                className="flex h-12 w-full cursor-pointer items-center justify-between px-4 text-start text-[15px] font-normal text-[var(--ink-primary)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
              >
                <span>{dictionary.contact.sendMessageTitle}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 items-center justify-center text-[var(--ink-muted)]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isFormOpen ? (
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

              <AnimatePresence initial={false}>
                {isFormOpen && (
                  <motion.div
                    id={drawerId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: SITE_CONFIG.motion.standardDuration,
                      ease: SITE_CONFIG.motion.ease,
                    }}
                    className="overflow-hidden"
                  >
                    {isSubmitted ? (
                      <div className="flex flex-col items-start gap-3 px-4 pt-2 pb-5">
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
                          className="mt-1 cursor-pointer text-[12px] font-medium text-[var(--brand-text-hover)] transition-opacity duration-200 hover:opacity-75"
                        >
                          {dictionary.contact.sendAnotherCta}
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="flex flex-col gap-4 px-4 pt-1 pb-5"
                      >
                        {/* Field 1: Full Name (Apple-style floating label + underline) */}
                        <div className="relative flex flex-col pt-4">
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
                        </div>

                        {/* Field 2: Email or Phone (Apple-style floating label + underline) */}
                        <div className="relative flex flex-col pt-4">
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
                        </div>

                        {/* Field 3: Message Textarea (Apple-style floating label + underline) */}
                        <div className="relative flex flex-col pt-4">
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
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className={cn(
                              'inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-6',
                              'bg-[var(--brand-primary)] text-[13px] font-medium text-[var(--brand-ink-on-primary)]',
                              'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
                            )}
                          >
                            {dictionary.contact.submitCta}
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Studio Social Channels */}
          <div className="flex flex-col gap-2.5 pt-2">
            <span className="text-[13px] font-normal text-[var(--ink-muted)]">
              {dictionary.contact.socialLabel}
            </span>
            <nav
              aria-label={dictionary.contact.socialLabel}
              className="flex items-center gap-2.5"
            >
              {STUDIO_CONTACT.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={dictionary.socials[social.platform]}
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-full',
                    'border border-[var(--grid-line-strong)] bg-[var(--bg-canvas)]/80 backdrop-blur-sm',
                    'text-[var(--ink-secondary)] transition-colors duration-200',
                    'hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                  )}
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </SmoothVerticalPane>
    </section>
  );
}
