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
  { q: "What is Frida?", a: "Frida is a free, open-source dynamic instrumentation toolkit. It injects a JS engine into running processes across Android, iOS, Windows, Linux, and macOS to hook functions, log arguments, and rewrite behavior live." },
  { q: "Is using Frida legal?", a: "Frida itself is legitimate open-source software. Instrumenting software without the owner written permission may break laws and terms. Hook only your own apps, open-source code, or signed targets — never payment, licensing, or DRM controls." },
  { q: "How do I install Frida?", a: "Run pipx install frida-tools on the analysis machine and push the matching frida-server binary to the lab device. Versions must match exactly." },
  { q: "How do I hook a lab app function?", a: "Attach with frida -U -n and a -l hook.js script using Java.perform or Interceptor.attach. Log entries first; rewrite returns only inside the lab scope." },
  { q: "What is objection?", a: "A high-level toolkit over Frida with ready commands: SSL unpinning, memory search, file access, and exploration — ideal for standard lab tasks before custom scripting." },
  { q: "Why do hooks change nothing?", a: "Wrong overload, wrong process, or defenses initializing first. Enumerate overloads, use spawn mode, and test on debuggable builds." },
  { q: "Can Frida defeat certificate pinning?", a: "In labs, standard unpinning scripts work on most apps. Pinned apps you do not own stay out of scope — resistance itself is a finding to report." },
  { q: "How does Frida pair with MobSF?", a: "MobSF captures traffic and flags issues; Frida opens runtime behavior behind them. Unpin with Frida, capture with MobSF, confirm to the line with JADX." }
]

