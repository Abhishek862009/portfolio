import type { Metadata } from 'next';

import { apps, publicApps, SITE_URL, STORE_NAME, STORE_ALT_NAME, STORE_PATH } from '@/data/apps';
import { T } from '@/components/i18n/T';
import { AppFilter } from '@/components/ui/AppFilter';
import { Reveal } from '@/components/ui/Reveal';

const TITLE = `${STORE_NAME} | ${STORE_ALT_NAME} – Apps by Abhishek`;
const DESCRIPTION = `${STORE_NAME} (also called ${STORE_ALT_NAME}): apps built by Abhishek (Arvish). Download Android apps as APK, like Abhi Gallery, a normal and simple gallery app, open web apps like the Hisaab (hisab kitab) app right in your browser, or set up terminal apps on Windows, Android (Termux), Linux and Mac. Available in English and Hindi.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    STORE_NAME,
    STORE_ALT_NAME,
    'Arvish apps',
    'Abhishek apps',
    'Arvish Android apps',
    'Abhishek Android apps',
    'Arvish APK',
    'Abhishek APK',
    ...publicApps.flatMap((a) => a.keywords),
  ],
  alternates: { canonical: STORE_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${STORE_PATH}`,
    siteName: 'Abhishek',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}${STORE_PATH}#page`,
      url: `${SITE_URL}${STORE_PATH}`,
      name: STORE_NAME,
      alternateName: [STORE_ALT_NAME],
      description: DESCRIPTION,
      isPartOf: { '@type': 'WebSite', name: 'Abhishek', url: SITE_URL },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: publicApps.map((app, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}${STORE_PATH}/${app.slug}`,
          name: app.name,
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: STORE_NAME, item: `${SITE_URL}${STORE_PATH}` },
      ],
    },
  ],
};

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Reveal>
        <h1 className="text-4xl font-semibold text-frost md:text-5xl">{STORE_NAME}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate">
          <T
            en={`Welcome to the ${STORE_ALT_NAME} — apps built by Abhishek (Arvish). Android apps download directly as APK files, web apps open right in your browser, and terminal apps run on your own device with a step-by-step setup guide.`}
            hi={`${STORE_ALT_NAME} में आपका स्वागत है — Abhishek (Arvish) के बनाए ऐप्स। Android ऐप्स सीधे APK फ़ाइल के रूप में डाउनलोड होते हैं, वेब ऐप्स आपके ब्राउज़र में ही खुलते हैं, और टर्मिनल ऐप्स आपके अपने डिवाइस पर चलते हैं, स्टेप-बाय-स्टेप सेटअप गाइड के साथ।`}
          />
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-12">
        <AppFilter apps={apps} />
      </Reveal>
    </div>
  );
}
