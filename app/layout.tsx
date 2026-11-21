import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost, Vazirmatn } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_CONFIG } from '@/lib/config/site';
import { AppProvider } from '@/components/providers/app-provider';
import './globals.css';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-persian',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-wordmark',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: SITE_CONFIG.metadata.title,
  description: SITE_CONFIG.metadata.description,
  other: {
    'color-scheme': 'only light',
  },
  openGraph: {
    title: SITE_CONFIG.metadata.title,
    description: SITE_CONFIG.metadata.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.metadata.title,
    description: SITE_CONFIG.metadata.description,
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html
      lang={SITE_CONFIG.defaultLocale}
      dir="ltr"
      className={`${jost.variable} ${vazirmatn.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
