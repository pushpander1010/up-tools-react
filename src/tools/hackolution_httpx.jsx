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
  { q: "What is HTTPX?", a: "HTTPX is a free, open-source HTTP probing tool in Go by ProjectDiscovery. It takes thousands of hostnames and reports which serve live web pages, with status codes, titles, technologies, and content lengths." },
  { q: "Is using HTTPX legal?", a: "HTTPX itself is legitimate open-source software. Probing hosts without explicit written permission is illegal. Use it only on systems you own or authorized assessment targets, with modest thread counts." },
  { q: "How do I install HTTPX?", a: "Run go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest with Go installed. Verify with httpx -version and rerun the command to update." },
  { q: "How do I find live hosts?", a: "Pipe subdomain output with subfinder -d target.com -silent | httpx -title -tech-detect -status-code. Live hosts print with status, title, and tech — filter with -mc 200 for successes only." },
  { q: "How do I probe custom ports and paths?", a: "Add -ports 80,443,8080,8443 and -path /admin to test every host on those ports and that path. Combine with -mc to keep only interesting statuses." },
  { q: "How does HTTPX fit a recon pipeline?", a: "Subfinder enumerates names, HTTPX confirms live web hosts, and nuclei scans the survivors. JSON output with -json chains each stage without manual copying." },
  { q: "Why do known-live hosts show nothing?", a: "Extend -timeout, add -retries, and check routing or proxy needs. Some hosts require a browser User-Agent header or block datacenter IPs." },
  { q: "How is HTTPX different from Nmap?", a: "Nmap maps ports and services at the network layer. HTTPX works at the web layer: titles, technologies, and paths across thousands of hosts in seconds." }
]

