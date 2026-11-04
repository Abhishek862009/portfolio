'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from '@/components/i18n/T';
import { useT } from '@/components/i18n/LanguageProvider';
import { Magnetic } from '@/components/ui/Magnetic';

// `section` = the id of the block on the home page this link belongs to (the dot follows it
// while scrolling). `route` = the page it belongs to when the visitor is NOT on the home page
// (so /blog highlights Blog, /apps highlights App Store, and so on).
type NavLink = { href: string; en: string; hi: string; section?: string; route?: string };

const HOME_LINK: NavLink = { href: '/', en: 'Home', hi: 'होम', section: 'hero' };

const NAV_LINKS: NavLink[] = [
  { href: '/#timeline', en: 'Story', hi: 'कहानी', section: 'timeline' },
  { href: '/#skills', en: 'Skills', hi: 'स्किल्स', section: 'skills' },
  { href: '/#projects', en: 'Projects', hi: 'प्रोजेक्ट्स', section: 'projects', route: '/projects' },
  { href: '/apps', en: 'App Store', hi: 'ऐप स्टोर', section: 'apps', route: '/apps' },
  { href: '/#bidevlink', en: 'Bidevlink', hi: 'Bidevlink', section: 'bidevlink', route: '/bidevlink' },
  { href: '/blog', en: 'Blog', hi: 'ब्लॉग', section: 'blog', route: '/blog' },
  { href: '/#contact', en: 'Contact', hi: 'संपर्क', section: 'contact' },
];

// Top-to-bottom order of the blocks on the home page (must match app/page.tsx).
const SECTION_IDS = ['hero', 'timeline', 'skills', 'projects', 'apps', 'bidevlink', 'blog', 'contact'];

// Which link gets the dot. On the home page it follows the scroll; on any other page it
// follows the route.
function isLinkActive(link: NavLink, pathname: string, active: string) {
  if (pathname === '/') return link.section === active;
  return Boolean(link.route) && (pathname === link.route || pathname.startsWith(`${link.route}/`));
}

// Locked behavior (blueprint Section 4): always present, transparent on the
// hero so it never competes with the reveal, solidifies once the visitor
// scrolls past it. Never fully hidden — accessible from frame one.
//
// This component is now rendered from the root layout (see app/layout.tsx)
// so it — and the new Home link — actually exist on every route. Previously
// Navbar/Footer were only rendered inside app/page.tsx, meaning /blog and
// /projects/[slug] had zero navigation at all. That was the real bug behind
// "add a Home button" — the button alone wouldn't have helped if the whole
// navbar wasn't there to hold it.
export function Navbar({ hasResume = false }: { hasResume?: boolean }) {
  const pathname = usePathname();
  const t = useT();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Which block is the visitor in? Computed from scroll position, not IntersectionObserver.
  // The old observer only looked at the blocks that had just changed, so when a tall block
  // (Projects, App Store) came into view at the same moment as the one leaving, the leaving
  // one won and the dot never moved. Here: the active block is simply the last one whose top
  // edge has passed the line 35% down the screen. At the very bottom of the page it is the
  // last block, so Contact still lights up even though the page can't scroll any further.
  useEffect(() => {
    if (pathname !== '/') return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = SECTION_IDS[0];
      let last = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        last = id;
        if (el.getBoundingClientRect().top <= line) current = id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? last : current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close the mobile menu on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cnHeader(solid || open)}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Magnetic strength={6}>
            <Link href="/" className="text-sm font-semibold tracking-widest text-frost">
              AB
            </Link>
          </Magnetic>

          {/* Desktop nav */}
          <ul className="hidden gap-8 text-sm text-slate md:flex">
            {[HOME_LINK, ...NAV_LINKS].map((link) => {
              const isActive = isLinkActive(link, pathname, active);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`transition-colors hover:text-frost ${
                      isActive ? 'text-frost' : ''
                    }`}
                  >
                    <T en={link.en} hi={link.hi} />
                  </Link>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-glow"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            {/* Plain <a>: the resume is a file, not a Next route. Hidden until
                public/resume.pdf exists (see app/layout.tsx). */}
            {hasResume && (
              <div className="hidden md:block">
                <Magnetic strength={6}>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-hairline px-4 py-1.5 text-sm text-frost transition-colors hover:border-glow/60"
                  >
                    <T en="Resume" hi="रिज्यूमे" />
                  </a>
                </Magnetic>
              </div>
            )}

            {/* Mobile menu toggle — this is the fix: nav is now reachable on mobile at all */}
            <button
              type="button"
              aria-label={open ? t('Close menu', 'मेन्यू बंद करें') : t('Open menu', 'मेन्यू खोलें')}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-[60] flex h-10 w-10 items-center justify-center md:hidden"
            >
              <span className="relative block h-4 w-5">
                <motion.span
                  animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="absolute left-0 top-0 h-px w-5 bg-frost"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  className="absolute left-0 top-[7px] h-px w-5 bg-frost"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  className="absolute left-0 top-[14px] h-px w-5 bg-frost"
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay — a sibling of the header, not a child of it.
          motion.header keeps an inline transform after its own entrance
          animation settles, and a transformed ancestor turns this overlay's
          fixed positioning into something scoped to the header's box
          instead of the real viewport. Moving it out fixes the phone-only
          overlap; nothing about the animation itself changed. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-void/98 backdrop-blur-md md:hidden"
          >
            <ul className="flex h-full flex-col items-center justify-center gap-6 text-2xl">
              {[
                HOME_LINK,
                ...NAV_LINKS,
                ...(hasResume ? [{ href: '/resume.pdf', en: 'Resume', hi: 'रिज्यूमे' } as NavLink] : []),
              ].map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {link.href.endsWith('.pdf') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="text-frost"
                    >
                      <T en={link.en} hi={link.hi} />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={isLinkActive(link, pathname, active) ? 'text-glow' : 'text-frost'}
                    >
                      <T en={link.en} hi={link.hi} />
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function cnHeader(solid: boolean) {
  return [
    'fixed inset-x-0 top-0 z-[60] transition-colors duration-500',
    solid ? 'bg-ink/80 backdrop-blur-md border-b border-hairline' : 'bg-transparent',
  ].join(' ');
}
