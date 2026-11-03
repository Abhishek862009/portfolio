'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'en' | 'hi';
export const LANG_STORAGE_KEY = 'ab-lang';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({ lang: 'en', setLang: () => {} });

/**
 * Keeps the chosen language. The visible text is switched by CSS through the
 * `data-lang` attribute on <html> (see <T> and the inline script in app/layout.tsx,
 * which sets it before the first paint). This context only exists for text that CSS
 * cannot switch: placeholders, aria-labels, alert() messages.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    if (document.documentElement.getAttribute('data-lang') === 'hi') setLangState('hi');
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.setAttribute('data-lang', next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* private window or blocked storage: the choice just lasts until reload */
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
