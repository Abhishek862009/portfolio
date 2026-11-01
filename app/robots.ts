import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The tool itself (not its /apps/yt-saver description page).
      disallow: '/yt-saver',
    },
    sitemap: 'https://www.arvish.xyz/sitemap.xml',
  };
}
