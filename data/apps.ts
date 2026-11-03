// Source of truth for the Arvish App Store (a.k.a. Abhishek App Store).
//
// Three kinds of apps live here:
//
// 1. Android apps (platform 'Android'). To add one: copy the object, change
//    the fields, and add the APK as a GitHub Release asset (NOT inside the
//    repo — GitHub blocks files over 100 MiB and the browser uploader stops at
//    25 MiB, but a Release asset can be up to 2 GiB). Then paste that
//    Release's download URL into `downloadUrl`.
//
// 2. Web apps (platform 'Web'). Two ways to host them:
//    - Static page: put the app's files in `public/<name>/index.html`, add a
//      rewrite for `/<name>` in next.config.js, and set `openUrl` to `/<name>`.
//    - `external: true` is for an app that lives on a completely different address.
//
// 3. Terminal apps (platform 'Terminal'). Programs the visitor runs on their own device
//    (Windows, Android with Termux, Linux, Mac). The details page shows a device picker and
//    a full step-by-step guide in English and Hindi, written in data/guides/<app>.ts.
//    The app's files are zipped into public/downloads/<app>.zip (see scripts/make-yt-saver-zip.py).
//
// Hindi text for a card/page goes in the optional `hi` object of each app.
//
// Apps with `private: true` still show in the store, but their details page is
// hidden from Google and they are left out of the sitemap and the structured data.
//
// The All / Android / Web / Terminal toggle on the store is built from `platform`, so
// nothing else needs to change when an app is added.
//
// Pages, sitemap and SEO schema all update from this list.

import { ytSaverGuide } from '@/data/guides/yt-saver';
import type { AppGuide } from '@/data/guides/types';

export const SITE_URL = 'https://www.arvish.xyz';

export const STORE_NAME = 'Arvish App Store';
export const STORE_ALT_NAME = 'Abhishek App Store';
export const STORE_PATH = '/apps';

const RELEASE_BASE = 'https://github.com/Abhishek862009/portfolio/releases/download';

/** Hindi text for one app (Devanagari). Anything left out falls back to English. */
export interface AppHi {
  tagline: string;
  description: string;
  about?: string;
  howItWorks?: string[];
  notice?: { title: string; body: string };
}

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
  icon?: 'images' | 'calculator' | 'video';
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
  /** schema.org applicationCategory for the structured data. Defaults to UtilitiesApplication. */
  category?: string;
  /** Keep this app's details page out of Google, the sitemap and the structured data. */
  private?: boolean;
  /** Replaces the default info box at the bottom of the details page. */
  notice?: { title: string; body: string };
  /** Hindi version of the text above. */
  hi?: AppHi;
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
  /** Where the app opens: a same-site path such as '/hisaab', or a full https:// URL. */
  openUrl: string;
  /** True when `openUrl` is on another site: opens in a new tab. */
  external?: boolean;
  /** True until the app is hosted. Shows "Coming soon" instead of an Open button. */
  comingSoon?: boolean;
}

export interface TerminalApp extends AppBase {
  platform: 'Terminal';
  fileType: 'Terminal app';
  /** The app's files as a ZIP, served from /public (same-site path or full URL). */
  downloadUrl: string;
  /** Where the source code is, shown on the details page. */
  sourceUrl?: string;
  /** Step-by-step install guide (device picker + English/Hindi). */
  guide: AppGuide;
}

