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
  { q: "What is GAU?", a: "GAU is a free, open-source historic URL harvester in Go by Corben Leo. It pulls every archived URL for a domain from Wayback, Common Crawl, OTX, and URLScan — endpoints, params, files, and old subdomains." },
  { q: "Is using GAU legal?", a: "GAU itself queries public archives, which is legitimate OSINT. Testing harvested URLs against systems needs explicit written permission — harvest only owned or signed-scope domains and guard collected URLs as sensitive." },
  { q: "How do I install GAU?", a: "Run go install github.com/lc/gau/v2/cmd/gau@latest. Verify with gau --help. No API keys needed for basic harvesting." },
  { q: "How do I harvest a domain?", a: "Run echo domain | gau against your authorized target. Dedup with sort -u, filter interesting extensions, then validate with HTTPX before scanning." },
  { q: "How do I find parameters for testing?", a: "Grep the harvest for query strings and feed them to DalFox. Historic params expose inputs the live site no longer links to." },
  { q: "Why is most output dead?", a: "Archives remember history, not current state. Dead links are normal — live-filtering with HTTPX is a required pipeline stage, not optional." },
  { q: "How does GAU differ from Katana?", a: "Katana crawls the live app today; GAU recalls what archives saw years ago. Together they cover present plus forgotten attack surface." },
  { q: "What about URLs with tokens?", a: "Treat them as secrets: report, never replay beyond authorized proof, and advise expiry plus rotation for anything still valid." }
]

