'use client';

import { useCallback, useRef } from 'react';
import { useAppContext } from '@/components/providers/app-provider';
import { cn } from '@/lib/utils';

interface PodcastWaveformProps {
  readonly bars: readonly number[];
  readonly progress: number;
  readonly isPlaying: boolean;
  readonly onSeek: (ratio: number) => void;
}

/**
 * Fully responsive interactive vertical-bar audio waveform scrubber.
 * Renders 36 crisp evenly distributed bars on mobile (< sm) and 72 bars on sm+,
 * preventing horizontal overflow on narrow mobile screens while staying exact in LTR & RTL.
 */
export function PodcastWaveform({
  bars,
  progress,
  isPlaying,
  onSeek,
}: PodcastWaveformProps) {
  const { dictionary, isRtl } = useAppContext();
  const trackRef = useRef<HTMLDivElement>(null);

  const computeRatioFromClientX = useCallback(
    (clientX: number): number => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0) return 0;
      const raw = (clientX - rect.left) / rect.width;
      const clamped = Math.min(1, Math.max(0, raw));
      return isRtl ? 1 - clamped : clamped;
    },
    [isRtl]
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    onSeek(computeRatioFromClientX(event.clientX));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    onSeek(computeRatioFromClientX(event.clientX));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 0.05;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onSeek(Math.min(1, Math.max(0, progress + (isRtl ? -step : step))));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onSeek(Math.min(1, Math.max(0, progress + (isRtl ? step : -step))));
    } else if (event.key === 'Home') {
      event.preventDefault();
      onSeek(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      onSeek(1);
    }
  };

  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={dictionary.podcast.waveformSeekAriaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clampedProgress * 100)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      className="group relative flex h-9 min-w-0 w-full flex-1 cursor-pointer items-center justify-between overflow-hidden py-1 select-none touch-none desktop:h-10"
    >
      {bars.map((amplitude, idx) => {
        const barRatio = (idx + 0.5) / bars.length;
        const isPlayed = barRatio <= clampedProgress;
        const heightPercent = Math.round(amplitude * 100);

        return (
          <span
            key={idx}
            aria-hidden="true"
            style={{ height: `${heightPercent}%` }}
            className={cn(
              'w-[2px] shrink-0 rounded-full transition-colors duration-150',
              idx % 2 === 1 && 'hidden desktop:block',
              isPlayed
                ? isPlaying
                  ? 'bg-[var(--brand-primary)]'
                  : 'bg-[var(--ink-primary)]'
                : 'bg-[var(--grid-line-strong)] group-hover:bg-[var(--ink-muted)]'
            )}
          />
        );
      })}
    </div>
  );
}
