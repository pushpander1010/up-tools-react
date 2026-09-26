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
  { q: 'What is Shodan?', a: 'Shodan is a search engine designed for Internet-connected devices. Unlike standard search engines that crawl web pages, Shodan indexes service banners returned by servers, webcams, IoT gadgets, routers, and industrial control systems across IPv4 and IPv6.' },
  { q: 'Is using Shodan legal?', a: 'Yes, searching and viewing indexed data on Shodan is legal because it is publicly collected information. However, attempting to authenticate, access, or exploit any discovered devices without explicit written authorization is illegal under computer crime laws.' },
  { q: 'How does Shodan find devices?', a: 'Shodan runs continuous distributed port scanners 24/7 across the global IP address space. When a host responds on an open port, Shodan records its service banner, SSL certificate metadata, and response headers into its index.' },
  { q: 'What are common search filters in Shodan?', a: 'Key filters include `port:` (e.g., port:23 for Telnet), `product:` (e.g., product:"Apache"), `city:` or `country:`, `org:` (organization/ISP), `os:` (operating system), and `vuln:` (specific CVE vulnerabilities).' },
  { q: 'What do attackers typically look for on Shodan?', a: 'Attackers search for unauthenticated databases (MongoDB on port 27017, Elasticsearch on 9200), unsecured IP cameras, exposed remote desktop (RDP on 3389), open Telnet routers with default passwords, and unpatched known CVEs.' },
  { q: 'How can device owners protect their hardware from being discovered on Shodan?', a: 'Change default factory credentials immediately, disable remote administration features (like WAN-facing web/Telnet/SSH interfaces), disable Universal Plug and Play (UPnP) on your router, place services behind a firewall/VPN, and keep firmware updated.' },
  { q: 'Can I check if my own public IP is on Shodan?', a: 'Yes. You can search your public IP address directly in Shodan (e.g., `shodan host <your-ip>`) or run a query using `net:<your-subnet>` to audit your organization\'s external exposure.' },
]