const howItWorks = [
  "Install HTTPX with go install and verify with httpx -version.",
  "Enumerate subdomains of your authorized target and pipe them into httpx -title -tech-detect.",
  "Filter to live hosts with -mc 200,301,302 and probe custom ports and paths.",
  "Save JSON with -json -o live.json and feed survivors into nuclei.",
  "Manually review every interesting host, then report and remediate exposures."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'HTTPX Fast HTTP Prober — Live Host Probing & Tech Detection Guide',
      description: 'Step-by-step reference: probe live web hosts fast with HTTPX status, title & tech detect. Lab use only.',
      about: 'HTTPX ProjectDiscovery HTTP probing toolkit',
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

export default function hackolution_httpx() {
  return (
    <ToolLayout
      title="HTTPX Fast HTTP Prober"
      desc="Step-by-step reference: probe live web hosts fast with HTTPX status, title & tech detect. Lab use only."
      icon="🌐"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(27,255,110,0.08))"
      category="security"
      slug="hackolution/httpx"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the HTTPX Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for live-host probing, status filtering, and tech detection that focuses every web test.
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
        HTTPX sends real HTTP requests to targets. Probing any host or network without explicit written permission is strictly prohibited and illegal. Use HTTPX <b>only on systems you own, lab targets, or engagements covered by a signed authorization</b>. Keep thread counts modest and respect scope files.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is HTTPX?" subtitle="Blazing HTTP probing from ProjectDiscovery">
        <p>
          <b>HTTPX</b> is a free, open-source <b>HTTP probing toolkit</b> written in <b>Go</b> by ProjectDiscovery. Feed it thousands of hostnames and it tells you which ones serve <b>live web pages</b> — with status codes, page titles, detected technologies, and content lengths — in seconds.
        </p>
        <p>
          It is the filter between subdomain enumeration and vulnerability scanning: subfinder finds names, HTTPX confirms which ones are alive and interesting, and only those move on to nuclei or manual testing. Pipelines built on HTTPX output are the backbone of modern bug-bounty recon.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Thousands of Hosts Fast', d: 'Concurrent Go engine probes huge lists in seconds.' },
          { i: '🏷️', t: 'Title & Status Capture', d: 'Status codes, page titles, and content lengths per host.' },
          { i: '🔍', t: 'Tech Detection', d: 'Fingerprints frameworks, CMS, and server stacks automatically.' },
          { i: '🔗', t: 'Pipeline Friendly', d: 'Reads stdin and writes JSON for chaining with other tools.' },
          { i: '🛣️', t: 'Port & Path Probing', d: 'Sweep ports and paths across every input host at once.' },
          { i: '📊', t: 'Smart Filtering', d: 'Match or filter by status code to keep only live targets.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install HTTPX on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian with Go installed:</p>
        <CodeBlock title="terminal" lines={`go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest`} />
        <InfoBox title="Verify the install">
          Run httpx -version after installing and confirm the Go binary directory is on your PATH. Update regularly with the same command — ProjectDiscovery ships fingerprint and feature updates often.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Probe a Host List" subtitle="Find live web hosts with titles">
        <p className="text-xs text-slate-400">Probe every subdomain from your authorized enumeration for live web services:</p>
        <CodeBlock title="terminal" lines={`subfinder -d target.com -silent | httpx -title -tech-detect -status-code`} />
        <InfoBox title="Reading the results">
          Each live host prints with its status code, page title, and detected technologies. Pipe failures and dead hosts away with -mc 200 to keep only successful pages, then feed the survivors into deeper scanning.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Ports, Paths & Filtering" subtitle="Narrow and widen the probe surface">
        <p className="text-xs text-slate-400">Probe custom ports and a specific path while keeping only live responses:</p>
        <CodeBlock title="terminal" lines={`httpx -l hosts.txt -ports 80,443,8080,8443 -path /admin -mc 200,301,302`} />
        <InfoBox title="Ports and match codes">
          The -ports flag tests each host on every listed port. The -path flag appends one path to all probes. The -mc flag keeps only chosen status codes so dead hosts never reach your notes.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — JSON Output for Pipelines" subtitle="Save machine-readable results">
        <p className="text-xs text-slate-400">Write structured JSON for chaining into nuclei and your reports:</p>
        <CodeBlock title="terminal" lines={`httpx -l hosts.txt -json -o live.json`} />
        <InfoBox title="Using the JSON">
          Each line of live.json is one host with fields for URL, title, status, technologies, and content length. Parse it with jq or feed URLs straight into nuclei with cat live.json | jq -r .url | nuclei.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="HTTPX probing a host list">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/httpx/httpx_logo.jpg" alt="HTTPX fast HTTP prober logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">HTTPX live-host results with status codes and detected tech</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What HTTPX Probes Find" subtitle="Common discoveries from live-host sweeps">
        <FeatureGrid items={[
          { i: '✅', t: 'Live Web Hosts', d: 'Which enumerated names actually serve HTTP content.' },
          { i: '🏷️', t: 'Titles & Statuses', d: 'Login pages, dashboards, and error states worth opening.' },
          { i: '🧩', t: 'Tech Stacks', d: 'WordPress, Laravel, Nginx versions guiding exploit choice.' },
          { i: '🔌', t: 'Odd Ports Serving HTTP', d: 'Admin panels hiding on 8080, 8443, and custom ports.' },
          { i: '📁', t: 'Interesting Paths', d: 'Exposed /admin, /api, and staging routes across hosts.' },
          { i: '🎯', t: 'Focused Target Lists', d: 'A short live list replacing thousands of raw names.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="No output for known-live hosts"
            fix="Check VPN or lab connectivity first, then retry with -timeout 10 and -retries 2. Some hosts need -http-proxy through Burp or drop probes without a -header User-Agent."
          />
          <IssueRow
            issue="Too many timeouts on big lists"
            fix="Lower concurrency with -threads 25 and raise -timeout. Split huge files into chunks so one slow network cannot stall everything."
          />
          <IssueRow
            issue="Tech detection misses the stack"
            fix="Update HTTPX for fresh fingerprints and combine -tech-detect with manual Wappalyzer checks. Custom or heavily proxied apps often need eyeballing."
          />
          <IssueRow
            issue="Blocked by rate limiting or WAF"
            fix="Slow down with -rate-limit 50, rotate -proxy lists, and stay inside the authorized scope. Aggressive probing trips defenses fast."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key HTTPX Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-l &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Input file with one hostname or IP per line.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-title -status-code</div>
            <div className="text-xs text-slate-400">Capture page titles and HTTP status codes.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-tech-detect</div>
            <div className="text-xs text-slate-400">Fingerprint frameworks and server technologies.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-ports &lt;list&gt;</div>
            <div className="text-xs text-slate-400">Probe each host on the listed ports.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-mc &lt;codes&gt;</div>
            <div className="text-xs text-slate-400">Keep only responses with matching status codes.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-json -o &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Machine-readable output saved to a file.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official HTTPX GitHub Repository', 'https://github.com/projectdiscovery/httpx'],
            ['📖', 'HTTPX Usage Documentation', 'https://github.com/projectdiscovery/httpx#usage'],
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
