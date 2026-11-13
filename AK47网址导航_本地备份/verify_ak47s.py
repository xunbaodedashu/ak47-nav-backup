import os
import re

root = "ak47s_backup"
missing = []
root_abs = []

for dirpath, _, filenames in os.walk(root):
    for fn in filenames:
        if not fn.endswith((".html", ".css")):
            continue
        fp = os.path.join(dirpath, fn)
        txt = open(fp, encoding="utf-8", errors="ignore").read()
        refs = re.findall(r'''(?:src|href)\s*=\s*["']([^"']+)["']''', txt)
        refs += re.findall(r'''url\(\s*["']?([^"')]+)["']?\s*\)''', txt)
        for r in refs:
            r = r.strip()
            if not r or r.startswith(("http://", "https://", "javascript:", "mailto:", "tel:", "data:", "#")):
                continue
            if "${" in r or "+" in r or "Blob(" in r:
                continue
            if r.startswith("/"):
                root_abs.append((os.path.relpath(fp, root), r))
                continue
            clean = r.split("#")[0].split("?")[0]
            if not clean:
                continue
            target = os.path.normpath(os.path.join(dirpath, clean))
            if os.path.isdir(target):
                target = os.path.join(target, "index.html")
            if not os.path.exists(target):
                missing.append((os.path.relpath(fp, root), r))

print("Root-relative (leading /) links:", len(root_abs))
for item in root_abs[:20]:
    print("  [ABS]", item)

print("Missing relative files:", len(missing))
for item in missing[:30]:
    print("  [MISS]", item)
