import { RasmanLogo } from '@/components/brand/rasman-logo';
import { cn } from '@/lib/utils';

interface RasmanWordmarkProps {
  readonly className?: string;
  readonly label?: string;
}

/**
 * Official pure-vector Rasman logotype with subtitle ("ARCHITECTURE & DESIGN")
 * for the primary architectural header. Always remains LTR and inherits currentColor.
 */
export function RasmanWordmark({
  className,
  label = 'Rasman',
}: RasmanWordmarkProps) {
  return (
    <RasmanLogo
      variant="logotype"
      label={label}
      className={cn('h-[30px] w-auto desktop:h-[34px]', className)}
    />
  );
}
