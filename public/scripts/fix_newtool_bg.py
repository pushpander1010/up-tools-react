#!/usr/bin/env python3
"""Fix white-on-white nav on the 11 launched tool pages.

Root cause: pages define --bg:#0f1419 and body uses background:var(--bg),
but the global style.css sets body background to a gradient using
--bg1/--bg2 (undefined on these pages) -> transparent -> white shows through,
and the .more-btn light-grey chip with light text becomes invisible.

Fix: (1) add --bg1/--bg2 to :root, (2) make the .site header use a solid
opaque dark background, (3) make .more-btn use an opaque dark bg + visible
text, (4) ensure html has the dark bg as a fallback.
"""
import os, glob

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLUGS = ["cgpa-calculator","character-counter","date-calculator","dice-roller",
         "electricity-bill-calculator","fuel-cost-calculator","gst-invoice-generator",
         "json-to-csv-converter","loan-comparison-calculator","passphrase-generator",
         "word-frequency-counter"]

ROOT = """    :root { --bg:#0f1419; --bg1:#0b1020; --bg2:#0f1419; --surface:#121826; --text:#e6edf3; --muted:#9aa4b2; --brand:#7aa2ff; --accent:#06b6d4; --radius:.75rem; --border:#212a3a }"""
BODY = """    html { background:#0f1419 } body { margin:0; font:400 16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif; background:var(--bg); color:var(--text) }"""
SITE = """    .site { position:sticky; top:0; z-index:20; background:#0d1320; backdrop-filter:blur(6px); border-bottom:1px solid #1a2236 }"""
MOREBTN = """    .more-btn { background:#1a2236; color:var(--text); border:1px solid var(--border); padding:.4rem .6rem; border-radius:.5rem; cursor:pointer; font:inherit; font-weight:700 }"""

OLD_ROOT = """    :root { --bg:#0f1419; --surface:#121826; --text:#e6edf3; --muted:#9aa4b2; --brand:#7aa2ff; --accent:#06b6d4; --radius:.75rem; --border:#212a3a }"""
OLD_BODY = """    body { margin:0; font:400 16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif; background:var(--bg); color:var(--text) }"""
OLD_SITE = """    .site { position:sticky; top:0; z-index:20; background:linear-gradient(180deg,var(--bg),var(--bg)f2 70%,transparent); backdrop-filter:blur(6px); border-bottom:1px solid #0f1a2a }"""

def patch(text):
    text = text.replace(OLD_ROOT, ROOT, 1)
    text = text.replace(OLD_BODY, BODY, 1)
    text = text.replace(OLD_SITE, SITE, 1)
    # ensure .more-btn rule exists; if present replace, else it's fine (not in these pages)
    if ".more-btn" not in text:
        # append after .nav-links a rule block by inserting before .note
        text = text.replace("    .note { color:var(--muted); font-size:.9rem }",
                            MOREBTN + "\n    .note { color:var(--muted); font-size:.9rem }", 1)
    return text

count = 0
for slug in SLUGS:
    for base in (os.path.join(REPO, slug), os.path.join(REPO, "dist", slug)):
        fp = os.path.join(base, "index.html")
        if os.path.exists(fp):
            with open(fp, encoding="utf-8") as f:
                t = f.read()
            t2 = patch(t)
            if t2 != t:
                with open(fp, "w", encoding="utf-8") as f:
                    f.write(t2)
                count += 1
                print("patched", fp)
# also patch the generator so future regen stays correct
gen = os.path.join(REPO, "scripts", "gen_new_tools.py")
if os.path.exists(gen):
    with open(gen, encoding="utf-8") as f:
        g = f.read()
    g = g.replace(OLD_ROOT, ROOT, 1).replace(OLD_BODY, BODY, 1).replace(OLD_SITE, SITE, 1)
    if ".more-btn" not in g:
        g = g.replace("    .note {{ color:var(--muted); font-size:.9rem }}",
                      MOREBTN.replace("    ","    ") + "\n    .note {{ color:var(--muted); font-size:.9rem }}", 1)
    with open(gen, "w", encoding="utf-8") as f:
        f.write(g)
    print("patched generator")
print("total files patched:", count)
