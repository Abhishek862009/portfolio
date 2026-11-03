#!/usr/bin/env python3
"""Builds public/downloads/yt-saver.zip, the file people download from the YT Saver page.

Run it again whenever something in /yt-saver changes, and commit the new zip:

    python3 scripts/make-yt-saver-zip.py            # write the zip
    python3 scripts/make-yt-saver-zip.py --check    # exit 1 if the committed zip is out of date

Only the files listed below go in. They sit at the top of the zip (no extra folder) because the
setup guide unzips with "-d yt-saver" / "-DestinationPath yt-saver". Dockerfile and start.sh stay
out: the guide does not use them. The zip is built reproducibly (same files, same bytes) so that
--check can compare it.
"""
import io
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "yt-saver"
OUT = ROOT / "public" / "downloads" / "yt-saver.zip"
FILES = ["README.md", "app.py", "index.html", "login.html", "requirements.txt"]
FIXED_TIME = (2026, 1, 1, 0, 0, 0)  # zip cannot hold a date before 1980; a fixed one keeps the bytes stable


def build() -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name in sorted(FILES):
            path = SRC / name
            if not path.is_file():
                sys.exit(f"Missing {path}")
            data = path.read_bytes().replace(b"\r\n", b"\n")  # same bytes whichever OS builds it
            info = zipfile.ZipInfo(name, FIXED_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            info.create_system = 3  # "Unix", so the permission bits above are honoured
            z.writestr(info, data)
    return buf.getvalue()


def main() -> None:
    data = build()
    if "--check" in sys.argv:
        if not OUT.is_file() or OUT.read_bytes() != data:
            print(f"{OUT.relative_to(ROOT)} is out of date. Run: python3 scripts/make-yt-saver-zip.py")
            sys.exit(1)
        print("yt-saver.zip is up to date.")
        return
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(data)
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(data):,} bytes, {len(FILES)} files)")


if __name__ == "__main__":
    main()
