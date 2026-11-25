import type { Metadata, Viewport } from 'next';
import '@fontsource/jost/latin-300.css';
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-500.css';
import '@fontsource/jost/latin-600.css';
import '@fontsource/jost/latin-700.css';
import '@fontsource/vazirmatn/arabic-300.css';
import '@fontsource/vazirmatn/arabic-400.css';
import '@fontsource/vazirmatn/arabic-500.css';
import '@fontsource/vazirmatn/arabic-600.css';
import '@fontsource/vazirmatn/arabic-700.css';
import '@fontsource/vazirmatn/latin-300.css';
import '@fontsource/vazirmatn/latin-400.css';
import '@fontsource/vazirmatn/latin-500.css';
import '@fontsource/vazirmatn/latin-600.css';
import '@fontsource/vazirmatn/latin-700.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_CONFIG } from '@/lib/config/site';
import { getCustomPersianFontCss } from '@/lib/fonts/persian-fonts';
import { AppProvider } from '@/components/providers/app-provider';
import './globals.css';

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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SITE_CONFIG.metadata.title,
  },
  other: {
    'color-scheme': 'only light',
    'darkreader-lock': 'true',
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
  const customPersianFontCss = getCustomPersianFontCss();

  return (
    <html
      lang={SITE_CONFIG.defaultLocale}
      dir="ltr"
      suppressHydrationWarning
    >
      <head>
        {customPersianFontCss ? (
          <style id="rasman-custom-persian-font">{customPersianFontCss}</style>
        ) : null}
      </head>
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
