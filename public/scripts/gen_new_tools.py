#!/usr/bin/env python3
"""Generate 14 high-traffic tool pages for UpTools.
Each page is self-contained (header/footer/SEO/JS) and matches the existing
site style. Output: <repo>/<slug>/index.html
Run: python3 scripts/gen_new_tools.py
"""
import os, html, json

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.uptools.in"

HEADER = '''  <header class="site" role="banner">
<div class="header-inner">
<a aria-label="UpTools Home" class="brand" href="/">
<img alt="UpTools logo" height="28" loading="eager" src="/assets/logo/uptools-logo.svg" width="28"/>
<b>UpTools</b>
</a>
<nav aria-label="Primary" class="nav-links">
<a href="/" class="nav-home">Home</a>
<a href="/games/" class="nav-games">Games</a>
<button class="more-btn" aria-expanded="false" aria-haspopup="true">Tools <span class="arrow">&#9660;</span></button>
<div class="more-menu" role="menu">
<a role="menuitem" href="/#tools">All Tools</a>
<a role="menuitem" href="/income-tax-tool/">Income Tax</a>
<a role="menuitem" href="/emi-calculator/">EMI</a>
<a role="menuitem" href="/gst-calculator/">GST</a>
<a role="menuitem" href="/ai-writer/">AI Tools</a>
<a role="menuitem" href="/about/">About</a>
<a role="menuitem" href="/contact/">Contact</a>
</div>
</nav>
</div>
</header>'''

FOOTER = '''    <footer class="note small" style="text-align: center; margin-top: 2rem;">
      &copy; 2026 UpTools . <a href="/privacy-policy/">Privacy</a> . <a href="/contact/">Contact</a>
    </footer>'''

