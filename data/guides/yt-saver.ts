import type { AppGuide, Bi } from './types';

// Install guide for YT Saver (the app lives in /yt-saver in this repo).
//
// Facts this guide depends on, and where they come from:
//  - yt-dlp needs Python 3.11+ and a JavaScript engine for YouTube: Deno 2.3+ or Node.js 22+
//    (yt-dlp pyproject.toml "requires-python"; yt-dlp wiki "EJS" page).
//  - winget IDs Python.Python.3.13, Gyan.FFmpeg, OpenJS.NodeJS.LTS exist (microsoft/winget-pkgs).
//  - Homebrew formulas python@3.13, ffmpeg, node exist (formulae.brew.sh).
//  - Termux packages python, python-pip, ffmpeg, nodejs exist (termux/termux-packages); Termux is
//    installed from F-Droid or GitHub, the Google Play build is deprecated (Termux announcement #4000).
//  - Deno and nvm install lines are the ones on docs.deno.com and the nvm README.
// If a version changes (for example the nvm tag), update it here and the page, the Markdown copy
// and the AI-readable files all follow.

const ZIP = 'https://www.arvish.xyz/downloads/yt-saver.zip';
const URL_LOCAL = 'http://127.0.0.1:5000';

const b = (en: string, hi: string): Bi => ({ en, hi });

const OPEN_APP: Bi = b(
  `When the window shows “YT Saver is running”, open ${URL_LOCAL} in your browser (on the same device). Keep the window open while you use the app.`,
  `जब विंडो में “YT Saver is running” दिखे, तो उसी डिवाइस के ब्राउज़र में ${URL_LOCAL} खोलें। ऐप इस्तेमाल करते समय यह विंडो खुली रहने दें।`
);

