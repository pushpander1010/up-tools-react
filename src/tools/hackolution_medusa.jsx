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
  { q: "What is Medusa?", a: "Medusa is a free, open-source network login brute-forcer on Kali. It tests credential combinations in parallel threads against SSH, FTP, HTTP forms, SMB, databases, and more through protocol modules." },
  { q: "Is using Medusa legal?", a: "Medusa itself is legitimate auditing software. Brute-forcing logins without explicit written permission is illegal and locks accounts. Use it only on lab machines or signed engagements with agreed lists and thresholds." },
  { q: "How do I install Medusa?", a: "It ships with Kali. Elsewhere run sudo apt install medusa -y, then medusa -d to list every protocol module available." },
  { q: "How do I audit lab SSH?", a: "Run medusa -h against the lab IP with -u, -P, -M ssh, and -t 4. Keep lists tiny, watch for lockouts, and stop at agreed attempt counts." },
  { q: "How do web form audits work?", a: "Map the form with -m including path, ^USER^ and ^PASS^ fields, and the F= failure string from a manual bad login. Medusa replays the form per password." },
  { q: "What is the difference between Medusa and Hydra?", a: "Both brute-force logins. Hydra covers more protocols with simpler syntax; Medusa offers fine thread control and combo-file flexibility. Labs often keep both ready." },
  { q: "Why did accounts lock out?", a: "Too many guesses tripped the policy. Stop, confirm the threshold, shrink lists drastically, and resume only inside the agreed window — if at all." },
  { q: "How do defenders stop brute force?", a: "SSH keys instead of passwords, fail2ban rate limiting, account lockouts with alerting, MFA everywhere, and no exposed management logins." }
]

