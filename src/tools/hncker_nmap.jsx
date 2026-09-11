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
  { q: "What is Nmap?", a: "Nmap (Network Mapper) is the standard open-source tool for discovering hosts and services on a network. It sends packets, reads the replies, and reports which hosts are up, which ports are open, and which software is behind them. Every security team maps its own network with it before attackers do." },
  { q: "Is Nmap illegal?", a: "No. Nmap is a legitimate open-source scanner. Running it against networks you do not own or lack permission to test can be treated as unauthorized probing, so stick to your own lab and the official practice target scanme.nmap.org." },
  { q: "What is the difference between -sn, -sS and -sV?", a: "-sn is ping-scan: only find live hosts, no port scan. -sS is the SYN stealth scan of the top 1,000 ports. -sV adds version detection, asking open ports which software and version they run." },
  { q: "What is a SYN scan?", a: "A SYN scan starts the TCP handshake but never completes it: SYN goes out, SYN-ACK comes back, Nmap sends RST instead of ACK. The port state is learned without a full connection, so it is fast and quieter than a connect scan." },
  { q: "How do I scan safely without knocking things over?", a: "Scan your own lab or scanme.nmap.org, use default timing (-T3), and avoid -T5 aggressive timing plus --min-rate floods against anything fragile. Printers, cameras and old industrial gear can crash under fast scans." },
  { q: "What is OS detection (-O)?", a: "OS detection compares subtle TCP/IP behaviors — initial TTL, window size, option order — against a fingerprint database and guesses the operating system, like Linux 5.x or Windows 10. It needs at least one open and one closed port to work well." },
  { q: "How do I find live hosts on my WiFi?", a: "Run nmap -sn 192.168.1.0/24 on your own network. Nmap ARPs every address and lists the ones that answer with their MAC vendor. That is how you spot an unknown device on your home WiFi." },
  { q: "How do I defend against Nmap scans?", a: "Close ports you do not need, firewall the rest, run fail2ban to block repeat probers, and monitor logs. You cannot stop someone scanning you, but you can give them nothing interesting to find." },
]

