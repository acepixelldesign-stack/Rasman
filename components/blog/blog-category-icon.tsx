import {
  MdApartment,
  MdArchitecture,
  MdAutoStories,
  MdEco,
  MdLayers,
} from 'react-icons/md';
import type { BlogCategoryId } from '@/lib/data/blog';

interface BlogCategoryIconProps {
  readonly categoryId: BlogCategoryId;
  readonly size?: number;
  readonly className?: string;
}

/**
 * Pure Material Design icon resolver for Blog/Magazine categories.
 */
export function BlogCategoryIcon({
  categoryId,
  size = 18,
  className,
}: BlogCategoryIconProps) {
  switch (categoryId) {
    case 'sustainable':
      return <MdEco size={size} className={className} aria-hidden="true" />;
    case 'materials':
      return (
        <MdArchitecture size={size} className={className} aria-hidden="true" />
      );
    case 'urban':
      return (
        <MdApartment size={size} className={className} aria-hidden="true" />
      );
    case 'theory':
      return (
        <MdAutoStories size={size} className={className} aria-hidden="true" />
      );
    case 'all':
    default:
      return <MdLayers size={size} className={className} aria-hidden="true" />;
  }
}
