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
  { q: "What is Responder?", a: "Responder is a free, open-source network poisoning tool by Laurent Gaffie. It answers LLMNR, NBT-NS, and mDNS queries on a LAN, capturing NetNTLM hashes when Windows hosts authenticate to it, with rogue servers and relay pairing." },
  { q: "Is using Responder legal?", a: "Responder itself is legitimate auditing software. Poisoning networks without explicit written permission is illegal. Run it only in isolated labs or signed engagements where poisoning is explicitly in scope." },
  { q: "How do I install Responder?", a: "It ships with Kali. Elsewhere clone github.com/lgandx/Responder and run sudo python3 Responder.py. Confirm your lab interface with ip a first." },
  { q: "How do I capture hashes?", a: "Run sudo python3 Responder.py -I eth0 -wF on the lab segment. Trigger victim traffic with a bad share path, then crack captures offline with hashcat mode 5600." },
  { q: "What is the difference between capture and relay?", a: "Capture stores hashes for offline cracking. Relay forwards live authentication to ntlmrelayx for immediate access without cracking — disable local SMB/HTTP servers so auth forwards." },
  { q: "Why am I getting no hashes?", a: "Check same-segment position, confirm targets emit LLMNR, and generate traffic deliberately. Hardened or isolated hosts stay silent by design." },
  { q: "How do defenders stop Responder?", a: "Disable LLMNR and NBT-NS via Group Policy, enforce SMB signing and LDAP channel binding, block outbound SMB, and monitor for rogue NBNS/LLMNR answers." },
  { q: "What is Analyze mode?", a: "The -A flag watches name traffic without poisoning anything — safe reconnaissance that maps chatty hosts before an authorized poisoning window." }
]

