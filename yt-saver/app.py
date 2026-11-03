import base64
import contextlib
import glob
import hashlib
import hmac
import os
import re
import secrets
import shutil
import sys
import tempfile
import threading
import time
from datetime import timedelta
from functools import wraps
from urllib.parse import parse_qs, urlparse

import yt_dlp
from flask import Flask, jsonify, redirect, request, send_file, send_from_directory, session
from werkzeug.middleware.proxy_fix import ProxyFix

BASE = os.path.dirname(os.path.abspath(__file__))

# ---- Mode ----
# PUBLIC_MODE=1 : anyone can use it, no login, but every visitor has limits (see "Limits" below).
# default (off) : private. One shared password (APP_PASSWORD).
PUBLIC_MODE = os.environ.get("PUBLIC_MODE", "0") == "1"
# When the site serves this app at arvish.xyz/yt-saver, the site removes "/yt-saver" before the
# request reaches this app, so redirects have to add it back. Set URL_PREFIX=/yt-saver then.
_prefix = os.environ.get("URL_PREFIX", "").strip().strip("/")
URL_PREFIX = "/" + _prefix if _prefix else ""

# ---- Password / local mode ----
# Three ways to run it:
#   local mode   (the normal way: your own phone/PC, nothing set): no login. The app only
#                listens on 127.0.0.1, so only this device can open it (see local_guard below).
#   private mode (APP_PASSWORD set): one shared password. This is REQUIRED as soon as the app
#                can be reached from outside (HOST other than 127.0.0.1, or BEHIND_PROXY=1).
#   public mode  (PUBLIC_MODE=1): no login, but every visitor has limits.
# Set APP_PASSWORD as an environment variable. Never put a real password in this file: the
# GitHub repo is public, so anyone could read it.
_OLD_DEFAULT_PASSWORD = "Abhishek862009"  # the old built-in default; it is in the public repo, so it is never accepted
APP_PASSWORD = os.environ.get("APP_PASSWORD", "").strip()
_is_local = os.environ.get("BEHIND_PROXY") != "1" and os.environ.get("HOST", "127.0.0.1") in ("127.0.0.1", "localhost")
LOCAL_MODE = False
if APP_PASSWORD == _OLD_DEFAULT_PASSWORD:
    sys.exit("APP_PASSWORD is the old default that is visible in the public repo. Choose a new one.")
if PUBLIC_MODE:
    APP_PASSWORD = APP_PASSWORD or secrets.token_urlsafe(24)  # no login in public mode; only seeds the cookie key
elif not APP_PASSWORD:
    if not _is_local:
        sys.exit("APP_PASSWORD is not set. Set it as an environment variable (a long, new password) and start again.")
    LOCAL_MODE = True
    APP_PASSWORD = secrets.token_urlsafe(24)  # nobody logs in; only seeds the cookie key
NO_LOGIN = PUBLIC_MODE or LOCAL_MODE

app = Flask(__name__, static_folder=None)
# Optional SECRET_KEY signs the login cookie. Without it, the key is derived
# from the password, so login survives restarts (changing the password logs everyone out).
app.secret_key = hashlib.sha256(
    ("ytsaver-v2:" + os.environ.get("SECRET_KEY", "") + ":" + APP_PASSWORD).encode()
).digest()
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Strict",
    SESSION_COOKIE_SECURE=os.environ.get("COOKIE_SECURE", "0") == "1",
    PERMANENT_SESSION_LIFETIME=timedelta(days=30),
    MAX_CONTENT_LENGTH=64 * 1024,  # room for a playlist batch request
)
def _env_int(name, default):
    try:
        return max(1, int(os.environ.get(name, default)))
    except ValueError:
        return default


# PROXY_HOPS = how many proxies sit in front of this app (each one adds an address to
# X-Forwarded-For). It must be right, because the per-visitor limits are keyed on the
# visitor's address: too low and everyone looks like the proxy (and shares one limit),
# too high and visitors can fake their address. Check /api/health -> your_ip.
PROXY_HOPS = _env_int("PROXY_HOPS", 1)
if os.environ.get("BEHIND_PROXY") == "1":  # only trust X-Forwarded-For behind a real proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=PROXY_HOPS, x_proto=1)

