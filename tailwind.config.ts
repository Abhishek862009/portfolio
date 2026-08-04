import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Design System — Phase 2 (locked, see portfolio-blueprint.md)
        // Deep navy-blue-black base. Blue reserved for glow/accent only —
        // never a co-equal theme color.
        void: '#06080F', // base background
        ink: '#0D1220', // elevated surfaces / cards / nav-on-scroll
        hairline: '#1C2333', // borders, dividers
        glow: '#5B79E8', // signature accent — glow, links, CTA only
        frost: '#EDEFF6', // primary text
        slate: '#8892A8', // muted / secondary text
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