const howItWorks = [
  "Install GAU with go install and verify with gau --help.",
  "Harvest your authorized domain and dedup with sort -u.",
  "Mine subdomains with --subs and parameters with query filters.",
  "Live-filter through HTTPX and scan survivors with nuclei.",
  "Report forgotten exposures and remove dead, sensitive routes."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'GAU URL Collector — Historic URL Harvesting Guide',
      description: 'Step-by-step reference: harvest historic URLs with GAU for lab recon. Authorized domains only.',
      about: 'GAU GetAllUrls historic endpoint collection',
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

export default function hackolution_gau() {
  return (
    <ToolLayout
      title="GAU URL Collector"
      desc="Step-by-step reference: harvest historic URLs with GAU for lab recon. Authorized domains only."
      icon="🗃️"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(179,102,255,0.08))"
      category="security"
      slug="hackolution/gau"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the GAU Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for archive recon, forgotten endpoints, and the cleanup that removes them.
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
        GAU collects URLs — including ones with tokens, IDs, and internal paths — from public archives. Testing harvested URLs against any system without explicit written permission is strictly prohibited and illegal. Harvest <b>only domains you own or targets covered by a signed authorization</b>, and treat collected URLs as sensitive data that may contain secrets.
      </WarningBox>

      <Section id="overview" icon="🗃️" title="What is GAU?" subtitle="Every URL the archives remember">
        <p>
          <b>GAU (GetAllUrls)</b> is a free, open-source <b>historic URL harvester</b> in Go by Corben Leo. Give it a lab domain and it pulls every remembered URL from <b>Wayback Machine, Common Crawl, OTX, and URLScan</b> — endpoints, parameters, file paths, and forgotten subdomains.
        </p>
        <p>
          Authorized testers mine this archive gold before touching the target: old admin routes, backup files, API versions, and parameter names that focus every scanner that follows. Pipe its output through dedup and live-host filtering for a recon list no crawler alone produces.
        </p>
        <FeatureGrid items={[
          { i: '🗄️', t: 'Four Archives', d: 'Wayback, Common Crawl, OTX, and URLScan in one run.' },
          { i: '🔑', t: 'Param Discovery', d: 'Historic parameter names for XSS and injection lists.' },
          { i: '📁', t: 'Forgotten Files', d: 'Backups and exports the current site forgot.' },
          { i: '🌐', t: 'Subdomain Bonus', d: 'Old hostnames crawlers never see today.' },
          { i: '🔗', t: 'Pipe Ready', d: 'Clean output chaining into HTTPX and scanners.' },
          { i: '🧹', t: 'Filter Flags', d: 'Subdomain-only and dedup controls built in.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install GAU on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian with Go installed:</p>
        <CodeBlock title="terminal" lines={`go install github.com/lc/gau/v2/cmd/gau@latest`} />
        <InfoBox title="Verify the install">
          Run gau --help after installing and confirm the Go binary directory is on your PATH. Archive APIs need no keys for basic harvesting — rate limits apply on huge scopes.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Harvest a Domain" subtitle="Pull every remembered URL">
        <p className="text-xs text-slate-400">Harvest historic URLs for your authorized lab domain:</p>
        <CodeBlock title="terminal" lines={`echo target.lab | gau`} />
        <InfoBox title="Taming the flood">
          Archive pulls return thousands of URLs including junk. Pipe through sort -u immediately, then filter extensions of interest — php, aspx, js, bak, old — before any follow-up testing.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Subdomains & Params" subtitle="Mine hosts and injectable inputs">
        <p className="text-xs text-slate-400">Collect historic subdomains and parameter-bearing URLs separately:</p>
        <CodeBlock title="terminal" lines={`echo target.lab | gau --subs
# parameters only:
# echo target.lab | gau | grep -E "\?.*="`} />
        <InfoBox title="Subs and params workflow">
          The --subs flag surfaces forgotten hostnames for DNS validation. Parameter URLs feed DalFox and custom injection lists — historic params reveal inputs the current site hides.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Filter to Live" subtitle="Keep only what answers today">
        <p className="text-xs text-slate-400">Validate harvested URLs against the live authorized target:</p>
        <CodeBlock title="terminal" lines={`echo target.lab | gau | sort -u | httpx -mc 200 -o live-urls.txt`} />
        <InfoBox title="Archive to live pipeline">
          Most archived URLs are dead — HTTPX with -mc 200 keeps the living. Scan live-urls.txt with nuclei and Katana-crawl the survivors for a complete authorized inventory.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="GAU harvest streaming historic URLs">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/gau/gau_logo.jpg" alt="GAU URL collector logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">GAU output — historic endpoints ready for filtering</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What GAU Harvests Find" subtitle="Common discoveries from archive mining">
        <FeatureGrid items={[
          { i: '📁', t: 'Backup Files', d: 'Archived copies of configs and databases.' },
          { i: '🔌', t: 'Old API Versions', d: 'Unprotected v1 endpoints still answering.' },
          { i: '🔑', t: 'Leaked Parameters', d: 'Tokens and IDs living in archived query strings.' },
          { i: '🌐', t: 'Dead Subdomains', d: 'Forgotten hosts that resurrected with new owners.' },
          { i: '🧪', t: 'Test Routes', d: 'Staging paths indexed years ago, still live.' },
          { i: '📜', t: 'JS Histories', d: 'Old script bundles naming retired endpoints.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Almost no URLs returned"
            fix="Confirm the domain spelling and try without --subs first. Young or obscure domains have thin archives — pair GAU with live crawling instead."
          />
          <IssueRow
            issue="Output is mostly junk"
            fix="Filter aggressively: sort -u, strip static assets, keep parameter URLs and interesting extensions. Archive breadth demands ruthless narrowing."
          />
          <IssueRow
            issue="Rate limited mid-harvest"
            fix="Slow down and split large scopes across runs. Public archive endpoints throttle heavy users — cache results per engagement."
          />
          <IssueRow
            issue="Live filtering kills everything"
            fix="Expect it — archives remember the dead. Lower to -mc 200,301,302 to catch redirects, and treat survivors as gold."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key GAU Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">&lt;domain&gt; via stdin</div>
            <div className="text-xs text-slate-400">Pipe the target domain into gau.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--subs</div>
            <div className="text-xs text-slate-400">Include historic subdomains in the harvest.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--o</div>
            <div className="text-xs text-slate-400">Write raw harvest to a file (pair with sort -u).</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--providers</div>
            <div className="text-xs text-slate-400">Choose which archives to query.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--threads</div>
            <div className="text-xs text-slate-400">Control concurrent archive requests.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">sort -u pairing</div>
            <div className="text-xs text-slate-400">Essential dedup before downstream tools.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official GAU GitHub Repository', 'https://github.com/lc/gau'],
            ['📖', 'GAU Usage Documentation', 'https://github.com/lc/gau#usage'],
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
