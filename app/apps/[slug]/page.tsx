import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import {
  apps,
  getApp,
  SITE_URL,
  STORE_NAME,
  STORE_ALT_NAME,
  STORE_PATH,
} from '@/data/apps';
import { AppIcon } from '@/components/ui/AppIcon';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { OpenAppButton } from '@/components/ui/OpenAppButton';
import { Reveal } from '@/components/ui/Reveal';

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const app = getApp(params.slug);
  if (!app) return {};

  const isAndroid = app.platform === 'Android';
  // Per-app text first (seoTitle / seoDescription in data/apps.ts); the
  // fallbacks are generic so a new app never inherits another app's wording.
  const title =
    app.seoTitle ??
    (isAndroid ? `${app.name} APK Download | ${STORE_NAME}` : `${app.name} | ${STORE_NAME}`);
  const description =
    app.seoDescription ??
    (isAndroid
      ? `Download ${app.name} for Android from the ${STORE_NAME} (${STORE_ALT_NAME}). ${app.tagline}`
      : `Open ${app.name}, a free web app from the ${STORE_NAME} (${STORE_ALT_NAME}). ${app.tagline}`);
  const path = `${STORE_PATH}/${app.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: [...app.keywords, STORE_NAME, STORE_ALT_NAME],
    // Private tools stay out of Google.
    ...(app.private ? { robots: { index: false, follow: false } } : {}),
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
  const author = { '@type': 'Person', name: 'Abhishek', alternateName: 'Arvish', url: SITE_URL };
  const alt = app.alternateNames ? { alternateName: app.alternateNames } : {};
  const offers = { '@type': 'Offer', price: '0', priceCurrency: 'INR' };

  const appSchema =
    app.platform === 'Android'
      ? {
          '@type': 'MobileApplication',
          name: app.name,
          description: app.description,
          url,
          operatingSystem: 'Android',
          applicationCategory: app.category ?? 'UtilitiesApplication',
          downloadUrl: app.downloadUrl,
          ...(app.version ? { softwareVersion: app.version } : {}),
          ...alt,
          author,
          offers,
        }
      : {
          '@type': 'WebApplication',
          name: app.name,
          description: app.description,
          url,
          operatingSystem: 'Any',
          applicationCategory: app.category ?? 'UtilitiesApplication',
          browserRequirements: 'Requires JavaScript',
          ...(app.version ? { softwareVersion: app.version } : {}),
          ...alt,
          author,
          offers,
        };

  // Deliberately no aggregateRating/review: there are none yet, and making
  // them up would be fake structured data. Google's rich-result display for
  // apps requires one of those, so this schema helps Google understand the
  // page but will not by itself produce a star-rating snippet.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      appSchema,
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
    { label: app.platform === 'Android' ? 'File type' : 'Type', value: app.fileType },
    ...(app.sizeLabel ? [{ label: 'Size', value: app.sizeLabel }] : []),
    ...(app.version ? [{ label: 'Version', value: app.version }] : []),
    ...(app.private ? [{ label: 'Access', value: 'Password protected' }] : []),
  ];

  // Shown in the box at the bottom. Each app can bring its own; these are
  // only the generic defaults per platform.
  const notice =
    app.notice ??
    (app.platform === 'Android'
      ? {
          title: 'Installing the APK',
          body: 'This app is installed from a file, not from the Play Store, so Android may ask you to allow installs from your browser or file manager before it can continue.',
        }
      : {
          title: 'Opens in your browser',
          body: 'Nothing to install. This app opens as a web page.',
        });

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      {/* Private tools are noindex, so they get no structured data either. */}
      {!app.private && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

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
            <AppIcon icon={app.icon} className="h-8 w-8" />
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
          {app.platform === 'Android' ? (
            <DownloadButton href={app.downloadUrl} label={`Download ${app.name}`} size="large" />
          ) : app.comingSoon ? (
            <ComingSoonBadge size="large" />
          ) : (
            <OpenAppButton
              href={app.openUrl}
              label={`Open ${app.name}`}
              size="large"
              external={app.external}
            />
          )}
        </div>
      </Reveal>

      {app.howItWorks && (
        <section className="mt-12 max-w-xl">
          <h2 className="text-xl font-semibold text-frost">How {app.name} works</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate">
            {app.howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {app.about && (
        <section className="mt-10 max-w-xl">
          <h2 className="text-xl font-semibold text-frost">About the {app.name} app</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate">{app.about}</p>
        </section>
      )}

      <div className="mt-12 max-w-xl rounded-xl border border-hairline bg-ink/40 p-4 text-sm text-slate">
        <p className="font-medium text-frost">{notice.title}</p>
        <p className="mt-2">{notice.body}</p>
      </div>

      <div className="mt-16 border-t border-hairline pt-6">
        <p className="text-xs italic text-slate/80">
          Part of the {STORE_NAME} ({STORE_ALT_NAME}) by Abhishek.
        </p>
      </div>
    </div>
  );
}
