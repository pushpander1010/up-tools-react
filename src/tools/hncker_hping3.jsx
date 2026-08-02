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
  { q: 'What is hping3?', a: 'hping3 is a network tool that lets you craft and send raw TCP, UDP and ICMP packets directly from the command line. It is commonly used for firewall testing, network diagnostics, port scanning and load/stress testing.' },
  { q: 'Is hping3 illegal?', a: 'hping3 itself is a legal, open-source network tool. Using it to flood, scan or attack systems you do not own or have written permission to test may be illegal. Only test machines and servers you own or are authorized to assess.' },
  { q: 'How do I install it?', a: 'On Kali/Ubuntu/Debian: sudo apt install hping3. On macOS with Homebrew: brew install hping3. It is preinstalled on most Kali distributions.' },
  { q: 'How do I do a basic SYN scan?', a: 'Run: hping3 -S -p 80 example.com. The -S flag sends a SYN packet and the -p flag sets the port. A reply with the SA flag means the port is open.' },
  { q: 'How do I test a firewall with a flood?', a: 'Use: hping3 --flood -S -p 80 example.com. This fires a high rate of packets and shows whether the target or its firewall drops traffic. Only do this on systems you own.' },
  { q: 'What is the --flood flag?', a: '--flood sends packets as fast as possible without waiting for replies. It is a stress/load test to see how a server or firewall behaves under high volume.' },
  { q: 'Can it craft UDP packets?', a: 'Yes. Use the --udp flag: hping3 --udp -p 53 example.com. This lets you craft custom UDP packets, useful for testing UDP services and game-server ports.' },
  { q: 'What can hping3 find?', a: 'Open/closed/filtered ports, firewall rules, how a server responds to crafted packets, and how it behaves under load. It is a diagnostics and stress-testing tool.' },
]