ALLOWED_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"}

# ---- Limits (public mode only; 0 means "no limit" in private mode) ----
if PUBLIC_MODE:
    MAX_HEIGHT = _env_int("MAX_HEIGHT", 1080)       # highest quality offered
    MAX_MINUTES = _env_int("MAX_MINUTES", 30)       # longest video
    MAX_FILE_MB = _env_int("MAX_FILE_MB", 700)      # biggest file
    PER_HOUR = _env_int("PER_HOUR", 6)              # saves per visitor per hour
    INFO_PER_HOUR = _env_int("INFO_PER_HOUR", 40)   # link look-ups per visitor per hour
else:
    MAX_HEIGHT, MAX_MINUTES, MAX_FILE_MB, PER_HOUR, INFO_PER_HOUR = 4320, 0, 0, 0, 0

_hits, _active_ips, _hits_lock = {}, set(), threading.Lock()


def client_ip():
    return request.remote_addr or "unknown"


def rate_ok(ip, bucket, limit):
    """True if this visitor may do one more `bucket` action within the last hour
    (and counts it). Memory only: a restart resets everyone's count."""
    if not PUBLIC_MODE or not limit:
        return True
    now, key = time.time(), (ip, bucket)
    with _hits_lock:
        recent = [t for t in _hits.get(key, []) if now - t < 3600]
        if len(recent) >= limit:
            _hits[key] = recent
            return False
        recent.append(now)
        _hits[key] = recent
    return True


def ip_acquire(ip):
    """Public mode: one running download per visitor."""
    if not PUBLIC_MODE:
        return True
    with _hits_lock:
        if ip in _active_ips:
            return False
        _active_ips.add(ip)
    return True


def ip_release(ip):
    if PUBLIC_MODE and ip:
        with _hits_lock:
            _active_ips.discard(ip)

# ---- Brute-force lockout (memory only, no database) ----
MAX_FAILS, LOCK_SECONDS = 5, 15 * 60
_fails, _fails_lock = {}, threading.Lock()


def locked_for(ip):
    with _fails_lock:
        rec = _fails.get(ip)
        if rec and rec["until"] > time.time():
            return int(rec["until"] - time.time())
        if rec and rec["until"]:
            _fails.pop(ip, None)
    return 0


def record_fail(ip):
    with _fails_lock:
        rec = _fails.setdefault(ip, {"count": 0, "until": 0})
        rec["count"] += 1
        if rec["count"] >= MAX_FAILS:
            rec["until"], rec["count"] = time.time() + LOCK_SECONDS, 0


def login_required(api=False):
    def deco(fn):
        @wraps(fn)
        def wrapper(*a, **kw):
            if not NO_LOGIN and not session.get("ok"):
                return (jsonify(error="Please log in."), 401) if api else redirect(URL_PREFIX + "/login")
            return fn(*a, **kw)
        return wrapper
    return deco


# Local mode has no login, so these two checks are what stop a web page open in your browser
# from talking to the app behind your back:
#  - Host check: only 127.0.0.1 / localhost / ::1 are accepted ("DNS rebinding" protection).
#  - Origin check: a POST that comes from another website is refused.
_LOCAL_HOSTS = {"127.0.0.1", "localhost", "::1"}


@app.before_request
def local_guard():
    if not LOCAL_MODE:
        return None
    host = urlparse("//" + (request.host or "")).hostname
    if host not in _LOCAL_HOSTS:
        return jsonify(error="Open this app at http://127.0.0.1:" + os.environ.get("PORT", "5000")), 400
    origin = request.headers.get("Origin")
    if request.method not in ("GET", "HEAD", "OPTIONS") and origin and urlparse(origin).netloc != request.host:
        return jsonify(error="Blocked: this request came from another website."), 403
    return None


@app.after_request
def secure_headers(resp):
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["X-Frame-Options"] = "DENY"
    resp.headers["Referrer-Policy"] = "no-referrer"
    resp.headers["X-Robots-Tag"] = "noindex, nofollow"
    resp.headers["Cache-Control"] = "no-store"
    resp.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src https://fonts.gstatic.com; img-src 'self' https: data:; "
        "connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
    )
    return resp


