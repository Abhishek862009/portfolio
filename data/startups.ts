export interface Startup {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  link: string;
}

export const startups: Startup[] = [
  {
    slug: 'sitehaven',
    name: 'SiteHaven',
    tagline: 'Websites for Indian exporters, built or refreshed in 48 hours.',
    description:
      'A productized web-design service for small Indian exporters and manufacturers — a new one-page site for those without one, or an ongoing care plan for those whose site already looks outdated. Built to help first-time overseas buyers trust a business before the first call.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://claude.ai/artifact/AN24hRVdU4JTij5ABvSHzi',
  },
];
