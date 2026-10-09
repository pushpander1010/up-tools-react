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
  { q: "What is Enum4linux?", a: "Enum4linux is a free, open-source SMB enumeration tool wrapping Samba clients. It extracts users, shares, groups, password policy, and OS details from Windows and Samba hosts — anonymously where allowed, fully with credentials." },
  { q: "Is using Enum4linux legal?", a: "Enum4linux itself is legitimate auditing software. Enumerating hosts without explicit written permission is illegal. Use it only on lab machines or signed-engagement targets, and guard enumerated data as sensitive." },
  { q: "How do I install Enum4linux?", a: "It ships with Kali. Elsewhere run sudo apt install enum4linux -y, or pipx install enum4linux-ng for the maintained fork with JSON output." },
  { q: "How do I enumerate a lab host?", a: "Run enum4linux -a against the authorized target IP. Save the output — usernames feed spraying and shares feed manual review in later phases." },
  { q: "What is the difference between null and authenticated runs?", a: "Null sessions show anonymous-visible data; adding -u and -p reveals member-level detail. The gap between the two measures guest-access leakage." },
  { q: "How does output feed password spraying?", a: "The -U user list plus -P lockout policy set safe spray pacing in NetExec with --no-bruteforce. Never spray without the policy this output reveals." },
  { q: "Why is access denied everywhere?", a: "Hardened hosts block null sessions. Authenticate with valid lab credentials or pivot to LDAP enumeration — denial of anonymous access is itself a defense win." },
  { q: "Should I use enum4linux or enum4linux-ng?", a: "The ng fork is maintained with JSON output and new checks. Learn classic flags first, then switch to ng for pipeline-friendly engagements." }
]

