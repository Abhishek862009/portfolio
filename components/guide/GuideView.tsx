'use client';

import { useCallback, useEffect, useState } from 'react';
import { Apple, Monitor, Smartphone, Terminal as TerminalIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { T } from '@/components/i18n/T';
import { CopyButton } from '@/components/guide/CopyButton';
import { CopyGuideButton } from '@/components/guide/CopyGuideButton';
import type { AppGuide, Bi, CodeBlock, GuideFix, GuideStep, OsId } from '@/data/guides/types';

const OS_ICON: Record<OsId, LucideIcon> = {
  windows: Monitor,
  android: Smartphone,
  linux: TerminalIcon,
  mac: Apple,
};

/** Guess the visitor's device. Only used to open the matching guide for them; they can change it. */
function detectOs(): OsId | null {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return null; // not supported
  if (/windows/i.test(ua)) return 'windows';
  if (/macintosh|mac os x/i.test(ua)) return navigator.maxTouchPoints > 1 ? null : 'mac'; // iPadOS pretends to be a Mac
  if (/linux|x11|cros/i.test(ua)) return 'linux';
  return null;
}

const T2 = ({ b }: { b: Bi }) => <T en={b.en} hi={b.hi} />;

function Code({ block }: { block: CodeBlock }) {
  const text = block.lines.join('\n');
  return (
    <div className="mt-3">
      {block.label && (
        <p className="mb-1 text-xs font-medium text-slate">
          <T2 b={block.label} />
        </p>
      )}
      <div className="rounded-lg border border-hairline bg-void">
        <div className="flex justify-end border-b border-hairline px-2 py-1.5">
          <CopyButton text={text} />
        </div>
        {/* Selectable on purpose: on a phone, long-press selects it. */}
        <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed text-frost">
          <code>{text}</code>
        </pre>
      </div>
    </div>
  );
}

/** Numbered steps, used for both the setup guide and the update guide. */
function StepList({ steps }: { steps: GuideStep[] }) {
  return (
    <ol className="mt-6 space-y-7">
      {steps.map((step, i) => (
        <li key={step.title.en} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-glow/40 text-xs text-glow"
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-medium text-frost">
              <T2 b={step.title} />
            </h4>
            {step.text && (
              <p className="mt-1 text-sm leading-relaxed text-slate">
                <T2 b={step.text} />
              </p>
            )}
            {step.blocks?.map((block) => <Code key={block.lines.join('|')} block={block} />)}
            {step.after && (
              <p className="mt-3 text-sm leading-relaxed text-slate">
                <T2 b={step.after} />
              </p>
            )}
            {step.links && (
              <ul className="mt-3 space-y-1 text-sm">
                {step.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-glow underline-offset-4 hover:underline"
                    >
                      <T2 b={l.label} /> ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function FixList({ fixes }: { fixes: GuideFix[] }) {
  return (
    <ul className="mt-3 space-y-5">
      {fixes.map((fix) => (
        <li key={fix.problem.en} className="text-sm">
          <p className="font-medium text-frost">
            <T2 b={fix.problem} />
          </p>
          <p className="mt-1 leading-relaxed text-slate">
            <T2 b={fix.fix} />
          </p>
          {fix.blocks?.map((block) => <Code key={block.lines.join('|')} block={block} />)}
        </li>
      ))}
    </ul>
  );
}

/**
 * "How to update": the same four steps for every Terminal app (stop, git pull, update the
 * libraries, start again), one <details> per device. Like the setup guide, every device is in the
 * HTML at all times; the visitor's own device (if it can be guessed) is just opened for them.
 */
function UpdateSection({ guide }: { guide: AppGuide }) {
  const [selected, setSelected] = useState<OsId | null>(null);

  useEffect(() => {
    const guess = detectOs();
    if (guess && guide.oses.some((o) => o.id === guess)) setSelected(guess);
  }, [guide.oses]);

  return (
    <section id="update" aria-labelledby="update-title" className="mt-16 scroll-mt-24">
      <h2 id="update-title" className="text-2xl font-semibold text-frost">
        <T en="How to update" hi="अपडेट कैसे करें" />
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
        <T2 b={guide.updateIntro} />
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
        <T
          en="In short: stop the app, go into its folder, run git pull, update the libraries and start the app again. Open your device below for the exact lines, and copy them into the same kind of terminal window you used for the setup."
          hi="संक्षेप में: ऐप को रोकें, उसके फ़ोल्डर में जाएँ, git pull चलाएँ, लाइब्रेरी अपडेट करें और ऐप दोबारा चालू करें। सटीक लाइनों के लिए नीचे अपना डिवाइस खोलें, और उन्हें उसी तरह की टर्मिनल विंडो में कॉपी करें जैसी आपने सेटअप में इस्तेमाल की थी।"
        />
      </p>

      <div className="mt-6 space-y-4">
        {guide.oses.map((os) => (
          <details
            key={os.id}
            id={`update-${os.id}`}
            open={selected === os.id}
            onToggle={(e) => {
              const isOpen = (e.currentTarget as HTMLDetailsElement).open;
              setSelected((cur) => (isOpen ? os.id : cur === os.id ? null : cur));
            }}
            className="scroll-mt-24 rounded-2xl border border-hairline bg-ink/40 p-5 open:border-glow/30"
          >
            <summary className="cursor-pointer list-none text-lg font-medium text-frost">
              <T2 b={os.name} />
            </summary>

            <StepList steps={os.update} />

            <h4 className="mt-9 text-base font-medium text-frost">
              <T en="If something goes wrong" hi="कुछ गड़बड़ हो तो" />
            </h4>
            <FixList fixes={os.updateFixes} />
          </details>
        ))}
      </div>
    </section>
  );
}

/**
 * The device picker and the install guide. All four guides are in the HTML at all times
 * (each in its own <details>), so the page reads completely without JavaScript and for AI
 * readers; the picker only opens the right one.
 */
export function GuideView({ slug, guide }: { slug: string; guide: AppGuide }) {
  const [selected, setSelected] = useState<OsId | null>(null);
  const [detected, setDetected] = useState<OsId | null>(null);

  const open = useCallback((id: OsId, scroll: boolean) => {
    setSelected(id);
    try {
      history.replaceState(null, '', `#os-${id}`);
    } catch {
      /* ignore */
    }
    if (scroll) {
      requestAnimationFrame(() =>
        document.getElementById(`os-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    }
  }, []);

  useEffect(() => {
    const fromHash = guide.oses.find((o) => `#os-${o.id}` === window.location.hash)?.id;
    const guess = detectOs();
    setDetected(guess && guide.oses.some((o) => o.id === guess) ? guess : null);
    const first = fromHash ?? (guess && guide.oses.some((o) => o.id === guess) ? guess : null);
    if (first) {
      setSelected(first);
      if (fromHash) requestAnimationFrame(() => document.getElementById(`os-${fromHash}`)?.scrollIntoView({ block: 'start' }));
    }
  }, [guide.oses]);

  return (
    <section id="setup" aria-labelledby="setup-title" className="mt-16 scroll-mt-24">
      <h2 id="setup-title" className="text-2xl font-semibold text-frost">
        <T2 b={guide.heading} />
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
        <T2 b={guide.intro} />
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
        <T2 b={guide.why} />
      </p>

      <div className="mt-6 max-w-2xl rounded-xl border border-hairline bg-ink/40 p-4 text-sm text-slate">
        <p className="font-medium text-frost">
          <T en="Stuck? Ask an AI assistant." hi="कहीं अटक गए? किसी AI असिस्टेंट से पूछें।" />
        </p>
        <p className="mt-1">
          <T
            en="Copy this whole guide and paste it into Gemini, ChatGPT or Claude together with your question. The plain-text versions below contain every device, with nothing hidden."
            hi="यह पूरी गाइड कॉपी करके अपने सवाल के साथ Gemini, ChatGPT या Claude में पेस्ट करें। नीचे के प्लेन-टेक्स्ट वर्शन में हर डिवाइस की जानकारी है, कुछ भी छिपा नहीं।"
          />
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <CopyGuideButton slug={slug} />
          <a href={`/guides/${slug}/en`} className="text-xs underline underline-offset-4 hover:text-frost" hrefLang="en">
            Plain text (English)
          </a>
          <a href={`/guides/${slug}/hi`} className="text-xs underline underline-offset-4 hover:text-frost" hrefLang="hi" lang="hi">
            प्लेन टेक्स्ट (हिन्दी)
          </a>
        </div>
      </div>

      <h3 className="mt-10 text-lg font-semibold text-frost">
        <T2 b={guide.needsTitle} />
      </h3>
      <ul className="mt-3 max-w-2xl list-disc space-y-1.5 pl-5 text-sm text-slate">
        {guide.needs.map((n) => (
          <li key={n.en}>
            <T2 b={n} />
          </li>
        ))}
      </ul>

      <h3 id="choose-device" className="mt-10 text-lg font-semibold text-frost">
        <T2 b={guide.chooseTitle} />
      </h3>
      <p className="mt-1 text-sm text-slate">
        <T2 b={guide.chooseHint} />
      </p>
      <div role="group" aria-labelledby="choose-device" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {guide.oses.map((os) => {
          const Icon = OS_ICON[os.id];
          const active = selected === os.id;
          return (
            <button
              key={os.id}
              type="button"
              aria-pressed={active}
              aria-controls={`os-${os.id}`}
              onClick={() => open(os.id, true)}
              className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-glow ${
                active ? 'border-glow/60 bg-glow/15 text-frost' : 'border-hairline bg-ink/40 text-slate hover:border-glow/40 hover:text-frost'
              }`}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="font-medium">{os.label}</span>
              {detected === os.id && (
                <span className="text-[11px] text-glow">
                  <T en="Looks like yours" hi="शायद आपका यही है" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {guide.oses.map((os) => (
          <details
            key={os.id}
            id={`os-${os.id}`}
            open={selected === os.id}
            onToggle={(e) => {
              const isOpen = (e.currentTarget as HTMLDetailsElement).open;
              setSelected((cur) => (isOpen ? os.id : cur === os.id ? null : cur));
            }}
            className="scroll-mt-24 rounded-2xl border border-hairline bg-ink/40 p-5 open:border-glow/30"
          >
            <summary className="cursor-pointer list-none text-lg font-medium text-frost">
              <T2 b={os.name} />
            </summary>

            <p className="mt-3 text-sm text-slate">
              <T2 b={os.summary} />
            </p>
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                os.tested ? 'border-glow/30 bg-glow/5 text-frost' : 'border-hairline text-slate'
              }`}
            >
              <span className="font-medium">{os.tested ? '✓ ' : 'ℹ '}</span>
              <T2 b={os.testedNote} />
            </p>

            <StepList steps={os.steps} />

            <h4 className="mt-9 text-base font-medium text-frost">
              <T en="If something goes wrong" hi="कुछ गड़बड़ हो तो" />
            </h4>
            <FixList fixes={os.fixes} />
          </details>
        ))}
      </div>

      <h3 className="mt-14 text-lg font-semibold text-frost">
        <T2 b={guide.usingTitle} />
      </h3>
      <ol className="mt-3 max-w-2xl list-decimal space-y-1.5 pl-5 text-sm text-slate">
        {guide.using.map((u) => (
          <li key={u.en}>
            <T2 b={u} />
          </li>
        ))}
      </ol>

      <UpdateSection guide={guide} />

      <h3 className="mt-16 text-lg font-semibold text-frost">
        <T2 b={guide.goodToKnowTitle} />
      </h3>
      <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate">
        {guide.goodToKnow.map((g) => (
          <li key={g.en}>
            <T2 b={g} />
          </li>
        ))}
      </ul>
    </section>
  );
}
