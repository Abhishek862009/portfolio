// yt-saver is a Python app (it needs ffmpeg and long downloads), so it cannot run
// inside this Next.js site. Its code lives in /yt-saver in this repo, it runs on a
// server, and the site shows it at /yt-saver by forwarding that path to the server.
// Set YT_SAVER_URL (for example https://yt-backend.example.com, no trailing slash)
// in the site's environment variables to switch it on. Without it, nothing is
// forwarded and the App Store card says "Coming soon".
let ytSaverUrl = (process.env.YT_SAVER_URL || '').trim().replace(/\/+$/, '');
if (ytSaverUrl && !/^https?:\/\/[^\s/]+/i.test(ytSaverUrl)) {
  console.warn(`YT_SAVER_URL "${ytSaverUrl}" is not a full http(s) address. Ignoring it.`);
  ytSaverUrl = '';
}

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
      // The tool itself stays out of Google (the backend also sends this header).
      {
        source: '/yt-saver/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  async rewrites() {
    return [
      // Hisaab is a standalone static page in public/hisaab. Next does not
      // serve a folder's index.html on its own, so map the clean URL to it.
      { source: '/hisaab', destination: '/hisaab/index.html' },
      // yt-saver: /yt-saver and everything under it goes to the Python server.
      // (":path*" also matches an empty path, so /yt-saver itself is covered.)
      ...(ytSaverUrl
        ? [{ source: '/yt-saver/:path*', destination: `${ytSaverUrl}/:path*` }]
        : []),
    ];
  },
};

module.exports = nextConfig;
