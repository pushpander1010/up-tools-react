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
  { q: "What is NetExec?", a: "NetExec is a free, open-source network exploitation toolkit and the maintained successor to CrackMapExec. It audits SMB, WinRM, SSH, LDAP, MSSQL, RDP, and more — testing credentials, enumerating shares, and running modules at subnet scale." },
  { q: "Is using NetExec legal?", a: "NetExec itself is legitimate auditing software. Authenticating against systems without explicit written permission is illegal, and spraying can lock accounts. Use it only in isolated labs or signed engagements with agreed lockout limits." },
  { q: "How do I install NetExec?", a: "Run pipx install netexec on Python 3.8 or newer. Verify with nxc --help and let the first run create its workspace database." },
  { q: "How do I check credentials across a subnet?", a: "Run nxc smb against your lab range with -u and -p plus --shares. Hosts accepting the credential list their shares — the foundation of lateral movement mapping." },
  { q: "How do I spray safely?", a: "Use --no-bruteforce with small lists, confirm the lockout policy first, and stop at agreed thresholds. One password per user per round is the safe pattern." },
  { q: "What is the difference between NetExec and CrackMapExec?", a: "NetExec is the actively maintained fork with new protocols, modules, and a workspace database. CrackMapExec is unmaintained — all new work happens in NetExec." },
  { q: "Which protocol should I start with?", a: "SMB: it reveals shares, sessions, and admin rights — the core internal attack surface. Expand to WinRM for command execution and LDAP for directory enumeration." },
  { q: "Why are accounts locking out?", a: "Too many bad guesses tripped the policy. Stop, verify the threshold, shrink lists, slow down, and resume only inside the agreed window." }
]

