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
  { q: "What is RustScan?", a: "RustScan is a free, open-source port scanner written in Rust. It finds open ports in seconds using an asynchronous sweep, then automatically passes the results to Nmap for service detection and scripting. It is a discovery accelerator: RustScan finds where to look, Nmap tells you what is there." },
  { q: "Is using RustScan legal?", a: "RustScan itself is a legitimate open-source security tool. Scanning any host or network without explicit written permission is illegal. Its high speed can also stress fragile networks, so test only systems you own or are authorized to assess, and keep batch sizes reasonable." },
  { q: "How do I install RustScan?", a: "Install it with cargo install rustscan if you have Rust, download the .deb from the GitHub releases page and run sudo dpkg -i on Debian-based systems, or pull the Docker image. Also install Nmap with sudo apt install nmap -y, since RustScan hands results to it." },
  { q: "How do I run a basic RustScan scan?", a: "Run rustscan -a 192.168.1.10 -- -sV -sC against your authorized lab target. RustScan sweeps all ports in seconds, then Nmap runs version detection and default scripts on the open ports only." },
  { q: "How do I control scan speed?", a: "Use -b to set the batch size and -t to set the per-probe timeout in milliseconds. Lower batch sizes are gentler on fragile networks. Limit the range with -r when you only care about specific ports." },
  { q: "What is the difference between RustScan and Nmap?", a: "RustScan is optimized for one job: finding open ports as fast as possible. Nmap is slower but far deeper: versions, OS detection, and scripting. The standard workflow is RustScan first for speed, then Nmap on the open ports for depth." },
  { q: "Can RustScan scan UDP ports?", a: "Yes. Add the -u flag to include UDP services alongside TCP. UDP scans are slower because closed UDP ports usually stay silent, so pair -u with a narrow -r range." },
  { q: "Why did my scan find nothing?", a: "Verify the target is reachable, extend the timeout with -t 3000, and lower the batch size with -b 500. Firewalls and VPN routing are the most common reasons probes never return." }
]

