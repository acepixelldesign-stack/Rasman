export type Locale = 'en' | 'fa' | 'ar';
export type Direction = 'ltr' | 'rtl';
export type ThemeMode = 'light' | 'dark';

export type NavItemId =
  | 'home'
  | 'sustainableArchitecture'
  | 'projects'
  | 'magazine'
  | 'podcast'
  | 'team'
  | 'contact';

export type NavSubItemId = 'urbanArchitecture' | 'sustainableProjects';

export interface NavSubItemConfig {
  readonly id: NavSubItemId;
  readonly href: string;
}

export interface NavItemConfig {
  readonly id: NavItemId;
  readonly href?: string;
  readonly children?: readonly NavSubItemConfig[];
}

export const SITE_CONFIG = {
  defaultLocale: 'en' as Locale,
  defaultTheme: 'light' as ThemeMode,
  supportedLocales: ['en', 'fa', 'ar'] as const,
  storageKeys: {
    locale: 'rasman.locale',
    theme: 'rasman.theme',
    userProfile: 'rasman.userProfile',
  },
  metadata: {
    title: 'Rasman',
    description:
      'Rasman — Architecture, Sustainable Design, and Spatial Research Studio.',
  },
  routes: {
    startProject: '#start-project',
    panel: '/panel',
    about: '/about',
    projects: '/projects',
    contact: '/contact',
    prefetch: [
      '/',
      '/about',
      '/team',
      '/projects',
      '/projects?mode=sustainable',
      '/projects?mode=urban',
      '/magazine',
      '/podcast',
      '/contact',
      '/panel',
    ] as const,
  },
  auth: {
    otpLength: 5,
    validOtpCode: '11111',
    resendCooldownSeconds: 60,
    minPhoneDigits: 10,
  },
  motion: {
    /** Architectural ease curve (Expo Out) for calm, perceptible motion */
    ease: [0.16, 1, 0.3, 1] as const,
    gsapEase: 'power3.out',
    fastDuration: 0.28,
    standardDuration: 0.56,
    slowDuration: 0.78,
    drawerDuration: 0.52,
    staggerItem: 0.085,
    staggerGroup: 0.11,
  },
  navigation: [
    { id: 'home', href: '/' },
    { id: 'sustainableArchitecture', href: '/projects?mode=sustainable' },
    {
      id: 'projects',
      children: [
        { id: 'urbanArchitecture', href: '/projects?mode=urban' },
        { id: 'sustainableProjects', href: '/projects?mode=sustainable' },
      ],
    },
    { id: 'magazine', href: '/magazine' },
    { id: 'podcast', href: '/podcast' },
    { id: 'team', href: '/about' },
    { id: 'contact', href: '/contact' },
  ] as readonly NavItemConfig[],
} as const;

export function getDirectionForLocale(locale: Locale): Direction {
  return locale === 'fa' || locale === 'ar' ? 'rtl' : 'ltr';
}
