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
  { q: 'What is Nuclei?', a: 'Nuclei is a fast, open-source vulnerability scanner from ProjectDiscovery. It sends requests to a target based on customizable templates, so you can scan thousands of known weaknesses in seconds.' },
  { q: 'Is Nuclei illegal?', a: 'Nuclei itself is a legal, open-source security tool. Running it against a website or network you do not own or have written permission to test may be illegal. Only scan targets you own or are authorized to assess.' },
  { q: 'How do I install it?', a: 'The easiest way is: go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest. Or download the prebuilt binary from the official GitHub releases page and put it on your PATH.' },
  { q: 'How do I run a basic scan?', a: 'Simply run: nuclei -u https://example.com. It auto-downloads the public template packs and starts scanning the target against them, printing matches to the terminal.' },
  { q: 'What are templates?', a: 'Templates are small YAML files that define a check — a request, a matcher, and metadata like the CVE it maps to. Nuclei ships with curated packs (cves, exposures, misconfigurations, etc.) and lets you write your own.' },
  { q: 'What can it find?', a: 'CVEs, exposed files and directories (.git, .env), misconfigurations, missing security headers, open ports via integration, SQLi/XSS indicators and much more — depending on the templates you run.' },
  { q: 'Is it fast?', a: 'Yes. Nuclei is highly concurrent and optimized. A full scan of many templates on one host typically completes in seconds.' },
  { q: 'What is it good for?', a: 'Vulnerability assessment, bug bounty reconnaissance, continuous security scanning in CI, and learning how common web weaknesses look.' },
]

const howItWorks = [
  'Install Nuclei with the Go package manager or a prebuilt binary.',
  'Point it at a target URL: nuclei -u https://example.com.',
  'It auto-loads the public template packs.',
  'It fires the matching templates against the target in parallel.',
  'Any match is printed to the terminal with severity and proof.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Nuclei — Fast Vulnerability Scanner (Educational)',
      description: 'Complete step-by-step reference for installing and using Nuclei, the ProjectDiscovery vulnerability scanner. Education and authorized testing only.',
      about: 'Nuclei vulnerability scanner',
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

export default function hncker_nuclei() {
  return (
    <ToolLayout
      title="Nuclei — Vulnerability Scanner"
      desc="Step-by-step reference: install & use Nuclei, the fast ProjectDiscovery vulnerability scanner. Educational purposes only."
      icon="🎯"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/nuclei"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/nuclei/nuclei_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=Tew1N2CW2Ks" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/Tew1N2CW2Ks/hqdefault.jpg"
                alt="Nuclei Tutorial — Find Any Website's Security Holes in Seconds"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">Nuclei Tutorial: Find Any Website's Security Holes in Seconds</p>
                <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Nuclei scans targets for known vulnerabilities. Use it <b>only on systems you own or have
        written permission to test</b>. Scanning someone else's website or network without
        authorization is illegal in most jurisdictions. This page is for <b>educational and
        authorized testing only</b>.
      </WarningBox>

      <Section id="overview" icon="🎯" title="What is Nuclei?" subtitle="Fast, template-driven vulnerability scanning from the terminal">
        <p>
          <b>Nuclei</b> is a fast, open-source <b>vulnerability scanner</b> from <b>ProjectDiscovery</b>.
          Instead of hard-coded checks, it runs <b>YAML templates</b> — each one a request plus a
          matcher plus metadata like the CVE it maps to. Point it at a target and it fires thousands
          of templates in parallel.
        </p>
        <p>
          It's a standard tool in bug bounty and authorized pentesting to quickly map weaknesses —
          exposed files, CVEs, misconfigurations, missing headers — with real proof in the terminal.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Fast & concurrent', d: 'Thousands of templates in parallel, finishes in seconds.' },
          { i: '🧩', t: 'Template-driven', d: 'YAML templates: request + matcher + metadata.' },
          { i: '🐞', t: 'CVE coverage', d: 'Curated packs map findings to real CVEs.' },
          { i: '🕵️', t: 'Exposure finding', d: 'Spots .git, .env, debug endpoints and more.' },
          { i: '🔌', t: 'Integrations', d: 'Works with HTTPX, Subfinder, and CI pipelines.' },
          { i: '🖥️', t: 'CLI-first', d: 'Runs entirely from the terminal.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Go (version 1.20 or newer recommended) OR a prebuilt binary'],
            ['☑️', 'Your Go bin directory on PATH (usually ~/go/bin)'],
            ['☑️', 'Internet access (to download template packs on first run)'],
            ['☑️', 'A target you own or are authorized to test'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest`} />
        <InfoBox title="PATH note">
          If the <span className="font-mono">nuclei</span> command isn't found after installing, your Go
          bin directory isn't on PATH. Add it with: <span className="font-mono">export PATH="$PATH:$(go env GOPATH)/bin"</span>.
          Alternatively, grab the prebuilt binary from the official GitHub releases page.
        </InfoBox>
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Run a scan in one line">
        <p className="text-xs text-slate-400">The basic command — point it at any URL you own:</p>
        <CodeBlock title="terminal" lines={`nuclei -u https://example.com`} />
        <InfoBox title="Template packs">
          On first run Nuclei offers to download the public template packs (cves, exposures,
          misconfigurations, and more). Accept and it updates them automatically on later runs.
        </InfoBox>
        <p className="text-xs text-slate-400 mt-4">Scan a specific template category:</p>
        <CodeBlock title="terminal" lines={`nuclei -u https://example.com -t cves/\nnuclei -u https://example.com -t exposures/\nnuclei -u https://example.com -t misconfiguration/`} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Nuclei in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/nuclei/nuclei_scan.png" alt="Nuclei scanning a target URL in the terminal"
            className="w-full h-auto object-contain" loading="lazy" width="1408" height="768" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Running Nuclei against a target</figcaption>
        </figure>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="'command not found: nuclei' right after go install"
            fix={`Your Go bin dir isn't on PATH. Add it with export PATH="$PATH:$(go env GOPATH)/bin" and reload your shell, or use the prebuilt binary from GitHub releases.`}
          />
          <IssueRow
            issue="Scan runs but finds nothing"
            fix="Make sure template packs are installed (nuclei -update-templates). Also confirm the target is reachable and that the templates you're running actually apply to it. Start with -t cves/ or -t exposures/." />
          <IssueRow
            issue="Templates fail to download / network error"
            fix="Nuclei needs internet on first run. Check connectivity, retry with nuclei -update-templates, or set a proxy via HTTP_PROXY if your network requires one." />
          <IssueRow
            issue="False positives"
            fix="Confirm each finding manually — open the URL and reproduce it. Use the -validate flag to sanity-check your custom templates, and keep the template pack updated." />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official repository', 'https://github.com/projectdiscovery/nuclei'],
            ['🧩', 'Template packs', 'https://github.com/projectdiscovery/nuclei-templates'],
            ['🐛', 'Report issues', 'https://github.com/projectdiscovery/nuclei/issues'],
            ['🎬', 'HNCKER tutorials', 'https://www.youtube.com/@hncker'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you scan anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized testing purposes</b>.
          Nuclei is a powerful scanning tool. Using it against websites, servers or networks you do not own,
          or without explicit written authorization, may be illegal and can cause harm. Only scan systems you
          own or are permitted to assess — your own lab, or an authorized pentest or bug-bounty engagement.
          The author and this site are not responsible for any misuse of this information.
        </p>
      </Section>
    </ToolLayout>
  )
}
