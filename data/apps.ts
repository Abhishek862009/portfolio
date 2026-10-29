// Source of truth for the Arvish App Store (a.k.a. Abhishek App Store).
//
// Two kinds of apps live here:
//
// 1. Android apps (platform 'Android'). To add one: copy the object, change
//    the fields, and add the APK as a GitHub Release asset (NOT inside the
//    repo — GitHub blocks files over 100 MiB and the browser uploader stops at
//    25 MiB, but a Release asset can be up to 2 GiB). Then paste that
//    Release's download URL into `downloadUrl`.
//
// 2. Web apps (platform 'Web'). These open in the browser instead of being
//    downloaded. Put the app's files in `public/<name>/index.html`, add a
//    rewrite for `/<name>` in next.config.js, and set `openUrl` to `/<name>`.
//
// Pages, sitemap and SEO schema all update from this list.

export const SITE_URL = 'https://www.arvish.xyz';

export const STORE_NAME = 'Arvish App Store';
export const STORE_ALT_NAME = 'Abhishek App Store';
export const STORE_PATH = '/apps';

const RELEASE_BASE = 'https://github.com/Abhishek862009/portfolio/releases/download';

interface AppBase {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Shown as-is, e.g. "~64 MB". Optional. */
  sizeLabel?: string;
  /** Shown as-is, e.g. "1.0". Left out until the real version is known. */
  version?: string;
  /** Card icon. Defaults to the gallery icon. */
  icon?: 'images' | 'calculator';
  /** Other spellings people search for. Goes into the page's structured data. */
  alternateNames?: string[];
  /** Details-page <title>. Keep it under about 60 characters. */
  seoTitle?: string;
  /** Details-page meta description, about 150 characters. */
  seoDescription?: string;
  /** Longer plain-language text shown on the details page. */
  about?: string;
  /** Short numbered steps shown on the details page. */
  howItWorks?: string[];
  keywords: string[];
}

export interface AndroidApp extends AppBase {
  platform: 'Android';
  fileType: 'APK';
  /** Direct GitHub Release asset URL. Filename must not contain spaces. */
  downloadUrl: string;
}

export interface WebApp extends AppBase {
  platform: 'Web';
  fileType: 'Web app';
  /** Where the app opens. A same-site path such as '/hisaab'. */
  openUrl: string;
}

export type AppEntry = AndroidApp | WebApp;

export const apps: AppEntry[] = [
  {
    slug: 'abhi-gallery',
    name: 'Abhi Gallery',
    tagline: 'A normal, simple gallery app.',
    description:
      'Abhi Gallery is a normal and simple gallery app for Android, with no extra features. Download the APK and install it on your phone.',
    platform: 'Android',
    fileType: 'APK',
    sizeLabel: '~64 MB',
    downloadUrl: `${RELEASE_BASE}/abhi-gallery-v1/abhi-gallery.apk`,
    keywords: [
      'Abhi Gallery',
      'Abhi Gallery app',
      'Abhi Gallery APK',
      'Abhi Gallery download',
      'simple gallery app',
      'Android gallery app',
    ],
  },
  {
    slug: 'hisaab',
    name: 'Hisaab',
    tagline: 'A simple hisaab diary: pieces × rate, with a running total.',
    description:
      'Hisaab is a simple web app for a worker diary. Type the pieces (PS) and the rate (RS), press Enter, and each line is multiplied and added to a running grand total. Lines can be edited or deleted, and entries are saved in your browser only.',
    platform: 'Web',
    fileType: 'Web app',
    openUrl: '/hisaab',
    icon: 'calculator',
    alternateNames: [
      'Hisab',
      'Hisaab App',
      'Hisab App',
      'Hisab Kitab',
      'Hisaab Kitaab',
      'हिसाब',
    ],
    seoTitle: 'Hisaab App by Abhishek (Arvish) – Hisab Kitab Web App',
    seoDescription:
      'Hisaab (hisab) app by Abhishek, also known as Arvish: a free hisab kitab web app. Type pieces and rate, press Enter, get a running total.',
    about:
      "Hisaab, also written Hisab or हिसाब, is a free hisab kitab web app by Abhishek, also known as Arvish. It works like a worker's diary page: for every line you type the pieces (PS) and the rate (RS), press Enter, and the line total is worked out and added to a running grand total. You can fix or delete any line, and nothing is sent to a server.",
    howItWorks: [
      'Type the pieces (PS) and press Enter.',
      'Type the rate (RS) and press Enter.',
      'The line total is added to the grand total and the next line opens.',
    ],
    keywords: [
      'Hisaab',
      'Hisab',
      'Hisaab app',
      'Hisab app',
      'Abhishek Hisaab app',
      'Abhishek Hisab app',
      'Arvish Hisaab app',
      'Arvish Hisab app',
      'Hisab Kitab app',
      'Hisaab Kitaab app',
      'Hisaab web app',
      'worker diary app',
      'piece rate calculator',
    ],
  },
];

export function getApp(slug: string) {
  return apps.find((a) => a.slug === slug);
}
