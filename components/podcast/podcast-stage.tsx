'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  MdCalendarToday,
  MdCheck,
  MdHeadphones,
  MdKeyboardArrowDown,
  MdOutlineShare,
  MdPodcasts,
  MdQueueMusic,
  MdRecordVoiceOver,
  MdSchedule,
  MdSmartDisplay,
} from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  PODCAST_CATEGORIES,
  PODCAST_EPISODES,
  getLocalizedText,
  type PodcastCategoryId,
} from '@/lib/data/podcasts';
import { useAppContext } from '@/components/providers/app-provider';
import { PodcastSidebar } from '@/components/podcast/podcast-sidebar';
import { PodcastPlayer } from '@/components/podcast/podcast-player';
import { useStickySubBar } from '@/components/frame/sticky-sub-bar-context';
import { SmoothVerticalPane } from '@/components/providers/smooth-vertical-pane';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useSwipeUpDismiss } from '@/hooks/use-swipe-up-dismiss';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const PLAYBACK_RATES = [1, 1.25, 1.5, 2] as const;

const EQUALIZER_BARS = [
  {
    id: 'bar-1',
    restingScale: 0.42,
    activeKeyframes: [0.32, 0.96, 0.44, 0.82, 0.32],
    duration: 0.92,
    delay: 0,
  },
  {
    id: 'bar-2',
    restingScale: 0.88,
    activeKeyframes: [0.92, 0.38, 1.0, 0.52, 0.92],
    duration: 1.08,
    delay: 0.14,
  },
  {
    id: 'bar-3',
    restingScale: 0.56,
    activeKeyframes: [0.45, 0.88, 0.34, 0.96, 0.45],
    duration: 0.86,
    delay: 0.26,
  },
  {
    id: 'bar-4',
    restingScale: 0.72,
    activeKeyframes: [0.76, 0.36, 0.9, 0.42, 0.76],
    duration: 1.02,
    delay: 0.1,
  },
] as const;

interface AudioPlaybackIndicatorProps {
  readonly isPlaying: boolean;
  readonly isSelected: boolean;
}

/**
 * 16px x 16px semantic equalizer indicator (zero custom SVG):
 * - Smoothly animates bars up & down when the episode is actively playing
 * - Holds a calm resting soundwave silhouette when selected/idle
 */
function AudioPlaybackIndicator({
  isPlaying,
  isSelected,
}: AudioPlaybackIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = isPlaying && !prefersReducedMotion;

  return (
    <span
      aria-hidden="true"
      className="inline-flex h-4 w-4 shrink-0 items-end justify-between gap-[2px] py-[1px]"
    >
      {EQUALIZER_BARS.map((bar) => (
        <motion.span
          key={bar.id}
          initial={false}
          animate={
            shouldAnimate
              ? { scaleY: [...bar.activeKeyframes] }
              : { scaleY: bar.restingScale }
          }
          transition={
            shouldAnimate
              ? {
                  duration: bar.duration,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                  delay: bar.delay,
                }
              : {
                  duration: 0.28,
                  ease: SITE_CONFIG.motion.ease,
                }
          }
          className={cn(
            'block h-full w-[2px] origin-bottom rounded-full transition-colors duration-200',
            isSelected
              ? 'bg-[var(--brand-primary)]'
              : 'bg-[var(--grid-line-strong)] group-hover:bg-[var(--brand-text-hover)]'
          )}
        />
      ))}
    </span>
  );
}

/**
 * Full Rasman Podcast Studio composition inside the architectural frame:
 * - Desktop: docked start sidebar (16px category header padding, 2s/1s category accordion, 24px list padding)
 *   + 24px padded episode hero + 24px padded tracklist with 16px animated audio indicator + 24px padded waveform player
 * - 3.00s initial GSAP entrance choreography (sidebar -> hero artwork/title/word-by-word body -> tracklist rising bottom-to-top)
 * - Mobile: fixed Categories & Podcasts bar with bottom architectural '+' crosshairs + 2.00s downward sliding drawer
 */
