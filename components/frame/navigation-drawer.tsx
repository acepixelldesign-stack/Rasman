'use client';

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import { MOTION_EASE } from '@/lib/motion/system';
import { useAppContext } from '@/components/providers/app-provider';
import {
  SUBMENU_LIST_VARIANTS,
  createSubmenuItemVariants,
} from '@/components/motion/architectural-motion';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useSwipeUpDismiss } from '@/hooks/use-swipe-up-dismiss';
import { cn } from '@/lib/utils';

interface NavigationDrawerProps {
  readonly id: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onNavigate: () => void;
}

const MENU_EMBLEM_SRC = '/assets/rasman-sketch-emblem.png';

/**
 * Minimalist architectural navigation overlay framed cleanly inside the 4-sided grid:
 * - Opening choreography: 2.00s total (backdrop fade -> sequential line-drawing dividers -> text reveal -> slow emblem blur-to-clear dissolve)
 * - Closing choreography: 1.00s total (emblem & text dissolve + dividers retract + backdrop exits cleanly)
 * - Mobile: 24px top/bottom padding, top hairline divider above Home
 * - Desktop: dividers strictly between items, full-height transparent emblem at logical end
 */
export function NavigationDrawer({
  id,
  isOpen,
  onClose,
  onNavigate,
}: NavigationDrawerProps) {
  const { dictionary, isRtl, openStartProjectModal, userProfile } =
    useAppContext();
  const prefersReducedMotion = useReducedMotion();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [lockedDesktopLogoHeight, setLockedDesktopLogoHeight] = useState<
    number | null
  >(null);
  const drawerRef = useRef<HTMLElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const isProjectsOpenRef = useRef(isProjectsOpen);
  const projectsPanelId = useId();

  useEffect(() => {
    isProjectsOpenRef.current = isProjectsOpen;
  }, [isProjectsOpen]);

  useBodyScrollLock(isOpen);
  useSwipeUpDismiss(drawerRef, isOpen, onClose);

  const subItemVariants = useMemo(
    () => createSubmenuItemVariants(isRtl),
    [isRtl]
  );

  // Measure desktop height from top of Home to bottom of Contact ONLY while Projects dropdown is collapsed
  // so the logo height matches that exact span and NEVER resizes when Projects expands/collapses.
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const desktopMq = window.matchMedia(
      '(min-width: 768px) and (min-height: 520px) and (orientation: landscape)'
    );

    const measureCollapsedMenuHeight = () => {
      if (!desktopMq.matches || isProjectsOpenRef.current) return;
      const listEl = navListRef.current;
      if (!listEl) return;
      const fullHeight = Math.round(listEl.getBoundingClientRect().height);
      if (fullHeight > 80) {
        setLockedDesktopLogoHeight(fullHeight);
      }
    };

    const rafId = window.requestAnimationFrame(measureCollapsedMenuHeight);
    window.addEventListener('resize', measureCollapsedMenuHeight);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measureCollapsedMenuHeight);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const navItems = SITE_CONFIG.navigation;
  const itemCount = navItems.length;
  const lineOrigin = isRtl ? 'right center' : 'left center';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          ref={drawerRef}
          id={id}
          aria-label={dictionary.navigation.navAriaLabel}
          data-smooth-prevent=""
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: prefersReducedMotion
              ? { duration: 0.01 }
              : { duration: 0.48, ease: MOTION_EASE.silk },
          }}
          exit={{
            opacity: 0,
            transition: prefersReducedMotion
              ? { duration: 0.01 }
              : { delay: 0.46, duration: 0.54, ease: MOTION_EASE.calm },
          }}
          className={cn(
            'fixed z-[39] flex flex-col',
            'top-[var(--grid-header)] bottom-[var(--grid-bottom)]',
            'start-[var(--grid-rail)] end-[var(--grid-rail)]',
            'bg-[var(--bg-header-glass)] backdrop-blur-xl backdrop-saturate-150 [transform:translateZ(0)]'
          )}
        >
          {/* Scrollable Split Body */}
          <div
            data-scroll-lock-allow=""
            className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 desktop:px-10 desktop:py-8"
          >
            <div className="flex w-full flex-col desktop:my-auto desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-12">
              {/* Rasman Hand-Sketch Emblem: Locked to Collapsed First-to-Last Divider Height on Desktop */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.96, filter: 'blur(10px)' }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: prefersReducedMotion
                    ? { duration: 0.01 }
                    : {
                        delay: 0.35,
                        duration: 1.65,
                        ease: MOTION_EASE.silk,
                      },
                }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0, transition: { duration: 0.01 } }
                    : {
                        opacity: 0,
                        scale: 0.98,
                        filter: 'blur(8px)',
                        transition: { duration: 0.55, ease: MOTION_EASE.calm },
                      }
                }
                className="order-1 flex shrink-0 items-center justify-center pb-6 desktop:order-2 desktop:flex-1 desktop:pb-0"
              >
                <div
                  style={
                    lockedDesktopLogoHeight
                      ? ({
                          '--drawer-logo-desktop-h': `${lockedDesktopLogoHeight}px`,
                        } as CSSProperties)
                      : undefined
                  }
                  className="relative h-[144px] aspect-[949/1024] shrink-0 sm:h-[164px] desktop:h-[var(--drawer-logo-desktop-h,416px)] desktop:w-auto"
                >
                  <Image
                    src={MENU_EMBLEM_SRC}
                    alt={dictionary.brand.logotype}
                    fill
                    priority
                    sizes="(max-width: 768px) 164px, 480px"
                    referrerPolicy="no-referrer"
                    className="rasman-emblem-invert object-contain object-center select-none dark:invert"
                  />
                </div>
              </motion.div>

              {/* Divided Navigation Links With Animated Line-Drawing Hairlines & Sequential Text Reveal (2.00s Open / 1.00s Close) */}
              <ul
                ref={navListRef}
                className="order-2 flex w-full flex-col desktop:order-1 desktop:max-w-[560px] desktop:flex-1"
              >
                {navItems.map((item, idx) => {
                  const hasChildren = Boolean(
                    item.children && item.children.length > 0
                  );
                  const label = dictionary.navigation.items[item.id];
                  const isFirst = idx === 0;
                  const isLast = idx === itemCount - 1;

                  // Spread line draws across 0.16s -> 1.55s and text reveals across 0.30s -> 2.00s
                  const ratio = itemCount > 1 ? idx / (itemCount - 1) : 0;
                  const reverseRatio = 1 - ratio;
                  const lineOpenDelay = 0.16 + ratio * 0.78;
                  const textOpenDelay = 0.32 + ratio * 0.88;
                  const exitDelay = reverseRatio * 0.24;

                  return (
                    <li
                      key={item.id}
                      className="relative w-full py-2.5 last:pb-0 desktop:py-3.5 desktop:first:pt-0 desktop:last:pb-0"
                    >
                      {/* Mobile-only top hairline above Home */}
                      {isFirst && (
                        <motion.span
                          aria-hidden="true"
                          style={{ transformOrigin: lineOrigin }}
                          initial={
                            prefersReducedMotion
                              ? { scaleX: 1 }
                              : { scaleX: 0 }
                          }
                          animate={{
                            scaleX: 1,
                            transition: prefersReducedMotion
                              ? { duration: 0.01 }
                              : {
                                  delay: 0.12,
                                  duration: 0.68,
                                  ease: MOTION_EASE.silk,
                                },
                          }}
                          exit={{
                            scaleX: 0,
                            transition: prefersReducedMotion
                              ? { duration: 0.01 }
                              : {
                                  delay: 0.24,
                                  duration: 0.42,
                                  ease: MOTION_EASE.calm,
                                },
                          }}
                          className="pointer-events-none absolute inset-x-0 top-0 block h-px bg-[var(--grid-line)] desktop:hidden"
                        />
                      )}

                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, y: -12 }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: prefersReducedMotion
                            ? { duration: 0.01 }
                            : {
                                delay: textOpenDelay,
                                duration: 0.8,
                                ease: MOTION_EASE.silk,
                              },
                        }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0, transition: { duration: 0.01 } }
                            : {
                                opacity: 0,
                                y: -8,
                                transition: {
                                  delay: exitDelay,
                                  duration: 0.42,
                                  ease: MOTION_EASE.calm,
                                },
                              }
                        }
                      >
                        {hasChildren && item.children ? (
                          <div className="flex flex-col items-start">
                            <button
                              type="button"
                              aria-expanded={isProjectsOpen}
                              aria-controls={projectsPanelId}
                              onClick={() => setIsProjectsOpen((prev) => !prev)}
                              className={cn(
                                'group inline-flex w-full cursor-pointer items-center justify-between gap-2.5 text-start',
                                'text-[clamp(1.4rem,2.7vw,2.35rem)] font-light leading-[1.22] tracking-[-0.02em]',
                                'rtl:leading-[1.4] rtl:tracking-normal',
                                'text-[var(--ink-primary)] transition-colors duration-300',
                                'hover:text-[var(--brand-text-hover)] focus-visible:text-[var(--brand-text-hover)]',
                                isProjectsOpen && 'text-[var(--brand-text-hover)]'
                              )}
                            >
                              <span>{label}</span>
                              <span
                                aria-hidden="true"
                                className={cn(
                                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                                  'text-[var(--ink-muted)] transition-transform duration-400',
                                  isProjectsOpen && 'rotate-180'
                                )}
                              >
                                <MdKeyboardArrowDown size={24} />
                              </span>
                            </button>

                            <AnimatePresence initial={false}>
                              {isProjectsOpen && (
                                <motion.div
                                  id={projectsPanelId}
                                  variants={SUBMENU_LIST_VARIANTS}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="w-full overflow-hidden"
                                >
                                  <ul className="mt-2 flex flex-col">
                                    {item.children.map((subItem) => (
                                      <motion.li
                                        key={subItem.id}
                                        variants={subItemVariants}
                                        className="py-1.5 desktop:py-2"
                                      >
                                        <Link
                                          href={subItem.href}
                                          prefetch={true}
                                          onClick={onNavigate}
                                          className={cn(
                                            'block w-full text-start',
                                            'text-[clamp(1.1rem,1.9vw,1.65rem)] font-light leading-[1.25] tracking-[-0.015em]',
                                            'rtl:leading-[1.45] rtl:tracking-normal',
                                            'text-[var(--ink-secondary)] transition-colors duration-300',
                                            'hover:text-[var(--brand-text-hover)] focus-visible:text-[var(--brand-text-hover)]'
                                          )}
                                        >
                                          {
                                            dictionary.navigation.subItems[
                                              subItem.id
                                            ]
                                          }
                                        </Link>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={item.href ?? '#'}
                            prefetch={true}
                            onClick={onNavigate}
                            className={cn(
                              'block w-full text-start',
                              'text-[clamp(1.4rem,2.7vw,2.35rem)] font-light leading-[1.22] tracking-[-0.02em]',
                              'rtl:leading-[1.4] rtl:tracking-normal',
                              'text-[var(--ink-primary)] transition-colors duration-300',
                              'hover:text-[var(--brand-text-hover)] focus-visible:text-[var(--brand-text-hover)]'
                            )}
                          >
                            {label}
                          </Link>
                        )}
                      </motion.div>

                      {/* Animated Hairline Divider Between Menu Items (Drawing Start -> End) */}
                      {!isLast && (
                        <motion.span
                          aria-hidden="true"
                          style={{ transformOrigin: lineOrigin }}
                          initial={
                            prefersReducedMotion
                              ? { scaleX: 1 }
                              : { scaleX: 0 }
                          }
                          animate={{
                            scaleX: 1,
                            transition: prefersReducedMotion
                              ? { duration: 0.01 }
                              : {
                                  delay: lineOpenDelay,
                                  duration: 0.72,
                                  ease: MOTION_EASE.silk,
                                },
                          }}
                          exit={{
                            scaleX: 0,
                            transition: prefersReducedMotion
                              ? { duration: 0.01 }
                              : {
                                  delay: exitDelay,
                                  duration: 0.44,
                                  ease: MOTION_EASE.calm,
                                },
                          }}
                          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-[var(--grid-line)]"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Mobile-Only Fixed Bottom Stretched 48px CTA (No Top Border) */}
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
            }
            animate={{
              opacity: 1,
              y: 0,
              transition: prefersReducedMotion
                ? { duration: 0.01 }
                : {
                    delay: 1.28,
                    duration: 0.72,
                    ease: MOTION_EASE.silk,
                  },
            }}
            exit={
              prefersReducedMotion
                ? { opacity: 0, transition: { duration: 0.01 } }
                : {
                    opacity: 0,
                    y: 8,
                    transition: { duration: 0.42, ease: MOTION_EASE.calm },
                  }
            }
            className="shrink-0 px-4 pt-3 pb-2 desktop:hidden"
          >
            {userProfile ? (
              <Link
                href={SITE_CONFIG.routes.panel}
                prefetch={true}
                onClick={onNavigate}
                className={cn(
                  'flex h-12 w-full items-center justify-center rounded-full',
                  'bg-[var(--btn-start-bg)] text-[14px] font-medium leading-none text-[var(--btn-start-ink)]',
                  'transition-colors duration-200 hover:bg-[var(--btn-start-hover)] active:bg-[var(--btn-start-active)]'
                )}
              >
                {dictionary.header.userPanelLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openStartProjectModal();
                }}
                className={cn(
                  'flex h-12 w-full cursor-pointer items-center justify-center rounded-full',
                  'bg-[var(--btn-start-bg)] text-[14px] font-medium leading-none text-[var(--btn-start-ink)]',
                  'transition-colors duration-200 hover:bg-[var(--btn-start-hover)] active:bg-[var(--btn-start-active)]'
                )}
              >
                {dictionary.header.startProjectLabel}
              </button>
            )}
          </motion.div>

          {/* Mobile Drag-Up Handle to Dismiss Drawer */}
          <div
            data-swipe-handle=""
            aria-hidden="true"
            className="flex h-6 w-full shrink-0 items-center justify-center pb-1 desktop:hidden"
          >
            <span className="block h-[3px] w-9 rounded-full bg-[var(--grid-crosshair)]" />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
