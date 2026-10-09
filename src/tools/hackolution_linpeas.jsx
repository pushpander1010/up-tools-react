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
  { q: "What is LinPEAS?", a: "LinPEAS is an open-source privilege escalation auditing script for Linux, part of the PEASS-ng suite by Carlos Polop. You run it on a machine you are authorized to test and it automatically checks hundreds of common misconfigurations — SUID binaries, sudo rights, cron jobs, writable paths, leaked credentials, running processes, and network exposure — then highlights the findings most likely to allow privilege escalation." },
  { q: "What is WinPEAS?", a: "WinPEAS is the Windows companion to LinPEAS in the same PEASS-ng suite. It performs the equivalent audit on Windows: services with weak permissions, unquoted service paths, scheduled tasks, registry autoruns, stored credentials, and privilege-related system settings. Use the .bat version when executables are blocked and the .exe version for the fastest, most complete scan." },
  { q: "Is running LinPEAS legal?", a: "LinPEAS itself is a legitimate open-source auditing tool. Running it on any system without explicit written permission is illegal. Use it only on machines you own, lab VMs, capture-the-flag boxes, or systems covered by a signed penetration testing authorization." },
  { q: "How do I install LinPEAS?", a: "There is no installation: download the latest linpeas.sh from the PEASS-ng GitHub releases page with curl or wget, copy it to the target with scp or your file-transfer method of choice, then run chmod +x linpeas.sh. Always fetch a fresh copy from the official repository so you get the latest checks." },
  { q: "How do I run a LinPEAS scan?", a: "Run ./linpeas.sh -a for the full audit including every check, which is the recommended first pass. Results print color-coded in the terminal: red and yellow lines deserve attention first. Save the output with ./linpeas.sh -a | tee peas.txt so you can review it after the session." },
  { q: "Which LinPEAS flags matter most?", a: "The -a flag runs all checks and is the standard full audit. The -s flag runs a faster scan that skips the slowest checks. The -o flag limits output to operating-system information for a quick overview. The -N flag disables network checks when the target has no Internet access, and -D enables debug output when a check behaves unexpectedly." },
  { q: "What should I look for in LinPEAS output?", a: "Start with the red and yellow highlights: SUID binaries you can abuse, sudo entries that run without a password, writable cron scripts and PATH directories, passwords in bash history or config files, and interesting processes running as root. Each finding maps to a privilege escalation technique — confirm it manually before attempting anything." },
  { q: "How is LinPEAS different from manual enumeration?", a: "Manual enumeration means running dozens of individual commands and knowing what to look for. LinPEAS automates that checklist into one script that finishes in a couple of minutes and color-codes the results. It complements manual work rather than replacing it: use LinPEAS to find candidates fast, then verify each one by hand." },
]

