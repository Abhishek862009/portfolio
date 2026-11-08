import type { AppGuide, Bi, CodeBlock, GuideFix, GuideStep, OsGuide, OsId } from './types';

// The "How to update" steps shared by every Terminal app. Every app is a git clone of its own
// repo with a Python virtual environment, so updating is always the same four things:
// stop the app, `git pull` inside its folder, update the libraries, start it again.
// Only the folder name and the way Python is started differ, and those come in as options.
// A new Terminal app calls makeUpdate() once per device in its guide file and gets the
// page section, the plain-text/Markdown copy and the AI-readable files for free.

const b = (en: string, hi: string): Bi => ({ en, hi });

const URL_LOCAL = 'http://127.0.0.1:5000';

export interface UpdateOptions {
  /** The folder `git clone` creates, e.g. "yt-saver". */
  folder: string;
  /** How the guide starts Python on Windows. It differs between guides: ".\\.venv\\Scripts\\python.exe" or ".venv\\Scripts\\python.exe". */
  winPython: string;
  /** True when the guide also shows Command Prompt (CMD) next to PowerShell. */
  windowsCmd?: boolean;
}

export interface OsUpdate {
  update: GuideStep[];
  updateFixes: GuideFix[];
}

const STOP: Record<OsId, Bi> = {
  windows: b(
    'If the app is running, click its window and press Ctrl+C. The prompt comes back when it has stopped. If the app is not running, skip this step.',
    'अगर ऐप चल रहा है, तो उसकी विंडो पर क्लिक करके Ctrl+C दबाएँ। रुकने पर प्रॉम्प्ट वापस आ जाता है। ऐप चल नहीं रहा हो, तो यह स्टेप छोड़ दें।'
  ),
  android: b(
    'If the app is running in Termux, press Ctrl+C in Termux. The prompt comes back when it has stopped. If the app is not running, skip this step.',
    'अगर ऐप Termux में चल रहा है, तो Termux में Ctrl+C दबाएँ। रुकने पर प्रॉम्प्ट वापस आ जाता है। ऐप चल नहीं रहा हो, तो यह स्टेप छोड़ दें।'
  ),
  linux: b(
    'If the app is running, click its terminal and press Ctrl+C. The prompt comes back when it has stopped. If the app is not running, skip this step.',
    'अगर ऐप चल रहा है, तो उसके टर्मिनल पर क्लिक करके Ctrl+C दबाएँ। रुकने पर प्रॉम्प्ट वापस आ जाता है। ऐप चल नहीं रहा हो, तो यह स्टेप छोड़ दें।'
  ),
  mac: b(
    'If the app is running, click its Terminal window and press Control+C. The prompt comes back when it has stopped. If the app is not running, skip this step.',
    'अगर ऐप चल रहा है, तो उसकी Terminal विंडो पर क्लिक करके Control+C दबाएँ। रुकने पर प्रॉम्प्ट वापस आ जाता है। ऐप चल नहीं रहा हो, तो यह स्टेप छोड़ दें।'
  ),
};

function python(os: OsId, o: UpdateOptions): string {
  if (os === 'windows') return o.winPython;
  if (os === 'android') return 'python';
  return '.venv/bin/python';
}

function pipLine(os: OsId, o: UpdateOptions): string {
  // Termux installs the libraries with the plain pip command, as in the setup guide.
  return os === 'android' ? 'pip install -U -r requirements.txt' : `${python(os, o)} -m pip install -U -r requirements.txt`;
}

function folderBlocks(os: OsId, o: UpdateOptions): CodeBlock[] {
  if (os === 'windows') {
    const ps: CodeBlock = { lines: [`cd $HOME\\${o.folder}`, 'git pull'] };
    if (!o.windowsCmd) return [ps];
    return [
      { label: b('PowerShell', 'PowerShell'), ...ps },
      { label: b('Command Prompt (CMD)', 'Command Prompt (CMD)'), lines: [`cd %USERPROFILE%\\${o.folder}`, 'git pull'] },
    ];
  }
  return [{ lines: [`cd ~/${o.folder}`, 'git pull'] }];
}

