'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import type { AppEntry } from '@/data/apps';
import { T } from '@/components/i18n/T';
import { useT } from '@/components/i18n/LanguageProvider';
import { AppCard } from '@/components/ui/AppCard';

type Filter = 'all' | AppEntry['platform'];

// Order of the toggle. "Terminal" is the short name for apps you run in a terminal
// (Termux on Android, or the command line on Windows, Linux and Mac).
const OPTIONS: { value: Filter; en: string; hi: string }[] = [
  { value: 'all', en: 'All', hi: 'सभी' },
  { value: 'Android', en: 'Android', hi: 'Android' },
  { value: 'Web', en: 'Web', hi: 'Web' },
  { value: 'Terminal', en: 'Terminal', hi: 'Terminal' },
];

/**
 * The App Store grid with an All / Android / Web / Terminal toggle on top. Used by both
 * the homepage section and the /apps page, so the two always behave the same.
 * Filtering is by `platform`, so a newly added app shows up under the right
 * tab without touching this file.
 */
export function AppFilter({ apps }: { apps: AppEntry[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const reduceMotion = useReducedMotion();
  const t = useT();

  const countFor = (value: Filter) =>
    value === 'all' ? apps.length : apps.filter((a) => a.platform === value).length;
  const visible = filter === 'all' ? apps : apps.filter((a) => a.platform === filter);

  return (
    <div>
      <div
        role="group"
        aria-label={t('Filter apps by platform', 'प्लेटफ़ॉर्म के हिसाब से ऐप्स छाँटें')}
        className="flex w-full max-w-full rounded-3xl border border-hairline bg-ink/40 p-1 sm:inline-flex sm:w-auto"
      >
        {OPTIONS.map((option) => {
          const active = filter === option.value;
          const count = countFor(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              aria-label={t(
                `${option.en}, ${count} ${count === 1 ? 'app' : 'apps'}`,
                `${option.hi}, ${count} ऐप${count === 1 ? '' : '्स'}`
              )}
              onClick={() => setFilter(option.value)}
              className={`flex-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition-colors sm:flex-none sm:px-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-glow ${
                active ? 'bg-glow/15 text-frost' : 'text-slate hover:text-frost'
              }`}
            >
              <T en={option.en} hi={option.hi} />
              <span className="ml-1.5 hidden text-xs text-slate/70 min-[420px]:inline" aria-hidden="true">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((app) => (
            <motion.div
              key={app.slug}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <AppCard app={app} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <p className="mt-8 text-sm text-slate">
          <T
            en={`No ${filter === 'all' ? '' : `${filter} `}apps yet.`}
            hi={`अभी कोई ${filter === 'all' ? '' : `${filter} `}ऐप नहीं है।`}
          />
        </p>
      )}
    </div>
  );
}
