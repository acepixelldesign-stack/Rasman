'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  getProjectLocalizedText,
  type ProjectGalleryFrame,
} from '@/lib/data/projects';
import { useAppContext } from '@/components/providers/app-provider';
import { cn } from '@/lib/utils';

export type LightboxMediaTab = 'images' | 'documents';

interface ProjectMediaLightboxProps {
  readonly isOpen: boolean;
  readonly initialTab?: LightboxMediaTab;
  readonly initialIndex?: number;
  readonly images: readonly ProjectGalleryFrame[];
  readonly documents: readonly ProjectGalleryFrame[];
  readonly onClose: () => void;
}

/**
 * Fullscreen Architectural Media Lightbox:
 * - Top frosted-glass segmented control switching between "Project Images" & "Design Documents"
 * - Keyboard accessible (Escape closes, ArrowLeft/ArrowRight steps cleanly with RTL parity)
 */
export function ProjectMediaLightbox({
  isOpen,
  initialTab = 'images',
  initialIndex = 0,
  images,
  documents,
  onClose,
}: ProjectMediaLightboxProps) {
  const { locale, isRtl, dictionary } = useAppContext();
  const [activeTab, setActiveTab] = useState<LightboxMediaTab>(initialTab);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  const items = activeTab === 'images' ? images : documents;
  const totalCount = items.length;
  const safeIndex =
    totalCount > 0 ? ((currentIndex % totalCount) + totalCount) % totalCount : 0;
  const activeItem = items[safeIndex];

  const handleStep = useCallback(
    (delta: number) => {
      if (totalCount <= 1) return;
      setCurrentIndex((prev) => (prev + delta + totalCount) % totalCount);
    },
    [totalCount]
  );

  const handleTabChange = (nextTab: LightboxMediaTab) => {
    if (nextTab === activeTab) return;
    setActiveTab(nextTab);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        handleStep(isRtl ? -1 : 1);
      } else if (event.key === 'ArrowLeft') {
        handleStep(isRtl ? 1 : -1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isRtl, handleStep, onClose]);

  const tabOptions: readonly LightboxMediaTab[] = ['images', 'documents'];

  return (
    <AnimatePresence>
      {isOpen && activeItem && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={dictionary.projects.detail.lightbox.dialogAriaLabel}
          data-smooth-prevent=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: SITE_CONFIG.motion.fastDuration,
            ease: SITE_CONFIG.motion.ease,
          }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/88 p-4 text-white backdrop-blur-md desktop:p-8"
        >
          {/* Backdrop Click Layer */}
          <button
            type="button"
            aria-label={dictionary.projects.detail.lightbox.closeAriaLabel}
            onClick={onClose}
            className="fixed inset-0 cursor-default"
          />

          {/* Top Bar: Counter | Segmented Switch (Project Images / Design Documents) | Close */}
          <div className="relative z-10 flex w-full items-center justify-between gap-3">
            <span
              dir="ltr"
              className="bidi-isolate hidden min-w-[60px] text-[12px] font-medium tracking-[0.06em] text-white/65 tabular-nums desktop:inline-block"
            >
              {String(safeIndex + 1).padStart(2, '0')} /{' '}
              {String(totalCount).padStart(2, '0')}
            </span>

            {/* Centered Segmented Switch (Shadowless Glass) */}
            <div
              role="tablist"
              aria-label={dictionary.projects.detail.lightbox.dialogAriaLabel}
              className="mx-auto inline-flex items-center rounded-full bg-white/12 p-1 backdrop-blur-xl backdrop-saturate-150 [transform:translateZ(0)]"
            >
              {tabOptions.map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleTabChange(tab)}
                    className={cn(
                      'relative inline-flex h-8 cursor-pointer items-center justify-center rounded-full px-3.5 text-[12px] leading-none font-medium whitespace-nowrap transition-colors duration-250 desktop:px-4',
                      isSelected
                        ? 'text-black'
                        : 'text-white/75 hover:text-white'
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="lightbox-segmented-thumb"
                        transition={{
                          duration: 0.42,
                          ease: SITE_CONFIG.motion.ease,
                        }}
                        className="absolute inset-0 rounded-full bg-white"
                      />
                    )}
                    <span className="relative z-10">
                      {dictionary.projects.detail.lightbox.tabs[tab]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex min-w-[40px] justify-end desktop:min-w-[60px]">
              <button
                type="button"
                onClick={onClose}
                aria-label={dictionary.projects.detail.lightbox.closeAriaLabel}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors duration-250 hover:bg-white/24 [transform:translateZ(0)]"
              >
                <MdClose size={20} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Center Stage Canvas + Side Navigation Buttons */}
          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center py-4 desktop:px-16">
            {totalCount > 1 && (
              <button
                type="button"
                onClick={() => handleStep(isRtl ? 1 : -1)}
                aria-label={
                  isRtl
                    ? dictionary.projects.detail.lightbox.nextAriaLabel
                    : dictionary.projects.detail.lightbox.prevAriaLabel
                }
                className="hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors duration-200 hover:bg-[var(--brand-primary)] desktop:absolute desktop:start-2 desktop:inline-flex"
              >
                {isRtl ? (
                  <MdChevronRight size={24} aria-hidden="true" />
                ) : (
                  <MdChevronLeft size={24} aria-hidden="true" />
                )}
              </button>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeTab}-${safeIndex}`}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{
                  duration: SITE_CONFIG.motion.fastDuration,
                  ease: SITE_CONFIG.motion.ease,
                }}
                className="relative h-full max-h-[72dvh] w-full max-w-5xl overflow-hidden rounded-[4px]"
              >
                <Image
                  src={activeItem.image}
                  alt={getProjectLocalizedText(activeItem.alt, locale)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 95vw, 1024px"
                  referrerPolicy="no-referrer"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {totalCount > 1 && (
              <button
                type="button"
                onClick={() => handleStep(isRtl ? -1 : 1)}
                aria-label={
                  isRtl
                    ? dictionary.projects.detail.lightbox.prevAriaLabel
                    : dictionary.projects.detail.lightbox.nextAriaLabel
                }
                className="hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors duration-200 hover:bg-[var(--brand-primary)] desktop:absolute desktop:end-2 desktop:inline-flex"
              >
                {isRtl ? (
                  <MdChevronLeft size={24} aria-hidden="true" />
                ) : (
                  <MdChevronRight size={24} aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          {/* Bottom Bar: Caption / Mobile Arrow Controls & Pagination Dots */}
          <div className="relative z-10 flex flex-col items-center gap-3 pb-1">
            <p className="max-w-2xl text-center text-[12px] leading-[1.6] text-white/75 desktop:text-[13px]">
              {getProjectLocalizedText(activeItem.caption, locale)}
            </p>

            <div className="flex items-center gap-4">
              {totalCount > 1 && (
                <button
                  type="button"
                  onClick={() => handleStep(isRtl ? 1 : -1)}
                  aria-label={
                    isRtl
                      ? dictionary.projects.detail.lightbox.nextAriaLabel
                      : dictionary.projects.detail.lightbox.prevAriaLabel
                  }
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white transition-colors duration-200 hover:bg-[var(--brand-primary)] desktop:hidden"
                >
                  {isRtl ? (
                    <MdChevronRight size={20} aria-hidden="true" />
                  ) : (
                    <MdChevronLeft size={20} aria-hidden="true" />
                  )}
                </button>
              )}

              <div className="flex items-center gap-1.5">
                {items.map((_, index) => {
                  const isDotActive = index === safeIndex;
                  return (
                    <button
                      key={`${activeTab}-dot-${index}`}
                      type="button"
                      aria-label={`${index + 1}`}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'h-1.5 cursor-pointer rounded-full transition-all duration-200',
                        isDotActive
                          ? 'w-5 bg-white'
                          : 'w-1.5 bg-white/35 hover:bg-white/60'
                      )}
                    />
                  );
                })}
              </div>

              {totalCount > 1 && (
                <button
                  type="button"
                  onClick={() => handleStep(isRtl ? -1 : 1)}
                  aria-label={
                    isRtl
                      ? dictionary.projects.detail.lightbox.prevAriaLabel
                      : dictionary.projects.detail.lightbox.nextAriaLabel
                  }
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white transition-colors duration-200 hover:bg-[var(--brand-primary)] desktop:hidden"
                >
                  {isRtl ? (
                    <MdChevronLeft size={20} aria-hidden="true" />
                  ) : (
                    <MdChevronRight size={20} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