const howItWorks = [
  "Install RustScan via cargo install rustscan or the GitHub .deb, plus Nmap with sudo apt install nmap -y.",
  "Sweep your authorized lab target with rustscan -a 192.168.1.10 -- -sV -sC for ports plus service detail.",
  "Control blast radius with -r port ranges, -b batch size, and -t timeouts on fragile networks.",
  "Cover UDP services with -u on narrow ranges, and save greppable output with -g for your notes.",
  "Investigate every open port found, then close or firewall everything that should not be exposed."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'RustScan Fast Port Scanner — Seconds-Fast Recon & Nmap Handoff Guide',
      description: 'Step-by-step reference: scan ports in seconds with RustScan and pipe results to Nmap. Educational use only.',
      about: 'RustScan fast asynchronous port scanner',
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

export default function hackolution_rustscan() {
  return (
    <ToolLayout
      title="RustScan Fast Port Scanner"
      desc="Step-by-step reference: scan ports in seconds with RustScan and pipe results to Nmap. Educational use only."
      icon="⚡"
      iconBg="linear-gradient(135deg, rgba(250,204,21,0.18), rgba(251,146,60,0.08))"
      category="security"
      slug="hackolution/rustscan"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the RustScan Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for sub-minute port scans, batch sizing, and handing open ports to Nmap for depth.
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
        RustScan transmits probe packets at very high speed. Scanning any host or network without explicit written permission is strictly prohibited and illegal, and an aggressive scan can degrade fragile networks. Use RustScan <b>only on networks you own or are authorized to assess</b>, keep batch sizes reasonable, and exclude critical systems.
      </WarningBox>

      <Section id="overview" icon="⚡" title="What is RustScan?" subtitle="The modern, seconds-fast port scanner written in Rust">
        <p>
          <b>RustScan</b> is a free, open-source <b>port scanner</b> written in <b>Rust</b> that finds every open port on a target in seconds. It splits scanning into two stages: a blazing asynchronous sweep to discover open ports, then an automatic handoff to <b>Nmap</b> for service detection and scripting on exactly those ports.
        </p>
        <p>
          It is the modern answer to slow full-range scans. Instead of waiting on Nmap to grind through all 65,535 ports, RustScan answers which ports are open almost instantly — then Nmap answers what is running on them. The pair has become a standard recon workflow in labs and authorized assessments.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Seconds-Fast Sweeps', d: 'Asynchronous Rust engine scans all 65,535 ports in seconds on a LAN.' },
          { i: '🔗', t: 'Automatic Nmap Handoff', d: 'Pipes open ports straight into Nmap for version detection and scripts.' },
          { i: '🎯', t: 'Batch & Timeout Control', d: 'Tune batch size and timeouts to balance speed against fragile networks.' },
          { i: '🌊', t: 'UDP Support', d: 'Scan UDP services too, not just TCP, with a single flag.' },
          { i: '📟', t: 'Greppable Output', d: 'Machine-readable output that drops cleanly into pipelines and reports.' },
          { i: '🦀', t: 'Modern Rust Build', d: 'Memory-safe, cross-platform binary with easy cargo, apt, and Docker installs.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install RustScan on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install via cargo or the deb package:</p>
        <CodeBlock title="terminal" lines={`cargo install rustscan
# or download the .deb from GitHub releases:
# sudo dpkg -i rustscan_*_amd64.deb`} />
        <InfoBox title="Nmap must be installed too">
          RustScan discovers ports but relies on Nmap for service detection and scripting. Install it with sudo apt install nmap -y. Verify both tools with rustscan --version and nmap --version before scanning.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Fast Full-Port Scan" subtitle="Sweep every port and hand off to Nmap">
        <p className="text-xs text-slate-400">Scan all ports on your authorized lab target with automatic Nmap service detection:</p>
        <CodeBlock title="terminal" lines={`rustscan -a 192.168.1.10 -- -sV -sC`} />
        <InfoBox title="How the handoff works">
          The -a flag sets the target address. Everything after the double dash is passed directly to Nmap, so -sV -sC runs version detection and default scripts only on the open ports RustScan found. You get full depth in a fraction of the time.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Custom Ports & Timing" subtitle="Control ranges, batch size, and timeouts">
        <p className="text-xs text-slate-400">Scan specific ports with tuned speed on your authorized lab network:</p>
        <CodeBlock title="terminal" lines={`rustscan -a 192.168.1.0/24 -r 1-10000 -b 1000 -t 1500`} />
        <InfoBox title="Tuning speed safely">
          The -r flag limits the port range, -b sets the batch size (lower is gentler), and -t sets the per-probe timeout in milliseconds. On fragile lab networks start with -b 500 and raise it only if the network stays stable.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — UDP & Greppable Output" subtitle="Cover UDP services and save machine-readable results">
        <p className="text-xs text-slate-400">Include UDP services and write greppable output for your notes:</p>
        <CodeBlock title="terminal" lines={`rustscan -a 192.168.1.10 -u -g`} />
        <InfoBox title="UDP and output notes">
          The -u flag enables UDP scanning alongside TCP. The -g flag prints greppable output that is easy to parse and paste into reports. UDP scans are slower by nature, so combine -u with a narrow -r range on large networks.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="RustScan mid-scan in the terminal">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/rustscan/rustscan_logo.png" alt="RustScan fast port scanner logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">RustScan open-port sweep handing results to Nmap for service detection</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What RustScan Scans Find" subtitle="Common discoveries from fast port sweeps">
        <FeatureGrid items={[
          { i: '🚪', t: 'Open Ports in Seconds', d: 'Every listening TCP and UDP port across the target range.' },
          { i: '🖧', t: 'Exposed Services', d: 'SSH, web, databases, and admin panels listening on the network.' },
          { i: '🔍', t: 'Nmap-Enriched Detail', d: 'Versions and script findings on exactly the open ports.' },
          { i: '🌐', t: 'Forgotten Hosts', d: 'Dev boxes, test servers, and IoT devices answering on the LAN.' },
          { i: '🔓', t: 'Unpatched Listeners', d: 'Outdated services still bound on lab and production machines.' },
          { i: '📡', t: 'Fast Attack-Surface Map', d: 'Rapid inventory for authorized audits and red-team scoping.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Scan finishes with no open ports found"
            fix="Confirm the target IP is reachable with ping, check you are on the same lab network or VPN, and retry with a longer timeout (-t 3000). Some targets drop probes when the batch size is too high — lower it with -b 500."
          />
          <IssueRow
            issue="Nmap handoff never runs"
            fix="Install Nmap with sudo apt install nmap -y and confirm nmap --version works. RustScan calls the nmap binary directly, so it must be on your PATH."
          />
          <IssueRow
            issue="UDP scan takes very long"
            fix="UDP scanning is inherently slow because most closed UDP ports never reply. Narrow the range with -r (for example -r 53,161,500) instead of sweeping everything."
          />
          <IssueRow
            issue="Permission or socket errors on Linux"
            fix="Raise the file-descriptor limit with ulimit -n 5000 or pass --ulimit 5000, and run with sudo when raw sockets are required."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key RustScan Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-a &lt;target&gt;</div>
            <div className="text-xs text-slate-400">Target address, hostname, or CIDR range to scan.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-r &lt;range&gt;</div>
            <div className="text-xs text-slate-400">Port range to sweep, for example -r 1-10000.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-b &lt;batch&gt;</div>
            <div className="text-xs text-slate-400">Batch size: probes in flight at once. Lower is gentler.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-t &lt;timeout&gt;</div>
            <div className="text-xs text-slate-400">Per-probe timeout in milliseconds.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u</div>
            <div className="text-xs text-slate-400">Enable UDP scanning alongside the TCP sweep.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-g / -- &lt;nmap args&gt;</div>
            <div className="text-xs text-slate-400">Greppable output, and Nmap passthrough after the double dash.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official RustScan GitHub Repository', 'https://github.com/RustScan/RustScan'],
            ['📖', 'RustScan Usage Documentation', 'https://github.com/RustScan/RustScan/wiki'],
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