export type AppEntry = AndroidApp | WebApp | TerminalApp;

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
    category: 'MultimediaApplication',
    hi: {
      tagline: 'एक सीधा-सादा गैलरी ऐप।',
      description:
        'Abhi Gallery Android के लिए एक सामान्य और सरल गैलरी ऐप है, जिसमें कोई अतिरिक्त फ़ीचर नहीं है। APK डाउनलोड करें और अपने फ़ोन पर इंस्टॉल करें।',
    },
    seoDescription: `Download Abhi Gallery, a normal and simple gallery app for Android, from the ${STORE_NAME} (${STORE_ALT_NAME}).`,
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
    category: 'BusinessApplication',
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
    notice: {
      title: 'Your entries stay on your device',
      body: "This app runs in your browser and saves entries only in that browser on this device. Nothing is sent to a server, and clearing the browser's site data will erase them.",
    },
    hi: {
      tagline: 'एक सरल हिसाब डायरी: पीस × रेट, और चलता हुआ टोटल।',
      description:
        'Hisaab मज़दूरों की डायरी के लिए एक सरल वेब ऐप है। पीस (PS) और रेट (RS) डालें, Enter दबाएँ, और हर लाइन का गुणा होकर कुल जोड़ में जुड़ जाता है। लाइनें बदली या हटाई जा सकती हैं, और एंट्रियाँ सिर्फ़ आपके ब्राउज़र में सेव होती हैं।',
      about:
        'Hisaab, जिसे Hisab या हिसाब भी लिखा जाता है, Abhishek (Arvish) का बनाया एक मुफ़्त हिसाब-किताब वेब ऐप है। यह मज़दूर की डायरी जैसा चलता है: हर लाइन में पीस (PS) और रेट (RS) लिखें, Enter दबाएँ, और लाइन का टोटल निकलकर कुल जोड़ में जुड़ जाता है। किसी भी लाइन को सुधारा या हटाया जा सकता है, और कुछ भी सर्वर पर नहीं भेजा जाता।',
      howItWorks: [
        'पीस (PS) लिखें और Enter दबाएँ।',
        'रेट (RS) लिखें और Enter दबाएँ।',
        'लाइन का टोटल कुल जोड़ में जुड़ जाता है और अगली लाइन खुल जाती है।',
      ],
      notice: {
        title: 'आपकी एंट्रियाँ आपके डिवाइस पर ही रहती हैं',
        body: 'यह ऐप आपके ब्राउज़र में चलता है और एंट्रियाँ सिर्फ़ इसी डिवाइस के उसी ब्राउज़र में सेव करता है। कुछ भी सर्वर पर नहीं जाता, और ब्राउज़र का साइट डेटा साफ़ करने पर एंट्रियाँ मिट जाएँगी।',
      },
    },
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
  {
    // A program the visitor runs on their own device. YouTube blocks most servers, so a
    // hosted version does not hold up; on the visitor's own connection it does. The code is
    // in /yt-saver in this repo, zipped to public/downloads/yt-saver.zip for download.
    // `private`: the page is readable by anyone with the link, but kept out of Google and
    // the sitemap. Remove that line to let Google list it.
    slug: 'yt-saver',
    name: 'YT Saver',
    tagline: 'Save a video in the quality you pick. Runs on your own device.',
    description:
      'YT Saver is a small app that runs on your own computer or phone. Paste a YouTube link, pick a quality from highest to lowest, and save the file. It runs in a terminal on Windows, Android (Termux), Linux and Mac, and this page walks you through the setup step by step.',
    platform: 'Terminal',
    fileType: 'Terminal app',
    downloadUrl: '/downloads/yt-saver.zip',
    sourceUrl: 'https://github.com/Abhishek862009/portfolio/tree/main/yt-saver',
    guide: ytSaverGuide,
    private: true,
    icon: 'video',
    category: 'MultimediaApplication',
    howItWorks: [
      'Set it up once on your device with the guide below.',
      'Paste a YouTube link and press "Find qualities".',
      'Pick a quality and press "Save video". The file is saved to your Downloads folder.',
    ],
    notice: {
      title: 'Use it fairly',
      body: "Only save videos you own, that are licensed for reuse, or that you have permission to download. Downloading other people's videos may break YouTube's Terms of Service or copyright law. The app can stop working when YouTube changes; updating it usually fixes that.",
    },
    hi: {
      tagline: 'अपनी पसंद की क्वालिटी में वीडियो सेव करें। आपके अपने डिवाइस पर चलता है।',
      description:
        'YT Saver एक छोटा ऐप है जो आपके अपने कंप्यूटर या फ़ोन पर चलता है। YouTube का लिंक पेस्ट करें, सबसे ऊँची से सबसे कम तक कोई क्वालिटी चुनें, और फ़ाइल सेव करें। यह Windows, Android (Termux), Linux और Mac पर टर्मिनल में चलता है, और यह पेज सेटअप स्टेप-बाय-स्टेप समझाता है।',
      howItWorks: [
        'नीचे की गाइड से इसे अपने डिवाइस पर एक बार सेटअप करें।',
        'YouTube का लिंक पेस्ट करें और “Find qualities” दबाएँ।',
        'क्वालिटी चुनें और “Save video” दबाएँ। फ़ाइल आपके Downloads फ़ोल्डर में सेव हो जाती है।',
      ],
      notice: {
        title: 'इसे ज़िम्मेदारी से इस्तेमाल करें',
        body: 'सिर्फ़ वही वीडियो सेव करें जो आपके हों, दोबारा इस्तेमाल के लिए लाइसेंस वाले हों, या जिन्हें डाउनलोड करने की आपके पास अनुमति हो। दूसरों के वीडियो डाउनलोड करना YouTube की सेवा-शर्तों या कॉपीराइट कानून का उल्लंघन हो सकता है। YouTube में बदलाव होने पर ऐप चलना बंद हो सकता है; इसे अपडेट करने से आम तौर पर ठीक हो जाता है।',
      },
    },
    keywords: [],
  },
];

/** Apps that may appear in Google, the sitemap and structured data. */
export const publicApps = apps.filter((a) => !a.private);

export function getApp(slug: string) {
  return apps.find((a) => a.slug === slug);
}
