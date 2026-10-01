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
  { q: "What is Masscan?", a: "Masscan is an open-source TCP port scanner built for raw speed. It sends and receives packets asynchronously with no per-connection state, so it sustains millions of packets per second — far faster than any traditional scanner. It is a discovery tool: it finds open ports at scale, then you hand the results to Nmap for precise service detection." },
  { q: "Is using Masscan legal?", a: "Masscan itself is a legitimate open-source security tool. Scanning any host or network without explicit written permission is illegal. Masscan also transmits packets at extremely high rates; an aggressive scan against a live network can saturate links and knock systems offline, which can amount to a denial of service. Test only networks you own or are authorized to assess, and keep --rate within safe limits." },
  { q: "How do I install Masscan on Kali or Ubuntu?", a: "On Kali, Ubuntu, or Debian run sudo apt update && sudo apt install masscan -y. Alternatively build from source: git clone https://github.com/robertdavidgraham/masscan, then cd masscan and make. Masscan needs raw-socket privileges, so run scans with sudo or use --unprivileged to fall back to TCP connect mode." },
  { q: "How do I scan a subnet with Masscan?", a: "Run masscan -p1-65535 192.168.1.0/24 --rate=10000 -oX masscan.xml to sweep every TCP port across the subnet, cap transmission at 10,000 packets per second, and save the results as XML. Import the file into Nmap with nmap -iX masscan.xml to add service and version detection on the open ports." },
  { q: "How do I control scan rate and grab banners?", a: "Set the packet rate with --rate (packets per second). Add --banners to capture service banners from open ports, for example masscan 93.184.216.0/24 -p80,443 --banners --rate=1000. Banner grabbing completes a full TCP handshake and reads the service response, so keep the port list narrow and the rate modest." },
  { q: "What is the difference between Masscan and Nmap?", a: "Masscan is asynchronous and stateless: it trades per-connection accuracy for raw throughput, ideal for sweeping huge address spaces in seconds. Nmap is slower but precise: service and version detection, OS fingerprinting, and reliable results. A common workflow is to sweep with Masscan, then run Nmap against the open ports it found." },
]

