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
  { q: "What is Impacket?", a: "Impacket is a free, open-source Python toolkit for network protocols, maintained by Fortra. Its example scripts implement the standard Active Directory attack chain: AS-REP roasting, kerberoasting, hash dumping, lateral movement, and relay attacks." },
  { q: "Is using Impacket legal?", a: "Impacket itself is legitimate security software. Running its attacks against any network without explicit written permission is illegal. Practice only in isolated labs like GOAD or HackTheBox, or under a signed authorization." },
  { q: "How do I install Impacket?", a: "Run pipx install impacket, or install inside a Python venv with pip install impacket. Verify with secretsdump.py and keep the tooling on a dedicated lab VM, never on production machines." },
  { q: "What is AS-REP roasting?", a: "Accounts with Kerberos pre-authentication disabled hand out crackable hashes to anyone who asks. GetNPUsers.py collects them and hashcat mode 18200 cracks them offline. The fix is enabling pre-authentication on every account." },
  { q: "What is kerberoasting?", a: "Service tickets are encrypted with the service account password hash, so anyone can request and crack them offline. GetUserSPNs.py with -request collects them for hashcat mode 13100. Strong managed service passwords are the defense." },
  { q: "What does secretsdump do?", a: "It extracts password hashes from SAM, LSA secrets, and the NTDS database of lab domain controllers. Treat all output as live credentials: encrypt, crack inside the lab, and wipe it afterward." },
  { q: "What is ntlmrelayx?", a: "It relays captured NTLM authentication to target services instead of cracking it. It needs an attacker position in the lab network and pairs with Responder. Enforce SMB signing and HTTPS to blunt it." },
  { q: "Why do I get clock skew errors?", a: "Kerberos requires client and server clocks within minutes. Sync your lab VM clock to the domain controller with ntpdate or chrony and retry." }
]

