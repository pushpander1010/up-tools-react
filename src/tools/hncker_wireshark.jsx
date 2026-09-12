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
  { q: "What is Wireshark?", a: "Wireshark is the standard packet analyzer: it records the raw traffic on a network interface and shows every packet — source, destination, protocol and contents. Admins use it to debug networks; attackers use it to steal anything sent unencrypted." },
  { q: "Is Wireshark illegal?", a: "The tool is legal and essential for network debugging. Capturing traffic on networks you do not own or without permission — especially to read others' data — is illegal. Capture on your own machine and lab VMs only." },
  { q: "How do I start my first capture?", a: "Open Wireshark, double-click your active interface (WiFi or Ethernet), generate traffic like opening a lab login page, then press the red square to stop. Start with a capture filter like host 192.168.1.1 to keep it small." },
  { q: "What are display filters?", a: "Display filters search captured packets: http shows web traffic, dns shows lookups, ip.addr == 1.2.3.4 narrows to one host, tcp.port == 80 to one service. Learn five filters and you can find anything in a million-packet capture." },
  { q: "How do I read a full login with Follow TCP Stream?", a: "Right-click any packet of the connection, choose Follow then TCP Stream: Wireshark rebuilds the whole conversation — request, response, credentials — in reading order. On lab HTTP logins the password sits there in plain text." },
  { q: "Why can't I read HTTPS traffic?", a: "TLS encrypts the contents, so Wireshark shows only metadata: IPs, ports, packet sizes, timing and the SNI hostname. That is exactly why every login page must use HTTPS — encryption is what stands between passwords and sniffers." },
  { q: "What is promiscuous mode?", a: "Normally a network card ignores packets not addressed to it. Promiscuous mode tells it to hand everything to Wireshark. On switched networks you still mostly see your own traffic plus broadcasts — full interception needs ARP spoofing, which stays lab-only." },
  { q: "How do I protect my network from sniffing?", a: "Use TLS everywhere, replace Telnet and FTP with SSH and SFTP, run WPA3 on WiFi, and move DNS to encrypted DNS. Then verify with Wireshark itself: capture your own login and confirm nothing readable leaks." },
]

