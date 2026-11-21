'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import {
  MdCalendarToday,
  MdCheck,
  MdFavorite,
  MdFavoriteBorder,
  MdHeadphones,
  MdKeyboardArrowDown,
  MdOutlineShare,
  MdPause,
  MdPlayArrow,
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
import { useArchitecturalEntrance } from '@/components/motion/architectural-motion';
import { PodcastSidebar } from '@/components/podcast/podcast-sidebar';
import { PodcastPlayer } from '@/components/podcast/podcast-player';
import { SmoothVerticalPane } from '@/components/providers/smooth-vertical-pane';
import { cn } from '@/lib/utils';

const PLAYBACK_RATES = [1, 1.25, 1.5, 2] as const;

/**
 * Full Rasman Podcast Studio composition inside the architectural frame:
 * - Desktop: docked start sidebar + animated episode hero + exact 4-row tracklist viewport + integrated bottom player
 * - Mobile: fixed Episodes bar right under header; expands vertically all the way to the bottom of the viewport
 *   with horizontal category chips (no divider under bar or chips) + live-filtered episodes + fixed bottom player
 */
export function PodcastStage() {
  const { locale, dictionary, isRtl, announce } = useAppContext();

  const [activeCategory, setActiveCategory] = useState<PodcastCategoryId>('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>(
    PODCAST_EPISODES[0].id
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(193);
  const [speedIndex, setSpeedIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [copiedEpisodeId, setCopiedEpisodeId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const mobilePanelId = useId();
  useArchitecturalEntrance(stageRef, { isRtl });
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

  const playbackRate = PLAYBACK_RATES[speedIndex] ?? 1;

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
      const list = filteredEpisodes.length > 0 ? filteredEpisodes : PODCAST_EPISODES;
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

  const handleToggleLike = useCallback((episodeId: string) => {
    setLikedIds((prev) => ({
      ...prev,
      [episodeId]: !prev[episodeId],
    }));
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

  return (
    <div
      ref={stageRef}
      aria-label={dictionary.podcast.regionAriaLabel}
      className={cn(
        'flex w-full flex-col bg-[var(--bg-canvas)] desktop:flex-row',
        'min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] pt-12 pb-[112px] desktop:pt-0 desktop:pb-0',
        'desktop:h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] desktop:overflow-hidden'
      )}
    >
      {/* Desktop Docked Start Architectural Sidebar */}
      <div className="hidden h-full w-[264px] shrink-0 border-e border-[var(--grid-line)] desktop:block desktop-wide:w-[304px]">
        <PodcastSidebar
          activeCategory={activeCategory}
          isCategoryOpen={isCategoryOpen}
          episodes={filteredEpisodes}
          activeEpisodeId={activeEpisode.id}
          onToggleCategoryOpen={() => setIsCategoryOpen((prev) => !prev)}
          onSelectCategory={(id) => handleSelectCategory(id, true)}
          onSelectEpisode={(id) => handleSelectEpisode(id, false)}
        />
      </div>

      {/* Mobile Fixed Episodes Bar + Full-Height Vertical Sliding Sheet (Exact Header Glass) */}
      <div
        className={cn(
          'fixed top-[var(--grid-header)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-[34]',
          'flex flex-col bg-[var(--bg-header-glass)] backdrop-blur-md backdrop-saturate-150 transition-colors duration-200 desktop:hidden',
          !isMobileFilterOpen && 'border-b border-[var(--grid-line)]'
        )}
      >
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen((prev) => !prev)}
          aria-expanded={isMobileFilterOpen}
          aria-controls={mobilePanelId}
          className={cn(
            'flex h-12 w-full shrink-0 cursor-pointer items-center justify-between gap-3 px-4 text-start',
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
              'inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-muted)] transition-transform duration-200',
              isMobileFilterOpen && 'rotate-180'
            )}
          >
            <MdKeyboardArrowDown size={20} />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isMobileFilterOpen && (
            <motion.div
              id={mobilePanelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height:
                  'calc(100dvh - var(--grid-header) - var(--grid-bottom) - 48px)',
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: SITE_CONFIG.motion.standardDuration,
                ease: SITE_CONFIG.motion.ease,
              }}
              className="flex flex-col overflow-hidden"
            >
              {/* Horizontal Category Chips (No divider under bar, no divider under chips) */}
              <div className="no-scrollbar flex shrink-0 items-center gap-2 overflow-x-auto px-4 pt-2 pb-3">
                {PODCAST_CATEGORIES.map((category) => {
                  const isActive = category.id === activeCategory;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelectCategory(category.id, false)}
                      aria-pressed={isActive}
                      className={cn(
                        'shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] leading-none whitespace-nowrap',
                        'transition-colors duration-200',
                        isActive
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] font-medium text-[var(--brand-ink-on-primary)]'
                          : 'border-[var(--grid-line-strong)] text-[var(--ink-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                      )}
                    >
                      {getLocalizedText(category.label, locale)}
                    </button>
                  );
                })}
              </div>

              {/* Full-Height Live-Filtered Episodes List */}
              <SmoothVerticalPane className="flex-1 overflow-y-auto px-4 pb-6">
                <ul className="divide-y divide-[var(--grid-line)]">
                  {filteredEpisodes.map((episode) => {
                    const isSelected = episode.id === activeEpisode.id;
                    return (
                      <li key={episode.id} className="py-3.5 first:pt-2">
                        <button
                          type="button"
                          onClick={() => handleSelectEpisode(episode.id, false, true)}
                          className="group flex w-full cursor-pointer items-center gap-3 text-start"
                        >
                          <span
                            className={cn(
                              'relative h-12 w-12 shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] ring-1 transition-all duration-200',
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
                              sizes="48px"
                              referrerPolicy="no-referrer"
                              className="object-cover"
                            />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span
                              className={cn(
                                'line-clamp-1 text-[13px] transition-colors duration-200 group-hover:text-[var(--brand-text-hover)]',
                                isSelected
                                  ? 'font-medium text-[var(--brand-text-hover)]'
                                  : 'font-normal text-[var(--ink-primary)]'
                              )}
                            >
                              {getLocalizedText(episode.title, locale)}
                            </span>
                            <span className="line-clamp-1 text-[11px] text-[var(--ink-muted)]">
                              {getLocalizedText(episode.subtitle, locale)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </SmoothVerticalPane>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Stage: Animated Hero + 4-Row Episode Tracklist + Waveform Player */}
      <div className="flex min-w-0 flex-1 flex-col bg-[var(--bg-canvas)] desktop:h-full desktop:overflow-hidden">
        {/* Band 1: Featured Episode Hero (Animated on Episode Selection) */}
        <div className="shrink-0 border-b border-[var(--grid-line)] px-4 py-5 desktop:px-8 desktop:py-6">
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
              className="flex flex-col gap-5 desktop:flex-row desktop:items-stretch desktop:gap-7"
            >
              {/* Square Episode Artwork */}
              <motion.div
                data-gsap="media"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: SITE_CONFIG.motion.standardDuration,
                  ease: SITE_CONFIG.motion.ease,
                }}
                className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-[4px] bg-[var(--surface-hover)] desktop:w-48 desktop-wide:w-52"
              >
                <Image
                  src={activeEpisode.coverImage}
                  alt={getLocalizedText(activeEpisode.coverAlt, locale)}
                  fill
                  priority
                  sizes="(max-width: 768px) 176px, 208px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </motion.div>

              {/* Episode Title, Synopsis, Duration & Speakers, and Actions */}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <h1
                    data-gsap="heading"
                    className="text-[clamp(1.2rem,1.9vw,1.65rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--ink-primary)] rtl:leading-[1.4] rtl:tracking-normal"
                  >
                    {getLocalizedText(activeEpisode.title, locale)}
                  </h1>

                  <p
                    data-gsap="body"
                    className="max-w-3xl text-[14px] leading-[1.65] text-[var(--ink-secondary)] rtl:leading-[1.85] desktop:text-[15px]"
                  >
                    {getLocalizedText(activeEpisode.description, locale)}
                  </p>

                  {/* Total Episode Duration + Speakers Row */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-[13px] text-[var(--ink-muted)]">
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

                {/* Listen/See Platforms + Share Button With Material Icon */}
                <div
                  data-gsap="control"
                  className="flex flex-wrap items-center justify-between gap-4 pt-1"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
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
                      'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-5',
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

        {/* Band 2: Episode Tracklist (4-row desktop viewport, zero 4th bottom divider until scrolled) */}
        <SmoothVerticalPane className="flex-1 overflow-y-auto px-4 desktop:px-8">
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
                const isLiked = Boolean(likedIds[episode.id]);
                const likeCount = episode.initialLikes + (isLiked ? 1 : 0);

                return (
                  <li
                    key={episode.id}
                    data-gsap="card"
                    className="group flex items-center justify-between gap-4 py-4 desktop:h-1/4 desktop:min-h-[76px] desktop:py-0"
                  >
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectEpisode(episode.id, false)}
                        className={cn(
                          'cursor-pointer text-start text-[15px] leading-[1.4] transition-colors duration-200 desktop:text-[16px]',
                          'group-hover:text-[var(--brand-text-hover)] hover:text-[var(--brand-text-hover)]',
                          isSelected
                            ? 'font-medium text-[var(--brand-text-hover)]'
                            : 'font-normal text-[var(--ink-primary)]'
                        )}
                      >
                        {getLocalizedText(episode.title, locale)}
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

                        <button
                          type="button"
                          onClick={() => handleToggleLike(episode.id)}
                          aria-pressed={isLiked}
                          aria-label={dictionary.podcast.likeEpisodeAriaLabel}
                          className={cn(
                            'inline-flex cursor-pointer items-center gap-1 rounded-full py-0.5 transition-colors duration-200',
                            'hover:text-[var(--brand-text-hover)]',
                            isLiked && 'text-[var(--brand-text-hover)]'
                          )}
                        >
                          {isLiked ? (
                            <MdFavorite size={14} aria-hidden="true" />
                          ) : (
                            <MdFavoriteBorder size={14} aria-hidden="true" />
                          )}
                          <span dir="ltr" className="bidi-isolate tabular-nums">
                            {likeCount}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Full-Radius Play / Pause Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectEpisode(episode.id, true)}
                      aria-label={
                        isRowPlaying
                          ? dictionary.podcast.pauseEpisodeAriaLabel
                          : dictionary.podcast.playEpisodeAriaLabel
                      }
                      className={cn(
                        'inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full',
                        'border transition-colors duration-200',
                        isRowPlaying
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-ink-on-primary)] hover:bg-[var(--brand-primary-hover)]'
                          : 'border-[var(--grid-line-strong)] text-[var(--ink-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-text-hover)]'
                      )}
                    >
                      {isRowPlaying ? (
                        <MdPause size={18} aria-hidden="true" />
                      ) : (
                        <MdPlayArrow size={20} aria-hidden="true" />
                      )}
                    </button>
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