const howItWorks = [
  "Confirm SMB ports open on your authorized lab target with Nmap.",
  "Run enum4linux -a and save the full output to a file.",
  "Re-run authenticated with -u and -p and compare both views.",
  "Feed users and policy into safe, paced follow-up testing.",
  "Report exposures and harden shares, sessions, and policies."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Enum4linux SMB Enumerator — Users, Shares & Policy Guide',
      description: 'Step-by-step reference: enumerate users, shares & policies via SMB with Enum4linux. Lab only.',
      about: 'Enum4linux SMB null session enumeration',
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

export default function hackolution_enum4linux() {
  return (
    <ToolLayout
      title="Enum4linux SMB Enumerator"
      desc="Step-by-step reference: enumerate users, shares & policies via SMB with Enum4linux. Lab only."
      icon="📂"
      iconBg="linear-gradient(135deg, rgba(255,204,0,0.18), rgba(27,255,110,0.08))"
      category="security"
      slug="hackolution/enum4linux"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Enum4linux Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for SMB enumeration basics, null sessions, and the share hygiene that stops leaks.
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
        Enum4linux queries SMB services and can reveal users, shares, and password policy details. Enumerating any host without explicit written permission is strictly prohibited and illegal. Use Enum4linux <b>only on lab machines or targets covered by a signed authorization</b>. Treat enumerated usernames and shares as sensitive engagement data.
      </WarningBox>

      <Section id="overview" icon="📂" title="What is Enum4linux?" subtitle="Classic SMB enumeration for Linux and Windows targets">
        <p>
          <b>Enum4linux</b> is a free, open-source <b>SMB enumeration tool</b> wrapping Samba clients. Against a lab host it extracts <b>user lists, share lists, group memberships, password policy, OS details, and printer info</b> — often through old null sessions, and fully with one valid credential.
        </p>
        <p>
          It remains the first SMB knock in authorized internal tests: the user list it returns feeds password spraying, the shares feed file hunting, and the policy reveals lockout limits before any authentication is attempted. Its maintained fork enum4linux-ng adds JSON output for pipelines.
        </p>
        <FeatureGrid items={[
          { i: '👥', t: 'User Enumeration', d: 'RID cycling builds full lab user lists.' },
          { i: '📁', t: 'Share Discovery', d: 'Lists shares plus access notes per host.' },
          { i: '📜', t: 'Policy Dump', d: 'Lockout threshold and complexity rules revealed.' },
          { i: '🖥️', t: 'OS Fingerprint', d: 'Version strings guiding exploit selection.' },
          { i: '👑', t: 'Group Mapping', d: 'Admins and operators identified for targeting.' },
          { i: '🖨️', t: 'Printer & Misc', d: 'Spooler and extra services inventoried.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Enum4linux on Linux">
        <p className="text-xs text-slate-400">Enum4linux ships preinstalled on Kali. On other Debian systems install it with apt:</p>
        <CodeBlock title="terminal" lines={`sudo apt install enum4linux -y
# maintained fork with JSON output:
# pipx install enum4linux-ng`} />
        <InfoBox title="Samba dependency">
          Enum4linux wraps smbclient, rpcclient, and net commands — the package pulls them automatically. Verify with enum4linux -h before pointing it at any lab host.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Full Enumeration" subtitle="Run every check against a lab host">
        <p className="text-xs text-slate-400">Enumerate everything about your authorized lab target in one run:</p>
        <CodeBlock title="terminal" lines={`enum4linux -a 192.168.56.10`} />
        <InfoBox title="Reading the dump">
          The -a flag runs users, shares, groups, policy, and OS checks together. Save output to a file — usernames feed spraying tools and shares feed manual file hunting in the next phase.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Authenticated Run" subtitle="Deeper results with one credential">
        <p className="text-xs text-slate-400">Re-run with a valid lab credential for complete enumeration:</p>
        <CodeBlock title="terminal" lines={`enum4linux -a 192.168.56.10 -u user -p Password1`} />
        <InfoBox title="Null vs authenticated">
          Null sessions reveal what anonymous users see; credentials reveal everything else. Compare both outputs — the gap measures exactly what guest access leaks versus member access.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Users & Policy Only" subtitle="Prep for safe password spraying">
        <p className="text-xs text-slate-400">Pull just users and policy when planning the next lab phase:</p>
        <CodeBlock title="terminal" lines={`enum4linux -U -P 192.168.56.10`} />
        <InfoBox title="From enum to spray">
          The -U flag RID-cycles user accounts while -P dumps lockout policy. Feed the user list to NetExec with --no-bruteforce, honoring the lockout threshold this very output revealed.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Enum4linux full enumeration output">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/enum4linux/enum4linux_logo.jpg" alt="Enum4linux SMB enumerator logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Enum4linux results — users, shares, and policy enumerated</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Enum4linux Finds" subtitle="Common discoveries from SMB enumeration">
        <FeatureGrid items={[
          { i: '👥', t: 'User Rosters', d: 'Full account lists for spraying and kerberoasting.' },
          { i: '📁', t: 'Open Shares', d: 'Readable shares with scripts, backups, and secrets.' },
          { i: '📜', t: 'Lockout Policy', d: 'Thresholds that set safe spray pacing.' },
          { i: '👑', t: 'Admin Groups', d: 'Who holds keys to the lab kingdom.' },
          { i: '🖥️', t: 'OS Versions', d: 'Unpatched Samba and Windows builds flagged.' },
          { i: '🔓', t: 'Null Session Leaks', d: 'Anonymous-readable data worth closing.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Connection refused or timeout"
            fix="Confirm SMB ports 139/445 are open with an Nmap check first. Verify lab routing and that the target actually runs Samba or Windows file sharing."
          />
          <IssueRow
            issue="Access denied on everything"
            fix="The host blocks null sessions — expected on hardened builds. Retry with -u and -p credentials; anonymous and authenticated views differ by design."
          />
          <IssueRow
            issue="RID cycling finds no users"
            fix="The target restricts SAMR enumeration. Try authenticated enumeration or pivot to LDAP-based user discovery in the lab."
          />
          <IssueRow
            issue="Output is overwhelming"
            fix="Run targeted flags (-U for users, -S for shares, -P for policy) instead of -a, and always save to files for phased review."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Enum4linux Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-a &lt;target&gt;</div>
            <div className="text-xs text-slate-400">Run all enumeration checks in one pass.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-U</div>
            <div className="text-xs text-slate-400">Enumerate users via RID cycling.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-S</div>
            <div className="text-xs text-slate-400">List shares with access details.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-P</div>
            <div className="text-xs text-slate-400">Dump password and lockout policy.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u / -p</div>
            <div className="text-xs text-slate-400">Authenticate for deeper enumeration.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o</div>
            <div className="text-xs text-slate-400">Write results to a file for the report.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Enum4linux Repository', 'https://github.com/CiscoCXSecurity/enum4linux'],
            ['📖', 'Enum4linux-ng Maintained Fork', 'https://github.com/cddmp/enum4linux-ng'],
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
