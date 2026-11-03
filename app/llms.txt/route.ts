import { publicApps, SITE_URL, STORE_ALT_NAME, STORE_NAME, STORE_PATH } from '@/data/apps';

// /llms.txt: a short, plain-text map of the site, in the format proposed at https://llmstxt.org.
// Honest note: it is a proposal, and no AI company has confirmed that its crawler reads it. It costs
// nothing and does no harm, but the page itself (both languages in the HTML) and the plain-Markdown
// guide files are what actually make the site easy for an AI to read.
// Apps marked `private` in data/apps.ts are left out, the same as in the sitemap.
export const dynamic = 'force-static';

export function GET() {
  const lines: string[] = [
    '# Abhishek (Arvish)',
    '',
    `> Personal website of Abhishek, also known as Arvish: a student developer from India who builds apps and runs Bidevlink. Pages are available in English and Hindi (हिन्दी); both languages are in the page HTML, and the reader's choice is only a display setting.`,
    '',
    '## Main pages',
    '',
    `- [Home](${SITE_URL}): about Abhishek, projects, timeline and contact`,
    `- [${STORE_NAME} (${STORE_ALT_NAME})](${SITE_URL}${STORE_PATH}): Android apps, web apps and terminal apps built by Abhishek`,
    `- [Bidevlink](${SITE_URL}/bidevlink): Abhishek's web design and development studio`,
    `- [Blog](${SITE_URL}/blog): articles`,
    '',
    '## Apps',
    '',
    ...publicApps.map((app) => `- [${app.name}](${SITE_URL}${STORE_PATH}/${app.slug}): ${app.tagline}`),
  ];

  const guided = publicApps.filter((a) => a.platform === 'Terminal');
  if (guided.length) {
    lines.push('', '## Setup guides (plain Markdown, every device in one file)', '');
    for (const app of guided) {
      lines.push(
        `- [${app.name} setup guide, English](${SITE_URL}/guides/${app.slug}/en)`,
        `- [${app.name} setup guide, Hindi](${SITE_URL}/guides/${app.slug}/hi)`
      );
    }
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
