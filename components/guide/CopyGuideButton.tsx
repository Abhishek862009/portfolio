'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ClipboardCopy } from 'lucide-react';

import { T } from '@/components/i18n/T';
import { useLang } from '@/components/i18n/LanguageProvider';

/**
 * Copies the whole guide as plain text, in the language that is on screen, so it can be
 * pasted into an AI assistant. It fetches the same Markdown file that is linked next to it.
 */
export function CopyGuideButton({ slug }: { slug: string }) {
  const { lang } = useLang();
  const [state, setState] = useState<'idle' | 'busy' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    setState('busy');
    try {
      const res = await fetch(`/guides/${slug}/${lang}`);
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setState('copied');
    } catch {
      setState('failed');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 3000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={state === 'busy'}
      className="inline-flex items-center gap-1.5 rounded-full border border-glow/40 bg-glow/10 px-3 py-1.5 text-xs font-medium text-frost transition-colors hover:border-glow/60 hover:bg-glow/20 disabled:opacity-60"
    >
      {state === 'copied' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span aria-live="polite">
        {state === 'copied' ? (
          <T en="Copied. Paste it into your AI assistant." hi="कॉपी हो गया। इसे अपने AI असिस्टेंट में पेस्ट करें।" />
        ) : state === 'failed' ? (
          <T en="Could not copy. Use the plain-text links." hi="कॉपी नहीं हो पाया। प्लेन-टेक्स्ट लिंक इस्तेमाल करें।" />
        ) : (
          <T en="Copy guide for an AI assistant" hi="AI असिस्टेंट के लिए गाइड कॉपी करें" />
        )}
      </span>
    </button>
  );
}