def is_valid(url):
    try:
        p = urlparse(url)
    except ValueError:
        return False
    return p.scheme in ("http", "https") and p.hostname in ALLOWED_HOSTS


# ---------------- Auth ----------------
@app.get("/login")
def login_page():
    if NO_LOGIN or session.get("ok"):
        return redirect(URL_PREFIX + "/")
    return send_from_directory(BASE, "login.html")


@app.post("/login")
def login():
    if NO_LOGIN:
        return jsonify(error="No login is needed."), 404
    ip = request.remote_addr or "unknown"
    wait = locked_for(ip)
    if wait:
        return jsonify(error=f"Too many attempts. Try again in {wait // 60 + 1} min."), 429
    given = str((request.get_json(silent=True) or {}).get("password", ""))
    if hmac.compare_digest(given.encode(), APP_PASSWORD.encode()):
        with _fails_lock:
            _fails.pop(ip, None)
        session.clear()
        session.permanent = True
        session["ok"] = True
        return jsonify(ok=True)
    record_fail(ip)
    time.sleep(1)
    return jsonify(error="Wrong password."), 401


@app.post("/logout")
def logout():
    session.clear()
    return jsonify(ok=True)


@app.get("/")
@login_required()
def home():
    return send_from_directory(BASE, "index.html")


# ---------------- Video info (cached) ----------------
BASE_OPTS = {
    "quiet": True,
    "no_warnings": False,  # keep warnings: they explain slow/throttled downloads
    "noplaylist": True,
    "noprogress": True,
    "retries": 10,
    "fragment_retries": 10,
    "socket_timeout": 20,
    "concurrent_fragment_downloads": 4,
    "http_chunk_size": 10 * 1024 * 1024,  # avoids YouTube throttling
}
# yt-dlp needs a JavaScript runtime to solve YouTube's challenges.
# Its default is only deno, so also enable node if it is installed.
_runtimes = {n: {} for n in ("deno", "node") if shutil.which(n)}
if _runtimes:
    BASE_OPTS["js_runtimes"] = _runtimes
else:
    print("WARNING: no JavaScript runtime (deno/node) found - YouTube downloads will likely fail.", flush=True)
_info_cache, _info_lock = {}, threading.Lock()


# ---- Getting past YouTube's "confirm you're not a bot" block ----
# YouTube often refuses requests that come from a server/datacenter IP (Render,
# Railway, AWS ...). A phone or home PC is rarely blocked. If this app runs on a
# server, give yt-dlp one or both of these (see README.md):
#   YT_COOKIES / YT_COOKIES_FILE : cookies.txt exported from a signed-in browser
#   YT_PROXY                     : a proxy URL, ideally one with a home-type IP
def _load_cookies():
    path = os.environ.get("YT_COOKIES_FILE", "").strip()
    text = ""
    if path:
        try:
            with open(path, encoding="utf-8") as fh:
                text = fh.read()
        except OSError as e:
            print(f"WARNING: YT_COOKIES_FILE could not be read: {e.strerror}", flush=True)
    if not text:
        text = os.environ.get("YT_COOKIES", "").strip()
    if not text:
        return ""
    if "\t" not in text:  # not a raw cookies.txt, so try base64 (easier to paste into a host's env settings)
        try:
            text = base64.b64decode(text, validate=False).decode("utf-8")
        except Exception:
            print("WARNING: YT_COOKIES is neither a cookies.txt nor base64 of one. Ignoring it.", flush=True)
            return ""
    text = text.replace("\r\n", "\n").strip() + "\n"
    if "\t" not in text:
        print("WARNING: YT_COOKIES has no cookie lines. Ignoring it.", flush=True)
        return ""
    if not text.startswith(("# Netscape HTTP Cookie File", "# HTTP Cookie File")):
        text = "# Netscape HTTP Cookie File\n" + text  # yt-dlp rejects the file without this first line
    return text


COOKIES_TEXT = _load_cookies()
YT_PROXY = os.environ.get("YT_PROXY", "").strip()
if YT_PROXY:
    BASE_OPTS["proxy"] = YT_PROXY  # never printed: it may contain a password
print(f"[config] cookies: {'on' if COOKIES_TEXT else 'off'}, proxy: {'on' if YT_PROXY else 'off'}", flush=True)


