import os, re

root = "/Users/pushpanderkumar/websites/uptools"

NEW = (
'<nav aria-label="Primary" class="nav-links">\n'
'<a href="/" class="nav-home">Home</a>\n'
'<a href="/games/" class="nav-games">Games</a>\n'
'<button class="more-btn" aria-expanded="false" aria-haspopup="true">Tools <span class="arrow">\u25bc</span></button>\n'
'<div class="more-menu" role="menu">\n'
'<a role="menuitem" href="/#tools">All Tools</a>\n'
'<a role="menuitem" href="/income-tax-tool/">Income Tax</a>\n'
'<a role="menuitem" href="/emi-calculator/">EMI</a>\n'
'<a role="menuitem" href="/gst-calculator/">GST</a>\n'
'<a role="menuitem" href="/instagram-hashtag-generator/">IG Hashtags</a>\n'
'<a role="menuitem" href="/instagram-auditor/">IG Audit</a>\n'
'<a role="menuitem" href="/instagram-bio-generator/">IG Bio</a>\n'
'<a role="menuitem" href="/instagram-caption-generator/">IG Captions</a>\n'
'<a role="menuitem" href="/instagram-story-templates/">IG Stories</a>\n'
'<a role="menuitem" href="/ai-tools/">AI Tools</a>\n'
'<a role="menuitem" href="/about/">About</a>\n'
'<a role="menuitem" href="/contact/">Contact</a>\n'
'</div>\n'
'</nav>'
)

PAT = re.compile(r'<nav aria-label="Primary" class="nav-links">.*?</nav>', re.S)

for name in ["instagram-auditor", "instagram-caption-generator", "instagram-bio-generator", "instagram-story-templates"]:
    p = os.path.join(root, name, "index.html")
    s = open(p, encoding="utf-8", errors="replace").read()
    s2, n = PAT.subn(NEW, s, count=1)
    if n:
        open(p, "w", encoding="utf-8").write(s2)
        print("updated", name)
    else:
        print("skip", name)
