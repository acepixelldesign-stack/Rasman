'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { MotionConfig } from 'motion/react';
import {
  SITE_CONFIG,
  getDirectionForLocale,
  type Direction,
  type Locale,
  type ThemeMode,
} from '@/lib/config/site';
import type { ProjectMode } from '@/lib/data/projects';
import { MOTION_TRANSITIONS } from '@/lib/motion/system';
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionary';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { PersistentShell } from '@/components/frame/persistent-shell';
import { RasmanEntryLoader } from '@/components/motion/rasman-entry-loader';
import {
  getScrollLockClientSnapshot,
  getScrollLockServerSnapshot,
  subscribeScrollLock,
} from '@/hooks/use-body-scroll-lock';

const StartProjectModal = dynamic(() =>
  import('@/components/auth/start-project-modal').then(
    (mod) => mod.StartProjectModal
  )
);

export type AccountType = 'individual' | 'legal';
export type UserRole = 'designer' | 'investor' | 'landowner';

export interface UserProfile {
  readonly firstName: string;
  readonly lastName: string;
  readonly birthDate: string;
  readonly accountType: AccountType;
  readonly userRole: UserRole;
  readonly phone: string;
}

interface AppPreferencesState {
  locale: Locale;
  userProfile: UserProfile | null;
}

const DEFAULT_PREFERENCES: AppPreferencesState = {
  locale: SITE_CONFIG.defaultLocale,
  userProfile: null,
};

let clientInitialized = false;
let currentPreferences: AppPreferencesState = DEFAULT_PREFERENCES;
const listeners = new Set<() => void>();

function readStoredLocale(): Locale {
  try {
    const raw = window.localStorage.getItem(SITE_CONFIG.storageKeys.locale);
    if (raw === 'en' || raw === 'fa' || raw === 'ar') {
      return raw;
    }
  } catch {
    // Gracefully degrade if storage is unavailable in restricted contexts
  }
  return SITE_CONFIG.defaultLocale;
}

function readStoredUserProfile(): UserProfile | null {
  try {
    const raw = window.localStorage.getItem(SITE_CONFIG.storageKeys.userProfile);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (
      typeof parsed.firstName === 'string' &&
      typeof parsed.lastName === 'string' &&
      typeof parsed.birthDate === 'string' &&
      (parsed.accountType === 'individual' || parsed.accountType === 'legal') &&
      (parsed.userRole === 'designer' ||
        parsed.userRole === 'investor' ||
        parsed.userRole === 'landowner') &&
      typeof parsed.phone === 'string'
    ) {
      return {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        birthDate: parsed.birthDate,
        accountType: parsed.accountType,
        userRole: parsed.userRole,
        phone: parsed.phone,
      };
    }
  } catch {
    // Ignore invalid JSON or unavailable storage
  }
  return null;
}

function hydrateClientPreferencesFromStorage(): void {
  if (clientInitialized || typeof window === 'undefined') {
    return;
  }
  clientInitialized = true;
  const storedLocale = readStoredLocale();
  const storedProfile = readStoredUserProfile();
  if (
    storedLocale !== currentPreferences.locale ||
    storedProfile !== currentPreferences.userProfile
  ) {
    currentPreferences = {
      locale: storedLocale,
      userProfile: storedProfile,
    };
    emitPreferencesChange();
  }
}

function emitPreferencesChange(): void {
  listeners.forEach((listener) => listener());
}