const howItWorks = [
  "Install Masscan via apt (sudo apt install masscan -y) or build from source with git clone https://github.com/robertdavidgraham/masscan and make.",
  "Sweep every TCP port on your lab subnet with masscan -p1-65535 192.168.1.0/24 --rate=10000 -oX masscan.xml.",
  "Control blast radius with --rate, and protect critical devices by skipping them with --exclude 192.168.1.1.",
  "Grab service banners on discovered hosts using --banners on a narrow port set, for example -p80,443 --rate=1000.",
  "Import the XML into Nmap with nmap -iX masscan.xml for precise service detection, then close or firewall everything that should not be exposed.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Masscan Fast Port Scanner — Internet-Scale Port Scanning & Rate Control Guide',
      description: 'Step-by-step reference: use Masscan for Internet-scale port scanning, banner grabs and rate control. Educational purposes only.',
      about: 'Masscan asynchronous stateless port scanner',
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

export default function hackolution_Masscan() {
  return (
    <ToolLayout
      title="Masscan Fast Port Scanner"
      desc="Step-by-step reference: use Masscan for Internet-scale port scanning, banner grabs and rate control. Educational purposes only."
      icon="⚡"
      iconBg="linear-gradient(135deg, rgba(250,204,21,0.18), rgba(251,146,60,0.08))"
      category="security"
      slug="hackolution/masscan"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Masscan Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for Internet-scale port scanning, packet rates, banner grabbing, and how defenders spot a Masscan sweep.
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
        Masscan transmits packets at millions of packets per second. Scanning any host or network without explicit written permission is strictly prohibited and illegal. A rate set too high can saturate links and knock systems offline, which can amount to a denial of service. Use Masscan <b>only on networks you own or are authorized to assess</b>, keep --rate within safe limits, and always exclude critical infrastructure with --exclude.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is Masscan?" subtitle="The fastest open-source port scanner, built for Internet-scale sweeps">
        <p>
          <b>Masscan</b> is an open-source TCP port scanner built by Robert David Graham to sweep Internet-scale address space.
          It transmits and receives packets <b>asynchronously with no per-connection state</b>, sustaining <b>millions of packets per second</b> —
          a full 65,535-port sweep of a /24 takes seconds, not hours.
        </p>
        <p>
          Unlike Nmap, which prioritizes precision with service detection and OS fingerprinting, Masscan prioritizes raw throughput:
          it answers only the question of which ports are open. Pair it with Nmap for depth — sweep with Masscan, then scan the open ports it finds with Nmap -sV -sC.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Millions of Packets per Second', d: 'Asynchronous, stateless transmit design with no per-connection overhead.' },
          { i: '🌐', t: 'Internet-Scale Sweeps', d: 'Full port ranges across entire subnets in seconds, not hours.' },
          { i: '🏷️', t: 'Banner Grabbing', d: 'Pull service banners from open ports with --banners for version hints.' },
          { i: '🎯', t: 'Rate Control', d: '--rate caps packets per second to stay within limits and authorization.' },
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Masscan on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian:</p>
        <CodeBlock title="terminal" lines={`sudo apt update && sudo apt install masscan -y`} />
        <p className="text-xs text-slate-400 mt-3">Or build from source (recommended for the latest features):</p>
        <CodeBlock title="terminal" lines={`git clone https://github.com/robertdavidgraham/masscan
cd masscan
make`} />
        <InfoBox title="Root privileges required">
          Masscan crafts raw packets, so scans normally need sudo. Without root it cannot send SYN probes; run with sudo, or pass --unprivileged to fall back to TCP connect mode (slower, no raw sockets). On Linux you may also see a hint to raise the socket buffer: sudo sysctl -w net.core.rmem_max=33554432.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Subnet Port Sweep" subtitle="Scan every TCP port on a subnet at a controlled rate">
        <p className="text-xs text-slate-400">Sweep all 65,535 TCP ports across your authorized lab subnet, capped at 10,000 packets per second, saving results as XML:</p>
        <CodeBlock title="terminal" lines={`masscan -p1-65535 192.168.1.0/24 --rate=10000 -oX masscan.xml`} />
        <InfoBox title="Reading the results">
          -p1-65535 sweeps the full TCP port range, --rate=10000 keeps transmission at 10,000 packets per second, and -oX writes machine-readable XML.
          Import the file into Nmap with nmap -iX masscan.xml to add service and version detection on the open ports only.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Banner Grabbing" subtitle="Capture service banners from open ports">
        <p className="text-xs text-slate-400">Grab service banners from web ports on an authorized target range:</p>
        <CodeBlock title="terminal" lines={`masscan 93.184.216.0/24 -p80,443 --banners --rate=1000`} />
        <InfoBox title="How banner grabbing works">
          --banners completes a full TCP handshake and reads the first bytes the service sends back, revealing server software and versions.
          Banner grabbing needs established connections, so keep the port list narrow (-p80,443) and the rate modest (--rate=1000).
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Unprivileged Scan with Exclude" subtitle="Run without raw sockets and skip critical devices">
        <p className="text-xs text-slate-400">Run without raw-socket privileges and skip a critical device such as the gateway:</p>
        <CodeBlock title="terminal" lines={`masscan -p22,80,443 192.168.1.0/24 --rate=5000 --unprivileged --exclude 192.168.1.1`} />
        <InfoBox title="Privileged vs unprivileged">
          --unprivileged uses ordinary TCP connect() calls instead of raw SYN packets: no sudo needed, but slower and easier for targets to spot.
          --exclude skips listed IPs; use --excludefile hosts.txt for long lists, and --include/--includefile to restrict a scan to specific addresses.
        </InfoBox>
      </Section>

      <Section id="findings" icon="🔍" title="What Masscan Scans Find" subtitle="Common discoveries from fast port sweeps">
        <FeatureGrid items={[
          { i: '🚪', t: 'Open Ports at Scale', d: 'Every listening TCP port across entire subnets in seconds.' },
          { i: '🖧', t: 'Exposed Services', d: 'SSH, HTTP, databases, and admin panels listening on the network.' },
          { i: '🏷️', t: 'Service Banners', d: 'Software and version strings leaked by banner grabbing.' },
          { i: '🌐', t: 'Internet-Wide Exposure', d: 'Forgotten hosts, dev boxes, and test servers reachable from outside.' },
          { i: '🔓', t: 'Unpatched Listeners', d: 'Outdated services still bound on production machines.' },
          { i: '📡', t: 'Fast Attack-Surface Mapping', d: 'Rapid inventory for authorized audits and red-team scoping.' },
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure found by Masscan">
        <div className="space-y-3">
          <IssueRow
            issue="Open ports exposed to the Internet or LAN"
            fix="Close unused ports with your host firewall (ufw deny, or iptables -A INPUT -p tcp --dport PORT -j DROP) and disable services you do not use."
          />
          <IssueRow
            issue="High-rate scan traffic floods internal networks"
            fix="Deploy firewall rules at the network edge to rate-limit and filter scan traffic, and segment critical systems away from general LANs."
          />
          <IssueRow
            issue="High-rate scans not detected by monitoring"
            fix="Configure IDS/IPS (Suricata, Snort) with thresholds for unusual SYN rates and masscan-specific patterns, and alert on mass connection attempts."
          />
          <IssueRow
            issue="Service banners leak software versions"
            fix="Hide banners and version strings: Apache ServerTokens Prod, nginx server_tokens off;, and upgrade or remove outdated services."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Masscan Flags &amp; Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-p &lt;ports&gt;</div>
            <div className="text-xs text-slate-400">Port list or range to scan, for example -p80,443 or -p1-65535.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--rate &lt;pps&gt;</div>
            <div className="text-xs text-slate-400">Maximum packets per second to transmit during the scan.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--banners</div>
            <div className="text-xs text-slate-400">Grab service banners from open ports via full TCP handshakes.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-oX &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Write scan results to XML, importable with nmap -iX.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--unprivileged</div>
            <div className="text-xs text-slate-400">Run without raw sockets using ordinary TCP connect calls (no sudo).</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--exclude / --include</div>
            <div className="text-xs text-slate-400">Skip or restrict to specific IPs; use excludefile/includefile for lists.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Masscan GitHub Repository', 'https://github.com/robertdavidgraham/masscan'],
            ['📖', 'Masscan Usage Documentation', 'https://github.com/robertdavidgraham/masscan#usage'],
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
    </ToolLayout>
  )
}
