'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { SITE_CONFIG } from '@/lib/config/site';
import { useAppContext } from '@/components/providers/app-provider';
import {
  ARCHITECTURAL_EASE,
  MENU_LIST_VARIANTS,
  MENU_OVERLAY_VARIANTS,
  SUBMENU_LIST_VARIANTS,
  createMenuItemVariants,
  createSubmenuItemVariants,
} from '@/components/motion/architectural-motion';
import { cn } from '@/lib/utils';

interface NavigationDrawerProps {
  readonly id: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onNavigate: () => void;
}

/**
 * Minimalist architectural navigation overlay framed cleanly inside the 4-sided grid:
 * - Calm, perceptible Expo-Out reveal with staggered one-by-one item cascade (LTR/RTL mirrored)
 * - Mobile: 16px (ps-4) gap from start column + full-width 48px Start Project / Client Panel CTA
 * - Desktop: 32px (desktop:ps-8) gap from start column, zero divider lines
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
          {/* Scrollable Navigation Links — Staggered Calm Cascade */}
          <div className="flex flex-1 flex-col justify-center overflow-y-auto ps-4 pe-4 py-6 desktop:ps-8 desktop:pe-8 desktop:py-8">
            <motion.ul
              variants={MENU_LIST_VARIANTS}
              className="flex w-full flex-col items-start gap-3.5 desktop:gap-4"
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
                    className="w-full"
                  >
                    {hasChildren && item.children ? (
                      <div className="flex flex-col items-start">
                        <button
                          type="button"
                          aria-expanded={isProjectsOpen}
                          aria-controls={projectsPanelId}
                          onClick={() => setIsProjectsOpen((prev) => !prev)}
                          className={cn(
                            'group inline-flex cursor-pointer items-center gap-2.5 text-start',
                            'text-[clamp(1.75rem,3.4vw,3rem)] font-light leading-[1.22] tracking-[-0.02em]',
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
                              'inline-flex h-8 w-8 items-center justify-center rounded-full',
                              'text-[var(--ink-muted)] transition-transform duration-400',
                              isProjectsOpen && 'rotate-180'
                            )}
                          >
                            <MdKeyboardArrowDown size={28} />
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
                              className="overflow-hidden"
                            >
                              <ul className="flex flex-col items-start gap-2.5 pt-3 pb-2 desktop:gap-3">
                                {item.children.map((subItem) => (
                                  <motion.li
                                    key={subItem.id}
                                    variants={subItemVariants}
                                  >
                                    <Link
                                      href={subItem.href}
                                      prefetch={true}
                                      onClick={onNavigate}
                                      className={cn(
                                        'inline-block text-start',
                                        'text-[clamp(1.4rem,2.4vw,2.15rem)] font-light leading-[1.25] tracking-[-0.015em]',
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
                          'inline-block text-start',
                          'text-[clamp(1.75rem,3.4vw,3rem)] font-light leading-[1.22] tracking-[-0.02em]',
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

          {/* Mobile-Only Fixed Bottom Stretched 48px CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.48,
                delay: 0.42,
                ease: ARCHITECTURAL_EASE,
              },
            }}
            exit={{
              opacity: 0,
              y: 8,
              transition: { duration: 0.2 },
            }}
            className="shrink-0 px-4 pt-3 pb-4 desktop:hidden"
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
