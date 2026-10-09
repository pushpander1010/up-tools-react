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
  { q: "What is Arjun?", a: "Arjun is a free, open-source HTTP parameter discovery tool in Python by Somdev Sangwan. It brute-forces GET and POST parameter names from a large built-in list with smart false-positive filtering." },
  { q: "Is using Arjun legal?", a: "Arjun itself is legitimate open-source software. Probing sites without explicit written permission is illegal. Run it only on lab apps or signed targets with modest threads." },
  { q: "How do I install Arjun?", a: "Run pipx install arjun on Python 3.8 or newer. Verify with arjun -h — no keys needed." },
  { q: "How do I find hidden parameters?", a: "Run arjun -u against the authorized URL. Valid hits print with reflection detail — record each for DalFox and SQLMap follow-ups." },
  { q: "How do POST and JSON modes differ?", a: "Default mines query strings; --post tests form bodies and JSON mode probes API payloads. Cover all three where the endpoint accepts them." },
  { q: "Why so many false positives?", a: "Unstable lab responses fool baselines. Re-run with --stable and lower threads until the app answers consistently." },
  { q: "How does Arjun pair with DalFox?", a: "Arjun finds the names, DalFox tests them for XSS. Pipe JSON outputs between the two for a clean discovery-to-exploit chain." },
  { q: "How do developers prevent this?", a: "Allowlist expected parameters, ignore unknown inputs server-side, and validate every value — hidden names must never mean trusted inputs." }
]

