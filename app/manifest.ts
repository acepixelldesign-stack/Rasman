import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.metadata.title,
    short_name: SITE_CONFIG.metadata.title,
    description: SITE_CONFIG.metadata.description,
    start_url: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: SITE_CONFIG.themeColors.default.light,
    theme_color: SITE_CONFIG.themeColors.default.light,
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
