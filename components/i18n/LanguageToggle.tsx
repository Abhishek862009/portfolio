'use client';

import { useLang } from '@/components/i18n/LanguageProvider';
import type { Lang } from '@/components/i18n/LanguageProvider';

const OPTIONS: { value: Lang; label: string; aria: string }[] = [
  { value: 'en', label: 'EN', aria: 'English' },
  { value: 'hi', label: 'हिं', aria: 'हिन्दी (Hindi)' },
];

/** English / Hindi switch, shown at the top of every page (in the navbar). */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language / भाषा"
      className={`inline-flex rounded-full border border-hairline bg-ink/40 p-0.5 ${className}`}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          lang={o.value}
          aria-pressed={lang === o.value}
          aria-label={o.aria}
          onClick={() => setLang(o.value)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            lang === o.value ? 'bg-glow/20 text-frost' : 'text-slate hover:text-frost'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
