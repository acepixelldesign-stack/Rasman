'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MdClose, MdKeyboardArrowDown } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  useAppContext,
  type AccountType,
  type UserRole,
} from '@/components/providers/app-provider';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { cn } from '@/lib/utils';

type AuthStep = 'phone' | 'otp' | 'register';

const OTP_LENGTH = SITE_CONFIG.auth.otpLength;
const VALID_OTP = SITE_CONFIG.auth.validOtpCode;
const RESEND_SECONDS = SITE_CONFIG.auth.resendCooldownSeconds;

const ACCOUNT_TYPES: readonly AccountType[] = ['individual', 'legal'];
const USER_ROLES: readonly UserRole[] = [
  'designer',
  'investor',
  'landowner',
  'client',
];

function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 0x0660));
}

function extractPhoneDigits(input: string): string {
  return normalizeDigits(input).replace(/\D/g, '');
}

function getDaysInMonth(
  yearStr: string,
  monthStr: string,
  isJalali: boolean
): number {
  const month = Number.parseInt(monthStr, 10);
  if (!Number.isFinite(month) || month < 1 || month > 12) {
    return 31;
  }

  if (isJalali) {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    const year = Number.parseInt(yearStr, 10);
    if (Number.isFinite(year)) {
      const leapRemainders = [1, 5, 9, 13, 17, 22, 26, 30];
      return leapRemainders.includes(year % 33) ? 30 : 29;
    }
    return 29;
  }

  const year = Number.parseInt(yearStr, 10);
  const safeYear = Number.isFinite(year) ? year : 2000;
  return new Date(safeYear, month, 0).getDate();
}

/**
 * Glassmorphic Start Project & Registration Flow:
 * - Mobile: Bottom-docked glassmorphic drawer rising cleanly inside the architectural side rails
 *   with '+' frame intersection crosshairs on both the drawer top edge and the docked bottom CTA bar
 * - Desktop: Centered glassmorphic modal with matching docked bottom CTA bar
 * - Step 1: Mobile number -> Step 2: 5-digit OTP ("11111") inside the same drawer -> Step 3: Registration
 * - Neutral monochrome inputs & buttons (no green hover/filled states)
 * - Birth Date: 3 selectable dropdowns (Year / Month / Day)
 * - User Role: 4-option dropdown including Client (Personal Project)
 */
