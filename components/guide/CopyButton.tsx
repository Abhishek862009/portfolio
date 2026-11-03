'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { T } from '@/components/i18n/T';

/** Copies `text` to the clipboard and says so for two seconds. */
export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed'); // clipboard blocked (old browser, or a page that is not HTTPS)
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-2 py-1 text-xs text-slate transition-colors hover:border-glow/50 hover:text-frost"
    >
      {state === 'copied' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span aria-live="polite">
        {state === 'copied' ? (
          <T en="Copied" hi="कॉपी हो गया" />
        ) : state === 'failed' ? (
          <T en="Select and copy by hand" hi="हाथ से सेलेक्ट करके कॉपी करें" />
        ) : (
          <T en="Copy" hi="कॉपी" />
        )}
      </span>
    </button>
  );
}