export function PodcastStage() {
  const { locale, dictionary, isRtl, announce } = useAppContext();
  const prefersReducedMotion = useReducedMotion();

  const [activeCategory, setActiveCategory] = useState<PodcastCategoryId>('all');
  const [hasSelectedCategory, setHasSelectedCategory] = useState<boolean>(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>(
    PODCAST_EPISODES[0].id
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(193);
  const [speedIndex, setSpeedIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedEpisodeId, setCopiedEpisodeId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const mobilePanelId = useId();
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const closeMobileFilter = useCallback(() => setIsMobileFilterOpen(false), []);

  useBodyScrollLock(isMobileFilterOpen);
  useSwipeUpDismiss(mobileSheetRef, isMobileFilterOpen, closeMobileFilter);
  const currentTimeRef = useRef<number>(currentTime);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const filteredEpisodes = useMemo(() => {
    if (activeCategory === 'all') {
      return PODCAST_EPISODES;
    }
    return PODCAST_EPISODES.filter((ep) => ep.categoryId === activeCategory);
  }, [activeCategory]);

  const activeEpisode = useMemo(() => {
    const inFiltered = filteredEpisodes.find((ep) => ep.id === selectedEpisodeId);
    if (inFiltered) return inFiltered;
    const inAll = PODCAST_EPISODES.find((ep) => ep.id === selectedEpisodeId);
    return inAll ?? PODCAST_EPISODES[0];
  }, [filteredEpisodes, selectedEpisodeId]);

  const heroDescriptionWords = useMemo(
    () =>
      getLocalizedText(activeEpisode.description, locale)
        .trim()
        .split(/\s+/)
        .filter(Boolean),
    [activeEpisode.description, locale]
  );

  const playbackRate = PLAYBACK_RATES[speedIndex] ?? 1;

  // 3.00s staged entrance choreography (desktop sidebar stays strictly stationary;
  // main hero artwork/title/word-by-word body descend smoothly, followed by tracklist & player)
  useGSAP(
    () => {
      const container = stageRef.current;
      if (!container || typeof window === 'undefined') return;

      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const heroMedias = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-podcast-anim="hero-media"]'
        )
      );
      const heroTitles = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-podcast-anim="hero-title"]'
        )
      );
      const heroWords = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-podcast-anim="hero-word"]'
        )
      );
      const heroMetas = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-podcast-anim="hero-meta"]'
        )
      );
      const heroControls = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-podcast-anim="hero-control"]'
        )
      );
      const trackItems = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-podcast-anim="track-item"]'
        )
      );
      const playerEls = Array.from(
        container.querySelectorAll<HTMLElement>('[data-podcast-anim="player"]')
      );

      const allTargets = [
        ...heroMedias,
        ...heroTitles,
        ...heroWords,
        ...heroMetas,
        ...heroControls,
        ...trackItems,
        ...playerEls,
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

      if (heroMedias.length > 0) {
        tl.fromTo(
          heroMedias,
          { autoAlpha: 0, y: -14, scale: 0.97, filter: 'blur(5px)' },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.62,
          },
          0.08
        );
      }

      if (heroTitles.length > 0) {
        tl.fromTo(
          heroTitles,
          { autoAlpha: 0, y: -12, filter: 'blur(4px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.56 },
          0.22
        );
      }

      if (heroWords.length > 0) {
        const wordDur = 0.4;
        const wordWindow = 1.02;
        const wordStagger =
          heroWords.length > 1
            ? (wordWindow - wordDur) / (heroWords.length - 1)
            : 0;

        tl.fromTo(
          heroWords,
          { autoAlpha: 0, y: -6, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: wordDur,
            stagger: wordStagger,
          },
          0.38
        );
      }

      if (heroMetas.length > 0) {
        tl.fromTo(
          heroMetas,
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, duration: 0.48 },
          1.08
        );
      }

      if (heroControls.length > 0) {
        tl.fromTo(
          heroControls,
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          1.26
        );
      }

      if (trackItems.length > 0) {
        const trackDur = 0.56;
        const trackWindow = 1.18;
        const trackStagger =
          trackItems.length > 1
            ? (trackWindow - trackDur) / (trackItems.length - 1)
            : 0;

        tl.fromTo(
          trackItems,
          { autoAlpha: 0, y: -14, filter: 'blur(3px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: trackDur,
            stagger: trackStagger,
          },
          1.52
        );
      }

      if (playerEls.length > 0) {
        tl.fromTo(
          playerEls,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.56 },
          2.44
        );
      }
    },
    { scope: stageRef, dependencies: [locale, isRtl] }
  );

  // Close mobile episodes sheet on Escape
  useEffect(() => {
    if (!isMobileFilterOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileFilterOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileFilterOpen]);

  // Gentle synthesized acoustic ambient tone when actively playing (unmuted)
  const stopAudioEngine = useCallback(() => {
    try {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(
          0,
          audioCtxRef.current.currentTime,
          0.06
        );
      }
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
    } catch {
      // Safe cleanup if AudioContext is already closed
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || isMuted) {
      stopAudioEngine();
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      stopAudioEngine();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = activeEpisode.frequencyHz;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.015, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // Gracefully degrade when audio autoplay is restricted
    }

    return () => {
      stopAudioEngine();
    };
  }, [isPlaying, isMuted, activeEpisode.frequencyHz, stopAudioEngine]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // Real-time playback ticker
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 250;
    const timer = window.setInterval(() => {
      const next = currentTimeRef.current + (intervalMs / 1000) * playbackRate;
      if (next >= activeEpisode.durationSeconds) {
        currentTimeRef.current = activeEpisode.durationSeconds;
        setCurrentTime(activeEpisode.durationSeconds);
        setIsPlaying(false);
        return;
      }
      currentTimeRef.current = next;
      setCurrentTime(next);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPlaying, playbackRate, activeEpisode.durationSeconds]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      stopAudioEngine();
      if (audioCtxRef.current) {
        void audioCtxRef.current.close().catch(() => undefined);
        audioCtxRef.current = null;
      }
    };
  }, [stopAudioEngine]);

  const handleSelectEpisode = useCallback(
    (episodeId: string, autoPlay = false, closeMobilePanel = false) => {
      if (closeMobilePanel) {
        setIsMobileFilterOpen(false);
      }
      const isSame = episodeId === activeEpisode.id;
      if (isSame) {
        if (autoPlay) {
          setIsPlaying((prev) => !prev);
        }
        return;
      }
      setSelectedEpisodeId(episodeId);
      setCurrentTime(0);
      setIsPlaying(autoPlay);
      announce(dictionary.announcements.episodeSelected);
    },
    [activeEpisode.id, announce, dictionary.announcements.episodeSelected]
  );

  const handleSelectCategory = useCallback(
    (categoryId: PodcastCategoryId, collapseDesktopCategory = true) => {
      setActiveCategory(categoryId);
      setHasSelectedCategory(true);
      if (collapseDesktopCategory) {
        setIsCategoryOpen(false);
      }
      const nextList =
        categoryId === 'all'
          ? PODCAST_EPISODES
          : PODCAST_EPISODES.filter((ep) => ep.categoryId === categoryId);
      if (nextList.length > 0) {
        setSelectedEpisodeId(nextList[0].id);
        setCurrentTime(0);
        setIsPlaying(false);
      }
    },
    []
  );

  const handleStepEpisode = useCallback(
    (delta: -1 | 1) => {
      const list =
        filteredEpisodes.length > 0 ? filteredEpisodes : PODCAST_EPISODES;
      const currentIdx = list.findIndex((ep) => ep.id === activeEpisode.id);
      const safeIdx = currentIdx === -1 ? 0 : currentIdx;
      const nextIdx = (safeIdx + delta + list.length) % list.length;
      setSelectedEpisodeId(list[nextIdx].id);
      setCurrentTime(0);
    },
    [filteredEpisodes, activeEpisode.id]
  );

  const handleSeek = useCallback(
    (ratio: number) => {
      const clamped = Math.min(1, Math.max(0, ratio));
      setCurrentTime(clamped * activeEpisode.durationSeconds);
    },
    [activeEpisode.durationSeconds]
  );

  const handleCycleSpeed = useCallback(() => {
    setSpeedIndex((prev) => (prev + 1) % PLAYBACK_RATES.length);
  }, []);

  const handleShare = useCallback(async () => {
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}#${activeEpisode.id}`
        : `#${activeEpisode.id}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      // Safe fallback when clipboard API is restricted inside iframe
    }

    setCopiedEpisodeId(activeEpisode.id);
    announce(dictionary.announcements.linkCopied);
    window.setTimeout(() => {
      setCopiedEpisodeId((prev) => (prev === activeEpisode.id ? null : prev));
    }, 2000);
  }, [activeEpisode.id, announce, dictionary.announcements.linkCopied]);

  const enterX = isRtl ? -18 : 18;
  const isCopied = copiedEpisodeId === activeEpisode.id;

  const mobileCategoryStep =
    PODCAST_CATEGORIES.length > 1
      ? 0.42 / (PODCAST_CATEGORIES.length - 1)
      : 0;
  const mobileEpisodeStep =
    filteredEpisodes.length > 1 ? 0.74 / (filteredEpisodes.length - 1) : 0;

  useStickySubBar({
    id: 'podcast-mobile',
    depth: 1,
    mobileOnly: true,
    hideBottomChrome: isMobileFilterOpen,
    ariaLabel: dictionary.podcast.mobileEpisodesTrigger,
    content: (
      <button
        type="button"
        onClick={() => setIsMobileFilterOpen((prev) => !prev)}
        aria-expanded={isMobileFilterOpen}
        aria-controls={mobilePanelId}
        className={cn(
          'flex h-[var(--grid-subbar)] w-full shrink-0 cursor-pointer items-center justify-between gap-3 ps-4 pe-0 text-start',
          'text-[15px] font-normal text-[var(--ink-primary)]'
        )}
      >
        <span className="flex items-center gap-2.5">
          <MdQueueMusic size={20} aria-hidden="true" />
          <span>{dictionary.podcast.mobileEpisodesTrigger}</span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex shrink-0 items-center justify-center p-3 text-[var(--ink-muted)] transition-transform duration-300',
            isMobileFilterOpen && 'rotate-180'
          )}
        >
          <MdKeyboardArrowDown size={20} />
        </span>
      </button>
    ),
    sheet: (
      <AnimatePresence initial={false}>
        {isMobileFilterOpen && (
          <motion.div
            ref={mobileSheetRef}
            id={mobilePanelId}
            data-scroll-lock-allow=""
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height:
                'calc(100dvh - var(--grid-header) - var(--grid-bottom) - var(--grid-subbar))',
              opacity: 1,
              transition: prefersReducedMotion
                ? { duration: 0.01 }
                : {
                    height: { duration: 0.72, ease: SITE_CONFIG.motion.ease },
                    opacity: { duration: 0.45, ease: SITE_CONFIG.motion.ease },
                  },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: prefersReducedMotion
                ? { duration: 0.01 }
                : {
                    duration: 0.48,
                    ease: SITE_CONFIG.motion.ease,
                  },
            }}
            className="flex flex-col overflow-hidden"
          >
            {/* Horizontal 32px-Height Category Chips (16px mobile side padding) */}
            <div className="no-scrollbar flex shrink-0 items-center gap-2 overflow-x-auto px-4 pt-2 pb-3">
              {PODCAST_CATEGORIES.map((category, idx) => {
                const isActive = category.id === activeCategory;
                return (
                  <motion.button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelectCategory(category.id, false)}
                    aria-pressed={isActive}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.01 }
                        : {
                            duration: 0.42,
                            delay: 0.3 + idx * mobileCategoryStep,
                            ease: SITE_CONFIG.motion.ease,
                          }
                    }
                    className={cn(
                      'inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full border px-3.5 text-[12px] leading-none whitespace-nowrap',
                      'transition-colors duration-200',
                      isActive
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] font-medium text-[var(--brand-ink-on-primary)]'
                        : 'border-[var(--grid-line-strong)] text-[var(--ink-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                    )}
                  >
                    {getLocalizedText(category.label, locale)}
                  </motion.button>
                );
              })}
            </div>

            {/* Full-Height Live-Filtered Episodes List */}
            <SmoothVerticalPane className="flex-1 overflow-y-auto px-4 pb-4">
              <ul className="divide-y divide-[var(--grid-line)]">
                {filteredEpisodes.map((episode, idx) => {
                  const isSelected = episode.id === activeEpisode.id;
                  return (
                    <motion.li
                      key={`${activeCategory}-${episode.id}`}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0.01 }
                          : {
                              duration: 0.48,
                              delay: 0.78 + idx * mobileEpisodeStep,
                              ease: SITE_CONFIG.motion.ease,
                            }
                      }
                      className="py-3.5 first:pt-2"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectEpisode(episode.id, false, true)
                        }
                        className="group flex w-full cursor-pointer items-center gap-3 text-start"
                      >
                        <span
                          className={cn(
                            'relative h-16 w-16 shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] ring-1 transition-all duration-200',
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
                            sizes="64px"
                            referrerPolicy="no-referrer"
                            className="object-cover"
                          />
                        </span>
                        <span className="flex min-w-0 flex-1 items-center">
                          <span
                            className={cn(
                              'line-clamp-2 text-[16px] leading-[1.4] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)] rtl:leading-[1.55]',
                              isSelected
                                ? 'font-medium text-[var(--brand-text-hover)]'
                                : 'font-normal text-[var(--ink-primary)]'
                            )}
                          >
                            {getLocalizedText(episode.title, locale)}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </SmoothVerticalPane>

            {/* Mobile Drag-Up Handle to Dismiss Episodes Sheet */}
            <div
              data-swipe-handle=""
              aria-hidden="true"
              className="flex h-6 w-full shrink-0 cursor-grab touch-none select-none items-center justify-center pb-1 active:cursor-grabbing desktop:hidden"
            >
              <span className="block h-[3px] w-9 rounded-full bg-[var(--grid-crosshair)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
  });

  return (
    <div
      ref={stageRef}
      aria-label={dictionary.podcast.regionAriaLabel}
      className={cn(
        'flex w-full flex-col bg-[var(--bg-canvas)] desktop:flex-row',
        'min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] pt-[var(--grid-subbar)] pb-[112px] desktop:pt-0 desktop:pb-0',
        'desktop:h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] desktop:overflow-hidden'
      )}
    >
      {/* Desktop Docked Start Architectural Sidebar (Stationary Across Route Transitions) */}
      <div className="hidden h-full w-[264px] shrink-0 border-e border-[var(--grid-line)] desktop:block desktop-wide:w-[304px]">
        <PodcastSidebar
          activeCategory={activeCategory}
          hasSelectedCategory={hasSelectedCategory}
          isCategoryOpen={isCategoryOpen}
          episodes={filteredEpisodes}
          activeEpisodeId={activeEpisode.id}
          onToggleCategoryOpen={() => setIsCategoryOpen((prev) => !prev)}
          onSelectCategory={(id) => handleSelectCategory(id, true)}
          onSelectEpisode={(id) => handleSelectEpisode(id, false)}
        />
      </div>

      {/* Main Content Stage: Animated Hero + 24px Tracklist + Waveform Player */}
      <div className="flex min-w-0 flex-1 flex-col bg-[var(--bg-canvas)] desktop:h-full desktop:overflow-hidden">
        {/* Band 1: Featured Episode Hero (Mobile: Artwork Beside Title + Open Details Directly Below | Desktop: Side-by-Side Hero) */}
        <div className="shrink-0 border-b border-[var(--grid-line)] p-4 desktop:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeEpisode.id}
              initial={{ opacity: 0, x: enterX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -enterX }}
              transition={{
                duration: SITE_CONFIG.motion.standardDuration,
                ease: SITE_CONFIG.motion.ease,
              }}
              className="flex flex-col gap-4 desktop:flex-row desktop:items-stretch desktop:gap-7"
            >
              {/* Desktop Square Episode Artwork */}
              <div
                data-podcast-anim="hero-media"
                className="relative hidden aspect-square shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] desktop:block desktop:w-48 desktop-wide:w-52"
              >
                <Image
                  src={activeEpisode.coverImage}
                  alt={getLocalizedText(activeEpisode.coverAlt, locale)}
                  fill
                  priority
                  sizes="208px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>

              {/* Mobile Compact Header (Square Artwork Beside Title Matching Title Height) + Directly Visible Details Below */}
              <div className="flex min-w-0 flex-col gap-3.5 desktop:hidden">
                <div className="flex items-center gap-3.5">
                  <div
                    data-podcast-anim="hero-media"
                    className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] sm:h-[76px] sm:w-[76px]"
                  >
                    <Image
                      src={activeEpisode.coverImage}
                      alt={getLocalizedText(activeEpisode.coverAlt, locale)}
                      fill
                      priority
                      sizes="76px"
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>

                  <h1
                    data-podcast-anim="hero-title"
                    className="min-w-0 flex-1 text-start text-[18px] font-medium leading-[1.35] tracking-[-0.015em] text-[var(--ink-primary)] rtl:leading-[1.5] rtl:tracking-normal"
                  >
                    {getLocalizedText(activeEpisode.title, locale)}
                  </h1>
                </div>

                <p className="text-start text-[14px] leading-[1.7] text-[var(--ink-secondary)] rtl:leading-[1.9]">
                  {getLocalizedText(activeEpisode.description, locale)}
                </p>

                <div
                  data-podcast-anim="hero-meta"
                  className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-[var(--ink-muted)]"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MdSchedule
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 text-[var(--ink-secondary)]"
                    />
                    <span className="sr-only">
                      {dictionary.podcast.totalTimeLabel}:
                    </span>
                    <span
                      dir="ltr"
                      className="bidi-isolate font-normal text-[var(--ink-primary)] tabular-nums"
                    >
                      {activeEpisode.durationLabel}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <MdRecordVoiceOver
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 text-[var(--ink-secondary)]"
                    />
                    <span className="sr-only">
                      {dictionary.podcast.speakersLabel}:
                    </span>
                    <span className="text-[var(--ink-primary)]">
                      {getLocalizedText(activeEpisode.speakers, locale)}
                    </span>
                  </span>
                </div>

                <div
                  data-podcast-anim="hero-control"
                  className="flex flex-col gap-3 pt-0.5"
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="text-[13px] text-[var(--ink-muted)]">
                      {dictionary.podcast.listenOrSeeIn}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={activeEpisode.platforms.castbox}
                        aria-label={dictionary.podcast.platformCastboxLabel}
                        className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full',
                          'border border-[var(--grid-line-strong)] text-[var(--ink-primary)]',
                          'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                        )}
                      >
                        <MdPodcasts size={18} aria-hidden="true" />
                      </a>

                      <a
                        href={activeEpisode.platforms.spotify}
                        aria-label={dictionary.podcast.platformSpotifyLabel}
                        className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full',
                          'border border-[var(--grid-line-strong)] text-[var(--ink-primary)]',
                          'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                        )}
                      >
                        <MdHeadphones size={18} aria-hidden="true" />
                      </a>

                      <a
                        href={activeEpisode.platforms.youtube}
                        aria-label={dictionary.podcast.platformYoutubeLabel}
                        className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full',
                          'border border-[var(--grid-line-strong)] text-[var(--ink-primary)]',
                          'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                        )}
                      >
                        <MdSmartDisplay size={18} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className={cn(
                      'inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5',
                      'border border-[var(--grid-line-strong)] text-[13px] font-normal text-[var(--ink-primary)]',
                      'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]',
                      isCopied &&
                        'border-[var(--brand-primary)] text-[var(--brand-text-hover)]'
                    )}
                  >
                    {isCopied ? (
                      <MdCheck size={16} aria-hidden="true" />
                    ) : (
                      <MdOutlineShare size={16} aria-hidden="true" />
                    )}
                    <span>
                      {isCopied
                        ? dictionary.podcast.shareCopiedLabel
                        : dictionary.podcast.shareLabel}
                    </span>
                  </button>
                </div>
              </div>

              {/* Desktop Episode Title, Word-by-Word Synopsis, Duration & Speakers, and Actions */}
              <div className="hidden min-w-0 flex-1 flex-col justify-between gap-4 desktop:flex">
                <div className="space-y-2.5">
                  <h1
                    data-podcast-anim="hero-title"
                    className="text-[clamp(1.2rem,1.9vw,1.65rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--ink-primary)] rtl:leading-[1.4] rtl:tracking-normal"
                  >
                    {getLocalizedText(activeEpisode.title, locale)}
                  </h1>

                  <p className="max-w-3xl text-[14px] leading-[1.65] text-[var(--ink-secondary)] rtl:leading-[1.85] desktop:text-[15px]">
                    {heroDescriptionWords.map((word, index) => (
                      <span key={`${activeEpisode.id}-word-${index}`}>
                        <span
                          data-podcast-anim="hero-word"
                          className="inline-block will-change-[opacity,transform,filter]"
                        >
                          {word}
                        </span>
                        {index < heroDescriptionWords.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </p>

                  {/* Total Episode Duration + Speakers Row */}
                  <div
                    data-podcast-anim="hero-meta"
                    className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-[13px] text-[var(--ink-muted)]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <MdSchedule
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 text-[var(--ink-secondary)]"
                      />
                      <span className="sr-only">
                        {dictionary.podcast.totalTimeLabel}:
                      </span>
                      <span
                        dir="ltr"
                        className="bidi-isolate font-normal text-[var(--ink-primary)] tabular-nums"
                      >
                        {activeEpisode.durationLabel}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MdRecordVoiceOver
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 text-[var(--ink-secondary)]"
                      />
                      <span className="sr-only">
                        {dictionary.podcast.speakersLabel}:
                      </span>
                      <span className="text-[var(--ink-primary)]">
                        {getLocalizedText(activeEpisode.speakers, locale)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Listen/See Platforms + Share Button */}
                <div
                  data-podcast-anim="hero-control"
                  className="flex flex-row flex-wrap items-center justify-between gap-4 pt-1"
                >
                  <div className="flex w-auto items-center justify-start gap-3">
                    <span className="text-[13px] text-[var(--ink-muted)]">
                      {dictionary.podcast.listenOrSeeIn}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={activeEpisode.platforms.castbox}
                        aria-label={dictionary.podcast.platformCastboxLabel}
                        className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full',
                          'border border-[var(--grid-line-strong)] text-[var(--ink-primary)]',
                          'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                        )}
                      >
                        <MdPodcasts size={18} aria-hidden="true" />
                      </a>

                      <a
                        href={activeEpisode.platforms.spotify}
                        aria-label={dictionary.podcast.platformSpotifyLabel}
                        className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full',
                          'border border-[var(--grid-line-strong)] text-[var(--ink-primary)]',
                          'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                        )}
                      >
                        <MdHeadphones size={18} aria-hidden="true" />
                      </a>

                      <a
                        href={activeEpisode.platforms.youtube}
                        aria-label={dictionary.podcast.platformYoutubeLabel}
                        className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full',
                          'border border-[var(--grid-line-strong)] text-[var(--ink-primary)]',
                          'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                        )}
                      >
                        <MdSmartDisplay size={18} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className={cn(
                      'inline-flex h-10 w-auto cursor-pointer items-center justify-center gap-2 rounded-full px-5',
                      'border border-[var(--grid-line-strong)] text-[13px] font-normal text-[var(--ink-primary)]',
                      'transition-colors duration-200 hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]',
                      isCopied &&
                        'border-[var(--brand-primary)] text-[var(--brand-text-hover)]'
                    )}
                  >
                    {isCopied ? (
                      <MdCheck size={16} aria-hidden="true" />
                    ) : (
                      <MdOutlineShare size={16} aria-hidden="true" />
                    )}
                    <span>
                      {isCopied
                        ? dictionary.podcast.shareCopiedLabel
                        : dictionary.podcast.shareLabel}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Band 2: Episode Tracklist (16px horizontal padding on mobile, 24px on desktop) */}
        <SmoothVerticalPane className="flex-1 overflow-y-auto px-4 desktop:px-6">
          {filteredEpisodes.length === 0 ? (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-4 py-12 text-center">
              <p className="text-[15px] text-[var(--ink-secondary)]">
                {dictionary.podcast.emptyTitle}
              </p>
              <button
                type="button"
                onClick={() => handleSelectCategory('all', false)}
                className={cn(
                  'inline-flex h-9 cursor-pointer items-center justify-center rounded-full px-5',
                  'bg-[var(--brand-primary)] text-[13px] font-medium text-[var(--brand-ink-on-primary)]',
                  'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)]'
                )}
              >
                {dictionary.podcast.emptyResetLabel}
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--grid-line)] desktop:h-full">
              {filteredEpisodes.map((episode) => {
                const isSelected = episode.id === activeEpisode.id;
                const isRowPlaying = isSelected && isPlaying;

                return (
                  <li
                    key={episode.id}
                    data-podcast-anim="track-item"
                    className="group flex items-center py-4 desktop:h-1/4 desktop:min-h-[76px] desktop:py-0"
                  >
                    <div className="flex w-full min-w-0 flex-col items-start gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectEpisode(episode.id, true)}
                        aria-label={`${getLocalizedText(episode.title, locale)} — ${
                          isRowPlaying
                            ? dictionary.podcast.pauseEpisodeAriaLabel
                            : dictionary.podcast.playEpisodeAriaLabel
                        }`}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 text-start"
                      >
                        <span
                          className={cn(
                            'text-[15px] leading-[1.4] transition-colors duration-200 desktop:text-[16px]',
                            'group-hover:text-[var(--brand-text-hover)]',
                            isSelected
                              ? 'font-medium text-[var(--brand-text-hover)]'
                              : 'font-normal text-[var(--ink-primary)]'
                          )}
                        >
                          {getLocalizedText(episode.title, locale)}
                        </span>

                        <AudioPlaybackIndicator
                          isPlaying={isRowPlaying}
                          isSelected={isSelected}
                        />
                      </button>

                      <div className="flex flex-wrap items-center gap-4 text-[12px] text-[var(--ink-muted)]">
                        <span className="inline-flex items-center gap-1.5">
                          <MdCalendarToday size={13} aria-hidden="true" />
                          <span dir="ltr" className="bidi-isolate tabular-nums">
                            {episode.publishedAt}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <MdSchedule size={14} aria-hidden="true" />
                          <span dir="ltr" className="bidi-isolate tabular-nums">
                            {episode.durationLabel}
                          </span>
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SmoothVerticalPane>

        {/* Band 3: Integrated Desktop / Fixed Mobile Waveform Player */}
        <PodcastPlayer
          episode={activeEpisode}
          isPlaying={isPlaying}
          currentTime={currentTime}
          playbackRate={playbackRate}
          isMuted={isMuted}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onPrevious={() => handleStepEpisode(-1)}
          onNext={() => handleStepEpisode(1)}
          onSeek={handleSeek}
          onCycleSpeed={handleCycleSpeed}
          onToggleMute={() => setIsMuted((prev) => !prev)}
        />
      </div>
    </div>
  );
}
