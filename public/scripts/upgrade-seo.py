#!/usr/bin/env python3
"""Batch upgrade SEO content for High-impact tools: Age, Percentage, Password, Word Counter, GST, Compound Interest"""
import os
import re

BASE = r'C:\AI\uptools'

# ── Shared HTML sections ──────────────────────────────────────────

AGE_HOWTO_JSONLD = '''
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"HowTo","name":"How to Calculate Your Exact Age","description":"Step-by-step guide to calculating exact age in years, months, and days, getting next birthday countdown, and checking eligibility.","step":[
{"@type":"HowToStep","position":1,"name":"Enter date of birth","text":"Select your date of birth using the date picker."},
{"@type":"HowToStep","position":2,"name":"Set an As of date (optional)","text":"Leave blank for today's date, or pick a past/future date to see age on that date."},
{"@type":"HowToStep","position":3,"name":"Click Calculate","text":"View your exact age in years, months, days, plus totals in days, weeks, hours, and minutes."},
{"@type":"HowToStep","position":4,"name":"Explore additional results","text":"See next birthday countdown, half-birthday, key milestones (18/21/30/60), retirement countdown, and Indian eligibility badges."},
{"@type":"HowToStep","position":5,"name":"Copy or share","text":"Click Copy Summary for a one-click text summary, or Share to send a link with the same settings."}
],
"totalTime":"PT1M","tool":{"@type":"HowToTool","name":"UpTools Age Calculator","url":"https://www.uptools.in/age-calculator/"},
"publisher":{"@type":"Organization","name":"UpTools","url":"https://www.uptools.in/"}}
</script>'''

AGE_FAQ_SECTION = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">Frequently Asked Questions</h2>
<details><summary><b>How do I calculate my exact age?</b></summary><p style="padding:6px 0;color:#9aa4b2">Enter your date of birth and optionally an 'As of' date. The calculator shows years, months and days, plus totals in days, weeks, hours, and minutes.</p></details>
<details><summary><b>Can I see the next birthday countdown?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes. You'll see the date, days left and the age you will turn. You can also download a .ics calendar file to add it to your calendar app.</p></details>
<details><summary><b>Does it show legal eligibility in India?</b></summary><p style="padding:6px 0;color:#9aa4b2">It flags eligibility for voter ID (18+), driving licence (18+; 16+ for ≤50cc), senior citizen (60+) and super senior (80+).</p></details>
<details><summary><b>How do I count working days between dates?</b></summary><p style="padding:6px 0;color:#9aa4b2">Use the Working Days section. Select start/end dates, tick 'Exclude weekends', and optionally paste holidays (YYYY-MM-DD format).</p></details>
<details><summary><b>How accurate is this age calculator?</b></summary><p style="padding:6px 0;color:#9aa4b2">It uses precise date math accounting for varying month lengths and leap years. Results are accurate to the day.</p></details>
<details><summary><b>What is a half-birthday?</b></summary><p style="padding:6px 0;color:#9aa4b2">A half-birthday is exactly 6 months after your last birthday. It's sometimes used for planning celebrations or milestones.</p></details>
</section>'''

AGE_DOS_DONTS = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">✅ Do's and ❌ Don'ts</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div class="card" style="border-color:rgba(34,197,94,.3)">
<h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">✅ <b>Do</b> enter your exact date of birth from official documents.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use the As of date to verify age on a specific deadline (e.g., exam or visa).</li>
<li style="padding:.35rem 0">✅ <b>Do</b> add the next birthday .ics file to your personal calendar.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use working days to plan project timelines and leave periods.</li>
</ul>
</div>
<div class="card" style="border-color:rgba(239,68,68,.3)">
<h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">❌ <b>Don't</b> confuse age in years with total days — use the totals section for precision.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> forget that leap year birthdays (Feb 29) fall on Feb 28 in non-leap years.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> rely on this for age-related medical advice — consult a doctor.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> use approximate dates when exact age is required for legal purposes.</li>
</ul>
</div>
</div>
</section>'''

