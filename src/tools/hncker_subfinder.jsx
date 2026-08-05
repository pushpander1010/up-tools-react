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
  { q: 'What is Subfinder?', a: 'Subfinder is a fast subdomain discovery tool from ProjectDiscovery. It enumerates valid subdomains of a domain by querying dozens of public passive sources at once, without touching the target directly.' },
  { q: 'Is Subfinder illegal?', a: 'No, it is a legitimate open-source recon tool that only queries public data sources. Using it to enumerate domains you do not own or lack permission to assess is still illegal. Only use it on your own or authorized targets.' },
  { q: 'What is passive subdomain enumeration?', a: 'Passive enumeration collects subdomains from public sources like certificate transparency logs, DNS records and search engines — no direct requests to the target. This is faster and lower-noise than active brute forcing.' },
  { q: 'How do I run it?', a: 'Basic usage is: subfinder -d example.com. Add -all to query every supported source, -recursive for deeper enumeration of discovered subdomains, and -dL to scan a list of domains from a file.' },
  { q: 'What does the -all flag do?', a: 'By default Subfinder uses a curated set of high-signal sources. The -all flag enables every supported passive source, returning the deepest possible collection at the cost of more queries and slower runs.' },
  { q: 'What is recursive enumeration?', a: 'The -recursive flag makes Subfinder re-run enumeration on each discovered subdomain, surfacing deeper levels like api.dev.example.com. This can reveal more of the attack surface.' },
  { q: 'Can I scan many domains at once?', a: 'Yes. Pass a file of domains with -dL domains.txt. Subfinder enumerates each domain in the list and outputs all subdomains.' },
  { q: 'How do I defend against subdomain discovery?', a: 'Audit your subdomains regularly, remove forgotten or stale ones, keep staging and admin subdomains off public records where possible, and monitor for new or unexpected subdomains. Every subdomain is attack surface.' },
]