@contextlib.contextmanager
def ydl_opts(extra=None):
    """yt-dlp options for ONE run. yt-dlp rewrites its cookie file when it
    finishes, so each run gets its own private copy (mode 0600) that is deleted
    afterwards; two downloads at once can then never corrupt each other."""
    opts = {**BASE_OPTS, **(extra or {})}
    tmp = None
    if COOKIES_TEXT:
        fd, tmp = tempfile.mkstemp(prefix="ytsaver_ck_", suffix=".txt")
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(COOKIES_TEXT)
        opts["cookiefile"] = tmp
    try:
        yield opts
    finally:
        if tmp:
            with contextlib.suppress(OSError):
                os.unlink(tmp)


def explain_error(e):
    """Turn a yt-dlp error into a message the user can act on. The raw error
    always goes to the server log."""
    print("yt-dlp error:", e, flush=True)
    t = str(e).lower()
    if "over limits" in t:
        return (f"This video is over the free limits (up to {MAX_MINUTES} minutes and {MAX_FILE_MB} MB). "
                "Try a lower quality or a shorter video.")
    # Order matters: several of these messages also contain the words "sign in".
    if "private video" in t:
        return "This video is private."
    if "video unavailable" in t or "not available" in t:
        return "This video is unavailable (removed, region-locked, or members-only)."
    if "confirm your age" in t or "age-restricted" in t or "age restricted" in t:
        return ("This video is age-restricted, so it needs cookies from a signed-in YouTube account "
                "(YT_COOKIES, see README.md).")
    if "not a bot" in t or "sign in" in t:
        if COOKIES_TEXT:
            return ("YouTube still asks to sign in, so the saved cookies look expired. "
                    "Export fresh cookies (README, step 'Cookies') and update YT_COOKIES.")
        if LOCAL_MODE:
            return ("YouTube is asking this network to prove it is not a bot. Wait a few minutes and try again, "
                    "or switch network (for example your phone's mobile hotspot instead of shared Wi-Fi). "
                    "If it keeps happening, add cookies (see README.md).")
        return ("YouTube is blocking this server's IP (it asks to prove you're not a bot). "
                "Fix: add cookies (YT_COOKIES), use a proxy (YT_PROXY), or run this app on your phone/PC. See README.md.")
    if "ffmpeg" in t or "ffprobe" in t:
        return ("ffmpeg is missing (it joins the video and audio). Install it, then restart this app. "
                "Steps for your device: https://www.arvish.xyz/apps/yt-saver")
    if "429" in t or "too many requests" in t:
        return "YouTube is rate-limiting this server. Wait a few minutes and try again."
    if "failed to resolve" in t or "name or service not known" in t or "timed out" in t or "connection refused" in t:
        return "The server couldn't reach YouTube (network problem" + (", or the YT_PROXY is down" if YT_PROXY else "") + "). Try again."
    if "no space" in t:
        return "Server storage is full."
    if "403" in t:
        return ("YouTube refused the download (403). Update yt-dlp, and if it keeps happening "
                "see the IP-block fix in README.md.")
    return None


def size_of(f):
    return f.get("filesize") or f.get("filesize_approx") or 0


