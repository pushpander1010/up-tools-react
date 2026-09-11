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
  { q: "What is Aircrack-ng?", a: "Aircrack-ng is the classic WiFi auditing suite: put your adapter in monitor mode, capture the WPA handshake when your own device connects, then test it against a wordlist. It proves whether your WiFi passphrase survives a dictionary attack." },
  { q: "Is Aircrack-ng illegal?", a: "Auditing your own router is legal and recommended. Capturing handshakes or cracking passphrases for networks you do not own is illegal. Practice on your own router only." },
  { q: "What do I need for WiFi auditing?", a: "A Linux machine (Kali ideal) plus a WiFi adapter that supports monitor mode and packet injection. Most laptop cards do monitor; cheap USB adapters (Atheros/Realtek chipsets) are the reliable lab choice." },
  { q: "What is monitor mode?", a: "Monitor mode tells the WiFi card to pass every nearby frame to Wireshark-style tools instead of only its own traffic. airmon-ng start wlan0 creates the mon0 interface auditors capture on." },
  { q: "What is the 4-way handshake?", a: "When a device joins WPA2/WPA3, router and device exchange four cryptographic messages proving both know the passphrase — without sending it. Capturing those messages gives you an offline puzzle: guess the passphrase, verify locally, repeat." },
  { q: "Why does cracking only work on weak passphrases?", a: "The handshake check is a fast hash, so GPUs test millions of candidates — but only from the wordlist. A 20-character random passphrase is not in any list, so the attack exhausts itself. Length beats everything." },
  { q: "What is a deauth attack?", a: "A deauth frame tells a connected device it was disconnected, forcing a reconnect — and a fresh handshake to capture. It works because management frames are unauthenticated on WPA2. Send them only to your own devices in your own lab." },
  { q: "How do I make my WiFi uncrackable?", a: "Use WPA3 (or WPA2-AES minimum), a 20+ character random passphrase, turn WPS off, keep a separate guest network, and update router firmware. Then audit yourself with this guide and watch the crack fail." },
]

