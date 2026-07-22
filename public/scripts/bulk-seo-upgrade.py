#!/usr/bin/env python3
"""
Bulk SEO Upgrade Tool for UpTools
===================================
Adds HowTo JSON-LD, Do's/Don'ts, visible HowTo sections, FAQ, and explainer
content to ALL tools that don't already have them.

Usage:
  python bulk-seo-upgrade.py              # Preview (dry-run)
  python bulk-seo-upgrade.py --apply      # Apply changes

Run from the uptools root directory or provide --root path.
"""
import os
import sys
import re
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────
SITE_URL = 'https://www.uptools.in'
SKIP_DIRS = {
    '.git', 'node_modules', 'dist', 'public', 'scripts', 'worker',
    'assets', 'about', 'contact', 'privacy-policy', 'games', 'de',
    'es', 'fr', '.wrangler', 'htmlcov', 'graphify-out', 'data',
    'src', 'templates'
}

# ── Template content ──────────────────────────────────────────────

def auto_howto(tool_name, tool_url, steps=None):
    """Generate HowTo JSON-LD."""
    if steps is None:
        steps = [
            f"Open {tool_name} at {tool_url}",
            "Enter your details in the provided fields",
            "Click Calculate to see results instantly",
        ]
    import json
    obj = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": f"How to Use {tool_name}",
        "description": f"Step-by-step guide to using {tool_name}.",
        "step": [
            {"@type": "HowToStep", "position": i+1, "name": s, "text": s}
            for i, s in enumerate(steps)
        ],
        "publisher": {"@type": "Organization", "name": "UpTools", "url": SITE_URL + "/"}
    }
    return f'\n<script type="application/ld+json">\n{json.dumps(obj, indent=2)}\n</script>'

HTML_DOS_DONTS = '''
<!-- SEO: Do's and Don'ts -->
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">✅ Do's and ❌ Don'ts</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div class="card" style="border-color:rgba(34,197,94,.3)">
<h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">✅ <b>Do</b> use this tool to save time on manual calculations.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> double-check your inputs for accuracy.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> share results with teammates using the Share feature.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> bookmark this tool for quick access.</li>
</ul>
</div>
<div class="card" style="border-color:rgba(239,68,68,.3)">
<h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">❌ <b>Don't</b> enter sensitive personal data — this tool doesn't store anything.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> use results as professional financial/legal/medical advice.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> forget to verify critical calculations with official tools.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> assume results are guarantees — they are estimates.</li>
</ul>
</div>
</div>
</section>'''

HTML_FAQ_GENERIC = '''
<!-- SEO: FAQ -->
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">Frequently Asked Questions</h2>
<details><summary><b>Is this tool free to use?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes. All UpTools calculators are completely free, with no sign-ups required.</p></details>
<details><summary><b>Is my data private?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes. All calculations run locally in your browser. Nothing is uploaded to any server.</p></details>
<details><summary><b>Does it work on mobile?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes. All tools are mobile-responsive and work on any device — phone, tablet, or desktop.</p></details>
<details><summary><b>Can I use this offline?</b></summary><p style="padding:6px 0;color:#9aa4b2">Most tools work offline after the initial page load. No internet needed for calculations.</p></details>
</section>'''

HTML_EXPLAINER = '''
<!-- SEO: How it works -->
<section class="card" style="margin-top:16px">
<details open>
<summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">📐 How This Tool Works</summary>
<div style="margin-top:8px;color:#9aa4b2">
<p>This tool computes results entirely in your browser using JavaScript. No data is sent to any server, ensuring your privacy.</p>
<p>Results update instantly as you type — no waiting for server responses.</p>
<p style="margin-top:8px">Also try: <a href="/calculator/">Calculator</a> · <a href="/converter/">Converter</a> · <a href="/generator/">Generator</a></p>
</div>
</details>
</section>'''


def get_tool_name_from_slug(slug):
    """Convert URL slug to a readable name."""
    return slug.replace('-', ' ').title()

def find_existing_howto(html):
    return '"HowTo"' in html or '"how-to"' in html.lower()

def find_existing_faq(html):
    return '"FAQPage"' in html

def find_existing_dos_donts(html):
    return "Do's and" in html or "Don'ts" in html

def find_existing_keywords(html):
    return 'name="keywords"' in html

def find_existing_breadcrumb(html):
    return '"BreadcrumbList"' in html