@app.post("/api/info")
@login_required(api=True)
def info():
    url = (request.get_json(silent=True) or {}).get("url", "").strip()
    if not is_valid(url):
        return jsonify(error="Paste a valid YouTube link."), 400

    with _info_lock:
        hit = _info_cache.get(url)
    if hit and time.time() - hit[0] < 600:
        return jsonify(hit[1])  # cached look-ups never touch YouTube, so they are not counted

    if not rate_ok(client_ip(), "info", INFO_PER_HOUR):
        return jsonify(error="Too many look-ups from your network. Please try again in a while."), 429

    t_info = time.time()
    try:
        with ydl_opts({"skip_download": True}) as o, yt_dlp.YoutubeDL(o) as ydl:
            d = ydl.extract_info(url, download=False)
        print(f"[timing] info extraction took {time.time() - t_info:.1f}s", flush=True)
    except Exception as e:
        msg = explain_error(e)
        return jsonify(error=msg or "Couldn't read this video. It may be private, or yt-dlp needs an update."), 422

    if PUBLIC_MODE:
        if d.get("is_live") or d.get("live_status") in ("is_live", "is_upcoming"):
            return jsonify(error="Live streams can't be saved."), 422
        if (d.get("duration") or 0) > MAX_MINUTES * 60:
            return jsonify(error=f"This video is longer than the free limit of {MAX_MINUTES} minutes."), 422

    formats = d.get("formats", [])
    audio_size = max(
        [size_of(f) for f in formats if f.get("vcodec") == "none" and f.get("acodec") != "none"] or [0]
    )
    sizes = {}
    for f in formats:
        h = f.get("height")
        if h and h <= MAX_HEIGHT and f.get("vcodec") not in (None, "none"):
            sizes[h] = max(sizes.get(h, 0), size_of(f))

    data = dict(
        title=d.get("title", "Untitled"),
        channel=d.get("uploader", ""),
        thumbnail=d.get("thumbnail", ""),
        duration=d.get("duration") or 0,
        qualities=[
            {"height": h, "size": (s + audio_size) if s else 0}
            for h, s in sorted(sizes.items(), reverse=True)  # highest first
        ],
        audio_size=audio_size,
    )
    with _info_lock:
        if len(_info_cache) > 50:
            _info_cache.clear()
        _info_cache[url] = (time.time(), data)
    return jsonify(data)


# ---------------- Download jobs (background + progress) ----------------
JOBS, JOBS_LOCK = {}, threading.Lock()
_slots = threading.BoundedSemaphore(2)
JOB_TTL = 30 * 60


def video_format(h):
    # Prefer H.264/AAC (plays on every phone, merges without re-encoding = fast).
    return (
        f"bv*[height={h}][vcodec^=avc1]+ba[ext=m4a]/"
        f"bv*[height={h}][ext=mp4]+ba[ext=m4a]/"
        f"bv*[height={h}]+ba[ext=m4a]/bv*[height={h}]+ba/b[height={h}]/"
        f"bv*[height<={h}]+ba/b"
    )


def friendly_error(e):
    return explain_error(e) or "Download failed. Update yt-dlp (pip install -U yt-dlp), then try again."


def run_job(job, release_slot=True):
    streams = {}
    t0 = time.time()
    last_speed = {"v": 0}

    def hook(d):
        if job["cancel"]:
            raise yt_dlp.utils.DownloadCancelled()
        key = d.get("filename")
        if d["status"] == "downloading":
            streams[key] = (d.get("downloaded_bytes") or 0, d.get("total_bytes") or d.get("total_bytes_estimate") or 0)
            done = sum(v[0] for v in streams.values())
            if MAX_FILE_MB and done > MAX_FILE_MB * 1048576:  # sizes YouTube didn't announce can't be checked earlier
                job["limit_hit"] = True
                raise yt_dlp.utils.DownloadCancelled()
            total = job["expected"] or sum(v[1] for v in streams.values())
            if total:
                job["percent"] = min(99.0, done * 100.0 / total)
            job["speed"] = d.get("speed") or 0
            last_speed["v"] = job["speed"] or last_speed["v"]
            job["eta"] = d.get("eta")
        elif d["status"] == "finished":
            n = d.get("downloaded_bytes") or d.get("total_bytes") or 0
            streams[key] = (n, n)
            print(f"[timing] stream finished at +{time.time() - t0:.1f}s: {n / 1048576:.1f} MiB, "
                  f"last speed {last_speed['v'] / 1048576:.2f} MiB/s", flush=True)

    def pp_hook(d):
        print(f"[timing] {d.get('postprocessor')} {d['status']} at +{time.time() - t0:.1f}s", flush=True)
        if d["status"] == "started":
            job["state"], job["speed"], job["eta"] = "merging", 0, None

    extra = {
        "outtmpl": os.path.join(job["dir"], "%(title).80s.%(ext)s"),
        "progress_hooks": [hook],
        "postprocessor_hooks": [pp_hook],
    }
    if job["quality"] == "audio":
        extra["format"] = "bestaudio[ext=m4a]/bestaudio"  # no conversion = fast
    else:
        extra["format"] = video_format(int(job["quality"]))
        extra["merge_output_format"] = "mp4"
    if PUBLIC_MODE:  # the limits are enforced here too, because /api/start can be called without /api/info
        extra["max_filesize"] = MAX_FILE_MB * 1048576
        extra["match_filter"] = yt_dlp.utils.match_filter_func(f"duration <= {MAX_MINUTES * 60} & !is_live")

    job["state"] = "downloading"
    try:
        with ydl_opts(extra) as opts, yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([job["url"]])
        files = [f for f in glob.glob(os.path.join(job["dir"], "*")) if not f.endswith((".part", ".ytdl"))]
        if not files:  # yt-dlp skips a video that fails the filter without raising an error
            raise RuntimeError("over limits" if PUBLIC_MODE else "no file produced")
        path = max(files, key=os.path.getsize)
        job.update(path=path, filename=os.path.basename(path), percent=100.0, state="done", created=time.time())
        print(f"[timing] job done at +{time.time() - t0:.1f}s, file {os.path.getsize(path) / 1048576:.1f} MiB", flush=True)
    except Exception as e:
        if job.get("limit_hit"):
            job.update(state="error", error=friendly_error(RuntimeError("over limits")))
        elif job["cancel"]:
            job["state"] = "cancelled"
        else:
            job.update(state="error", error=friendly_error(e))
        shutil.rmtree(job["dir"], ignore_errors=True)
    finally:
        if release_slot:
            _slots.release()
        ip_release(job.get("ip"))


