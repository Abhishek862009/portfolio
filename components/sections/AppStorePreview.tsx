import Link from 'next/link';

import { apps, STORE_NAME, STORE_ALT_NAME, STORE_PATH } from '@/data/apps';
import { T } from '@/components/i18n/T';
import { AppFilter } from '@/components/ui/AppFilter';

// Homepage teaser for the /apps page: the All / Android / Web / Terminal toggle on top and the
// app tiles (see components/ui/AppCard.tsx) below.
export function AppStorePreview() {
  return (
    <section id="apps" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-frost md:text-4xl">{STORE_NAME}</h2>
          <p className="mt-3 max-w-xl text-sm text-slate">
            <T
              en={`The ${STORE_ALT_NAME} — apps built by Abhishek, available to download or open directly.`}
              hi={`${STORE_ALT_NAME} — Abhishek के बनाए ऐप्स, जिन्हें सीधे डाउनलोड या ओपन किया जा सकता है।`}
            />
          </p>
        </div>
        <Link
          href={STORE_PATH}
          className="text-sm text-slate underline-offset-4 transition-colors hover:text-frost hover:underline"
        >
          <T en="View all apps →" hi="सभी ऐप्स देखें →" />
        </Link>
      </div>

      <div className="mt-10">
        <AppFilter apps={apps} />
      </div>
    </section>
  );
}