const howItWorks = [
  'Install Subfinder via Go or your package manager.',
  'Run a basic enumeration against a domain you own.',
  'Use -all and -recursive for deeper passive collection.',
  'Scan a list of domains with -dL as needed.',
  'Audit your own subdomains and remove stale ones.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Subfinder — Subdomain Discovery (Educational Guide)',
      description: 'Step-by-step reference for using Subfinder for passive subdomain enumeration: basic discovery, all sources, recursive and bulk modes, plus how to audit your own surface.',
      about: 'Subfinder subdomain discovery tool',
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

export default function hncker_subfinder() {
  return (
    <ToolLayout
      title="Subfinder — Subdomain Discovery Guide"
      desc="Step-by-step reference: use Subfinder for passive subdomain enumeration — basic, all sources, recursive and bulk. Educational purposes only."
      icon="🌐"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/subfinder"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/subfinder/subfinder_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=E-6uJ0j3xMo" target="_blank" rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-white/10 no-underline"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img src="https://i.ytimg.com/vi/E-6uJ0j3xMo/hqdefault.jpg"
                alt="Subfinder Tutorial - Find Every Subdomain of a Website" loading="lazy"
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">Subfinder — find every subdomain of a target</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Subfinder enumerates publicly available subdomains. Use it <b>only against domains you own or have written
        permission to assess</b>. Enumerating a domain that is not yours is illegal. This page is for <b>educational and
        authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is Subfinder?" subtitle="Passive subdomain discovery from ProjectDiscovery">
        <p>
          <b>Subfinder</b> is a fast, passive <b>subdomain discovery</b> tool. Given a domain, it queries dozens of
          public sources — certificate transparency logs, DNS records, search engines and more — and lists every valid
          subdomain it finds, all without sending direct requests to the target.
        </p>
        <p>
          It is the standard first step in authorized recon: knowing the full subdomain surface reveals forgotten
          staging servers, admin panels and APIs that a target doesn't link to.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Fast & passive', d: 'Queries public sources, not the target.' },
          { i: '🧭', t: 'Dozens of sources', d: 'CT logs, DNS, search engines, more.' },
          { i: '🔁', t: 'Recursive', d: 'Dig into subdomains of subdomains.' },
          { i: '🗂️', t: 'Bulk mode', d: 'Scan a whole list with -dL.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Go (for go install) or a prebuilt binary'],
            ['☑️', 'A domain you own or are authorized to assess'],
            ['☑️', '(Optional) API keys for more sources'],
            ['☑️', 'An understanding of your engagement scope'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="go" lines={`go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest`} />
        <InfoBox title="PATH note">
          If <span className="font-mono">subfinder</span> isn't found after installing, add your Go bin directory to
          PATH (or run it from <span className="font-mono">$(go env GOPATH)/bin</span>).
        </InfoBox>
      </Section>

      <Section id="basic" icon="🚀" title="Step 1 — Basic Discovery" subtitle="Point it at a domain">
        <p className="text-xs text-slate-400">Enumerate subdomains for a single domain:</p>
        <CodeBlock title="terminal" lines={`subfinder -d example.com
# api.example.com
# dev.example.com
# staging.example.com`} />
        <InfoBox title="Output">
          Results print to the terminal by default. Redirect to a file with <span className="font-mono">
          -o subs.txt</span> for later use.
        </InfoBox>
      </Section>

      <Section id="allsources" icon="🌍" title="Step 2 — All Sources" subtitle="Deepest passive collection">
        <p className="text-xs text-slate-400">Query every supported source:</p>
        <CodeBlock title="terminal" lines={`subfinder -d example.com -all`} />
        <InfoBox title="Why -all">
          The default config uses the highest-signal sources. <span className="font-mono">-all</span> enables every
          source, returning more subdomains at the cost of more queries.
        </InfoBox>
      </Section>

      <Section id="recursive" icon="🔁" title="Step 3 — Recursive" subtitle="Subdomains of subdomains">
        <p className="text-xs text-slate-400">Re-run enumeration on discovered subdomains:</p>
        <CodeBlock title="terminal" lines={`subfinder -d example.com -recursive
# api.dev.example.com`} />
        <InfoBox title="Deeper levels">
          Recursive mode surfaces nested subdomains like <span className="font-mono">api.dev.example.com</span>,
          revealing more of the attack surface.
        </InfoBox>
      </Section>

      <Section id="bulk" icon="🗂️" title="Step 4 — Bulk Domains" subtitle="Scan a whole list at once">
        <p className="text-xs text-slate-400">Pass a file with one domain per line:</p>
        <CodeBlock title="terminal" lines={`subfinder -dL domains.txt`} />
        <InfoBox title="domains.txt">
          Put each domain on its own line. Subfinder enumerates all of them in one run.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Know Your Surface" subtitle="Audit and reduce">
        <FeatureGrid items={[
          { i: '🔍', t: 'Audit regularly', d: 'Enumerate your own domains to find gaps.' },
          { i: '🗑️', t: 'Remove stale subdomains', d: 'Delete forgotten staging and old services.' },
          { i: '🔒', t: 'Protect admin/staging', d: "Restrict access, don't rely on obscurity." },
          { i: '📊', t: 'Monitor for new ones', d: 'Watch for unexpected subdomains appearing.' },
        ]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Subfinder in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/subfinder/subfinder_scan.png" alt="Subfinder enumerating subdomains" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Subfinder discovering subdomains from public sources</figcaption>
        </figure>
      </Section>

            <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-d, --domain</div>
            <div className="text-xs text-slate-400">Target domain to enumerate.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-dL, --list</div>
            <div className="text-xs text-slate-400">File with multiple domains, one per line.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-all</div>
            <div className="text-xs text-slate-400">Use every supported passive source for deepest coverage.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-recursive</div>
            <div className="text-xs text-slate-400">Enumerate subdomains of discovered subdomains too.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-silent</div>
            <div className="text-xs text-slate-400">Print only the subdomains, no banner or logs.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o, --output</div>
            <div className="text-xs text-slate-400">Write results to a file.</div>
          </div>
          <div key="k6" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-v, --verbose</div>
            <div className="text-xs text-slate-400">Show extra logging while enumerating.</div>
          </div>
        </div>
      </Section>

<Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          <IssueRow
            issue="No subdomains returned"
            fix="Some sources need API keys. Add keys to your config, use -all, and confirm the domain is spelled correctly. Passive discovery can also miss domains with no public records."
          />
          <IssueRow
            issue="subfinder: command not found"
            fix={'Add your Go bin to PATH (export PATH="$PATH:$(go env GOPATH)/bin") or run it directly from the downloaded binary path.'}
          />
          <IssueRow
            issue="Rate-limited or slow"
            fix="The -all flag queries many sources. Use the default source set, add API keys to reduce throttling, and avoid re-running the same domain back to back."
          />
          <IssueRow
            issue="Want results in a file"
            fix="Use the -o flag to write output to a file: subfinder -d example.com -o subs.txt. Pipe to other tools with -silent for clean subdomains only."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official Subfinder repo', 'https://github.com/projectdiscovery/subfinder'],
            ['📖', 'ProjectDiscovery docs', 'https://docs.projectdiscovery.io/tools/subfinder'],
            ['🗃️', 'Chaos dataset', 'https://chaos.projectdiscovery.io/'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you enumerate anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Subfinder enumerates
          publicly available subdomains, but using it against a domain you do not own or lack written permission to
          assess is illegal. Use it only on your own domains or within an authorized security engagement. The author and
          this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