def valid_quality(q):
    return q == "audio" or (q.isdigit() and 100 <= int(q) <= MAX_HEIGHT)


def make_job(url, quality, expected=0, ip=""):
    jid = secrets.token_urlsafe(12)
    return dict(
        id=jid, url=url, quality=quality, state="queued", percent=0.0, speed=0, eta=None,
        error="", path="", filename="", cancel=False, created=time.time(),
        expected=expected, dir=tempfile.mkdtemp(prefix="ytsaver_"), ip=ip, limit_hit=False,
    )


@app.post("/api/start")
@login_required(api=True)
def start():
    body = request.get_json(silent=True) or {}
    url, quality = str(body.get("url", "")).strip(), str(body.get("quality", ""))
    if not is_valid(url):
        return jsonify(error="Invalid link."), 400
    if not valid_quality(quality):
        return jsonify(error="Invalid quality."), 400
    ip = client_ip()
    # Order matters: count a visitor's hourly quota only once the download can really start.
    if not _slots.acquire(blocking=False):
        return jsonify(error="The server is busy with other downloads. Please try again in a minute."
                       if PUBLIC_MODE else "Two downloads are already running. Wait for one to finish."), 429
    if not ip_acquire(ip):
        _slots.release()
        return jsonify(error="You already have a download running. Wait for it to finish."), 429
    if not rate_ok(ip, "start", PER_HOUR):
        ip_release(ip)
        _slots.release()
        return jsonify(error=f"Free limit reached: {PER_HOUR} saves per hour. Please try again later."), 429

    try:
        expected = int(body.get("expected") or 0) if str(body.get("expected") or "0").isdigit() else 0
        job = make_job(url, quality, expected, ip)
        jid = job["id"]
        with JOBS_LOCK:
            JOBS[jid] = job
        threading.Thread(target=run_job, args=(job,), daemon=True).start()
    except Exception:
        ip_release(ip)
        _slots.release()
        raise
    return jsonify(id=jid)


# ---------------- Playlists ----------------
PL_MAX = 100  # max videos per playlist (protects the phone's storage and time)
VID_RE = re.compile(r"[A-Za-z0-9_-]{11}")
LIST_RE = re.compile(r"[A-Za-z0-9_-]{10,64}")
_pl_cache, _pl_lock = {}, threading.Lock()


