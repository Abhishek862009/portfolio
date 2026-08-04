'use client';

import { motion } from 'framer-motion';

/**
 * Premium loading screen. Deliberately restrained — reuses the same
 * signature glow motif from the Hero rather than introducing a new visual
 * language just for a loader. Shown once per session (see AppShell), never
 * lingers, never blocks longer than it has to.
 */
export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-void"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/20 blur-[80px]"
        />
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-medium uppercase text-slate"
        >
          Abhishek
        </motion.span>
        <div className="h-px w-40 overflow-hidden bg-hairline">
          <motion.div
            className="h-full origin-left bg-glow"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
