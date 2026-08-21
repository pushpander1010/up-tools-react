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

const faq = [
  { q: 'What is Wireshark?', a: 'Wireshark is the world\'s most popular open-source network protocol analyzer. It captures and inspects packets flowing through a network interface in real time, letting you see every HTTP request, DNS query, TCP handshake, and more.' },
  { q: 'Is Wireshark legal?', a: 'Wireshark itself is completely legal — it\'s a standard tool used by network engineers and security professionals worldwide. However, capturing traffic on networks you don\'t own or lack authorization to monitor may violate privacy laws. Only use it on your own network or with explicit permission.' },
  { q: 'Does Wireshark need root/admin access?', a: 'On Linux, capturing packets requires root privileges (or specific capabilities). On macOS and Windows, you typically need admin access. Display-only mode (opening saved capture files) works without elevated privileges.' },
  { q: 'Can Wireshark decrypt HTTPS traffic?', a: 'Not by default. HTTPS traffic appears as encrypted TLS data. However, if you have the server\'s private key or can configure a browser to export TLS session keys (SSLKEYLOGFILE), Wireshark can decrypt the traffic for analysis.' },
  { q: 'What are display filters vs capture filters?', a: 'Capture filters (BPF syntax) are applied during capture and reduce what\'s saved. Display filters are applied after capture and hide packets from view without deleting them. Display filters are more flexible and use Wireshark\'s own syntax.' },
  { q: 'How do I find credentials in Wireshark?', a: 'Use the display filter http.request.method == "POST" to find login forms, then right-click a packet and select Follow → TCP Stream to see the full conversation including any plaintext credentials.' },
  { q: 'Can Wireshark detect malware?', a: 'Wireshark can help identify suspicious network patterns like unusual DNS queries, connections to known C2 servers, or data exfiltration. It\'s not an antivirus, but it\'s invaluable for network forensics and incident response.' },
  { q: 'What is DNS tunneling and how do I detect it?', a: 'DNS tunneling hides data inside DNS queries to bypass firewalls. Look for unusually long domain names (dns.qry.name.len > 50), high query volumes to a single domain, or TXT record queries with encoded data.' },
]