AGE_HOWTO_VISIBLE = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">How to Use This Age Calculator</h2>
<ol class="note" style="margin:0 0 0 1.2rem; padding:0; list-style:decimal; color:#9aa4b2">
<li><b>Enter your date of birth</b> — use the date picker to select your birth date.</li>
<li><b>Optionally set an "As of" date</b> — leave blank for today, or pick a specific date.</li>
<li><b>Click Calculate</b> — see exact age, next birthday, milestones, and more.</li>
<li><b>Use the Working Days tool</b> — count business days between any two dates with holiday exclusion.</li>
</ol>
<p class="note small" style="margin-top:10px">💡 <b>Tip:</b> Use Copy Summary to quickly share your age details via text or email.</p>
</section>'''

AGE_EXPLAINER = '''
<section class="card" style="margin-top:16px">
<details open>
<summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">📐 How Age is Calculated</summary>
<div style="margin-top:8px;color:#9aa4b2">
<p><b>Precise method:</b> Age is calculated by comparing the birth date to the target date, accounting for varying month lengths and leap years.</p>
<p>If today is <b>2025-07-15</b> and you were born on <b>1990-03-20</b>:</p>
<ul style="margin:4px 0 8px 1.2rem">
<li>Years: 2025 − 1990 = <b>35</b></li>
<li>Months: Jul − Mar = <b>4</b> months</li>
<li>Days: 15 − 20 = -5 → borrow 1 month → <b>25</b> days</li>
<li><b>Result: 35 years, 3 months, 25 days</b></li>
</ul>
<p>Total: 12,789 days | Weeks: 1,827 | Hours: 306,936 | Minutes: 18,416,160</p>
<p style="margin-top:8px">Also try: <a href="/bmi-calculator/">BMI Calculator</a> · <a href="/date-difference/">Date Difference</a> · <a href="/sleep-calculator/">Sleep Calculator</a></p>
</div>
</details>
</section>'''

def insert_before_closing_main(html, insert_html):
    """Insert content before </main>"""
    idx = html.rfind('</main>')
    if idx > 0:
        return html[:idx] + insert_html + '\n' + html[idx:]
    return html

def insert_script_before_first_script(html, script_html):
    """Insert JSON-LD script before the first <script type="application/ld+json">"""
    idx = html.find('<script type="application/ld+json">')
    if idx > 0:
        return html[:idx] + script_html + '\n' + html[idx:]
    return html

# === AGE CALCULATOR ===
def upgrade_age_calculator():
    path = os.path.join(BASE, 'age-calculator', 'index.html')
    if not os.path.exists(path):
        print('  SKIP: age-calculator not found')
        return
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Add keywords meta
    if 'name="keywords"' not in html:
        html = html.replace(
            '<meta content="index,follow',
            '<meta content="age calculator, exact age, next birthday, working days, age in days, age calculator by date, birthday calculator, indian eligibility age, retirement countdown, half birthday, legal age calculator" name="keywords"/>\n<meta content="index,follow'
        )
    
    # Add HowTo JSON-LD
    if '"HowTo"' not in html:
        html = insert_script_before_first_script(html, AGE_HOWTO_JSONLD)
    
    # Add FAQ, Do's/Donts, HowTo, Explainer before </main>
    section = AGE_FAQ_SECTION + AGE_DOS_DONTS + AGE_HOWTO_VISIBLE + AGE_EXPLAINER
    
    # Replace existing FAQ section if any, or append before footer
    footer_idx = html.rfind('<footer')
    if footer_idx > 0:
        html = html[:footer_idx] + section + '\n' + html[footer_idx:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  ✅ age-calculator upgraded')


# === PERCENTAGE CALCULATOR ===
PERCENTAGE_HOWTO_JSONLD = '''
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"HowTo","name":"How to Use the Percentage Calculator","description":"Calculate percentages, percent change, discounts, and ratios step by step.","step":[
{"@type":"HowToStep","position":1,"name":"Choose calculation type","text":"Select What is X% of Y, X is what % of Y, or Percentage increase/decrease."},
{"@type":"HowToStep","position":2,"name":"Enter values","text":"Type the two numbers into the input fields."},
{"@type":"HowToStep","position":3,"name":"Read the result","text":"The answer updates instantly as you type — no button needed."}
],"totalTime":"PT30S","publisher":{"@type":"Organization","name":"UpTools","url":"https://www.uptools.in/"}}
</script>'''

PERCENTAGE_FAQ = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">Frequently Asked Questions</h2>
<details><summary><b>How do I calculate a discount percentage?</b></summary><p style="padding:6px 0;color:#9aa4b2">Use the "Percentage increase or decrease" section. Enter original price as "Original value" and sale price as "New value" to get the discount %.</p></details>
<details><summary><b>How do I reverse a percentage?</b></summary><p style="padding:6px 0;color:#9aa4b2">If something increased by 20%, divide by 1.20. If it decreased by 20%, divide by 0.80. The calculator shows the change value automatically.</p></details>
<details><summary><b>What is the formula for percentage change?</b></summary><p style="padding:6px 0;color:#9aa4b2">% Change = (New Value − Old Value) ÷ Old Value × 100. Positive = increase, Negative = decrease.</p></details>
<details><summary><b>Can I calculate tax and tip?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes. Enter the tax/tip percentage and the base amount in the "What is X% of Y" section to get the total.</p></details>
</section>'''

