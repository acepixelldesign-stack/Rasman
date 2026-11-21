import { cn } from '@/lib/utils';

interface RasmanWordmarkProps {
  readonly className?: string;
  readonly label?: string;
}

/**
 * Formal English-only SVG logotype for Rasman.
 * Always remains in English regardless of active UI locale (LTR/RTL) and inherits currentColor.
 */
export function RasmanWordmark({
  className,
  label = 'Rasman',
}: RasmanWordmarkProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 132 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('bidi-isolate block h-[26px] w-auto desktop:h-[28px]', className)}
    >
      <text
        x="0"
        y="24"
        direction="ltr"
        fill="currentColor"
        style={{
          fontFamily: 'var(--font-wordmark), Georgia, "Times New Roman", serif',
          fontSize: '26px',
          fontWeight: 600,
          letterSpacing: '0.12em',
        }}
      >
        RASMAN
      </text>
    </svg>
  );
}
