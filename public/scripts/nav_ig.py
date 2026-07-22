import os, re

root = "/Users/pushpanderkumar/websites/uptools"

# Variant A: IG pages with mobile-menu-toggle + flat nav, no more-menu
PAT_A = re.compile(
    r'<header class="site" role="banner">.*?</header>', re.S)

OLD_A = '''<nav aria-label="Primary" class="nav-links">
<a href="/#tools">Tools</a>
<a href="/income-tax-tool/">Income Tax</a>
<a href="/instagram-hashtag-generator/">IG Hashtags</a>
<a href="/instagram-auditor/">IG Audit</a>
<a href="/instagram-bio-generator/">IG Bio</a>
<a href="/instagram-caption-generator/">IG Captions</a>
<a href="/instagram-story-templates/">IG Stories</a>
<a href="/games/">Games</a>
<a href="/about/">About</a>
<a href="/contact/">Contact</a>'''

NEW_A = '''<nav aria-label="Primary" class="nav-links">
<a href="/" class="nav-home">Home</a>
<a href="/games/" class="nav-games">Games</a>
<button class="more-btn" aria-expanded="false" aria-haspopup="true">Tools <span class="arrow">\u25bc</span></button>
<div class="more-menu" role="menu">
<a role="menuitem" href="/#tools">All Tools</a>
<a role="menuitem" href="/income-tax-tool/">Income Tax</a>
<a role="menuitem" href="/instagram-hashtag-generator/">IG Hashtags</a>
<a role="menuitem" href="/instagram-auditor/">IG Audit</a>
<a role="menuitem" href="/instagram-bio-generator/">IG Bio</a>
<a role="menuitem" href="/instagram-caption-generator/">IG Captions</a>
<a role="menuitem" href="/instagram-story-templates/">IG Stories</a>
<a role="menuitem" href="/ai-tools/">AI Tools</a>
<a role="menuitem" href="/about/">About</a>
<a role="menuitem" href="/contact/">Contact</a>
</div>'''

IG_PAGES = [
    "instagram-username-generator",
    "instagram-auditor",
    "instagram-caption-generator",
    "instagram-bio-generator",
    "instagram-story-templates",
]

changed = 0
for name in IG_PAGES:
    p = os.path.join(root, name, "index.html")
    if not os.path.exists(p):
        print("MISSING", p); continue
    s = open(p, encoding="utf-8", errors="replace").read()
    if OLD_A in s and "more-menu" not in s:
        s = s.replace(OLD_A, NEW_A, 1)
        open(p, "w", encoding="utf-8").write(s)
        changed += 1
        print("updated", name)
    else:
        print("skip/no-match", name)

print("changed IG:", changed)
