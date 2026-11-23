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
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { MotionConfig } from 'motion/react';
import {
  SITE_CONFIG,
  getDirectionForLocale,
  type Direction,
  type Locale,
  type ThemeMode,
} from '@/lib/config/site';
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionary';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { PersistentShell } from '@/components/frame/persistent-shell';

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
    if (raw === 'en' || raw === 'fa') {
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
  const { theme: resolvedNextTheme, setTheme: setNextTheme } = useTheme();

  const [announcement, setAnnouncement] = useState<string>('');
  const [isStartProjectOpen, setIsStartProjectOpen] = useState<boolean>(false);
  const [authenticatedPhone, setAuthenticatedPhone] = useState<string | null>(
    null
  );

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
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <MotionConfig reducedMotion="user">
        <SmoothScrollProvider isPaused={isStartProjectOpen}>
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
      enableColorScheme={true}
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
