'use client';

import type { ReactNode } from 'react';
import { useAppContext } from '@/components/providers/app-provider';

interface FramedSectionProps {
  readonly children?: ReactNode;
}

/**
 * Lightweight architectural stage wrapper rendered inside PersistentShell's central canvas.
 * Perimeter rails, header, crosshairs, and drawer stay mounted persistently across route transitions.
 */
export function FramedSection({ children }: FramedSectionProps) {
  const { dictionary } = useAppContext();

  return (
    <section
      aria-label={dictionary.stage.regionAriaLabel}
      className="relative min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full"
    >
      {children}
    </section>
  );
}
