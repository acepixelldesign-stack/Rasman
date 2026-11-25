'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { MOTION_VARIANTS } from '@/lib/motion/system';

interface RootTemplateProps {
  readonly children: ReactNode;
}

/**
 * Global Next.js App Router template applying the unified calm Rasman
 * entrance glide consistently across every route navigation.
 */
export default function RootTemplate({ children }: RootTemplateProps) {
  return (
    <motion.div
      variants={MOTION_VARIANTS.page}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
