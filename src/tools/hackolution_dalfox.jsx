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
  { q: "What is DalFox?", a: "DalFox is a free, open-source XSS scanner in Go by Hahwul. It mines parameters, tests reflections with tuned payloads, and confirms findings with working proof-of-concept exploits across URL, file, and pipe modes." },
  { q: "Is using DalFox legal?", a: "DalFox itself is legitimate open-source software. Firing XSS payloads at any site without explicit written permission is illegal. Use it only on lab apps like DVWA or OWASP Juice Shop, or targets covered by a signed authorization." },
  { q: "How do I install DalFox?", a: "Run go install github.com/hahwul/dalfox/v2@latest with Go installed, or pull docker hahwul/dalfox:latest. Verify with dalfox --help before scanning." },
  { q: "How do I scan a single page?", a: "Run dalfox url against a page of your authorized lab app. DalFox mines parameters and prints confirmed findings with PoC URLs — verify each one by loading it in the lab browser." },
  { q: "How do I scan many URLs?", a: "Put them in a file and run dalfox file urls.txt --worker 10 --output findings.txt, or pipe crawler output with cat urls.txt | dalfox pipe. Build URL lists from your own lab crawls only." },
  { q: "What is parameter mining?", a: "Parameter mining discovers hidden and unlinked inputs — parameters the page accepts but never links to. DalFox tests these alongside visible ones, which is where many real XSS flaws hide." },
  { q: "How does blind XSS mode work?", a: "With --blind and a callback server you control, DalFox injects payloads that phone home when they execute. This catches stored XSS that fires in another session. Use unique tokens per run and authorized targets only." },
  { q: "Why no findings on my test page?", a: "First confirm the page reflects input with a canary string. Then check DalFox is testing the right parameter and context, and retry without --skip-discovery so mining runs fully." }
]