const howItWorks = [
  "Install matched frida-tools and frida-server on analysis machine and lab device.",
  "List lab processes and attach to your authorized app.",
  "Hook target functions with small logging scripts first.",
  "Trace, unpin, and explore with frida-trace and objection inside scope.",
  "Document runtime findings with scripts and logs, then verify fixes."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Frida Dynamic Instrumentation — Live Function Hooking Guide',
      description: 'Step-by-step reference: hook lab app functions live with Frida scripts. Authorized apps only.',
      about: 'Frida runtime code injection toolkit',
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

export default function hackolution_frida() {
  return (
    <ToolLayout
      title="Frida Dynamic Instrumentation"
      desc="Step-by-step reference: hook lab app functions live with Frida scripts. Authorized apps only."
      icon="💉"
      iconBg="linear-gradient(135deg, rgba(179,102,255,0.18), rgba(239,68,68,0.08))"
      category="security"
      slug="hackolution/frida"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Frida Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for runtime hooking basics, bypassed checks, and the cert-pinning that resists them.
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
        Frida injects code into running processes and defeats client-side protections. Instrumenting any app or process without the owner explicit written permission is strictly prohibited and may violate laws and platform terms. Hook <b>only your own apps, open-source software, or targets covered by a signed authorization</b>, on devices you own or rooted lab devices. Never bypass payment, licensing, or DRM controls.
      </WarningBox>

      <Section id="overview" icon="💉" title="What is Frida?" subtitle="Surgical hooks into running code">
        <p>
          <b>Frida</b> is a free, open-source <b>dynamic instrumentation toolkit</b> by Ole-André Vadla Ravnås. It injects a JavaScript engine into <b>running processes on Android, iOS, Windows, Linux, and macOS</b> — letting you hook functions, read arguments, rewrite return values, and trace calls live.
        </p>
        <p>
          Authorized mobile testers use it to bypass lab certificate pinning, skip demo root detection, and log crypto inputs at runtime. Paired with objection for ready-made commands and MobSF for traffic capture, it turns black-box lab apps into open books.
        </p>
        <FeatureGrid items={[
          { i: '💉', t: 'Live Hooking', d: 'Intercept any function call while the app runs.' },
          { i: '📱💻', t: 'Every Platform', d: 'Android, iOS, Windows, Linux, and macOS targets.' },
          { i: '📜', t: 'JS Scripting', d: 'Small scripts observe and rewrite behavior fast.' },
          { i: '🔓', t: 'Pinning Bypasses', d: 'Ready-made scripts defeat lab cert pinning.' },
          { i: '🛰️', t: 'Trace & Stalk', d: 'Follow calls, arguments, and backtraces live.' },
          { i: '🧰', t: 'Objection Pairing', d: 'High-level commands over the Frida engine.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Frida on Linux">
        <p className="text-xs text-slate-400">Install the Python tools with pipx; the server goes on the lab device:</p>
        <CodeBlock title="terminal" lines={`pipx install frida-tools
# match the server version to your tools:
# https://github.com/frida/frida/releases`} />
        <InfoBox title="Version matching rule">
          The frida-server binary on the lab device must match the tools version exactly — mismatches fail silently. Check both with frida --version and frida-ps -U before scripting anything.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — List & Attach" subtitle="See processes and hook one">
        <p className="text-xs text-slate-400">List processes on your USB-connected lab device, then attach:</p>
        <CodeBlock title="terminal" lines={`frida-ps -U
frida -U -n com.lab.app`} />
        <InfoBox title="Attach modes">
          The -U flag targets USB devices; -n attaches by process name while -p uses PID. Spawn mode (-f) launches the app suspended so hooks land before its defenses initialize.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Run a Hook Script" subtitle="Log a function live">
        <p className="text-xs text-slate-400">Attach with a JavaScript hook that logs every call of a lab function:</p>
        <CodeBlock title="terminal" lines={`frida -U -n com.lab.app -l hook.js`} />
        <InfoBox title="Anatomy of hook.js">
          Scripts use Java.perform to wrap Java methods or Interceptor.attach for native functions. Log arguments on entry, stack traces on suspicion, and replace return values only where the lab scope allows.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Tracing & Objection" subtitle="Explore without writing scripts">
        <p className="text-xs text-slate-400">Trace whole modules or drive the app with objection commands:</p>
        <CodeBlock title="terminal" lines={`frida-trace -U -n com.lab.app -i open
objection -g com.lab.app explore`} />
        <InfoBox title="When each fits">
          frida-trace auto-logs matching native calls with zero scripting. Objection adds SSL-unpinning, memory search, and file commands — start there for standard lab tasks, drop to raw Frida for custom logic.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Frida hooks firing on a lab app">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/frida/frida_logo.jpg" alt="Frida dynamic instrumentation logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Frida session — hooked calls logged live</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Frida Hooks Find" subtitle="Common discoveries from runtime analysis">
        <FeatureGrid items={[
          { i: '🔓', t: 'Pinned Traffic Opened', d: 'Lab TLS interception working after unpinning.' },
          { i: '🔑', t: 'Runtime Secrets', d: 'Keys and tokens visible only in memory.' },
          { i: '🧪', t: 'Skippable Checks', d: 'Client-side validations proved bypassable.' },
          { i: '📡', t: 'Hidden API Calls', d: 'Endpoints invoked outside the visible UI.' },
          { i: '🔐', t: 'Crypto Inputs', d: 'Plaintexts logged before encryption runs.' },
          { i: '🧭', t: 'Full Call Maps', d: 'Execution flow charted for deeper review.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Server version mismatch"
            fix="Match frida-server to tools exactly — download the pair from one release. Verify with frida --version on both ends before anything else."
          />
          <IssueRow
            issue="App detects the hooks"
            fix="Lab anti-tamper may refuse to run. Test on debuggable builds of your own app first, and keep bypass work inside the signed scope."
          />
          <IssueRow
            issue="Device not listed"
            fix="Enable USB debugging, accept the host key on the device, and confirm adb devices shows it. Restart the server binary with root where the lab allows."
          />
          <IssueRow
            issue="Scripts attach but log nothing"
            fix="Confirm the function name and overload signature — hooked the wrong overload and nothing fires. Enumerate overloads first, then attach precisely."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Frida Commands & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">frida-ps -U</div>
            <div className="text-xs text-slate-400">List processes on the USB lab device.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-n / -p / -f</div>
            <div className="text-xs text-slate-400">Attach by name, PID, or spawn suspended.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-l hook.js</div>
            <div className="text-xs text-slate-400">Load a JavaScript hook script on attach.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">frida-trace -i</div>
            <div className="text-xs text-slate-400">Auto-trace native calls matching a pattern.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">objection explore</div>
            <div className="text-xs text-slate-400">High-level REPL over the Frida engine.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-U</div>
            <div className="text-xs text-slate-400">Target USB-connected devices.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Frida GitHub Repository', 'https://github.com/frida/frida'],
            ['📖', 'Frida Usage Documentation', 'https://frida.re/docs/home/'],
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
