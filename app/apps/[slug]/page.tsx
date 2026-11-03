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
import { T } from '@/components/i18n/T';
import { LanguageToggle } from '@/components/i18n/LanguageToggle';
import { GuideView } from '@/components/guide/GuideView';
import type { Bi } from '@/data/guides/types';
import { AppIcon } from '@/components/ui/AppIcon';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { GuideButton } from '@/components/ui/GuideButton';
import { OpenAppButton } from '@/components/ui/OpenAppButton';
import { Reveal } from '@/components/ui/Reveal';

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const app = getApp(params.slug);
  if (!app) return {};

  const isAndroid = app.platform === 'Android';
  const isTerminal = app.platform === 'Terminal';
  // Per-app text first (seoTitle / seoDescription in data/apps.ts); the
  // fallbacks are generic so a new app never inherits another app's wording.
  const title =
    app.seoTitle ??
    (isAndroid
      ? `${app.name} APK Download | ${STORE_NAME}`
      : isTerminal
        ? `${app.name} Setup Guide (Windows, Android, Linux, Mac) | ${STORE_NAME}`
        : `${app.name} | ${STORE_NAME}`);
  const description =
    app.seoDescription ??
    (isAndroid
      ? `Download ${app.name} for Android from the ${STORE_NAME} (${STORE_ALT_NAME}). ${app.tagline}`
      : isTerminal
        ? `${app.name}: a terminal app from the ${STORE_NAME} (${STORE_ALT_NAME}). Step-by-step setup for Windows, Android (Termux), Linux and Mac, in English and Hindi. ${app.tagline}`
        : `Open ${app.name}, a free web app from the ${STORE_NAME} (${STORE_ALT_NAME}). ${app.tagline}`);
  const path = `${STORE_PATH}/${app.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: [...app.keywords, STORE_NAME, STORE_ALT_NAME],
    // Private tools stay out of Google.
    ...(app.private ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: path,
      // The same guide as plain Markdown, one file per language, for AI readers and copy-paste.
      ...(isTerminal
        ? {
            types: {
              'text/markdown': [
                { url: `/guides/${app.slug}/en`, title: `${app.name} setup guide (English)` },
                { url: `/guides/${app.slug}/hi`, title: `${app.name} सेटअप गाइड (हिन्दी)` },
              ],
            },
          }
        : {}),
    },
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
      : app.platform === 'Terminal'
        ? {
            '@type': 'SoftwareApplication',
            name: app.name,
            description: app.description,
            url,
            operatingSystem: 'Windows, Android (Termux), Linux, macOS',
            applicationCategory: app.category ?? 'UtilitiesApplication',
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

  const facts: { label: Bi; value: Bi }[] = [
    {
      label: { en: 'Platform', hi: 'प्लेटफ़ॉर्म' },
      value:
        app.platform === 'Terminal'
          ? { en: 'Windows · Android (Termux) · Linux · Mac', hi: 'Windows · Android (Termux) · Linux · Mac' }
          : { en: app.platform, hi: app.platform },
    },
    {
      label: {
        en: app.platform === 'Android' ? 'File type' : 'Type',
        hi: app.platform === 'Android' ? 'फ़ाइल प्रकार' : 'प्रकार',
      },
      value: {
        en: app.fileType,
        hi: app.fileType === 'Web app' ? 'वेब ऐप' : app.fileType === 'Terminal app' ? 'टर्मिनल ऐप' : app.fileType,
      },
    },
    ...(app.sizeLabel ? [{ label: { en: 'Size', hi: 'साइज़' }, value: { en: app.sizeLabel, hi: app.sizeLabel } }] : []),
    ...(app.version ? [{ label: { en: 'Version', hi: 'वर्शन' }, value: { en: app.version, hi: app.version } }] : []),
  ];

  // Shown in the box at the bottom. Each app can bring its own; these are
  // only the generic defaults per platform.
  const notice: { en: { title: string; body: string }; hi: { title: string; body: string } } = {
    en:
      app.notice ??
      (app.platform === 'Android'
        ? {
            title: 'Installing the APK',
            body: 'This app is installed from a file, not from the Play Store, so Android may ask you to allow installs from your browser or file manager before it can continue.',
          }
        : {
            title: 'Opens in your browser',
            body: 'Nothing to install. This app opens as a web page.',
          }),
    hi:
      app.hi?.notice ??
      (app.platform === 'Android'
        ? {
            title: 'APK इंस्टॉल करना',
            body: 'यह ऐप Play Store से नहीं, एक फ़ाइल से इंस्टॉल होता है, इसलिए आगे बढ़ने से पहले Android आपसे अपने ब्राउज़र या फ़ाइल मैनेजर से इंस्टॉल की अनुमति माँग सकता है।',
          }
        : {
            title: 'आपके ब्राउज़र में खुलता है',
            body: 'कुछ इंस्टॉल करने की ज़रूरत नहीं। यह ऐप एक वेब पेज की तरह खुलता है।',
          }),
  };

  const howItWorks = app.howItWorks;
  const howItWorksHi = app.hi?.howItWorks;

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      {/* Private tools are noindex, so they get no structured data either. */}
      {!app.private && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <Link
          href={STORE_PATH}
          className="inline-flex items-center gap-2 text-sm text-slate transition-colors hover:text-frost"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <T en={`Back to ${STORE_NAME}`} hi={`${STORE_NAME} पर वापस`} />
        </Link>
        {/* English / Hindi: only on the apps that have a setup guide. */}
        {app.platform === 'Terminal' && <LanguageToggle className="shrink-0" />}
      </div>

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
            <p className="mt-1 text-sm italic text-slate/80">
              <T en={app.tagline} hi={app.hi?.tagline} />
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate">
          <T en={app.description} hi={app.hi?.description} />
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {facts.map((f) => (
            <li
              key={f.label.en}
              className="rounded-full border border-hairline px-3 py-1 text-xs text-slate"
            >
              <T en={`${f.label.en}: ${f.value.en}`} hi={`${f.label.hi}: ${f.value.hi}`} />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {app.platform === 'Android' ? (
            <DownloadButton
              href={app.downloadUrl}
              label={<T en={`Download ${app.name}`} hi={`${app.name} डाउनलोड करें`} />}
              size="large"
            />
          ) : app.platform === 'Terminal' ? (
            <GuideButton
              href="#setup"
              label={<T en="Choose your device" hi="अपना डिवाइस चुनें" />}
              size="large"
            />
          ) : app.comingSoon ? (
            <ComingSoonBadge size="large" />
          ) : (
            <OpenAppButton
              href={app.openUrl}
              label={<T en={`Open ${app.name}`} hi={`${app.name} खोलें`} />}
              size="large"
              external={app.external}
            />
          )}
        </div>

        {app.platform === 'Terminal' && (
          <p className="mt-4 max-w-xl text-xs leading-relaxed text-slate/80">
            <T
              en="There is nothing to download here. The guide below installs what is needed and then gets the app with git clone, step by step, for your device."
              hi="यहाँ से कुछ डाउनलोड नहीं करना। नीचे की गाइड आपके डिवाइस के लिए ज़रूरी चीज़ें इंस्टॉल करती है और फिर git clone से ऐप ले आती है, स्टेप-बाय-स्टेप।"
            />
            {app.sourceUrl && (
              <>
                {' '}
                <a
                  href={app.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-frost"
                >
                  <T en="Source code on GitHub ↗" hi="GitHub पर सोर्स कोड ↗" />
                </a>
              </>
            )}
          </p>
        )}
      </Reveal>

      {howItWorks && (
        <section className="mt-12 max-w-xl">
          <h2 className="text-xl font-semibold text-frost">
            <T en={`How ${app.name} works`} hi={`${app.name} कैसे काम करता है`} />
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate">
            {howItWorks.map((step, i) => (
              <li key={step}>
                <T en={step} hi={howItWorksHi?.[i]} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {app.about && (
        <section className="mt-10 max-w-xl">
          <h2 className="text-xl font-semibold text-frost">
            <T en={`About the ${app.name} app`} hi={`${app.name} ऐप के बारे में`} />
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate">
            <T en={app.about} hi={app.hi?.about} />
          </p>
        </section>
      )}

      {app.platform === 'Terminal' && <GuideView slug={app.slug} guide={app.guide} />}

      <div className="mt-12 max-w-xl rounded-xl border border-hairline bg-ink/40 p-4 text-sm text-slate">
        <p className="font-medium text-frost">
          <T en={notice.en.title} hi={notice.hi.title} />
        </p>
        <p className="mt-2">
          <T en={notice.en.body} hi={notice.hi.body} />
        </p>
      </div>

      <div className="mt-16 border-t border-hairline pt-6">
        <p className="text-xs italic text-slate/80">
          <T
            en={`Part of the ${STORE_NAME} (${STORE_ALT_NAME}) by Abhishek.`}
            hi={`${STORE_NAME} (${STORE_ALT_NAME}) का हिस्सा, Abhishek द्वारा।`}
          />
        </p>
      </div>
    </div>
  );
}