PERCENTAGE_DOS_DONTS = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">✅ Do's and ❌ Don'ts</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div class="card" style="border-color:rgba(34,197,94,.3)">
<h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">✅ <b>Do</b> double-check that you're entering the base value in the right field.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use decimal precision for financial calculations (e.g., 12.5%).</li>
<li style="padding:.35rem 0">✅ <b>Do</b> round appropriately — for currency, round to 2 decimal places.</li>
</ul>
</div>
<div class="card" style="border-color:rgba(239,68,68,.3)">
<h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">❌ <b>Don't</b> confuse "X% of Y" with "X is what % of Y" — they are different calculations.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> use percentages directly in markup — a 50% markup is not the same as a 50% margin.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> divide by zero — the calculator will flag this automatically.</li>
</ul>
</div>
</div>
</section>'''

PERCENTAGE_EXPLAINER = '''
<section class="card" style="margin-top:16px">
<details open>
<summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">📐 How Percentage Works</summary>
<div style="margin-top:8px;color:#9aa4b2">
<p><b>X% of Y</b> → (X ÷ 100) × Y</p>
<p><b>X is what % of Y</b> → (X ÷ Y) × 100</p>
<p><b>% Change</b> → (New − Old) ÷ Old × 100</p>
<h3>Example: Shopping Discount</h3>
<p>A ₹2,500 jacket is 30% off → Discount = 2500 × 0.30 = ₹750 → Sale price = ₹2,500 − ₹750 = <b>₹1,750</b></p>
<p style="margin-top:8px">Also try: <a href="/pnl-calculator/">Profit &amp; Loss</a> · <a href="/currency-converter/">Currency Converter</a> · <a href="/gst-calculator/">GST Calculator</a></p>
</div>
</details>
</section>'''

def upgrade_percentage_calculator():
    path = os.path.join(BASE, 'percentage-calculator', 'index.html')
    if not os.path.exists(path):
        print('  SKIP: percentage-calculator not found')
        return
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Add keywords
    if 'name="keywords"' not in html:
        html = html.replace(
            'content="index,follow',
            'content="percentage calculator, percent change, percentage increase, percentage decrease, discount calculator, percent formula" name="keywords"/>\n<meta content="index,follow'
        )
    
    # Add HowTo JSON-LD
    if '"HowTo"' not in html:
        html = insert_script_before_first_script(html, PERCENTAGE_HOWTO_JSONLD)
    
    # Add content before footer
    sections = PERCENTAGE_FAQ + PERCENTAGE_DOS_DONTS + PERCENTAGE_EXPLAINER
    footer_idx = html.rfind('<footer')
    if footer_idx > 0:
        html = html[:footer_idx] + sections + '\n' + html[footer_idx:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  ✅ percentage-calculator upgraded')


# === PASSWORD GENERATOR ===
PASSWORD_DOS_DONTS = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">✅ Do's and ❌ Don'ts for Password Security</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div class="card" style="border-color:rgba(34,197,94,.3)">
<h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">✅ <b>Do</b> use 16+ characters with mixed case, numbers, and symbols.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use a unique password for every account.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> enable two-factor authentication (2FA) wherever available.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use the encrypted Vault to save passwords securely.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> export your Vault backup and store it safely offline.</li>
</ul>
</div>
<div class="card" style="border-color:rgba(239,68,68,.3)">
<h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">❌ <b>Don't</b> reuse the same password across multiple sites.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> use personal info (birthday, name) in passwords.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> share your Vault PIN or master password.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> skip 2FA even if your password is strong.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> write passwords on sticky notes or unencrypted files.</li>
</ul>
</div>
</div>
</section>'''

