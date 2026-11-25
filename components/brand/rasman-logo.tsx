import { cn } from '@/lib/utils';

export type RasmanLogoVariant = 'full' | 'mark' | 'logotype' | 'wordmark';

export interface RasmanLogoProps {
  readonly variant?: RasmanLogoVariant;
  readonly className?: string;
  readonly label?: string;
}

const VIEWBOX_BY_VARIANT: Record<RasmanLogoVariant, string> = {
  full: '0 0 300 390',
  mark: '0 0 300 300',
  /** Tight optical trim around RASMAN (x:18..282, y:14..44) + ARCHITECTURE & DESIGN (y:58..67) */
  logotype: '16 12 268 58',
  wordmark: '16 12 268 34',
};

function RasmanMarkPaths() {
  return (
    <>
      <path d="M18 242V142C18 118 25 101 44.7 84.4L115.6 24.7C129.3 13.1 150.7 13.1 164.4 24.7L244 92.4V121.3L153.7 44.6C146.1 38.1 133.9 38.1 126.3 44.6L55.2 104.9C46.1 112.7 40 125.9 40 137.9V242A22 22 0 0 0 62 264H142C162 264 174 248 179 214C185 162 224 150 282 126C288 198 256 248 199 244C208 212 228 188 254 171C224 182 200 202 190 232C182 260 168 286 142 286H62A44 44 0 0 1 18 242Z" />
      <path d="M140 83L201.5 135.3L187.2 152.1L140 112L105.2 141.6Q96 149.4 96 161.4V240H74V163Q74 139 92.3 123.5Z" />
    </>
  );
}

function RasmanWordmarkPaths() {
  return (
    <>
      <g transform="translate(18, 0)" fill="currentColor">
        <path d="M0 0H3.6V30H0Z" />
        <path d="M3.6 0H14.2A9.2 9.2 0 0 1 14.2 18.4H13.8L24 30H19.3L9.1 18.4H8.2V14.8H14.2A5.6 5.6 0 0 0 14.2 3.6H3.6Z" />
      </g>
      <path
        transform="translate(64.8, 0)"
        fill="currentColor"
        d="M11.1 0H14.9L26 30H22L13 5.7L4 30H0Z"
      />
      <path
        transform="translate(113.6, 0)"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        d="M19.8 5.2C17.6 2.6 14.4 1.8 11 1.8C5.8 1.8 2.8 4.4 2.8 8C2.8 11.6 5.6 13.4 11.4 14.8C17.2 16.2 19.8 18.2 19.8 22C19.8 25.8 16.4 28.2 11 28.2C7 28.2 3.8 27 1.8 24.4"
      />
      <path
        transform="translate(158.4, 0)"
        fill="currentColor"
        d="M0 30V0H3.7L14.5 19.2L25.3 0H29V30H25.4V7.2L14.5 26.6L3.6 7.2V30Z"
      />
      <path
        transform="translate(210.2, 0)"
        fill="currentColor"
        d="M11.1 0H14.9L26 30H22L13 5.7L4 30H0Z"
      />
      <path
        transform="translate(259, 0)"
        fill="currentColor"
        d="M0 30V0H3.8L19.4 23.6V0H23V30H19.2L3.6 6.4V30Z"
      />
    </>
  );
}

function RasmanSubtitlePaths() {
  return (
    <>
      <path transform="translate(18.6, 0)" d="M0 9L4 0L8 9" />
      <path
        transform="translate(33.35, 0)"
        d="M0 9V0H4.5A2.4 2.4 0 0 1 4.5 4.8H0M4 4.8L7.2 9"
      />
      <path
        transform="translate(47.3, 0)"
        d="M7.68 1.32A4.5 4.5 0 1 0 7.68 7.68"
      />
      <path transform="translate(61.75, 0)" d="M0 0V9M7 0V9M0 4.5H7" />
      <path transform="translate(75.5, 0)" d="M0.3 0V9" />
      <path transform="translate(82.85, 0)" d="M0 0H7.4M3.7 0V9" />
      <path transform="translate(97, 0)" d="M6.4 0H0V9H6.4M0 4.5H5.5" />
      <path
        transform="translate(110.15, 0)"
        d="M7.68 1.32A4.5 4.5 0 1 0 7.68 7.68"
      />
      <path transform="translate(124.6, 0)" d="M0 0H7.4M3.7 0V9" />
      <path
        transform="translate(138.75, 0)"
        d="M0 0V5.6A3.5 3.4 0 0 0 7 5.6V0"
      />
      <path
        transform="translate(152.5, 0)"
        d="M0 9V0H4.5A2.4 2.4 0 0 1 4.5 4.8H0M4 4.8L7.2 9"
      />
      <path transform="translate(166.45, 0)" d="M6.4 0H0V9H6.4M0 4.5H5.5" />
      <path
        transform="translate(187.75, 0)"
        d="M7.4 9L2.1 3.1C1.2 2.1 1.6 0.2 3.4 0.2C5 0.2 5.4 1.6 4.6 2.8C3.8 4 0.7 4.7 0.7 6.7C0.7 8.3 2 9 3.6 9C5.4 9 6.6 7.4 7.5 5.3"
      />
      <path
        transform="translate(210.15, 0)"
        d="M0 0V9H3.2A4.5 4.5 0 0 0 3.2 0Z"
      />
      <path transform="translate(224.6, 0)" d="M6.4 0H0V9H6.4M0 4.5H5.5" />
      <path
        transform="translate(237.75, 0)"
        d="M6.4 1.5C5.6 0.4 4.5 0 3.3 0C1.5 0 0.4 0.9 0.4 2.2C0.4 3.5 1.4 4.1 3.5 4.6C5.6 5.1 6.6 5.8 6.6 7C6.6 8.3 5.4 9 3.4 9C2 9 0.9 8.5 0.2 7.6"
      />
      <path transform="translate(251.3, 0)" d="M0.3 0V9" />
      <path
        transform="translate(258.65, 0)"
        d="M7.68 1.32A4.5 4.5 0 1 0 9 4.5H4.8"
      />
      <path transform="translate(274.4, 0)" d="M0 9V0L7 9V0" />
    </>
  );
}

/**
 * Official pure-vector Rasman brand identity SVG (zero <text> elements so
 * geometry stays pixel-identical across LTR/RTL and all operating systems).
 * Inherits currentColor for seamless Light, Dark, and Projects Ambient themes.
 */
export function RasmanLogo({
  variant = 'logotype',
  className,
  label = 'Rasman — Architecture & Design',
}: RasmanLogoProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      direction="ltr"
      viewBox={VIEWBOX_BY_VARIANT[variant]}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('bidi-isolate block select-none', className)}
    >
      {(variant === 'full' || variant === 'mark') && (
        <g fill="currentColor">
          <RasmanMarkPaths />
        </g>
      )}

      {variant === 'full' && (
        <>
          <g transform="translate(0, 322)">
            <RasmanWordmarkPaths />
          </g>
          <g
            transform="translate(0, 366)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <RasmanSubtitlePaths />
          </g>
        </>
      )}

      {variant === 'logotype' && (
        <>
          <g transform="translate(0, 14)">
            <RasmanWordmarkPaths />
          </g>
          <g
            transform="translate(0, 58)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <RasmanSubtitlePaths />
          </g>
        </>
      )}

      {variant === 'wordmark' && (
        <g transform="translate(0, 14)">
          <RasmanWordmarkPaths />
        </g>
      )}
    </svg>
  );
}
