import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Images } from 'lucide-react';

import {
  apps,
  getApp,
  SITE_URL,
  STORE_NAME,
  STORE_ALT_NAME,
  STORE_PATH,
} from '@/data/apps';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Reveal } from '@/components/ui/Reveal';

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const app = getApp(params.slug);
  if (!app) return {};

  const title = `${app.name} APK Download | ${STORE_NAME}`;
  const description = `Download ${app.name}, a normal and simple gallery app for Android, from the ${STORE_NAME} (${STORE_ALT_NAME}).`;
  const path = `${STORE_PATH}/${app.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: [...app.keywords, STORE_NAME, STORE_ALT_NAME],
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: 'Abhishek',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function AppPage({ params }: { params: { slug: string } }) {
  const app = getApp(params.slug);
  if (!app) notFound();

  const url = `${SITE_URL}${STORE_PATH}/${app.slug}`;

  // Deliberately no aggregateRating/review: there are none yet, and making
  // them up would be fake structured data. Google's rich-result display for
  // apps requires one of those, so this schema helps Google understand the
  // page but will not by itself produce a star-rating snippet.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MobileApplication',
        name: app.name,
        description: app.description,
        url,
        operatingSystem: 'Android',
        applicationCategory: 'MultimediaApplication',
        downloadUrl: app.downloadUrl,
        ...(app.version ? { softwareVersion: app.version } : {}),
        author: { '@type': 'Person', name: 'Abhishek', url: SITE_URL },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: STORE_NAME, item: `${SITE_URL}${STORE_PATH}` },
          { '@type': 'ListItem', position: 3, name: app.name, item: url },
        ],
      },
    ],
  };

  const facts = [
    { label: 'Platform', value: app.platform },
    { label: 'File type', value: app.fileType },
    ...(app.sizeLabel ? [{ label: 'Size', value: app.sizeLabel }] : []),
    ...(app.version ? [{ label: 'Version', value: app.version }] : []),
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Link
        href={STORE_PATH}
        className="inline-flex items-center gap-2 text-sm text-slate transition-colors hover:text-frost"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {STORE_NAME}
      </Link>

      <Reveal>
        <div className="mt-8 flex items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-hairline bg-ink/40 text-glow"
          >
            <Images className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-frost">{app.name}</h1>
            <p className="mt-1 text-sm italic text-slate/80">{app.tagline}</p>
          </div>
        </div>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate">{app.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {facts.map((f) => (
            <span
              key={f.label}
              className="rounded-full border border-hairline px-3 py-1 text-xs text-slate"
            >
              {f.label}: {f.value}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <DownloadButton href={app.downloadUrl} label={`Download ${app.name}`} size="large" />
        </div>
      </Reveal>

      <div className="mt-12 max-w-xl rounded-xl border border-hairline bg-ink/40 p-4 text-sm text-slate">
        <p className="font-medium text-frost">Installing the APK</p>
        <p className="mt-2">
          This app is installed from a file, not from the Play Store, so Android may ask you to
          allow installs from your browser or file manager before it can continue.
        </p>
      </div>

      <div className="mt-16 border-t border-hairline pt-6">
        <p className="text-xs italic text-slate/80">
          Part of the {STORE_NAME} ({STORE_ALT_NAME}) by Abhishek.
        </p>
      </div>
    </div>
  );
}
