'use client';

import {
  MdPause,
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
  MdVolumeOff,
  MdVolumeUp,
} from 'react-icons/md';
import { formatPlaybackTime, type PodcastEpisode } from '@/lib/data/podcasts';
import { useAppContext } from '@/components/providers/app-provider';
import { PodcastWaveform } from '@/components/podcast/podcast-waveform';
import { cn } from '@/lib/utils';

interface PodcastPlayerProps {
  readonly episode: PodcastEpisode;
  readonly isPlaying: boolean;
  readonly currentTime: number;
  readonly playbackRate: number;
  readonly isMuted: boolean;
  readonly onTogglePlay: () => void;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onSeek: (ratio: number) => void;
  readonly onCycleSpeed: () => void;
  readonly onToggleMute: () => void;
}

/**
 * Integrated audio waveform player:
 * - Zero hover backgrounds on icon buttons
 * - Compact solid filled circular speed button optically matched (24px) to the speaker icon (20px)
 * - Elapsed time (start) & total duration (end) flanking the responsive waveform slider
 * - Fixed bottom mobile layout: Slider on top row; Speed (start) | Prev·Play·Next (center) | Volume (end)
 */
export function PodcastPlayer({
  episode,
  isPlaying,
  currentTime,
  playbackRate,
  isMuted,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onCycleSpeed,
  onToggleMute,
}: PodcastPlayerProps) {
  const { dictionary, isRtl } = useAppContext();

  const progress =
    episode.durationSeconds > 0 ? currentTime / episode.durationSeconds : 0;

  const elapsedLabel = formatPlaybackTime(currentTime);
  const totalLabel = episode.durationLabel;

  const speedButton = (
    <button
      type="button"
      onClick={onCycleSpeed}
      aria-label={dictionary.podcast.playbackSpeedAriaLabel}
      className="group inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full"
    >
      <span
        dir="ltr"
        className={cn(
          'bidi-isolate inline-flex h-6 w-6 items-center justify-center rounded-full',
          'bg-[var(--ink-primary)] text-[9px] font-semibold leading-none tracking-tight text-[var(--bg-canvas)] tabular-nums',
          'transition-colors duration-200 group-hover:bg-[var(--brand-primary)] group-hover:text-[var(--brand-ink-on-primary)]'
        )}
      >
        {playbackRate}x
      </span>
    </button>
  );

  const volumeButton = (
    <button
      type="button"
      onClick={onToggleMute}
      aria-pressed={isMuted}
      aria-label={
        isMuted
          ? dictionary.podcast.unmuteAriaLabel
          : dictionary.podcast.muteAriaLabel
      }
      className={cn(
        'inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full',
        'text-[var(--ink-primary)] transition-colors duration-200',
        'hover:text-[var(--brand-text-hover)]'
      )}
    >
      {isMuted ? (
        <MdVolumeOff size={20} aria-hidden="true" />
      ) : (
        <MdVolumeUp size={20} aria-hidden="true" />
      )}
    </button>
  );

  const transportControls = (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onPrevious}
        aria-label={dictionary.podcast.previousEpisodeAriaLabel}
        className={cn(
          'inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full',
          'text-[var(--ink-primary)] transition-colors duration-200',
          'hover:text-[var(--brand-text-hover)]'
        )}
      >
        <MdSkipPrevious
          size={22}
          aria-hidden="true"
          className={cn(isRtl && '-scale-x-100')}
        />
      </button>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={
          isPlaying
            ? dictionary.podcast.pauseEpisodeAriaLabel
            : dictionary.podcast.playEpisodeAriaLabel
        }
        className={cn(
          'inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full',
          'transition-colors duration-200',
          isPlaying
            ? 'bg-[var(--brand-primary)] text-[var(--brand-ink-on-primary)] hover:bg-[var(--brand-primary-hover)]'
            : 'text-[var(--ink-primary)] hover:text-[var(--brand-text-hover)]'
        )}
      >
        {isPlaying ? (
          <MdPause size={26} aria-hidden="true" />
        ) : (
          <MdPlayArrow size={28} aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label={dictionary.podcast.nextEpisodeAriaLabel}
        className={cn(
          'inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full',
          'text-[var(--ink-primary)] transition-colors duration-200',
          'hover:text-[var(--brand-text-hover)]'
        )}
      >
        <MdSkipNext
          size={22}
          aria-hidden="true"
          className={cn(isRtl && '-scale-x-100')}
        />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Integrated Bottom Player (24px horizontal padding) */}
      <div
        data-podcast-anim="player"
        className="hidden shrink-0 items-center gap-6 border-t border-[var(--grid-line)] bg-[var(--bg-canvas)] px-6 py-4 desktop:flex"
      >
        {transportControls}

        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <span
            dir="ltr"
            className="bidi-isolate min-w-[40px] shrink-0 text-start text-[12px] font-normal tracking-[0.04em] text-[var(--ink-primary)] tabular-nums"
          >
            {elapsedLabel}
          </span>

          <PodcastWaveform
            bars={episode.waveform}
            progress={progress}
            isPlaying={isPlaying}
            onSeek={onSeek}
          />

          <span
            dir="ltr"
            className="bidi-isolate min-w-[40px] shrink-0 text-end text-[12px] font-normal tracking-[0.04em] text-[var(--ink-muted)] tabular-nums"
          >
            {totalLabel}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {volumeButton}
          {speedButton}
        </div>
      </div>

      {/* Mobile Fixed Bottom Player (pinned directly above the 16px bottom grid bar, 16px horizontal padding) */}
      <div
        data-podcast-anim="player"
        className={cn(
          'fixed bottom-[var(--grid-bottom)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-30',
          'border-t border-[var(--grid-line)] bg-[var(--bg-canvas)] px-4 pt-2.5 pb-2 desktop:hidden'
        )}
      >
        {/* Top Row: Elapsed Time (start) + Responsive Waveform Slider + Total Duration (end) */}
        <div className="flex w-full min-w-0 items-center gap-2">
          <span
            dir="ltr"
            className="bidi-isolate w-[34px] shrink-0 text-start text-[11px] font-normal text-[var(--ink-primary)] tabular-nums"
          >
            {elapsedLabel}
          </span>

          <PodcastWaveform
            bars={episode.waveform}
            progress={progress}
            isPlaying={isPlaying}
            onSeek={onSeek}
          />

          <span
            dir="ltr"
            className="bidi-isolate w-[34px] shrink-0 text-end text-[11px] font-normal text-[var(--ink-muted)] tabular-nums"
          >
            {totalLabel}
          </span>
        </div>

        {/* Bottom Row: Volume (start) | Prev · Play/Pause · Next (center) | Speed (end) */}
        <div className="mt-1 flex items-center justify-between">
          {volumeButton}
          {transportControls}
          {speedButton}
        </div>
      </div>
    </>
  );
}
