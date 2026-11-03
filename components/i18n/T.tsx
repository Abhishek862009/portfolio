import type { ReactNode } from 'react';

/**
 * Bilingual text. Writes BOTH languages into the page's HTML, each in its own
 * <span lang="..."> and CSS (app/globals.css) shows only the chosen one.
 *
 * Why both, and not "swap the text with JavaScript":
 *  - the page needs no JavaScript to be read (search engines, AI readers such as
 *    Gemini, "reader mode", a slow phone) and nothing flashes when the language changes;
 *  - the page can stay static (no cookies, no per-visitor rendering).
 *
 * Without `hi` it just renders `en`, so a string that has no translation yet is never blank.
 */
export function T({ en, hi }: { en: ReactNode; hi?: ReactNode }) {
  if (hi === undefined || hi === null) return <>{en}</>;
  return (
    <>
      <span lang="en" data-l="en">
        {en}
      </span>
      <span lang="hi" data-l="hi">
        {hi}
      </span>
    </>
  );
}