const howItWorks = [
  "Install Arjun and verify options with arjun -h.",
  "Mine your authorized lab URL for GET parameters first.",
  "Cover POST and JSON methods on every input-accepting endpoint.",
  "Stabilize and export JSON for DalFox and manual review.",
  "Test each finding inside scope, then enforce allowlist validation."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Arjun Parameter Finder — Hidden HTTP Parameter Guide',
      description: 'Step-by-step reference: discover hidden HTTP parameters with Arjun. Lab use only.',
      about: 'Arjun HTTP parameter discovery',
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

export default function hackolution_arjun() {
  return (
    <ToolLayout
      title="Arjun Parameter Finder"
      desc="Step-by-step reference: discover hidden HTTP parameters with Arjun. Lab use only."
      icon="🎯"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(27,255,110,0.08))"
      category="security"
      slug="hackolution/arjun"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Arjun Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for parameter discovery, fuzzed inputs, and the validation that blocks injection.
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
        Arjun sends thousands of probing requests to web applications. Discovering parameters on any site without explicit written permission is strictly prohibited and illegal. Run Arjun <b>only against lab applications or targets covered by a signed authorization</b>, with modest threads on fragile apps. Feed findings only into authorized follow-up testing.
      </WarningBox>

      <Section id="overview" icon="🎯" title="What is Arjun?" subtitle="Hidden parameter discovery for web testers">
        <p>
          <b>Arjun</b> is a free, open-source <b>HTTP parameter discovery tool</b> in Python by Somdev Sangwan. Give it a lab URL and it brute-forces <b>GET and POST parameter names</b> from a large built-in list — finding inputs like admin, debug, and redirect that the visible forms never show.
        </p>
        <p>
          Hidden parameters are where injection lives: a discovered debug flag becomes an XSS sink, an undocumented redirect becomes open-redirect, a quiet api parameter becomes IDOR. Arjun maps these names so DalFox, SQLMap, and manual testing strike precisely.
        </p>
        <FeatureGrid items={[
          { i: '🔍', t: 'GET & POST Mining', d: 'Discovers parameters in both request types.' },
          { i: '📚', t: 'Huge Built-in List', d: 'Thousands of real-world parameter names included.' },
          { i: '🧠', t: 'Smart Filtering', d: 'Baseline comparison removes false positives.' },
          { i: '🧵', t: 'Threaded Speed', d: 'Concurrent probes finish pages in seconds.' },
          { i: '📄', t: 'JSON Output', d: 'Findings exported for pipelines and reports.' },
          { i: '🔗', t: 'Stable & Proxy Ready', d: 'Retries plus Burp chaining for manual review.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Arjun on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install with pipx (recommended):</p>
        <CodeBlock title="terminal" lines={`pipx install arjun`} />
        <InfoBox title="Verify quickly">
          Run arjun -h after installing to see methods and stability options. No API keys needed — Arjun works from its bundled parameter list out of the box.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic Discovery" subtitle="Mine GET params on a lab page">
        <p className="text-xs text-slate-400">Discover hidden GET parameters on your authorized lab URL:</p>
        <CodeBlock title="terminal" lines={`arjun -u http://localhost:3000/search?q=test`} />
        <InfoBox title="Reading the hits">
          Valid parameters print with their reflections and response deltas. Each hit is a new input to test — record name, method, and reflection context for the injection phase.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — POST & Methods" subtitle="Cover forms and JSON endpoints">
        <p className="text-xs text-slate-400">Mine POST parameters and JSON bodies on lab endpoints:</p>
        <CodeBlock title="terminal" lines={`arjun -u http://target.lab/api --post -m POST,JSON`} />
        <InfoBox title="Method coverage">
          The --post flag tests form bodies while JSON mode probes API payloads. Cover every method the endpoint accepts — hidden inputs differ per method on real apps.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Stable & Chained" subtitle="Clean results through your proxy">
        <p className="text-xs text-slate-400">Stabilize responses and chain through Burp for review:</p>
        <CodeBlock title="terminal" lines={`arjun -u http://target.lab/page --stable -oT params.json -o proxies.json`} />
        <InfoBox title="Stability and evidence">
          The --stable flag re-verifies hits against flaky lab responses. JSON outputs feed DalFox directly, and proxy chaining lets you eyeball every interesting probe in Burp.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Arjun surfacing hidden parameters">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/arjun/arjun_logo.jpg" alt="Arjun parameter finder logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Arjun results — hidden inputs ready for injection testing</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Arjun Discovery Finds" subtitle="Common discoveries from parameter mining">
        <FeatureGrid items={[
          { i: '🎛️', t: 'Debug Flags', d: 'debug and test switches enabling verbose behavior.' },
          { i: '🔁', t: 'Redirect Inputs', d: 'Undocumented next and url params for redirect tests.' },
          { i: '🔑', t: 'Privilege Params', d: 'role and admin flags inviting access tests.' },
          { i: '📡', t: 'API Inputs', d: 'Hidden JSON fields the docs never mention.' },
          { i: '💉', t: 'Injection Sinks', d: 'Reflected params feeding XSS and SQLi lists.' },
          { i: '📋', t: 'Test Inventory', d: 'A precise input map for the whole assessment.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="No parameters found"
            fix="Confirm the page accepts input at all — static pages yield nothing. Retry with --post and JSON modes, and check WAF blocks are not eating probes."
          />
          <IssueRow
            issue="Flood of false positives"
            fix="Raise stability with --stable and re-run. Flaky lab apps need calmer threading — lower -t until baselines settle."
          />
          <IssueRow
            issue="WAF blocks mid-run"
            fix="Slow down, confirm the test window, and continue inside authorized limits. Fingerprint the WAF first so pacing matches its rules."
          />
          <IssueRow
            issue="JSON endpoints ignored"
            fix="Set the method explicitly — form-mode probes miss JSON parsers entirely. Match content types to what the endpoint actually consumes."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Arjun Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u &lt;url&gt;</div>
            <div className="text-xs text-slate-400">Target URL where discovery starts.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--post / -m</div>
            <div className="text-xs text-slate-400">Probe POST bodies and chosen HTTP methods.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-t &lt;n&gt;</div>
            <div className="text-xs text-slate-400">Thread count for probe concurrency.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--stable</div>
            <div className="text-xs text-slate-400">Re-verify hits against flaky responses.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-oT / -o</div>
            <div className="text-xs text-slate-400">JSON outputs for pipelines and evidence.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--proxy</div>
            <div className="text-xs text-slate-400">Chain probes through Burp for review.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Arjun GitHub Repository', 'https://github.com/s0md3v/Arjun'],
            ['📖', 'Arjun Usage Documentation', 'https://github.com/s0md3v/Arjun#usage'],
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
