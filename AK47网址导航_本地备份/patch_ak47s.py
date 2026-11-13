import os
import re

ROOT = "ak47s_backup"

# 1. Remove temporary raw_index.html if exists
raw_idx = os.path.join(ROOT, "raw_index.html")
if os.path.exists(raw_idx):
    os.remove(raw_idx)

# 2. Neutralize tracking & shutdown notice scripts
for rel in ["js/tongji.js", "more/js/tongji.js", "js/upgrade-notice.js", "js/bookmark-migrate.js"]:
    p = os.path.join(ROOT, rel.replace("/", os.sep))
    if os.path.exists(p):
        with open(p, "w", encoding="utf-8") as f:
            f.write("/* removed tracking / shutdown notice */")

def strip_upgrade_and_tongji(html):
    # Remove upgrade notice comment + script tags
    html = re.sub(r'\s*<!--\s*site upgrade notice:.*?-->', '', html, flags=re.I)
    html = re.sub(r'''\s*<script[^>]*src=["'][^"']*(?:upgrade-notice|bookmark-migrate|tongji)\.js[^"']*["'][^>]*>\s*</script>''', '', html, flags=re.I)
    html = re.sub(r'''\s*<link[^>]*rel=["']canonical["'][^>]*>''', '', html, flags=re.I)
    html = html.replace(
        'content="AK47网址导航已升级为没节操导航（meijiecao.com），新站已完成备案、国内高速访问；本站清爽无广告无弹窗，将继续保持服务一段时间。"',
        'content="AK47网址导航 - 清爽绿色无广告，上网从这里开始"'
    )
    return html

# 3. Patch root index.html
idx_path = os.path.join(ROOT, "index.html")
with open(idx_path, "r", encoding="utf-8") as f:
    idx_html = f.read()

idx_html = strip_upgrade_and_tongji(idx_html)
# Fix local paths so file:// and subdirectory hosting both work
idx_html = idx_html.replace('src="../img/newimg/goofish.svg"', 'src="./img/newimg/goofish.svg"')
idx_html = idx_html.replace('href="/more/moyu.html"', 'href="./more/moyu.html"')
idx_html = idx_html.replace('href="/note/"', 'href="./note/index.html"')
idx_html = idx_html.replace('href="/so/"', 'href="./so/index.html"')
idx_html = idx_html.replace('href="./posts/#/faq"', 'href="./posts/index.html#/faq"')
idx_html = idx_html.replace('href="/posts/#/faq"', 'href="./posts/index.html#/faq"')
idx_html = idx_html.replace('href="/posts/#/tutorial"', 'href="./posts/index.html#/tutorial"')
idx_html = idx_html.replace('href="/posts/#/"', 'href="./posts/index.html#/"')
idx_html = idx_html.replace('src="https://g.alicdn.com/code/lib/jquery/3.6.0/jquery.min.js"', 'src="./js/jquery.min.js"')

with open(idx_path, "w", encoding="utf-8") as f:
    f.write(idx_html)
print("[OK] Patched index.html")

# 4. Patch go.html
go_path = os.path.join(ROOT, "go.html")
if os.path.exists(go_path):
    with open(go_path, "r", encoding="utf-8") as f:
        go_html = f.read()
    go_html = strip_upgrade_and_tongji(go_html)
    with open(go_path, "w", encoding="utf-8") as f:
        f.write(go_html)
    print("[OK] Patched go.html")

# 5. Patch more/*.html
more_dir = os.path.join(ROOT, "more")
more_count = 0
for fname in os.listdir(more_dir):
    if not fname.endswith(".html"):
        continue
    fpath = os.path.join(more_dir, fname)
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        h = f.read()
    h = strip_upgrade_and_tongji(h)
    h = h.replace(
        "https://npm.elemecdn.com/lxgw-wenkai-screen-webfont/style.css",
        "https://registry.npmmirror.com/lxgw-wenkai-screen-web/latest/files/style.css"
    )
    h = h.replace(
        "https://g.alicdn.com/code/lib/twitter-bootstrap/3.3.7/css/bootstrap.min.css",
        "./css/lib/bootstrap.min.css"
    )
    h = h.replace(
        "https://g.alicdn.com/code/lib/twitter-bootstrap/4.4.1/css/bootstrap-grid.min.css",
        "./css/lib/bootstrap-grid.min.css"
    )
    h = h.replace(
        "https://g.alicdn.com/code/lib/jquery/1.12.4/jquery.min.js",
        "./js/lib/jquery.min.js"
    )
    h = h.replace(
        "https://g.alicdn.com/code/lib/twitter-bootstrap/3.3.7/js/bootstrap.min.js",
        "./js/lib/bootstrap.min.js"
    )
    h = h.replace('href="/posts/#/faq"', 'href="../posts/index.html#/faq"')
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(h)
    more_count += 1