const howItWorks = [
  'Install Wireshark (available for Windows, macOS, Linux).',
  'Select your network interface and start a live capture.',
  'Apply display filters to isolate specific traffic (HTTP, DNS, TCP).',
  'Follow TCP streams to see full conversations.',
  'Analyze packets for credentials, suspicious patterns, or anomalies.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Wireshark — Network Packet Analysis for Security (Educational)',
      description: 'Complete step-by-step reference for using Wireshark to capture, filter, and analyze network traffic for security testing and troubleshooting. Education only.',
      about: 'Wireshark network protocol analyzer',
      educationalUse: 'Testing, education, and authorized security audits only',
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
      title="Wireshark — Network Packet Analysis"
      desc="Step-by-step reference: use Wireshark to capture, filter, and analyze network traffic for security testing and troubleshooting. Educational purposes only."
      icon="🦈"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(0,200,180,0.1))"
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

      {/* Video Tutorial */}
      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the full hands-on Wireshark demo">
        <div className="max-w-3xl mx-auto">
          <a href="https://youtu.be/Ee7Y3jktHCU" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/Ee7Y3jktHCU/hqdefault.jpg"
                alt="Wireshark — Hands-On Network Packet Analysis"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">Wireshark — Hands-On Network Packet Analysis</p>
                <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Wireshark captures network traffic which may include sensitive data. Use it <b>only on networks you own or have explicit permission to monitor</b>.
        Capturing traffic on networks without authorization may violate privacy laws and terms of service. This page is for
        <b> educational and authorized security testing only</b>.
      </WarningBox>

      <Section id="overview" icon="🦈" title="What is Wireshark?" subtitle="The world's most powerful network protocol analyzer">
        <p>
          <b>Wireshark</b> is the industry-standard open-source network protocol analyzer. It captures every packet
          flowing through your network interface — <b>HTTP requests, DNS queries, TCP handshakes, login credentials</b> —
          and lets you inspect them in real time or from saved capture files.
        </p>
        <p>
          Security researchers, network engineers, and penetration testers use Wireshark to troubleshoot network issues,
          detect attacks, find credential leaks, and perform deep packet inspection. It's an essential tool for anyone
          working in cybersecurity.
        </p>
        <FeatureGrid items={[
          { i: '📡', t: 'Live Capture', d: 'Capture packets in real time from any network interface.' },
          { i: '🔍', t: 'Display Filters', d: 'Isolate specific protocols, IPs, ports, or patterns.' },
          { i: '🔗', t: 'TCP Stream Follow', d: 'Reconstruct full TCP conversations from raw packets.' },
          { i: '🔑', t: 'Credential Detection', d: 'Find plaintext passwords and leaked credentials.' },
        ]} />
      </Section>

      <Section id="install" icon="⚙️" title="Installation" subtitle="Get Wireshark running on your system">
        <CodeBlock title="Install on Kali Linux / Debian" lines={`sudo apt update
sudo apt install wireshark-qt
sudo usermod -aG wireshark $USER`} />
        <CodeBlock title="Install on macOS (Homebrew)" lines={`brew install --cask wireshark`} />
        <InfoBox title="Npcap on Windows">
          On Windows, Wireshark requires Npcap for packet capture. It's included in the installer — just check the box during setup.
        </InfoBox>
      </Section>

      <Section id="capture" icon="📡" title="Step 1 — Live Capture" subtitle="Start capturing packets on your network interface">
        <CodeBlock title="Launch with interface selection" lines={`# Start capture on eth0 immediately
sudo wireshark -i eth0 -k

# Or launch the GUI and select interface manually
sudo wireshark`} />
        <p>
          The <code>-i</code> flag selects your network interface (eth0, wlan0, en0, etc.). The <code>-k</code> flag
          starts capturing immediately. You'll see packets flowing in real time — each row is one packet with timestamp,
          source, destination, protocol, and summary.
        </p>
      </Section>

      <Section id="filter" icon="🔍" title="Step 2 — Display Filters" subtitle="Isolate specific traffic from the noise">
        <CodeBlock title="Common display filters" lines={`# Find HTTP POST requests (login forms)
http.request.method == "POST"

# Filter by IP address
ip.addr == 192.168.1.100

# Show only DNS queries
dns

# Filter by TCP port
tcp.port == 443`} />
        <p>
          Display filters are applied <b>after</b> capture — they hide packets from view without deleting them.
          Type your filter in the toolbar and press Enter. Wireshark validates the syntax and highlights matches.
        </p>
      </Section>

      <Section id="stream" icon="🔗" title="Step 3 — Follow TCP Stream" subtitle="See the full conversation between client and server">
        <CodeBlock title="Follow a TCP stream" lines={`# Right-click any TCP packet
# Select: Follow → TCP Stream

# Or use the display filter
tcp.stream eq 3`} />
        <p>
          Following a TCP stream reconstructs the full conversation — client requests and server responses in plain text.
          This is where you'll see HTTP headers, form data, cookies, and any <b>plaintext credentials</b> being transmitted.
        </p>
      </Section>

      <Section id="creds" icon="🔑" title="Step 4 — Extract Credentials" subtitle="Find passwords leaked in plaintext HTTP traffic">
        <CodeBlock title="Filter for credentials" lines={`# Find HTTP requests containing "password"
http contains "password"

# Find form submissions
http.request.method == "POST" && http.content_type contains "form"

# Follow the stream to see full data
# Right-click → Follow → TCP Stream`} />
        <WarningBox>
          This technique only works on <b>unencrypted HTTP traffic</b>. HTTPS encrypts the payload, making credential
          sniffing impossible without additional setup (SSLKEYLOGFILE or private key). Always use HTTPS.
        </WarningBox>
      </Section>

      <Section id="dns" icon="🌐" title="Step 5 — DNS Tunneling Detection" subtitle="Spot data exfiltration hidden in DNS queries">
        <CodeBlock title="Detect DNS tunneling" lines={`# Find suspiciously long DNS queries
dns.qry.name.len > 50

# High volume to single domain
dns.qry.name contains "suspicious-domain.com"

# TXT record queries (often used for data exfil)
dns.txt`} />
        <p>
          DNS tunneling hides data inside DNS queries to bypass firewalls. Look for unusually long domain names,
          high query volumes to a single domain, or encoded data in TXT records. This is a common technique used
          by malware and advanced attackers.
        </p>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Protecting Your Network" subtitle="How to stay safe from packet sniffing">
        <FeatureGrid items={[
          { i: '🔒', t: 'Always Use HTTPS', d: 'Encrypt all web traffic. Never send credentials over HTTP.' },
          { i: '📡', t: 'VPN on Public WiFi', d: 'Use a VPN to encrypt all traffic on untrusted networks.' },
          { i: '🔍', t: 'Monitor Your Network', d: 'Use Wireshark to detect unusual traffic patterns.' },
          { i: '🔐', t: 'DNS-over-HTTPS', d: 'Use DoH to prevent DNS query monitoring.' },
        ]} />
      </Section>

      <Section id="disclaimer" icon="⚖️" title="Disclaimer" subtitle="Educational and authorized use only">
        <p>
          This page is for <b>educational purposes only</b>. Wireshark is a legitimate network diagnostic tool used by
          professionals worldwide. However, capturing network traffic without proper authorization is illegal in most
          jurisdictions. Always obtain explicit permission before monitoring any network you don't own.
        </p>
      </Section>
    </ToolLayout>
  )
}
