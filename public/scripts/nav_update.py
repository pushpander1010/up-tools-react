import os, re

root = "/Users/pushpanderkumar/websites/uptools"
NEW_NAV = (
'<header class="site" role="banner">\n'
'<div class="header-inner">\n'
'<a aria-label="UpTools Home" class="brand" href="/">\n'
'<img alt="UpTools logo" height="28" loading="eager" src="/assets/logo/uptools-logo.svg" width="28"/>\n'
'<b>UpTools</b>\n'
'</a>\n'
'<nav aria-label="Primary" class="nav-links">\n'
'<a href="/" class="nav-home">Home</a>\n'
'<a href="/games/" class="nav-games">Games</a>\n'
'<button class="more-btn" aria-expanded="false" aria-haspopup="true">Tools <span class="arrow">\u25bc</span></button>\n'
'<div class="more-menu" role="menu">\n'
'<a role="menuitem" href="/#tools">All Tools</a>\n'
'<a role="menuitem" href="/income-tax-tool/">Income Tax</a>\n'
'<a role="menuitem" href="/emi-calculator/">EMI</a>\n'
'<a role="menuitem" href="/gst-calculator/">GST</a>\n'
'<a role="menuitem" href="/ai-tools/">AI Tools</a>\n'
'<a role="menuitem" href="/about/">About</a>\n'
'<a role="menuitem" href="/contact/">Contact</a>\n'
'</div>\n'
'</nav>\n'
'</div>\n'
'</header>'
)

pat = re.compile(r'<header\b[^>]*>.*?</header>', re.S)

changed = 0
skipped = 0
for dp, dn, fn in os.walk(root):
    if any(x in dp for x in ["/node_modules", "/dist", "/.git", "/worker", "/scripts"]):
        continue
    for f in fn:
        if f != "index.html":
            continue
        p = os.path.join(dp, f)
        s = open(p, encoding="utf-8", errors="replace").read()
        if '<nav aria-label="Primary" class="nav-links">' not in s:
            continue
        m = pat.search(s)
        if not m:
            skipped += 1
            continue
        header = m.group(0)
        if "more-menu" not in header:
            skipped += 1
            continue
        new_s = s[:m.start()] + NEW_NAV + s[m.end():]
        open(p, "w", encoding="utf-8").write(new_s)
        changed += 1

print("changed:", changed, "skipped:", skipped)
