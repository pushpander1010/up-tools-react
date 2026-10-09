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
  { q: "What is Bettercap?", a: "Bettercap is a free, open-source man-in-the-middle framework in Go by Evilsocket. It ARP-spoofs lab LANs, sniffs credentials, injects content, and proxies traffic through scriptable caplets with a web UI and API." },
  { q: "Is using Bettercap legal?", a: "Bettercap itself is legitimate auditing software. Intercepting traffic without explicit written permission is illegal. Use it only in isolated labs or signed engagements where interception is explicitly in scope." },
  { q: "How do I install Bettercap?", a: "Run sudo apt install bettercap -y or go install github.com/bettercap/bettercap@latest. Launch with sudo bettercap -iface eth0 on the lab segment." },
  { q: "How do I sniff a lab victim?", a: "Map hosts with net.probe, set arp.spoof.targets to the one signed IP, then arp.spoof on plus net.sniff on. Stop spoofing the moment the demo proof is captured." },
  { q: "Why is the victim offline?", a: "Overbroad spoofing or disabled forwarding breaks its route. Stop immediately, re-target narrowly, and confirm forwarding before retrying." },
  { q: "What is the difference between Bettercap and Wireshark?", a: "Wireshark passively observes traffic it can see. Bettercap actively positions itself in the path via spoofing, then sniffs, injects, and proxies — active versus passive." },
  { q: "Can Bettercap read HTTPS passwords?", a: "Not by sniffing alone — TLS hides them by design. Lab TLS-interception demos need installed CA trust on owned devices and explicit scope, and modern pinning still resists." },
  { q: "How do defenders stop MITM?", a: "Static ARP entries for critical hosts, dynamic ARP inspection on switches, encrypted-everything services, HSTS, and monitoring for spoofing signatures." }
]

