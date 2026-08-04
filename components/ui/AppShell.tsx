'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen } from './LoadingScreen';
import { CustomCursor } from './CustomCursor';

const SESSION_KEY = 'ab-portfolio-loaded';

/**
 * Shows the loading sequence once per browser session — not on every route
 * change, since repeating it on internal navigation would read as friction,
 * not polish. Site content only mounts once loading completes, so Hero's
 * own mount-triggered reveal starts at exactly the right moment instead of
 * racing the loader underneath it.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean | null>(null);

  useEffect(() => {
    const already =
      typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY);
    if (already) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // Render nothing for one tick rather than flashing content before we
  // know whether the loader should show.
  if (loading === null) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {!loading && children}
      <CustomCursor />
    </>
  );
}
