// Shapes for an app's install guide. The guide text is data, not markup, so the same
// words feed the page (components/guide/GuideView.tsx), the plain-text/Markdown copy
// for AI readers (lib/guide-markdown.ts) and, later, any other app that needs one.

/** Text in both languages. Hindi is written in Devanagari. */
export interface Bi {
  en: string;
  hi: string;
}

export type OsId = 'windows' | 'android' | 'linux' | 'mac';

export interface GuideLink {
  label: Bi;
  href: string;
}

/** Lines the reader copies into the terminal, one after the other. */
export interface CodeBlock {
  /** Small caption above the block, e.g. a Linux distribution. */
  label?: Bi;
  lines: string[];
}

export interface GuideStep {
  title: Bi;
  text?: Bi;
  blocks?: CodeBlock[];
  /** What to expect, or what to do after the commands ran. */
  after?: Bi;
  links?: GuideLink[];
}

export interface GuideFix {
  problem: Bi;
  fix: Bi;
  blocks?: CodeBlock[];
}

export interface OsGuide {
  id: OsId;
  /** Button label, same in both languages. */
  label: string;
  name: Bi;
  summary: Bi;
  /** True only for steps that were really run by the author. Shown honestly on the page. */
  tested: boolean;
  testedNote: Bi;
  steps: GuideStep[];
  fixes: GuideFix[];
}

export interface AppGuide {
  heading: Bi;
  intro: Bi;
  why: Bi;
  needsTitle: Bi;
  needs: Bi[];
  chooseTitle: Bi;
  chooseHint: Bi;
  oses: OsGuide[];
  usingTitle: Bi;
  using: Bi[];
  goodToKnowTitle: Bi;
  goodToKnow: Bi[];
}