export function StartProjectModal() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const {
    isStartProjectOpen,
    closeStartProjectModal,
    authenticatedPhone,
    setAuthenticatedPhone,
    setUserProfile,
    dictionary,
    locale,
    isRtl,
    announce,
  } = useAppContext();

  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => '')
  );
  const [otpError, setOtpError] = useState('');
  const [shakeCount, setShakeCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  // Registration Step State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [userRole, setUserRole] = useState<UserRole>('designer');
  const [focusedField, setFocusedField] = useState<
    'firstName' | 'lastName' | null
  >(null);
  const [registerErrors, setRegisterErrors] = useState<{
    firstName?: string;
    lastName?: string;
    birthDate?: string;
  }>({});

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const titleId = useId();
  const phoneFormId = useId();
  const otpFormId = useId();
  const registerFormId = useId();
  const phoneFieldId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const birthYearId = useId();
  const birthMonthId = useId();
  const birthDayId = useId();
  const userRoleId = useId();

  useBodyScrollLock(isStartProjectOpen);

  const isJalali = locale === 'fa';

  const yearOptions = useMemo(() => {
    const startYear = isJalali ? 1396 : 2016;
    const endYear = isJalali ? 1310 : 1930;
    const years: string[] = [];
    for (let y = startYear; y >= endYear; y -= 1) {
      years.push(String(y));
    }
    return years;
  }, [isJalali]);

  const maxBirthDays = useMemo(
    () => getDaysInMonth(birthYear, birthMonth, isJalali),
    [birthYear, birthMonth, isJalali]
  );

  const effectiveBirthDay =
    birthDay && Number.parseInt(birthDay, 10) > maxBirthDays ? '' : birthDay;

  const dayOptions = useMemo(
    () =>
      Array.from({ length: maxBirthDays }, (_, idx) =>
        String(idx + 1).padStart(2, '0')
      ),
    [maxBirthDays]
  );

  const isPhoneFloating = isPhoneFocused || phoneInput.length > 0;
  const isFirstNameFloating =
    focusedField === 'firstName' || firstName.length > 0;
  const isLastNameFloating = focusedField === 'lastName' || lastName.length > 0;

  const resetModalState = useCallback(() => {
    setIsPhoneFocused(false);
    setFocusedField(null);
    setPhoneError('');
    setOtpError('');
    setRegisterErrors({});
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setStep('phone');
  }, []);

  useEffect(() => {
    if (!isStartProjectOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeStartProjectModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStartProjectOpen, closeStartProjectModal]);

  useEffect(() => {
    if (!isStartProjectOpen || step !== 'otp') return;
    const timer = window.setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [isStartProjectOpen, step]);

  useEffect(() => {
    if (step !== 'otp' || cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, cooldown]);

  const handleClose = useCallback(() => {
    closeStartProjectModal();
    window.setTimeout(() => {
      resetModalState();
    }, 240);
  }, [closeStartProjectModal, resetModalState]);

  const handlePhoneSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = extractPhoneDigits(phoneInput);
    if (digits.length < SITE_CONFIG.auth.minPhoneDigits) {
      setPhoneError(dictionary.auth.phoneInvalidError);
      return;
    }

    setPhoneError('');
    setOtpError('');
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setCooldown(RESEND_SECONDS);
    setStep('otp');
    announce(dictionary.announcements.otpSent);
  };

  const verifyCode = useCallback(
    (code: string) => {
      if (code === VALID_OTP) {
        const cleanPhone = normalizeDigits(phoneInput).trim();
        setAuthenticatedPhone(cleanPhone);
        setOtpError('');
        setStep('register');
        announce(dictionary.announcements.authVerified);
        return;
      }

      setOtpError(dictionary.auth.otpInvalidError);
      setShakeCount((prev) => prev + 1);
    },
    [
      phoneInput,
      setAuthenticatedPhone,
      dictionary.announcements.authVerified,
      dictionary.auth.otpInvalidError,
      announce,
    ]
  );

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyCode(otpDigits.join(''));
  };

  const handleOtpChange = (index: number, rawValue: string) => {
    const normalized = normalizeDigits(rawValue).replace(/\D/g, '');
    setOtpError('');

    if (!normalized) {
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    if (normalized.length > 1) {
      const chars = normalized.slice(0, OTP_LENGTH).split('');
      const next = Array.from({ length: OTP_LENGTH }, (_, i) => chars[i] ?? '');
      setOtpDigits(next);
      const focusIndex = Math.min(chars.length, OTP_LENGTH - 1);
      otpRefs.current[focusIndex]?.focus();
      if (next.every((d) => d.length === 1)) {
        verifyCode(next.join(''));
      }
      return;
    }

    const digit = normalized.slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);

    if (index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (next.every((d) => d.length === 1)) {
      verifyCode(next.join(''));
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace') {
      if (otpDigits[index]) {
        const next = [...otpDigits];
        next[index] = '';
        setOtpDigits(next);
        setOtpError('');
      } else if (index > 0) {
        const next = [...otpDigits];
        next[index - 1] = '';
        setOtpDigits(next);
        setOtpError('');
        otpRefs.current[index - 1]?.focus();
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = normalizeDigits(
      event.clipboardData.getData('text')
    ).replace(/\D/g, '');
    if (!pasted) return;

    const chars = pasted.slice(0, OTP_LENGTH).split('');
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => chars[i] ?? '');
    setOtpDigits(next);
    setOtpError('');

    const focusIndex = Math.min(chars.length, OTP_LENGTH - 1);
    otpRefs.current[focusIndex]?.focus();
    if (next.every((d) => d.length === 1)) {
      verifyCode(next.join(''));
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setOtpError('');
    setCooldown(RESEND_SECONDS);
    otpRefs.current[0]?.focus();
    announce(dictionary.announcements.otpSent);
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    } = {};

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();

    if (!cleanFirst) {
      nextErrors.firstName = dictionary.auth.errors.firstNameRequired;
    }
    if (!cleanLast) {
      nextErrors.lastName = dictionary.auth.errors.lastNameRequired;
    }
    if (!birthYear || !birthMonth || !effectiveBirthDay) {
      nextErrors.birthDate = dictionary.auth.errors.birthDateRequired;
    }

    if (Object.keys(nextErrors).length > 0) {
      setRegisterErrors(nextErrors);
      return;
    }

    const formattedBirthDate = `${birthYear}/${birthMonth}/${effectiveBirthDay}`;
    const verifiedPhone =
      authenticatedPhone ?? normalizeDigits(phoneInput).trim();

    setUserProfile({
      firstName: cleanFirst,
      lastName: cleanLast,
      birthDate: formattedBirthDate,
      accountType,
      userRole,
      phone: verifiedPhone,
    });

    announce(dictionary.announcements.registrationCompleted);
    handleClose();
    router.push(SITE_CONFIG.routes.panel);
  };

  const activeTitle =
    step === 'phone'
      ? dictionary.auth.modalTitlePhone
      : step === 'otp'
        ? dictionary.auth.modalTitleOtp
        : dictionary.auth.modalTitleRegister;

  const isOtpComplete = otpDigits.every((digit) => digit.length === 1);
  const activeFormId =
    step === 'phone'
      ? phoneFormId
      : step === 'otp'
        ? otpFormId
        : registerFormId;

  const activeSubmitLabel =
    step === 'phone'
      ? dictionary.auth.sendOtpCta
      : step === 'otp'
        ? dictionary.auth.verifyOtpCta
        : dictionary.auth.registerSubmitCta;

  const isSubmitDisabled = step === 'otp' && !isOtpComplete;

  return (
    <AnimatePresence>
      {isStartProjectOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-smooth-prevent=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: prefersReducedMotion
              ? 0.01
              : SITE_CONFIG.motion.fastDuration,
            ease: SITE_CONFIG.motion.ease,
          }}
          className={cn(
            'fixed inset-0 z-50 flex items-end justify-center',
            'ps-[var(--grid-rail)] pe-[var(--grid-rail)] pb-[var(--grid-bottom)] pt-[var(--grid-header)]',
            'desktop:items-center desktop:p-6'
          )}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label={dictionary.auth.closeModalAriaLabel}
            onClick={handleClose}
            className="fixed inset-0 cursor-default bg-black/35 backdrop-blur-[3px] dark:bg-black/65"
          />

          {/* Mobile: Bottom Glassmorphic Drawer Framed Between Rails | Desktop: Centered Glassmorphic Modal */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 48 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 40 }
            }
            transition={{
              duration: prefersReducedMotion
                ? 0.01
                : SITE_CONFIG.motion.standardDuration,
              ease: SITE_CONFIG.motion.ease,
            }}
            className={cn(
              'relative z-10 flex max-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full flex-col',
              'border-t border-[var(--grid-line)]',
              'bg-[var(--bg-header-glass)] backdrop-blur-xl backdrop-saturate-150 [transform:translateZ(0)]',
              'desktop:max-h-[calc(100dvh-48px)] desktop:rounded-[4px] desktop:border desktop:border-[var(--grid-line-strong)]',
              step === 'register'
                ? 'desktop:max-w-[480px]'
                : 'desktop:max-w-[440px]',
              'shadow-[0_-16px_48px_rgba(0,0,0,0.14)] desktop:shadow-[0_24px_64px_rgba(0,0,0,0.16)]',
              'dark:shadow-[0_-16px_48px_rgba(0,0,0,0.55)] desktop:dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)]'
            )}
          >
            {/* Mobile Top Frame-Rail Intersection '+' Crosshairs */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] -start-[7px] z-[55] block h-[13px] w-[13px] desktop:hidden"
            >
              <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] -end-[7px] z-[55] block h-[13px] w-[13px] desktop:hidden"
            >
              <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
            </span>

            {/* Top Header Row (16px horizontal padding) */}
            <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-2">
              <h2
                id={titleId}
                className="text-[16px] font-medium leading-[1.3] text-[var(--ink-primary)]"
              >
                {activeTitle}
              </h2>

              <button
                type="button"
                onClick={handleClose}
                aria-label={dictionary.auth.closeModalAriaLabel}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--ink-primary)]"
              >
                <MdClose size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Step Body (16px horizontal padding) */}
            <div
              data-scroll-lock-allow=""
              className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-5"
            >
              <AnimatePresence mode="wait" initial={false}>
                {step === 'phone' && (
                  <motion.form
                    id={phoneFormId}
                    key="step-phone"
                    onSubmit={handlePhoneSubmit}
                    noValidate
                    initial={{ opacity: 0, x: isRtl ? 14 : -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? -14 : 14 }}
                    transition={{
                      duration: SITE_CONFIG.motion.fastDuration,
                      ease: SITE_CONFIG.motion.ease,
                    }}
                    className="flex flex-col gap-5"
                  >
                    <p className="text-[14px] leading-[1.65] text-[var(--ink-secondary)] rtl:leading-[1.85]">
                      {dictionary.auth.modalSubtitlePhone}
                    </p>

                    {/* Floating Label + Bottom Hairline Input */}
                    <div className="relative flex flex-col pt-5">
                      <label
                        htmlFor={phoneFieldId}
                        className={cn(
                          'pointer-events-none absolute start-0 transition-all duration-200 ease-out',
                          isPhoneFloating
                            ? 'top-0 text-[11px] font-medium tracking-[0.02em] rtl:tracking-normal'
                            : 'top-[28px] text-[15px] font-normal',
                          phoneError
                            ? 'text-red-500'
                            : isPhoneFocused
                              ? 'text-[var(--ink-primary)]'
                              : 'text-[var(--ink-muted)]'
                        )}
                      >
                        {dictionary.auth.phoneLabel}
                      </label>
                      <input
                        id={phoneFieldId}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phoneInput}
                        onFocus={() => setIsPhoneFocused(true)}
                        onBlur={() => setIsPhoneFocused(false)}
                        onChange={(event) => {
                          setPhoneInput(event.target.value);
                          if (phoneError) setPhoneError('');
                        }}
                        aria-invalid={Boolean(phoneError)}
                        className={cn(
                          'h-10 w-full rounded-none border-0 border-b bg-transparent px-0 text-start text-[15px] tracking-[0.04em] text-[var(--ink-primary)] tabular-nums',
                          'transition-colors duration-200 focus:outline-none',
                          phoneError
                            ? 'border-red-500 focus:border-red-500'
                            : isPhoneFocused
                              ? 'border-[var(--ink-primary)]'
                              : 'border-[var(--grid-line-strong)] focus:border-[var(--ink-primary)]'
                        )}
                      />
                      {phoneError ? (
                        <p
                          role="alert"
                          className="pt-2 text-[12px] leading-[1.5] text-red-500"
                        >
                          {phoneError}
                        </p>
                      ) : null}
                    </div>
                  </motion.form>
                )}

                {step === 'otp' && (
                  <motion.form
                    id={otpFormId}
                    key="step-otp"
                    onSubmit={handleOtpSubmit}
                    noValidate
                    initial={{ opacity: 0, x: isRtl ? -14 : 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 14 : -14 }}
                    transition={{
                      duration: SITE_CONFIG.motion.fastDuration,
                      ease: SITE_CONFIG.motion.ease,
                    }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <p className="text-[14px] leading-[1.65] text-[var(--ink-secondary)] rtl:leading-[1.85]">
                        {dictionary.auth.modalSubtitleOtpPrefix}{' '}
                        <span
                          dir="ltr"
                          className="bidi-isolate font-medium text-[var(--ink-primary)] tabular-nums"
                        >
                          {normalizeDigits(phoneInput).trim()}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpError('');
                          setStep('phone');
                        }}
                        className="cursor-pointer text-[12px] font-medium text-[var(--ink-primary)] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                      >
                        {dictionary.auth.changePhoneLabel}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <motion.div
                        key={shakeCount}
                        animate={
                          shakeCount > 0
                            ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                            : { x: 0 }
                        }
                        transition={{ duration: 0.36 }}
                        dir="ltr"
                        className="grid grid-cols-5 gap-3"
                      >
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                            maxLength={OTP_LENGTH}
                            value={digit}
                            onChange={(event) =>
                              handleOtpChange(idx, event.target.value)
                            }
                            onKeyDown={(event) => handleOtpKeyDown(idx, event)}
                            onPaste={handleOtpPaste}
                            aria-label={`${dictionary.auth.otpLabel} ${idx + 1}`}
                            aria-invalid={Boolean(otpError)}
                            className={cn(
                              'h-12 w-full rounded-none border-0 border-b-[1.5px] bg-transparent text-center text-[22px] font-medium text-[var(--ink-primary)] tabular-nums',
                              'transition-colors duration-200 focus:outline-none',
                              otpError
                                ? 'border-red-500 focus:border-red-500'
                                : digit
                                  ? 'border-[var(--ink-primary)]'
                                  : 'border-[var(--grid-line-strong)] focus:border-[var(--ink-primary)]'
                            )}
                          />
                        ))}
                      </motion.div>

                      {otpError ? (
                        <p
                          role="alert"
                          className="text-center text-[12px] leading-[1.5] text-red-500"
                        >
                          {otpError}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-center text-center text-[12px] text-[var(--ink-muted)]">
                      {cooldown > 0 ? (
                        <span className="tabular-nums">
                          {dictionary.auth.resendInPrefix}{' '}
                          <span
                            dir="ltr"
                            className="bidi-isolate font-medium text-[var(--ink-secondary)]"
                          >
                            {cooldown}
                          </span>{' '}
                          {dictionary.auth.resendSecondsSuffix}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          className="cursor-pointer font-medium text-[var(--ink-primary)] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                        >
                          {dictionary.auth.resendCta}
                        </button>
                      )}
                    </div>
                  </motion.form>
                )}

                {step === 'register' && (
                  <motion.form
                    id={registerFormId}
                    key="step-register"
                    onSubmit={handleRegisterSubmit}
                    noValidate
                    initial={{ opacity: 0, x: isRtl ? -14 : 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 14 : -14 }}
                    transition={{
                      duration: SITE_CONFIG.motion.fastDuration,
                      ease: SITE_CONFIG.motion.ease,
                    }}
                    className="flex flex-col gap-5"
                  >
                    <p className="text-[13.5px] leading-[1.65] text-[var(--ink-secondary)] rtl:leading-[1.85]">
                      {dictionary.auth.modalSubtitleRegister}
                    </p>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 gap-4 desktop:grid-cols-2">
                      {/* First Name */}
                      <div className="relative flex flex-col pt-5">
                        <label
                          htmlFor={firstNameId}
                          className={cn(
                            'pointer-events-none absolute start-0 transition-all duration-200 ease-out',
                            isFirstNameFloating
                              ? 'top-0 text-[11px] font-medium'
                              : 'top-[28px] text-[14px] font-normal',
                            registerErrors.firstName
                              ? 'text-red-500'
                              : focusedField === 'firstName'
                                ? 'text-[var(--ink-primary)]'
                                : 'text-[var(--ink-muted)]'
                          )}
                        >
                          {dictionary.auth.firstNameLabel}
                        </label>
                        <input
                          id={firstNameId}
                          type="text"
                          autoComplete="given-name"
                          value={firstName}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(event) => {
                            setFirstName(event.target.value);
                            if (registerErrors.firstName) {
                              setRegisterErrors((prev) => ({
                                ...prev,
                                firstName: undefined,
                              }));
                            }
                          }}
                          aria-invalid={Boolean(registerErrors.firstName)}
                          className={cn(
                            'h-10 w-full rounded-none border-0 border-b bg-transparent px-0 text-start text-[14px] text-[var(--ink-primary)] transition-colors duration-200 focus:outline-none',
                            registerErrors.firstName
                              ? 'border-red-500'
                              : focusedField === 'firstName'
                                ? 'border-[var(--ink-primary)]'
                                : 'border-[var(--grid-line-strong)]'
                          )}
                        />
                        {registerErrors.firstName ? (
                          <p
                            role="alert"
                            className="pt-1.5 text-[11.5px] text-red-500"
                          >
                            {registerErrors.firstName}
                          </p>
                        ) : null}
                      </div>

                      {/* Last Name */}
                      <div className="relative flex flex-col pt-5">
                        <label
                          htmlFor={lastNameId}
                          className={cn(
                            'pointer-events-none absolute start-0 transition-all duration-200 ease-out',
                            isLastNameFloating
                              ? 'top-0 text-[11px] font-medium'
                              : 'top-[28px] text-[14px] font-normal',
                            registerErrors.lastName
                              ? 'text-red-500'
                              : focusedField === 'lastName'
                                ? 'text-[var(--ink-primary)]'
                                : 'text-[var(--ink-muted)]'
                          )}
                        >
                          {dictionary.auth.lastNameLabel}
                        </label>
                        <input
                          id={lastNameId}
                          type="text"
                          autoComplete="family-name"
                          value={lastName}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(event) => {
                            setLastName(event.target.value);
                            if (registerErrors.lastName) {
                              setRegisterErrors((prev) => ({
                                ...prev,
                                lastName: undefined,
                              }));
                            }
                          }}
                          aria-invalid={Boolean(registerErrors.lastName)}
                          className={cn(
                            'h-10 w-full rounded-none border-0 border-b bg-transparent px-0 text-start text-[14px] text-[var(--ink-primary)] transition-colors duration-200 focus:outline-none',
                            registerErrors.lastName
                              ? 'border-red-500'
                              : focusedField === 'lastName'
                                ? 'border-[var(--ink-primary)]'
                                : 'border-[var(--grid-line-strong)]'
                          )}
                        />
                        {registerErrors.lastName ? (
                          <p
                            role="alert"
                            className="pt-1.5 text-[11.5px] text-red-500"
                          >
                            {registerErrors.lastName}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Date of Birth: 3 Selectable Dropdowns (Day / Month / Year) */}
                    <div className="flex flex-col gap-2">
                      <span
                        className={cn(
                          'text-[11px] font-medium',
                          registerErrors.birthDate
                            ? 'text-red-500'
                            : 'text-[var(--ink-muted)]'
                        )}
                      >
                        {dictionary.auth.birthDateLabel}
                      </span>

                      <div className="grid grid-cols-3 gap-3">
                        {/* Day Select */}
                        <div className="relative">
                          <select
                            id={birthDayId}
                            aria-label={dictionary.auth.birthDayLabel}
                            value={effectiveBirthDay}
                            onChange={(event) => {
                              setBirthDay(event.target.value);
                              if (registerErrors.birthDate) {
                                setRegisterErrors((prev) => ({
                                  ...prev,
                                  birthDate: undefined,
                                }));
                              }
                            }}
                            aria-invalid={Boolean(registerErrors.birthDate)}
                            className={cn(
                              'h-10 w-full cursor-pointer appearance-none rounded-[4px] border bg-transparent ps-2.5 pe-7 text-start text-[13px] tabular-nums transition-colors duration-200 focus:outline-none',
                              effectiveBirthDay
                                ? 'text-[var(--ink-primary)]'
                                : 'text-[var(--ink-muted)]',
                              registerErrors.birthDate
                                ? 'border-red-500'
                                : 'border-[var(--grid-line-strong)] focus:border-[var(--ink-primary)]'
                            )}
                          >
                            <option
                              value=""
                              className="bg-[var(--bg-canvas)] text-[var(--ink-muted)]"
                            >
                              {dictionary.auth.birthDayLabel}
                            </option>
                            {dayOptions.map((day) => (
                              <option
                                key={day}
                                value={day}
                                className="bg-[var(--bg-canvas)] text-[var(--ink-primary)]"
                              >
                                {day}
                              </option>
                            ))}
                          </select>
                          <MdKeyboardArrowDown
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 end-2 -translate-y-1/2 text-[var(--ink-muted)]"
                          />
                        </div>

                        {/* Month Select */}
                        <div className="relative">
                          <select
                            id={birthMonthId}
                            aria-label={dictionary.auth.birthMonthLabel}
                            value={birthMonth}
                            onChange={(event) => {
                              setBirthMonth(event.target.value);
                              if (registerErrors.birthDate) {
                                setRegisterErrors((prev) => ({
                                  ...prev,
                                  birthDate: undefined,
                                }));
                              }
                            }}
                            aria-invalid={Boolean(registerErrors.birthDate)}
                            className={cn(
                              'h-10 w-full cursor-pointer appearance-none rounded-[4px] border bg-transparent ps-2.5 pe-7 text-start text-[13px] transition-colors duration-200 focus:outline-none',
                              birthMonth
                                ? 'text-[var(--ink-primary)]'
                                : 'text-[var(--ink-muted)]',
                              registerErrors.birthDate
                                ? 'border-red-500'
                                : 'border-[var(--grid-line-strong)] focus:border-[var(--ink-primary)]'
                            )}
                          >
                            <option
                              value=""
                              className="bg-[var(--bg-canvas)] text-[var(--ink-muted)]"
                            >
                              {dictionary.auth.birthMonthLabel}
                            </option>
                            {dictionary.auth.birthMonths.map((monthName, i) => {
                              const monthValue = String(i + 1).padStart(2, '0');
                              return (
                                <option
                                  key={monthValue}
                                  value={monthValue}
                                  className="bg-[var(--bg-canvas)] text-[var(--ink-primary)]"
                                >
                                  {monthName}
                                </option>
                              );
                            })}
                          </select>
                          <MdKeyboardArrowDown
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 end-2 -translate-y-1/2 text-[var(--ink-muted)]"
                          />
                        </div>

                        {/* Year Select */}
                        <div className="relative">
                          <select
                            id={birthYearId}
                            aria-label={dictionary.auth.birthYearLabel}
                            value={birthYear}
                            onChange={(event) => {
                              setBirthYear(event.target.value);
                              if (registerErrors.birthDate) {
                                setRegisterErrors((prev) => ({
                                  ...prev,
                                  birthDate: undefined,
                                }));
                              }
                            }}
                            aria-invalid={Boolean(registerErrors.birthDate)}
                            className={cn(
                              'h-10 w-full cursor-pointer appearance-none rounded-[4px] border bg-transparent ps-2.5 pe-7 text-start text-[13px] tabular-nums transition-colors duration-200 focus:outline-none',
                              birthYear
                                ? 'text-[var(--ink-primary)]'
                                : 'text-[var(--ink-muted)]',
                              registerErrors.birthDate
                                ? 'border-red-500'
                                : 'border-[var(--grid-line-strong)] focus:border-[var(--ink-primary)]'
                            )}
                          >
                            <option
                              value=""
                              className="bg-[var(--bg-canvas)] text-[var(--ink-muted)]"
                            >
                              {dictionary.auth.birthYearLabel}
                            </option>
                            {yearOptions.map((year) => (
                              <option
                                key={year}
                                value={year}
                                className="bg-[var(--bg-canvas)] text-[var(--ink-primary)]"
                              >
                                {year}
                              </option>
                            ))}
                          </select>
                          <MdKeyboardArrowDown
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 end-2 -translate-y-1/2 text-[var(--ink-muted)]"
                          />
                        </div>
                      </div>

                      {registerErrors.birthDate ? (
                        <p
                          role="alert"
                          className="text-[11.5px] text-red-500"
                        >
                          {registerErrors.birthDate}
                        </p>
                      ) : null}
                    </div>

                    {/* Account Type (Individual vs Corporate/Legal) */}
                    <div className="flex flex-col gap-2 pt-0.5">
                      <span className="text-[11px] font-medium text-[var(--ink-muted)]">
                        {dictionary.auth.accountTypeLabel}
                      </span>
                      <div
                        role="radiogroup"
                        aria-label={dictionary.auth.accountTypeLabel}
                        className="flex items-center rounded-[4px] bg-[var(--surface-hover)] p-1"
                      >
                        {ACCOUNT_TYPES.map((type) => {
                          const isSelected = accountType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => setAccountType(type)}
                              className={cn(
                                'relative flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[4px] text-[12px] font-medium transition-colors duration-200',
                                isSelected
                                  ? 'text-[var(--ink-primary)]'
                                  : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                              )}
                            >
                              {isSelected && (
                                <motion.span
                                  layoutId="register-account-type-thumb"
                                  transition={{
                                    duration: SITE_CONFIG.motion.fastDuration,
                                    ease: SITE_CONFIG.motion.ease,
                                  }}
                                  className="absolute inset-0 rounded-[4px] bg-[var(--glass-control-thumb)]"
                                />
                              )}
                              <span className="relative z-10">
                                {dictionary.auth.accountTypes[type]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* User Role Dropdown (4 Options including Client (Personal Project)) */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={userRoleId}
                        className="text-[11px] font-medium text-[var(--ink-muted)]"
                      >
                        {dictionary.auth.userRoleLabel}
                      </label>
                      <div className="relative">
                        <select
                          id={userRoleId}
                          value={userRole}
                          onChange={(event) =>
                            setUserRole(event.target.value as UserRole)
                          }
                          className={cn(
                            'h-10 w-full cursor-pointer appearance-none rounded-[4px] border border-[var(--grid-line-strong)] bg-transparent ps-3 pe-9 text-start text-[13.5px] font-normal text-[var(--ink-primary)]',
                            'transition-colors duration-200 focus:border-[var(--ink-primary)] focus:outline-none'
                          )}
                        >
                          {USER_ROLES.map((role) => (
                            <option
                              key={role}
                              value={role}
                              className="bg-[var(--bg-canvas)] text-[var(--ink-primary)]"
                            >
                              {dictionary.auth.userRoles[role]}
                            </option>
                          ))}
                        </select>
                        <MdKeyboardArrowDown
                          size={20}
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 end-2.5 -translate-y-1/2 text-[var(--ink-muted)]"
                        />
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Docked Sticky CTA Bar With Architectural '+' Crosshair Intersections */}
            <div className="relative shrink-0 border-t border-[var(--grid-line)] bg-[var(--bg-header-glass)] px-4 py-3 backdrop-blur-xl desktop:rounded-b-[4px]">
              {/* Top-Start & Top-End Frame Rail Intersection '+' Crosshairs */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-[7px] -start-[7px] z-[55] block h-[13px] w-[13px]"
              >
                <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
                <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-[7px] -end-[7px] z-[55] block h-[13px] w-[13px]"
              >
                <span className="absolute inset-y-0 start-[6px] block w-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
                <span className="absolute inset-x-0 top-[6px] block h-px bg-[var(--grid-crosshair)] transition-colors duration-200" />
              </span>

              <button
                type="submit"
                form={activeFormId}
                disabled={isSubmitDisabled}
                className={cn(
                  'flex h-[40px] w-full items-center justify-center rounded-[4px] px-4 text-[14px] font-medium leading-none transition-colors duration-200',
                  isSubmitDisabled
                    ? 'cursor-not-allowed bg-[var(--surface-hover)] text-[var(--ink-muted)]'
                    : 'cursor-pointer bg-[var(--btn-start-bg)] text-[var(--btn-start-ink)] hover:bg-[var(--btn-start-hover)] active:bg-[var(--btn-start-active)]'
                )}
              >
                {activeSubmitLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
