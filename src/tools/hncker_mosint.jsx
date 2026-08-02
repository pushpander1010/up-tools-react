import { Helmet } from 'react-helmet-async'
import ToolLayout from '../components/ToolLayout'

function Section({ id, icon, title, subtitle, children }) {
  return (
    <section id={id} className="glass p-6 sm:p-7 mb-6 scroll-mt-24">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg sm:text-xl font-extrabold text-white m-0">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-1 mb-4">{subtitle}</p>}
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
  { q: 'What is Mosint?', a: 'Mosint is a fast, automated email OSINT tool written in Go. Given an email address, it quickly gathers and consolidates publicly available information about it from multiple sources.' },
  { q: 'Is Mosint illegal?', a: 'The tool is open source and legal to use for OSINT research. It only queries publicly available sources. Using it to harass, stalk or target someone you have no legitimate reason to investigate may break laws and platform terms. Use it responsibly and only for authorized research.' },
  { q: 'What do I need to install it?', a: 'You need Go installed. Then run: go install -v github.com/alpkeskin/mosint/v3/cmd/mosint@latest. Make sure your Go bin directory is on your PATH.' },
  { q: 'How do I run a scan?', a: 'Simply pass an email address: mosint example@email.com. It automatically runs the enabled checks and prints the results in the terminal.' },
  { q: 'What information can it find?', a: 'It can validate the email address and surface related information such as linked accounts, associated domains and breach data, depending on the sources and API keys you have configured.' },
  { q: 'Why are some checks empty or skipped?', a: 'Many sources require free API keys that you must add to the .env configuration file. Without a key, that source is skipped. Set the keys you have and re-run.' },
  { q: 'Is it lightweight?', a: 'Yes. It is optimized to be fast and easy on system resources, and it runs entirely from the command line.' },
  { q: 'What is Mosint good for?', a: 'It is a great starting point for email-based reconnaissance in authorized OSINT, social-engineering-awareness and red-team engagements.' },
]

const howItWorks = [
  'Install Mosint with the Go package manager.',
  'Configure optional API keys in .env for extra sources.',
  'Run it against a target email address.',
  'It queries public sources and validates the address.',
  'Results are printed in the terminal for you to review.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Mosint — Automated Email OSINT Tool (Educational)',
      description: 'Complete step-by-step reference for installing and using Mosint, a Go-based automated email OSINT tool. Education and authorized research only.',
      about: 'Mosint email OSINT tool',
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

export default function hncker_mosint() {
  return (
    <ToolLayout
      title="Mosint — Email OSINT Tool"
      desc="Step-by-step reference: install & use Mosint, a fast Go-based automated email OSINT tool. Educational purposes only."
      icon="📧"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(34,211,238,0.08))"
      category="security"
      slug="hncker/mosint"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/mosint/mosint_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=JpIwxdfS2fQ" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/JpIwxdfS2fQ/hqdefault.jpg"
                alt="Mosint Tutorial - Map Anyone's Online Presence From a Single Email"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">Mosint Tutorial: Map Anyone's Online Presence From a Single Email</p>
                <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Mosint collects publicly available information about an email address. Use it <b>only for authorized OSINT
        research, security awareness and red-team engagements</b>. Investigating people without a legitimate purpose can
        violate privacy laws and platform terms. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🕵️" title="What is Mosint?" subtitle="Automated email reconnaissance from the terminal">
        <p>
          <b>Mosint</b> is a fast, automated <b>email OSINT tool</b> written in <b>Go</b>. Give it an email address and it
          quickly validates it and consolidates publicly available information from multiple sources into one clean
          terminal report.
        </p>
        <p>
          It's a handy first step during authorized OSINT and red-team work to map out an email address, spot linked
          accounts and surface breach-related data before you go deeper.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Fast & lightweight', d: 'Go binary — quick scans, low resource use.' },
          { i: '📬', t: 'Email validation', d: 'Checks if an email address is real and deliverable.' },
          { i: '🔗', t: 'Linked info', d: 'Surfaces related accounts, domains and sources.' },
          { i: '🛡️', t: 'Breach data', d: 'Flags addresses that show up in known breaches.' },
          { i: '🔌', t: 'Extensible sources', d: 'Plug in free API keys to enable more sources.' },
          { i: '🖥️', t: 'CLI-first', d: 'Runs entirely from the terminal — no dashboard.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Go (version 1.18 or newer recommended)'],
            ['☑️', 'Your Go bin directory on PATH (usually ~/go/bin)'],
            ['☑️', '(Optional) Free API keys for extra sources, added to .env'],
            ['☑️', 'An email address you are authorized to investigate'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`go install -v github.com/alpkeskin/mosint/v3/cmd/mosint@latest`} />
        <InfoBox title="PATH note">
          If the <span className="font-mono">mosint</span> command isn't found after installing, your Go bin directory
          isn't on PATH. Add it with: <span className="font-mono">export PATH="$PATH:$(go env GOPATH)/bin"</span> (add
          this to your shell profile to make it permanent).
        </InfoBox>
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Run a scan in one line">
        <p className="text-xs text-slate-400">The basic command — point it at any email address:</p>
        <CodeBlock title="terminal" lines={`mosint example@email.com`} />
        <InfoBox title="Configuration">
          Mosint reads optional API keys from a <span className="font-mono">.env</span> file in the project root. Copy
          the example config, fill in the free keys you have, and the corresponding sources light up automatically.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Mosint in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/mosint/mosint_scan.png" alt="Mosint scanning an email address in the terminal"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Running Mosint against an email address</figcaption>
        </figure>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="'command not found: mosint' right after go install"
            fix={`Your Go bin dir isn't on PATH. Add it with export PATH="$PATH:$(go env GOPATH)/bin" and reload your shell, or run it directly from $(go env GOPATH)/bin/mosint.`}
          />
          <IssueRow
            issue="Some sources return nothing"
            fix={`Most sources need a free API key in the .env file. Without a key the source is skipped. Add the keys you have and re-run.`}
          />
          <IssueRow
            issue="Build/version error during install"
            fix="Make sure you are using a recent Go version (1.18+). Update Go, then run the install command again with a clean module cache if needed."
          />
          <IssueRow
            issue="No output at all"
            fix="Confirm the email address is spelled correctly and that you have at least one source enabled. Run mosint with verbose logging if available to see what's happening per source."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official repository', 'https://github.com/alpkeskin/mosint'],
            ['🐛', 'Report issues', 'https://github.com/alpkeskin/mosint/issues'],
            ['🎬', 'HNCKER tutorials', 'https://www.youtube.com/@hncker'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-brand text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you scan anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized research purposes</b>. Mosint
          aggregates public information about an email address. Using it to investigate people without a legitimate,
          authorized reason may violate privacy laws and platform terms. Use it only on data you are permitted to
          research — your own, or within an authorized OSINT, security-awareness or red-team engagement. The author and
          this site are not responsible for any misuse of this information.
        </p>
      </Section>
    </ToolLayout>
  )
}
