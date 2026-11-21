'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { MdClose } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import {
  useAppContext,
  type AccountType,
  type UserRole,
} from '@/components/providers/app-provider';
import { cn } from '@/lib/utils';

type AuthStep = 'phone' | 'otp' | 'register';

const OTP_LENGTH = SITE_CONFIG.auth.otpLength;
const VALID_OTP = SITE_CONFIG.auth.validOtpCode;
const RESEND_SECONDS = SITE_CONFIG.auth.resendCooldownSeconds;

const ACCOUNT_TYPES: readonly AccountType[] = ['individual', 'legal'];
const USER_ROLES: readonly UserRole[] = ['designer', 'investor', 'landowner'];

function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 0x0660));
}

function extractPhoneDigits(input: string): string {
  return normalizeDigits(input).replace(/\D/g, '');
}

function isValidBirthDate(input: string): boolean {
  const digits = normalizeDigits(input).replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 8;
}

/**
 * Centered Glassmorphic Start Project & Registration Modal:
 * - Step 1: Mobile number input (Apple-style floating label + underline divider)
 * - Step 2: 5-digit OTP verification ("11111")
 * - Step 3: Registration (First Name, Last Name, Birth Date, Account Type, User Role) -> redirects to /panel
 */
export function StartProjectModal() {
  const router = useRouter();
  const {
    isStartProjectOpen,
    closeStartProjectModal,
    authenticatedPhone,
    setAuthenticatedPhone,
    setUserProfile,
    dictionary,
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
  const [birthDate, setBirthDate] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [userRole, setUserRole] = useState<UserRole>('designer');
  const [focusedField, setFocusedField] = useState<
    'firstName' | 'lastName' | 'birthDate' | null
  >(null);
  const [registerErrors, setRegisterErrors] = useState<{
    firstName?: string;
    lastName?: string;
    birthDate?: string;
  }>({});

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const titleId = useId();
  const phoneFieldId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const birthDateId = useId();

  const isPhoneFloating = isPhoneFocused || phoneInput.length > 0;
  const isFirstNameFloating =
    focusedField === 'firstName' || firstName.length > 0;
  const isLastNameFloating = focusedField === 'lastName' || lastName.length > 0;
  const isBirthDateFloating =
    focusedField === 'birthDate' || birthDate.length > 0;

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
    const cleanBirth = normalizeDigits(birthDate).trim();

    if (!cleanFirst) {
      nextErrors.firstName = dictionary.auth.errors.firstNameRequired;
    }
    if (!cleanLast) {
      nextErrors.lastName = dictionary.auth.errors.lastNameRequired;
    }
    if (!isValidBirthDate(cleanBirth)) {
      nextErrors.birthDate = dictionary.auth.errors.birthDateRequired;
    }

    if (Object.keys(nextErrors).length > 0) {
      setRegisterErrors(nextErrors);
      return;
    }

    const verifiedPhone =
      authenticatedPhone ?? normalizeDigits(phoneInput).trim();

    setUserProfile({
      firstName: cleanFirst,
      lastName: cleanLast,
      birthDate: cleanBirth,
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
            duration: SITE_CONFIG.motion.fastDuration,
            ease: SITE_CONFIG.motion.ease,
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 desktop:p-6"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label={dictionary.auth.closeModalAriaLabel}
            onClick={handleClose}
            className="fixed inset-0 cursor-default bg-black/35 backdrop-blur-[3px] dark:bg-black/65"
          />

          {/* Centered Glassmorphic Card */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{
              duration: SITE_CONFIG.motion.standardDuration,
              ease: SITE_CONFIG.motion.ease,
            }}
            className={cn(
              'relative z-10 max-h-[calc(100dvh-32px)] w-full overflow-y-auto rounded-[4px]',
              step === 'register' ? 'max-w-[480px]' : 'max-w-[440px]',
              'border border-[var(--grid-line-strong)]',
              'bg-[var(--bg-header-glass)] backdrop-blur-md backdrop-saturate-150',
              'shadow-[0_24px_64px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)]'
            )}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
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
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors duration-200 hover:text-[var(--brand-text-hover)]"
              >
                <MdClose size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Step Body */}
            <div className="px-6 pt-3 pb-7">
              <AnimatePresence mode="wait" initial={false}>
                {step === 'phone' && (
                  <motion.form
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
                    className="flex flex-col gap-6"
                  >
                    <p className="text-[14px] leading-[1.65] text-[var(--ink-secondary)] rtl:leading-[1.85]">
                      {dictionary.auth.modalSubtitlePhone}
                    </p>

                    {/* Apple-style Floating Label + Bottom Divider Input */}
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
                              ? 'text-[var(--brand-text-hover)]'
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
                              ? 'border-[var(--brand-primary)]'
                              : 'border-[var(--grid-line-strong)] focus:border-[var(--brand-primary)]'
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

                    <button
                      type="submit"
                      className={cn(
                        'mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-full px-6',
                        'bg-[var(--brand-primary)] text-[14px] font-medium text-[var(--brand-ink-on-primary)]',
                        'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
                      )}
                    >
                      {dictionary.auth.sendOtpCta}
                    </button>
                  </motion.form>
                )}

                {step === 'otp' && (
                  <motion.form
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
                        className="cursor-pointer text-[12px] font-medium text-[var(--brand-text-hover)] transition-opacity duration-200 hover:opacity-75"
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
                                  ? 'border-[var(--brand-primary)]'
                                  : 'border-[var(--grid-line-strong)] focus:border-[var(--brand-primary)]'
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
                          className="cursor-pointer font-medium text-[var(--brand-text-hover)] transition-opacity duration-200 hover:opacity-75"
                        >
                          {dictionary.auth.resendCta}
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!isOtpComplete}
                      className={cn(
                        'mt-1 flex h-12 w-full items-center justify-center rounded-full px-6 text-[14px] font-medium transition-colors duration-200',
                        isOtpComplete
                          ? 'cursor-pointer bg-[var(--brand-primary)] text-[var(--brand-ink-on-primary)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
                          : 'cursor-not-allowed bg-[var(--surface-hover)] text-[var(--ink-muted)]'
                      )}
                    >
                      {dictionary.auth.verifyOtpCta}
                    </button>
                  </motion.form>
                )}

                {step === 'register' && (
                  <motion.form
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
                                ? 'text-[var(--brand-text-hover)]'
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
                                ? 'border-[var(--brand-primary)]'
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
                                ? 'text-[var(--brand-text-hover)]'
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
                                ? 'border-[var(--brand-primary)]'
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

                    {/* Date of Birth */}
                    <div className="relative flex flex-col pt-5">
                      <label
                        htmlFor={birthDateId}
                        className={cn(
                          'pointer-events-none absolute start-0 transition-all duration-200 ease-out',
                          isBirthDateFloating
                            ? 'top-0 text-[11px] font-medium'
                            : 'top-[28px] text-[14px] font-normal',
                          registerErrors.birthDate
                            ? 'text-red-500'
                            : focusedField === 'birthDate'
                              ? 'text-[var(--brand-text-hover)]'
                              : 'text-[var(--ink-muted)]'
                        )}
                      >
                        {dictionary.auth.birthDateLabel}
                      </label>
                      <input
                        id={birthDateId}
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        placeholder={
                          focusedField === 'birthDate'
                            ? dictionary.auth.birthDatePlaceholder
                            : ''
                        }
                        value={birthDate}
                        onFocus={() => setFocusedField('birthDate')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(event) => {
                          setBirthDate(event.target.value);
                          if (registerErrors.birthDate) {
                            setRegisterErrors((prev) => ({
                              ...prev,
                              birthDate: undefined,
                            }));
                          }
                        }}
                        aria-invalid={Boolean(registerErrors.birthDate)}
                        className={cn(
                          'bidi-isolate h-10 w-full rounded-none border-0 border-b bg-transparent px-0 text-start text-[14px] text-[var(--ink-primary)] tabular-nums transition-colors duration-200 placeholder:text-[var(--ink-muted)]/60 focus:outline-none rtl:text-end',
                          registerErrors.birthDate
                            ? 'border-red-500'
                            : focusedField === 'birthDate'
                              ? 'border-[var(--brand-primary)]'
                              : 'border-[var(--grid-line-strong)]'
                        )}
                      />
                      {registerErrors.birthDate ? (
                        <p
                          role="alert"
                          className="pt-1.5 text-[11.5px] text-red-500"
                        >
                          {registerErrors.birthDate}
                        </p>
                      ) : null}
                    </div>

                    {/* Account Type (Individual vs Corporate/Legal) */}
                    <div className="flex flex-col gap-2 pt-1">
                      <span className="text-[11px] font-medium text-[var(--ink-muted)]">
                        {dictionary.auth.accountTypeLabel}
                      </span>
                      <div
                        role="radiogroup"
                        aria-label={dictionary.auth.accountTypeLabel}
                        className="flex items-center rounded-full bg-[var(--surface-hover)] p-1"
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
                                'relative flex h-8 flex-1 cursor-pointer items-center justify-center rounded-full text-[12px] font-medium transition-colors duration-200',
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
                                  className="absolute inset-0 rounded-full bg-[var(--glass-control-thumb)]"
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

                    {/* User Role (Designer / Investor / Landowner) */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-medium text-[var(--ink-muted)]">
                        {dictionary.auth.userRoleLabel}
                      </span>
                      <div
                        role="radiogroup"
                        aria-label={dictionary.auth.userRoleLabel}
                        className="grid grid-cols-3 gap-2"
                      >
                        {USER_ROLES.map((role) => {
                          const isSelected = userRole === role;
                          return (
                            <button
                              key={role}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => setUserRole(role)}
                              className={cn(
                                'flex h-10 cursor-pointer items-center justify-center rounded-full px-3 text-[12px] font-medium transition-colors duration-200',
                                isSelected
                                  ? 'bg-[var(--brand-primary)] text-[var(--brand-ink-on-primary)]'
                                  : 'bg-[var(--surface-hover)] text-[var(--ink-secondary)] hover:bg-[var(--surface-active)] hover:text-[var(--ink-primary)]'
                              )}
                            >
                              {dictionary.auth.userRoles[role]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={cn(
                        'mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-full px-6',
                        'bg-[var(--brand-primary)] text-[14px] font-medium text-[var(--brand-ink-on-primary)]',
                        'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
                      )}
                    >
                      {dictionary.auth.registerSubmitCta}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
