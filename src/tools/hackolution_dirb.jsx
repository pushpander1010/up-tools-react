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
  { q: "What is DIRB?", a: "DIRB is a free, open-source web content scanner on Kali. It dictionary-attacks web paths with wordlists, reporting interesting status codes, with extension appending, cookies, and auth support." },
  { q: "Is using DIRB legal?", a: "DIRB itself is legitimate open-source software. Scanning sites without explicit written permission is illegal. Use it only on lab apps or signed targets with gentle settings." },
  { q: "How do I install DIRB?", a: "It ships with Kali. Elsewhere run sudo apt install dirb -y. Bundled wordlists live under /usr/share/dirb/wordlists." },
  { q: "How do I scan a lab app?", a: "Run dirb against the authorized URL with defaults. Read codes: 200 to open, 301 to follow, 403 to revisit with new techniques." },
  { q: "How do I scan behind a login?", a: "Pass the lab session with -c cookie string or HTTP auth with -u user:pass. Refresh expired cookies and rerun." },
  { q: "What is the difference between DIRB and Feroxbuster?", a: "DIRB is the single-threaded classic ideal for first passes and learning. Feroxbuster adds recursion, speed, and filtering for deep professional runs." },
  { q: "Why is everything 200?", a: "Wildcard responses. Filter by baseline content length mentally and verify each survivor by actual content." },
  { q: "How do defenders respond?", a: "Remove unneeded files, block directory listing, monitor for wordlist bursts, and rate-limit or challenge enumeration patterns." }
]

