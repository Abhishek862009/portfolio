export type ProjectStatus = 'live' | 'not-live';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  status: ProjectStatus;
  stack: string[];
  description: string;
  links: ProjectLink[];
  /** Project-specific disclaimer, shown in addition to the sitewide one below. */
  disclaimer?: string;
}

// Source of truth: user-provided rebuild instructions (this list fully
// replaces all earlier project content — titles, links, and descriptions).
export const projects: Project[] = [
  {
    slug: 'animated-photo-album',
    title: 'Animated Photo Album',
    status: 'live',
    stack: ['HTML', 'CSS', 'JavaScript'],
    description:
      'A responsive animated photo album created as a custom client project with smooth scrolling and elegant visual presentation.',
    links: [
      { label: 'View Project', url: 'https://codepen.io/abhi-invisible/full/WbeozNd' },
    ],
  },
  {
    slug: 'surface-area-volume-quiz',
    title: 'Surface Area & Volume Quiz',
    status: 'live',
    stack: ['HTML', 'CSS', 'JavaScript'],
    description:
      'An interactive educational quiz based on surface area and volume concepts. Built to practice JavaScript logic and user interaction.',
    links: [
      { label: 'View Project', url: 'https://codepen.io/abhi-invisible/full/MYgvzGJ' },
    ],
  },
  {
    slug: 'word-meaning-game',
    title: 'Word Meaning Game',
    status: 'not-live',
    stack: ['Python'],
    description:
      'A Python-based word meaning game created to improve vocabulary and programming logic.',
    links: [],
  },
  {
    slug: 'infinity-loop-animation',
    title: 'Infinity Loop Animation',
    status: 'live',
    stack: ['HTML', 'CSS', 'JavaScript'],
    description:
      'A frontend animation experiment focused on creating an infinite looping visual effect using HTML, CSS, and JavaScript.',
    links: [
      { label: 'View Project', url: 'https://codepen.io/abhi-invisible/full/RwXgbmZ' },
    ],
  },
  {
    slug: 'love-letter-collection',
    title: 'Love Letter Collection',
    status: 'live',
    stack: ['HTML', 'CSS', 'JavaScript'],
    description:
      'A collection of creative interactive love letter designs showing the evolution of layout, animation, and frontend creativity across multiple versions.',
    links: [
      { label: 'View Version 1', url: 'https://codepen.io/abhi-invisible/full/mdNRvQK' },
      { label: 'View Version 2', url: 'https://codepen.io/abhi-invisible/full/mdgKgKZ' },
      { label: 'View Version 3', url: 'https://codepen.io/abhi-invisible/full/QWPewzN' },
    ],
  },
  {
    slug: 'funny-dowry-calculator',
    title: 'Funny Dowry Calculator',
    status: 'live',
    stack: ['HTML', 'CSS', 'JavaScript'],
    description:
      'A humorous JavaScript experiment created purely for learning and entertainment.',
    links: [
      { label: 'View Project', url: 'https://codepen.io/abhi-invisible/full/qBGZmNe' },
    ],
    disclaimer:
      'This project is intended purely for humor and educational purposes. It does not promote, encourage, or support the practice of dowry in any form.',
  },
];

// Shown on every project detail page, regardless of the individual project.
export const GLOBAL_PROJECT_DISCLAIMER =
  'The photos or personal content used in some demonstration projects belong to clients or were used with permission for portfolio demonstration purposes only.';
