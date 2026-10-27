import Link from 'next/link';

import { apps, STORE_NAME, STORE_ALT_NAME, STORE_PATH } from '@/data/apps';
import { AppCard } from '@/components/ui/AppCard';

// Homepage teaser for the /apps page. Same section rhythm as Projects and
// Bidevlink (max-w-5xl, py-32, card grid).
export function AppStorePreview() {
  return (
    <section id="apps" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">{STORE_NAME}</h2>
      <p className="mt-3 max-w-xl text-sm text-slate">
        The {STORE_ALT_NAME} — apps built by Abhishek, available to download directly.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </div>

      <Link
        href={STORE_PATH}
        className="mt-8 inline-block text-sm text-slate underline-offset-4 transition-colors hover:text-frost hover:underline"
      >
        View all apps →
      </Link>
    </section>
  );
}