@app.post("/api/playlist")
@login_required(api=True)
def playlist():
    if PUBLIC_MODE:
        return jsonify(error="Playlists are not available in the free version."), 403
    url = str((request.get_json(silent=True) or {}).get("url", "")).strip()
    if not is_valid(url):
        return jsonify(error="Paste a valid YouTube link."), 400
    lid = (parse_qs(urlparse(url).query).get("list") or [""])[0]
    if not LIST_RE.fullmatch(lid):
        return jsonify(error="No playlist found in this link."), 400

    with _pl_lock:
        hit = _pl_cache.get(lid)
    if hit and time.time() - hit[0] < 600:
        return jsonify(hit[1])

    extra = {"skip_download": True, "noplaylist": False, "extract_flat": "in_playlist",
             "playlistend": PL_MAX, "ignoreerrors": True}
    t0 = time.time()
    d, msg = None, None
    try:
        with ydl_opts(extra) as opts, yt_dlp.YoutubeDL(opts) as ydl:
            d = ydl.extract_info(f"https://www.youtube.com/playlist?list={lid}", download=False)
    except Exception as e:
        msg = explain_error(e)
    if not d:
        return jsonify(error=msg or "Couldn't read this playlist. It may be private, or yt-dlp needs an update."), 422
    print(f"[timing] playlist listing took {time.time() - t0:.1f}s", flush=True)

    videos = []
    for e in d.get("entries") or []:
        if not e:
            continue
        vid, title = str(e.get("id") or ""), str(e.get("title") or "")
        if not VID_RE.fullmatch(vid) or title in ("[Private video]", "[Deleted video]"):
            continue  # skip unavailable entries
        videos.append(dict(id=vid, title=title or vid, duration=e.get("duration") or 0,
                           thumb=f"https://i.ytimg.com/vi/{vid}/mqdefault.jpg"))
    if not videos:
        return jsonify(error="This playlist has no downloadable videos."), 422
    total = d.get("playlist_count") or len(videos)
    data = dict(title=d.get("title") or "Playlist", channel=d.get("uploader") or d.get("channel") or "",
                videos=videos, total=total, truncated=total > len(videos) and len(videos) >= PL_MAX)
    with _pl_lock:
        if len(_pl_cache) > 20:
            _pl_cache.clear()
        _pl_cache[lid] = (time.time(), data)
    return jsonify(data)


BATCHES = {}


def run_batch(batch):
    try:
        for item in batch["items"]:
            if batch["cancel"]:
                item["state"] = "cancelled"
                continue
            job = make_job(item["url"], item["quality"])
            job["cancel"] = batch["cancel"]
            item["jid"] = job["id"]
            with JOBS_LOCK:
                JOBS[job["id"]] = job
            run_job(job, release_slot=False)  # one video at a time
    finally:
        batch["state"] = "cancelled" if batch["cancel"] else "done"
        _slots.release()


@app.post("/api/batch/start")
@login_required(api=True)
def batch_start():
    if PUBLIC_MODE:
        return jsonify(error="Playlists are not available in the free version."), 403
    raw = (request.get_json(silent=True) or {}).get("items")
    if not isinstance(raw, list) or not raw or len(raw) > PL_MAX:
        return jsonify(error=f"Choose between 1 and {PL_MAX} videos."), 400
    items = []
    for r in raw:
        r = r if isinstance(r, dict) else {}
        vid, quality = str(r.get("id", "")), str(r.get("quality", ""))
        if not VID_RE.fullmatch(vid) or not valid_quality(quality):
            return jsonify(error="Invalid video or quality."), 400
        items.append(dict(url=f"https://www.youtube.com/watch?v={vid}", quality=quality,
                          title=str(r.get("title", ""))[:200], jid="", state="waiting"))
    if not _slots.acquire(blocking=False):
        return jsonify(error="Two downloads are already running. Wait for one to finish."), 429
    bid = secrets.token_urlsafe(12)
    batch = dict(id=bid, items=items, state="running", cancel=False, created=time.time())
    BATCHES[bid] = batch
    threading.Thread(target=run_batch, args=(batch,), daemon=True).start()
    return jsonify(id=bid)


@app.get("/api/batch/<bid>")
@login_required(api=True)
def batch_status(bid):
    batch = BATCHES.get(bid)
    if not batch:
        return jsonify(error="Batch expired. Start again."), 404
    out = []
    for it in batch["items"]:
        row = dict(title=it["title"], jid=it["jid"], state=it["state"], percent=0, speed=0, eta=None,
                   error="", filename="")
        if it["jid"]:
            job = JOBS.get(it["jid"])
            if job:
                row.update(state=job["state"], percent=round(job["percent"], 1), speed=job["speed"],
                           eta=job["eta"], error=job["error"], filename=job["filename"])
            else:
                row["state"] = "expired"
        out.append(row)
    return jsonify(state=batch["state"], items=out)