const howItWorks = [
  "Confirm the lab lockout policy and agreed credential lists first.",
  "Verify the service module with medusa -d and a banner check.",
  "Audit with tiny lists, capped threads, and hits-only logging.",
  "Stop at agreed counts and check for lockouts between runs.",
  "Remediate with keys, lockouts, MFA, and hidden management ports."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Medusa Login Brute-Forcer — Parallel Credential Audit Guide',
      description: 'Step-by-step reference: audit lab logins in parallel with Medusa modules. Lab only.',
      about: 'Medusa parallel network login brute-forcer',
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

export default function hackolution_medusa() {
  return (
    <ToolLayout
      title="Medusa Login Brute-Forcer"
      desc="Step-by-step reference: audit lab logins in parallel with Medusa modules. Lab only."
      icon="🐙"
      iconBg="linear-gradient(135deg, rgba(255,107,53,0.18), rgba(239,68,68,0.08))"
      category="security"
      slug="hackolution/medusa"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Medusa Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for login audit basics, lockout dangers, and the password policies that stop brute force.
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
        Medusa tests live login credentials and can lock accounts, trigger alarms, and disrupt services. Brute-forcing any system without explicit written permission is strictly prohibited and illegal. Use Medusa <b>only on lab machines or engagements covered by a signed authorization</b>, with agreed account lists and lockout thresholds confirmed first. Never brute-force production logins.
      </WarningBox>

      <Section id="overview" icon="🐙" title="What is Medusa?" subtitle="Fast parallel logins across dozens of protocols">
        <p>
          <b>Medusa</b> is a free, open-source <b>network login brute-forcer</b> on Kali Linux. It tests credential combinations in <b>parallel threads</b> against <b>SSH, FTP, HTTP, SMB, MySQL, Telnet, and dozens more protocols</b> through modular service plugins.
        </p>
        <p>
          Authorized testers use it to prove weak-credential risk on lab services: point it at a lab SSH box with a small password list, watch valid logins surface, then mandate keys and lockouts. Its speed demands respect — the same parallelism that audits fast also locks accounts fast.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Parallel Threads', d: 'Dozens of simultaneous attempts per target service.' },
          { i: '🔌', t: 'Protocol Modules', d: 'SSH, FTP, HTTP form and basic, SMB, SQL, and more.' },
          { i: '📋', t: 'Combo Lists', d: 'User, password, and user:pass files mixed freely.' },
          { i: '🛑', t: 'Stop on Success', d: 'Halts per-host testing the moment access lands.' },
          { i: '📝', t: 'Clean Hit Logs', d: 'Valid credentials recorded for the lab report.' },
          { i: '🧩', t: 'Modular Design', d: 'One engine, many service plugins to choose from.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Medusa on Linux">
        <p className="text-xs text-slate-400">Medusa ships preinstalled on Kali. On other Debian systems install with apt:</p>
        <CodeBlock title="terminal" lines={`sudo apt install medusa -y`} />
        <InfoBox title="Verify modules">
          Run medusa -d to list every supported protocol module. Confirm the exact module name for your lab service (ssh, ftp, http, smbnt) before building any command.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — SSH Audit" subtitle="Test lab SSH with a password list">
        <p className="text-xs text-slate-400">Audit SSH on your authorized lab host with one user and a small list:</p>
        <CodeBlock title="terminal" lines={`medusa -h 192.168.56.10 -u admin -P passwords.txt -M ssh -t 4`} />
        <InfoBox title="Threads and lists">
          The -t flag caps parallel threads at 4 — gentle for labs. The -P flag reads passwords from a file while -u fixes the username. Stop at the first agreed attempt count and check for lockouts between runs.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Combo File Attack" subtitle="Test user:pass pairs on FTP">
        <p className="text-xs text-slate-400">Audit a lab FTP service with combined credential pairs:</p>
        <CodeBlock title="terminal" lines={`medusa -h 192.168.56.10 -C combo.txt -M ftp -O ftp-hits.txt`} />
        <InfoBox title="Combo format and output">
          The -C flag reads host:user:password triples, one per line. The -O flag logs only successful hits to a separate file for clean lab evidence. Keep combo files tiny and lab-scoped.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Web Form Audit" subtitle="Test a lab login form over HTTP">
        <p className="text-xs text-slate-400">Audit a lab web login form with form parameters mapped:</p>
        <CodeBlock title="terminal" lines={`medusa -h 192.168.56.10 -u admin -P passwords.txt -M web-form -m FORM:"/login:user=^USER^&pass=^PASS^:F=failed"`} />
        <InfoBox title="Form mapping notes">
          The -m string maps the form path, field names with ^USER^ and ^PASS^ markers, and the F= failure string that signals a miss. Capture the exact failure text from one manual lab login first.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Medusa auditing a lab login">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/medusa/medusa_logo.jpg" alt="Medusa login brute-forcer logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Medusa run — valid lab credentials surfacing</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Medusa Audits Find" subtitle="Common discoveries from login audits">
        <FeatureGrid items={[
          { i: '🔑', t: 'Default Credentials', d: 'Vendor passwords unchanged on lab services.' },
          { i: '📋', t: 'Password Reuse', d: 'One weak password guarding many lab logins.' },
          { i: '🚫', t: 'Missing Lockouts', d: 'Services allowing unlimited guesses.' },
          { i: '🌐', t: 'Exposed Services', d: 'Login pages reachable that should be firewalled.' },
          { i: '📝', t: 'Policy Gaps', d: 'No complexity or rotation enforced on accounts.' },
          { i: '🎯', t: 'Priority Fixes', d: 'Which logins to key-protect first.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Accounts locking immediately"
            fix="Stop at once, confirm the lab lockout threshold, and shrink lists to a handful. Never continue spraying against lockout policies."
          />
          <IssueRow
            issue="Module name rejected"
            fix="List exact names with medusa -d — ssh versus smbnt versus web-form matter. Match the module to the service banner precisely."
          />
          <IssueRow
            issue="Web form never succeeds"
            fix="Re-capture the failure string F= from a manual bad login; apps change wording. Confirm field names and form path with browser DevTools on the lab page."
          />
          <IssueRow
            issue="All attempts fail fast"
            fix="Check lab connectivity and credentials file format (trailing spaces break matches). Verify the service is actually the protocol the module speaks."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Medusa Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-h &lt;target&gt;</div>
            <div className="text-xs text-slate-400">Target host IP or hostname to audit.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u / -U</div>
            <div className="text-xs text-slate-400">Single username or file of usernames.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-p / -P</div>
            <div className="text-xs text-slate-400">Single password or file of passwords.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-C &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Combo file with host:user:password lines.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-M &lt;module&gt;</div>
            <div className="text-xs text-slate-400">Protocol module: ssh, ftp, web-form, smbnt.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-t &lt;n&gt; / -O</div>
            <div className="text-xs text-slate-400">Thread count cap and hits-only output file.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Medusa Repository', 'https://github.com/jmk-foofus/medusa'],
            ['📖', 'Medusa Usage Documentation', 'https://github.com/jmk-foofus/medusa#usage'],
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