const howItWorks = [
  "Join the isolated lab segment and confirm your interface with ip a.",
  "Launch Responder with sudo python3 Responder.py -I eth0 -wF.",
  "Generate lab victim traffic and capture NetNTLM hashes to logs.",
  "Crack offline with hashcat or relay live with ntlmrelayx inside scope.",
  "Remediate: disable LLMNR/NBT-NS, enforce signing, and monitor for rogues."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Responder Poisoning Lab — LLMNR Capture & Defense Guide',
      description: 'Step-by-step reference: demo LLMNR poisoning & credential capture with Responder. Lab only.',
      about: 'Responder LLMNR NBT-NS poisoner',
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

export default function hackolution_responder() {
  return (
    <ToolLayout
      title="Responder Poisoning Lab"
      desc="Step-by-step reference: demo LLMNR poisoning & credential capture with Responder. Lab only."
      icon="📢"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(255,204,0,0.08))"
      category="security"
      slug="hackolution/responder"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Responder Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for name-poisoning basics, captured hashes, and the hardening that kills it.
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
        Responder poisons name resolution and captures authentication material on local networks. Running it on any network without explicit written permission is strictly prohibited and illegal. Use Responder <b>only in isolated lab networks or engagements covered by a signed authorization</b> where poisoning is explicitly in scope. Handle every captured hash as a live credential.
      </WarningBox>

      <Section id="overview" icon="📢" title="What is Responder?" subtitle="LLMNR, NBT-NS and mDNS poisoning for labs">
        <p>
          <b>Responder</b> is a free, open-source <b>network poisoning tool</b> by Laurent Gaffie. On a lab LAN it answers <b>LLMNR, NBT-NS, and mDNS</b> name queries meant for someone else — and when Windows hosts try to authenticate to the impostor, it captures <b>NetNTLM hashes</b> for offline cracking.
        </p>
        <p>
          In authorized internal assessments it proves how chatty Windows name resolution leaks credentials: one typo in a share path and the hash is gone. Paired with ntlmrelayx and hashcat, it anchors the classic lab credential-capture chain — and motivates disabling legacy protocols everywhere.
        </p>
        <FeatureGrid items={[
          { i: '📢', t: 'Multi-Protocol Poison', d: 'LLMNR, NBT-NS, mDNS, plus WPAD and browser-protocol tricks.' },
          { i: '🔑', t: 'Hash Capture', d: 'NetNTLMv1 and v2 hashes logged per lab victim.' },
          { i: '🔁', t: 'Relay Pairing', d: 'Feeds ntlmrelayx for no-crack lab exploitation.' },
          { i: '🖥️', t: 'Rogue Servers', d: 'Fake SMB, HTTP, SQL, and FTP listeners in one run.' },
          { i: '🎯', t: 'Selective Poisoning', d: 'Target chosen lab hosts instead of whole subnets.' },
          { i: '📝', t: 'Clean Logs', d: 'Per-host capture logs ready for lab reports.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Responder on Linux">
        <p className="text-xs text-slate-400">Responder ships preinstalled on Kali. On other Debian systems, clone and run directly:</p>
        <CodeBlock title="terminal" lines={`git clone https://github.com/lgandx/Responder
cd Responder
sudo python3 Responder.py -h`} />
        <InfoBox title="Network position matters">
          Responder must sit on the same lab broadcast segment as its targets — same VLAN or virtual lab network. Confirm the lab interface name with ip a and pass it with -I on every run.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic Poison Run" subtitle="Capture hashes on the lab LAN">
        <p className="text-xs text-slate-400">Poison name resolution on your isolated lab interface and watch for captures:</p>
        <CodeBlock title="terminal" lines={`sudo python3 Responder.py -I eth0 -wF`} />
        <InfoBox title="Reading the captures">
          The -w flag starts the WPAD rogue proxy and -F fingerprints hosts. Captured NetNTLMv2 hashes print in the console and save to logs/ — crack them offline with hashcat mode 5600 inside the lab only.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Targeted Poisoning" subtitle="Limit poison to chosen lab hosts">
        <p className="text-xs text-slate-400">Poison only specific lab machines instead of the whole segment:</p>
        <CodeBlock title="terminal" lines={`sudo python3 Responder.py -I eth0 -wF --lm --disable-ess`} />
        <InfoBox title="Precision and stealth notes">
          The --lm flag also grabs weaker NetNTLMv1 where lab policy allows, and --disable-ess handles hardened clients. Targeted runs keep lab noise down and respect narrow scopes.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Relay to ntlmrelayx" subtitle="Skip cracking with live relay">
        <p className="text-xs text-slate-400">Forward captured authentication to ntlmrelayx against a lab target:</p>
        <CodeBlock title="terminal" lines={`# terminal 1: ntlmrelayx.py -tf targets.txt -smb2support
# terminal 2: sudo python3 Responder.py -I eth0 -wF`} />
        <InfoBox title="Relay pairing rules">
          Disable Responder built-in SMB and HTTP servers so authentication relays instead of terminating locally. Relay only inside the lab — each success is a signed-scope lateral movement proved without cracking.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Responder capturing lab hashes">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/responder/responder_logo.jpg" alt="Responder poisoning lab logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Responder console — poisoned queries and captured hashes</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Responder Captures Find" subtitle="Common discoveries from poisoning runs">
        <FeatureGrid items={[
          { i: '🔑', t: 'NetNTLM Hashes', d: 'Crackable credentials from chatty lab hosts.' },
          { i: '🖥️', t: 'Legacy Protocols Live', d: 'LLMNR and NBT-NS still enabled on the segment.' },
          { i: '🌐', t: 'WPAD Exposure', d: 'Proxy auto-discovery begging for interception.' },
          { i: '👥', t: 'High-Value Sessions', d: 'Admin hostnames resolving through poison.' },
          { i: '🔁', t: 'Relay Targets', d: 'Unsigned SMB hosts that accept relayed auth.' },
          { i: '📋', t: 'Hardening List', d: 'Every capture maps to a setting to disable.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="No hashes after long runs"
            fix="Confirm same broadcast segment, check the lab hosts actually emit LLMNR (modern hardened builds may not), and trigger traffic with a bad share path like net use //nonexistent/share."
          />
          <IssueRow
            issue="Permission or socket errors"
            fix="Run with sudo and confirm the interface exists and is up. Other tools bound to ports 445 or 80 block Responder rogue servers — stop them first."
          />
          <IssueRow
            issue="Hashes will not crack"
            fix="Verify the full hash copied with its challenge intact and use hashcat mode 5600 for v2. Strong lab passwords resist by design — that resistance is the lesson."
          />
          <IssueRow
            issue="Relay never fires"
            fix="Disable Responder SMB and HTTP servers so auth forwards to ntlmrelayx, and confirm targets allow the relayed protocol. SMB signing on targets kills relaying — note it as a defense win."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Responder Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-I &lt;iface&gt;</div>
            <div className="text-xs text-slate-400">Lab network interface to poison on.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-w / -F</div>
            <div className="text-xs text-slate-400">WPAD rogue proxy plus host fingerprinting.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--lm</div>
            <div className="text-xs text-slate-400">Also capture weaker NetNTLMv1 where allowed.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--disable-ess</div>
            <div className="text-xs text-slate-400">Handle hardened clients with extended security.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-A</div>
            <div className="text-xs text-slate-400">Analyze mode: watch without poisoning (safe recon).</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">logs/ folder</div>
            <div className="text-xs text-slate-400">Per-host capture logs for cracking and reports.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Responder GitHub Repository', 'https://github.com/lgandx/Responder'],
            ['📖', 'Responder Usage Documentation', 'https://github.com/lgandx/Responder#usage'],
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
