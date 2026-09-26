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
  { q: 'What is OWASP Amass?', a: 'OWASP Amass is an open-source network mapping and attack surface discovery tool. It performs in-depth subdomain enumeration, DNS resolution, scraping, and graph-database modeling of network perimeters.' },
  { q: 'Is using Amass legal?', a: 'Yes, Amass itself is a legitimate open-source security tool. However, running active enumeration or assessing targets without explicit authorization is prohibited. Always ensure you own the domain or have written authorization.' },
  { q: 'How does Amass differ from other subdomain finders?', a: 'Amass combines extensive passive data source aggregation with active DNS resolution, scraping, ASN mapping, and an embedded graph database engine to maintain a comprehensive topology of external assets.' },
  { q: 'What is the difference between active and passive mode?', a: 'Passive enumeration collects data purely from third-party sources (like Certificate Transparency logs, DNS databases, search engines) without contacting the target. Active mode performs DNS resolution, brute-forcing, and zone transfers directly.' },
  { q: 'How do I run basic subdomain enumeration in Amass?', a: 'Run `amass enum -d example.com`. You can scan multiple domains with `amass enum -df targets.txt` or inspect results stored in the graph database with `amass db -d example.com -enum`.' },
  { q: 'What is the Amass graph database?', a: 'Amass automatically stores discovery findings (domains, IP addresses, netblocks, ASNs) in a graph database. The `amass db` command lets you query, summarize, and track changes across assessments.' },
  { q: 'How can site owners protect against subdomain enumeration?', a: 'Maintain a strict inventory of all DNS records, remove dangling DNS pointers (to prevent subdomain takeovers), protect internal/staging domains behind VPNs or zero-trust access, and perform regular attack surface audits.' },
]