@app.post("/api/batch/<bid>/cancel")
@login_required(api=True)
def batch_cancel(bid):
    batch = BATCHES.get(bid)
    if batch:
        batch["cancel"] = True
        for it in batch["items"]:
            job = JOBS.get(it["jid"]) if it["jid"] else None
            if job and job["state"] in ("queued", "downloading", "merging"):
                job["cancel"] = True
    return jsonify(ok=True)


@app.get("/api/config")
@login_required(api=True)
def config():
    """What the page needs to know to show the right buttons and limits."""
    return jsonify(public=PUBLIC_MODE, login=not NO_LOGIN, max_height=MAX_HEIGHT, max_minutes=MAX_MINUTES,
                   max_file_mb=MAX_FILE_MB, per_hour=PER_HOUR)


@app.get("/api/health")
@login_required(api=True)
def health():
    """How the server is set up (no secrets, only on/off). In private mode: log in, then open it.
    In public mode it is hidden unless ADMIN_KEY is set and given as /api/health?key=...
    `your_ip` is the address the app thinks you have. If it is not your real address, PROXY_HOPS is wrong."""
    admin_key = os.environ.get("ADMIN_KEY", "")
    if PUBLIC_MODE and not (admin_key and hmac.compare_digest(request.args.get("key", ""), admin_key)):
        return jsonify(error="Not found."), 404
    return jsonify(
        mode="public" if PUBLIC_MODE else ("local" if LOCAL_MODE else "private"),
        yt_dlp=yt_dlp.version.__version__,
        js_runtimes=sorted(_runtimes),
        ffmpeg=bool(shutil.which("ffmpeg")),
        cookies="on" if COOKIES_TEXT else "off",
        proxy="on" if YT_PROXY else "off",
        your_ip=client_ip(),
        proxy_hops=PROXY_HOPS if os.environ.get("BEHIND_PROXY") == "1" else 0,
    )


@app.get("/api/status/<jid>")
@login_required(api=True)
def status(jid):
    job = JOBS.get(jid)
    if not job:
        return jsonify(error="Job expired. Start again."), 404
    return jsonify(state=job["state"], percent=round(job["percent"], 1), speed=job["speed"],
                   eta=job["eta"], error=job["error"], filename=job["filename"])


@app.post("/api/cancel/<jid>")
@login_required(api=True)
def cancel(jid):
    job = JOBS.get(jid)
    if job:
        job["cancel"] = True
    return jsonify(ok=True)


@app.get("/api/file/<jid>")
@login_required(api=True)
def get_file(jid):
    job = JOBS.get(jid)
    if not job or job["state"] != "done" or not os.path.exists(job["path"]):
        return jsonify(error="File not ready or expired."), 404
    return send_file(job["path"], as_attachment=True, download_name=job["filename"], conditional=True)


def janitor():
    while True:
        time.sleep(60)
        now = time.time()
        with JOBS_LOCK:
            for jid in [j for j, v in JOBS.items()
                        if now - v["created"] > JOB_TTL and v["state"] not in ("queued", "downloading", "merging")]:
                shutil.rmtree(JOBS[jid]["dir"], ignore_errors=True)
                JOBS.pop(jid, None)
            for bid in [b for b, v in BATCHES.items() if v["state"] != "running" and now - v["created"] > 6 * 3600]:
                BATCHES.pop(bid, None)
        with _hits_lock:  # forget visitors who have not done anything for an hour
            for key in [k for k, ts in _hits.items() if not ts or now - ts[-1] > 3600]:
                _hits.pop(key, None)


threading.Thread(target=janitor, daemon=True).start()

if __name__ == "__main__":
    _host, _port = os.environ.get("HOST", "127.0.0.1"), int(os.environ.get("PORT", "5000"))
    print(f"\nYT Saver is running. Open this in your browser:  http://127.0.0.1:{_port}\n"
          "(Press Ctrl+C in this window to stop it.)\n", flush=True)
    app.run(host=_host, port=_port, debug=False, threaded=True)
