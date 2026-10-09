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
  { q: "What is Maigret?", a: "Maigret is a free, open-source username OSINT tool by Soxoj. You give it one username and it checks 500+ websites for matching accounts, then builds PDF, HTML, and CSV reports. It started as an enhanced Sherlock fork with smarter parsing, site filters, and cookie support." },
  { q: "Is using Maigret legal?", a: "Maigret itself is legal open-source software that reads public profile pages. Investigating real people without a legitimate research purpose can violate privacy laws and platform terms. Use it only for authorized OSINT research, security awareness, or auditing accounts you own." },
  { q: "How do I install Maigret?", a: "Run pipx install maigret on Python 3.9 or newer, or pip install maigret as a fallback. Verify with maigret --version. Restart your shell if the command is not found right after installing." },
  { q: "How do I search a username?", a: "Run maigret username --html against your authorized research target. Maigret prints matches live and writes a clickable HTML report. Open every hit manually — similar names are leads, not confirmed identities." },
  { q: "How do I speed up a slow scan?", a: "Add --top-sites for a one-minute pass over the biggest platforms and --timeout 20 to cap slow sites. Save the full 500-site sweep for targets that survive triage." },
  { q: "What is the difference between Maigret and Sherlock?", a: "Sherlock checks around 400 sites with simple matching. Maigret covers 500+ sites with username-variant parsing, site-group filters, PDF and HTML reports, cookie-based authenticated checks, and richer result tags." },
  { q: "How do I check sites that need login?", a: "Export cookies from your own logged-in browser and pass --cookies-file cookies.txt. This only works with sessions you own — using another person's session exceeds authorization." },
  { q: "Why do I get false matches?", a: "Short or common usernames collide with unrelated accounts. Compare avatars, bios, and activity dates on each matched profile before treating it as the same person." }
]

