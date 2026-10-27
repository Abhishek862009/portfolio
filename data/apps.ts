// Source of truth for the Arvish App Store (a.k.a. Abhishek App Store).
//
// To add a new app later: copy the object below, change the fields, and add
// the APK as a GitHub Release asset (NOT inside the repo — GitHub blocks
// files over 100 MiB and the browser uploader stops at 25 MiB, but a Release
// asset can be up to 2 GiB). Then paste that Release's download URL into
// `downloadUrl`. Pages, sitemap and SEO schema all update from this list.

export const SITE_URL = 'https://www.arvish.xyz';

export const STORE_NAME = 'Arvish App Store';
export const STORE_ALT_NAME = 'Abhishek App Store';
export const STORE_PATH = '/apps';

const RELEASE_BASE = 'https://github.com/Abhishek862009/portfolio/releases/download';

export interface AppEntry {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  platform: 'Android';
  fileType: 'APK';
  /** Shown as-is, e.g. "~64 MB". Optional. */
  sizeLabel?: string;
  /** Shown as-is, e.g. "1.0". Left out until the real version is known. */
  version?: string;
  /** Direct GitHub Release asset URL. Filename must not contain spaces. */
  downloadUrl: string;
  keywords: string[];
}

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
];

export function getApp(slug: string) {
  return apps.find((a) => a.slug === slug);
}