const howItWorks = [
  "Put your adapter in monitor mode.",
  "Survey networks and lock onto YOUR router.",
  "Capture the handshake (reconnect your own phone).",
  "Crack the .cap with rockyou on your own network.",
  "Harden: WPA3, long passphrase, WPS off, guest net.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Aircrack-ng — WiFi Auditor Guide (Educational)",
      description: "Step-by-step Aircrack-ng reference: monitor mode, handshake capture and wordlist audit of your own WiFi, plus hardening.",
      about: "Aircrack-ng WiFi auditor",
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

export default function hncker_aircrack() {
  return (
    <ToolLayout
      title="Aircrack-ng — WiFi Auditor Guide"
      desc="Step-by-step Aircrack-ng reference: audit YOUR OWN WiFi — monitor mode, handshake capture, wordlist crack. Educational use only."
      icon="📶"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/aircrack"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/aircrack/aircrack_scan.png" />
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
              <p className="text-sm font-semibold text-white m-0">Aircrack-ng — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Aircrack-ng captures wireless handshakes. Use it <b>only on your own router and your own devices</b>. Intercepting or cracking anyone else's WiFi is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="📶" title="What is Aircrack-ng?" subtitle="Audit your own WiFi passphrase">
        <p>
          <b>Aircrack-ng</b> audits WiFi the way attackers do: listen in monitor mode, capture your router's 4-way handshake, and test it against a wordlist — all offline, all on your own network.
        </p>
        <p>
          Weak passphrases fall in minutes; 20-character random ones never fall at all. Run this guide against your own router, then set the passphrase that survives it.
        </p>
        <FeatureGrid items={[
  { i: "📡", t: "Monitor mode", d: "Hear every nearby frame." },
  { i: "🤝", t: "Handshake capture", d: "Grab the 4-way exchange." },
  { i: "⚡", t: "Wordlist crack", d: "Test passphrases offline." },
  { i: "📶", t: "WPS audit", d: "Find PIN-enabled routers." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux + monitor-mode WiFi adapter", "Your own router (admin access to verify)", "Your own phone/laptop to force reconnects", "Written permission if the network is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`aircrack-ng --help
# Aircrack-ng 1.7 ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install aircrack-ng`} />
        <InfoBox title="Kali has it already">
          On Kali Linux the full Aircrack-ng suite is pre-installed. Debian/Ubuntu users install the <span className="font-mono">aircrack-ng</span> package; you still need a monitor-mode-capable adapter.
        </InfoBox>
      </Section>

      <Section id="monitor" icon="📡" title="Step 1 — Monitor Mode" subtitle="Hear all WiFi frames">
        <p className="text-xs text-slate-400">Kill blockers, enable monitor mode on your adapter:</p>
        <CodeBlock title="terminal" lines={`sudo airmon-ng check kill
sudo airmon-ng start wlan0
# monitor mode enabled on wlan0mon`} />
        <InfoBox title="Listen to the air">
          wlan0mon is your new interface. Confirm with iwconfig: Mode:Monitor means every nearby frame now reaches your tools.
        </InfoBox>
      </Section>

      <Section id="survey" icon="📶" title="Step 2 — Survey" subtitle="Find your router">
        <p className="text-xs text-slate-400">Survey nearby networks, identify your own router:</p>
        <CodeBlock title="terminal" lines={`sudo airodump-ng wlan0mon
# YOUR BSSID, channel 6, WPA2`} />
        <InfoBox title="Your router only">
          Find YOUR router's BSSID and channel in the list. Lock on with --bssid and -c so hopping never loses the handshake.
        </InfoBox>
      </Section>

      <Section id="handshake" icon="🤝" title="Step 3 — Capture Handshake" subtitle="Grab the 4-way handshake">
        <p className="text-xs text-slate-400">Capture your router's handshake as your own device reconnects:</p>
        <CodeBlock title="terminal" lines={`sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w home wlan0mon
# reconnect YOUR phone -> WPA handshake`} />
        <InfoBox title="Catch the exchange">
          TOP RIGHT shows WPA handshake when captured — that is your cue. The .cap file now holds an offline puzzle solvable only by guessing.
        </InfoBox>
      </Section>

      <Section id="crack" icon="⚡" title="Step 4 — Crack (Your Network)" subtitle="Test the passphrase">
        <p className="text-xs text-slate-400">Test the capture against a wordlist (your network only):</p>
        <CodeBlock title="terminal" lines={`aircrack-ng -w rockyou.txt home-01.cap
# KEY FOUND! [ labpass123 ]`} />
        <InfoBox title="Offline guessing">
          Offline means unlimited tries with zero noise. Weak lab passphrases fall here; strong ones exhaust every list — proving the defense works.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Lock Your WiFi" subtitle="Make your WiFi uncrackable">
        <CodeBlock title="terminal" lines={`WPA3 + 20-char passphrase
# + WPS off + guest network`} />
        <FeatureGrid items={[
  { i: "📶", t: "WPA3 + long passphrase", d: "20+ random chars beats wordlists." },
  { i: "🚫", t: "WPS off", d: "No PIN attack surface." },
  { i: "👥", t: "Guest network", d: "Visitors off your main LAN." },
  { i: "🔄", t: "Update router", d: "Patch the firmware yearly." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Aircrack-ng in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/aircrack/aircrack_scan.png" alt="Aircrack-ng terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Aircrack-ng cracking a lab WiFi handshake</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["airmon-ng", "Enable/stop monitor mode on the adapter."], ["airodump-ng", "List nearby networks + capture handshakes."], ["aireplay-ng", "Deauth your own client to force a handshake."], ["aircrack-ng", "Crack the .cap file with a wordlist."], ["-w", "Wordlist path for the crack."], ["-b", "Target BSSID to lock onto."], ["-c", "Lock a channel to stop hopping."], ["--bssid", "Filter captures to one router."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Monitor mode fails to enable", "The driver does not support it or NetworkManager fights airmon-ng. Kill interfering processes with airmon-ng check kill, use a known-good USB adapter, and retry."], ["No handshake captured", "No device connected/reconnected during capture, or you hopped channels. Lock -c to your channel, connect your own phone to force the 4-way exchange, and wait."], ["Crack finds nothing", "Your passphrase is strong — that is success, not failure. Verify with a known-weak lab passphrase first to confirm the workflow, then celebrate the strong one."], ["Adapter disappears after airmon-ng", "Normal on some drivers: the interface renames to wlan0mon. Run iwconfig to find the new name and use it in airodump-ng."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Aircrack-ng docs", "https://www.aircrack-ng.org/documentation.html"], ["📖", "Kali wireless guide", "https://www.kali.org/docs/"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Aircrack-ng captures wireless handshakes, so use it only on your own router and devices. Attacking anyone else's WiFi is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