const howItWorks = [
  "Install Wireshark and join the wireshark group.",
  "Capture your own interface during a lab login.",
  "Filter to http and follow the TCP stream.",
  "Compare HTTP vs HTTPS captures side by side.",
  "Encrypt your own services and verify with a capture.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Wireshark — Packet Analyzer Guide (Educational)",
      description: "Step-by-step Wireshark reference: capture, display filters, follow TCP streams, plaintext vs TLS, and defense.",
      about: "Wireshark packet analyzer",
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

export default function hncker_wireshark() {
  return (
    <ToolLayout
      title="Wireshark — Packet Analyzer Guide"
      desc="Step-by-step Wireshark reference: capture, display filters, follow TCP streams and spot plaintext passwords. Educational use only."
      icon="🦈"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/wireshark"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/wireshark/wireshark_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER Short, then go deeper">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#000' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe src="https://www.youtube.com/embed/HV1-HTf5Eq4" title="Wireshark tutorial — HNCKER Short"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen loading="lazy" />
            </div>
          </div>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl overflow-hidden border border-white/10 no-underline p-5 mt-3 hover:border-red-500/40 transition-all"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white m-0">Wireshark — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Wireshark exposes everything crossing a wire. Capture <b>only on networks and machines you own or have written permission to monitor</b>. Reading anyone else's traffic is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🦈" title="What is Wireshark?" subtitle="See every packet on the wire">
        <p>
          <b>Wireshark</b> records raw network traffic and lays every packet bare: who talked to whom, with which protocol, carrying what data. Log into a lab HTTP page while capturing and your password appears on screen.
        </p>
        <p>
          That shock is the lesson: anything unencrypted is public to anyone on the path. Capture your own logins, see the leak, then encrypt the service and watch the same capture turn to noise.
        </p>
        <FeatureGrid items={[
  { i: "📡", t: "Live capture", d: "Record any interface in one click." },
  { i: "🔍", t: "Display filters", d: "Find one packet in a million." },
  { i: "📄", t: "Follow streams", d: "Rebuild full conversations." },
  { i: "📊", t: "Statistics", d: "Protocol mix, top talkers, graphs." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) or any desktop OS", "Your own network interface (WiFi/Ethernet) + sudo or wireshark group", "A lab login page (DVWA on localhost is perfect)", "Written permission if anything is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`wireshark --version
# Wireshark 4.x ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install wireshark`} />
        <InfoBox title="Kali has it already">
          On Kali Linux Wireshark is pre-installed. On Debian/Ubuntu add your user to the <span className="font-mono">wireshark</span> group after install, then log out and back in so you can capture without root.
        </InfoBox>
      </Section>

      <Section id="capture" icon="📡" title="Step 1 — Capture" subtitle="Record your own traffic">
        <p className="text-xs text-slate-400">Open Wireshark, capture your own active interface briefly:</p>
        <CodeBlock title="gui" lines={`wireshark &
# double-click WiFi -> packets flow -> red square stops`} />
        <InfoBox title="Your wire only">
          Pick the interface with live traffic (packet counter climbing). Start small: capture 30 seconds of your own browsing, then stop and look around.
        </InfoBox>
      </Section>

      <Section id="filters" icon="🔍" title="Step 2 — Display Filters" subtitle="Find the interesting packets">
        <p className="text-xs text-slate-400">Slice the capture down with display filters:</p>
        <CodeBlock title="display filter bar" lines={`http
ip.addr == 192.168.1.10 and tcp.port == 80
dns`} />
        <InfoBox title="Filter everything">
          Type http and press enter: only web traffic remains. Try ip.addr == 192.168.1.1 or dns next. Filters compose with and, or, not.
        </InfoBox>
      </Section>

      <Section id="stream" icon="📄" title="Step 3 — Follow TCP Stream" subtitle="Read a full conversation">
        <p className="text-xs text-slate-400">Rebuild a lab login conversation end to end:</p>
        <CodeBlock title="packet list" lines={`right-click packet -> Follow -> TCP Stream
POST /login username=admin&password=lab123`} />
        <InfoBox title="Plaintext shock">
          On lab HTTP the username and password sit in the POST body in clear text. Repeat against HTTPS and compare: metadata only, contents encrypted.
        </InfoBox>
      </Section>

      <Section id="stats" icon="📊" title="Step 4 — Statistics" subtitle="Profile the network">
        <p className="text-xs text-slate-400">Profile the capture with built-in statistics:</p>
        <CodeBlock title="menu" lines={`Statistics -> Protocol Hierarchy
Statistics -> Conversations (top talkers)`} />
        <InfoBox title="Know normal">
          Statistics shows which device talks most, which protocols dominate, and when spikes hit. Baselines built here make real anomalies obvious later.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Defeat Sniffers" subtitle="Encrypt so captures reveal nothing">
        <CodeBlock title="terminal" lines={`Use TLS everywhere + HSTS
# plaintext protocols must die`} />
        <FeatureGrid items={[
  { i: "🔒", t: "TLS everywhere", d: "HTTPS, SMTPS, SSH — no plaintext." },
  { i: "💌", t: "Kill Telnet/FTP", d: "Replace with SSH and SFTP." },
  { i: "📶", t: "WPA3 WiFi", d: "Encrypted air, strong passphrase." },
  { i: "👁️", t: "Watch DNS", d: "Plain DNS leaks every domain." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Wireshark in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/wireshark/wireshark_scan.png" alt="Wireshark terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Wireshark showing a captured HTTP login</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["Capture filter", "Pre-filter at capture time, e.g. host 1.2.3.4."], ["Display filter", "Post-filter the view, e.g. http."], ["Follow TCP Stream", "Rebuild one connection in reading order."], ["Statistics menu", "Protocol hierarchy, conversations, IO graphs."], ["Coloring rules", "Errors black-red, retransmits flagged."], ["Export objects", "Pull files out of HTTP captures."], ["TShark", "Terminal twin: tshark -i wlan0 -Y http."], ["-Y vs -y", "-Y display filter, -y link type in TShark."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["No interfaces listed for capture", "You lack capture permission. Add yourself: sudo usermod -aG wireshark $USER, then log out and back in. On some systems run with sudo once to confirm."], ["Capture is empty", "Wrong interface selected, or a capture filter typo dropped everything. Capture with no filter first on the interface with live traffic, then narrow down."], ["HTTPS shows only gibberish", "That is TLS doing its job — contents are encrypted. Read metadata (SNI, sizes, timing) or point the lab browser at an HTTP service to practice stream-following."], ["File too big to open", "You captured everything for an hour. Capture with a filter next time; for now open with tshark -r big.pcap -Y filter to carve out what you need."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Official Wireshark docs", "https://www.wireshark.org/docs/"], ["📖", "Display filter reference", "https://www.wireshark.org/docs/dfref/"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Wireshark reveals everything crossing a network, so capture only on your own networks or lab VMs. Sniffing traffic that is not yours is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