PASSWORD_FAQ = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">Frequently Asked Questions</h2>
<details><summary><b>Is this password generator secure?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes. It uses the browser's cryptographically secure random generator (window.crypto.getRandomValues). Nothing is sent to any server. The encrypted Vault uses AES-GCM with PBKDF2 key derivation.</p></details>
<details><summary><b>What password length is recommended?</b></summary><p style="padding:6px 0;color:#9aa4b2">We suggest 16-24 characters with upper+lower+digits+symbols, or a 4-6 word passphrase with a separator and a number.</p></details>
<details><summary><b>Where are saved passwords stored?</b></summary><p style="padding:6px 0;color:#9aa4b2">Only in your browser's local storage, encrypted with AES-GCM using your Vault PIN. You can export or clear them anytime.</p></details>
<details><summary><b>What is entropy?</b></summary><p style="padding:6px 0;color:#9aa4b2">Entropy measures password randomness in bits. Higher = harder to crack. A 16-character password with mixed characters has ~100 bits of entropy and would take centuries to brute-force.</p></details>
</section>'''

PASSWORD_EXPLAINER = '''
<section class="card" style="margin-top:16px">
<details open>
<summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">🔐 How This Password Generator Works</summary>
<div style="margin-top:8px;color:#9aa4b2">
<p>Uses <b>window.crypto.getRandomValues()</b> — the same cryptographic API used by banking websites. Generate passwords from:</p>
<ul style="margin:4px 0 8px 1.2rem">
<li><b>Random characters</b> — mix uppercase, lowercase, digits, and symbols.</li>
<li><b>Memorable passphrases</b> — random words with optional separator and numbers.</li>
</ul>
<p><b>Crack-time estimates:</b> A 16-char random password with all character types would take over 10 billion years to crack on modern hardware.</p>
<p style="margin-top:8px">Also try: <a href="/username-generator/">Username Generator</a> · <a href="/uuid-generator/">UUID Generator</a> · <a href="/qr-generator/">QR Generator</a></p>
</div>
</details>
</section>'''

def upgrade_password_generator():
    path = os.path.join(BASE, 'password-generator', 'index.html')
    if not os.path.exists(path):
        print('  SKIP: password-generator not found')
        return
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    sections = PASSWORD_FAQ + PASSWORD_DOS_DONTS + PASSWORD_EXPLAINER
    footer_idx = html.rfind('<footer')
    if footer_idx > 0:
        html = html[:footer_idx] + sections + '\n' + html[footer_idx:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  ✅ password-generator upgraded')


# === WORD COUNTER ===
WORDCOUNTER_HOWTO_JSONLD = '''
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"HowTo","name":"How to Use the Word Counter","description":"Count words, characters, sentences, paragraphs and estimate reading time.","step":[
{"@type":"HowToStep","position":1,"name":"Paste or type text","text":"Enter your text in the textarea below the title."},
{"@type":"HowToStep","position":2,"name":"Read live stats","text":"Word count, character count, sentence count, paragraph count and estimated reading time update instantly."},
{"@type":"HowToStep","position":3,"name":"Use for SEO or writing","text":"Check if your title meets 60-character limit, meta description fits 160 characters, or meet word count requirements."}
],"totalTime":"PT30S","publisher":{"@type":"Organization","name":"UpTools","url":"https://www.uptools.in/"}}
</script>'''

WORDCOUNTER_TEMPLATE = '''
<!-- How to use -->
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">How to Use This Word Counter</h2>
<ol class="note" style="margin:0 0 0 1.2rem; padding:0; list-style:decimal; color:#9aa4b2">
<li><b>Start typing or paste text</b> — the counter updates live as you type.</li>
<li><b>Check word count</b> — see exactly how many words, characters, sentences, and paragraphs you have.</li>
<li><b>See reading time</b> — based on an average 200 words per minute reading speed.</li>
<li><b>Use for SEO</b> — check title length (≤60 chars), meta description (≤160 chars), and article word counts.</li>
</ol>
</section>
<!-- Do's and Don'ts -->
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">✅ Do's and ❌ Don'ts for Writing</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div class="card" style="border-color:rgba(34,197,94,.3)">
<h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">✅ <b>Do</b> keep blog post titles under 60 characters for SEO.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> keep meta descriptions under 160 characters.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> aim for 1,500-2,500 words for in-depth blog posts.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use short paragraphs (3-4 sentences) for web readability.</li>
</ul>
</div>
<div class="card" style="border-color:rgba(239,68,68,.3)">
<h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">❌ <b>Don't</b> stuff keywords just to hit a word count target.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> write titles longer than 60 characters — they get truncated in search results.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> ignore sentence variety — mix short and long sentences.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> forget to proofread after hitting your word count.</li>
</ul>
</div>
</div>
</section>
<!-- FAQ -->
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">Frequently Asked Questions</h2>
<details><summary><b>How is reading time calculated?</b></summary><p style="padding:6px 0;color:#9aa4b2">Based on an average reading speed of 200 words per minute. Actual speed varies by person and content complexity.</p></details>
<details><summary><b>Does it count characters with or without spaces?</b></summary><p style="padding:6px 0;color:#9aa4b2">Both are shown — characters (with spaces) and characters (without spaces) for precise counts.</p></details>
<details><summary><b>What is the ideal word count for a blog post?</b></summary><p style="padding:6px 0;color:#9aa4b2">For SEO, aim for 1,500-2,500 words for comprehensive posts. Product descriptions work well at 150-300 words. Tweets are capped at 280 characters.</p></details>
<details><summary><b>Does it work offline?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes! All counting runs in your browser. No data is sent to any server — your text stays private.</p></details>
</section>'''

WORDCOUNTER_EXPLAINER = '''
<section class="card" style="margin-top:16px">
<details open>
<summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">📏 How Word Counting Works</summary>
<div style="margin-top:8px;color:#9aa4b2">
<p>The tool splits text by whitespace boundaries to count words, iterates characters for char counts, and uses sentence-ending punctuation (.!?) for sentence counts. Para counting uses line breaks.</p>
<p><b>Quick reference:</b></p>
<ul style="margin:4px 0 8px 1.2rem">
<li>Twitter/X: 280 characters max</li>
<li>Instagram caption: 2,200 characters</li>
<li>Meta title: ~60 characters</li>
<li>Meta description: ~155-160 characters</li>
<li>Blog post: 1,500-2,500 words</li>
</ul>
<p style="margin-top:8px">Also try: <a href="/text-case-converter/">Text Case Converter</a> · <a href="/diff-checker/">Diff Checker</a> · <a href="/base64-encoder/">Base64 Encoder</a></p>
</div>
</details>
</section>'''

def upgrade_word_counter():
    path = os.path.join(BASE, 'word-counter', 'index.html')
    if not os.path.exists(path):
        print('  SKIP: word-counter not found')
        return
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Add keywords
    if 'name="keywords"' not in html:
        html = html.replace(
            'content="index,follow',
            'content="word counter, character counter, word count tool, reading time calculator, text counter, free online word counter" name="keywords"/>\n<meta content="index,follow'
        )
    
    # Add HowTo JSON-LD
    if '"HowTo"' not in html:
        html = insert_script_before_first_script(html, WORDCOUNTER_HOWTO_JSONLD)
    
    # Add content before footer
    sections = WORDCOUNTER_TEMPLATE + WORDCOUNTER_EXPLAINER
    footer_idx = html.rfind('<footer')
    if footer_idx > 0:
        html = html[:footer_idx] + sections + '\n' + html[footer_idx:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  ✅ word-counter upgraded')


# === COMPOUND INTEREST CALCULATOR ===
COMPOUND_FAQ = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">Frequently Asked Questions</h2>
<details><summary><b>What is compound interest?</b></summary><p style="padding:6px 0;color:#9aa4b2">Compound interest is interest earned on both the initial principal and all previously accumulated interest. It grows your money faster than simple interest.</p></details>
<details><summary><b>How often is interest compounded?</b></summary><p style="padding:6px 0;color:#9aa4b2">Common frequencies: monthly (12x/yr), quarterly (4x/yr), annually (1x/yr). More frequent compounding means slightly higher returns.</p></details>
<details><summary><b>What is the Rule of 72?</b></summary><p style="padding:6px 0;color:#9aa4b2">Divide 72 by the annual interest rate to estimate how many years it takes to double your money. Example: 72 ÷ 8% = 9 years to double.</p></details>
<details><summary><b>Is compound interest always better than simple interest?</b></summary><p style="padding:6px 0;color:#9aa4b2">Yes, for investments. For loans, compound interest means you pay more — so try to pay off compound loans early.</p></details>
</section>'''