function subscribePreferences(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot(): AppPreferencesState {
  return currentPreferences;
}

function getServerSnapshot(): AppPreferencesState {
  return DEFAULT_PREFERENCES;
}

function updateStoredPreferences(partial: Partial<AppPreferencesState>): void {
  clientInitialized = true;
  currentPreferences = {
    ...currentPreferences,
    ...partial,
  };

  try {
    if (partial.locale !== undefined) {
      window.localStorage.setItem(SITE_CONFIG.storageKeys.locale, partial.locale);
    }
    if (partial.userProfile !== undefined) {
      if (partial.userProfile === null) {
        window.localStorage.removeItem(SITE_CONFIG.storageKeys.userProfile);
      } else {
        window.localStorage.setItem(
          SITE_CONFIG.storageKeys.userProfile,
          JSON.stringify(partial.userProfile)
        );
      }
    }
  } catch {
    // Ignore storage write errors in privacy-restricted environments
  }

  emitPreferencesChange();
}

let isClientMounted = false;
const mountedListeners = new Set<() => void>();

function subscribeMounted(listener: () => void): () => void {
  mountedListeners.add(listener);
  return () => {
    mountedListeners.delete(listener);
  };
}

function getMountedClientSnapshot(): boolean {
  return isClientMounted;
}

function getMountedServerSnapshot(): boolean {
  return false;
}

function markClientMounted(): void {
  if (isClientMounted) return;
  isClientMounted = true;
  mountedListeners.forEach((listener) => listener());
}

function hasPendingSuspenseTemplates(): boolean {
  if (typeof document === 'undefined') return false;
  return document.querySelector('template[id^="B:"]') !== null;
}

/**
 * Commit client-stored locale, profile, and mounted theme only after streamed
 * Suspense route boundaries have finished hydrating so client renders match SSR HTML.
 */
export function markRouteContentHydrated(): void {
  if (typeof window === 'undefined') return;
  if (clientInitialized && isClientMounted) return;
  if (hasPendingSuspenseTemplates()) return;

  hydrateClientPreferencesFromStorage();
  markClientMounted();
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest('input, textarea, [contenteditable="true"]')
  );
}

