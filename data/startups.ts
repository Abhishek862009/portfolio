export interface Startup {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  link: string;
  /** Hindi version of tagline and description. */
  hi?: { tagline: string; description: string };
}

export const startups: Startup[] = [
  {
    slug: 'bidevlink',
    name: 'Bidevlink',
    tagline: 'Websites for Indian exporters, built or refreshed in 48 hours.',
    description:
      'A productized web-design service for small Indian exporters and manufacturers — a new one-page site for those without one, or an ongoing care plan for those whose site already looks outdated. Built to help first-time overseas buyers trust a business before the first call.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    link: '/bidevlink',
    hi: {
      tagline: 'भारतीय निर्यातकों के लिए वेबसाइट, 48 घंटे में तैयार या नई।',
      description:
        'छोटे भारतीय निर्यातकों और निर्माताओं के लिए एक प्रोडक्ट-जैसी वेब-डिज़ाइन सर्विस — जिनके पास वेबसाइट नहीं है उनके लिए नई वन-पेज साइट, या जिनकी साइट पुरानी दिखती है उनके लिए चालू केयर प्लान। इसका मक़सद पहली बार खरीदने वाले विदेशी ग्राहकों को पहली कॉल से पहले ही कारोबार पर भरोसा दिलाना है।',
    },
  },
];