const howItWorks = [
  "Join the isolated lab segment and launch Bettercap on its interface.",
  "Map lab hosts with net.probe and confirm the signed victim IP.",
  "Spoof only that IP and sniff an agreed cleartext lab login.",
  "Demonstrate the capture, then stop spoofing immediately.",
  "Mandate encryption everywhere and wipe all lab capture data."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Bettercap MITM Framework — Lab Sniffing & Spoofing Guide',
      description: 'Step-by-step reference: inspect lab traffic with Bettercap sniffing & spoofing. Lab only.',
      about: 'Bettercap man-in-the-middle framework',
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

export default function hackolution_bettercap() {
  return (
    <ToolLayout
      title="Bettercap MITM Framework"
      desc="Step-by-step reference: inspect lab traffic with Bettercap sniffing & spoofing. Lab only."
      icon="🦈"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(239,68,68,0.08))"
      category="security"
      slug="hackolution/bettercap"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Bettercap Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for ARP spoofing basics, cleartext leaks, and the encryption that defeats sniffing.
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
        Bettercap intercepts and manipulates live network traffic. Running spoofing or sniffing on any network without explicit written permission is strictly prohibited and illegal. Use Bettercap <b>only in isolated lab networks or engagements covered by a signed authorization</b> where interception is explicitly in scope. Never capture credentials or personal data beyond the agreed lab accounts.
      </WarningBox>

      <Section id="overview" icon="🦈" title="What is Bettercap?" subtitle="The Swiss-army MITM framework">
        <p>
          <b>Bettercap</b> is a free, open-source <b>man-in-the-middle framework</b> in Go by Evilsocket. On a lab LAN it performs <b>ARP spoofing</b> to position itself between victims and the gateway, then <b>sniffs credentials, injects content, and proxies HTTP/HTTPS</b> through scriptable modules called caplets.
        </p>
        <p>
          Authorized testers use it to prove cleartext risk: sniff a lab login over HTTP, show the password in the log, then mandate TLS. Its interactive session, web UI, and REST API make one tool cover reconnaissance, interception, and post-capture analysis in the lab.
        </p>
        <FeatureGrid items={[
          { i: '🔁', t: 'ARP Spoofing', d: 'Positions between lab victims and gateway in seconds.' },
          { i: '👃', t: 'Credential Sniffing', d: 'Parses HTTP, FTP, and IRC logins from traffic.' },
          { i: '💉', t: 'JS Injection', d: 'Injects scripts into lab pages via proxy caplets.' },
          { i: '🌐', t: 'Web UI & API', d: 'Point-and-click control plus automation endpoints.' },
          { i: '📡', t: 'WiFi & BLE draining', d: 'Wireless recon modules for lab airspace.' },
          { i: '📜', t: 'Caplets', d: 'Reusable attack scripts shared by the community.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Bettercap on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install via apt or Go:</p>
        <CodeBlock title="terminal" lines={`sudo apt install bettercap -y
# latest via Go:
# go install github.com/bettercap/bettercap@latest`} />
        <InfoBox title="Interface and IP forwarding">
          Pass your lab interface with -iface and let Bettercap manage IP forwarding automatically. Confirm you sit on the same lab segment as the victim and gateway before spoofing anything.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Interactive Sniff" subtitle="Spoof and sniff the lab LAN">
        <p className="text-xs text-slate-400">Start an interactive session on your isolated lab interface:</p>
        <CodeBlock title="terminal" lines={`sudo bettercap -iface eth0`} />
        <InfoBox title="First session steps">
          Inside the session run net.probe on to map lab hosts, then net.recon on for continuous discovery. Only then target the agreed lab victim — never whole-subnet spoof by default.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Targeted Spoof" subtitle="Intercept one agreed lab victim">
        <p className="text-xs text-slate-400">Spoof exactly one lab victim and sniff its cleartext logins:</p>
        <CodeBlock title="terminal" lines={`set arp.spoof.targets 192.168.56.20
arp.spoof on
net.sniff on`} />
        <InfoBox title="Scope discipline">
          The targets variable restricts spoofing to the signed IP. Log in on the victim to a lab HTTP service and watch credentials appear — then stop spoofing immediately with arp.spoof off.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Caplet Automation" subtitle="Replayable lab attack scripts">
        <p className="text-xs text-slate-400">Run a bundled caplet for repeatable lab demonstrations:</p>
        <CodeBlock title="terminal" lines={`bettercap -iface eth0 -caplet http-ui
# browse the web UI at http://127.0.0.1:8081`} />
        <InfoBox title="UI and evidence">
          The http-ui caplet serves a dashboard for the session with default credentials to change. Save sniff logs per lab run and wipe victim data beyond agreed accounts at teardown.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Bettercap session intercepting lab traffic">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/bettercap/bettercap_logo.jpg" alt="Bettercap MITM framework logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Bettercap interactive session — spoofed lab traffic dissected</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Bettercap Intercepts Find" subtitle="Common discoveries from MITM labs">
        <FeatureGrid items={[
          { i: '🔑', t: 'Cleartext Logins', d: 'HTTP and FTP passwords in plain sight.' },
          { i: '🍪', t: 'Session Cookies', d: 'Hijackable tokens on unencrypted lab apps.' },
          { i: '📡', t: 'Chatty Protocols', d: 'Legacy services broadcasting credentials.' },
          { i: '🌐', t: 'TLS Gaps', d: 'Downgradeable or missing encryption to mandate.' },
          { i: '📱', t: 'Device Inventory', d: 'Every chattering host on the lab segment.' },
          { i: '🧪', t: 'Injection Proofs', d: 'Script injection demos for awareness training.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Victim loses connectivity"
            fix="Stop spoofing at once with arp.spoof off. Check IP forwarding is enabled and you targeted one IP, not the gateway or subnet."
          />
          <IssueRow
            issue="No credentials appear"
            fix="Confirm the victim uses cleartext lab services — HTTPS hides payloads by design. Verify you spoof the right IP and sniffing is on."
          />
          <IssueRow
            issue="Caplet fails to load"
            fix="Update Bettercap and check caplet paths for your install method. Apt and Go builds store caplets in different directories."
          />
          <IssueRow
            issue="Web UI unreachable"
            fix="Confirm the http-ui caplet is running and port 8081 is free on the lab machine. Change default UI credentials before any shared demo."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Bettercap Commands & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-iface &lt;nic&gt;</div>
            <div className="text-xs text-slate-400">Lab network interface for all operations.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">net.probe / net.recon</div>
            <div className="text-xs text-slate-400">Map and continuously watch lab hosts.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">arp.spoof on/off</div>
            <div className="text-xs text-slate-400">Start and stop interception (scope first).</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">net.sniff on</div>
            <div className="text-xs text-slate-400">Parse credentials from intercepted traffic.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-caplet &lt;name&gt;</div>
            <div className="text-xs text-slate-400">Load reusable attack scripts and UIs.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">set ... targets</div>
            <div className="text-xs text-slate-400">Restrict every module to signed IPs.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Bettercap GitHub Repository', 'https://github.com/bettercap/bettercap'],
            ['📖', 'Bettercap Usage Documentation', 'https://www.bettercap.org/usage/'],
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
