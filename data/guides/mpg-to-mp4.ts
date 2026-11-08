import type { AppGuide, Bi } from './types';
import { withUpdates } from './update';

// Install guide for MPG to MP4 (the app lives in its own repo, github.com/Abhishek862009/mpg-to-mp4).
//
// Facts this guide depends on, and where they come from:
//  - The app is Flask + ffmpeg (requirements.txt: flask). Python 3.9+ is enough; the steps install 3.13.
//  - winget IDs Git.Git, Python.Python.3.13, Gyan.FFmpeg exist (microsoft/winget-pkgs).
//  - Homebrew formulas git, python@3.13, ffmpeg exist (formulae.brew.sh).
//  - Termux packages python, python-pip, ffmpeg, git exist (termux/termux-packages); Termux is
//    installed from F-Droid or GitHub, the Google Play build is deprecated.
//  - The converter itself (upload .mpg, download .mp4, odd sizes, wrong or corrupt file) was run and
//    checked on Linux with ffmpeg and Flask. The install steps for each device were not run by the author.

const REPO = 'https://github.com/Abhishek862009/mpg-to-mp4.git';
const URL_LOCAL = 'http://127.0.0.1:5000';

const b = (en: string, hi: string): Bi => ({ en, hi });

const OPEN_APP: Bi = b(
  `When the window shows “MPG to MP4 is running”, open ${URL_LOCAL} in your browser (on the same device). Keep the window open while you use the app.`,
  `जब विंडो में “MPG to MP4 is running” दिखे, तो उसी डिवाइस के ब्राउज़र में ${URL_LOCAL} खोलें। ऐप इस्तेमाल करते समय यह विंडो खुली रहने दें।`
);

const WAIT: Bi = b('This downloads the library the app needs. Wait until the prompt comes back.', 'यह ऐप की ज़रूरी लाइब्रेरी डाउनलोड करता है। प्रॉम्प्ट वापस आने तक रुकें।');
const PORT_TEXT: Bi = b('Start it on another port, then open that port in the browser (here 5001):', 'इसे दूसरे port पर चालू करें और ब्राउज़र में वही port खोलें (यहाँ 5001):');
const PORT_PROBLEM: Bi = b('The app says port 5000 is already in use', 'ऐप कहता है कि port 5000 पहले से इस्तेमाल में है');
const NOT_RUN = (en: string, hi: string): Bi => b(en, hi);