const howItWorks = [
  "Install Impacket with pipx on a dedicated lab VM and verify the example scripts.",
  "Enumerate and roast with GetNPUsers.py and GetUserSPNs.py against your lab domain controller.",
  "Crack collected tickets offline with hashcat inside the lab only.",
  "Practice lateral movement and relaying with psexec, wmiexec, and ntlmrelayx in GOAD.",
  "Remediate every path found: pre-auth everywhere, strong service passwords, SMB signing, and tiered admin accounts."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Impacket AD Toolkit — Secretsdump, Kerberoasting & Relay Lab Guide',
      description: 'Step-by-step reference: test Active Directory labs with Impacket secretsdump, kerberoasting & relay. Lab only.',
      about: 'Impacket Active Directory protocol toolkit',
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

export default function hackolution_impacket() {
  return (
    <ToolLayout
      title="Impacket AD Toolkit"
      desc="Step-by-step reference: test Active Directory labs with Impacket secretsdump, kerberoasting & relay. Lab only."
      icon="🏭"
      iconBg="linear-gradient(135deg, rgba(255,204,0,0.18), rgba(27,255,110,0.08))"
      category="security"
      slug="hackolution/impacket"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Impacket Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for Active Directory attack paths, kerberoasting, and credential hygiene that stops them.
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
        Impacket executes real credential attacks against Active Directory: dumping hashes, kerberoasting, and relaying authentication. Running these techniques against any network without explicit written permission is strictly prohibited and illegal. Use Impacket <b>only in isolated AD labs (GOAD, BadBlood, HackTheBox) or engagements covered by a signed authorization</b>. Handle all output as live credentials.
      </WarningBox>

      <Section id="overview" icon="🏭" title="What is Impacket?" subtitle="The Python toolkit behind most Active Directory attacks">
        <p>
          <b>Impacket</b> is a free, open-source <b>Python toolkit</b> for working with network protocols, maintained by Fortra. Its example scripts implement the classic <b>Active Directory attack chain</b>: enumerate users without credentials, roast service tickets offline, dump domain hashes, move laterally with stolen hashes, and relay authentication between hosts.
        </p>
        <p>
          Nearly every AD lab walkthrough uses it: <b>GetNPUsers</b> for AS-REP roasting, <b>GetUserSPNs</b> for kerberoasting, <b>secretsdump</b> for hash extraction, <b>psexec and wmiexec</b> for lateral movement, and <b>ntlmrelayx</b> for relay attacks. Learn each script in an isolated lab and you understand how real AD compromises unfold.
        </p>
        <FeatureGrid items={[
          { i: '🔑', t: 'Hash Dumping', d: 'secretsdump extracts SAM, LSA, and NTDS hashes for offline cracking.' },
          { i: '🎫', t: 'Ticket Roasting', d: 'GetNPUsers and GetUserSPNs roast tickets crackable without brute force.' },
          { i: '💻', t: 'Lateral Movement', d: 'psexec, wmiexec, and smbexec reuse hashes across lab hosts.' },
          { i: '🔁', t: 'Relay Attacks', d: 'ntlmrelayx relays captured authentication to target services.' },
          { i: '🎟️', t: 'Ticket Forgery', d: 'ticketer crafts golden and silver tickets in lab domains.' },
          { i: '🖥️', t: 'Machine Accounts', d: 'addcomputer stages computer accounts for lab attack chains.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Impacket on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install in an isolated virtual environment:</p>
        <CodeBlock title="terminal" lines={`pipx install impacket
# or in a venv:
# python3 -m venv impacket-env && source impacket-env/bin/activate
# pip install impacket`} />
        <InfoBox title="Verify the install">
          Run secretsdump.py without arguments to confirm the scripts are on your PATH. pipx users may need to restart the shell first. Never install attack tooling on production machines — keep a dedicated lab VM or container.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — AS-REP Roasting" subtitle="Roast accounts without pre-authentication">
        <p className="text-xs text-slate-400">Request crackable hashes for lab users that skip Kerberos pre-authentication:</p>
        <CodeBlock title="terminal" lines={`GetNPUsers.py LAB.local/ -dc-ip 192.168.56.10 -no-pass -usersfile users.txt`} />
        <InfoBox title="Cracking the hashes">
          Save each AS-REP hash and crack it offline with hashcat mode 18200. Success reveals accounts whose misconfiguration allows authentication without a password — a classic lab foothold. Fix it by enabling pre-authentication on every account.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Kerberoasting" subtitle="Request service tickets and crack them offline">
        <p className="text-xs text-slate-400">Pull service tickets for lab service accounts and roast them:</p>
        <CodeBlock title="terminal" lines={`GetUserSPNs.py LAB.local/user:Password1 -dc-ip 192.168.56.10 -request`} />
        <InfoBox title="Cracking service tickets">
          Crack TGS tickets offline with hashcat mode 13100. Service accounts with weak passwords fall fast, so labs pair this with strong managed passwords as the fix. Never run this outside authorized lab domains.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Dumping & Relaying" subtitle="Extract hashes and relay authentication in the lab">
        <p className="text-xs text-slate-400">Dump domain hashes after lab compromise, or relay authentication between lab hosts:</p>
        <CodeBlock title="terminal" lines={`secretsdump.py LAB.local/admin:Password1@192.168.56.10
# relay mode on its own host:
# ntlmrelayx.py -t smb://192.168.56.11`} />
        <InfoBox title="Handling the output">
          Dumped hashes are live credentials: store them encrypted, crack only inside the lab, and wipe them when done. Relay attacks need an attacker-controlled position in the lab network — practice with Responder and ntlmrelayx together in GOAD.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Impacket scripts running against a lab domain">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/impacket/impacket_logo.jpg" alt="Impacket Active Directory toolkit logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Impacket example scripts: roasting, dumping, and lateral movement</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Impacket Tests Find" subtitle="Common discoveries from AD lab assessments">
        <FeatureGrid items={[
          { i: '🎫', t: 'Roastable Accounts', d: 'AS-REP and kerberoastable principals with crackable tickets.' },
          { i: '🔑', t: 'Dumped Hashes', d: 'NTDS and SAM secrets enabling offline cracking.' },
          { i: '💻', t: 'Lateral Paths', d: 'Hosts reachable via reused hashes and sessions.' },
          { i: '🔁', t: 'Relay Opportunities', d: 'Unsigned SMB and HTTP endpoints that accept relayed auth.' },
          { i: '🎟️', t: 'Forged Tickets', d: 'Golden and silver ticket persistence in lab domains.' },
          { i: '🛡️', t: 'Hygiene Gaps', d: 'Weak service passwords and missing signing to remediate.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Script not found after install"
            fix="Restart your shell so the pipx path loads, or activate your venv again. Confirm with which secretsdump.py before running."
          />
          <IssueRow
            issue="Clock skew errors against the lab DC"
            fix="Sync your clock with the domain controller using sudo ntpdate or chrony. Kerberos fails when clocks differ by more than a few minutes."
          />
          <IssueRow
            issue="No route to the domain controller"
            fix="Check VPN or lab network connectivity with ping to the DC IP, and pass the right -dc-ip. Lab domains need matching DNS or host entries."
          />
          <IssueRow
            issue="Hashes will not crack"
            fix="Verify you copied the full hash format and used the right hashcat mode (18200 for AS-REP, 13100 for TGS). Strong lab passwords are meant to resist — that is the lesson."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Impacket Scripts & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">GetNPUsers.py</div>
            <div className="text-xs text-slate-400">AS-REP roasting: users without Kerberos pre-authentication.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">GetUserSPNs.py -request</div>
            <div className="text-xs text-slate-400">Kerberoasting: crackable service tickets.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">secretsdump.py</div>
            <div className="text-xs text-slate-400">Dump SAM, LSA, and NTDS hashes from lab hosts.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">psexec / wmiexec / smbexec</div>
            <div className="text-xs text-slate-400">Lateral movement reusing hashes on lab machines.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">ntlmrelayx.py -t</div>
            <div className="text-xs text-slate-400">Relay captured authentication to a target service.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-dc-ip & usersfile</div>
            <div className="text-xs text-slate-400">Point at the lab DC and feed username lists.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Impacket GitHub Repository', 'https://github.com/fortra/impacket'],
            ['📖', 'Impacket Examples Documentation', 'https://github.com/fortra/impacket/tree/master/examples'],
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