const howItWorks = [
  "Download the latest linpeas.sh from the official PEASS-ng GitHub releases page with curl or wget.",
  "Transfer the script to your authorized lab machine with scp and make it executable with chmod +x linpeas.sh.",
  "Run the full audit with ./linpeas.sh -a and save the output using tee for later review.",
  "Work through the red and yellow highlights first: SUID binaries, sudo rights, cron jobs, writable paths, and leaked credentials.",
  "Verify each candidate manually, escalate in the lab, then fix every misconfiguration the scan exposed.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'LinPEAS Privilege Escalation Scanner — Linux & Windows PrivEsc Audit Guide',
      description: 'Step-by-step reference: audit Linux and Windows hosts for privilege escalation paths with LinPEAS and WinPEAS. Educational purposes only.',
      about: 'LinPEAS WinPEAS PEASS-ng privilege escalation auditing',
      educationalUse: 'Testing, education, and authorized assessments only',
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

export default function hackolution_linpeas() {
  return (
    <ToolLayout
      title="LinPEAS Privilege Escalation Scanner"
      desc="Step-by-step reference: audit Linux and Windows hosts for privilege escalation paths with LinPEAS and WinPEAS. Educational use only."
      icon="🔍"
      iconBg="linear-gradient(135deg, rgba(250,204,21,0.18), rgba(251,146,60,0.08))"
      category="security"
      slug="hackolution/linpeas"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the LinPEAS Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for privilege escalation basics, LinPEAS color-coded output, and the misconfigurations that hand over root.
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
        LinPEAS and WinPEAS inspect a system for privilege escalation paths. Running them on any machine without explicit written
        permission is strictly prohibited and illegal. Use them <b>only on systems you own, lab VMs, CTF boxes, or hosts covered
        by a signed penetration testing authorization</b>. Findings may include live credentials — handle output securely and delete
        it when the engagement ends.
      </WarningBox>

      <Section id="overview" icon="🔍" title="What is LinPEAS?" subtitle="Automated privilege escalation auditing for Linux and Windows">
        <p>
          <b>LinPEAS</b> is an open-source privilege escalation auditing script for <b>Linux</b>, part of the <b>PEASS-ng</b> suite
          by Carlos Polop. After gaining an initial foothold on an authorized machine, you run one script and it automatically
          checks <b>hundreds of common misconfigurations</b> that lead from a low-privilege shell to root.
        </p>
        <p>
          Its sibling <b>WinPEAS</b> does the same job on Windows. Together they are the standard first step of post-exploitation
          enumeration: LinPEAS finds the candidates in minutes, then you verify each one by hand and escalate.
        </p>
        <FeatureGrid items={[
          { i: '⬆️', t: 'Hundreds of Auto Checks', d: 'SUID, sudo, cron, services, registry, and scheduled tasks in one run.' },
          { i: '🎨', t: 'Color-Coded Output', d: 'Red and yellow highlights surface the most promising findings first.' },
          { i: '🔑', t: 'Credential Hunting', d: 'Searches bash history, config files, and memory for leaked passwords and keys.' },
          { i: '📁', t: 'Writable Path Detection', d: 'Flags writable PATH directories, cron scripts, and service binaries.' },
          { i: '🪟', t: 'Windows Twin Included', d: 'WinPEAS mirrors the audit on Windows with .exe and .bat builds.' },
          { i: '📜', t: 'Single-File Script', d: 'No installation — download, chmod +x, and run on the target.' },
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Download the latest script from GitHub">
        <p className="text-xs text-slate-400">Fetch the latest linpeas.sh from the official PEASS-ng releases:</p>
        <CodeBlock title="terminal" lines={`curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh -o linpeas.sh\nchmod +x linpeas.sh`} />
        <p className="text-xs text-slate-400 mt-3">For Windows targets, grab the WinPEAS build instead:</p>
        <CodeBlock title="terminal" lines={`curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/winPEASx64.exe -o winpeas.exe`} />
        <InfoBox title="Always use a fresh copy">
          PEASS-ng adds new checks constantly. Download the latest release for every engagement rather than reusing an old copy,
          and verify the download comes from the official carlospolop/PEASS-ng repository. Transfer it to the target with scp,
          a web server, or your established file-transfer method.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Full Linux Audit" subtitle="Run every check and save the output">
        <p className="text-xs text-slate-400">Run the complete audit on your authorized Linux lab machine and save results to a file:</p>
        <CodeBlock title="terminal" lines={`./linpeas.sh -a | tee peas.txt`} />
        <InfoBox title="Reading the results">
          The -a flag runs all checks, including the slowest ones. Red lines are high-probability privilege escalation vectors,
          yellow lines are worth investigating, and green lines are informational. The tee command shows output live while also
          writing peas.txt for review after the session.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Fast & Targeted Scans" subtitle="Speed up or narrow the audit when time matters">
        <p className="text-xs text-slate-400">Run a faster scan that skips the slowest checks, or limit output to OS information:</p>
        <CodeBlock title="terminal" lines={`./linpeas.sh -s\n./linpeas.sh -o`} />
        <InfoBox title="When to use each mode">
          Use -s when the target is slow or you need a quick first look — it skips checks that take minutes. Use -o for a fast
          operating-system overview before the full run. Add -N on hosts without Internet access so network checks are skipped
          instead of timing out.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Windows Audit with WinPEAS" subtitle="Mirror the same workflow on Windows targets">
        <p className="text-xs text-slate-400">Run the Windows equivalent on your authorized lab machine:</p>
        <CodeBlock title="terminal" lines={`winpeas.exe\nrem Fallback when executables are blocked:\nwinpeas.bat`} />
        <InfoBox title="What WinPEAS finds">
          WinPEAS highlights unquoted service paths, services with weak permissions, always-install-elevated MSI settings,
          stored credentials in the registry and Credential Manager, and interesting scheduled tasks. Confirm each finding
          manually — for example with sc qc servicename — before attempting escalation.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="LinPEAS output in the terminal">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/linpeas/linpeas_logo.jpg" alt="LinPEAS privilege escalation scanner logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">LinPEAS color-coded audit output — red and yellow lines first</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What LinPEAS Finds" subtitle="Common discoveries from privilege escalation audits">
        <FeatureGrid items={[
          { i: '🔑', t: 'SUID & Sudo Abuse', d: 'Passwordless sudo entries and SUID binaries with known escalation paths.' },
          { i: '⏰', t: 'Cron & Task Abuse', d: 'Writable cron scripts and scheduled tasks running with high privileges.' },
          { i: '📁', t: 'Writable System Paths', d: 'PATH hijacking, writable service binaries, and weak directory permissions.' },
          { i: '🔓', t: 'Leaked Credentials', d: 'Passwords in history files, configs, environment, and process arguments.' },
          { i: '⚙️', t: 'Weak Services', d: 'Unquoted paths, insecure permissions, and autoruns ripe for escalation.' },
          { i: '🌐', t: 'Local Network Exposure', d: 'Internal ports and services reachable from the compromised host.' },
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to close what LinPEAS finds">
        <div className="space-y-3">
          <IssueRow
            issue="Excessive SUID binaries and passwordless sudo"
            fix="Remove the SUID bit where it is not needed (chmod u-s binary) and restrict sudo with least privilege — never NOPASSWD on editors, pagers, or scripting languages."
          />
          <IssueRow
            issue="Writable cron scripts and service files"
            fix="Lock ownership to root with chmod 755 on cron scripts and service binaries, and audit scheduled tasks for paths standard users can write to."
          />
          <IssueRow
            issue="Credentials in history and config files"
            fix="Purge secrets from shell history and configs, move them to a vault or environment injected at runtime, and rotate anything already exposed."
          />
          <IssueRow
            issue="Unquoted service paths and weak Windows permissions"
            fix="Quote all service binary paths, tighten ACLs on services and installers, and disable AlwaysInstallElevated unless strictly required."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key LinPEAS Flags &amp; Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-a</div>
            <div className="text-xs text-slate-400">Run all checks, including the slowest ones. The recommended full audit.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-s</div>
            <div className="text-xs text-slate-400">Superfast mode: skips the slowest checks for a quick first look.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o</div>
            <div className="text-xs text-slate-400">OS information only: a fast overview before the full run.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-N</div>
            <div className="text-xs text-slate-400">Skip network checks on hosts without Internet access.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-D</div>
            <div className="text-xs text-slate-400">Debug output for troubleshooting unexpected check behavior.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">| tee peas.txt</div>
            <div className="text-xs text-slate-400">Save color-coded output to a file while watching it live.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official PEASS-ng GitHub Repository', 'https://github.com/carlospolop/PEASS-ng'],
            ['📖', 'LinPEAS Usage Documentation', 'https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS'],
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
    </ToolLayout>
  )
}
