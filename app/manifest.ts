import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.metadata.title,
    short_name: SITE_CONFIG.metadata.title,
    description: SITE_CONFIG.metadata.description,
    start_url: '/',
    display: 'fullscreen',
    display_override: ['fullscreen', 'standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: SITE_CONFIG.themeColors.default.light,
    theme_color: SITE_CONFIG.themeColors.default.light,
  };
}