export const mpgToMp4Guide: AppGuide = withUpdates({
  heading: b('Setup guide', 'सेटअप गाइड'),
  intro: b(
    'MPG to MP4 runs on your own device, not on a server. Choose your device below and follow the steps. The first setup takes a few minutes because you install a few free programs; after that, starting the app is one command.',
    'MPG to MP4 आपके अपने डिवाइस पर चलता है, किसी सर्वर पर नहीं। नीचे अपना डिवाइस चुनें और स्टेप्स फॉलो करें। पहली बार सेटअप में कुछ मिनट लगते हैं क्योंकि कुछ मुफ़्त प्रोग्राम इंस्टॉल करने होते हैं; उसके बाद ऐप चालू करने के लिए बस एक कमांड चलानी होती है।'
  ),
  why: b(
    'Why an app and not a website? Browsers cannot reliably play or convert MPG files, and uploading big videos to a website is slow. On your own device the real ffmpeg program does the work, so it is fast and your video never leaves your device. The app only listens on 127.0.0.1, which means only that device can open it; other devices on your Wi-Fi cannot.',
    'वेबसाइट की जगह ऐप क्यों? ब्राउज़र MPG फ़ाइलें भरोसे से न चला पाते हैं, न बदल पाते हैं, और बड़े वीडियो वेबसाइट पर अपलोड करना धीमा है। आपके अपने डिवाइस पर असली ffmpeg प्रोग्राम काम करता है, इसलिए यह तेज़ है और आपका वीडियो आपके डिवाइस से बाहर नहीं जाता। ऐप सिर्फ़ 127.0.0.1 पर सुनता है, यानी उसे सिर्फ़ वही डिवाइस खोल सकता है; आपके Wi-Fi के दूसरे डिवाइस नहीं खोल सकते।'
  ),
  needsTitle: b('What you need', 'आपको क्या चाहिए'),
  needs: [
    b('A Windows PC, Mac, Linux computer or an Android phone, with internet for the first setup. iPhone and iPad are not supported.', 'पहली बार के सेटअप के लिए इंटरनेट के साथ Windows PC, Mac, Linux कंप्यूटर या Android फ़ोन। iPhone और iPad सपोर्टेड नहीं हैं।'),
    b('Git, which downloads the app from GitHub. The steps below install it.', 'Git, जो ऐप को GitHub से डाउनलोड करता है। नीचे के स्टेप्स इसे इंस्टॉल करते हैं।'),
    b('Python 3.9 or newer. The steps below install it.', 'Python 3.9 या नया। नीचे के स्टेप्स इसे इंस्टॉल करते हैं।'),
    b('ffmpeg, the program that does the actual conversion. The steps install it.', 'ffmpeg, वह प्रोग्राम जो असल में कन्वर्ट करता है। स्टेप्स इसे इंस्टॉल करते हैं।'),
  ],
  chooseTitle: b('Which device do you have?', 'आपके पास कौन-सा डिवाइस है?'),
  chooseHint: b('Tap your device. Its full guide opens below.', 'अपने डिवाइस पर टैप करें। उसकी पूरी गाइड नीचे खुल जाएगी।'),

  oses: [
    // ---------------------------------------------------------------- Windows
    {
      id: 'windows',
      label: 'Windows',
      name: b('Windows 10 / 11 (PowerShell or CMD)', 'Windows 10 / 11 (PowerShell या CMD)'),
      summary: b('Works in PowerShell and in Command Prompt (CMD). winget is built into Windows 10/11.', 'PowerShell और Command Prompt (CMD) दोनों में चलता है। winget Windows 10/11 में पहले से होता है।'),
      tested: false,
      testedNote: NOT_RUN(
        'The converter itself was tested on Linux. These Windows steps are written from the official documentation of winget, Python and ffmpeg, and the author has not run them on a Windows PC yet. If one fails, see “If something goes wrong” below.',
        'कन्वर्टर खुद Linux पर टेस्ट किया गया है। ये Windows स्टेप्स winget, Python और ffmpeg के आधिकारिक दस्तावेज़ों से लिखे गए हैं, और लेखक ने इन्हें अभी Windows PC पर चलाकर नहीं देखा है। कोई स्टेप फेल हो तो नीचे “कुछ गड़बड़ हो तो” देखें।'
      ),
      steps: [
        {
          title: b('Open PowerShell or Command Prompt', 'PowerShell या Command Prompt खोलें'),
          text: b(
            'Click the Start button, type PowerShell (or cmd for Command Prompt) and press Enter. A window opens. You will paste the commands below into it (Ctrl+V, or right-click). Where PowerShell and CMD differ, both versions are shown.',
            'Start बटन दबाएँ, PowerShell (या Command Prompt के लिए cmd) लिखें और Enter दबाएँ। एक विंडो खुलेगी। नीचे की कमांड इसी में पेस्ट करनी हैं (Ctrl+V, या राइट-क्लिक)। जहाँ PowerShell और CMD अलग हैं, वहाँ दोनों वर्शन दिए गए हैं।'
          ),
        },
        {
          title: b('Install Git, Python and ffmpeg', 'Git, Python और ffmpeg इंस्टॉल करें'),
          text: b('Run these three lines one by one (copy a line, paste it, press Enter, wait until it finishes). They are the same in PowerShell and CMD.', 'ये तीन लाइनें एक-एक करके चलाएँ (एक लाइन कॉपी करें, पेस्ट करें, Enter दबाएँ, खत्म होने तक रुकें)। ये PowerShell और CMD में एक जैसी हैं।'),
          blocks: [{ lines: ['winget install -e --id Git.Git', 'winget install -e --id Python.Python.3.13', 'winget install -e --id Gyan.FFmpeg'] }],
          after: b(
            'If it asks you to agree to terms, type Y and press Enter. When all three are done, close the window and open it again. Windows needs this to find the new programs.',
            'अगर यह शर्तें मानने को कहे, तो Y लिखकर Enter दबाएँ। तीनों हो जाएँ तो विंडो बंद करके दोबारा खोलें। नए प्रोग्राम ढूँढने के लिए Windows को यह चाहिए।'
          ),
        },
        {
          title: b('Check that they installed', 'जाँचें कि इंस्टॉल हो गए'),
          blocks: [{ lines: ['git --version', 'py --version', 'ffmpeg -version'] }],
          after: b(
            'git should show a version number, py should show Python 3.9 or higher (for example 3.13), and ffmpeg should print a few lines starting with “ffmpeg version”.',
            'git को वर्शन नंबर दिखाना चाहिए, py में Python 3.9 या ऊपर दिखना चाहिए (जैसे 3.13), और ffmpeg को “ffmpeg version” से शुरू होने वाली कुछ लाइनें दिखानी चाहिए।'
          ),
        },
        {
          title: b('Get the app', 'ऐप का कोड लें'),
          text: b('This downloads the app from GitHub into a folder called mpg-to-mp4 in your user folder, and goes into it.', 'यह GitHub से ऐप को आपके यूज़र फ़ोल्डर में mpg-to-mp4 नाम के फ़ोल्डर में उतारता है और उसके अंदर चला जाता है।'),
          blocks: [
            { label: b('PowerShell', 'PowerShell'), lines: ['cd $HOME', `git clone ${REPO}`, 'cd mpg-to-mp4'] },
            { label: b('Command Prompt (CMD)', 'Command Prompt (CMD)'), lines: ['cd %USERPROFILE%', `git clone ${REPO}`, 'cd mpg-to-mp4'] },
          ],
        },
        {
          title: b('Set it up (first time only)', 'सेटअप करें (सिर्फ़ पहली बार)'),
          text: b('Same lines in PowerShell and CMD.', 'PowerShell और CMD में एक जैसी लाइनें।'),
          blocks: [{ lines: ['py -m venv .venv', '.venv\\Scripts\\python.exe -m pip install -r requirements.txt'] }],
          after: WAIT,
        },
        {
          title: b('Start the app', 'ऐप चालू करें'),
          blocks: [{ lines: ['.venv\\Scripts\\python.exe app.py'] }],
          after: OPEN_APP,
        },
        {
          title: b('Next time', 'अगली बार'),
          text: b('You do not need to install anything again. Open PowerShell or CMD and run:', 'कुछ दोबारा इंस्टॉल नहीं करना। PowerShell या CMD खोलकर ये चलाएँ:'),
          blocks: [
            { label: b('PowerShell', 'PowerShell'), lines: ['cd $HOME\\mpg-to-mp4', '.venv\\Scripts\\python.exe app.py'] },
            { label: b('Command Prompt (CMD)', 'Command Prompt (CMD)'), lines: ['cd %USERPROFILE%\\mpg-to-mp4', '.venv\\Scripts\\python.exe app.py'] },
          ],
          after: b('To stop the app, click the window and press Ctrl+C.', 'ऐप बंद करने के लिए विंडो पर क्लिक करके Ctrl+C दबाएँ।'),
        },
      ],
      fixes: [
        {
          problem: b('The app says “Not enough free disk space”', 'ऐप कहता है “Not enough free disk space”'),
          fix: b(
            'Your file needs about 1.5 times its size free in the temporary folder. Free some space, or start the app with a folder on a drive that has more room (change the folder name to your own; the app creates it if it is missing).',
            'आपकी फ़ाइल के साइज़ का लगभग 1.5 गुना टेम्पररी फ़ोल्डर में खाली होना चाहिए। जगह खाली करें, या ऐप को ऐसी ड्राइव के फ़ोल्डर के साथ चालू करें जिसमें ज़्यादा जगह हो (फ़ोल्डर का नाम अपने हिसाब से बदलें; फ़ोल्डर न हो तो ऐप उसे बना देता है)।'
          ),
          blocks: [{ label: b('PowerShell', 'PowerShell'), lines: ['$env:MPG_TEMP_DIR="D:\\mpg-temp"', '.venv\\Scripts\\python.exe app.py'] }, { label: b('Command Prompt (CMD)', 'Command Prompt (CMD)'), lines: ['set MPG_TEMP_DIR=D:\\mpg-temp', '.venv\\Scripts\\python.exe app.py'] }],
        },
        {
          problem: b('The page opens, but converting says “ffmpeg was not found”', 'पेज खुलता है, लेकिन कन्वर्ट करने पर “ffmpeg was not found” आता है'),
          fix: b(
            'The app can only use an ffmpeg that this window can find. Stop the app (Ctrl+C), close this PowerShell or CMD window and open a new one. Run the first line: if it prints “ffmpeg version”, start the app again. If it says the command is not found, run the second line to install ffmpeg, then close the window, open a new one and start the app again.',
            'ऐप सिर्फ़ वही ffmpeg इस्तेमाल कर सकता है जो यह विंडो ढूँढ पाए। ऐप रोकें (Ctrl+C), इस PowerShell या CMD विंडो को बंद करके नई खोलें। पहली लाइन चलाएँ: अगर “ffmpeg version” छपे, तो ऐप फिर से चालू करें। अगर कमांड न मिले, तो दूसरी लाइन से ffmpeg इंस्टॉल करें, फिर विंडो बंद करके नई खोलें और ऐप फिर से चालू करें।'
          ),
          blocks: [{ lines: ['ffmpeg -version', 'winget install -e --id Gyan.FFmpeg'] }],
        },
        {
          problem: b('“git is not recognized”, “py is not recognized” or “ffmpeg is not recognized”', '“git is not recognized”, “py is not recognized” या “ffmpeg is not recognized”'),
          fix: b(
            'Close the window and open it again. If it still fails, install the program by hand from its official site: git-scm.com, python.org (tick “Add python.exe to PATH” in the installer) and ffmpeg.org (Windows builds).',
            'विंडो बंद करके दोबारा खोलें। फिर भी न चले, तो प्रोग्राम को उसकी आधिकारिक साइट से हाथ से इंस्टॉल करें: git-scm.com, python.org (इंस्टॉलर में “Add python.exe to PATH” पर टिक करें) और ffmpeg.org (Windows builds)।'
          ),
        },
        {
          problem: b('“winget is not recognized”', '“winget is not recognized”'),
          fix: b('Update “App Installer” in the Microsoft Store, or install Git, Python and ffmpeg by hand from the sites above.', 'Microsoft Store में “App Installer” अपडेट करें, या ऊपर की साइटों से Git, Python और ffmpeg हाथ से इंस्टॉल करें।'),
        },
        {
          problem: PORT_PROBLEM,
          fix: PORT_TEXT,
          blocks: [
            { label: b('PowerShell', 'PowerShell'), lines: ['$env:PORT=5001', '.venv\\Scripts\\python.exe app.py'] },
            { label: b('Command Prompt (CMD)', 'Command Prompt (CMD)'), lines: ['set PORT=5001', '.venv\\Scripts\\python.exe app.py'] },
          ],
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
      testedNote: NOT_RUN(
        'The converter itself was tested on Linux. These Termux steps are written from the Termux package lists and documentation, and the author has not run them on a phone yet. Converting on a phone is slower than on a computer, so try a short video first.',
        'कन्वर्टर खुद Linux पर टेस्ट किया गया है। ये Termux स्टेप्स Termux की पैकेज लिस्ट और दस्तावेज़ों से लिखे गए हैं, और लेखक ने इन्हें अभी फ़ोन पर चलाकर नहीं देखा है। फ़ोन पर कन्वर्ज़न कंप्यूटर से धीमा होता है, इसलिए पहले कोई छोटा वीडियो आज़माएँ।'
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
          title: b('Install Python, ffmpeg and Git', 'Python, ffmpeg और Git इंस्टॉल करें'),
          blocks: [{ lines: ['pkg install -y python python-pip ffmpeg git'] }],
        },
        {
          title: b('Get the app', 'ऐप का कोड लें'),
          blocks: [{ lines: ['cd ~', `git clone ${REPO}`, 'cd mpg-to-mp4'] }],
        },
        {
          title: b('Set it up (first time only)', 'सेटअप करें (सिर्फ़ पहली बार)'),
          blocks: [{ lines: ['pip install -r requirements.txt'] }],
          after: b('Wait until the prompt comes back. If it stops with an error, open “If something goes wrong” below.', 'प्रॉम्प्ट वापस आने तक रुकें। एरर के साथ रुक जाए तो नीचे “कुछ गड़बड़ हो तो” खोलें।'),
        },
        {
          title: b('Start the app', 'ऐप चालू करें'),
          blocks: [{ lines: ['python app.py'] }],
          after: b(
            `When Termux shows “MPG to MP4 is running”, open Chrome (or any browser) on the same phone and go to ${URL_LOCAL}. Keep Termux running: pull down the notification area and tap “Acquire wakelock” on the Termux notification, so Android does not put it to sleep while a video is converting.`,
            `जब Termux में “MPG to MP4 is running” दिखे, तो उसी फ़ोन पर Chrome (या कोई भी ब्राउज़र) खोलकर ${URL_LOCAL} पर जाएँ। Termux को चालू रखें: नोटिफ़िकेशन एरिया नीचे खींचें और Termux की नोटिफ़िकेशन पर “Acquire wakelock” दबाएँ, ताकि वीडियो बदलते समय Android इसे सुला न दे।`
          ),
        },
        {
          title: b('Next time', 'अगली बार'),
          blocks: [{ lines: ['cd ~/mpg-to-mp4', 'python app.py'] }],
          after: b('To stop the app, press Ctrl+C in Termux (or swipe Termux away).', 'ऐप बंद करने के लिए Termux में Ctrl+C दबाएँ (या Termux को स्वाइप करके हटा दें)।'),
        },
      ],
      fixes: [
        {
          problem: b('The app says “Not enough free disk space”', 'ऐप कहता है “Not enough free disk space”'),
          fix: b(
            'Your file needs about 1.5 times its size free in the temporary folder. Free some space, or start the app with a folder on a drive that has more room (change the folder name to your own; the app creates it if it is missing).',
            'आपकी फ़ाइल के साइज़ का लगभग 1.5 गुना टेम्पररी फ़ोल्डर में खाली होना चाहिए। जगह खाली करें, या ऐप को ऐसी ड्राइव के फ़ोल्डर के साथ चालू करें जिसमें ज़्यादा जगह हो (फ़ोल्डर का नाम अपने हिसाब से बदलें; फ़ोल्डर न हो तो ऐप उसे बना देता है)।'
          ),
          blocks: [{ lines: ['MPG_TEMP_DIR=$HOME/mpg-temp python app.py'] }],
        },
        {
          problem: b('The page opens, but converting says “ffmpeg was not found”', 'पेज खुलता है, लेकिन कन्वर्ट करने पर “ffmpeg was not found” आता है'),
          fix: b(
            'The app can only use an ffmpeg that this window can find. Stop the app (Ctrl+C), then run these lines in Termux. Run the first line: if it prints “ffmpeg version”, start the app again. If it says the command is not found, run the second line to install ffmpeg, then close the window, open a new one and start the app again.',
            'ऐप सिर्फ़ वही ffmpeg इस्तेमाल कर सकता है जो यह विंडो ढूँढ पाए। ऐप रोकें (Ctrl+C), फिर Termux में ये लाइनें चलाएँ। पहली लाइन चलाएँ: अगर “ffmpeg version” छपे, तो ऐप फिर से चालू करें। अगर कमांड न मिले, तो दूसरी लाइन से ffmpeg इंस्टॉल करें, फिर विंडो बंद करके नई खोलें और ऐप फिर से चालू करें।'
          ),
          blocks: [{ lines: ['ffmpeg -version', 'pkg install -y ffmpeg'] }],
        },
        {
          problem: b('pip says “externally-managed-environment”', 'pip कहता है “externally-managed-environment”'),
          fix: b('Run the install again with one extra word:', 'एक शब्द और जोड़कर इंस्टॉल दोबारा चलाएँ:'),
          blocks: [{ lines: ['pip install --break-system-packages -r requirements.txt'] }],
        },
        {
          problem: b('The app stops after a while with the screen off', 'स्क्रीन बंद होने पर ऐप कुछ देर बाद रुक जाता है'),
          fix: b(
            'Tap “Acquire wakelock” on the Termux notification, and in Android settings set battery usage for Termux to “Unrestricted” (the wording differs by phone).',
            'Termux की नोटिफ़िकेशन पर “Acquire wakelock” दबाएँ, और Android सेटिंग्स में Termux का बैटरी इस्तेमाल “Unrestricted” करें (शब्द फ़ोन के हिसाब से अलग हो सकते हैं)।'
          ),
        },
        {
          problem: PORT_PROBLEM,
          fix: PORT_TEXT,
          blocks: [{ lines: ['PORT=5001 python app.py'] }],
        },
      ],
    },

    // ---------------------------------------------------------------- Linux
    {
      id: 'linux',
      label: 'Linux',
      name: b('Linux (Ubuntu, Debian, Fedora, Arch)', 'Linux (Ubuntu, Debian, Fedora, Arch)'),
      summary: b('Uses the terminal. Pick the line for your distribution.', 'टर्मिनल इस्तेमाल होता है। अपने distribution की लाइन चुनें।'),
      tested: true,
      testedNote: NOT_RUN(
        'The set-up, start and conversion steps were run on Linux with ffmpeg and Flask, using a test MPG file. The package-install lines (apt, dnf, pacman) are the standard ones from each distribution and were not run by the author.',
        'सेटअप, स्टार्ट और कन्वर्ज़न के स्टेप्स Linux पर ffmpeg और Flask के साथ एक टेस्ट MPG फ़ाइल से चलाकर देखे गए हैं। पैकेज इंस्टॉल की लाइनें (apt, dnf, pacman) हर distribution की मानक कमांड हैं और लेखक ने इन्हें नहीं चलाया।'
      ),
      steps: [
        {
          title: b('Open a terminal', 'टर्मिनल खोलें'),
          text: b('On most systems the shortcut is Ctrl+Alt+T. Otherwise search for “Terminal” in your applications.', 'ज़्यादातर सिस्टम में शॉर्टकट Ctrl+Alt+T है। नहीं तो अपने एप्लिकेशन में “Terminal” खोजें।'),
        },
        {
          title: b('Install Git, Python and ffmpeg', 'Git, Python और ffmpeg इंस्टॉल करें'),
          blocks: [
            { label: b('Ubuntu / Debian', 'Ubuntu / Debian'), lines: ['sudo apt update', 'sudo apt install -y git python3 python3-venv python3-pip ffmpeg'] },
            { label: b('Fedora', 'Fedora'), lines: ['sudo dnf install -y git python3 python3-pip ffmpeg-free'] },
            { label: b('Arch', 'Arch'), lines: ['sudo pacman -S --needed git python python-pip ffmpeg'] },
          ],
        },
        {
          title: b('Get the app', 'ऐप का कोड लें'),
          blocks: [{ lines: ['cd ~', `git clone ${REPO}`, 'cd mpg-to-mp4'] }],
        },
        {
          title: b('Set it up (first time only)', 'सेटअप करें (सिर्फ़ पहली बार)'),
          blocks: [{ lines: ['python3 -m venv .venv', '.venv/bin/python -m pip install -r requirements.txt'] }],
          after: WAIT,
        },
        {
          title: b('Start the app', 'ऐप चालू करें'),
          blocks: [{ lines: ['.venv/bin/python app.py'] }],
          after: OPEN_APP,
        },
        {
          title: b('Next time', 'अगली बार'),
          blocks: [{ lines: ['cd ~/mpg-to-mp4', '.venv/bin/python app.py'] }],
          after: b('To stop the app, click the terminal window and press Ctrl+C.', 'ऐप बंद करने के लिए टर्मिनल विंडो पर क्लिक करके Ctrl+C दबाएँ।'),
        },
      ],
      fixes: [
        {
          problem: b('The app says “Not enough free disk space”', 'ऐप कहता है “Not enough free disk space”'),
          fix: b(
            'Your file needs about 1.5 times its size free in the temporary folder. Free some space, or start the app with a folder on a drive that has more room (change the folder name to your own; the app creates it if it is missing).',
            'आपकी फ़ाइल के साइज़ का लगभग 1.5 गुना टेम्पररी फ़ोल्डर में खाली होना चाहिए। जगह खाली करें, या ऐप को ऐसी ड्राइव के फ़ोल्डर के साथ चालू करें जिसमें ज़्यादा जगह हो (फ़ोल्डर का नाम अपने हिसाब से बदलें; फ़ोल्डर न हो तो ऐप उसे बना देता है)।'
          ),
          blocks: [{ lines: ['MPG_TEMP_DIR=$HOME/mpg-temp .venv/bin/python app.py'] }],
        },
        {
          problem: b('The page opens, but converting says “ffmpeg was not found”', 'पेज खुलता है, लेकिन कन्वर्ट करने पर “ffmpeg was not found” आता है'),
          fix: b(
            'The app can only use an ffmpeg that this window can find. Stop the app (Ctrl+C), open a new terminal window. Run the first line: if it prints “ffmpeg version”, start the app again. If it says the command is not found, run the second line to install ffmpeg, then close the window, open a new one and start the app again.',
            'ऐप सिर्फ़ वही ffmpeg इस्तेमाल कर सकता है जो यह विंडो ढूँढ पाए। ऐप रोकें (Ctrl+C), नई टर्मिनल विंडो खोलें। पहली लाइन चलाएँ: अगर “ffmpeg version” छपे, तो ऐप फिर से चालू करें। अगर कमांड न मिले, तो दूसरी लाइन से ffmpeg इंस्टॉल करें, फिर विंडो बंद करके नई खोलें और ऐप फिर से चालू करें।'
          ),
          blocks: [{ lines: ['ffmpeg -version', 'sudo apt install -y ffmpeg'] }],
        },
        {
          problem: b('“ensurepip is not available” when creating the virtual environment', 'वर्चुअल एनवायरनमेंट बनाते समय “ensurepip is not available”'),
          fix: b('On Ubuntu and Debian, install the venv package, then run the set-up lines again:', 'Ubuntu और Debian पर venv पैकेज इंस्टॉल करें, फिर सेटअप की लाइनें दोबारा चलाएँ:'),
          blocks: [{ lines: ['sudo apt install -y python3-venv'] }],
        },
        {
          problem: PORT_PROBLEM,
          fix: PORT_TEXT,
          blocks: [{ lines: ['PORT=5001 .venv/bin/python app.py'] }],
        },
      ],
    },

    // ---------------------------------------------------------------- Mac
    {
      id: 'mac',
      label: 'Mac',
      name: b('Mac (macOS)', 'Mac (macOS)'),
      summary: b('Uses Terminal and Homebrew, the standard way to install programs on a Mac.', 'Terminal और Homebrew इस्तेमाल होता है, जो Mac पर प्रोग्राम इंस्टॉल करने का आम तरीका है।'),
      tested: false,
      testedNote: NOT_RUN(
        'The converter itself was tested on Linux. These Mac steps are written from the official Homebrew documentation and package pages, and the author has not run them on a Mac yet. If one fails, see “If something goes wrong” below.',
        'कन्वर्टर खुद Linux पर टेस्ट किया गया है। ये Mac स्टेप्स Homebrew के आधिकारिक दस्तावेज़ों और पैकेज पेजों से लिखे गए हैं, और लेखक ने इन्हें अभी Mac पर चलाकर नहीं देखा है। कोई स्टेप फेल हो तो नीचे “कुछ गड़बड़ हो तो” देखें।'
      ),
      steps: [
        {
          title: b('Open Terminal', 'Terminal खोलें'),
          text: b('Press Command+Space, type Terminal and press Enter.', 'Command+Space दबाएँ, Terminal लिखें और Enter दबाएँ।'),
        },
        {
          title: b('Install Homebrew (if you do not have it)', 'Homebrew इंस्टॉल करें (अगर नहीं है)'),
          text: b('First check whether you already have it. If it prints a version number, skip the second line.', 'पहले जाँचें कि कहीं पहले से तो नहीं है। अगर वर्शन नंबर दिखे, तो दूसरी लाइन छोड़ दें।'),
          blocks: [{ lines: ['brew --version', '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'] }],
          after: b(
            'The second line is the official installer from brew.sh. It explains what it will do and asks for your Mac password. When it finishes it prints “Next steps”: copy and run those lines too, so that the brew command works.',
            'दूसरी लाइन brew.sh का आधिकारिक इंस्टॉलर है। यह बताता है कि क्या करेगा और आपका Mac पासवर्ड माँगता है। खत्म होने पर यह “Next steps” छापता है: वे लाइनें भी कॉपी करके चलाएँ, ताकि brew कमांड काम करे।'
          ),
          links: [{ label: b('Homebrew', 'Homebrew'), href: 'https://brew.sh/' }],
        },
        {
          title: b('Install Git, Python and ffmpeg', 'Git, Python और ffmpeg इंस्टॉल करें'),
          blocks: [{ lines: ['brew install git python@3.13 ffmpeg'] }],
        },
        {
          title: b('Get the app', 'ऐप का कोड लें'),
          blocks: [{ lines: ['cd ~', `git clone ${REPO}`, 'cd mpg-to-mp4'] }],
        },
        {
          title: b('Set it up (first time only)', 'सेटअप करें (सिर्फ़ पहली बार)'),
          blocks: [{ lines: ['python3.13 -m venv .venv', '.venv/bin/python -m pip install -r requirements.txt'] }],
          after: WAIT,
        },
        {
          title: b('Start the app', 'ऐप चालू करें'),
          blocks: [{ lines: ['.venv/bin/python app.py'] }],
          after: OPEN_APP,
        },
        {
          title: b('Next time', 'अगली बार'),
          blocks: [{ lines: ['cd ~/mpg-to-mp4', '.venv/bin/python app.py'] }],
          after: b('To stop the app, click the Terminal window and press Control+C.', 'ऐप बंद करने के लिए Terminal विंडो पर क्लिक करके Control+C दबाएँ।'),
        },
      ],
      fixes: [
        {
          problem: b('The app says “Not enough free disk space”', 'ऐप कहता है “Not enough free disk space”'),
          fix: b(
            'Your file needs about 1.5 times its size free in the temporary folder. Free some space, or start the app with a folder on a drive that has more room (change the folder name to your own; the app creates it if it is missing).',
            'आपकी फ़ाइल के साइज़ का लगभग 1.5 गुना टेम्पररी फ़ोल्डर में खाली होना चाहिए। जगह खाली करें, या ऐप को ऐसी ड्राइव के फ़ोल्डर के साथ चालू करें जिसमें ज़्यादा जगह हो (फ़ोल्डर का नाम अपने हिसाब से बदलें; फ़ोल्डर न हो तो ऐप उसे बना देता है)।'
          ),
          blocks: [{ lines: ['MPG_TEMP_DIR=$HOME/mpg-temp .venv/bin/python app.py'] }],
        },
        {
          problem: b('The page opens, but converting says “ffmpeg was not found”', 'पेज खुलता है, लेकिन कन्वर्ट करने पर “ffmpeg was not found” आता है'),
          fix: b(
            'The app can only use an ffmpeg that this window can find. Stop the app (Ctrl+C), open a new Terminal window. Run the first line: if it prints “ffmpeg version”, start the app again. If it says the command is not found, run the second line to install ffmpeg, then close the window, open a new one and start the app again.',
            'ऐप सिर्फ़ वही ffmpeg इस्तेमाल कर सकता है जो यह विंडो ढूँढ पाए। ऐप रोकें (Ctrl+C), नई Terminal विंडो खोलें। पहली लाइन चलाएँ: अगर “ffmpeg version” छपे, तो ऐप फिर से चालू करें। अगर कमांड न मिले, तो दूसरी लाइन से ffmpeg इंस्टॉल करें, फिर विंडो बंद करके नई खोलें और ऐप फिर से चालू करें।'
          ),
          blocks: [{ lines: ['ffmpeg -version', 'brew install ffmpeg'] }],
        },
        {
          problem: b('“brew: command not found” right after installing Homebrew', 'Homebrew इंस्टॉल करने के ठीक बाद “brew: command not found”'),
          fix: b('Run the “Next steps” lines that the Homebrew installer printed at the end, then open a new Terminal window.', 'Homebrew इंस्टॉलर ने अंत में जो “Next steps” लाइनें छापी थीं, उन्हें चलाएँ और फिर नई Terminal विंडो खोलें।'),
        },
        {
          problem: b('“python3.13: command not found”', '“python3.13: command not found”'),
          fix: b('Open a new Terminal window and try again. If it still fails, run the install line again:', 'नई Terminal विंडो खोलकर फिर कोशिश करें। फिर भी न चले, तो इंस्टॉल वाली लाइन दोबारा चलाएँ:'),
          blocks: [{ lines: ['brew install python@3.13'] }],
        },
        {
          problem: b('Port 5000 is already in use on a Mac', 'Mac पर port 5000 पहले से इस्तेमाल में है'),
          fix: b('macOS can use port 5000 for AirPlay Receiver. Start the app on another port and open that port in the browser (here 5001):', 'macOS port 5000 को AirPlay Receiver के लिए इस्तेमाल कर सकता है। ऐप को दूसरे port पर चालू करें और ब्राउज़र में वही port खोलें (यहाँ 5001):'),
          blocks: [{ lines: ['PORT=5001 .venv/bin/python app.py'] }],
        },
      ],
    },
  ],

  updateIntro: b(
    'A newer version of the app can fix problems or add improvements. Updating takes about a minute: it gets the newest version of the app and of its library. The videos you already converted stay where they are.',
    'ऐप का नया वर्शन समस्याएँ ठीक कर सकता है या सुधार ला सकता है। अपडेट में लगभग एक मिनट लगता है: यह ऐप और उसकी लाइब्रेरी का नया वर्शन ले आता है। जो वीडियो आप पहले कन्वर्ट कर चुके हैं, वे वहीं रहते हैं।'
  ),
  usingTitle: b('Using the app', 'ऐप कैसे इस्तेमाल करें'),
  using: [
    b(`Open ${URL_LOCAL} in your browser.`, `अपने ब्राउज़र में ${URL_LOCAL} खोलें।`),
    b('Drop your .mpg or .mpeg file on the box, or click the box and choose the file.', 'अपनी .mpg या .mpeg फ़ाइल बॉक्स पर छोड़ें, या बॉक्स पर क्लिक करके फ़ाइल चुनें।'),
    b('Choose “Speed or quality” (Fast is best for big files) and press “Convert to MP4”. Two bars show the progress: sending the file to the app, and converting it, with percent, speed and the time left.', '“Speed or quality” चुनें (बड़ी फ़ाइलों के लिए Fast सबसे अच्छा है) और “Convert to MP4” दबाएँ। दो बार प्रोग्रेस दिखाते हैं: फ़ाइल को ऐप तक भेजना, और उसे कन्वर्ट करना, प्रतिशत, स्पीड और बचे समय के साथ।'),
    b('When it says “Done”, press “Download MP4”. The file goes to your browser’s Downloads folder. Then press “Delete temporary file and convert another” to free the disk space.', '“Done” दिखे तो “Download MP4” दबाएँ। फ़ाइल आपके ब्राउज़र के Downloads फ़ोल्डर में जाती है। फिर डिस्क की जगह खाली करने के लिए “Delete temporary file and convert another” दबाएँ।'),
  ],
  goodToKnowTitle: b('Good to know', 'ध्यान रखें'),
  goodToKnow: [
    b(
      'The video is re-encoded into H.264 video and AAC audio, which is what MP4 players expect. There is no size limit, so big files of 7 to 8 GB work. The time depends on your computer: it can take from many minutes to a few hours, so keep the window open and the device awake. “Fast” is the quickest. A phone is much slower than a computer and may run out of space, so use a computer for very big files.',
      'वीडियो को H.264 वीडियो और AAC ऑडियो में दोबारा एन्कोड किया जाता है, जो MP4 प्लेयर को चाहिए। साइज़ की कोई सीमा नहीं है, इसलिए 7 से 8 GB की बड़ी फ़ाइलें भी चलती हैं। समय आपके कंप्यूटर पर निर्भर करता है: कई मिनट से लेकर कुछ घंटे तक लग सकते हैं, इसलिए विंडो खुली और डिवाइस जगा हुआ रखें। “Fast” सबसे तेज़ है। फ़ोन कंप्यूटर से बहुत धीमा होता है और उसमें जगह कम पड़ सकती है, इसलिए बहुत बड़ी फ़ाइलों के लिए कंप्यूटर इस्तेमाल करें।'
    ),
    b(
      'The app needs free disk space of about 1.5 times the size of your file in its temporary folder (on Windows this is usually the C: drive). If space is short, the app tells you. Press “Delete temporary file and convert another” after downloading. The temporary files are also removed when you stop the app. It only takes .mpg and .mpeg files; if a file is damaged, the app says it could not convert it.',
      'ऐप को अपने टेम्पररी फ़ोल्डर में आपकी फ़ाइल के साइज़ का लगभग 1.5 गुना खाली डिस्क स्पेस चाहिए (Windows पर यह आम तौर पर C: ड्राइव होती है)। जगह कम हो तो ऐप बता देता है। डाउनलोड के बाद “Delete temporary file and convert another” दबाएँ। ऐप बंद करने पर भी अस्थायी फ़ाइलें हट जाती हैं। यह सिर्फ़ .mpg और .mpeg फ़ाइलें लेता है; फ़ाइल खराब हो तो ऐप बताता है कि वह कन्वर्ट नहीं हो सकी।'
    ),
    b(
      'Nothing about your videos goes through arvish.xyz. You get the app’s code from GitHub once; after that the conversion happens only on your device, and the temporary files are deleted when you press “Delete temporary file and convert another” or stop the app.',
      'आपके वीडियो का कुछ भी arvish.xyz से होकर नहीं जाता। आप ऐप का कोड एक बार GitHub से लेते हैं; उसके बाद कन्वर्ज़न सिर्फ़ आपके डिवाइस पर होता है, और “Delete temporary file and convert another” दबाने या ऐप बंद करने पर अस्थायी फ़ाइलें हटा दी जाती हैं।'
    ),
    b(
      'The app is open source. The code is in its own repository on GitHub: Abhishek862009/mpg-to-mp4.',
      'ऐप ओपन सोर्स है। कोड GitHub पर अपनी अलग रिपॉज़िटरी में है: Abhishek862009/mpg-to-mp4।'
    ),
  ],
}, { folder: 'mpg-to-mp4', winPython: '.venv\\Scripts\\python.exe', windowsCmd: true });