export function makeUpdate(os: OsId, o: UpdateOptions): OsUpdate {
  const update: GuideStep[] = [
    {
      title: b('Stop the app', 'ऐप को रोकें'),
      text: STOP[os],
    },
    {
      title: b('Go to the app folder and get the newest version', 'ऐप के फ़ोल्डर में जाएँ और नया वर्शन लें'),
      text: b(
        'git pull downloads the newest version of the app from GitHub into the folder you already have.',
        'git pull GitHub से ऐप का नया वर्शन आपके पहले से मौजूद फ़ोल्डर में उतार देता है।'
      ),
      blocks: folderBlocks(os, o),
      after: b(
        'If it says “Already up to date.”, you already have the newest version. Otherwise it lists the files that changed.',
        'अगर “Already up to date.” दिखे, तो आपके पास नया वर्शन पहले से है। नहीं तो यह बदली हुई फ़ाइलों की लिस्ट दिखाता है।'
      ),
    },
    {
      title: b('Update the libraries', 'लाइब्रेरी अपडेट करें'),
      blocks: [{ lines: [pipLine(os, o)] }],
      after: b(
        'It may print “Requirement already satisfied”. That is fine. Wait until the prompt comes back.',
        'यह “Requirement already satisfied” छाप सकता है। यह ठीक है। प्रॉम्प्ट वापस आने तक रुकें।'
      ),
    },
    {
      title: b('Start the app again', 'ऐप दोबारा चालू करें'),
      blocks: [{ lines: [`${python(os, o)} app.py`] }],
      after: b(
        `Open ${URL_LOCAL} in your browser and reload the page, so the browser loads the new version.`,
        `अपने ब्राउज़र में ${URL_LOCAL} खोलें और पेज रीलोड करें, ताकि ब्राउज़र नया वर्शन ले।`
      ),
    },
  ];

  const updateFixes: GuideFix[] = [
    {
      problem: b('git says “fatal: not a git repository”', 'git कहता है “fatal: not a git repository”'),
      fix: b(
        'This folder was not made with git clone (for example the app was downloaded as a ZIP file), so it cannot update itself. Do the “Get the app” and “Set it up” steps of the setup guide above once more, then start the app from the new folder.',
        'यह फ़ोल्डर git clone से नहीं बना (जैसे ऐप ZIP फ़ाइल के रूप में डाउनलोड किया गया), इसलिए यह खुद को अपडेट नहीं कर सकता। ऊपर की सेटअप गाइड के “ऐप का कोड लें” और “सेटअप करें” स्टेप्स एक बार फिर करें, फिर ऐप नए फ़ोल्डर से चालू करें।'
      ),
    },
    {
      problem: b(
        'git pull says “Your local changes to the following files would be overwritten”',
        'git pull कहता है “Your local changes to the following files would be overwritten”'
      ),
      fix: b(
        'You changed a file inside the app folder. Put your change aside, then pull again:',
        'आपने ऐप के फ़ोल्डर में कोई फ़ाइल बदली है। अपना बदलाव एक तरफ़ रख दें, फिर दोबारा pull करें:'
      ),
      blocks: [{ lines: ['git stash', 'git pull'] }],
    },
  ];

  if (os === 'android') {
    updateFixes.push({
      problem: b('pip says “externally-managed-environment”', 'pip कहता है “externally-managed-environment”'),
      fix: b('Run the library update again with one extra word:', 'एक शब्द और जोड़कर लाइब्रेरी अपडेट दोबारा चलाएँ:'),
      blocks: [{ lines: ['pip install --break-system-packages -U -r requirements.txt'] }],
    });
  }

  return { update, updateFixes };
}

/** A device guide as the author writes it: without the update part, which makeUpdate fills in. */
export type OsGuideBase = Omit<OsGuide, 'update' | 'updateFixes'>;
export type AppGuideBase = Omit<AppGuide, 'oses'> & { oses: OsGuideBase[] };

/** Gives every device in a guide its "How to update" steps. Wrap the guide object with this. */
export function withUpdates(guide: AppGuideBase, options: UpdateOptions): AppGuide {
  return { ...guide, oses: guide.oses.map((os) => ({ ...os, ...makeUpdate(os.id, options) })) };
}
