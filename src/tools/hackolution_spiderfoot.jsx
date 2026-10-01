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
    <div className="rounded-xl p-4 border border-red-500/30 mb-6" style={{ background: 'rgba(239,68,68,0.07)' }}>
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
  { q: 'What is SpiderFoot?', a: 'SpiderFoot is an open-source OSINT automation tool that gathers intelligence about IP addresses, domains, emails, phone numbers, usernames, and more. It ships 100+ modules that feed each other in a publisher/subscriber model, runs from a web UI on port 5001 or fully from the command line, and is MIT-licensed.' },
  { q: 'Is using SpiderFoot legal?', a: 'SpiderFoot itself is a legitimate open-source security research tool. It is legal to use only on targets you own or have explicit permission to research. Scraping third-party sites without authorization, or ignoring each data source Terms of Service and rate limits, can violate computer misuse laws.' },
  { q: 'How do I install SpiderFoot on Kali Linux?', a: 'Kali ships SpiderFoot as a package: run `sudo apt install spiderfoot -y`. To get the latest modules from source, run `git clone https://github.com/smicallef/spiderfoot && cd spiderfoot && pip3 install -r requirements.txt`. Python 3.7 or newer is required.' },
  { q: 'How do I run my first SpiderFoot scan?', a: 'Start the web interface with `python3 sf.py -l 127.0.0.1:5001`, browse to http://127.0.0.1:5001, create a new scan, enter your target such as an email address or domain, and choose a scan type. From the terminal you can also run `python3 sfcli.py` and then `start example.com -u footprint -w`.' },
  { q: 'What are SpiderFoot modules and API keys?', a: 'Modules are the individual data collectors, and most of them need no API key. Keyed modules such as Shodan, HaveIBeenPwned, SecurityTrails, Censys, and AbuseIPDB are configured in the web UI Settings page, and many offer a free tier. List every module with the `modules` command inside sfcli.py.' },
  { q: 'How do I defend my own digital footprint?', a: 'Run SpiderFoot against your own email addresses and domains, then act on the findings: reduce exposure by locking down old accounts, rotate any password found in a breach and enable 2FA, close forgotten subdomains and test services, and strip metadata from photos and documents before sharing them.' },
]

