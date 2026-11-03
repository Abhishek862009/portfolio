export type TimelineCategory = 'Education' | 'Achievement' | 'Project' | 'Milestone';

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  categories: TimelineCategory[];
  /** Hindi version of title and description. */
  hi?: { title: string; description: string };
}

// Source of truth: portfolio-blueprint.md, Section 5 (Timeline)
// Long-term vision entry is intentionally grounded in present-tense action —
// never presented as a bold claim in isolation. See blueprint framing rule.
export const timeline: TimelineEntry[] = [
  {
    id: 'early-curiosity',
    title: 'Early curiosity',
    description:
      'Interested in technology since early school years, without structured guidance yet.',
    categories: ['Milestone'],
    hi: {
      title: 'शुरुआती जिज्ञासा',
      description:
        'स्कूल के शुरुआती सालों से ही टेक्नोलॉजी में दिलचस्पी थी, पर तब कोई सही मार्गदर्शन नहीं था।',
    },
  },
  {
    id: 'class-9-turning-serious',
    title: 'Curiosity turns serious',
    description: 'Around Class 9, started exploring technology more deliberately.',
    categories: ['Milestone'],
    hi: {
      title: 'जिज्ञासा गंभीर हुई',
      description:
        'लगभग क्लास 9 में टेक्नोलॉजी को ज़्यादा सोच-समझकर सीखना शुरू किया।',
    },
  },
  {
    id: 'class-10-boards',
    title: 'Class 10 boards — 80.57%',
    description:
      'Initially felt disappointing — now seen as the milestone that pushed real improvement.',
    categories: ['Education', 'Milestone'],
    hi: {
      title: 'क्लास 10 बोर्ड — 80.57%',
      description:
        'शुरू में निराशा हुई — अब इसे वह पड़ाव माना जाता है जिसने असली सुधार की प्रेरणा दी।',
    },
  },
  {
    id: 'python-html-foundation',
    title: 'Learning Python & HTML',
    description:
      'During a 3-month break after Class 10, started learning Python and HTML — the real foundation of everything that followed.',
    categories: ['Milestone', 'Education'],
    hi: {
      title: 'Python और HTML सीखना',
      description:
        'क्लास 10 के बाद 3 महीने की छुट्टी में Python और HTML सीखना शुरू किया — बाद की हर चीज़ की असली नींव यही बनी।',
    },
  },
  {
    id: 'early-builds',
    title: 'Early builds',
    description:
      'Built early frontend projects and Python projects, including a word meaning game.',
    categories: ['Project'],
    hi: {
      title: 'शुरुआती प्रोजेक्ट',
      description:
        'शुरुआती फ्रंटएंड और Python प्रोजेक्ट बनाए, जिनमें एक शब्द-अर्थ वाला गेम भी शामिल है।',
    },
  },
  {
    id: 'jee-preparation',
    title: 'JEE preparation phase',
    description:
      'Currently preparing for JEE with coaching. Coding intentionally paused, but the technical foundation continues to shape how problems are approached.',
    categories: ['Education', 'Milestone'],
    hi: {
      title: 'JEE की तैयारी का दौर',
      description:
        'फ़िलहाल कोचिंग के साथ JEE की तैयारी चल रही है। कोडिंग जान-बूझकर रोकी गई है, लेकिन तकनीकी नींव अब भी समस्याओं को देखने का नज़रिया तय करती है।',
    },
  },
  {
    id: 'rebuilding-consistency',
    title: 'Rebuilding consistency',
    description:
      'Actively working on balancing exam preparation with continued technical growth, step by step.',
    categories: ['Milestone'],
    hi: {
      title: 'निरंतरता दोबारा बनाना',
      description:
        'परीक्षा की तैयारी और तकनीकी विकास के बीच संतुलन बनाने पर काम चल रहा है, एक-एक कदम करके।',
    },
  },
  {
    id: 'long-term-vision',
    title: 'The long-term vision',
    description:
      'A 20-year goal: build an OS-level technology product and, eventually, a technology company — being built toward today through learning, projects, and steadily improving technical foundations.',
    categories: ['Milestone', 'Achievement'],
    hi: {
      title: 'लंबे समय का लक्ष्य',
      description:
        '20 साल का लक्ष्य: OS-स्तर का टेक्नोलॉजी प्रोडक्ट बनाना और आगे चलकर एक टेक्नोलॉजी कंपनी — जिसकी ओर आज सीखने, प्रोजेक्ट्स और मज़बूत होती तकनीकी नींव के साथ बढ़ा जा रहा है।',
    },
  },
];