const howItWorks = [
  "Install DalFox with go install or Docker and verify with dalfox --help.",
  "Scan one lab page with dalfox url and verify each PoC in the lab browser.",
  "Sweep URL lists with dalfox file urls.txt --worker 10 --output findings.txt.",
  "Chain crawler output via pipe mode and hunt stored flaws with --blind callbacks on authorized targets.",
  "Record parameter, context, and PoC for every finding, then fix with output encoding and Content Security Policy."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'DalFox XSS Scanner — Parameter Mining & Reflected XSS Proof Guide',
      description: 'Step-by-step reference: find XSS flaws fast with DalFox parameter mining and PoC proofs. Lab use only.',
      about: 'DalFox cross-site scripting scanner',
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

export default function hackolution_dalfox() {
  return (
    <ToolLayout
      title="DalFox XSS Scanner"
      desc="Step-by-step reference: find XSS flaws fast with DalFox parameter mining and PoC proofs. Lab use only."
      icon="🦊"
      iconBg="linear-gradient(135deg, rgba(251,146,60,0.18), rgba(239,68,68,0.08))"
      category="security"
      slug="hackolution/dalfox"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the DalFox Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for XSS basics, parameter mining, and how DalFox proves a finding with a working PoC.
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
        DalFox fires real cross-site scripting payloads at web applications. Probing any site without explicit written permission is strictly prohibited and illegal. Use DalFox <b>only on lab applications (DVWA, OWASP Juice Shop, bWAPP) or targets covered by a signed authorization</b>. Never point it at live production sites.
      </WarningBox>

      <Section id="overview" icon="🦊" title="What is DalFox?" subtitle="Fast XSS scanning with parameter mining, by Hahwul">
        <p>
          <b>DalFox</b> is a free, open-source <b>cross-site scripting (XSS) scanner</b> written in <b>Go</b> by Hahwul. Point it at a URL and it discovers injectable parameters, tests them with tuned payloads, and confirms each finding with a <b>working proof-of-concept</b> — not just a guess.
        </p>
        <p>
          Its standout stage is parameter mining: DalFox finds hidden and unlinked parameters other scanners miss, then verifies reflection with multiple encoding tricks. Modes for single URLs, files of URLs, and piped input make it equally at home in quick checks and full pipeline scans.
        </p>
        <FeatureGrid items={[
          { i: '🦊', t: 'Proven PoCs, Not Guesses', d: 'Each finding ships with a working proof-of-concept payload.' },
          { i: '⛏️', t: 'Parameter Mining', d: 'Discovers hidden and unlinked parameters to test.' },
          { i: '🔤', t: 'Encoding Evasion Tests', d: 'Tries reflection bypasses across contexts and encodings.' },
          { i: '📥', t: 'URL, File & Pipe Modes', d: 'Scan one URL, a list file, or piped crawler output.' },
          { i: '📞', t: 'Blind XSS Callbacks', d: 'Out-of-band callback support for stored blind XSS.' },
          { i: '📊', t: 'JSON Output', d: 'Machine-readable findings for pipelines and reports.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install DalFox on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install with Go or Docker:</p>
        <CodeBlock title="terminal" lines={`go install github.com/hahwul/dalfox/v2@latest
# or with Docker:
# docker pull hahwul/dalfox:latest`} />
        <InfoBox title="Verify the install">
          Run dalfox --help after installing and confirm the Go binary directory is on your PATH. Docker users can run docker run --rm hahwul/dalfox:latest --help. Keep DalFox updated — payload sets improve with every release.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Single URL Scan" subtitle="Test one lab page end to end">
        <p className="text-xs text-slate-400">Scan a single page of your authorized lab application:</p>
        <CodeBlock title="terminal" lines={`dalfox url http://localhost:3000/search?q=test`} />
        <InfoBox title="Reading the results">
          DalFox mines parameters, tests reflections, and prints confirmed findings with PoC URLs marked clearly. Copy a PoC into your lab browser to verify it fires, then record the parameter, context, and payload for your report.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Bulk File Scan" subtitle="Sweep a list of collected URLs">
        <p className="text-xs text-slate-400">Scan every URL in a file from your authorized crawl:</p>
        <CodeBlock title="terminal" lines={`dalfox file urls.txt --worker 10 --output findings.txt`} />
        <InfoBox title="Workers and output notes">
          The --worker flag sets parallel scans — 10 is a safe lab default. The --output flag saves findings to a file for review. Build urls.txt from your own crawler output or tools like Katana and Gau against lab targets only.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Piped & Blind XSS" subtitle="Chain tools and catch stored payloads">
        <p className="text-xs text-slate-400">Pipe crawler output into DalFox, or hunt blind XSS with a callback:</p>
        <CodeBlock title="terminal" lines={`cat urls.txt | dalfox pipe --format json
# blind XSS with your callback server:
# dalfox url http://target/profile --blind https://callback.example/x`} />
        <InfoBox title="Pipes and blind callbacks">
          Pipe mode chains reconnaissance tools directly into scanning. Blind mode needs a callback server you control — use it only on authorized targets, since stored payloads may fire later in another user session.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="DalFox confirming an XSS finding">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/dalfox/dalfox_logo.jpg" alt="DalFox XSS scanner logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">DalFox verified finding with proof-of-concept payload</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What DalFox Scans Find" subtitle="Common discoveries from XSS sweeps">
        <FeatureGrid items={[
          { i: '💉', t: 'Reflected XSS', d: 'Payloads reflected immediately in search, error, and redirect pages.' },
          { i: '💾', t: 'Stored XSS', d: 'Payloads saved server-side and fired on later page views.' },
          { i: '🙈', t: 'Blind XSS', d: 'Out-of-band callbacks proving payloads fired elsewhere.' },
          { i: '⛏️', t: 'Hidden Parameters', d: 'Unlinked inputs that widen every downstream test.' },
          { i: '🔤', t: 'Weak Filters', d: 'Naive blocklists bypassed by encoding and context tricks.' },
          { i: '📋', t: 'Report-Ready PoCs', d: 'Verified payloads with parameter, context, and evidence.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="No findings on a test page"
            fix="Confirm the lab page actually reflects input — try a canary string first. Add --skip-discovery only after a normal run, and check the parameter is in the query or body DalFox tests."
          />
          <IssueRow
            issue="Too many false positives"
            fix="Verify each PoC by loading it in the lab browser. Tune with --custom-payload and narrow scope to one feature at a time instead of whole-site sweeps."
          />
          <IssueRow
            issue="Scan is slow on large lists"
            fix="Raise --worker gradually and split huge files into chunks. Keep timeouts sane with --timeout so one dead host cannot stall the queue."
          />
          <IssueRow
            issue="Blind XSS callback never fires"
            fix="Confirm your callback server is reachable from the target network, use a unique token per run, and wait — stored payloads may fire minutes later in another session."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key DalFox Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">url / file / pipe</div>
            <div className="text-xs text-slate-400">Scan modes: one URL, a file of URLs, or piped stdin input.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--worker &lt;n&gt;</div>
            <div className="text-xs text-slate-400">Parallel scan workers. Start at 10 in the lab.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--skip-discovery</div>
            <div className="text-xs text-slate-400">Skip parameter mining and test known parameters directly.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--custom-payload &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Test with your own payload list.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--blind &lt;callback&gt;</div>
            <div className="text-xs text-slate-400">Out-of-band callback URL for stored blind XSS.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--output / --format json</div>
            <div className="text-xs text-slate-400">Save findings to a file, optionally as JSON.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official DalFox GitHub Repository', 'https://github.com/hahwul/dalfox'],
            ['📖', 'DalFox Usage Documentation', 'https://github.com/hahwul/dalfox/wiki'],
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