const howItWorks = [
  'Install SpiderFoot with git clone and pip3 install -r requirements.txt, or sudo apt install spiderfoot -y on Kali.',
  'Launch the web interface with python3 sf.py -l 127.0.0.1:5001 and open http://127.0.0.1:5001.',
  'Create a new scan: enter your target (email, domain, IP, username) and select Footprint, Investigate, or Passive.',
  'Review the collected events and export results as JSON or CSV from the web UI or with the export command in sfcli.py.',
  'Act on the findings: rotate exposed passwords, close forgotten subdomains, remove metadata, then re-scan to verify cleanup.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'SpiderFoot OSINT Automation — Email, Subdomain & Footprint Cleanup Guide',
      description: 'Step-by-step reference: use SpiderFoot OSINT automation for emails, subdomains, breaches and footprint cleanup. Educational purposes only.',
      about: 'SpiderFoot open source intelligence automation tool',
      educationalUse: 'Testing, education, and authorized reconnaissance only',
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

export default function hackolution_Spiderfoot() {
  return (
    <ToolLayout
      title="SpiderFoot OSINT Automation"
      desc="Step-by-step reference: use SpiderFoot OSINT automation for emails, subdomains, breaches and footprint cleanup. Educational purposes only."
      icon="🕸️"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/spiderfoot"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Section id="video" icon="🎬" title="HACKOLUTION reel" subtitle="Watch on Instagram, then practice below in your lab">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-white/10 p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(214,41,118,0.12), rgba(17,24,39,0.6))' }}>
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-lg font-bold text-white mb-2">Follow HACKOLUTION on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Daily OSINT, privacy and security reels — then practice the SpiderFoot concepts below in your own lab.
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)', color: '#fff' }}>📸 Watch on Instagram @hackolution</a>
              <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white transition-all">▶ YouTube Channel</a>
            </div>
          </div>
        </div>
      </Section>

      <WarningBox>
        SpiderFoot pulls together information that is already public, but that does not make scanning everyone fair game. Use it <b>only on yourself, your own organization, or targets you have explicit written permission to research</b>.
        Always respect the Terms of Service and rate limits of every data source it queries — aggressive scanning can get your IP blocked and may violate computer misuse laws.
        This guide is provided for <b>educational and authorized defensive use only</b>.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is SpiderFoot?" subtitle="Open-source OSINT automation with a web UI and a full CLI">
        <p>
          <b>SpiderFoot</b> is an open-source intelligence (OSINT) automation tool that integrates with a huge range of public data sources
          and makes the collected data easy to navigate. It can target <b>IP addresses, domains and subdomains, hostnames, network ranges, ASNs,
          email addresses, phone numbers, usernames, personal names, and bitcoin addresses</b>.
        </p>
        <p>
          SpiderFoot modules feed each other in a publisher/subscriber model, so one discovery automatically triggers the next set of lookups.
          It runs from an embedded web server on port 5001 and can also be driven completely from the command line with sfcli.py. The project is
          MIT-licensed and has been actively developed since 2012.
        </p>
        <FeatureGrid items={[
          { i: '🕸️', t: '100+ OSINT Modules', d: 'Modules feed each other in a publisher/subscriber model for maximum data extraction.' },
          { i: '🎛️', t: 'Footprint, Investigate, Passive', d: 'Three scan use cases tuned from quick passive checks to deep enumeration.' },
          { i: '🖥️', t: 'Web UI + Full CLI', d: 'Embedded web server on port 5001, or drive every action from sfcli.py.' },
          { i: '🔌', t: 'API Integrations', d: 'Shodan, HaveIBeenPwned, SecurityTrails, Censys, AbuseIPDB, and more.' },
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install SpiderFoot on Kali, Debian, or from source">
        <p className="text-xs text-slate-400">On Kali Linux, Debian, or Parrot OS:</p>
        <CodeBlock title="terminal" lines={`sudo apt install spiderfoot -y`} />
        <p className="text-xs text-slate-400 mt-3">Latest build straight from the official GitHub repository:</p>
        <CodeBlock title="terminal" lines={`git clone https://github.com/smicallef/spiderfoot && cd spiderfoot && pip3 install -r requirements.txt`} />
        <InfoBox title="Requirements">
          SpiderFoot needs Python 3.7 or newer. The tool stores its database and settings under <span className="font-mono">~/.spiderfoot/</span>
          (including <span className="font-mono">spiderfoot.db</span> and the <span className="font-mono">passwd</span> file for web UI login).
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Start the Web UI" subtitle="Launch the SpiderFoot web interface on port 5001">
        <p className="text-xs text-slate-400">Start the embedded web server, binding it to localhost:</p>
        <CodeBlock title="terminal" lines={`python3 sf.py -l 127.0.0.1:5001`} />
        <p className="text-xs text-slate-400 mt-2">Then open the interface in your browser:</p>
        <CodeBlock title="terminal" lines={`http://127.0.0.1:5001`} />
        <InfoBox title="Secure the Interface">
          Add lines in the format <span className="font-mono">username:password</span> to <span className="font-mono">~/.spiderfoot/passwd</span>
          and SpiderFoot automatically enables digest authentication for the web UI. Keep the listener bound to <span className="font-mono">127.0.0.1</span>
          unless you deliberately need remote access.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Run a Scan" subtitle="Start a scan from the web UI or from the command line">
        <p className="text-xs text-slate-400">In the web UI: click New Scan, enter your target (an email address or domain works well for a first run), pick a scan type, and start it.</p>
        <p className="text-xs text-slate-400 mt-2">From the terminal, the CLI drives the same server. Start the web server first, then run sfcli.py:</p>
        <CodeBlock title="terminal" lines={`python3 sfcli.py
sf> start example.com -u footprint -w`} />
        <p className="text-xs text-slate-400 mt-2">Pull only the email addresses a scan collected, then export everything as JSON:</p>
        <CodeBlock title="terminal" lines={`sf> data <scan_id> -t EMAILADDR -u
sf> export <scan_id> -t json -f spiderfoot_report.json`} />
        <p className="text-xs text-slate-400 mt-2">You can also run a one-shot scan without the web UI at all:</p>
        <CodeBlock title="terminal" lines={`python3 sf.py -s example.com -u footprint -o json > scan.json`} />
        <InfoBox title="Scan Use Cases">
          SpiderFoot scan types map to use cases: <b>footprint</b> (reconnaissance and enumeration), <b>investigate</b> (threat intelligence lookups),
          <b> passive</b> (queries only, no active probing), and <b>all</b> (every enabled module).
        </InfoBox>
      </Section>

      <Section id="command3" icon="⚙️" title="Command 3 — API Keys &amp; Module Configuration" subtitle="Connect data sources and choose which modules run">
        <p className="text-xs text-slate-400">Open the web UI Settings page and fill in API keys for the modules you want. The most useful keyed sources:</p>
        <CodeBlock title="Settings → Modules" lines={`Shodan            host and service intelligence
HaveIBeenPwned    breach and password exposure
SecurityTrails    passive DNS and historical data
Censys            certificate and host data
AbuseIPDB         IP reputation lookups`} />
        <p className="text-xs text-slate-400 mt-2">List every available module from the CLI, or scope a scan to specific modules:</p>
        <CodeBlock title="terminal" lines={`sf> modules
sf> start example.com -m sfp_dnsresolve,sfp_certificate`} />
        <InfoBox title="Keys Are Optional">
          Most of the 100+ modules run with no API key at all, and keyed modules usually offer a free tier. Keys are stored in the SpiderFoot
          config database under <span className="font-mono">~/.spiderfoot/</span> — never commit them to a git repository.
        </InfoBox>
      </Section>

      <Section id="findings" icon="🔍" title="What a Scan Finds" subtitle="Common data types SpiderFoot collects">
        <FeatureGrid items={[
          { i: '📧', t: 'Emails &amp; Phone Numbers', d: 'Extracted from scraped pages, certificates, and breach data.' },
          { i: '🌐', t: 'Subdomains &amp; DNS Records', d: 'Passive enumeration plus DNS brute-forcing and zone transfer checks.' },
          { i: '🔓', t: 'Breach Exposure', d: 'HaveIBeenPwned and other breach sources reveal leaked credentials.' },
          { i: '🪣', t: 'Exposed Cloud Buckets', d: 'Public Amazon S3 buckets, Azure blobs, and DigitalOcean Spaces.' },
          { i: '🖥️', t: 'Tech Stack &amp; Shodan Data', d: 'BuiltWith, Shodan, and Censys integrations map services on hosts.' },
          { i: '👤', t: 'Social Accounts &amp; Usernames', d: 'Account Finder checks 500+ social and website platforms.' },
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Cleaning Your Footprint" subtitle="Remediation steps for the people in your scans">
        <div className="space-y-3">
          <IssueRow
            issue="Your email addresses and old accounts are publicly discoverable"
            fix="Reduce exposure: set social profiles to private, delete old forum posts, and remove your details from people-search sites wherever the site allows it."
          />
          <IssueRow
            issue="Breached passwords are tied to your email addresses"
            fix="Change every password found in a breach, enable two-factor authentication everywhere possible, and never reuse the same password across sites."
          />
          <IssueRow
            issue="Forgotten subdomains and test services are still live"
            fix="Close subdomains: decommission unused staging environments, take down test panels, and lock down DNS records for services you still run."
          />
          <IssueRow
            issue="Photos and documents leak metadata"
            fix="Remove metadata: strip EXIF data (GPS coordinates, camera model) from images before posting with exiftool -all=, and clean document properties before sharing files."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key SpiderFoot Flags &amp; Options" subtitle="Essential command-line switches for sf.py and sfcli.py">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-l &lt;host:port&gt;</div>
            <div className="text-xs text-slate-400">sf.py: start the web UI (e.g. 127.0.0.1:5001).</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-s &lt;target&gt;</div>
            <div className="text-xs text-slate-400">sf.py scan mode: the target to scan (domain, email, IP, username).</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u &lt;usecase&gt;</div>
            <div className="text-xs text-slate-400">Scan use case: all, footprint, investigate, or passive.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-t &lt;types&gt;</div>
            <div className="text-xs text-slate-400">Scan by event type (e.g. EMAILADDR, DOMAIN_NAME) instead of use case.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-m &lt;modules&gt;</div>
            <div className="text-xs text-slate-400">Comma-separated module list to enable for the scan.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;format&gt;</div>
            <div className="text-xs text-slate-400">Output format for scan mode: tab, csv, or json (pair with -r or -D).</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official SpiderFoot GitHub Repository', 'https://github.com/smicallef/spiderfoot'],
            ['📖', 'SpiderFoot Documentation', 'https://www.spiderfoot.net/documentation'],
            ['📸', 'HACKOLUTION Instagram', 'https://www.instagram.com/hackolution'],
            ['▶️', 'HNCKER YouTube Channel', 'https://www.youtube.com/@hncker'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before scanning anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized defensive purposes</b>. SpiderFoot aggregates public data,
          but researching or scanning targets without permission is illegal in many jurisdictions. Only run scans against identities and systems
          you own or are contracted to assess, respect every data source rate limit and Terms of Service, and never use collected data to harass,
          stalk, or defraud anyone. The authors and this website assume no liability for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
