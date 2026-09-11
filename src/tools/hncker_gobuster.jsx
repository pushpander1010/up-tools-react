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
  { q: "What is Gobuster?", a: "Gobuster is a fast Go tool that finds hidden web content by trying wordlist entries as URLs: /admin, /backup.zip, /api/v2. Attackers use it to find forgotten pages; defenders use it to find what they forgot to protect." },
  { q: "Is Gobuster illegal?", a: "The tool is legal for audits. Fuzzing sites you do not own can count as unauthorized access and can overload small servers, so stick to your own labs (DVWA, Juice Shop) or permitted targets." },
  { q: "What is the difference between dir, dns and vhost modes?", a: "dir mode brute-forces URL paths on a site. dns mode brute-forces subdomains via DNS lookups. vhost mode brute-forces virtual hosts on one IP by changing the Host header — three views of the same guessing game." },
  { q: "Which wordlist should I start with?", a: "For labs, the small directory-list-2.3-medium list is the classic start; SecLists raft files go deeper. Bigger lists find more but take longer and hit harder — match the list to the lab, not the internet." },
  { q: "What do status codes 200, 301, 403 mean here?", a: "200 means the path exists and opened. 301/302 is a redirect — follow it, something lives there. 403 means forbidden: the path exists but needs auth, which is itself a finding worth noting." },
  { q: "How do I fuzz subdomains with Gobuster?", a: "Use dns mode with your lab domain: gobuster dns -d example.lab -w subdomains.txt. It resolves each guess and reports the ones with DNS records — the same recon attackers run before anything else." },
  { q: "Why do I get thousands of false positives?", a: "Wildcard responses: the server answers 200 to everything. Calibrate with a random string first, note its length, then use --exclude-length to hide that size from results." },
  { q: "How do I protect my site from Gobuster?", a: "Require auth on every sensitive path, disable directory listing, rate-limit 404-heavy clients, and monitor logs for enumeration patterns. Then run Gobuster against your own staging: what you find first, attackers never will." },
]

