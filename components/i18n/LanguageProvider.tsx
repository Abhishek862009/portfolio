'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export type Lang = 'en' | 'hi';
export const LANG_STORAGE_KEY = 'ab-lang';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({ lang: 'en', setLang: () => {} });

/**
 * Keeps the chosen language, but only for the pages that have an English/Hindi switch
 * (`guidePaths`: the setup-guide pages of the Terminal apps, built in app/layout.tsx).
 * Every other page is always English, so a choice made in a guide never changes the rest
 * of the website.
 *
 * The visible text is switched by CSS through the `data-lang` attribute on <html> (see <T>
 * and the inline script in app/layout.tsx, which sets it before the first paint on a guide
 * page). This context also serves text that CSS cannot switch: placeholders, aria-labels.
 */
export function LanguageProvider({ children, guidePaths }: { children: ReactNode; guidePaths: string[] }) {
  const pathname = usePathname();
  const [stored, setStored] = useState<Lang>('en');
  const bilingual = guidePaths.includes((pathname || '').replace(/\/+$/, ''));
  const lang: Lang = bilingual ? stored : 'en';

  // The saved choice from an earlier visit.
  useEffect(() => {
    try {
      if (localStorage.getItem(LANG_STORAGE_KEY) === 'hi') setStored('hi');
    } catch {
      /* storage blocked: the choice just lasts until reload */
    }
  }, []);

  // Keeps <html data-lang> right when moving between pages without a reload.
  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setStored(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* private window or blocked storage */
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** t('Name', 'नाम') picks the string for the current language. */
export function useT() {
  const { lang } = useLang();
  return useCallback((en: string, hi: string) => (lang === 'hi' ? hi : en), [lang]);
}