const howItWorks = [
  'Install OWASP Amass via Go or precompiled binaries.',
  'Run basic discovery against your domain using amass enum -d example.com.',
  'Process multiple targets simultaneously with a targets file using amass enum -df targets.txt.',
  'Query and inspect discovered assets in the graph database using amass db -d example.com -enum.',
  'Audit your DNS perimeter and eliminate unneeded subdomains.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Amass Subdomain Mapper — Attack Surface & Subdomain Discovery Guide',
      description: 'Step-by-step reference: use OWASP Amass for in-depth attack surface mapping and subdomain enumeration. Educational purposes only.',
      about: 'OWASP Amass subdomain enumeration and attack surface discovery tool',
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

export default function hackolution_Amass() {
  return (
    <ToolLayout
      title="Amass Subdomain Mapper"
      desc="Step-by-step reference: use OWASP Amass for in-depth attack surface mapping and subdomain enumeration. Educational purposes only."
      icon="🌐"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/amass"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://i.ytimg.com/vi/E-6uJ0j3xMo/hqdefault.jpg" />
      </Helmet>

      <Section id="video" icon="🎬" title="HACKOLUTION reel" subtitle="Watch on Instagram, then practice below in your lab">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-white/10 p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(214,41,118,0.12), rgba(17,24,39,0.6))' }}>
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-lg font-bold text-white mb-2">Watch the Amass Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for rapid insights into attack surface mapping, recon methodologies, and defensive auditing.
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
        OWASP Amass maps external network perimeters and subdomain infrastructure. Use it <b>only against systems you own or have explicit written permission to assess</b>.
        Unauthorized scanning, enumeration, or footprinting of third-party domains is strictly prohibited and illegal. This guide is provided for <b>educational and authorized security testing only</b>.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is OWASP Amass?" subtitle="In-depth attack surface mapping and DNS discovery">
        <p>
          <b>OWASP Amass</b> is an industry-standard open-source tool designed for in-depth network mapping and external asset discovery.
          It helps security professionals and authorized defenders map the attack surface of an organization by discovering valid subdomains,
          IP addresses, CIDR netblocks, Autonomous System Numbers (ASNs), and DNS relationships.
        </p>
        <p>
          Unlike basic recon tools that only query a handful of search engines, Amass integrates with dozens of passive feeds, active DNS brute-forcing,
          scraping, and certificate transparency logs. All discovered relationships are organized within a built-in graph database.
        </p>
        <FeatureGrid items={[
          { i: '🗺️', t: 'Attack Surface Mapping', d: 'Maps domains, IPs, netblocks, and ASNs.' },
          { i: '📡', t: 'Passive & Active Recon', d: 'Aggregates dozens of public sources and DNS resolvers.' },
          { i: '🗄️', t: 'Graph Database Engine', d: 'Stores and tracks asset relationships across scans.' },
          { i: '📑', t: 'Multi-Target Scanning', d: 'Process target lists in batch for broad visibility.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="Prerequisites before running Amass">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Go compiler installed (version 1.21+ recommended)'],
            ['☑️', 'A domain you own or are explicitly authorized to assess'],
            ['☑️', '(Optional) amass config file with API keys for enhanced passive data'],
            ['☑️', 'Clean internet connection or dedicated list of reliable DNS resolvers'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install OWASP Amass with Go">
        <CodeBlock title="terminal" lines={`go install github.com/owasp-amass/amass/v4/...@master`} />
        <InfoBox title="PATH Configuration">
          Ensure your Go binary path is included in your system environment variables. If <span className="font-mono">amass</span> is not recognized,
          add <span className="font-mono">export PATH=&quot;$PATH:$(go env GOPATH)/bin&quot;</span> to your <span className="font-mono">~/.bashrc</span> or <span className="font-mono">~/.zshrc</span>.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic Subdomain Enumeration" subtitle="Discover subdomains for a single target domain">
        <p className="text-xs text-slate-400">Run standard enumeration against your authorized target domain:</p>
        <CodeBlock title="terminal" lines={`amass enum -d example.com`} />
        <InfoBox title="How it works">
          Amass gathers information from default passive sources, verifies DNS resolution, and displays discovered subdomains alongside their IP addresses and ASN data directly to standard output.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🗂️" title="Command 2 — Bulk Enumeration via Target List" subtitle="Scan multiple domains from a text file">
        <p className="text-xs text-slate-400">Pass a list of domain names using the <span className="font-mono">-df</span> flag:</p>
        <CodeBlock title="terminal" lines={`amass enum -df targets.txt`} />
        <InfoBox title="Target File Format">
          Create a plain text file named <span className="font-mono">targets.txt</span> with one domain per line (for example <span className="font-mono">example.com</span> and <span className="font-mono">example.org</span>). Amass will queue and enumerate all listed roots.
        </InfoBox>
      </Section>

      <Section id="command3" icon="🗄️" title="Command 3 — Graph Database Inspection" subtitle="Query historical results and topology from the Amass database">
        <p className="text-xs text-slate-400">Inspect the database records and graph relationships for an enumerated domain:</p>
        <CodeBlock title="terminal" lines={`amass db -d example.com -enum`} />
        <InfoBox title="Database Utility">
          Amass persists findings inside an embedded graph database located in your Amass output directory. Using <span className="font-mono">amass db</span> lets you re-examine past assessments, view ASN mappings, or output summary reports without re-running network queries.
        </InfoBox>
      </Section>

      <Section id="output" icon="📊" title="What Output Looks Like" subtitle="Understanding Amass terminal results">
        <p className="text-xs text-slate-400">During enumeration, Amass outputs discovered FQDNs, associated IP addresses, ASNs, and CIDR blocks:</p>
        <CodeBlock title="sample output" lines={`[OWASP Amass v4.2.0]
----------------------------------------------------------------
OWASP Amass Subdomain Enumeration for example.com
----------------------------------------------------------------
api.example.com                              93.184.216.34 (AS15133 - EDGECAST, US)
auth.example.com                             93.184.216.35 (AS15133 - EDGECAST, US)
dev.internal.example.com                     198.51.100.22 (AS64496 - EXAMPLE-NET, US)
vpn.example.com                              93.184.216.40 (AS15133 - EDGECAST, US)
staging.api.example.com                      93.184.216.36 (AS15133 - EDGECAST, US)

----------------------------------------------------------------
Discovery Summary:
AS15133 - EDGECAST, US               -> 4 Subdomain(s) mapped
AS64496 - EXAMPLE-NET, US            -> 1 Subdomain(s) mapped
Total Discovered Subdomains: 5`} />
        <InfoBox title="Output Interpretation">
          Notice how Amass pairs subdomains with their respective IP addresses, routing autonomous systems (ASNs), and network organization tags, providing immediate architectural context.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening Your Attack Surface" subtitle="Practical steps for site owners & defenders">
        <FeatureGrid items={[
          { i: '🧹', t: 'Clean Up Stale Records', d: 'Audit DNS zones regularly to purge abandoned subdomains and test environments.' },
          { i: '🔒', t: 'Prevent Subdomain Takeovers', d: 'Ensure CNAME records point only to active and claimed cloud services or S3 buckets.' },
          { i: '🛡️', t: 'Enforce Zero Trust & VPN', d: 'Never rely on obscurity for staging, development, or administration dashboards.' },
          { i: '📡', t: 'Continuous Surface Monitoring', d: 'Periodically run authorized discovery scans to detect unexpected exposed assets.' },
        ]} />
      </Section>

      <Section id="flags" icon="🏷️" title="Key Amass Flags &amp; Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-d &lt;domain&gt;</div>
            <div className="text-xs text-slate-400">Specify the target domain name to enumerate.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-df &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Path to a text file containing target domains (one per line).</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-passive</div>
            <div className="text-xs text-slate-400">Perform passive discovery only without sending direct DNS queries.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-active</div>
            <div className="text-xs text-slate-400">Attempt zone transfers and active certificate pulls on discovered hosts.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-ip</div>
            <div className="text-xs text-slate-400">Print IP addresses for each discovered subdomain.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Save standard text output to the specified filename.</div>
          </div>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues &amp; Fixes" subtitle="Troubleshooting typical problems">
        <div className="space-y-3">
          <IssueRow
            issue="amass: command not found"
            fix={'Ensure $(go env GOPATH)/bin is in your system PATH (export PATH="$PATH:$(go env GOPATH)/bin") or download precompiled binaries from GitHub releases.'}
          />
          <IssueRow
            issue="Slow scan performance or DNS throttling"
            fix="Specify reliable public DNS resolvers using the config file or run in passive mode with the -passive flag to avoid query rate limits."
          />
          <IssueRow
            issue="Database lock error when running multiple instances"
            fix="Amass uses an embedded graph database lock. Avoid running multiple concurrent scans on the same output directory, or specify separate directories with the -dir parameter."
          />
          <IssueRow
            issue="Missing deep passive results"
            fix="Add free API keys (e.g. VirusTotal, SecurityTrails, Censys, Shodan) into your config.ini file to enable high-volume data sources."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official OWASP Amass repo', 'https://github.com/owasp-amass/amass'],
            ['📖', 'OWASP Amass Documentation & User Guide', 'https://github.com/owasp-amass/amass/blob/master/doc/user_guide.md'],
            ['🛡️', 'OWASP Foundation Project Page', 'https://owasp.org/www-project-amass/'],
            ['📸', 'HACKOLUTION Instagram', 'https://www.instagram.com/hackolution'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before enumerating targets">
        <p>
          This documentation is provided <b>strictly for educational and authorized purposes</b>. OWASP Amass discovers
          and maps publicly available DNS records and network topology, but using it against systems without explicit written permission
          is unlawful. Test only systems you own or are authorized to assess under a formal scope of work. The authors and this website assume no liability for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