COMPOUND_DOS_DONTS = '''
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">✅ Do's and ❌ Don'ts</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div class="card" style="border-color:rgba(34,197,94,.3)">
<h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">✅ <b>Do</b> start investing early — compound interest rewards time the most.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> reinvest dividends and interest instead of withdrawing them.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> compare different compounding frequencies before choosing an investment.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> factor in inflation to understand real returns.</li>
</ul>
</div>
<div class="card" style="border-color:rgba(239,68,68,.3)">
<h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">❌ <b>Don't</b> forget that compound interest also applies to debt — pay credit cards in full.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> assume high interest rates are guaranteed — returns vary.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> ignore fees — they can significantly reduce compound growth over time.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> wait for the "perfect time" — start small and increase contributions over time.</li>
</ul>
</div>
</div>
</section>'''

COMPOUND_EXPLAINER = '''
<section class="card" style="margin-top:16px">
<details open>
<summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">📐 How Compound Interest Works</summary>
<div style="margin-top:8px;color:#9aa4b2">
<p><b>Formula:</b> A = P × (1 + r/n)<sup>nt</sup></p>
<ul style="margin:4px 0 8px 1.2rem">
<li><b>A</b> = Final amount</li>
<li><b>P</b> = Principal (initial investment)</li>
<li><b>r</b> = Annual interest rate (decimal)</li>
<li><b>n</b> = Compounding frequency per year</li>
<li><b>t</b> = Time in years</li>
</ul>
<h3>Worked Example</h3>
<p>₹1,00,000 at 10% annually compounded monthly for 10 years:</p>
<p>A = 1,00,000 × (1 + 0.10/12)<sup>120</sup> = ₹2,70,704</p>
<p><b>Total interest earned: ₹1,70,704</b> — that's 170% growth on your original investment!</p>
<p style="margin-top:8px">Also try: <a href="/sip-calculator/">SIP Calculator</a> · <a href="/fd-calculator/">FD Calculator</a> · <a href="/roi-calculator/">ROI Calculator</a></p>
</div>
</details>
</section>'''

