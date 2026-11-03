import { apps, getApp, SITE_URL, STORE_PATH } from '@/data/apps';
import { GUIDE_LANGS, guideToMarkdown } from '@/lib/guide-markdown';
import type { GuideLang } from '@/lib/guide-markdown';

// /guides/<app>/en and /guides/<app>/hi: the install guide as one plain Markdown file, every
// device in it, nothing hidden. Built once at build time (the guide is data, see data/guides).
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return apps.flatMap((app) =>
    app.platform === 'Terminal' ? GUIDE_LANGS.map((lang) => ({ slug: app.slug, lang })) : []
  );
}

export function GET(_req: Request, { params }: { params: { slug: string; lang: string } }) {
  const app = getApp(params.slug);
  const lang = params.lang as GuideLang;
  if (!app || app.platform !== 'Terminal' || !GUIDE_LANGS.includes(lang)) {
    return new Response('Not found', { status: 404 });
  }

  const body = guideToMarkdown({
    name: app.name,
    tagline: { en: app.tagline, hi: app.hi?.tagline ?? app.tagline },
    pageUrl: `${SITE_URL}${STORE_PATH}/${app.slug}`,
    repoUrl: app.repoUrl,
    sourceUrl: app.sourceUrl,
    guide: app.guide,
    lang,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Language': lang,
      // Same rule as the app's page: a private app's guide stays out of search results too.
      ...(app.private ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}),
    },
  });
}