const howItWorks = [
  "Scan your lab or scanme.nmap.org and list live hosts with -sn.",
  "SYN-scan the top 1,000 ports and read open/closed/filtered states.",
  "Fingerprint services with -sV and the OS with -O.",
  "Go deeper with NSE scripts and full-port sweeps where allowed.",
  "Harden your own boxes: close ports, firewall, fail2ban. ",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Nmap — Network Scanner Guide (Educational)",
      description: "Step-by-step reference for Nmap: host discovery, SYN scans, service and OS detection, NSE scripts, and defense.",
      about: "Nmap network scanner",
      educationalUse: 'Testing, education, and authorized use only',
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

export default function hncker_nmap() {
  return (
    <ToolLayout
      title="Nmap — Network Scanner Guide"
      desc="Step-by-step Nmap reference: host discovery, port scans, service detection and OS fingerprinting on scanme.nmap.org. Educational use only."
      icon="🗺️"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/nmap"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/nmap/nmap_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Learn it on the HNCKER channel">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl overflow-hidden border border-white/10 no-underline p-5 hover:border-red-500/40 transition-all"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white m-0">Nmap — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Nmap is a legitimate network-mapping tool. Scan <b>only networks you own, plus the official practice target scanme.nmap.org, or targets with written permission</b>. Probing other networks can be treated as unauthorized access. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🗺️" title="What is Nmap?" subtitle="Map networks before attackers do">
        <p>
          <b>Nmap</b> maps networks: it finds live hosts, lists open ports, and fingerprints the software and OS behind them. A SYN scan of the top 1,000 ports takes seconds and tells you where to look next.
        </p>
        <p>
          Defenders run the same scans against their own networks to find forgotten services, rogue devices and open doors — then close them before anyone else walks through.
        </p>
        <FeatureGrid items={[
  { i: "🗺️", t: "Host discovery", d: "Find every live device on a network." },
  { i: "🎯", t: "Port states", d: "Open, closed or filtered for 1,000+ ports." },
  { i: "🔍", t: "Versions + OS", d: "-sV fingerprints software, -O the OS." },
  { i: "🧪", t: "NSE scripts", d: "--script runs checks for vulns and misconfigs." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) or Ubuntu/Debian/Termux", "Your own lab network or scanme.nmap.org (official practice target)", "Root/sudo for SYN scan and OS detection", "Written permission if anything is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`nmap --version
# Nmap version 7.9x ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install nmap`} />
        <InfoBox title="Kali has it already">
          On Kali Linux Nmap is pre-installed — <span className="font-mono">nmap --version</span> is enough to confirm. On Debian/Ubuntu and Termux install the <span className="font-mono">nmap</span> package.
        </InfoBox>
      </Section>

      <Section id="hosts" icon="📡" title="Step 1 — Find Live Hosts" subtitle="Who is alive on the network">
        <p className="text-xs text-slate-400">Find live hosts on your own network before scanning ports:</p>
        <CodeBlock title="terminal" lines={`nmap -sn 192.168.1.0/24
# 5 hosts up: router, laptop, phone...`} />
        <InfoBox title="Alive first">
          <span className="font-mono">-sn</span> sends no port probes — it only asks who is alive. Use it first so you never waste a port scan on dead addresses.
        </InfoBox>
      </Section>

      <Section id="ports" icon="🎯" title="Step 2 — Scan Ports" subtitle="SYN scan the top ports">
        <p className="text-xs text-slate-400">SYN-scan the top 1,000 ports of the practice target:</p>
        <CodeBlock title="terminal" lines={`nmap -sS scanme.nmap.org
# 22/tcp open  ssh
# 80/tcp open  http`} />
        <InfoBox title="Read the states">
          <span className="font-mono">open</span> answered, <span className="font-mono">closed</span> refused, <span className="font-mono">filtered</span> means a firewall dropped the probe. The official practice target scanme.nmap.org exists exactly for this.
        </InfoBox>
      </Section>

      <Section id="versions" icon="🔍" title="Step 3 — Detect Versions + OS" subtitle="Fingerprint services and OS">
        <p className="text-xs text-slate-400">Ask open ports what software they run, and guess the OS:</p>
        <CodeBlock title="terminal" lines={`nmap -sV -O scanme.nmap.org
# 80/tcp open  Apache httpd 2.4.49
# OS: Linux 5.x`} />
        <InfoBox title="Versions leak">
          The version string is gold: it tells you exactly which CVEs to check. That is why admins patch — and why they hide banners where they can.
        </InfoBox>
      </Section>

      <Section id="scripts" icon="🧪" title="Step 4 — NSE Vuln Scripts" subtitle="Check for known vulns">
        <p className="text-xs text-slate-400">Run NSE scripts that check for known weaknesses:</p>
        <CodeBlock title="terminal" lines={`nmap --script vuln scanme.nmap.org
# CVE-2021-41773: Apache path traversal FOUND`} />
        <InfoBox title="Scripts help">
          NSE turns Nmap into a vulnerability checker: http-title grabs page titles, vuln scripts cross-check versions against known CVEs. Always stay on targets you own.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Harden What Nmap Finds" subtitle="See your network like an attacker does">
        <CodeBlock title="terminal" lines={`ss -tulpn
# everything listening on this machine`} />
        <FeatureGrid items={[
  { i: "👂", t: "Close unused ports", d: "Stop services you do not need." },
  { i: "🧱", t: "Firewall", d: "ufw: allow only known ports." },
  { i: "👁️", t: "Watch logs", d: "fail2ban blocks scan-driven brute force." },
  { i: "🔍", t: "Scan yourself", d: "If Nmap sees it, attackers can too." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Nmap in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/nmap/nmap_scan.png" alt="Nmap terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">An Nmap scan listing open ports and services</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["-sn", "Ping scan: list live hosts, skip the port scan."], ["-sS", "SYN stealth scan of top 1,000 ports (needs root)."], ["-sV", "Version detection: ask open ports what software they run."], ["-O", "OS detection: guess the operating system from TCP quirks."], ["-p-", "Scan all 65,535 ports instead of the top 1,000."], ["-T4", "Faster timing. -T3 default, -T5 aggressive (lab only)."], ["-oN", "Save results to a normal text file for your notes."], ["--script", "Run NSE scripts, e.g. --script vuln for vuln checks."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Permission denied on SYN scan", "SYN scans need raw sockets: re-run with sudo, or use -sT connect scan which works unprivileged but is louder."], ["All ports show filtered", "A firewall is dropping your probes (or you scanned the wrong address). From your own lab, check the target firewall rules and your VPN routing."], ["-O needs root and guesses wrong", "OS detection needs one open and one closed port plus root. Give it both, and treat the result as a best guess, not gospel."], ["Scan takes forever on some hosts", "Down hosts are re-probed by default. Add --max-retries 1 -T4 for lab sweeps, and always use -sn first so you only port-scan live hosts."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Official Nmap docs", "https://nmap.org/docs.html"], ["📖", "Nmap cheat sheet", "https://nmap.org/book/man.html"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you run anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Nmap is a legitimate network-mapping tool, but scanning networks you do not own or lack written permission to test is illegal. Use it only on your own lab or scanme.nmap.org. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
