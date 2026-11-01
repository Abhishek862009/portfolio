#!/data/data/com.termux/files/usr/bin/bash
# Run with:  bash start.sh
# First run installs everything it needs. Later runs just update yt-dlp and start.
cd "$(dirname "$0")"
termux-wake-lock 2>/dev/null

# System tools: ffmpeg (merging video+audio) and nodejs (JS runtime yt-dlp needs for YouTube)
for tool in python:python ffmpeg:ffmpeg node:nodejs; do
  cmd="${tool%%:*}"; pkgname="${tool##*:}"
  command -v "$cmd" >/dev/null 2>&1 || pkg install -y "$pkgname" || { echo "Could not install $pkgname"; exit 1; }
done

# Python libraries (flask, gunicorn, yt-dlp[default]); -U keeps yt-dlp current
pip install -q -U -r requirements.txt || { echo "pip install failed"; exit 1; }

echo "Open http://127.0.0.1:${PORT:-5000} in your browser"
python app.py