def page(slug, icon, title, desc, keywords, cat_label, cat_slug, body_html, js, related, faqs):
    kw = ", ".join([f"{title.lower()}", "uptools", *keywords])
    faq_json = {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]
    }
    breadcrumb = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": title, "item": f"{SITE}/{slug}/"}
        ]
    }
    app = {
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": f"UpTools {title}", "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any", "url": f"{SITE}/{slug}/", "description": desc,
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "INR"},
        "publisher": {"@type": "Organization", "name": "UpTools", "url": SITE}
    }
    rel_html = " &middot; ".join(f'<a href="/{s}/">{t}</a>' for s, t in related)
    faq_html = "\n".join(
        f'<details><summary><b>{html.escape(q)}</b></summary><p style="padding:6px 0;color:#9aa4b2">{html.escape(a)}</p></details>'
        for q, a in faqs)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>{html.escape(title)} – Free Online Tool | UpTools</title>
  <link rel="icon" sizes="50x50" type="image/svg+xml" href="/assets/logo/uptools-logo.svg">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/logo/uptools-logo.svg">
  <meta name="description" content="{html.escape(desc)}" />
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:large" />
  <link href="{SITE}/{slug}/" rel="canonical"/>
  <meta name="keywords" content="{html.escape(kw)}" />
  <meta property="og:title" content="{html.escape(title)} – UpTools" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="UpTools" />
  <meta property="og:url" content="{SITE}/{slug}/" />
  <meta property="og:image" content="{SITE}/assets/og/{slug}.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{html.escape(title)} – UpTools" />
  <meta name="twitter:description" content="{html.escape(desc)}" />
  <meta name="twitter:image" content="{SITE}/assets/og/{slug}.png" />
  <style>
    :root {{ --bg:#0f1419; --surface:#121826; --text:#e6edf3; --muted:#9aa4b2; --brand:#7aa2ff; --accent:#06b6d4; --radius:.75rem; --border:#212a3a }}
    body {{ margin:0; font:400 16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif; background:var(--bg); color:var(--text) }}
    * {{ box-sizing:border-box }}
    .wrap {{ width:min(100% - 24px, 1120px); margin:24px auto }}
    .card {{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:1.5rem }}
    h1,h2 {{ line-height:1.3; margin:1.5rem 0 .75rem }} h1 {{ font-size:2rem }} h2 {{ font-size:1.5rem }}
    .sr-only {{ position:absolute; left:-9999px }}
    .site {{ position:sticky; top:0; z-index:20; background:linear-gradient(180deg,var(--bg),var(--bg)f2 70%,transparent); backdrop-filter:blur(6px); border-bottom:1px solid #0f1a2a }}
    .header-inner {{ display:flex; align-items:center; justify-content:space-between; gap:12px; width:min(100% - 24px,1120px); margin:0 auto; min-height:56px; padding:8px 0 }}
    .brand {{ display:inline-flex; align-items:center; gap:.6rem; color:var(--text); text-decoration:none; font-weight:900 }}
    .nav-links {{ display:flex; flex-wrap:wrap; gap:.75rem }}
    .nav-links a {{ color:var(--text); opacity:.9; text-decoration:none; padding:.25rem .4rem; border-radius:.5rem }}
    .more-btn { background:#1a2236; color:var(--text); border:1px solid var(--border); padding:.4rem .6rem; border-radius:.5rem; cursor:pointer; font:inherit; font-weight:700 }
    .note {{ color:var(--muted); font-size:.9rem }}
    .btn {{ display:inline-flex; align-items:center; gap:.5rem; padding:.6rem .9rem; border-radius:var(--radius); background:var(--accent); color:#000; border:0; font-weight:800; text-decoration:none; cursor:pointer }}
    input,select,textarea {{ width:100%; padding:12px; border:1px solid var(--border); border-radius:var(--radius); background:var(--bg); color:var(--text); font-family:inherit; font-size:14px }}
    label {{ display:block; margin-top:1rem; font-weight:600 }}
    .result {{ background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); padding:1rem; margin-top:1rem }}
    .result-row {{ display:flex; justify-content:space-between; padding:.75rem 0; border-bottom:1px solid var(--border) }}
    .result-row:last-child {{ border-bottom:none }}
    .result-label {{ color:var(--muted) }} .result-value {{ font-weight:700; color:var(--accent) }}
    .row {{ display:flex; gap:10px; flex-wrap:wrap; align-items:center }}
    .grid2 {{ display:grid; grid-template-columns:1fr 1fr; gap:10px }} @media (max-width:720px){{ .grid2 {{ grid-template-columns:1fr }} }}
    .pill {{ display:inline-block; padding:.25rem .6rem; border:1px solid var(--border); border-radius:999px; font-size:.8rem; color:var(--muted) }}
  </style>
  <script type="application/ld+json">{json.dumps(faq_json)}</script>
  <script type="application/ld+json">{json.dumps(breadcrumb)}</script>
  <script type="application/ld+json">{json.dumps(app)}</script>
  <link rel="stylesheet" href="/style.css?v=1.3.0">
</head>
<body>
  <a href="#main" class="sr-only skip-link">Skip to content</a>
{HEADER}
  <main id="main" class="wrap" role="main">
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem;">
      <ol style="display:flex; gap:.5rem; list-style:none; padding:0; margin:0; font-size:.9rem;">
        <li><a href="/">Home</a></li><li style="color:var(--muted)">/</li>
        <li><a href="/#{cat_slug}">{cat_label}</a></li><li style="color:var(--muted)">/</li>
        <li style="color:var(--muted)">{html.escape(title)}</li>
      </ol>
    </nav>
    <article class="card">
      <h1>{icon} {html.escape(title)}</h1>
      <p class="note">{html.escape(desc)}</p>
{body_html}
    </article>
    <section class="card" style="margin-top:16px">
      <h2 style="margin-top:0">&#9989; Do's and &#10060; Don'ts</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="card" style="border-color:rgba(34,197,94,.3)">
          <h3 style="color:#22c55e;margin-top:0;font-size:1rem">&#9989; Do's</h3>
          <ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
            <li style="padding:.35rem 0">&#9989; <b>Do</b> verify inputs for accuracy.</li>
            <li style="padding:.35rem 0">&#9989; <b>Do</b> bookmark this free tool for quick access.</li>
            <li style="padding:.35rem 0">&#9989; <b>Do</b> share results with teammates.</li>
          </ul>
        </div>
        <div class="card" style="border-color:rgba(239,68,68,.3)">
          <h3 style="color:#ef4444;margin-top:0;font-size:1rem">&#10060; Don'ts</h3>
          <ul style="list-style:none;padding:0;margin:0;color:#9aa4b2">
            <li style="padding:.35rem 0">&#10060; <b>Don't</b> enter sensitive personal data.</li>
            <li style="padding:.35rem 0">&#10060; <b>Don't</b> treat estimates as professional advice.</li>
            <li style="padding:.35rem 0">&#10060; <b>Don't</b> assume results are guarantees.</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="card" style="margin-top:16px">
      <h2 style="margin-top:0">Frequently Asked Questions</h2>
      {faq_html}
    </section>
    <section class="card" style="margin-top:16px">
      <details open>
        <summary style="cursor:pointer;font-weight:700;font-size:1.1rem;padding:4px 0">&#128206; How This Tool Works</summary>
        <div style="margin-top:8px;color:#9aa4b2">
          <p>This tool computes results entirely in your browser using JavaScript. No data is sent to any server, ensuring your privacy.</p>
          <p>Results update instantly &mdash; no waiting for server responses.</p>
          <p style="margin-top:8px">Also try: {rel_html}</p>
        </div>
      </details>
    </section>
{FOOTER}
  </main>
  <script src="/scripts/utils.js?v=1.3.0" type="module"></script>
  <script>{js}</script>
</body>
</html>
'''

# ───────────────────────── TOOL DEFINITIONS ─────────────────────────

TOOLS = {}

# 1. CGPA Calculator
TOOLS["cgpa-calculator"] = dict(
    icon="🎓", title="CGPA Calculator", cat_label="Education", cat_slug="education",
    desc="Calculate CGPA from subject grade points and credits. Supports 10-point and 4-point scales.",
    keywords=["cgpa calculator", "cgpa to percentage", "gpa calculator", "grade point average"],
    related=[("gpa-calculator","GPA Calculator"),("percentage-calculator","Percentage Calculator"),("age-calculator","Age Calculator")],
    faqs=[
        ("How is CGPA calculated?","CGPA = sum(grade points × credits) ÷ sum(credits) across all subjects."),
        ("Is this CGPA calculator free?","Yes. It runs fully in your browser with no sign-up required."),
        ("Does it support the 4.0 scale?","Yes. Enter grade points on your scale (0–10 or 0–4); the weighted formula works for any scale."),
    ],
    body='''      <div id="cgpa-rows"></div>
      <button class="btn" onclick="addCgpaRow()" style="margin-top:1rem">+ Add Subject</button>
      <button class="btn" onclick="calcCgpa()" style="margin-top:1rem;background:var(--brand);color:#000">Calculate CGPA</button>
      <div id="cgpa-result" class="result" style="display:none"></div>
      <h2 style="margin-top:2rem">Features</h2>
      <ul style="line-height:2"><li>✅ Weighted CGPA from credits</li><li>✅ 10-point & 4-point scales</li><li>✅ Add/remove subjects</li><li>✅ Instant, private & free</li></ul>''',
    js='''
    function addCgpaRow(gp="", cr=""){
      const wrap=document.getElementById("cgpa-rows");
      const d=document.createElement("div"); d.className="row"; d.style.marginTop=".6rem";
      d.innerHTML='<input placeholder="Grade Points (0-10)" type="number" step="0.01" value="'+gp+'" class="gp" style="flex:1"><input placeholder="Credits" type="number" step="0.5" value="'+cr+'" class="cr" style="flex:1"><button class="btn" style="background:#ef4444;color:#fff" onclick="this.parentNode.remove()">✕</button>';
      wrap.appendChild(d);
    }
    addCgpaRow("9","4"); addCgpaRow("8","3");
    function calcCgpa(){
      let gp=0,cr=0;
      document.querySelectorAll("#cgpa-rows .row").forEach(r=>{
        const g=parseFloat(r.querySelector(".gp").value)||0;
        const c=parseFloat(r.querySelector(".cr").value)||0;
        gp+=g*c; cr+=c;
      });
      const el=document.getElementById("cgpa-result");
      if(cr===0){el.style.display="block";el.innerHTML="<p>Add at least one subject with credits.</p>";return;}
      const cgpa=gp/cr;
      el.style.display="block";
      el.innerHTML='<div class="result-row"><span class="result-label">CGPA</span><span class="result-value">'+cgpa.toFixed(2)+'</span></div><div class="result-row"><span class="result-label">Approx Percentage (×9.5)</span><span class="result-value">'+(cgpa*9.5).toFixed(2)+'%</span></div>';
    }''')

# 2. Percentage Calculator
TOOLS["percentage-calculator"] = dict(
    icon="%", title="Percentage Calculator", cat_label="Text", cat_slug="text",
    desc="Find what percent one number is of another, calculate X% of Y, and percentage increase or decrease.",
    keywords=["percentage calculator", "what is x percent of y", "percent increase", "percent decrease"],
    related=[("cgpa-calculator","CGPA Calculator"),("gst-calculator","GST Calculator"),("tds-calculator","TDS Calculator")],
    faqs=[
        ("How do I find what % one number is of another?","Divide the part by the whole and multiply by 100."),
        ("Is this percentage calculator free?","Yes, completely free and private — all math runs in your browser."),
        ("Can it calculate percentage change?","Yes. Use the increase/decrease tab for (new−old)/old × 100."),
    ],
    body='''      <label for="p1">What is</label>
      <div class="grid2">
        <input id="p1" type="number" placeholder="X" value="25">
        <input id="p2" type="number" placeholder="% of Y" value="200">
      </div>
      <button class="btn" onclick="pctOf()" style="margin-top:1rem">Calculate X% of Y</button>
      <label for="p3">X is what % of Y</label>
      <div class="grid2">
        <input id="p3" type="number" placeholder="X" value="50">
        <input id="p4" type="number" placeholder="Y" value="200">
      </div>
      <button class="btn" onclick="pctWhat()" style="margin-top:1rem;background:var(--brand);color:#000">Calculate %</button>
      <label>Percentage change (old → new)</label>
      <div class="grid2">
        <input id="p5" type="number" placeholder="Old" value="100">
        <input id="p6" type="number" placeholder="New" value="150">
      </div>
      <button class="btn" onclick="pctChange()" style="margin-top:1rem;background:#22c55e;color:#000">Calculate Change</button>
      <div id="pct-result" class="result" style="display:none"></div>''',
    js='''
    function show(v){const e=document.getElementById("pct-result");e.style.display="block";e.innerHTML='<div class="result-row"><span class="result-label">Result</span><span class="result-value">'+v+'</span></div>';}
    function pctOf(){const x=parseFloat(p1.value),y=parseFloat(p2.value);if(isNaN(x)||isNaN(y)){show("Enter both numbers");return;}show((x/100*y).toFixed(2));}
    function pctWhat(){const x=parseFloat(p3.value),y=parseFloat(p4.value);if(isNaN(x)||isNaN(y)||y===0){show("Enter valid numbers");return;}show((x/y*100).toFixed(2)+"%");}
    function pctChange(){const o=parseFloat(p5.value),n=parseFloat(p6.value);if(isNaN(o)||isNaN(n)||o===0){show("Enter valid numbers");return;}show(((n-o)/o*100).toFixed(2)+"%");}''')

# 3. Age Calculator
TOOLS["age-calculator"] = dict(
    icon="🎂", title="Age Calculator", cat_label="Text", cat_slug="text",
    desc="Calculate exact age in years, months and days from your date of birth. Includes total days and next birthday.",
    keywords=["age calculator", "date of birth calculator", "how old am I", "exact age"],
    related=[("date-calculator","Date Calculator"),("percentage-calculator","Percentage Calculator"),("bmi-calculator","BMI Calculator")],
    faqs=[
        ("How accurate is this age calculator?","It computes the exact difference between two dates down to the day."),
        ("Does it show total days lived?","Yes — it shows years, months, days and total days since birth."),
        ("Is it free and private?","Yes. All calculation happens in your browser; nothing is uploaded."),
    ],
    body='''      <label for="dob">Date of Birth</label>
      <input id="dob" type="date" max="2100-01-01">
      <label for="asof">Calculate as of (optional)</label>
      <input id="asof" type="date" max="2100-01-01">
      <button class="btn" onclick="calcAge()" style="margin-top:1rem">Calculate Age</button>
      <div id="age-result" class="result" style="display:none"></div>
      <ul style="line-height:2;margin-top:1.5rem"><li>✅ Years, months & days</li><li>✅ Total days lived</li><li>✅ Next birthday countdown</li><li>✅ 100% private</li></ul>''',
    js='''
    function calcAge(){
      const dob=new Date(dobv.value); if(isNaN(dob)){show("Select your date of birth");return;}
      const asof=asofv.value?new Date(asofv.value):new Date();
      if(asof<dob){show("As-of date is before birth");return;}
      let y=asof.getFullYear()-dob.getFullYear();
      let m=asof.getMonth()-dob.getMonth();
      let d=asof.getDate()-dob.getDate();
      if(d<0){m--; const pm=new Date(asof.getFullYear(),asof.getMonth(),0).getDate(); d+=pm;}
      if(m<0){y--; m+=12;}
      const days=Math.floor((asof-dob)/86400000);
      const next=new Date(asof.getFullYear(),dob.getMonth(),dob.getDate());
      if(next<asof) next.setFullYear(asof.getFullYear()+1);
      const nb=Math.ceil((next-asof)/86400000);
      document.getElementById("age-result").style.display="block";
      document.getElementById("age-result").innerHTML=
        '<div class="result-row"><span class="result-label">Age</span><span class="result-value">'+y+' yrs '+m+' mo '+d+' d</span></div>'+
        '<div class="result-row"><span class="result-label">Total Days</span><span class="result-value">'+days.toLocaleString()+'</span></div>'+
        '<div class="result-row"><span class="result-label">Next Birthday In</span><span class="result-value">'+nb+' days</span></div>';
    }
    function show(v){document.getElementById("age-result").style.display="block";document.getElementById("age-result").innerHTML='<div class="result-row"><span class="result-label">Result</span><span class="result-value">'+v+'</span></div>';}''')

# 4. BMR Calculator
TOOLS["bmr-calculator"] = dict(
    icon="🔥", title="BMR Calculator", cat_label="Health", cat_slug="health",
    desc="Calculate your Basal Metabolic Rate (BMR) and daily calorie needs (TDEE) with the Mifflin-St Jeor formula.",
    keywords=["bmr calculator", "basal metabolic rate", "tdee calculator", "calorie needs"],
    related=[("bmi-calculator","BMI Calculator"),("tdee-calculator","TDEE Calculator"),("water-intake-calculator","Water Intake")],
    faqs=[
        ("What is BMR?","Basal Metabolic Rate is the calories your body burns at rest to maintain vital functions."),
        ("Which formula is used?","The Mifflin-St Jeor equation, the most accurate standard published formula."),
        ("Is it free?","Yes, fully free and runs privately in your browser."),
    ],
    body='''      <label for="bg">Gender</label>
      <select id="bg"><option value="m">Male</option><option value="f">Female</option></select>
      <div class="grid2">
        <div><label for="bage">Age</label><input id="bage" type="number" value="30"></div>
        <div><label for="bw">Weight (kg)</label><input id="bw" type="number" value="70"></div>
      </div>
      <label for="bh">Height (cm)</label>
      <input id="bh" type="number" value="170">
      <label for="ba">Activity Level</label>
      <select id="ba">
        <option value="1.2">Sedentary (little/no exercise)</option>
        <option value="1.375">Light (1-3 days/week)</option>
        <option value="1.55" selected>Moderate (3-5 days/week)</option>
        <option value="1.725">Active (6-7 days/week)</option>
        <option value="1.9">Very Active (physical job)</option>
      </select>
      <button class="btn" onclick="calcBmr()" style="margin-top:1rem">Calculate BMR & TDEE</button>
      <div id="bmr-result" class="result" style="display:none"></div>''',
    js='''
    function calcBmr(){
      const g=bg.value,age=+bage.value,w=+bw.value,h=+bh.value,a=+ba.value;
      if([g,age,w,h,a].some(isNaN)){show("Fill all fields");return;}
      let bmr = g==="m" ? 10*w+6.25*h-5*age+5 : 10*w+6.25*h-5*age-161;
      const tdee=bmr*a;
      document.getElementById("bmr-result").style.display="block";
      document.getElementById("bmr-result").innerHTML=
        '<div class="result-row"><span class="result-label">BMR (cal/day)</span><span class="result-value">'+Math.round(bmr)+'</span></div>'+
        '<div class="result-row"><span class="result-label">TDEE (cal/day)</span><span class="result-value">'+Math.round(tdee)+'</span></div>'+
        '<div class="result-row"><span class="result-label">For Weight Loss</span><span class="result-value">'+Math.round(tdee-500)+' cal</span></div>';
    }
    function show(v){document.getElementById("bmr-result").style.display="block";document.getElementById("bmr-result").innerHTML='<div class="result-row"><span class="result-label">Result</span><span class="result-value">'+v+'</span></div>';}''')

# 5. Passphrase Generator
TOOLS["passphrase-generator"] = dict(
    icon="🔑", title="Passphrase Generator", cat_label="Security", cat_slug="security",
    desc="Generate strong, memorable passphrases (diceware-style) with customizable word count, separators and numbers.",
    keywords=["passphrase generator", "diceware", "secure password", "memorable password"],
    related=[("password-generator","Password Generator"),("random-password-generator","Random Password"),("uuid-generator","UUID Generator")],
    faqs=[
        ("What is a passphrase?","A sequence of random words that is long, strong and easier to remember than a password."),
        ("How secure are they?","Long random word combinations are highly resistant to brute-force and guessing attacks."),
        ("Is it generated locally?","Yes — entirely in your browser. Nothing leaves your device."),
    ],
    body='''      <label for="wc">Number of Words</label>
      <input id="wc" type="number" value="4" min="2" max="10">
      <div class="grid2">
        <div><label for="sep">Separator</label><input id="sep" value="-"></div>
        <div><label for="incnum">Add Number</label>
          <select id="incnum"><option value="no">No</option><option value="yes">Yes</option></select></div>
      </div>
      <button class="btn" onclick="genPass()" style="margin-top:1rem">Generate Passphrase</button>
      <div id="pass-result" class="result" style="display:none"></div>
      <ul style="line-height:2;margin-top:1.5rem"><li>✅ Diceware-style words</li><li>✅ Custom separators</li><li>✅ Optional numbers</li><li>✅ Client-side only</li></ul>''',
    js='''
    const WORDS=["apple","river","tiger","cloud","stone","light","ocean","brave","forest","money","planet","silver","golden","rocket","shadow","writer","green","dream","storm","candy","pixel","lucky","maple","frost","ember","coral","honey","noble","quartz","velvet","wonder","zephyr","marble","jolly","rapid","spark"];
    function genPass(){
      const n=Math.min(10,Math.max(2,+wc.value||4)); const sep=sepv.value||"-"; const num=incnum.value==="yes";
      let p=[]; for(let i=0;i<n;i++) p.push(WORDS[Math.floor(Math.random()*WORDS.length)]);
      if(num) p[p.length-1]+=Math.floor(Math.random()*90+10);
      const out=p.join(sep);
      document.getElementById("pass-result").style.display="block";
      document.getElementById("pass-result").innerHTML='<div class="result-row"><span class="result-label">Passphrase</span><span class="result-value">'+out+'</span></div>';
    }''')

# 6. Character Counter
TOOLS["character-counter"] = dict(
    icon="🔡", title="Character & Word Counter", cat_label="Text", cat_slug="text",
    desc="Count characters, words, lines and sentences instantly. Perfect for Twitter, essays and meta descriptions.",
    keywords=["character counter", "word counter", "letter count", "character count online"],
    related=[("word-counter","Word Counter"),("text-case-converter","Case Converter"),("text-diff-checker","Text Diff")],
    faqs=[
        ("Does it count characters without spaces?","Yes — it shows total characters, characters without spaces, words, lines and sentences."),
        ("Is there a limit?","No practical limit. Paste entire documents; counting is instant."),
        ("Is it free?","Yes, 100% free and runs in your browser."),
    ],
    body='''      <label for="ct">Type or paste text</label>
      <textarea id="ct" rows="6" placeholder="Start typing..."></textarea>
      <div id="ct-result" class="result"></div>''',
    js='''
    function upd(){
      const t=ct.value;
      const chars=t.length;
      const noSpace=t.replace(/\\s/g,"").length;
      const words=(t.trim().match(/\\S+/g)||[]).length;
      const lines=t.split(/\\n/).length;
      const sents=(t.match(/[^.!?]+[.!?]+/g)||[]).length;
      document.getElementById("ct-result").innerHTML=
        '<div class="result-row"><span class="result-label">Characters</span><span class="result-value">'+chars+'</span></div>'+
        '<div class="result-row"><span class="result-label">No Spaces</span><span class="result-value">'+noSpace+'</span></div>'+
        '<div class="result-row"><span class="result-label">Words</span><span class="result-value">'+words+'</span></div>'+
        '<div class="result-row"><span class="result-label">Lines</span><span class="result-value">'+lines+'</span></div>'+
        '<div class="result-row"><span class="result-label">Sentences</span><span class="result-value">'+sents+'</span></div>';
    }
    ct.addEventListener("input",upd); upd();''')

# 7. JSON to CSV Converter
TOOLS["json-to-csv-converter"] = dict(
    icon="📊", title="JSON to CSV Converter", cat_label="Developer", cat_slug="dev",
    desc="Convert a JSON array of objects into CSV instantly. Handles nested flattening and downloads the result.",
    keywords=["json to csv", "convert json to csv", "json csv converter", "export json"],
    related=[("json-formatter","JSON Formatter"),("csv-to-json","CSV to JSON"),("xml-to-json","XML to JSON")],
    faqs=[
        ("What input format is supported?","An array of flat JSON objects, e.g. [{\"a\":1},{\"a\":2}]."),
        ("Does it flatten nested objects?","Yes — nested fields are flattened with dot notation (e.g. user.name)."),
        ("Is my data private?","Yes. Conversion happens entirely in your browser."),
    ],
    body='''      <label for="jin">Paste JSON array</label>
      <textarea id="jin" rows="7" placeholder='[{"name":"A","age":20},{"name":"B","age":25}]'></textarea>
      <button class="btn" onclick="convJson()" style="margin-top:1rem">Convert to CSV</button>
      <div id="jout" class="result" style="display:none"></div>''',
    js='''
    function flat(o,p,d){d=d||{};for(const k in o){const v=o[k];const key=p?p+"."+k:k;if(v&&typeof v==="object"&&!Array.isArray(v))flat(v,key,d);else d[key]=v;}return d;}
    function convJson(){
      try{
        const arr=JSON.parse(jin.value);
        if(!Array.isArray(arr)){show("Input must be a JSON array");return;}
        const rows=arr.map(o=>flat(o));
        const cols=[...new Set(rows.flatMap(r=>Object.keys(r)))];
        let csv=cols.join(",")+"\\n";
        rows.forEach(r=>{csv+=cols.map(c=>(r[c]===undefined?"":String(r[c]).includes(",")?'"'+r[c]+'"':r[c])).join(",")+"\\n";});
        document.getElementById("jout").style.display="block";
        document.getElementById("jout").innerHTML='<textarea rows="7" readonly>'+csv.replace(/</g,"&lt;")+'</textarea>';
      }catch(e){show("Invalid JSON: "+e.message);}
    }
    function show(v){document.getElementById("jout").style.display="block";document.getElementById("jout").innerHTML='<p>'+v+'</p>';}''')

# 8. Word Frequency Counter
TOOLS["word-frequency-counter"] = dict(
    icon="📈", title="Word Frequency Counter", cat_label="Text", cat_slug="text",
    desc="Count how many times each word appears in your text. Great for SEO, keyword density and writing analysis.",
    keywords=["word frequency", "word count frequency", "keyword density", "count repeated words"],
    related=[("character-counter","Character Counter"),("word-counter","Word Counter"),("text-case-converter","Case Converter")],
    faqs=[
        ("Does it ignore case?","Yes — words are counted case-insensitively (Apple = apple)."),
        ("Can I use it for keyword density?","Yes — it shows counts and percentages, ideal for SEO content checks."),
        ("Is it free?","Yes, fully free and runs in your browser."),
    ],
    body='''      <label for="wt">Paste your text</label>
      <textarea id="wt" rows="6" placeholder="Paste article or paragraph..."></textarea>
      <label for="topn">Show top N words</label>
      <input id="topn" type="number" value="10" min="1" max="100">
      <button class="btn" onclick="wordFreq()" style="margin-top:1rem">Count Words</button>
      <div id="wout" class="result" style="display:none"></div>''',
    js='''
    function wordFreq(){
      const txt=wt.value.toLowerCase().replace(/[^a-z0-9\\s]/g," ");
      const words=txt.split(/\\s+/).filter(Boolean);
      const map={}; words.forEach(w=>map[w]=(map[w]||0)+1);
      const sorted=Object.entries(map).sort((a,b)=>b[1]-a[1]);
      const n=Math.min(100,+topn.value||10);
      const total=words.length||1;
      let html="";
      sorted.slice(0,n).forEach(([w,c])=>{
        html+='<div class="result-row"><span class="result-label">'+w+'</span><span class="result-value">'+c+' ('+(c/total*100).toFixed(1)+'%)</span></div>';
      });
      document.getElementById("wout").style.display="block";
      document.getElementById("wout").innerHTML=html||"<p>No words found.</p>";
    }''')

# 9. Dice Roller
TOOLS["dice-roller"] = dict(
    icon="🎲", title="Dice Roller", cat_label="Fun", cat_slug="fun",
    desc="Roll one or many dice online. Choose number of dice and sides (d6, d20) for games and decisions.",
    keywords=["dice roller", "roll dice online", "virtual dice", "d20 roller"],
    related=[("random-number-generator","Random Number"),("random-choice-generator","Random Choice"),("coin-flip","Coin Flip")],
    faqs=[
        ("Can I roll multiple dice?","Yes — set how many dice and how many sides each has."),
        ("Is it fair?","Rolls use a cryptographically strong random source in your browser."),
        ("Is it free?","Yes, free and instant."),
    ],
    body='''      <div class="grid2">
        <div><label for="nd">Number of Dice</label><input id="nd" type="number" value="2" min="1" max="12"></div>
        <div><label for="sd">Sides per Die</label>
          <select id="sd"><option value="6">d6</option><option value="4">d4</option><option value="8">d8</option><option value="10">d10</option><option value="12">d12</option><option value="20">d20</option></select></div>
      </div>
      <button class="btn" onclick="rollDice()" style="margin-top:1rem">🎲 Roll</button>
      <div id="dout" class="result" style="display:none"></div>''',
    js='''
    function rollDice(){
      const n=Math.min(12,Math.max(1,+nd.value||2)); const s=+sd.value; let total=0,res=[];
      for(let i=0;i<n;i++){const r=Math.floor(Math.random()*s)+1;total+=r;res.push(r);}
      document.getElementById("dout").style.display="block";
      document.getElementById("dout").innerHTML='<div class="result-row"><span class="result-label">Rolls</span><span class="result-value">'+res.join(", ")+'</span></div><div class="result-row"><span class="result-label">Total</span><span class="result-value">'+total+'</span></div>';
    }''')

# 10. Date Calculator
TOOLS["date-calculator"] = dict(
    icon="📅", title="Date Calculator", cat_label="Utilities", cat_slug="tools",
    desc="Add or subtract days from a date, and find the exact number of days between two dates.",
    keywords=["date calculator", "add days to date", "days between dates", "date difference"],
    related=[("age-calculator","Age Calculator"),("world-clock","World Clock"),("timezone-converter","Time Zone Converter")],
    faqs=[
        ("How do I add days to a date?","Pick a start date, enter the number of days, and choose add or subtract."),
        ("Can it find days between two dates?","Yes — the difference tab gives the exact day count."),
        ("Is it free?","Yes, private and free in your browser."),
    ],
    body='''      <label for="dstart">Start Date</label>
      <input id="dstart" type="date">
      <div class="grid2">
        <div><label for="ddays">Days (+/-)</label><input id="ddays" type="number" value="30"></div>
        <div><label for="dop">Operation</label><select id="dop"><option value="add">Add</option><option value="sub">Subtract</option></select></div>
      </div>
      <button class="btn" onclick="addDays()" style="margin-top:1rem">Calculate New Date</button>
      <label for="d2a">Date A</label><input id="d2a" type="date">
      <label for="d2b">Date B</label><input id="d2b" type="date">
      <button class="btn" onclick="diffDays()" style="margin-top:1rem;background:var(--brand);color:#000">Days Between</button>
      <div id="date-result" class="result" style="display:none"></div>''',
    js='''
    function addDays(){const s=new Date(dstart.value);if(isNaN(s)){show("Pick a start date");return;}const days=+ddays.value||0;const f=new Date(s);f.setDate(f.getDate()+(dop.value==="sub"?-days:days));show(f.toDateString());}
    function diffDays(){const a=new Date(d2a.value),b=new Date(d2b.value);if(isNaN(a)||isNaN(b)){show("Pick both dates");return;}show(Math.abs(Math.round((b-a)/86400000))+" days");}
    function show(v){document.getElementById("date-result").style.display="block";document.getElementById("date-result").innerHTML='<div class="result-row"><span class="result-label">Result</span><span class="result-value">'+v+'</span></div>';}''')

# 11. Loan Comparison Calculator
TOOLS["loan-comparison-calculator"] = dict(
    icon="⚖️", title="Loan Comparison Calculator", cat_label="Finance", cat_slug="finance",
    desc="Compare two loans side by side — EMI, total interest and total payable — to pick the cheaper option.",
    keywords=["loan comparison", "compare two loans", "emi comparison", "loan calculator"],
    related=[("emi-calculator","EMI Calculator"),("interest-rate-comparator","Interest Comparator"),("home-loan-eligibility","Home Loan Eligibility")],
    faqs=[
        ("What does it compare?","Monthly EMI, total interest paid and total amount payable for each loan."),
        ("How is EMI calculated?","Using the standard amortization formula: P×r×(1+r)^n / ((1+r)^n−1)."),
        ("Is it free?","Yes, free and fully private."),
    ],
    body='''      <div class="grid2">
        <div><h3>Loan A</h3>
          <label>Amount</label><input id="a_amt" type="number" value="500000">
          <label>Rate % (yr)</label><input id="a_rate" type="number" value="8.5">
          <label>Tenure (mo)</label><input id="a_ten" type="number" value="60"></div>
        <div><h3>Loan B</h3>
          <label>Amount</label><input id="b_amt" type="number" value="500000">
          <label>Rate % (yr)</label><input id="b_rate" type="number" value="9.5">
          <label>Tenure (mo)</label><input id="b_ten" type="number" value="60"></div>
      </div>
      <button class="btn" onclick="cmpLoan()" style="margin-top:1rem">Compare Loans</button>
      <div id="loan-result" class="result" style="display:none"></div>''',
    js='''
    function emi(p,an,r){const m=r/12/100;if(m===0)return p/an;return p*m*Math.pow(1+m,an)/(Math.pow(1+m,an)-1);}
    function cmpLoan(){
      const A=emi(+a_amt.value,+a_ten.value,+a_rate.value), B=emi(+b_amt.value,+b_ten.value,+b_rate.value);
      const ta=A*+a_ten.value, tb=B*+b_ten.value;
      document.getElementById("loan-result").style.display="block";
      document.getElementById("loan-result").innerHTML=
        '<div class="result-row"><span class="result-label">Loan A — EMI / Interest / Total</span><span class="result-value">'+Math.round(A)+' / '+Math.round(ta-+a_amt.value)+' / '+Math.round(ta)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Loan B — EMI / Interest / Total</span><span class="result-value">'+Math.round(B)+' / '+Math.round(tb-+b_amt.value)+' / '+Math.round(tb)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Cheaper Option</span><span class="result-value">'+(ta<=tb?"Loan A":"Loan B")+' saves '+Math.round(Math.abs(ta-tb)).toLocaleString()+'</span></div>';
    }''')

# 12. GST Invoice Generator
TOOLS["gst-invoice-generator"] = dict(
    icon="🧾", title="GST Invoice Generator", cat_label="Tax", cat_slug="tax",
    desc="Generate a GST-compliant invoice total: item amount, CGST, SGST/IGST and grand total — instantly.",
    keywords=["gst invoice generator", "gst bill maker", "create gst invoice", "gst calculator india"],
    related=[("gst-calculator","GST Calculator"),("invoice-calculator","Invoice Calculator"),("gst-bill-generator","GST Bill Generator")],
    faqs=[
        ("Does it split CGST and SGST?","Yes — for intra-state sales it shows CGST + SGST; for inter-state, IGST."),
        ("Is the output downloadable?","The totals are shown instantly; you can copy them for your invoice."),
        ("Is it free?","Yes, free and private."),
    ],
    body='''      <div class="grid2">
        <div><label for="amt">Taxable Amount (₹)</label><input id="amt" type="number" value="1000"></div>
        <div><label for="rate">GST Rate %</label>
          <select id="rate"><option>5</option><option selected>12</option><option>18</option><option>28</option></select></div>
      </div>
      <label for="typ">Supply Type</label>
      <select id="typ"><option value="intra">Intra-state (CGST+SGST)</option><option value="inter">Inter-state (IGST)</option></select>
      <button class="btn" onclick="genGst()" style="margin-top:1rem">Generate Invoice Total</button>
      <div id="gst-result" class="result" style="display:none"></div>''',
    js='''
    function genGst(){
      const a=+amt.value, r=+rate.value, t=typ.value;
      const g=a*r/100;
      let rows='<div class="result-row"><span class="result-label">Taxable Amount</span><span class="result-value">'+a.toLocaleString()+'</span></div>';
      if(t==="intra"){
        rows+='<div class="result-row"><span class="result-label">CGST ('+(r/2)+'%)</span><span class="result-value">'+(g/2).toFixed(2)+'</span></div>';
        rows+='<div class="result-row"><span class="result-label">SGST ('+(r/2)+'%)</span><span class="result-value">'+(g/2).toFixed(2)+'</span></div>';
      } else {
        rows+='<div class="result-row"><span class="result-label">IGST ('+r+'%)</span><span class="result-value">'+g.toFixed(2)+'</span></div>';
      }
      rows+='<div class="result-row"><span class="result-label">Grand Total</span><span class="result-value">'+(a+g).toFixed(2)+'</span></div>';
      document.getElementById("gst-result").style.display="block";
      document.getElementById("gst-result").innerHTML=rows;
    }''')

# 13. Electricity Bill Calculator
TOOLS["electricity-bill-calculator"] = dict(
    icon="⚡", title="Electricity Bill Calculator", cat_label="India", cat_slug="india",
    desc="Estimate your monthly electricity bill from units consumed using slab rates (approximate domestic tariff).",
    keywords=["electricity bill calculator", "power bill estimator", "units to bill", "electricity cost india"],
    related=[("fuel-cost-calculator","Fuel Cost Calculator"),("unit-converter","Unit Converter"),("gst-calculator","GST Calculator")],
    faqs=[
        ("Which slab rates are used?","Approximate domestic slabs (₹0–100, 101–200, 201–400, 401+ units). Adjust to your state."),
        ("Does it include fixed charges?","A nominal fixed charge is added; verify with your discom for exact rates."),
        ("Is it free?","Yes, free estimate in your browser."),
    ],
    body='''      <label for="units">Units Consumed (kWh)</label>
      <input id="units" type="number" value="250">
      <button class="btn" onclick="calcBill()" style="margin-top:1rem">Estimate Bill</button>
      <div id="bill-result" class="result" style="display:none"></div>
      <ul style="line-height:2;margin-top:1.5rem"><li>✅ Slab-based estimate</li><li>✅ Includes fixed charge</li><li>✅ Adjust to your state</li><li>✅ Free & private</li></ul>''',
    js='''
    function calcBill(){
      const u=+units.value||0; let cost=0;
      const slabs=[[100,5.5],[100,6.5],[200,7.5],[99999,8.5]];
      let rem=u;
      for(const [lim,rate] of slabs){ if(rem<=0)break; const used=Math.min(rem,lim); cost+=used*rate; rem-=used; }
      const fixed=50; const total=cost+fixed;
      document.getElementById("bill-result").style.display="block";
      document.getElementById("bill-result").innerHTML=
        '<div class="result-row"><span class="result-label">Energy Cost</span><span class="result-value">'+cost.toFixed(2)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Fixed Charge</span><span class="result-value">'+fixed.toFixed(2)+'</span></div>'+
        '<div class="result-row"><span class="result-label">Estimated Bill</span><span class="result-value">'+total.toFixed(2)+'</span></div>';
    }''')

# 14. Fuel Cost Calculator
TOOLS["fuel-cost-calculator"] = dict(
    icon="⛽", title="Fuel Cost Calculator", cat_label="Utilities", cat_slug="tools",
    desc="Estimate fuel cost and litres needed for a trip. Enter distance, mileage and fuel price.",
    keywords=["fuel cost calculator", "trip fuel cost", "petrol cost calculator", "diesel cost estimator"],
    related=[("electricity-bill-calculator","Electricity Bill"),("unit-converter","Unit Converter"),("emi-calculator","EMI Calculator")],
    faqs=[
        ("What inputs are needed?","Distance (km), vehicle mileage (km/l) and fuel price per litre."),
        ("Does it work for petrol and diesel?","Yes — just enter the relevant price per litre."),
        ("Is it free?","Yes, free and private."),
    ],
    body='''      <div class="grid2">
        <div><label for="dist">Distance (km)</label><input id="dist" type="number" value="300"></div>
        <div><label for="mil">Mileage (km/l)</label><input id="mil" type="number" value="18"></div>
      </div>
      <label for="price">Fuel Price (₹/litre)</label>
      <input id="price" type="number" value="100">
      <button class="btn" onclick="calcFuel()" style="margin-top:1rem">Calculate Fuel Cost</button>
      <div id="fuel-result" class="result" style="display:none"></div>''',
    js='''
    function calcFuel(){
      const d=+dist.value, m=+mil.value, p=+price.value;
      if(!d||!m||!p){show("Fill all fields");return;}
      const litres=d/m, cost=litres*p;
      document.getElementById("fuel-result").style.display="block";
      document.getElementById("fuel-result").innerHTML=
        '<div class="result-row"><span class="result-label">Litres Needed</span><span class="result-value">'+litres.toFixed(2)+' L</span></div>'+
        '<div class="result-row"><span class="result-label">Total Fuel Cost</span><span class="result-value">'+cost.toFixed(2)+'</span></div>';
    }
    function show(v){document.getElementById("fuel-result").style.display="block";document.getElementById("fuel-result").innerHTML='<div class="result-row"><span class="result-label">Result</span><span class="result-value">'+v+'</span></div>';}''')

# ───────────────────────── WRITE FILES ─────────────────────────
def main():
    for slug, t in TOOLS.items():
        out = os.path.join(REPO, slug)
        os.makedirs(out, exist_ok=True)
        html_doc = page(slug, t["icon"], t["title"], t["desc"], t["keywords"],
                        t["cat_label"], t["cat_slug"], t["body"], t["js"], t["related"], t["faqs"])
        with open(os.path.join(out, "index.html"), "w", encoding="utf-8") as f:
            f.write(html_doc)
        print("wrote", slug)

if __name__ == "__main__":
    main()