def upgrade_compound_interest():
    path = os.path.join(BASE, 'compound-interest-calculator', 'index.html')
    if not os.path.exists(path):
        print('  SKIP: compound-interest-calculator not found')
        return
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Add keywords
    if 'name="keywords"' not in html:
        html = html.replace(
            'content="index,follow',
            'content="compound interest calculator, compound interest formula, annual compound interest, monthly compound interest, compound interest calculator india, investment growth calculator" name="keywords"/>\n<meta content="index,follow'
        )
    
    # Add content before footer
    sections = COMPOUND_FAQ + COMPOUND_DOS_DONTS + COMPOUND_EXPLAINER
    footer_idx = html.rfind('<footer')
    if footer_idx > 0:
        html = html[:footer_idx] + sections + '\n' + html[footer_idx:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  ✅ compound-interest-calculator upgraded')


# === GST CALCULATOR ===
GST_HOWTO_JSONLD = '''
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"HowTo","name":"How to Calculate GST in India","description":"Step-by-step guide to calculating GST (CGST, SGST, IGST) for any amount at 0%, 5%, 12%, 18% or 28% rates.","step":[
{"@type":"HowToStep","position":1,"name":"Enter the base amount","text":"Type the pre-GST amount in rupees."},
{"@type":"HowToStep","position":2,"name":"Select GST rate","text":"Choose from 0%, 5%, 12%, 18%, or 28% — common Indian GST slabs."},
{"@type":"HowToStep","position":3,"name":"Toggle Inclusive/Exclusive","text":"Choose whether the amount includes GST or not."},
{"@type":"HowToStep","position":4,"name":"View CGST/SGST split","text":"See how GST splits into CGST (Central) and SGST (State) for intra-state, or IGST for inter-state."}
],"totalTime":"PT1M","publisher":{"@type":"Organization","name":"UpTools","url":"https://www.uptools.in/"}}
</script>'''

GST_DOS_DONTS = '''
<!-- Do's and Don'ts for GST -->
<section class="card" style="margin-top:16px">
<h2 style="margin-top:0">✅ Do's and ❌ Don'ts for GST Calculation</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
<div class="card" style="border-color:rgba(34,197,94,.3)">
<h3 style="color:#22c55e;margin-top:0;font-size:1rem">✅ Do's</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">✅ <b>Do</b> verify the correct GST rate for your product/service category.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> distinguish between intra-state (CGST+SGST) and inter-state (IGST) transactions.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use this tool to double-check invoices before filing GST returns.</li>
<li style="padding:.35rem 0">✅ <b>Do</b> use the History feature to review recent calculations.</li>
</ul>
</div>
<div class="card" style="border-color:rgba(239,68,68,.3)">
<h3 style="color:#ef4444;margin-top:0;font-size:1rem">❌ Don'ts</h3>
<ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
<li style="padding:.35rem 0">❌ <b>Don't</b> apply 28% GST without checking — most household items fall under 5-18%.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> confuse "inclusive" and "exclusive" modes — they give different totals.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> assume all services are exempt — most services attract 18% GST.</li>
<li style="padding:.35rem 0">❌ <b>Don't</b> use this for official tax filing without verifying with GST portal data.</li>
</ul>
</div>
</div>
</section>'''

def upgrade_gst_calculator():
    path = os.path.join(BASE, 'gst-calculator', 'index.html')
    if not os.path.exists(path):
        print('  SKIP: gst-calculator not found')
        return
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Add HowTo JSON-LD
    if '"HowTo"' not in html:
        html = insert_script_before_first_script(html, GST_HOWTO_JSONLD)
    
    # Add Do's/Don'ts before footer
    footer_idx = html.rfind('<footer')
    if footer_idx > 0:
        html = html[:footer_idx] + GST_DOS_DONTS + '\n' + html[footer_idx:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  ✅ gst-calculator upgraded')


# ── MAIN ──────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('Upgrading SEO content for high-impact tools...\n')
    upgrade_age_calculator()
    upgrade_percentage_calculator()
    upgrade_password_generator()
    upgrade_word_counter()
    upgrade_compound_interest()
    upgrade_gst_calculator()
    print('\nDone! All upgrades applied.')