const howItWorks = [
  "Install Gobuster and grab a SecLists wordlist.",
  "Fuzz directories on your own DVWA lab.",
  "Add extensions and read status codes.",
  "Fuzz subdomains in dns mode on your lab domain.",
  "Lock down findings: auth, no listing, rate limits.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Gobuster — Directory Fuzzer Guide (Educational)",
      description: "Step-by-step Gobuster reference: directory, DNS and vhost brute-forcing on lab apps, plus defense.",
      about: "Gobuster directory fuzzer",
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

export default function hncker_gobuster() {
  return (
    <ToolLayout
      title="Gobuster — Directory Fuzzer Guide"
      desc="Step-by-step Gobuster reference: directory, DNS and vhost brute-forcing on your own lab apps (DVWA, OWASP Juice Shop). Educational use only."
      icon="📂"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/gobuster"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/gobuster/gobuster_scan.png" />
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
              <p className="text-sm font-semibold text-white m-0">Gobuster — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Gobuster fires thousands of requests at servers. Run it <b>only on your own lab apps (DVWA, OWASP Juice Shop) or targets with written permission</b>. Fuzzing any other site is illegal and can take small servers down. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="📂" title="What is Gobuster?" subtitle="Find hidden pages and subdomains">
        <p>
          <b>Gobuster</b> guesses URLs at high speed: feed it a wordlist and it reports which paths exist — admin panels, backups, config files, APIs. Forgotten pages are among the most common real findings.
        </p>
        <p>
          Run it against your own staging before anyone else does: every hidden page you find is one you can protect, delete or put behind login — instead of reading about it in an incident report.
        </p>
        <FeatureGrid items={[
  { i: "⚡", t: "Very fast", d: "Go speed: thousands of requests fast." },
  { i: "📁", t: "Dir mode", d: "Find hidden pages and files." },
  { i: "🌐", t: "DNS + vhost", d: "Find hidden subdomains too." },
  { i: "🎯", t: "Smart filters", d: "Hide sizes, codes and wildcards." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) or Ubuntu/Debian", "A lab target: DVWA or Juice Shop on localhost", "A wordlist (SecLists directory-list-2.3-medium)", "Written permission if anything is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`gobuster version
# gobuster v3.x ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install gobuster`} />
        <InfoBox title="Kali has it already">
          On Kali Linux Gobuster is pre-installed. Debian/Ubuntu users install the <span className="font-mono">gobuster</span> package; wordlists live in <span className="font-mono">/usr/share/wordlists/</span> (SecLists) after installing seclists.
        </InfoBox>
      </Section>

      <Section id="dir" icon="📁" title="Step 1 — Directory Fuzzing" subtitle="Guess hidden paths">
        <p className="text-xs text-slate-400">Fuzz directories on your own DVWA lab:</p>
        <CodeBlock title="terminal" lines={`gobuster dir -u http://localhost/dvwa -w common.txt
/admin (301) /config (403) /login (200)`} />
        <InfoBox title="Read the codes">
          200 opens, 301 redirects somewhere real, 403 exists-but-forbidden. Write down every non-404: each is a page to inspect or a finding to fix.
        </InfoBox>
      </Section>

      <Section id="ext" icon="🗄️" title="Step 2 — Extensions" subtitle="Try file extensions">
        <p className="text-xs text-slate-400">Repeat while also trying file extensions:</p>
        <CodeBlock title="terminal" lines={`gobuster dir -u http://localhost -w common.txt -x php,txt,bak,old
/backup.bak (200) jackpot`} />
        <InfoBox title="Hunt backups">
          Backups (.bak, .old, .zip) are jackpot files: source code and credentials in one download. Finding them in your lab teaches you to block them in production.
        </InfoBox>
      </Section>

      <Section id="dns" icon="🌐" title="Step 3 — DNS Mode" subtitle="Guess subdomains">
        <p className="text-xs text-slate-400">Fuzz subdomains of your lab domain:</p>
        <CodeBlock title="terminal" lines={`gobuster dns -d target.lab -w subdomains.txt
Found: dev.target.lab admin.target.lab`} />
        <InfoBox title="Map the zone">
          Dev, staging and old subdomains inherit weak configs. Map them in the lab, then make sure your real DNS has no forgotten entries pointing anywhere.
        </InfoBox>
      </Section>

      <Section id="wild" icon="🎯" title="Step 4 — Exclude Wildcards" subtitle="Filter false hits">
        <p className="text-xs text-slate-400">Kill wildcard false positives by length:</p>
        <CodeBlock title="terminal" lines={`curl -s http://localhost/nope-xyz | wc -c
# 1234 -> rerun with --exclude-length 1234`} />
        <InfoBox title="Calibrate first">
          One random request first sets the baseline: if gibberish returns 200 with length 1234, exclude 1234 and the real hits stand out instantly.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Shrink the Attack Surface" subtitle="Leave nothing unlisted-or-open">
        <CodeBlock title="terminal" lines={`Disallow: /admin
# plus auth on every sensitive path`} />
        <FeatureGrid items={[
  { i: "🔒", t: "Auth everything", d: "Sensitive paths need login + role check." },
  { i: "🚫", t: "No listing", d: "Disable directory indexes server-wide." },
  { i: "🤖", t: "Rate limits", d: "Slow enumeration to a crawl." },
  { i: "📄", t: "robots.txt hygiene", d: "Never list paths you will not protect." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Gobuster in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/gobuster/gobuster_scan.png" alt="Gobuster terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">A Gobuster run listing hidden admin paths</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["dir", "Directory/file brute-forcing mode."], ["dns", "Subdomain brute-forcing via DNS."], ["vhost", "Virtual-host brute-forcing via Host header."], ["-u", "Target base URL, e.g. -u http://localhost."], ["-w", "Wordlist path for guessing."], ["-x", "Also try extensions: -x php,txt,bak."], ["-s / -b", "Show (-s) or hide (-b) status codes."], ["--exclude-length", "Hide wildcard response sizes."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["No results at all", "Wrong URL (missing path or scheme), a tiny wordlist, or the lab app is down. Verify with curl first, then run with -v to watch requests go out."], ["Everything returns 200", "Wildcard responses. Request one random path, note the response length, and rerun with --exclude-length <that size>."], ["Connection refused / timeouts", "Lab app not running or -t threads too high for it. Start at -t 10 with --delay 100ms on fragile lab VMs."], ["dns mode finds nothing", "No DNS server knows your guesses, or you need -r to point at the lab resolver. Confirm one known subdomain resolves manually first."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Gobuster on GitHub", "https://github.com/OJ/gobuster"], ["📖", "SecLists wordlists", "https://github.com/danielmiessler/SecLists"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Gobuster hammers servers with thousands of requests, so run it only on your own lab apps (DVWA, OWASP Juice Shop) or targets with written permission. Fuzzing anyone else is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
