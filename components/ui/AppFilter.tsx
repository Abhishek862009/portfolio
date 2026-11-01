'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import type { AppEntry } from '@/data/apps';
import { AppCard } from '@/components/ui/AppCard';

type Filter = 'all' | AppEntry['platform'];

const OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Android', label: 'Android' },
  { value: 'Web', label: 'Web' },
];

/**
 * The App Store grid with an All / Android / Web toggle on top. Used by both
 * the homepage section and the /apps page, so the two always behave the same.
 * Filtering is by `platform`, so a newly added app shows up under the right
 * tab without touching this file.
 */
export function AppFilter({ apps }: { apps: AppEntry[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const reduceMotion = useReducedMotion();

  const countFor = (value: Filter) =>
    value === 'all' ? apps.length : apps.filter((a) => a.platform === value).length;
  const visible = filter === 'all' ? apps : apps.filter((a) => a.platform === filter);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter apps by platform"
        className="inline-flex rounded-full border border-hairline bg-ink/40 p-1"
      >
        {OPTIONS.map((option) => {
          const active = filter === option.value;
          const count = countFor(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              aria-label={`${option.label}, ${count} ${count === 1 ? 'app' : 'apps'}`}
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-glow ${
                active ? 'bg-glow/15 text-frost' : 'text-slate hover:text-frost'
              }`}
            >
              {option.label}
              <span className="ml-1.5 text-xs text-slate/70" aria-hidden="true">
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
        <p className="mt-8 text-sm text-slate">No {filter === 'all' ? '' : `${filter} `}apps yet.</p>
      )}
    </div>
  );
}
