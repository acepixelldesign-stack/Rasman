import { RasmanLogo } from '@/components/brand/rasman-logo';
import { cn } from '@/lib/utils';

interface RasmanWordmarkProps {
  readonly className?: string;
  readonly label?: string;
}

/**
 * Official pure-vector Rasman wordmark ("RASMAN" without subtitle)
 * for the primary architectural header. Always remains LTR and inherits currentColor.
 */
export function RasmanWordmark({
  className,
  label = 'Rasman',
}: RasmanWordmarkProps) {
  return (
    <RasmanLogo
      variant="wordmark"
      label={label}
      className={cn('h-[18px] w-auto desktop:h-[20px]', className)}
    />
  );
}