const howItWorks = [
  "Install NetExec with pipx and verify protocols with nxc --help.",
  "Confirm the lab lockout policy and scope before any authentication.",
  "Test credentials across the lab subnet with nxc smb plus --shares and --sessions.",
  "Spray safely with --no-bruteforce and run targeted modules on accepting hosts.",
  "Remediate: unique passwords, least-privilege admin, hardened shares, and lockout monitoring."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'NetExec Network Executor — SMB, WinRM & Credential Audit Lab Guide',
      description: 'Step-by-step reference: audit lab networks with NetExec SMB, WinRM & credential checks. Lab only.',
      about: 'NetExec network service exploitation toolkit',
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

export default function hackolution_netexec() {
  return (
    <ToolLayout
      title="NetExec Network Executor"
      desc="Step-by-step reference: audit lab networks with NetExec SMB, WinRM & credential checks. Lab only."
      icon="🖧"
      iconBg="linear-gradient(135deg, rgba(255,204,0,0.18), rgba(239,68,68,0.08))"
      category="security"
      slug="hackolution/netexec"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the NetExec Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for credential auditing, share enumeration, and password hygiene that stops lateral movement.
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
        NetExec authenticates against real network services and can lock accounts, trigger alerts, and disrupt systems. Running it against any network without explicit written permission is strictly prohibited and illegal. Use NetExec <b>only in isolated labs or engagements covered by a signed authorization</b>, with agreed credential-spraying limits and lockout policies confirmed first.
      </WarningBox>

      <Section id="overview" icon="🖧" title="What is NetExec?" subtitle="The CrackMapExec successor for network audits">
        <p>
          <b>NetExec (nxc)</b> is a free, open-source <b>network exploitation toolkit</b> in Python and the maintained successor to CrackMapExec. One command authenticates across <b>SMB, WinRM, MSSQL, LDAP, SSH, RDP, and more</b> — testing credentials, dumping shares, and running modules at scale.
        </p>
        <p>
          Its workflow is enumeration at network speed: spray one credential set across a subnet, list who has local admin, enumerate shares and sessions, then run targeted modules. In authorized internal assessments it answers the critical question of how far one leaked password reaches.
        </p>
        <FeatureGrid items={[
          { i: '🌐', t: 'Multi-Protocol Audits', d: 'SMB, WinRM, SSH, LDAP, MSSQL, RDP, and VNC in one tool.' },
          { i: '🔑', t: 'Credential Spraying', d: 'Test password sets across whole subnets with lockout awareness.' },
          { i: '📁', t: 'Share Enumeration', d: 'List readable and writable shares plus active sessions.' },
          { i: '🧩', t: 'Module Library', d: 'Post-auth modules for_enum, secrets, and misconfigurations.' },
          { i: '🗄️', t: 'Credential Database', d: 'Workspace database tracks hosts, creds, and loot per engagement.' },
          { i: '⚡', t: 'Subnet Speed', d: 'Threaded execution covers ranges in minutes, not hours.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install NetExec on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install with pipx (recommended):</p>
        <CodeBlock title="terminal" lines={`pipx install netexec`} />
        <InfoBox title="First-run setup">
          On first launch NetExec creates its workspace database and asks for defaults. Verify with nxc --help and confirm the smb, winrm, and ssh protocols list correctly before lab use.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — SMB Credential Check" subtitle="Test credentials across a lab subnet">
        <p className="text-xs text-slate-400">Validate one credential set against every host in your authorized lab range:</p>
        <CodeBlock title="terminal" lines={`nxc smb 192.168.56.0/24 -u user -p Password1 --shares`} />
        <InfoBox title="Shares and sessions">
          The --shares flag lists accessible shares on each host that accepts the credential. Follow with --sessions to see who is logged in where — the classic map for lab lateral movement planning.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Password Spray Audit" subtitle="Measure password reuse safely">
        <p className="text-xs text-slate-400">Spray a small password list against lab users with agreed lockout limits:</p>
        <CodeBlock title="terminal" lines={`nxc smb 192.168.56.0/24 -u users.txt -p passwords.txt --no-bruteforce --continue-on-success`} />
        <InfoBox title="Spraying without lockouts">
          The --no-bruteforce flag tries each password once per user instead of full combinations. Confirm the lab lockout policy first, spray slowly, and stop at the first agreed threshold.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — WinRM Command Run" subtitle="Execute across hosts that accept creds">
        <p className="text-xs text-slate-400">Run an inventory command over WinRM on lab hosts that accepted credentials:</p>
        <CodeBlock title="terminal" lines={`nxc winrm 192.168.56.0/24 -u admin -p Password1 -x whoami`} />
        <InfoBox title="Command execution notes">
          The -x flag runs one shell command per host and prints grouped output. Use it for inventory (whoami, hostname) in labs — destructive commands have no place in auditing workflows.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="NetExec auditing a lab subnet">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/netexec/netexec_logo.jpg" alt="NetExec network executor logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">NetExec credential and share audit across lab hosts</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What NetExec Audits Find" subtitle="Common discoveries from network sweeps">
        <FeatureGrid items={[
          { i: '🔑', t: 'Password Reuse', d: 'One leaked credential opening many lab hosts.' },
          { i: '📁', t: 'Open Shares', d: 'Readable and writable shares with sensitive files.' },
          { i: '👑', t: 'Local Admin Spread', d: 'Accounts holding admin rights where they should not.' },
          { i: '👥', t: 'Live Sessions', d: 'Logged-in users revealing high-value targets.' },
          { i: '🔓', t: 'Weak Credentials', d: 'Default and guessable passwords on services.' },
          { i: '🧩', t: 'Module Findings', d: 'Misconfigurations surfaced by post-auth modules.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Accounts keep locking out"
            fix="Stop immediately, confirm the lab lockout threshold, and switch to --no-bruteforce with tiny lists. Never spray production-adjacent systems."
          />
          <IssueRow
            issue="Protocol module missing"
            fix="Update NetExec and check nxc protocol list. Some protocols need extra Python packages — install them in the same pipx venv."
          />
          <IssueRow
            issue="Authentication fails everywhere"
            fix="Verify credential format (domain/user), check the lab DC is reachable, and confirm the account is not locked or expired."
          />
          <IssueRow
            issue="Database shows stale hosts"
            fix="Create a fresh workspace per engagement with nxcdb or the workspace flags so old lab data never pollutes new results."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key NetExec Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">smb / winrm / ssh</div>
            <div className="text-xs text-slate-400">Protocol to audit — each with its own modules.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u / -p &lt;creds&gt;</div>
            <div className="text-xs text-slate-400">Username and password, or files of each for spraying.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--shares / --sessions</div>
            <div className="text-xs text-slate-400">Enumerate shares and logged-in sessions.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--no-bruteforce</div>
            <div className="text-xs text-slate-400">One password per user: safe spray ordering.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-M &lt;module&gt;</div>
            <div className="text-xs text-slate-400">Run a post-authentication module.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-x &lt;cmd&gt;</div>
            <div className="text-xs text-slate-400">Execute one shell command per accepting host.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official NetExec GitHub Repository', 'https://github.com/Pennyw0rth/NetExec'],
            ['📖', 'NetExec Usage Documentation', 'https://github.com/Pennyw0rth/NetExec/wiki'],
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
