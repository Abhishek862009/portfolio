# YT Saver

Paste a YouTube link, pick a quality from highest to lowest, save the file. A small Flask app
(Python + ffmpeg + yt-dlp) that **runs on your own device**: Windows, Android (Termux), Linux or Mac.

**Step-by-step setup for each device (Windows, Android/Termux, Linux, Mac), in English and Hindi:**
<https://www.arvish.xyz/apps/yt-saver>  
The same guide as plain text (easy to paste into an AI assistant):
<https://www.arvish.xyz/guides/yt-saver/en> · <https://www.arvish.xyz/guides/yt-saver/hi>

Only save videos you own, that are licensed for reuse, or that you have permission to download.
Downloading other people's videos may break YouTube's Terms of Service or copyright law.

## Why it runs on your device

YouTube often blocks the servers websites run on. I tried it from Vercel's servers: 1 of 7 different
videos worked, the other 6 were refused with "Sign in to confirm you're not a bot". On your own device it
uses your own home or mobile connection, which is rarely blocked. (Vercel Functions are also capped at
300 s and 4.5 MB per request/response, see [Vercel limits](https://vercel.com/docs/functions/limitations),
and have no ffmpeg.)

## Quick start (if you already have the tools)

You need Git, Python 3.11+, ffmpeg and a JavaScript engine (Node.js 22+ or Deno 2.3+; yt-dlp needs one
for YouTube, see the [yt-dlp EJS wiki](https://github.com/yt-dlp/yt-dlp/wiki/EJS)).

```bash
git clone --depth 1 https://github.com/Abhishek862009/portfolio.git
cd portfolio/yt-saver
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt     # Windows: .\.venv\Scripts\python.exe
.venv/bin/python app.py                                  # then open http://127.0.0.1:5000
```

## Modes (there is no password)

| Mode | When | Reachable from |
|---|---|---|
| **Local** (default) | you run it on your own device and set nothing | only that device (`127.0.0.1`) |
| **Public** | `PUBLIC_MODE=1` (for hosting it for others) | wherever you expose it, with per-visitor limits |

In local mode the app listens on `127.0.0.1` only, answers only requests whose `Host` is `127.0.0.1` /
`localhost`, and refuses cross-site requests (a web page you visit cannot make it download things).
Making the app reachable from outside (`HOST` other than `127.0.0.1`, or `BEHIND_PROXY=1`) without
`PUBLIC_MODE=1` is refused.

### Environment variables

| Variable | Used for |
|---|---|
| `PORT` | port to listen on (default 5000) |
| `HOST` | address to listen on (default `127.0.0.1`; only change it if you know why) |
| `PUBLIC_MODE` | `1` = public mode |
| `BEHIND_PROXY`, `PROXY_HOPS` | set `BEHIND_PROXY=1` behind a real proxy; `PROXY_HOPS` = how many proxies (default 1) |
| `ADMIN_KEY` | lets you open `/api/health?key=...` in public mode |
| `YT_COOKIES` / `YT_COOKIES_FILE`, `YT_PROXY` | see "When YouTube says 'confirm you're not a bot'" |
| `MAX_HEIGHT`, `MAX_MINUTES`, `MAX_FILE_MB`, `PER_HOUR`, `INFO_PER_HOUR` | public-mode limits (defaults 1080 p, 30 min, 700 MB, 6 saves/hour, 40 look-ups/hour) |

## Keeping it working

YouTube changes often, and an old yt-dlp is the most common reason saving breaks. Inside the `yt-saver`
folder, get the newest app and update the library:

```bash
git pull
.venv/bin/python -m pip install -U -r requirements.txt   # Windows: .\.venv\Scripts\python.exe -m pip ...
```

## When YouTube says "confirm you're not a bot"

On your own home or mobile connection this is uncommon. If it happens, in order of effort:

1. Wait a while, try another network (mobile data instead of Wi-Fi, or the reverse), update yt-dlp (above).
2. Cookies (`YT_COOKIES_FILE` or `YT_COOKIES`). Export them as described in the yt-dlp wiki ([FAQ](https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp)):
   open a new private/incognito window, log in to YouTube, open `https://www.youtube.com/robots.txt` in
   that same tab, export the `youtube.com` cookies with a cookies.txt extension, then close the window.
   The wiki warns that using an account with yt-dlp can get it banned, so **never use your main
   account**, and never share or commit `cookies.txt`.
3. `YT_PROXY=http://user:pass@host:port`, a proxy with a home-type address (usually paid).

None of this is guaranteed.

## Advanced: hosting it for other people

Not recommended, and not what the website does. If you still want to:

```bash
docker build -t yt-saver .
docker run -p 5000:5000 -e PUBLIC_MODE=1 -e ADMIN_KEY=<random> yt-saver
```

- Server IP addresses are often blocked by YouTube (see above), so expect it to fail for some videos.
- Every download goes through your server's bandwidth and disk. Check the plan and terms of whoever hosts it.
- The public-mode limits are per visitor address and kept in memory (a restart resets them). Behind a
  proxy, open `/api/health?key=<ADMIN_KEY>` and check `your_ip` is **your** address; if it is the same
  for every device, raise `PROXY_HOPS`.
- You are responsible for what visitors download.

## Files

| File | What it is |
|---|---|
| `app.py` | the Flask app |
| `index.html` | the page you see in the browser |
| `requirements.txt` | Python libraries (`yt-dlp[default]` includes the JavaScript helper yt-dlp needs) |
| `Dockerfile` | only for hosting it (above) |
| `start.sh` | an older one-command helper for Termux; the website guide uses explicit steps instead |
