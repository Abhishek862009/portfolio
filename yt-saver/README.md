# yt-saver

Paste a YouTube link, pick a quality, save the file. A small Flask app (Python + ffmpeg + yt-dlp).

It lives in this repo so the code stays in one place, but it **cannot run on Vercel together with the
Next.js site**: it needs ffmpeg and downloads that last minutes, while Vercel Functions are capped at
300 s (Hobby) and 4.5 MB per request/response
([Vercel limits](https://vercel.com/docs/functions/limitations)). So it runs on a server, and the
site shows it at `https://www.arvish.xyz/yt-saver` by forwarding that path to the server.

```
browser ── arvish.xyz/yt-saver ──(Next.js rewrite)──> your yt-saver server  ──> YouTube
```

Only save videos you own, that are licensed for reuse, or that you have permission to download.

## Switch it on in the site

1. Run this app on a server (below) and note its address, e.g. `https://yt.example.com`.
2. In the Vercel project of the site add the environment variable `YT_SAVER_URL=https://yt.example.com`
   (no trailing slash) and **redeploy** (it is read at build time).
3. On the server set `URL_PREFIX=/yt-saver`.

The App Store card changes from "Coming soon" to "Open app" by itself.

## Two modes

| | Private (default) | Public (`PUBLIC_MODE=1`) |
|---|---|---|
| Login | one shared password (`APP_PASSWORD`) | none |
| Limits | none | per visitor: `PER_HOUR` saves/hour (6), `INFO_PER_HOUR` look-ups/hour (40), one download at a time, videos up to `MAX_MINUTES` (30), files up to `MAX_FILE_MB` (700), up to `MAX_HEIGHT` p (1080) |
| Playlists | yes | no |

For "other users can use it", use public mode. The limits are kept in memory, so a restart resets them.

### Environment variables

| Variable | Used for |
|---|---|
| `PUBLIC_MODE` | `1` = public mode (above) |
| `APP_PASSWORD` | private mode only. Required on a server. Must be a new password, never one that was in this repo |
| `URL_PREFIX` | `/yt-saver` when served through the site |
| `PROXY_HOPS` | how many proxies are in front of the app (default 1). **Check it**, see below |
| `ADMIN_KEY` | lets you open `/api/health?key=...` in public mode |
| `YT_COOKIES` / `YT_COOKIES_FILE`, `YT_PROXY` | getting past YouTube blocking a server's IP, see below |
| `SECRET_KEY` | optional, signs the login cookie (private mode) |
| `MAX_HEIGHT`, `MAX_MINUTES`, `MAX_FILE_MB`, `PER_HOUR`, `INFO_PER_HOUR` | public-mode limits |

### Check `PROXY_HOPS` (important in public mode)

The per-visitor limits are keyed on the visitor's address. Behind the site's rewrite (and maybe a tunnel)
the app only sees the address that the proxies pass on. After deploying, open
`https://www.arvish.xyz/yt-saver/api/health?key=<ADMIN_KEY>` and look at `your_ip`:

- It is **your own** public address: correct.
- It is an address that is not yours (the same for every device): `PROXY_HOPS` is too low, so all
  visitors would share one limit. Raise it by one and check again.

I could not test this against Vercel's real proxy from where this was written, so please verify it once.

## Run on a server

```bash
docker build -t yt-saver .
docker run -p 5000:5000 -e PUBLIC_MODE=1 -e URL_PREFIX=/yt-saver -e ADMIN_KEY=<random> yt-saver
```

On a phone/PC (Termux) use `bash start.sh`; it opens `http://127.0.0.1:5000` in private mode. Running at
home is also the best protection against YouTube blocking server IPs (below); to reach it from outside
you need a tunnel (for example Cloudflare Tunnel or Tailscale Funnel).

## When YouTube blocks the server ("confirm you're not a bot")

YouTube often refuses requests from server/datacenter IPs. In order of how well it tends to work:

1. **Run it at home** (phone/PC) behind a tunnel. A home IP is rarely blocked. Not great for many visitors
   (your bandwidth, and the app is off when the device is off).
2. **Cookies** (`YT_COOKIES` / `YT_COOKIES_FILE`). Export them as described in the yt-dlp wiki: open a new
   private/incognito window, log in to YouTube, open `https://www.youtube.com/robots.txt` in that same tab,
   export the `youtube.com` cookies with a cookies.txt extension, then close the window. Guides:
   [yt-dlp wiki, YouTube](https://github.com/yt-dlp/yt-dlp/wiki/extractors),
   [FAQ](https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp).
   Put the text, or its base64 (`base64 -w0 cookies.txt`), in `YT_COOKIES`.
   - The yt-dlp wiki warns that using an account with yt-dlp can get it banned (temporarily or
     permanently) and suggests a throwaway account. **Never use your main account**, especially in
     public mode where many visitors share the same login.
   - **Never commit cookies.txt.** `.gitignore` lists it.
   - Cookies expire; re-export when the error says so.
3. **A proxy with a home-type IP** (`YT_PROXY=http://user:pass@host:port`). Usually paid, and the video
   traffic goes through it too.

None of this is guaranteed: YouTube changes its checks often, and a public service that many people use
from one address is more likely to get limited. The Docker image fetches the newest yt-dlp every time it
starts. `/api/health` shows what the server picked up.

## Things to know before making it public

- Downloading videos can break YouTube's Terms of Service and copyright law; the visitor is told this on
  the page, but a public service is also your responsibility. The tool's page is hidden from search engines
  (`noindex`, `robots.txt`).
- Every download goes through your server's bandwidth and disk. Check the plan and terms of whoever hosts it.
- Visitors on the same network (a hostel or college Wi-Fi) share one address, so they share the limits.