const howItWorks = [
  'Install hping3 from your package manager (sudo apt install hping3).',
  'Probe a target with a SYN scan to map open ports: hping3 -S -p 80 example.com.',
  'Read the reply flags — SA means open, no reply or RST means filtered/closed.',
  'Stress-test the firewall with a controlled flood: hping3 --flood -S -p 80 example.com.',
  'Watch the drop rate to see whether the server or firewall holds up under load.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'hping3 — Packet Crafting & Network Stress-Testing (Educational)',
      description: 'Complete step-by-step reference for installing and using hping3 to craft raw TCP/UDP/ICMP packets, scan ports and stress-test firewalls. Education and authorized testing only.',
      about: 'hping3 packet crafting tool',
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

export default function hncker_hping3() {
  return (
    <ToolLayout
      title="hping3 — Packet Crafting & Network Stress-Testing"
      desc="Step-by-step reference: install & use hping3 to craft raw TCP/UDP/ICMP packets, scan ports and stress-test firewalls. Educational purposes only."
      icon="📡"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/hping3"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/hping3/hping3_scan.png" />
      </Helmet>

      <WarningBox>
        hping3 crafts and sends raw network packets. Use it <b>only on systems you own or have
        written permission to test</b>. Flooding, scanning or attacking someone else's server without
        authorization is illegal in most jurisdictions. This page is for <b>educational and
        authorized testing only</b>.
      </WarningBox>

      <Section id="overview" icon="📡" title="What is hping3?" subtitle="Craft raw packets and test how any server handles them">
        <p>
          <b>hping3</b> is a command-line network tool that lets you <b>craft and send raw packets</b> —
          TCP, UDP and ICMP — exactly how you want them. It's the modern fork of <b>hping</b>, built for
          firewall testing, network diagnostics, port scanning and load/stress testing.
        </p>
        <p>
          Where most tools hide the details, hping3 gives you <b>full control</b> over every packet —
          flags, ports, window size, source address. That makes it a favorite for understanding how a
          server and its firewall actually behave under crafted traffic.
        </p>
        <FeatureGrid items={[
          { i: '📦', t: 'Raw packet crafting', d: 'Build TCP, UDP and ICMP packets with full control.' },
          { i: '🔍', t: 'Port scanning', d: 'SYN scans reveal open, closed and filtered ports.' },
          { i: '🛡️', t: 'Firewall testing', d: 'See if a firewall drops traffic or lets it through.' },
          { i: '⚡', t: 'Load testing', d: 'Stress a server with a controlled flood.' },
          { i: '🎯', t: 'Custom flags', d: 'Set SYN, ACK, FIN and more on every packet.' },
          { i: '🖥️', t: 'CLI-first', d: 'Runs entirely from the terminal.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Linux, macOS or Windows with root/admin privileges (raw sockets need them)'],
            ['☑️', 'hping3 installed (sudo apt install hping3 on Debian/Ubuntu/Kali)'],
            ['☑️', 'A target you own or are authorized to test'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`sudo apt install hping3        # Debian / Ubuntu / Kali\nbrew install hping3            # macOS (Homebrew)`} />
        <InfoBox title="Permissions">
          Crafting raw packets requires <span className="font-mono">root</span> or
          <span className="font-mono"> sudo</span> on most systems. Run hping3 from a root shell or prefix
          commands with <span className="font-mono">sudo</span>.
        </InfoBox>
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Common commands, explained">
        <p className="text-xs text-slate-400">SYN scan — probe a single port:</p>
        <CodeBlock title="terminal" lines={`hping3 -S -p 80 example.com`} />
        <InfoBox title="Reading the reply">
          A reply with the <span className="font-mono">SA</span> flag means the port is open. No reply or a
          <span className="font-mono">RST</span> means it's filtered or closed.
        </InfoBox>
        <p className="text-xs text-slate-400 mt-4">Craft a UDP packet (e.g. a game-server port):</p>
        <CodeBlock title="terminal" lines={`hping3 --udp -p 7777 example.com`} />
        <p className="text-xs text-slate-400 mt-4">Controlled firewall load test:</p>
        <CodeBlock title="terminal" lines={`hping3 --flood -S -p 80 example.com`} />
        <InfoBox title="The --flood flag">
          <span className="font-mono">--flood</span> sends packets as fast as possible without waiting for
          replies. Use it to see how a server or firewall behaves under load — <b>only on systems you own</b>.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="hping3 in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/hping3/hping3_scan.png" alt="hping3 crafting packets against a target in the terminal"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Running hping3 against a target</figcaption>
        </figure>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="'Operation not permitted' or raw-socket error on Linux/macOS"
            fix="Crafting raw packets needs root. Re-run with sudo, or on macOS grant the terminal permission for incoming network connections in System Settings → Privacy & Security." />
          <IssueRow
            issue="No replies at all during a scan"
            fix="The target may be filtering the port (firewall drops SYN) or blocking your source IP. Try a UDP probe or check the host is reachable with ping first." />
          <IssueRow
            issue="Everything times out under --flood"
            fix="A high drop rate usually means the firewall or server is rate-limiting or the target is dropping traffic — that's the load result you're measuring. On your own lab, tune the rate with -i (interval) or --fast." />
          <IssueRow
            issue="Command not found after install"
            fix="hping3 may not be on PATH or not installed. Re-run the install command and confirm with: which hping3. On some distros the binary is /usr/sbin/hping3." />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official repository', 'https://github.com/antirez/hping'],
            ['📘', 'Official documentation', 'http://www.hping.org/'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you craft any packet">
        <p>
          This documentation is provided <b>strictly for educational and authorized testing purposes</b>.
          hping3 is a powerful packet-crafting tool. Using it to flood, scan or attack servers or networks
          you do not own — or without explicit written authorization — may be illegal and can cause harm.
          Only test systems you own or are permitted to assess: your own lab, or an authorized pentest or
          bug-bounty engagement. The author and this site are not responsible for any misuse of this
          information.
        </p>
      </Section>
    </ToolLayout>
  )
}
