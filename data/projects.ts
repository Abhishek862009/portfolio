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
  /** Hindi version of the description. */
  descriptionHi?: string;
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
    descriptionHi:
      'एक क्लाइंट के लिए बनाया गया रिस्पॉन्सिव एनिमेटेड फ़ोटो एल्बम, जिसमें स्मूद स्क्रॉलिंग और सुंदर प्रस्तुति है।',
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
    descriptionHi:
      'सतही क्षेत्रफल और आयतन की अवधारणाओं पर आधारित एक इंटरैक्टिव शैक्षिक क्विज़। JavaScript लॉजिक और यूज़र इंटरैक्शन की प्रैक्टिस के लिए बनाया गया।',
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
    descriptionHi:
      'शब्दावली और प्रोग्रामिंग लॉजिक सुधारने के लिए बना Python-आधारित शब्द-अर्थ गेम।',
    links: [],
  },
  {
    slug: 'infinity-loop-animation',
    title: 'Infinity Loop Animation',
    status: 'live',
    stack: ['HTML', 'CSS', 'JavaScript'],
    description:
      'A frontend animation experiment focused on creating an infinite looping visual effect using HTML, CSS, and JavaScript.',
    descriptionHi:
      'HTML, CSS और JavaScript से अनंत लूप जैसा विज़ुअल इफ़ेक्ट बनाने पर केंद्रित एक फ्रंटएंड एनिमेशन प्रयोग।',
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
    descriptionHi:
      'रचनात्मक इंटरैक्टिव लव लेटर डिज़ाइनों का संग्रह, जो कई वर्शनों में लेआउट, एनिमेशन और फ्रंटएंड रचनात्मकता का विकास दिखाता है।',
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
    descriptionHi:
      'सिर्फ़ सीखने और मनोरंजन के लिए बना एक हास्यप्रद JavaScript प्रयोग।',
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
