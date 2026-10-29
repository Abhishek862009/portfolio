/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // /hisaab is the app itself. The page meant for search is /apps/hisaab,
    // so tell Google which one is the main version, using a header so the
    // app's own HTML file stays untouched.
    return [
      {
        source: '/hisaab',
        headers: [
          { key: 'Link', value: '<https://www.arvish.xyz/apps/hisaab>; rel="canonical"' },
        ],
      },
      {
        source: '/hisaab/index.html',
        headers: [
          { key: 'Link', value: '<https://www.arvish.xyz/apps/hisaab>; rel="canonical"' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Hisaab is a standalone static page in public/hisaab. Next does not
      // serve a folder's index.html on its own, so map the clean URL to it.
      { source: '/hisaab', destination: '/hisaab/index.html' },
    ];
  },
};

module.exports = nextConfig;
