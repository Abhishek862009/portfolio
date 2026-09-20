'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnetic } from '@/components/ui/Magnetic';

const NAV_LINKS = [
  { href: '/#timeline', label: 'Story' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#sitehaven', label: 'SiteHaven' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

const SECTION_IDS = ['hero', 'timeline', 'skills', 'projects', 'sitehaven', 'contact'];

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
export function Navbar() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');

  const isHome = pathname === '/';
  const isHomeActive = isHome && active === 'hero';

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

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
            <li className="relative">
              <Link
                href="/"
                className={`transition-colors hover:text-frost ${
                  isHomeActive ? 'text-frost' : ''
                }`}
              >
                Home
              </Link>
              {isHomeActive && (
                <motion.span
                  layoutId="nav-active-dot"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-glow"
                />
              )}
            </li>
            {NAV_LINKS.map((link) => {
              const id = link.href.includes('#') ? link.href.split('#')[1] : null;
              const isActive = isHome && id !== null && active === id;
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`transition-colors hover:text-frost ${
                      isActive ? 'text-frost' : ''
                    }`}
                  >
                    {link.label}
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

          <div className="hidden md:block">
            <Magnetic strength={6}>
              <Link
                href="/resume.pdf"
                className="rounded-full border border-hairline px-4 py-1.5 text-sm text-frost transition-colors hover:border-glow/60"
              >
                Resume
              </Link>
            </Magnetic>
          </div>

          {/* Mobile menu toggle — this is the fix: nav is now reachable on mobile at all */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
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
            <ul className="flex h-full flex-col items-center justify-center gap-8 text-2xl">
              {[
                { href: '/', label: 'Home' },
                ...NAV_LINKS,
                { href: '/resume.pdf', label: 'Resume' },
              ].map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={link.href} onClick={() => setOpen(false)} className="text-frost">
                    {link.label}
                  </Link>
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
