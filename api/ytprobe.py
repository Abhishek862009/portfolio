"""TEMPORARY experiment: can yt-dlp reach YouTube from Vercel's servers?

Open  /api/ytprobe  (optionally ?v=<11-char video id>). It reports:
  - which public IP Vercel's function goes out from,
  - whether yt-dlp could read the video's info,
  - whether YouTube's video server actually hands out bytes to that IP,
  - whether Node.js exists in the function (yt-dlp needs a JS runtime for some formats).
It downloads nothing except the first 1 KB of one stream. Delete this branch afterwards.
"""
import json
import platform
import re
import shutil
import time
import urllib.request
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

DEFAULT_ID = "dQw4w9WgXcQ"


def egress_ip():
    try:
        with urllib.request.urlopen("https://api.ipify.org", timeout=8) as r:
            return r.read().decode().strip()
    except Exception as e:  # noqa: BLE001
        return f"unknown ({type(e).__name__})"


def probe(video_id):
    out = {
        "python": platform.python_version(),
        "node_in_function": shutil.which("node"),
        "ffmpeg_in_function": shutil.which("ffmpeg"),
        "egress_ip": egress_ip(),
        "video_id": video_id,
    }
    t0 = time.time()
    try:
        import yt_dlp
        from yt_dlp.version import __version__ as ver

        out["yt_dlp_version"] = ver
        warnings = []

        class Log:
            def debug(self, m): pass
            def info(self, m): pass
            def warning(self, m): warnings.append(str(m)[:200])
            def error(self, m): warnings.append("ERROR: " + str(m)[:300])

        opts = {
            "quiet": True, "no_warnings": False, "skip_download": True, "noplaylist": True,
            "cachedir": False, "socket_timeout": 20, "logger": Log(),
        }
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
        fmts = info.get("formats") or []
        with_url = [f for f in fmts if f.get("url") and f.get("protocol", "").startswith("http")]
        out["info"] = {
            "ok": True,
            "title": info.get("title"),
            "duration_s": info.get("duration"),
            "formats_total": len(fmts),
            "formats_with_direct_url": len(with_url),
            "max_height": max([f.get("height") or 0 for f in fmts] or [0]),
        }
        out["warnings"] = warnings[:6]
        # Does YouTube's media server give bytes to this IP? Ask for the first 1 KB only.
        if with_url:
            f = with_url[0]
            req = urllib.request.Request(f["url"], headers={**(f.get("http_headers") or {}), "Range": "bytes=0-1023"})
            try:
                with urllib.request.urlopen(req, timeout=20) as r:
                    out["media_fetch"] = {"status": r.status, "bytes": len(r.read())}
            except Exception as e:  # noqa: BLE001
                out["media_fetch"] = {"status": getattr(e, "code", None), "error": str(e)[:200]}
    except Exception as e:  # noqa: BLE001
        out["info"] = {"ok": False, "error_type": type(e).__name__, "error": str(e)[:500]}
    out["seconds"] = round(time.time() - t0, 1)
    return out


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        q = parse_qs(urlparse(self.path).query)
        vid = (q.get("v") or [DEFAULT_ID])[0]
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", vid):
            vid = DEFAULT_ID
        body = json.dumps(probe(vid), indent=2).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Robots-Tag", "noindex")
        self.end_headers()
        self.wfile.write(body)
