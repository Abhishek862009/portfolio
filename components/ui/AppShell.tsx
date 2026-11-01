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

  // The page is always rendered, including on the server, so Google, link
  // previews and no-JS visitors get real HTML. (This used to `return null`
  // until the effect above ran, which sent every page to the server as an
  // empty body.)
  //
  // The wrapper stays invisible until we know whether the loader should show,
  // so first-time visitors never see a flash of the page before the loader.
  // `key` remounts the page when the loader finishes, so Hero's mount
  // animation starts at exactly that moment, as before.
  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <div
        key={loading ? 'loading' : 'ready'}
        data-shell={loading === false ? 'ready' : 'pending'}
        style={loading === false ? undefined : { visibility: 'hidden' }}
      >
        {children}
      </div>
      {/* Without JavaScript the effect never runs, so show the page. */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: '[data-shell=pending]{visibility:visible!important}' }} />
      </noscript>
      <CustomCursor />
    </>
  );
}