const howItWorks = [
  'Create a free or academic Shodan account or use the web search bar.',
  'Search targets or technologies using filter syntax like port:23 or webcam.',
  'Inspect discovered banners, open ports, and SSL certificates.',
  'Identify exposed devices with default credentials or unpatched vulnerabilities.',
  'Harden your own perimeter, disable UPnP, and firewall IoT hardware.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Shodan Exposed Device Search — IoT Recon & Security Guide',
      description: 'Step-by-step reference: search Internet-connected devices, open ports, and exposed IoT assets with Shodan. Educational purposes only.',
      about: 'Shodan IoT search engine and exposed device reconnaissance',
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

export default function hackolution_Shodan() {
  return (
    <ToolLayout
      title="Shodan Exposed Device Search"
      desc="Step-by-step reference: search Internet-connected devices, open ports, and exposed IoT assets with Shodan. Educational purposes only."
      icon="🔍"
      iconBg="linear-gradient(135deg, rgba(255,107,53,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/shodan"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Shodan Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for quick breakdowns of IoT discovery, exposed device risks, and perimeter defense.
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
        Shodan displays publicly indexed banners and open ports. <b>Interacting with, authenticating into, or exploiting discovered third-party devices without explicit authorization is illegal</b>.
        Use Shodan strictly to audit your own assets, protect your personal network, or perform authorized security assessments.
      </WarningBox>

      <Section id="overview" icon="🔍" title="What is Shodan?" subtitle="The search engine for Internet-connected devices &amp; IoT">
        <p>
          <b>Shodan</b> is the world&apos;s first search engine for Internet-connected devices. While Google indexes web content, Shodan scans
          the entire Internet 24/7, grabbing the service <b>banners</b> that devices send back when probed on various ports (HTTP, SSH, Telnet, RTSP, MQTT, SNMP, RDP, and SCADA protocols).
        </p>
        <p>
          From webcams and smart light bulbs to hospital systems, traffic control lights, and industrial power plants, Shodan reveals
          what is exposed to the public Internet, what software version is running, and whether default security configurations are present.
        </p>
        <FeatureGrid items={[
          { i: '📡', t: 'Global Port Scanning', d: 'Continuous scans across millions of IPv4/IPv6 addresses.' },
          { i: '🏷️', t: 'Service Banner Indexing', d: 'Captures headers, software versions, and SSL certificates.' },
          { i: '🔎', t: 'Granular Search Syntax', d: 'Filter by port, org, country, product, OS, and CVE.' },
          { i: '🛡️', t: 'Perimeter Defense Audit', d: 'Monitor your own IPs for accidental exposure.' },
        ]} />
      </Section>

      <Section id="attackers-find" icon="⚠️" title="What Attackers Find on Shodan" subtitle="Common high-risk exposures discovered on the index">
        <p className="text-xs text-slate-400">Because many devices ship with default configurations, Shodan queries often expose vulnerable assets:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-base font-bold text-red-300 mb-1">📹 Unsecured IP Webcams &amp; RTSP Streams</div>
            <div className="text-xs text-slate-400">Cameras running with no authentication, basic HTTP auth, or default credentials streaming video over ports 554 or 8080.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-base font-bold text-red-300 mb-1">🗄️ Unprotected Databases</div>
            <div className="text-xs text-slate-400">MongoDB (port 27017), Elasticsearch (port 9200), Redis (port 6379) deployed with zero authentication bound to 0.0.0.0.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-base font-bold text-red-300 mb-1">⚡ Industrial Control Systems (ICS/SCADA)</div>
            <div className="text-xs text-slate-400">Modbus (port 502), BACnet (port 47808), and PLC controllers exposed directly without network segmentation.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-base font-bold text-red-300 mb-1">🔑 Default Passwords &amp; Remote Management</div>
            <div className="text-xs text-slate-400">Home routers and IoT switches with Telnet (port 23) or SSH (port 22) exposing default credentials like admin/admin.</div>
          </div>
        </div>
      </Section>

      <Section id="syntax" icon="🚀" title="Shodan Search Syntax &amp; Examples" subtitle="Essential filters and query constructions">
        <p className="text-xs text-slate-400">Use query filters directly in the Shodan web search bar or CLI:</p>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">Example 1 — Open Telnet Ports</div>
            <CodeBlock title="search query" lines={`port:23`} />
            <p className="text-xs text-slate-400 mt-1">Finds devices with Telnet open to the public Internet, often unencrypted legacy systems or IoT hardware.</p>
          </div>

          <div>
            <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">Example 2 — Searching for Webcams</div>
            <CodeBlock title="search query" lines={`webcam
# Or searching by specific camera titles:
"Server: SQ-WEBCAM"
"yawcam"`} />
            <p className="text-xs text-slate-400 mt-1">Queries web service banners identifying network cameras and streaming surveillance servers.</p>
          </div>

          <div>
            <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">Example 3 — Devices Prompting Default Passwords</div>
            <CodeBlock title="search query" lines={`"default password"
"admin" "password" port:23`} />
            <p className="text-xs text-slate-400 mt-1">Locates banners containing default configuration hints or setup wizards left unattended.</p>
          </div>

          <div>
            <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">Example 4 — Targeted Location &amp; Organization Recon</div>
            <CodeBlock title="search query" lines={`org:"YourCompany" city:"San Francisco"
product:"Apache httpd" country:"US"`} />
            <p className="text-xs text-slate-400 mt-1">Narrows down exposed assets belonging to a specific company, city, or software product.</p>
          </div>
        </div>
      </Section>

      <Section id="cli" icon="🛠️" title="Shodan CLI Setup &amp; Commands" subtitle="Query Shodan directly from your terminal">
        <p className="text-xs text-slate-400">Install the official Python Shodan CLI and initialize your API key:</p>
        <CodeBlock title="terminal" lines={`# 1. Install via pip
pip install shodan

# 2. Initialize with your API key from account.shodan.io
shodan init YOUR_API_KEY

# 3. Check your own public host exposure
shodan host 203.0.113.19

# 4. Search from the terminal
shodan search --limit 10 "port:23 default password"`} />
        <InfoBox title="API Key Required">
          The CLI requires a Shodan account. Free accounts get query credits every month; academic or upgraded accounts receive higher rate limits.
        </InfoBox>
      </Section>

      <Section id="output" icon="📊" title="What Shodan Output Looks Like" subtitle="Sample terminal output from shodan host">
        <CodeBlock title="sample output" lines={`203.0.113.19
Hostnames:               router.example.com
City:                    Dallas
Country:                 United States
Organization:            Example ISP Networks
Updated:                 2026-09-15T14:22:01.120000

Ports:
  22/tcp   SSH (OpenSSH 8.9p1 Ubuntu 3ubuntu0.6)
  80/tcp   HTTP (lighttpd/1.4.63)
           Title: Router Login Portal
  443/tcp  HTTPS (Self-signed certificate)
           SSL: TLSv1.2, TLSv1.3
  8080/tcp HTTP (Apache Tomcat/9.0.58)`} />
        <InfoBox title="Banner Analysis">
          Shodan highlights open ports, HTTP page titles, web servers, SSL certificate details, and historical scan timestamps for the IP.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Device Owners" subtitle="Steps to protect your hardware from Shodan exposure">
        <FeatureGrid items={[
          { i: '🔑', t: 'Change Default Passwords', d: 'Never keep default admin/admin credentials on routers, cameras, or NAS devices.' },
          { i: '🚫', t: 'Disable Remote WAN Access', d: 'Turn off external management interfaces and disable UPnP on your home gateway.' },
          { i: '🧱', t: 'Configure Firewalls & VPNs', d: 'Put internal devices behind WireGuard/OpenVPN or a strict hardware firewall.' },
          { i: '🔄', t: 'Patch & Segment IoT', d: 'Apply firmware updates immediately and keep IoT devices on an isolated VLAN.' },
        ]} />
      </Section>

      <Section id="flags" icon="🏷️" title="Key Shodan Search Filters" subtitle="Build powerful search queries">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">port:&lt;number&gt;</div>
            <div className="text-xs text-slate-400">Filter by specific listening port (e.g. port:21, port:3389).</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">org:&quot;&lt;name&gt;&quot;</div>
            <div className="text-xs text-slate-400">Filter by assigned organization or ISP name.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">country:&lt;2-letter-code&gt;</div>
            <div className="text-xs text-slate-400">Filter by country code (e.g. US, IN, DE, JP).</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">city:&quot;&lt;city-name&gt;&quot;</div>
            <div className="text-xs text-slate-400">Target a specific metropolitan area or city.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">product:&quot;&lt;name&gt;&quot;</div>
            <div className="text-xs text-slate-400">Search for identified software product (e.g. Nginx, MySQL, OpenSSH).</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">vuln:&quot;&lt;CVE-ID&gt;&quot;</div>
            <div className="text-xs text-slate-400">Locate devices known to be susceptible to a specific vulnerability (requires membership).</div>
          </div>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues &amp; Fixes" subtitle="Troubleshooting Shodan searches">
        <div className="space-y-3">
          <IssueRow
            issue="Filter requires Shodan membership error"
            fix="Certain filters (like vuln:, city:, and country: combinations) require a paid or academic Shodan account. Basic keyword and port: searches remain available on free accounts."
          />
          <IssueRow
            issue="shodan: command not found after pip install"
            fix={'Ensure Python\'s user bin path is in your PATH. Run export PATH="$PATH:$HOME/.local/bin" in your terminal.'}
          />
          <IssueRow
            issue="Device shows open on Shodan but is actually offline"
            fix="Shodan caches scan banners. Check the 'Updated' timestamp on the host page to verify how recently Shodan polled the IP."
          />
          <IssueRow
            issue="Exceeded daily query credits"
            fix="Free accounts receive limited query and scan credits per month. Upgrade your tier or space out your automated CLI queries."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['🔍', 'Official Shodan Search Engine', 'https://www.shodan.io'],
            ['📖', 'Shodan Documentation & Help Center', 'https://help.shodan.io'],
            ['💻', 'Official Shodan CLI Repository', 'https://github.com/achillean/shodan-python'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before researching devices">
        <p>
          This guide is provided <b>strictly for educational, research, and authorized defensive purposes</b>. Shodan indexes
          public banner data from across the web. Accessing or exploiting systems discovered on Shodan without prior written authorization
          is illegal and punishable under cybersecurity laws worldwide. The authors and this website assume no liability for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
