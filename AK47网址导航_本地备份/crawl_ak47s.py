import os
import re
import urllib.request
import urllib.parse
import ssl
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://www.ak47s.cn/"
OUT_DIR = "ak47s_backup"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Referer": "https://www.ak47s.cn/"
}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        return resp.read(), resp.headers.get("Content-Type", "")

def normalize_site_path(base_url, ref):
    if not ref:
        return None
    ref = ref.strip()
    if ref.startswith(("javascript:", "mailto:", "tel:", "data:", "#")):
        return None
    full = urllib.parse.urljoin(base_url, ref)
    parsed = urllib.parse.urlparse(full)
    if parsed.netloc not in ("www.ak47s.cn", "ak47s.cn"):
        return None
    path = parsed.path
    if not path or path.endswith("/"):
        path = path + "index.html"
    return path.lstrip("/")

def extract_references(text, is_css=False):
    refs = set()
    # HTML src, href, data-src, background
    for m in re.finditer(r'''(?:src|href|background)\s*=\s*["']([^"']+)["']''', text, re.I):
        refs.add(m.group(1))
    # CSS url(...)
    for m in re.finditer(r'''url\(\s*["']?([^"')]+)["']?\s*\)''', text, re.I):
        refs.add(m.group(1))
    return refs

def main():
    visited = set()
    queue = {
        "index.html",
        "favicon.ico",
        "m/index.html",
        "so/index.html",
        "note/index.html",
        "posts/index.html",
    }

    os.makedirs(OUT_DIR, exist_ok=True)

    while queue:
        batch = list(queue - visited)
        if not batch:
            break
        for rel_path in batch:
            visited.add(rel_path)

        print(f"Downloading batch of {len(batch)} items...")
        new_refs = set()

        def download_one(rel_path):
            url = urllib.parse.urljoin(BASE_URL, rel_path)
            local_file = os.path.join(OUT_DIR, rel_path.replace("/", os.sep))
            os.makedirs(os.path.dirname(local_file), exist_ok=True)
            try:
                data, ctype = fetch_url(url)
                with open(local_file, "wb") as f:
                    f.write(data)
                return rel_path, url, data, ctype, None
            except Exception as e:
                return rel_path, url, None, None, str(e)

        with ThreadPoolExecutor(max_workers=12) as ex:
            futures = [ex.submit(download_one, p) for p in batch]
            for fut in as_completed(futures):
                rel_path, url, data, ctype, err = fut.result()
                if err:
                    print(f"  [FAIL] {rel_path}: {err}")
                    continue
                print(f"  [OK]   {rel_path} ({len(data)} bytes)")
                ext = os.path.splitext(rel_path)[1].lower()
                if ext in (".html", ".htm", ".css", ".js", ".json", ".md") or "text" in (ctype or ""):
                    try:
                        text = data.decode("utf-8", errors="ignore")
                        refs = extract_references(text, is_css=(ext == ".css"))
                        for r in refs:
                            norm = normalize_site_path(url, r)
                            if norm and norm not in visited:
                                new_refs.add(norm)
                    except Exception as e:
                        pass

        queue.update(new_refs - visited)

    print(f"Total visited: {len(visited)}")

if __name__ == "__main__":
    main()
