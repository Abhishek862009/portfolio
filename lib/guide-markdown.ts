import type { AppGuide, Bi, CodeBlock, GuideFix, GuideStep, OsId } from '@/data/guides/types';

export type GuideLang = 'en' | 'hi';
export const GUIDE_LANGS: GuideLang[] = ['en', 'hi'];

const FENCE: Record<OsId, string> = { windows: 'powershell', android: 'bash', linux: 'bash', mac: 'bash' };

function blocks(list: CodeBlock[] | undefined, os: OsId | null, lang: GuideLang): string[] {
  const out: string[] = [];
  for (const block of list ?? []) {
    if (block.label) out.push(`${block.label[lang]}:`);
    out.push('```' + (os ? FENCE[os] : 'bash'), ...block.lines, '```', '');
  }
  return out;
}

/** Numbered steps as Markdown. `hashes` is the heading level of each step ("###" or "####"). */
function stepsToMarkdown(L: string[], steps: GuideStep[], os: OsId, lang: GuideLang, hashes: string) {
  const t = (b: Bi) => b[lang];
  steps.forEach((step, i) => {
    L.push(`${hashes} ${lang === 'hi' ? 'स्टेप' : 'Step'} ${i + 1}: ${t(step.title)}`, '');
    if (step.text) L.push(t(step.text), '');
    L.push(...blocks(step.blocks, os, lang));
    if (step.after) L.push(t(step.after), '');
    for (const link of step.links ?? []) L.push(`- ${t(link.label)}: ${link.href}`);
    if (step.links?.length) L.push('');
  });
}

function fixesToMarkdown(L: string[], fixes: GuideFix[], os: OsId, lang: GuideLang, hashes: string, title?: string) {
  const t = (b: Bi) => b[lang];
  if (!fixes.length) return;
  L.push(`${hashes} ${title ?? (lang === 'hi' ? 'कुछ गड़बड़ हो तो' : 'If something goes wrong')}`, '');
  for (const fix of fixes) {
    L.push(`- **${t(fix.problem)}**`, `  ${t(fix.fix)}`);
    for (const line of blocks(fix.blocks, os, lang)) L.push(line ? `  ${line}` : line);
  }
  L.push('');
}

/**
 * The install guide as plain Markdown, in one language. Meant for people who paste it into an
 * AI assistant (Gemini, ChatGPT, Claude) to ask for help, and for AI readers that fetch the page:
 * every device is in the one file, with no tabs, no scripts and no hidden parts.
 * Served at /guides/<slug>/en and /guides/<slug>/hi (app/guides/[slug]/[lang]/route.ts).
 */
export function guideToMarkdown(opts: {
  name: string;
  tagline: Bi;
  pageUrl: string;
  repoUrl: string;
  sourceUrl?: string;
  guide: AppGuide;
  lang: GuideLang;
}): string {
  const { name, tagline, pageUrl, repoUrl, sourceUrl, guide, lang } = opts;
  const t = (b: Bi) => b[lang];
  const L: string[] = [];

  L.push(`# ${name} — ${t(guide.heading)}`, '', `> ${t(tagline)}`, '');
  L.push(`- ${lang === 'hi' ? 'भाषा' : 'Language'}: ${lang === 'hi' ? 'हिन्दी (Hindi)' : 'English'}`);
  L.push(`- ${lang === 'hi' ? 'यह पेज' : 'Web page'}: ${pageUrl}`);
  L.push(`- ${lang === 'hi' ? 'ऐप का कोड (git clone)' : 'App code (git clone)'}: ${repoUrl}`);
  if (sourceUrl) L.push(`- ${lang === 'hi' ? 'सोर्स कोड' : 'Source code'}: ${sourceUrl}`);
  L.push('', t(guide.intro), '', t(guide.why), '');

  L.push(`## ${t(guide.needsTitle)}`, '', ...guide.needs.map((n) => `- ${t(n)}`), '');

  for (const os of guide.oses) {
    L.push(`## ${t(os.name)}`, '', t(os.summary), '');
    L.push(`${os.tested ? '✅' : 'ℹ️'} ${t(os.testedNote)}`, '');
    stepsToMarkdown(L, os.steps, os.id, lang, '###');
    fixesToMarkdown(L, os.fixes, os.id, lang, '###');

    // "How to update" belongs to the same device, right below its setup.
    L.push(`### ${lang === 'hi' ? 'अपडेट कैसे करें' : 'How to update'}`, '', t(guide.updateIntro), '');
    stepsToMarkdown(L, os.update, os.id, lang, '####');
    fixesToMarkdown(L, os.updateFixes, os.id, lang, '####', lang === 'hi' ? 'अपडेट न हो तो' : 'If the update fails');
  }

  L.push(`## ${t(guide.usingTitle)}`, '', ...guide.using.map((u, i) => `${i + 1}. ${t(u)}`), '');

  L.push(`## ${t(guide.goodToKnowTitle)}`, '', ...guide.goodToKnow.map((g) => `- ${t(g)}`), '');
  return L.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