interface AppContextValue {
  readonly locale: Locale;
  readonly dir: Direction;
  readonly isRtl: boolean;
  readonly theme: ThemeMode;
  readonly isDark: boolean;
  readonly dictionary: Dictionary;
  readonly setLocale: (nextLocale: Locale) => void;
  readonly setTheme: (nextTheme: ThemeMode) => void;
  readonly toggleTheme: () => void;
  readonly announce: (message: string) => void;
  readonly isStartProjectOpen: boolean;
  readonly openStartProjectModal: () => void;
  readonly closeStartProjectModal: () => void;
  readonly authenticatedPhone: string | null;
  readonly setAuthenticatedPhone: (phone: string | null) => void;
  readonly userProfile: UserProfile | null;
  readonly setUserProfile: (profile: UserProfile | null) => void;
  readonly signOut: () => void;
  readonly ambientMode: ProjectMode | null;
  readonly setAmbientMode: (mode: ProjectMode | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function AppProviderInner({ children }: { readonly children: ReactNode }) {
  const preferences = useSyncExternalStore(
    subscribePreferences,
    getClientSnapshot,
    getServerSnapshot
  );
  const isHydrated = useSyncExternalStore(
    subscribeMounted,
    getMountedClientSnapshot,
    getMountedServerSnapshot
  );
  const isScrollLocked = useSyncExternalStore(
    subscribeScrollLock,
    getScrollLockClientSnapshot,
    getScrollLockServerSnapshot
  );
  const { theme: resolvedNextTheme, setTheme: setNextTheme } = useTheme();
  const pathname = usePathname();

  const [announcement, setAnnouncement] = useState<string>('');
  const [isStartProjectOpen, setIsStartProjectOpen] = useState<boolean>(false);
  const [authenticatedPhone, setAuthenticatedPhone] = useState<string | null>(
    null
  );
  const [ambientMode, setAmbientMode] = useState<ProjectMode | null>(null);

  const isProjectsRoute =
    pathname === '/projects' || pathname.startsWith('/projects/');
  const effectiveAmbientMode: ProjectMode | null = isProjectsRoute
    ? ambientMode
    : null;

  useEffect(() => {
    if (clientInitialized && isClientMounted) return;

    let rafId: number | null = null;
    let observer: MutationObserver | null = null;

    const trySync = () => {
      if (hasPendingSuspenseTemplates()) return false;
      markRouteContentHydrated();
      return true;
    };

    const scheduleAfterCommit = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        trySync();
      });
    };

    if (hasPendingSuspenseTemplates()) {
      observer = new MutationObserver(() => {
        if (!hasPendingSuspenseTemplates()) {
          observer?.disconnect();
          observer = null;
          scheduleAfterCommit();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      scheduleAfterCommit();
    }

    const fallbackTimer = window.setTimeout(() => {
      observer?.disconnect();
      observer = null;
      hydrateClientPreferencesFromStorage();
      markClientMounted();
    }, 600);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      observer?.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const { locale, userProfile } = preferences;
  const theme: ThemeMode =
    isHydrated && resolvedNextTheme === 'dark' ? 'dark' : 'light';
  const dir = getDirectionForLocale(locale);
  const isRtl = dir === 'rtl';
  const isDark = theme === 'dark';
  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
  }, [locale, dir]);

  // Sync full-viewport Projects ambient mode, OS-immune color-scheme, & cross-browser toolbar/status bar color
  useEffect(() => {
    const root = document.documentElement;
    const isDarkSurface = Boolean(effectiveAmbientMode) || theme === 'dark';
    const lockedColorScheme = isDarkSurface ? 'only dark' : 'only light';

    if (effectiveAmbientMode) {
      root.dataset.ambientMode = effectiveAmbientMode;
    } else {
      delete root.dataset.ambientMode;
    }

    const paletteKey = effectiveAmbientMode ?? 'default';
    const targetColor = SITE_CONFIG.themeColors[paletteKey][theme];

    // Explicitly lock color-scheme & canvas background so no OS dark/light mode or force-dark alters colors
    root.style.colorScheme = lockedColorScheme;
    root.style.backgroundColor = targetColor;
    if (document.body) {
      document.body.style.backgroundColor = targetColor;
    }

    const head = document.head;
    if (!head) return;

    // Keep meta[name="color-scheme"] and meta[name="supported-color-schemes"] synchronized in-place
    const syncColorSchemeMeta = (metaName: string) => {
      const existingTags = head.querySelectorAll<HTMLMetaElement>(
        `meta[name="${metaName}"]`
      );
      if (existingTags.length > 0) {
        existingTags.forEach((tag) => {
          tag.setAttribute('content', lockedColorScheme);
        });
      } else {
        const tag = document.createElement('meta');
        tag.name = metaName;
        tag.content = lockedColorScheme;
        tag.dataset.rasmanManaged = 'true';
        head.appendChild(tag);
      }
    };
    syncColorSchemeMeta('color-scheme');
    syncColorSchemeMeta('supported-color-schemes');

    // Update any non-managed theme-color tags in-place (never call remove on React-managed nodes)
    head
      .querySelectorAll<HTMLMetaElement>(
        'meta[name="theme-color"]:not([data-rasman-managed="true"])'
      )
      .forEach((tag) => {
        tag.setAttribute('content', targetColor);
      });

    // Replace only our own managed theme-color tags (covering BOTH OS light & OS dark media queries + unscoped)
    // so Safari, Chrome, Edge, Firefox, and Samsung Internet ALWAYS apply the exact color in every OS theme.
    head
      .querySelectorAll<HTMLMetaElement>(
        'meta[name="theme-color"][data-rasman-managed="true"]'
      )
      .forEach((tag) => {
        if (tag.parentNode === head) {
          head.removeChild(tag);
        }
      });

    const themeMetaSpecs: readonly { readonly media?: string }[] = [
      { media: '(prefers-color-scheme: light)' },
      { media: '(prefers-color-scheme: dark)' },
      {},
    ];

    themeMetaSpecs.forEach((spec) => {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      if (spec.media) {
        meta.media = spec.media;
      }
      meta.content = targetColor;
      meta.dataset.rasmanManaged = 'true';
      head.appendChild(meta);
    });

    let msNavMeta = head.querySelector<HTMLMetaElement>(
      'meta[name="msapplication-navbutton-color"][data-rasman-managed="true"]'
    );
    if (!msNavMeta) {
      msNavMeta = document.createElement('meta');
      msNavMeta.name = 'msapplication-navbutton-color';
      msNavMeta.dataset.rasmanManaged = 'true';
      head.appendChild(msNavMeta);
    }
    msNavMeta.content = targetColor;

    // Keep Apple iOS status bar readable in both light and dark/ambient surfaces
    head
      .querySelectorAll<HTMLMetaElement>(
        'meta[name="apple-mobile-web-app-status-bar-style"]'
      )
      .forEach((tag) => {
        tag.setAttribute(
          'content',
          isDarkSurface ? 'black-translucent' : 'default'
        );
      });
  }, [effectiveAmbientMode, theme]);

  // Content copy & image drag protection (while preserving copy/paste inside form inputs)
  useEffect(() => {
    const preventCopy = (event: ClipboardEvent) => {
      if (isEditableElement(event.target)) return;
      event.preventDefault();
    };

    const preventContextMenu = (event: MouseEvent) => {
      if (isEditableElement(event.target)) return;
      event.preventDefault();
    };

    const preventDrag = (event: DragEvent) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('dragstart', preventDrag);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('dragstart', preventDrag);
    };
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    updateStoredPreferences({ locale: nextLocale });
    const nextDict = getDictionary(nextLocale);
    setAnnouncement(nextDict.announcements.switchedLocale);
  }, []);

  const setTheme = useCallback(
    (nextTheme: ThemeMode) => {
      setNextTheme(nextTheme);
      const activeDict = getDictionary(currentPreferences.locale);
      setAnnouncement(
        nextTheme === 'dark'
          ? activeDict.announcements.switchedToDark
          : activeDict.announcements.switchedToLight
      );
    },
    [setNextTheme]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const openStartProjectModal = useCallback(() => {
    setIsStartProjectOpen(true);
    const activeDict = getDictionary(currentPreferences.locale);
    setAnnouncement(activeDict.announcements.authModalOpened);
  }, []);

  const closeStartProjectModal = useCallback(() => {
    setIsStartProjectOpen(false);
    const activeDict = getDictionary(currentPreferences.locale);
    setAnnouncement(activeDict.announcements.authModalClosed);
  }, []);

  const setUserProfile = useCallback((profile: UserProfile | null) => {
    updateStoredPreferences({ userProfile: profile });
    if (profile) {
      setAuthenticatedPhone(profile.phone);
    }
  }, []);

  const signOut = useCallback(() => {
    updateStoredPreferences({ userProfile: null });
    setAuthenticatedPhone(null);
  }, []);

  const contextValue = useMemo<AppContextValue>(
    () => ({
      locale,
      dir,
      isRtl,
      theme,
      isDark,
      dictionary,
      setLocale,
      setTheme,
      toggleTheme,
      announce,
      isStartProjectOpen,
      openStartProjectModal,
      closeStartProjectModal,
      authenticatedPhone: userProfile?.phone ?? authenticatedPhone,
      setAuthenticatedPhone,
      userProfile,
      setUserProfile,
      signOut,
      ambientMode: effectiveAmbientMode,
      setAmbientMode,
    }),
    [
      locale,
      dir,
      isRtl,
      theme,
      isDark,
      dictionary,
      setLocale,
      setTheme,
      toggleTheme,
      announce,
      isStartProjectOpen,
      openStartProjectModal,
      closeStartProjectModal,
      authenticatedPhone,
      userProfile,
      setUserProfile,
      signOut,
      effectiveAmbientMode,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <MotionConfig reducedMotion="user" transition={MOTION_TRANSITIONS.base}>
        <RasmanEntryLoader />
        <SmoothScrollProvider isPaused={isStartProjectOpen || isScrollLocked}>
          <PersistentShell>{children}</PersistentShell>
        </SmoothScrollProvider>
        {isHydrated || isStartProjectOpen ? <StartProjectModal /> : null}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
      </MotionConfig>
    </AppContext.Provider>
  );
}

export function AppProvider({ children }: { readonly children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={SITE_CONFIG.defaultTheme}
      themes={['light', 'dark']}
      enableSystem={false}
      enableColorScheme={false}
      storageKey={SITE_CONFIG.storageKeys.theme}
    >
      <AppProviderInner>{children}</AppProviderInner>
    </NextThemesProvider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return ctx;
}