const howItWorks = [
  "Install Maigret with pipx install maigret and verify with maigret --version.",
  "Triage your authorized research username with maigret username --top-sites --timeout 30.",
  "Run the full sweep with maigret username --html and open the clickable report.",
  "Verify every hit manually against avatars, bios, and activity before recording it.",
  "Export --pdf and --csv evidence, store it securely, and clean up your own exposed accounts found along the way."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Maigret Username OSINT Search — 500-Site Username Tracing & Report Guide',
      description: 'Step-by-step reference: trace any username across 500+ sites with Maigret and read its reports. Educational use only.',
      about: 'Maigret username OSINT search across social sites',
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

export default function hackolution_maigret() {
  return (
    <ToolLayout
      title="Maigret Username OSINT Search"
      desc="Step-by-step reference: trace any username across 500+ sites with Maigret and read its reports. Educational use only."
      icon="👤"
      iconBg="linear-gradient(135deg, rgba(179,102,255,0.18), rgba(27,255,110,0.08))"
      category="security"
      slug="hackolution/maigret"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Maigret Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for username tracing across 500+ sites, top-site quick checks, and reading Maigret reports.
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
        Maigret queries publicly available profile pages for a username. Use it <b>only for authorized OSINT research, security awareness, and red-team engagements</b>. Investigating real people without a legitimate purpose can violate privacy laws and platform terms. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="👤" title="What is Maigret?" subtitle="Username search across 500+ sites, the Sherlock successor">
        <p>
          <b>Maigret</b> is a free, open-source <b>username OSINT</b> tool written in <b>Python</b> by Soxoj. Give it one username and it checks more than <b>500 sites</b> — social networks, forums, dev platforms, and marketplaces — then compiles every match into clean <b>PDF, HTML, and CSV reports</b>.
        </p>
        <p>
          It began as an enhanced Sherlock fork and grew into its own engine: smarter username parsing, site-group filters, cookie support for login-walled sites, and GeoIP-tagged results. For authorized username reconnaissance and for auditing your own digital footprint, it is the current standard.
        </p>
        <FeatureGrid items={[
          { i: '👤', t: '500+ Site Coverage', d: 'Social, forums, code, gaming, and freelance platforms in one sweep.' },
          { i: '⚡', t: 'Top-Sites Quick Mode', d: 'Check the most popular sites first for a fast first answer.' },
          { i: '📄', t: 'PDF & HTML Reports', d: 'Shareable reports with matched profiles, metadata, and tags.' },
          { i: '🧩', t: 'Username Parsing', d: 'Tests name variants and separators to catch near-match accounts.' },
          { i: '🍪', t: 'Cookie Support', d: 'Authenticated checks on sites that hide profiles from guests.' },
          { i: '🌍', t: 'Tags & Geo Hints', d: 'Site categories and country tags that aid timeline building.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Maigret on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install with pipx (recommended) or pip:</p>
        <CodeBlock title="terminal" lines={`pipx install maigret
# or with pip:
# pip install maigret`} />
        <InfoBox title="Verify the install">
          Run maigret --version after installing. Maigret needs Python 3.9 or newer. If the command is not found, restart your shell so the pipx binary path loads, or use python3 -m maigret instead.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Full Username Search" subtitle="Check one username across every supported site">
        <p className="text-xs text-slate-400">Search an authorized research username across all supported sites with an HTML report:</p>
        <CodeBlock title="terminal" lines={`maigret johndoe --html`} />
        <InfoBox title="Reading the results">
          Maigret prints claimed profiles live and writes a report file in the current directory. Open the HTML report for clickable profile links grouped by site category. Red entries need manual review — similar names are not confirmed identities.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Fast Top-Sites Check" subtitle="Get a quick answer from the biggest platforms">
        <p className="text-xs text-slate-400">Run a fast pass over the most popular sites before the full sweep:</p>
        <CodeBlock title="terminal" lines={`maigret johndoe --top-sites --timeout 30`} />
        <InfoBox title="When quick mode helps">
          The --top-sites flag checks around 500 of the biggest platforms in under a minute. The --timeout flag caps seconds per site so one slow site cannot stall the run. Use this for triage, then run the full sweep on interesting targets.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Reports & Authenticated Checks" subtitle="Export evidence and check login-walled sites">
        <p className="text-xs text-slate-400">Generate PDF and CSV evidence plus authenticated checks with cookies:</p>
        <CodeBlock title="terminal" lines={`maigret johndoe --pdf --csv --cookies-file cookies.txt`} />
        <InfoBox title="Cookies and evidence notes">
          Export cookies from your own logged-in browser session and pass them with --cookies-file to check sites that hide guest profiles. The --pdf and --csv flags produce court-ready evidence formats — store them securely and only on authorized engagements.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Maigret report for a username search">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/maigret/maigret_logo.jpg" alt="Maigret username OSINT logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Maigret HTML report — matched profiles grouped by site category</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Maigret Searches Find" subtitle="Common discoveries from username sweeps">
        <FeatureGrid items={[
          { i: '👤', t: 'Linked Accounts', d: 'Same username reused across social, forum, and dev platforms.' },
          { i: '📸', t: 'Profile Metadata', d: 'Bios, avatars, join dates, and location hints on matched pages.' },
          { i: '💼', t: 'Work Footprint', d: 'Freelance, code, and portfolio sites tied to the handle.' },
          { i: '🎮', t: 'Gaming Handles', d: 'Gamer tags and stats pages that leak schedules and contacts.' },
          { i: '🌍', t: 'Geo & Interest Tags', d: 'Country tags and categories that build timelines.' },
          { i: '🧹', t: 'Exposure to Clean', d: 'Your own forgotten accounts worth deleting or locking down.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Command not found after install"
            fix="Restart your shell so the pipx path loads, or run python3 -m maigret. Confirm pipx itself with pipx --version and reinstall with pipx install maigret if needed."
          />
          <IssueRow
            issue="Scan is very slow or stalls"
            fix="Lower the per-site timeout with --timeout 20 and start with --top-sites. Slow sites and Tor-routed traffic stall full sweeps — rerun without the proxy first."
          />
          <IssueRow
            issue="Too many false-positive matches"
            fix="Common words match unrelated accounts. Verify each hit by opening the profile, comparing avatars and bios, and using --parse to test username variants deliberately."
          />
          <IssueRow
            issue="Login-walled sites show no data"
            fix="Export cookies from your own browser session and pass --cookies-file cookies.txt. Never use someone else's session cookies — that exceeds authorization."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Maigret Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">&lt;username&gt;</div>
            <div className="text-xs text-slate-400">Positional argument: the username to trace across sites.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--top-sites</div>
            <div className="text-xs text-slate-400">Quick pass over the biggest platforms before the full sweep.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--pdf / --html / --csv</div>
            <div className="text-xs text-slate-400">Write shareable evidence reports alongside terminal output.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--timeout &lt;sec&gt;</div>
            <div className="text-xs text-slate-400">Maximum seconds to wait per site before moving on.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--cookies-file &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Use your own exported browser cookies for login-walled sites.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--proxy &lt;url&gt;</div>
            <div className="text-xs text-slate-400">Route checks through a proxy such as Tor or Burp.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Maigret GitHub Repository', 'https://github.com/soxoj/maigret'],
            ['📖', 'Maigret Usage Documentation', 'https://github.com/soxoj/maigret#usage'],
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
