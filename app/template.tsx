'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { MOTION_EASE } from '@/lib/motion/system';

interface RootTemplateProps {
  readonly children: ReactNode;
}

/**
 * Global Next.js App Router template keeping desktop sticky sidebars and
 * perimeter frames completely stationary (zero ancestor CSS transform),
 * while gently revealing route content via opacity.
 */
export default function RootTemplate({ children }: RootTemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.36, ease: MOTION_EASE.calm },
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