export const ytSaverGuide: AppGuide = {
  heading: b('Setup guide', 'सेटअप गाइड'),
  intro: b(
    'YT Saver runs on your own device, not on a server. Choose your device below and follow the steps. The first setup takes a while because you install a few free programs; after that, starting the app is one command.',
    'YT Saver आपके अपने डिवाइस पर चलता है, किसी सर्वर पर नहीं। नीचे अपना डिवाइस चुनें और स्टेप्स फॉलो करें। पहली बार सेटअप में समय लगता है क्योंकि कुछ मुफ़्त प्रोग्राम इंस्टॉल करने होते हैं; उसके बाद ऐप चालू करने के लिए बस एक कमांड चलानी होती है।'
  ),
  why: b(
    'Why an app and not a website? YouTube often blocks the servers that websites run on, so a downloader hosted on a website stops working. On your own device it uses your own internet connection instead. The app only listens on 127.0.0.1, which means only that device can open it; other devices on your Wi-Fi cannot.',
    'वेबसाइट की जगह ऐप क्यों? YouTube अक्सर उन सर्वरों को ब्लॉक कर देता है जिन पर वेबसाइटें चलती हैं, इसलिए वेबसाइट पर रखा डाउनलोडर काम करना बंद कर देता है। अपने डिवाइस पर चलाने से आपका अपना इंटरनेट कनेक्शन इस्तेमाल होता है। ऐप सिर्फ़ 127.0.0.1 पर सुनता है, यानी उसे सिर्फ़ वही डिवाइस खोल सकता है; आपके Wi-Fi के दूसरे डिवाइस नहीं खोल सकते।'
  ),
  needsTitle: b('What you need', 'आपको क्या चाहिए'),
  needs: [
    b('A Windows PC, Mac, Linux computer or an Android phone, with internet. iPhone and iPad are not supported.', 'इंटरनेट के साथ Windows PC, Mac, Linux कंप्यूटर या Android फ़ोन। iPhone और iPad सपोर्टेड नहीं हैं।'),
    b('Python 3.11 or newer. The steps below install it.', 'Python 3.11 या नया। नीचे के स्टेप्स इसे इंस्टॉल करते हैं।'),
    b('ffmpeg, which joins the video and the audio into one file. The steps install it.', 'ffmpeg, जो वीडियो और ऑडियो को जोड़कर एक फ़ाइल बनाता है। स्टेप्स इसे इंस्टॉल करते हैं।'),
    b('A JavaScript engine that YouTube needs: Node.js 22 or newer, or Deno 2.3 or newer. The steps install one of them.', 'YouTube के लिए एक JavaScript इंजन: Node.js 22 या नया, या Deno 2.3 या नया। स्टेप्स इनमें से एक इंस्टॉल करते हैं।'),
  ],
  chooseTitle: b('Which device do you have?', 'आपके पास कौन-सा डिवाइस है?'),
  chooseHint: b('Tap your device. Its full guide opens below.', 'अपने डिवाइस पर टैप करें। उसकी पूरी गाइड नीचे खुल जाएगी।'),

  oses: [
    // ---------------------------------------------------------------- Windows
    {
      id: 'windows',
      label: 'Windows',
      name: b('Windows 10 / 11', 'Windows 10 / 11'),
      summary: b('Uses PowerShell and winget (built into Windows 10/11).', 'PowerShell और winget इस्तेमाल होता है (Windows 10/11 में पहले से होता है)।'),
      tested: false,
      testedNote: b(
        'Written from the official documentation of winget, Python, ffmpeg and Node.js. The author has not run these steps on a Windows PC yet. If one fails, see “If something goes wrong” below.',
        'यह winget, Python, ffmpeg और Node.js के आधिकारिक दस्तावेज़ों से लिखा गया है। लेखक ने ये स्टेप्स अभी Windows PC पर चलाकर नहीं देखे हैं। कोई स्टेप फेल हो तो नीचे “कुछ गड़बड़ हो तो” देखें।'
      ),
      steps: [
        {
          title: b('Open PowerShell', 'PowerShell खोलें'),
          text: b(
            'Click the Start button, type PowerShell and press Enter. A window opens. You will paste the commands below into it (Ctrl+V, or right-click).',
            'Start बटन दबाएँ, PowerShell लिखें और Enter दबाएँ। एक विंडो खुलेगी। नीचे की कमांड इसी में पेस्ट करनी हैं (Ctrl+V, या राइट-क्लिक)।'
          ),
        },
        {
          title: b('Install Python, ffmpeg and Node.js', 'Python, ffmpeg और Node.js इंस्टॉल करें'),
          text: b('Run these three lines one by one (copy a line, paste it, press Enter, wait until it finishes).', 'ये तीन लाइनें एक-एक करके चलाएँ (एक लाइन कॉपी करें, पेस्ट करें, Enter दबाएँ, खत्म होने तक रुकें)।'),
          blocks: [
            {
              lines: [
                'winget install -e --id Python.Python.3.13',
                'winget install -e --id Gyan.FFmpeg',
                'winget install -e --id OpenJS.NodeJS.LTS',
              ],
            },
          ],
          after: b(
            'If it asks you to agree to terms, type Y and press Enter. When all three are done, close PowerShell and open it again. Windows needs this to find the new programs.',
            'अगर यह शर्तें मानने को कहे, तो Y लिखकर Enter दबाएँ। तीनों हो जाएँ तो PowerShell बंद करके दोबारा खोलें। नए प्रोग्राम ढूँढने के लिए Windows को यह चाहिए।'
          ),
        },
        {
          title: b('Check that they installed', 'जाँचें कि इंस्टॉल हो गए'),
          blocks: [{ lines: ['py --version', 'ffmpeg -version', 'node --version'] }],
          after: b(
            'py should show Python 3.11 or higher (for example 3.13), and node should show v22 or higher. ffmpeg should print a few lines starting with “ffmpeg version”.',
            'py में Python 3.11 या ऊपर दिखना चाहिए (जैसे 3.13), और node में v22 या ऊपर। ffmpeg को “ffmpeg version” से शुरू होने वाली कुछ लाइनें दिखानी चाहिए।'
          ),
        },
        {
          title: b('Download YT Saver', 'YT Saver डाउनलोड करें'),
          text: b('This saves it in your Downloads folder and opens the folder.', 'यह इसे आपके Downloads फ़ोल्डर में सेव करके फ़ोल्डर के अंदर पहुँचा देता है।'),
          blocks: [
            {
              lines: [
                'cd $HOME\\Downloads',
                `Invoke-WebRequest ${ZIP} -OutFile yt-saver.zip`,
                'Expand-Archive yt-saver.zip -DestinationPath yt-saver -Force',
                'cd yt-saver',
              ],
            },
          ],
        },
        {
          title: b('Set it up (first time only)', 'सेटअप करें (सिर्फ़ पहली बार)'),
          blocks: [{ lines: ['py -m venv .venv', '.\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt'] }],
          after: b('This downloads the libraries the app needs. Wait until the prompt comes back.', 'यह ऐप की ज़रूरी लाइब्रेरी डाउनलोड करता है। प्रॉम्प्ट वापस आने तक रुकें।'),
        },
        {
          title: b('Start the app', 'ऐप चालू करें'),
          blocks: [{ lines: ['.\\.venv\\Scripts\\python.exe app.py'] }],
          after: OPEN_APP,
        },
        {
          title: b('Next time', 'अगली बार'),
          text: b('You do not need to install anything again. Open PowerShell and run:', 'कुछ दोबारा इंस्टॉल नहीं करना। PowerShell खोलकर ये चलाएँ:'),
          blocks: [{ lines: ['cd $HOME\\Downloads\\yt-saver', '.\\.venv\\Scripts\\python.exe app.py'] }],
          after: b('To stop the app, click the PowerShell window and press Ctrl+C.', 'ऐप बंद करने के लिए PowerShell विंडो पर क्लिक करके Ctrl+C दबाएँ।'),
        },
        {
          title: b('Keep it updated', 'इसे अपडेट रखें'),
          text: b(
            'YouTube changes often. If saving suddenly stops working, update the downloader library:',
            'YouTube अक्सर बदलता रहता है। अगर सेव करना अचानक बंद हो जाए, तो डाउनलोडर लाइब्रेरी अपडेट करें:'
          ),
          blocks: [{ lines: ['.\\.venv\\Scripts\\python.exe -m pip install -U -r requirements.txt'] }],
        },
      ],
      fixes: [
        {
          problem: b('“py is not recognized” or “ffmpeg is not recognized”', '“py is not recognized” या “ffmpeg is not recognized”'),
          fix: b(
            'Close PowerShell and open it again. If it still fails, install the program by hand from its official site: python.org (tick “Add python.exe to PATH” in the installer), ffmpeg.org (Windows builds) and nodejs.org.',
            'PowerShell बंद करके दोबारा खोलें। फिर भी न चले, तो प्रोग्राम को उसकी आधिकारिक साइट से हाथ से इंस्टॉल करें: python.org (इंस्टॉलर में “Add python.exe to PATH” पर टिक करें), ffmpeg.org (Windows builds) और nodejs.org।'
          ),
        },
        {
          problem: b('“winget is not recognized”', '“winget is not recognized”'),
          fix: b(
            'Update “App Installer” in the Microsoft Store, or install Python, ffmpeg and Node.js by hand from the sites above.',
            'Microsoft Store में “App Installer” अपडेट करें, या ऊपर की साइटों से Python, ffmpeg और Node.js हाथ से इंस्टॉल करें।'
          ),
        },
        {
          problem: b('The app says port 5000 is already in use', 'ऐप कहता है कि port 5000 पहले से इस्तेमाल में है'),
          fix: b('Start it on another port, then open that port in the browser (here 5001):', 'इसे दूसरे port पर चालू करें और ब्राउज़र में वही port खोलें (यहाँ 5001):'),
          blocks: [{ lines: ['$env:PORT=5001', '.\\.venv\\Scripts\\python.exe app.py'] }],
        },
      ],
    },

    // ---------------------------------------------------------------- Android
    {
      id: 'android',
      label: 'Android',
      name: b('Android phone (with Termux)', 'Android फ़ोन (Termux के साथ)'),
      summary: b('Termux is a free terminal app for Android. The app runs inside it.', 'Termux Android के लिए मुफ़्त टर्मिनल ऐप है। यह ऐप उसी के अंदर चलता है।'),
      tested: false,
      testedNote: b(
        'Written from the Termux package lists and documentation. The author has not run these steps on a phone yet, and the pip step builds some parts on the phone, so it is the most likely one to need a fix. See “If something goes wrong” below.',
        'यह Termux की पैकेज लिस्ट और दस्तावेज़ों से लिखा गया है। लेखक ने ये स्टेप्स अभी फ़ोन पर चलाकर नहीं देखे हैं, और pip वाला स्टेप कुछ हिस्से फ़ोन पर ही बनाता है, इसलिए उसी में सबसे ज़्यादा सुधार की ज़रूरत पड़ सकती है। नीचे “कुछ गड़बड़ हो तो” देखें।'
      ),
      steps: [
        {
          title: b('Install Termux from F-Droid or GitHub', 'Termux को F-Droid या GitHub से इंस्टॉल करें'),
          text: b(
            'Do not use the Google Play version. The Termux team says Google Play is not an official source, and that version is outdated. Download the APK from one of these two places and install it (Android may ask you to allow installs from your browser).',
            'Google Play वाला वर्शन इस्तेमाल न करें। Termux टीम के अनुसार Google Play आधिकारिक स्रोत नहीं है, और वह वर्शन पुराना है। इन दो जगहों में से किसी से APK डाउनलोड करके इंस्टॉल करें (Android आपके ब्राउज़र से इंस्टॉल की अनुमति माँग सकता है)।'
          ),
          links: [
            { label: b('Termux on F-Droid', 'F-Droid पर Termux'), href: 'https://f-droid.org/packages/com.termux/' },
            { label: b('Termux releases on GitHub', 'GitHub पर Termux रिलीज़'), href: 'https://github.com/termux/termux-app/releases' },
          ],
        },
        {
          title: b('Open Termux and update it', 'Termux खोलें और अपडेट करें'),
          blocks: [{ lines: ['pkg update'] }],
          after: b('If it asks a question, press Enter (or type Y and press Enter).', 'कोई सवाल पूछे तो Enter दबाएँ (या Y लिखकर Enter)।'),
        },
        {
          title: b('Install Python, ffmpeg and Node.js', 'Python, ffmpeg और Node.js इंस्टॉल करें'),
          blocks: [{ lines: ['pkg install -y python python-pip ffmpeg nodejs curl unzip'] }],
        },
        {
          title: b('Download YT Saver', 'YT Saver डाउनलोड करें'),
          blocks: [
            {
              lines: ['cd ~', `curl -L -o yt-saver.zip ${ZIP}`, 'unzip -o yt-saver.zip -d yt-saver', 'cd yt-saver'],
            },
          ],
        },
        {
          title: b('Set it up (first time only)', 'सेटअप करें (सिर्फ़ पहली बार)'),
          blocks: [{ lines: ['pip install -r requirements.txt'] }],
          after: b(
            'This can take several minutes because some parts are built on the phone. Wait until the prompt comes back. If it stops with an error, open “If something goes wrong” below.',
            'इसमें कई मिनट लग सकते हैं क्योंकि कुछ हिस्से फ़ोन पर ही बनते हैं। प्रॉम्प्ट वापस आने तक रुकें। एरर के साथ रुक जाए तो नीचे “कुछ गड़बड़ हो तो” खोलें।'
          ),
        },
        {
          title: b('Start the app', 'ऐप चालू करें'),
          blocks: [{ lines: ['python app.py'] }],
          after: b(
            `When Termux shows “YT Saver is running”, open Chrome (or any browser) on the same phone and go to ${URL_LOCAL}. Keep Termux running: pull down the notification area and tap “Acquire wakelock” on the Termux notification, so Android does not put it to sleep.`,
            `जब Termux में “YT Saver is running” दिखे, तो उसी फ़ोन पर Chrome (या कोई भी ब्राउज़र) खोलकर ${URL_LOCAL} पर जाएँ। Termux को चालू रखें: नोटिफ़िकेशन एरिया नीचे खींचें और Termux की नोटिफ़िकेशन पर “Acquire wakelock” दबाएँ, ताकि Android इसे सुला न दे।`
          ),
        },
        {
          title: b('Next time', 'अगली बार'),
          blocks: [{ lines: ['cd ~/yt-saver', 'python app.py'] }],
          after: b('To stop the app, press Ctrl+C in Termux (or swipe Termux away).', 'ऐप बंद करने के लिए Termux में Ctrl+C दबाएँ (या Termux को स्वाइप करके हटा दें)।'),
        },
        {
          title: b('Keep it updated', 'इसे अपडेट रखें'),
          text: b('If saving suddenly stops working, update the downloader library:', 'अगर सेव करना अचानक बंद हो जाए, तो डाउनलोडर लाइब्रेरी अपडेट करें:'),
          blocks: [{ lines: ['pip install -U -r requirements.txt'] }],
        },
      ],
      fixes: [
        {
          problem: b('pip says “externally-managed-environment”', 'pip कहता है “externally-managed-environment”'),
          fix: b('Run the install again with one extra word:', 'एक शब्द और जोड़कर इंस्टॉल दोबारा चलाएँ:'),
          blocks: [{ lines: ['pip install --break-system-packages -r requirements.txt'] }],
        },
        {
          problem: b('pip stops with “Failed building wheel” or says clang is missing', 'pip “Failed building wheel” के साथ रुकता है या कहता है कि clang नहीं है'),
          fix: b('Install the build tools, then run the pip line again:', 'बिल्ड टूल इंस्टॉल करें, फिर pip वाली लाइन दोबारा चलाएँ:'),
          blocks: [{ lines: ['pkg install -y clang make', 'pip install -r requirements.txt'] }],
        },
        {
          problem: b('The app stops after a while with the screen off', 'स्क्रीन बंद होने पर ऐप कुछ देर बाद रुक जाता है'),
          fix: b(
            'Tap “Acquire wakelock” on the Termux notification, and in Android settings set battery usage for Termux to “Unrestricted” (the wording differs by phone).',
            'Termux की नोटिफ़िकेशन पर “Acquire wakelock” दबाएँ, और Android सेटिंग्स में Termux का बैटरी इस्तेमाल “Unrestricted” करें (शब्द फ़ोन के हिसाब से अलग हो सकते हैं)।'
          ),
        },
      ],
    },

    // ---------------------------------------------------------------- Linux
    {
      id: 'linux',
      label: 'Linux',
      name: b('Linux (Ubuntu, Debian, Fedora, Arch)', 'Linux (Ubuntu, Debian, Fedora, Arch)'),
      summary: b('Uses the terminal. The commands for Ubuntu and Debian are shown first.', 'टर्मिनल इस्तेमाल होता है। Ubuntu और Debian की कमांड पहले दी गई हैं।'),
      tested: true,
      testedNote: b(
        'The download, set-up and start steps were run on Ubuntu 24.04. The package-install lines (apt, dnf, pacman) and the Deno / nvm installers were not run by the author; they are the official ones from each project.',
        'डाउनलोड, सेटअप और स्टार्ट वाले स्टेप्स Ubuntu 24.04 पर चलाकर देखे गए हैं। पैकेज इंस्टॉल की लाइनें (apt, dnf, pacman) और Deno / nvm इंस्टॉलर लेखक ने नहीं चलाए; ये हर प्रोजेक्ट की आधिकारिक कमांड हैं।'
      ),
      steps: [
        {
          title: b('Open a terminal', 'टर्मिनल खोलें'),
          text: b('On most systems the shortcut is Ctrl+Alt+T. Otherwise search for “Terminal” in your applications.', 'ज़्यादातर सिस्टम में शॉर्टकट Ctrl+Alt+T है। नहीं तो अपने एप्लिकेशन में “Terminal” खोजें।'),
        },
        {
          title: b('Install Python, ffmpeg, curl and unzip', 'Python, ffmpeg, curl और unzip इंस्टॉल करें'),
          text: b('Use the lines for your Linux:', 'अपने Linux की लाइनें इस्तेमाल करें:'),
          blocks: [
            { label: b('Ubuntu / Debian / Linux Mint', 'Ubuntu / Debian / Linux Mint'), lines: ['sudo apt update', 'sudo apt install -y python3 python3-venv ffmpeg curl unzip'] },
            { label: b('Fedora', 'Fedora'), lines: ['sudo dnf install -y python3 ffmpeg-free curl unzip'] },
            { label: b('Arch / Manjaro', 'Arch / Manjaro'), lines: ['sudo pacman -S --needed python ffmpeg curl unzip'] },
          ],
        },
        {
          title: b('Check the Python version', 'Python का वर्शन जाँचें'),
          blocks: [{ lines: ['python3 --version'] }],
          after: b(
            'It must say 3.11 or higher. If it says 3.10 or lower, your Linux is too old for this app: update it (for example to Ubuntu 24.04) or install a newer Python from python.org.',
            'इसमें 3.11 या ऊपर दिखना चाहिए। 3.10 या कम दिखे, तो आपका Linux इस ऐप के लिए बहुत पुराना है: उसे अपडेट करें (जैसे Ubuntu 24.04) या python.org से नया Python इंस्टॉल करें।'
          ),
        },
        {
          title: b('Install a JavaScript engine (Deno)', 'JavaScript इंजन (Deno) इंस्टॉल करें'),
          text: b(
            'YouTube needs one. Deno is the one yt-dlp recommends. This is the official installer line from docs.deno.com:',
            'YouTube को इसकी ज़रूरत है। yt-dlp Deno को ही सुझाता है। यह docs.deno.com की आधिकारिक इंस्टॉलर लाइन है:'
          ),
          blocks: [
            { lines: ['curl -fsSL https://deno.land/install.sh | sh'] },
            { label: b('Alternative: Node.js 22 with nvm (use this instead of Deno if you prefer)', 'विकल्प: nvm से Node.js 22 (चाहें तो Deno की जगह यह इस्तेमाल करें)'), lines: ['curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash', 'nvm install 22'] },
          ],
          after: b(
            'If the installer asks questions, answer yes (y). Then close the terminal and open a new one, and check with “deno --version” (it must be 2.3 or higher) or “node --version” (22 or higher).',
            'इंस्टॉलर सवाल पूछे तो हाँ (y) कहें। फिर टर्मिनल बंद करके नया खोलें और “deno --version” (2.3 या ऊपर) या “node --version” (22 या ऊपर) से जाँचें।'
          ),
        },
        {
          title: b('Download YT Saver', 'YT Saver डाउनलोड करें'),
          blocks: [
            { lines: ['cd ~/Downloads', `curl -L -o yt-saver.zip ${ZIP}`, 'unzip -o yt-saver.zip -d yt-saver', 'cd yt-saver'] },
          ],
        },
        {
          title: b('Set it up (first time only)', 'सेटअप करें (सिर्फ़ पहली बार)'),
          blocks: [{ lines: ['python3 -m venv .venv', '.venv/bin/python -m pip install -r requirements.txt'] }],
          after: b('This downloads the libraries the app needs. Wait until the prompt comes back.', 'यह ऐप की ज़रूरी लाइब्रेरी डाउनलोड करता है। प्रॉम्प्ट वापस आने तक रुकें।'),
        },
        {
          title: b('Start the app', 'ऐप चालू करें'),
          blocks: [{ lines: ['.venv/bin/python app.py'] }],
          after: OPEN_APP,
        },
        {
          title: b('Next time', 'अगली बार'),
          blocks: [{ lines: ['cd ~/Downloads/yt-saver', '.venv/bin/python app.py'] }],
          after: b('To stop the app, click the terminal and press Ctrl+C.', 'ऐप बंद करने के लिए टर्मिनल पर क्लिक करके Ctrl+C दबाएँ।'),
        },
        {
          title: b('Keep it updated', 'इसे अपडेट रखें'),
          text: b('If saving suddenly stops working, update the downloader library:', 'अगर सेव करना अचानक बंद हो जाए, तो डाउनलोडर लाइब्रेरी अपडेट करें:'),
          blocks: [{ lines: ['.venv/bin/python -m pip install -U -r requirements.txt'] }],
        },
      ],
      fixes: [
        {
          problem: b('“ensurepip is not available” or “python3-venv” when creating the environment', 'वातावरण बनाते समय “ensurepip is not available” या “python3-venv”'),
          fix: b('On Ubuntu / Debian install the missing package, then run the “python3 -m venv .venv” line again:', 'Ubuntu / Debian पर छूटा हुआ पैकेज इंस्टॉल करें, फिर “python3 -m venv .venv” वाली लाइन दोबारा चलाएँ:'),
          blocks: [{ lines: ['sudo apt install -y python3-venv'] }],
        },
        {
          problem: b('“deno: command not found” after installing it', 'इंस्टॉल के बाद “deno: command not found”'),
          fix: b('Open a new terminal. If it still fails, add Deno to the path for this terminal:', 'नया टर्मिनल खोलें। फिर भी न चले, तो इस टर्मिनल के लिए Deno का path जोड़ें:'),
          blocks: [{ lines: ['export PATH="$HOME/.deno/bin:$PATH"'] }],
        },
        {
          problem: b('The app says port 5000 is already in use', 'ऐप कहता है कि port 5000 पहले से इस्तेमाल में है'),
          fix: b('Start it on another port, then open that port in the browser (here 5001):', 'इसे दूसरे port पर चालू करें और ब्राउज़र में वही port खोलें (यहाँ 5001):'),
          blocks: [{ lines: ['PORT=5001 .venv/bin/python app.py'] }],
        },
      ],
    },

    // ---------------------------------------------------------------- macOS
    {
      id: 'mac',
      label: 'Mac',
      name: b('Mac (macOS)', 'Mac (macOS)'),
      summary: b('Uses Terminal and Homebrew, the standard way to install programs on a Mac.', 'Terminal और Homebrew इस्तेमाल होता है, जो Mac पर प्रोग्राम इंस्टॉल करने का आम तरीका है।'),
      tested: false,
      testedNote: b(
        'Written from the official Homebrew documentation and package pages. The author has not run these steps on a Mac yet. If one fails, see “If something goes wrong” below.',
        'यह Homebrew के आधिकारिक दस्तावेज़ों और पैकेज पेजों से लिखा गया है। लेखक ने ये स्टेप्स अभी Mac पर चलाकर नहीं देखे हैं। कोई स्टेप फेल हो तो नीचे “कुछ गड़बड़ हो तो” देखें।'
      ),
      steps: [
        {
          title: b('Open Terminal', 'Terminal खोलें'),
          text: b('Press Command+Space, type Terminal and press Enter.', 'Command+Space दबाएँ, Terminal लिखें और Enter दबाएँ।'),
        },
        {
          title: b('Install Homebrew (if you do not have it)', 'Homebrew इंस्टॉल करें (अगर नहीं है)'),
          text: b(
            'First check whether you already have it. If it prints a version number, skip the second line.',
            'पहले जाँचें कि कहीं पहले से तो नहीं है। अगर वर्शन नंबर दिखे, तो दूसरी लाइन छोड़ दें।'
          ),
          blocks: [
            {
              lines: [
                'brew --version',
                '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
              ],
            },
          ],
          after: b(
            'The second line is the official installer from brew.sh. It explains what it will do and asks for your Mac password. When it finishes it prints “Next steps”: copy and run those lines too, so that the brew command works.',
            'दूसरी लाइन brew.sh का आधिकारिक इंस्टॉलर है। यह बताता है कि क्या करेगा और आपका Mac पासवर्ड माँगता है। खत्म होने पर यह “Next steps” छापता है: वे लाइनें भी कॉपी करके चलाएँ, ताकि brew कमांड काम करे।'
          ),
          links: [{ label: b('Homebrew', 'Homebrew'), href: 'https://brew.sh/' }],
        },
        {
          title: b('Install Python, ffmpeg and Node.js', 'Python, ffmpeg और Node.js इंस्टॉल करें'),
          blocks: [{ lines: ['brew install python@3.13 ffmpeg node'] }],
        },
        {
          title: b('Download YT Saver', 'YT Saver डाउनलोड करें'),
          blocks: [
            { lines: ['cd ~/Downloads', `curl -L -o yt-saver.zip ${ZIP}`, 'unzip -o yt-saver.zip -d yt-saver', 'cd yt-saver'] },
          ],
        },
        {
          title: b('Set it up (first time only)', 'सेटअप करें (सिर्फ़ पहली बार)'),
          blocks: [{ lines: ['python3.13 -m venv .venv', '.venv/bin/python -m pip install -r requirements.txt'] }],
          after: b('This downloads the libraries the app needs. Wait until the prompt comes back.', 'यह ऐप की ज़रूरी लाइब्रेरी डाउनलोड करता है। प्रॉम्प्ट वापस आने तक रुकें।'),
        },
        {
          title: b('Start the app', 'ऐप चालू करें'),
          blocks: [{ lines: ['.venv/bin/python app.py'] }],
          after: OPEN_APP,
        },
        {
          title: b('Next time', 'अगली बार'),
          blocks: [{ lines: ['cd ~/Downloads/yt-saver', '.venv/bin/python app.py'] }],
          after: b('To stop the app, click the Terminal window and press Control+C.', 'ऐप बंद करने के लिए Terminal विंडो पर क्लिक करके Control+C दबाएँ।'),
        },
        {
          title: b('Keep it updated', 'इसे अपडेट रखें'),
          text: b('If saving suddenly stops working, update the downloader library:', 'अगर सेव करना अचानक बंद हो जाए, तो डाउनलोडर लाइब्रेरी अपडेट करें:'),
          blocks: [{ lines: ['.venv/bin/python -m pip install -U -r requirements.txt'] }],
        },
      ],
      fixes: [
        {
          problem: b('“brew: command not found” right after installing Homebrew', 'Homebrew इंस्टॉल करने के ठीक बाद “brew: command not found”'),
          fix: b(
            'Run the “Next steps” lines that the Homebrew installer printed at the end, then open a new Terminal window.',
            'Homebrew इंस्टॉलर ने अंत में जो “Next steps” लाइनें छापी थीं, उन्हें चलाएँ और फिर नई Terminal विंडो खोलें।'
          ),
        },
        {
          problem: b('“python3.13: command not found”', '“python3.13: command not found”'),
          fix: b('Open a new Terminal window and try again. If it still fails, run the install line again:', 'नई Terminal विंडो खोलकर फिर कोशिश करें। फिर भी न चले, तो इंस्टॉल वाली लाइन दोबारा चलाएँ:'),
          blocks: [{ lines: ['brew install python@3.13'] }],
        },
        {
          problem: b('The app says port 5000 is already in use', 'ऐप कहता है कि port 5000 पहले से इस्तेमाल में है'),
          fix: b('Start it on another port, then open that port in the browser (here 5001):', 'इसे दूसरे port पर चालू करें और ब्राउज़र में वही port खोलें (यहाँ 5001):'),
          blocks: [{ lines: ['PORT=5001 .venv/bin/python app.py'] }],
        },
      ],
    },
  ],

  usingTitle: b('Using the app', 'ऐप कैसे इस्तेमाल करें'),
  using: [
    b(`Open ${URL_LOCAL} in your browser.`, `अपने ब्राउज़र में ${URL_LOCAL} खोलें।`),
    b('Paste a YouTube video link and press “Find qualities”.', 'YouTube वीडियो का लिंक पेस्ट करें और “Find qualities” दबाएँ।'),
    b('Pick a quality from the list (highest first) and press “Save video”.', 'लिस्ट से क्वालिटी चुनें (सबसे ऊँची पहले) और “Save video” दबाएँ।'),
    b('When it reaches 100%, the file is saved to your browser’s Downloads folder.', '100% होने पर फ़ाइल आपके ब्राउज़र के Downloads फ़ोल्डर में सेव हो जाती है।'),
  ],
  goodToKnowTitle: b('Good to know', 'ध्यान रखें'),
  goodToKnow: [
    b(
      'Only save videos you own, that are licensed for reuse, or that you have permission to download. Downloading other people’s videos may break YouTube’s Terms of Service or copyright law.',
      'सिर्फ़ वही वीडियो सेव करें जो आपके हों, दोबारा इस्तेमाल के लिए लाइसेंस वाले हों, या जिन्हें डाउनलोड करने की आपके पास अनुमति हो। दूसरों के वीडियो डाउनलोड करना YouTube की सेवा-शर्तों या कॉपीराइट कानून का उल्लंघन हो सकता है।'
    ),
    b(
      'If YouTube says it needs proof you are not a bot, wait a few minutes and try again, or switch network (for example your phone’s hotspot instead of shared Wi-Fi). Shared hostel or college Wi-Fi is more likely to be limited.',
      'अगर YouTube कहे कि आपको बॉट न होने का सबूत देना होगा, तो कुछ मिनट रुककर फिर कोशिश करें, या नेटवर्क बदलें (जैसे साझा Wi-Fi की जगह फ़ोन का हॉटस्पॉट)। हॉस्टल या कॉलेज का साझा Wi-Fi सीमित होने की संभावना ज़्यादा रखता है।'
    ),
    b(
      'Nothing about your downloads goes through arvish.xyz. You download the app once from this site; after that the app talks to YouTube directly from your device.',
      'आपके डाउनलोड का कुछ भी arvish.xyz से होकर नहीं जाता। आप ऐप एक बार इस साइट से डाउनलोड करते हैं; उसके बाद ऐप आपके डिवाइस से सीधे YouTube से बात करता है।'
    ),
    b(
      'The app is open source. The code is in the “yt-saver” folder of the portfolio repository on GitHub.',
      'ऐप ओपन सोर्स है। कोड GitHub पर portfolio रिपॉज़िटरी के “yt-saver” फ़ोल्डर में है।'
    ),
  ],
};
