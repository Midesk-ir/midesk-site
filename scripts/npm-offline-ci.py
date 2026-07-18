#!/usr/bin/env python3
"""Populate npm cache via Python (works when Node fetch is blocked)."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REGISTRY_MIRROR = os.environ.get("NPM_MIRROR", "https://registry.npmmirror.com")
WORKERS = int(os.environ.get("NPM_OFFLINE_WORKERS", "8"))


def mirror_url(resolved: str) -> str:
    return resolved.replace("https://registry.npmjs.org/", f"{REGISTRY_MIRROR}/")


def download_and_cache(url: str) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "midesk-offline-install/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = resp.read()
    tmp = tempfile.NamedTemporaryFile(suffix=".tgz", delete=False)
    try:
        tmp.write(data)
        tmp.close()
        subprocess.run(["npm", "cache", "add", tmp.name], check=True, capture_output=True)
    finally:
        os.unlink(tmp.name)


def main() -> int:
    lock_path = Path("package-lock.json")
    if not lock_path.exists():
        print("package-lock.json not found", file=sys.stderr)
        return 1

    lock = json.loads(lock_path.read_text())
    urls = sorted(
        {
            mirror_url(pkg["resolved"])
            for pkg in lock.get("packages", {}).values()
            if pkg.get("resolved")
        }
    )
    print(f"Downloading {len(urls)} packages via {REGISTRY_MIRROR} ...")

    failed: list[str] = []
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(download_and_cache, url): url for url in urls}
        done = 0
        for future in as_completed(futures):
            url = futures[future]
            done += 1
            try:
                future.result()
            except (urllib.error.URLError, subprocess.CalledProcessError) as exc:
                failed.append(f"{url}: {exc}")
            if done % 50 == 0 or done == len(urls):
                print(f"  cached {done}/{len(urls)}")

    if failed:
        print(f"Failed to cache {len(failed)} packages:", file=sys.stderr)
        for line in failed[:10]:
            print(f"  {line}", file=sys.stderr)
        return 1

    print("Running npm ci --prefer-offline ...")
    subprocess.run(["npm", "ci", "--prefer-offline"], check=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
