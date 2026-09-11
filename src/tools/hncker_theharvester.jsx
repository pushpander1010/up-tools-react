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
  { q: "What is theHarvester?", a: "theHarvester is an OSINT collector: give it your domain and a public source (Bing, crt.sh, ThreatMiner) and it returns emails, subdomains, hosts and IPs it found. It only reads public data — but it shows how much of your organization is already public." },
  { q: "Is theHarvester illegal?", a: "It queries public search engines and certificate logs, which is passive recon. Still, run it only on your own domains or permitted targets, and never spam or harass harvested addresses." },
  { q: "What does -b do?", a: "-b picks the data source: bing, crtsh, threatminer, urlscan and more. Different sources see different slices, so run two or three and merge the results for full coverage." },
  { q: "How do I find subdomains with it?", a: "Run theHarvester -d example.com -b crtsh. Certificate transparency logs record every TLS certificate, including subdomains — a goldmine attackers check first, so you should check yours." },
  { q: "Why does it find old emails?", a: "Search engines cache for years. An address from a 2019 PDF still appears today and still gets phished. That persistence is why generic contact addresses beat personal ones." },
  { q: "What is the difference between active and passive recon?", a: "Passive (theHarvester, crt.sh) reads third-party public data without touching the target. Active (Nmap, Gobuster) sends packets to the target. Passive is quieter and safer to start with." },
  { q: "How do I use the results?", a: "Feed discovered subdomains into Subfinder/Gobuster for active checks, hand emails to your phishing-training team, and delete or protect anything that should never have been public." },
  { q: "How do I shrink my footprint?", a: "Use generic contact emails, strip document metadata before uploading, delete stale DNS records, and search your own domain monthly. If theHarvester finds it in seconds, so does everyone else." },
]

const howItWorks = [
  "Install theHarvester and list its sources.",
  "Harvest emails for your own domain via Bing.",
  "Harvest subdomains via certificate logs.",
  "Save an HTML report and review the footprint.",
  "Shrink exposure: generic emails, clean DNS, no metadata.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "theHarvester — OSINT Collector Guide (Educational)",
      description: "Step-by-step theHarvester reference: harvest emails and subdomains from public sources, plus footprint defense.",
      about: "theHarvester OSINT collector",
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

export default function hncker_theharvester() {
  return (
    <ToolLayout
      title="theHarvester — OSINT Collector Guide"
      desc="Step-by-step theHarvester reference: harvest emails, subdomains and hosts from public sources for your own domain. Educational use only."
      icon="🌾"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/theharvester"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/theharvester/theharvester_scan.png" />
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
              <p className="text-sm font-semibold text-white m-0">theHarvester — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        theHarvester reads public sources, but use it <b>only on your own domains or targets with written permission</b>. Spamming or harassing harvested addresses is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🌾" title="What is theHarvester?" subtitle="See what the internet knows about you">
        <p>
          <b>theHarvester</b> collects what the public internet already knows about a domain: emails, subdomains, hosts. One command against your own domain shows the raw material of every phishing email aimed at you.
        </p>
        <p>
          Run it monthly on your own organization: every exposed address and forgotten subdomain is a fix — generic inboxes, cleaned DNS, stripped metadata — before attackers harvest the same list.
        </p>
        <FeatureGrid items={[
  { i: "📧", t: "Emails", d: "Addresses linked to your domain." },
  { i: "🌐", t: "Subdomains", d: "Via cert logs and search engines." },
  { i: "🖥️", t: "Hosts + IPs", d: "Infrastructure mapped passively." },
  { i: "🦹", t: "Many sources", d: "Bing, crt.sh, ThreatMiner, more." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) or Python 3.9+", "Your own domain to investigate", "Internet access to public sources (Bing, crt.sh)", "Written permission if the domain is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`theHarvester -h
# theHarvester 4.x ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install theharvester`} />
        <InfoBox title="Kali has it already">
          On Kali Linux theHarvester is pre-installed — <span className="font-mono">theHarvester -h</span> confirms it. Or clone GitHub and <span className="font-mono">pip install -r requirements.txt</span> for the newest sources.
        </InfoBox>
      </Section>

      <Section id="emails" icon="📧" title="Step 1 — Harvest Emails" subtitle="Find exposed addresses">
        <p className="text-xs text-slate-400">Harvest emails linked to your own domain:</p>
        <CodeBlock title="terminal" lines={`theHarvester -d example.com -l 500 -b bing
# 23 emails: j.smith@, accounts@, ...`} />
        <InfoBox title="Phishing material">
          Work emails in results are phishing targets. Note which departments leak most — that is where awareness training goes first.
        </InfoBox>
      </Section>

      <Section id="subdomains" icon="🌐" title="Step 2 — Harvest Subdomains" subtitle="Map via cert logs">
        <p className="text-xs text-slate-400">Pull subdomains from certificate transparency logs:</p>
        <CodeBlock title="terminal" lines={`theHarvester -d example.com -l 500 -b crtsh
# dev.example.com, vpn.example.com, ...`} />
        <InfoBox title="Attack surface list">
          Every subdomain is attack surface: dev, staging, old portals. Export this list — it becomes the input for your Subfinder and Gobuster runs.
        </InfoBox>
      </Section>

      <Section id="report" icon="📄" title="Step 3 — More Sources, Full Report" subtitle="Combine and save">
        <p className="text-xs text-slate-400">Try a third source and save an HTML report:</p>
        <CodeBlock title="terminal" lines={`theHarvester -d example.com -l 500 -b threatminer -f report.html
# report saved: hosts, IPs, emails`} />
        <InfoBox title="Merge sources">
          Different sources see different data: Bing has emails, crt.sh has subdomains, ThreatMiner has infrastructure. Merge all three for the full picture.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Reduce Your Footprint" subtitle="Shrink what the internet knows">
        <CodeBlock title="terminal" lines={`Limit what you publish:
# generic contact@, no staff emails`} />
        <FeatureGrid items={[
  { i: "📧", t: "Generic emails", d: "Publish contact@, never firstname.lastname@." },
  { i: "🔒", t: "Remove metadata", d: "Strip EXIF from every uploaded file." },
  { i: "🌐", t: "Audit subdomains", d: "Delete forgotten DNS records." },
  { i: "👁️", t: "Google yourself", d: "What you find, attackers find." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="theHarvester in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/theharvester/theharvester_scan.png" alt="theHarvester terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">theHarvester listing emails and subdomains</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["-d", "Target domain, e.g. -d example.com."], ["-b", "Source: bing, crtsh, threatminer, urlscan."], ["-l", "Limit results, e.g. -l 500."], ["-f", "Save report: -f out.html."], ["-c", "Also brute-force DNS (noisier)."], ["-s", "Start at result number N (paging)."], ["-v / -h", "Verbose output / help with source list."], ["-S", "Also search LinkedIn and people sources."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Source returns nothing", "Free-source APIs change often. Run -h to see working sources, try crtsh and threatminer, and update the tool — old versions lose sources first."], ["Bing blocks after a few runs", "Rate-limiting. Lower -l, wait between runs, or switch source. Aggressive paging against search engines gets throttled fast."], ["Module import errors on GitHub clone", "Python deps missing. Run pip install -r requirements.txt inside the project, preferably in a venv, with Python 3.9+."], ["Results look stale", "Search caches lag reality. Cross-check crt.sh live for subdomains and treat email lists as historical — verify before acting."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "theHarvester on GitHub", "https://github.com/laramies/theHarvester"], ["📖", "crt.sh certificate search", "https://crt.sh/"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. theHarvester queries public sources, but use it only on your own domains or targets with written permission. Harassing people with harvested emails is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
