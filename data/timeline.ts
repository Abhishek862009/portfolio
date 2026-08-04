export type TimelineCategory = 'Education' | 'Achievement' | 'Project' | 'Milestone';

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  categories: TimelineCategory[];
}

// Source of truth: portfolio-blueprint.md, Section 5 (Timeline)
// Long-term vision entry is intentionally grounded in present-tense action —
// never presented as a bold claim in isolation. See blueprint framing rule.
export const timeline: TimelineEntry[] = [
  {
    id: 'early-curiosity',
    title: 'Early curiosity',
    description:
      'Interested in technology since early school years, without structured guidance yet.',
    categories: ['Milestone'],
  },
  {
    id: 'class-9-turning-serious',
    title: 'Curiosity turns serious',
    description: 'Around Class 9, started exploring technology more deliberately.',
    categories: ['Milestone'],
  },
  {
    id: 'class-10-boards',
    title: 'Class 10 boards — 80.57%',
    description:
      'Initially felt disappointing — now seen as the milestone that pushed real improvement.',
    categories: ['Education', 'Milestone'],
  },
  {
    id: 'python-html-foundation',
    title: 'Learning Python & HTML',
    description:
      'During a 3-month break after Class 10, started learning Python and HTML — the real foundation of everything that followed.',
    categories: ['Milestone', 'Education'],
  },
  {
    id: 'early-builds',
    title: 'Early builds',
    description:
      'Built early frontend projects and Python projects, including a word meaning game.',
    categories: ['Project'],
  },
  {
    id: 'jee-preparation',
    title: 'JEE preparation phase',
    description:
      'Currently preparing for JEE with coaching. Coding intentionally paused, but the technical foundation continues to shape how problems are approached.',
    categories: ['Education', 'Milestone'],
  },
  {
    id: 'rebuilding-consistency',
    title: 'Rebuilding consistency',
    description:
      'Actively working on balancing exam preparation with continued technical growth, step by step.',
    categories: ['Milestone'],
  },
  {
    id: 'long-term-vision',
    title: 'The long-term vision',
    description:
      'A 20-year goal: build an OS-level technology product and, eventually, a technology company — being built toward today through learning, projects, and steadily improving technical foundations.',
    categories: ['Milestone', 'Achievement'],
  },
];
