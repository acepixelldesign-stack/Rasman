import { cn } from '@/lib/utils';

export type CrosshairCorner =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

const CORNER_CLASS_MAP: Record<CrosshairCorner, string> = {
  'top-start': 'crosshair-top-start',
  'top-end': 'crosshair-top-end',
  'bottom-start': 'crosshair-bottom-start',
  'bottom-end': 'crosshair-bottom-end',
};

interface CrosshairMarkProps {
  readonly corner: CrosshairCorner;
  readonly className?: string;
}

/**
 * 13px x 13px architectural drafting '+' intersection mark.
 * Uses pure semantic span hairlines (zero SVG) locked to logical start/end grid corners.
 */
export function CrosshairMark({ corner, className }: CrosshairMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed z-50 block h-[13px] w-[13px]',
        CORNER_CLASS_MAP[corner],
        className
      )}
    >
      <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
      <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
    </span>
  );
}