print(f"[OK] Patched {more_count} files in more/*.html")

# 6. Patch so/index.html and so/js/keyword.js
so_idx = os.path.join(ROOT, "so", "index.html")
if os.path.exists(so_idx):
    with open(so_idx, "r", encoding="utf-8") as f:
        sh = f.read()
    sh = strip_upgrade_and_tongji(sh)
    sh = sh.replace('href="https://www.ak47s.cn/"', 'href="../index.html"')
    with open(so_idx, "w", encoding="utf-8") as f:
        f.write(sh)

so_kw = os.path.join(ROOT, "so", "js", "keyword.js")
if os.path.exists(so_kw):
    with open(so_kw, "r", encoding="utf-8") as f:
        kw = f.read()
    kw = kw.replace("images/searchChoice/", "picture/")
    with open(so_kw, "w", encoding="utf-8") as f:
        f.write(kw)
print("[OK] Patched so/index.html and so/js/keyword.js")

# 7. Patch note/index.html
note_idx = os.path.join(ROOT, "note", "index.html")
if os.path.exists(note_idx):
    with open(note_idx, "r", encoding="utf-8") as f:
        nh = f.read()
    nh = strip_upgrade_and_tongji(nh)
    with open(note_idx, "w", encoding="utf-8") as f:
        f.write(nh)
print("[OK] Patched note/index.html")

# 8. Patch posts/index.html
posts_idx = os.path.join(ROOT, "posts", "index.html")
if os.path.exists(posts_idx):
    with open(posts_idx, "r", encoding="utf-8") as f:
        ph = f.read()
    ph = strip_upgrade_and_tongji(ph)
    ph = ph.replace(
        "https://npm.elemecdn.com/lxgw-wenkai-screen-webfont/style.css",
        "https://registry.npmmirror.com/lxgw-wenkai-screen-web/latest/files/style.css"
    )
    ph = ph.replace('href="/posts/#/"', 'href="#/"')
    ph = ph.replace('href="/posts/#/notify"', 'href="#/notify"')
    ph = ph.replace('basePath: "/posts/",', 'basePath: "./",')
    with open(posts_idx, "w", encoding="utf-8") as f:
        f.write(ph)
print("[OK] Patched posts/index.html")

# 9. Patch m/index.html, m/daohang/*.html, and m/js/site_search.js
m_idx = os.path.join(ROOT, "m", "index.html")
if os.path.exists(m_idx):
    with open(m_idx, "r", encoding="utf-8") as f:
        mh = f.read()
    mh = strip_upgrade_and_tongji(mh)
    with open(m_idx, "w", encoding="utf-8") as f:
        f.write(mh)

m_dh_dir = os.path.join(ROOT, "m", "daohang")
if os.path.exists(m_dh_dir):
    for fname in os.listdir(m_dh_dir):
        if fname.endswith(".html"):
            p = os.path.join(m_dh_dir, fname)
            with open(p, "r", encoding="utf-8", errors="ignore") as f:
                dh = f.read()
            dh = strip_upgrade_and_tongji(dh)
            with open(p, "w", encoding="utf-8") as f:
                f.write(dh)

for rel_ss in ["m/js/site_search.js", "m/daohang/js/site_search.js"]:
    p = os.path.join(ROOT, rel_ss.replace("/", os.sep))
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            ss = f.read()
        # Disable 50bang tracking
        ss = re.sub(r'allCount\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?return true;\s*\}', 'allCount:function(vUrl){ return true; }', ss)
        with open(p, "w", encoding="utf-8") as f:
            f.write(ss)
print("[OK] Patched m/ mobile pages and scripts")

# 10. Add font-family fallback in css/main.css and more/css/style.css
for css_rel in ["css/main.css", "more/css/style.css"]:
    p = os.path.join(ROOT, css_rel.replace("/", os.sep))
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            c = f.read()
        c = c.replace('font-family: "LXGW WenKai";', 'font-family: "LXGW WenKai Screen", "LXGW WenKai", "PingFang SC", "Microsoft YaHei", sans-serif;')
        with open(p, "w", encoding="utf-8") as f:
            f.write(c)
print("[OK] Updated CSS font fallbacks")