def upgrade_tool(filepath, dry_run=True):
    """Upgrade a single tool's index.html."""
    slug = filepath.parent.name
    tool_name = get_tool_name_from_slug(slug)
    tool_url = f"{SITE_URL}/{slug}/"

    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    changes = []

    # 1. Add keywords meta tag if missing
    if not find_existing_keywords(html):
        keywords = f"{slug.replace('-', ' ')}, {tool_name.lower()}, online tool, free calculator, uptools"
        html = html.replace(
            'content="index,follow',
            f'content="{keywords}" name="keywords"/>\n<meta content="index,follow'
        )
        changes.append('keywords meta')

    # 2. Add BreadcrumbList if missing
    if not find_existing_breadcrumb(html):
        breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/"},
                {"@type": "ListItem", "position": 2, "name": tool_name, "item": tool_url}
            ]
        }
        import json
        bc_script = f'\n<script type="application/ld+json">\n{json.dumps(breadcrumb)}\n</script>'
        first_ld_json = html.find('<script type="application/ld+json">')
        if first_ld_json > 0:
            html = html[:first_ld_json] + bc_script + '\n' + html[first_ld_json:]
            changes.append('breadcrumb JSON-LD')

    # 3. Add HowTo JSON-LD if missing
    if not find_existing_howto(html) and 'calculator' in slug.lower():
        howto_script = auto_howto(tool_name, tool_url)
        first_ld_json = html.find('<script type="application/ld+json">')
        if first_ld_json > 0:
            html = html[:first_ld_json] + howto_script + '\n' + html[first_ld_json:]
            changes.append('howto JSON-LD')

    # 4. Add FAQ JSON-LD if missing
    if not find_existing_faq(html):
        import json
        faq = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": f"Is {tool_name} free?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, it's completely free with no sign-ups required."}},
                {"@type": "Question", "name": f"Is {tool_name} private?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. All calculations run in your browser. No data is uploaded."}},
                {"@type": "Question", "name": f"Does {tool_name} work on mobile?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. All tools are mobile-responsive and work on any device."}}
            ]
        }
        faq_script = f'\n<script type="application/ld+json">\n{json.dumps(faq)}\n</script>'
        first_ld_json = html.find('<script type="application/ld+json">')
        if first_ld_json > 0:
            html = html[:first_ld_json] + faq_script + '\n' + html[first_ld_json:]
            changes.append('faq JSON-LD')

    # 5. Add visible content sections before </footer>
    footer_idx = html.rfind('<footer')
    if footer_idx > 0:
        has_dos = find_existing_dos_donts(html)
        insert = ''
        if not has_dos:
            insert += HTML_DOS_DONTS
            changes.append('dos-donts section')
        insert += HTML_FAQ_GENERIC
        insert += HTML_EXPLAINER
        html = html[:footer_idx] + insert + '\n' + html[footer_idx:]
        changes.append('faq+explainer sections')

    if changes and not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)

    return changes


def main():
    dry_run = '--apply' not in sys.argv
    root = Path(__file__).parent.parent  # uptools root

    print(f"{'[DRY RUN]' if dry_run else '[APPLYING]'} Bulk SEO Upgrade\n")

    upgraded = 0
    skipped = 0
    already_done = 0

    for dirpath in sorted(root.iterdir()):
        if not dirpath.is_dir():
            continue
        if dirpath.name in SKIP_DIRS or dirpath.name.startswith('.'):
            continue
        index = dirpath / 'index.html'
        if not index.exists():
            continue

        changes = upgrade_tool(index, dry_run=dry_run)

        if changes:
            upgraded += 1
            icon = '[DONE]' if not dry_run else '[TODO]'
            print(f"  {icon} {dirpath.name}: {', '.join(changes)}")
        else:
            already_done += 1
            print(f"  [SKIP] {dirpath.name}: already has all SEO features")

    # Homepage
    homepage = root / 'index.html'
    if homepage.exists():
        changes = upgrade_tool(homepage, dry_run=dry_run)
        if changes:
            upgraded += 1
            print(f"  {'[DONE]' if not dry_run else '[TODO]'} homepage: {', '.join(changes)}")

    print(f"\nSummary: {upgraded} upgraded, {already_done} already complete")
    if dry_run:
        print("Run with --apply to make changes.")


if __name__ == '__main__':
    main()
