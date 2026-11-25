'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import { MOTION_EASE, MOTION_VARIANTS } from '@/lib/motion/system';
import { useAppContext } from '@/components/providers/app-provider';
import {
  MENU_LIST_VARIANTS,
  MENU_OVERLAY_VARIANTS,
  SUBMENU_LIST_VARIANTS,
  createMenuItemVariants,
  createSubmenuItemVariants,
} from '@/components/motion/architectural-motion';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
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
 * - Freezes background page scroll while open via global reference-counted scroll lock
 * - Hairline dividers strictly between top-level navigation items (none above Home, none below Contact)
 * - Projects submenu renders without dividers and flush-aligned with its parent label
 * - True-alpha transparent Rasman architectural emblem (light #000 / dark inverted #fff, zero background):
 *     - Desktop: positioned at logical end (right in EN, left in FA & AR) stretched to the full height of all menu items
 *     - Mobile: positioned first above menu items with compact height to leave room for links
 */
export function NavigationDrawer({
  id,
  isOpen,
  onClose,
  onNavigate,
}: NavigationDrawerProps) {
  const { dictionary, isRtl, openStartProjectModal, userProfile } =
    useAppContext();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const projectsPanelId = useId();

  useBodyScrollLock(isOpen);

  const itemVariants = useMemo(() => createMenuItemVariants(isRtl), [isRtl]);
  const subItemVariants = useMemo(
    () => createSubmenuItemVariants(isRtl),
    [isRtl]
  );

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          id={id}
          aria-label={dictionary.navigation.navAriaLabel}
          data-smooth-prevent=""
          variants={MENU_OVERLAY_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed z-[39] flex flex-col',
            'top-[var(--grid-header)] bottom-[var(--grid-bottom)]',
            'start-[var(--grid-rail)] end-[var(--grid-rail)]',
            'bg-[var(--bg-header-glass)] backdrop-blur-xl backdrop-saturate-150 [transform:translateZ(0)]'
          )}
        >
          {/* Scrollable Split Body: Mobile (24px Top/Bottom Padding + Sketch Emblem -> Divided Menu with Top Divider Above Home) | Desktop (Divided Menu Start -> Full-Height Emblem End) */}
          <div
            data-scroll-lock-allow=""
            className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 desktop:px-10 desktop:py-8"
          >
            <div className="flex w-full flex-col desktop:my-auto desktop:flex-row desktop:items-stretch desktop:justify-between desktop:gap-12">
              {/* Rasman Architectural Hand-Sketch Emblem (True Transparent Alpha — Pure Black in Light, Inverted White in Dark/Ambient) */}
              <motion.div
                variants={MOTION_VARIANTS.mediaReveal}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="order-1 flex shrink-0 items-center justify-center pb-6 desktop:order-2 desktop:relative desktop:flex-1 desktop:pb-0"
              >
                <div className="relative h-[144px] aspect-[949/1024] sm:h-[164px] desktop:absolute desktop:inset-0 desktop:aspect-auto desktop:h-full desktop:w-full">
                  <Image
                    src={MENU_EMBLEM_SRC}
                    alt={dictionary.brand.logotype}
                    fill
                    priority
                    sizes="(max-width: 768px) 164px, 560px"
                    referrerPolicy="no-referrer"
                    className="rasman-emblem-invert object-contain object-center select-none dark:invert"
                  />
                </div>
              </motion.div>

              {/* Divided Navigation Links — Top divider above Home on mobile, strictly between items on desktop */}
              <motion.ul
                variants={MENU_LIST_VARIANTS}
                className="order-2 flex w-full flex-col divide-y divide-[var(--grid-line)] border-t border-[var(--grid-line)] desktop:order-1 desktop:max-w-[560px] desktop:flex-1 desktop:border-t-0"
              >
                {SITE_CONFIG.navigation.map((item) => {
                  const hasChildren = Boolean(
                    item.children && item.children.length > 0
                  );
                  const label = dictionary.navigation.items[item.id];

                  return (
                    <motion.li
                      key={item.id}
                      variants={itemVariants}
                      className="w-full py-2.5 last:pb-0 desktop:py-3.5 desktop:first:pt-0 desktop:last:pb-0"
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
                                        {dictionary.navigation.subItems[subItem.id]}
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
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </div>

          {/* Mobile-Only Fixed Bottom Stretched 48px CTA (No Top Border) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.42,
                delay: 0.24,
                ease: MOTION_EASE.calm,
              },
            }}
            exit={{
              opacity: 0,
              y: 6,
              transition: { duration: 0.18, ease: MOTION_EASE.exit },
            }}
            className="shrink-0 px-4 pt-3 pb-6 desktop:hidden"
          >
            {userProfile ? (
              <Link
                href={SITE_CONFIG.routes.panel}
                prefetch={true}
                onClick={onNavigate}
                className={cn(
                  'flex h-12 w-full items-center justify-center rounded-full',
                  'bg-[var(--brand-primary)] text-[14px] font-medium leading-none text-[var(--brand-ink-on-primary)]',
                  'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
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
                  'bg-[var(--brand-primary)] text-[14px] font-medium leading-none text-[var(--brand-ink-on-primary)]',
                  'transition-colors duration-200 hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
                )}
              >
                {dictionary.header.startProjectLabel}
              </button>
            )}
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