const howItWorks = [
  "Point DIRB at your authorized lab app with default settings.",
  "Read every status code and open each live finding.",
  "Extend with -X extensions and -c cookies for depth.",
  "Hand big follow-up lists to faster fuzzers with evidence.",
  "Report exposures and delete unneeded web objects."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'DIRB Directory Scanner — Hidden Web Object Guide',
      description: 'Step-by-step reference: find hidden web objects with DIRB wordlists. Lab use only.',
      about: 'DIRB web content scanner',
      educationalUse: 'Testing, education, and authorized research only',
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

export default function hackolution_dirb() {
  return (
    <ToolLayout
      title="DIRB Directory Scanner"
      desc="Step-by-step reference: find hidden web objects with DIRB wordlists. Lab use only."
      icon="📁"
      iconBg="linear-gradient(135deg, rgba(27,255,110,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/dirb"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the DIRB Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for directory brute-forcing basics and the backup files that leak source code.
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
        DIRB sends hundreds of requests to web servers. Scanning any site without explicit written permission is strictly prohibited and illegal. Use DIRB <b>only on lab applications or targets covered by a signed authorization</b>, with default-gentle settings on fragile apps. Never scan production sites.
      </WarningBox>

      <Section id="overview" icon="📁" title="What is DIRB?" subtitle="The classic web content scanner">
        <p>
          <b>DIRB</b> is a free, open-source <b>web content scanner</b> on Kali Linux. It launches dictionary attacks against web server paths — trying wordlist entries as directories and files — and reports every <b>interesting response code</b> it provokes.
        </p>
        <p>
          Older than its Rust and Go successors but still everywhere, DIRB teaches the fundamentals: status-code reading, extension brute-forcing, and cookie handling. Authorized testers run it for a first-pass map before handing deep work to faster fuzzers.
        </p>
        <FeatureGrid items={[
          { i: '📚', t: 'Bundled Wordlists', d: 'Ships with common, big, and vulnerability lists.' },
          { i: '➕', t: 'Extension Engine', d: 'Appends php, txt, bak, and custom suffixes.' },
          { i: '🍪', t: 'Cookie Support', d: 'Scans behind lab logins with session cookies.' },
          { i: '🔐', t: 'Auth Handling', d: 'Basic, digest, and NTLM authentication built in.' },
          { i: '🤫', t: 'Quiet Stealth Flags', d: 'Mute and speed controls for fragile apps.' },
          { i: '📄', t: 'Report Output', d: 'Plain-text findings ready for lab notes.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install DIRB on Linux">
        <p className="text-xs text-slate-400">DIRB ships preinstalled on Kali. On other Debian systems install with apt:</p>
        <CodeBlock title="terminal" lines={`sudo apt install dirb -y`} />
        <InfoBox title="Wordlist location">
          Bundled lists live under /usr/share/dirb/wordlists. Pair them with SecLists for bigger lab runs, but start with common.txt — small lists finish fast and teach code reading.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic Scan" subtitle="Map a lab app with defaults">
        <p className="text-xs text-slate-400">Scan your authorized lab application with the default wordlist:</p>
        <CodeBlock title="terminal" lines={`dirb http://localhost:3000`} />
        <InfoBox title="Reading status codes">
          CODE 200 lines are live pages to open; 301 entries reveal directories; 403 marks forbidden-but-found paths. Each code is a decision: open, follow, or revisit with new techniques.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Extensions & Cookies" subtitle="Hunt files behind lab login">
        <p className="text-xs text-slate-400">Append extensions and scan with a lab session cookie:</p>
        <CodeBlock title="terminal" lines={`dirb http://target.lab common.txt -X .php,.bak -c sessionid=abc123`} />
        <InfoBox title="Extensions and sessions">
          The -X flag tries each word with every suffix, catching backup copies. The -c flag carries your lab cookie so authenticated areas scan exactly as the logged-in user sees them.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Auth & Output" subtitle="Scan gated areas and save evidence">
        <p className="text-xs text-slate-400">Authenticate to HTTP auth and save the full report:</p>
        <CodeBlock title="terminal" lines={`dirb http://target.lab -u admin:Password1 -o dirb-report.txt`} />
        <InfoBox title="Auth and evidence">
          The -u flag handles HTTP basic auth on staging areas. The -o flag writes every finding to a report file — the paper trail every authorized engagement needs.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="DIRB mapping a lab application">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/dirb/dirb_logo.jpg" alt="DIRB directory scanner logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">DIRB results — status codes mapping hidden objects</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What DIRB Scans Find" subtitle="Common discoveries from content scans">
        <FeatureGrid items={[
          { i: '🚪', t: 'Hidden Directories', d: 'Unlinked folders with admin and test pages.' },
          { i: '💾', t: 'Backup Files', d: 'Source-revealing copies beside live pages.' },
          { i: '🔐', t: 'Auth Realms', d: 'HTTP-auth areas marking sensitive zones.' },
          { i: '📁', t: 'Listable Indexes', d: 'Open directories spilling filenames.' },
          { i: '🧪', t: 'Staging Paths', d: 'Dev copies deployed beside production.' },
          { i: '📄', t: 'First-Pass Map', d: 'The inventory deeper fuzzers start from.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Everything returns 200"
            fix="Wildcard app behavior. Note the baseline body length and mentally filter it; verify survivors by content, not code alone."
          />
          <IssueRow
            issue="Scan crawls slowly"
            fix="DIRB is single-threaded by design — accept it for first passes or hand big lists to Feroxbuster. Scan off-hours inside agreed windows."
          />
          <IssueRow
            issue="Cookie rejected mid-scan"
            fix="Lab sessions expire. Refresh the cookie value and rerun; persistent logins in the lab avoid repeat interruptions."
          />
          <IssueRow
            issue="False misses on extensions"
            fix="Confirm suffix syntax with dots (-X .php) and check case sensitivity. Some stacks need uppercase variants tried explicitly."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key DIRB Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">&lt;url&gt; [wordlist]</div>
            <div className="text-xs text-slate-400">Target plus optional custom wordlist path.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-X &lt;.exts&gt;</div>
            <div className="text-xs text-slate-400">Append extensions to every word tried.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-c &lt;cookie&gt;</div>
            <div className="text-xs text-slate-400">Carry a lab session cookie string.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u &lt;user:pass&gt;</div>
            <div className="text-xs text-slate-400">HTTP basic authentication credentials.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Save the full report to a file.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-S / -r</div>
            <div className="text-xs text-slate-400">Silent mode and non-recursive single pass.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official DIRB Repository', 'https://github.com/seifreed/dirb'],
            ['📖', 'DIRB Usage Documentation', 'https://github.com/seifreed/dirb#usage'],
            ['📸', 'HACKOLUTION Instagram', 'https://www.instagram.com/hackolution']
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
    </ToolLayout>
  )
}
