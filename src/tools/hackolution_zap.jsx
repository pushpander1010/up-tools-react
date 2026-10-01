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
  { q: "What is ZAP?", a: "ZAP (Zed Attack Proxy) is a free, open-source web application security scanner maintained by the OWASP project. It works as an intercepting proxy and automated scanner: a spider and ajax spider map the attack surface, a passive scan reviews all captured traffic, and an active scan sends deliberate attack payloads to find vulnerabilities such as SQL injection, cross-site scripting, and insecure headers." },
  { q: "Is using ZAP legal?", a: "Yes, ZAP is a legitimate open-source security audit tool used by professionals worldwide. However, running ZAP against any web application without explicit written permission is illegal. Always test only applications you own or are authorized to assess, such as lab environments and in-scope staging systems." },
  { q: "How do I install ZAP on Kali Linux or Ubuntu?", a: "On Kali and Ubuntu, install directly with `sudo apt install zaproxy -y`, or pull the official Docker image with `docker pull zaproxy/zaproxy:stable`. Launch the desktop GUI with `zap.sh` (append `&` to run it in the background)." },
  { q: "How do I scan a website with ZAP?", a: "Run a headless quick scan with `zap.sh -cmd -quickurl http://example.com -quickout zap_report.html`, start the API daemon with `zap.sh -daemon -port 8090`, or run the Docker baseline scan with `docker run zaproxy/zaproxy:stable zap-baseline.py -t https://example.com`. In the desktop GUI, enter the target URL in the Quick Start tab." },
  { q: "What are the key features of ZAP?", a: "ZAP includes an intercepting proxy, the traditional spider and ajax spider for site mapping, passive and active scanning rulesets, the HUD in-browser overlay, authentication and context support for logged-in scans, and a full JSON and HTML REST API for CI/CD automation." },
  { q: "How do defenders fix ZAP findings?", a: "Fix findings at the code and configuration layers: use parameterized queries to stop SQL injection, apply context-aware output encoding and a strict Content-Security-Policy to stop XSS, add security headers (HSTS, X-Frame-Options, X-Content-Type-Options), enable SameSite cookies and CSRF tokens, then rescan with ZAP until the report is clean." },
]

const howItWorks = [
  'Install ZAP on Kali or Ubuntu using sudo apt install zaproxy -y, or pull the Docker image zaproxy/zaproxy:stable.',
  'Launch the desktop GUI with zap.sh, or start the headless daemon with zap.sh -daemon -port 8090 -config api.key=changeme123.',
  'Map the application with the spider and ajax spider, browsing every page and API endpoint reachable from your authorized lab target.',
  'Run the passive scan on all captured traffic, then an active scan on discovered endpoints to trigger the injection and scripting rulesets.',
  'Read the ZAP report, fix the confirmed findings in code and configuration, then rescan until the report is clean.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'ZAP Web App Scanner — OWASP DAST Proxy, Spider, Passive and Active Scans Guide',
      description: 'Step-by-step reference: use OWASP ZAP web app scanner for spider, passive and active scans plus API automation. Educational purposes only.',
      about: 'OWASP ZED Attack Proxy web application security scanner',
      educationalUse: 'Testing, education, and authorized reconnaissance only',
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

export default function hackolution_Zap() {
  return (
    <ToolLayout
      title="ZAP Web App Scanner"
      desc="Step-by-step reference: use OWASP ZAP web app scanner for spider, passive and active scans plus API automation. Educational purposes only."
      icon="🕷️"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/zap"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the ZAP Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              ZAP stands for Zed Attack Proxy, the free OWASP web application scanner. Check out the HACKOLUTION reel for rapid insights into spidering, passive versus active scans, and fixing web app findings.
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
        ZAP proxies web traffic and actively attacks applications with injection and scripting payloads. Use it <b>only against web applications you own or have explicit written permission to assess</b>.
        Unauthorized scanning of third-party applications is strictly prohibited and illegal. This guide is provided for <b>educational and authorized security testing only</b>.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is ZAP?" subtitle="Free OWASP dynamic application security testing proxy">
        <p>
          <b>ZAP</b> (Zed Attack Proxy) is a free, open-source web application security scanner maintained by the <b>OWASP</b> project.
          It sits between your browser and the target application as an <b>intercepting proxy</b>, capturing every request and response so the tool can map the attack surface and test it for vulnerabilities.
        </p>
        <p>
          ZAP scans in two phases. The <b>spider and ajax spider</b> crawl the application to discover pages, forms, and API endpoints.
          A <b>passive scan</b> then reviews all captured traffic without sending attack payloads, flagging issues such as missing headers and weak cookie flags.
          An <b>active scan</b> deliberately sends attack payloads (SQL injection, cross-site scripting, and more) to confirm exploitable flaws.
          The <b>HUD</b> overlays live security data in the browser, and a full <b>REST API</b> lets you automate every scan step in CI/CD pipelines.
        </p>
        <FeatureGrid items={[
          { i: '🤖', t: 'Spider & Ajax Spider', d: 'Crawl traditional pages and JavaScript-heavy apps to map the full attack surface.' },
          { i: '🛡️', t: 'Passive + Active Rulesets', d: 'Traffic review without payloads, then deliberate injection testing to confirm flaws.' },
          { i: '🎯', t: 'HUD & REST API', d: 'In-browser HUD overlay plus a JSON API for fully automated CI/CD scanning.' },
          { i: '📊', t: 'Multi-Format Reporting', d: 'Export findings directly to HTML, JSON, XML, or Markdown reports.' },
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install ZAP on Kali, Ubuntu, or Docker">
        <p className="text-xs text-slate-400">On Debian, Ubuntu, Kali Linux, or Parrot OS:</p>
        <CodeBlock title="terminal" lines={`sudo apt install zaproxy -y`} />
        <p className="text-xs text-slate-400 mt-3">Pull the official Docker image (used for baseline scans later):</p>
        <CodeBlock title="terminal" lines={`docker pull zaproxy/zaproxy:stable`} />
        <p className="text-xs text-slate-400 mt-3">Launch the desktop GUI:</p>
        <CodeBlock title="terminal" lines={`zap.sh &`} />
        <InfoBox title="Git Repository Alternative">
          You can also clone the repository directly from GitHub: <span className="font-mono">git clone https://github.com/zaproxy/zaproxy</span> and follow the build instructions to run ZAP from source.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Headless Quick Scan" subtitle="Spider, passive scan, and limited active scan in one command">
        <p className="text-xs text-slate-400">Run a full quick scan against your authorized target without opening the GUI:</p>
        <CodeBlock title="terminal" lines={`zap.sh -cmd -quickurl http://example.com -quickout zap_report.html`} />
        <p className="text-xs text-slate-400 mt-2">Add live progress output while the scan runs:</p>
        <CodeBlock title="terminal" lines={`zap.sh -cmd -quickurl http://example.com -quickout zap_report.html -quickprogress`} />
        <InfoBox title="How it works">
          The quick scan spiders the target, runs the passive scan rules over all traffic, then executes the standard active scan ruleset.
          The report format follows the file extension of <span className="font-mono">-quickout</span>: use <span className="font-mono">.html</span>, <span className="font-mono">.json</span>, <span className="font-mono">.xml</span>, or <span className="font-mono">.md</span>.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Daemon Mode &amp; REST API" subtitle="Drive ZAP programmatically for CI/CD automation">
        <p className="text-xs text-slate-400">Start ZAP as a background daemon with an API key on a custom port:</p>
        <CodeBlock title="terminal" lines={`zap.sh -daemon -port 8090 -config api.key=changeme123`} />
        <p className="text-xs text-slate-400 mt-2">Trigger a spider scan, then an active scan, through the REST API:</p>
        <CodeBlock title="terminal" lines={`curl "http://localhost:8090/JSON/spider/action/scan/?url=http://example.com&apikey=changeme123"\ncurl "http://localhost:8090/JSON/ascan/action/scan/?url=http://example.com&apikey=changeme123"`} />
        <p className="text-xs text-slate-400 mt-2">Fetch the HTML report once the scans finish:</p>
        <CodeBlock title="terminal" lines={`curl "http://localhost:8090/OTHER/core/other/htmlreport/?apikey=changeme123" -o zap_report.html`} />
        <InfoBox title="API Key Safety">
          Keep the <span className="font-mono">api.key</span> secret and never expose the daemon port on public interfaces. Set <span className="font-mono">api.disablekey=true</span> only inside isolated lab networks where the port cannot be reached from outside.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Docker Baseline Scan" subtitle="Passive-only baseline scan for staging checks">
        <p className="text-xs text-slate-400">Run the passive baseline scan inside a disposable container:</p>
        <CodeBlock title="terminal" lines={`docker run zaproxy/zaproxy:stable zap-baseline.py -t https://example.com`} />
        <p className="text-xs text-slate-400 mt-2">Mount the current directory and write the report to a file:</p>
        <CodeBlock title="terminal" lines={`docker run --rm -v "$(pwd)":/zap/wrk zaproxy/zaproxy:stable zap-baseline.py -t https://example.com -r zap_report.html`} />
        <InfoBox title="Baseline vs Full Scan">
          <span className="font-mono">zap-baseline.py</span> is passive only, so it is safe for staging environments that cannot tolerate active attack traffic. For active testing, use <span className="font-mono">zap-full-scan.py</span> or <span className="font-mono">zap-api-scan.py</span> from the same image.
        </InfoBox>
      </Section>

      <Section id="checks" icon="🔍" title="What ZAP Finds" subtitle="Common vulnerabilities reported by ZAP scans">
        <FeatureGrid items={[
          { i: '💉', t: 'SQL Injection', d: 'Detects injectable URL parameters, form fields, and headers that alter database queries.' },
          { i: '📜', t: 'Cross-Site Scripting', d: 'Flags reflected and stored XSS where user input is echoed back without encoding.' },
          { i: '🛡️', t: 'Security Header Issues', d: 'Reports missing CSP, HSTS, X-Frame-Options, and X-Content-Type-Options headers.' },
          { i: '🔑', t: 'CSRF & Session Issues', d: 'Finds state-changing requests without CSRF tokens and cookies missing SameSite flags.' },
          { i: '🗝️', t: 'Path Traversal & Tampering', d: 'Tests parameters for directory traversal and unsafe server-side include patterns.' },
          { i: '🧩', t: 'Outdated or Leaky Components', d: 'Flags verbose error pages, server banner leaks, and outdated library versions.' },
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Fixing ZAP Findings for Site Owners" subtitle="Remediation steps to resolve reported vulnerabilities">
        <div className="space-y-3">
          <IssueRow
            issue="SQL injection reported in URL parameters or form fields"
            fix="Use parameterized queries (prepared statements) or a parameterized ORM for all database access, and validate input against strict allow-lists. A WAF can add a backstop layer but does not replace the code fix."
          />
          <IssueRow
            issue="Reflected or stored XSS reported in application responses"
            fix="Apply context-aware output encoding (HTML, JavaScript, URL, and attribute contexts) and ship a strict Content-Security-Policy that blocks inline scripts."
          />
          <IssueRow
            issue="Missing security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)"
            fix="Set Strict-Transport-Security, Content-Security-Policy, X-Frame-Options: SAMEORIGIN, and X-Content-Type-Options: nosniff on every server response."
          />
          <IssueRow
            issue="Cookies without SameSite or Secure flags, and no CSRF tokens"
            fix="Mark session cookies with SameSite=Lax or SameSite=Strict plus the Secure flag, and require anti-CSRF tokens on every state-changing form and API call."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key ZAP Flags &amp; Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-cmd</div>
            <div className="text-xs text-slate-400">Command line mode: run the scan without opening the desktop GUI.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-quickurl &lt;url&gt;</div>
            <div className="text-xs text-slate-400">Target URL for the automated quick scan.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-quickout &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Report output path; format follows the extension (html, json, xml, md).</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-daemon</div>
            <div className="text-xs text-slate-400">Run ZAP as a background daemon for API-driven scanning.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-port &lt;port&gt;</div>
            <div className="text-xs text-slate-400">Proxy and API listen port (default 8080).</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-config api.key=&lt;key&gt;</div>
            <div className="text-xs text-slate-400">Set the REST API key, or api.disablekey=true for isolated labs.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official ZAP Website', 'https://www.zaproxy.org/'],
            ['📖', 'ZAP Documentation', 'https://www.zaproxy.org/docs/'],
            ['🛡️', 'Official ZAP GitHub Repository', 'https://github.com/zaproxy/zaproxy'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before scanning any application">
        <p>
          This documentation is provided <b>strictly for educational and authorized defensive purposes</b>. ZAP active scans send
          real injection and scripting payloads that can crash fragile test systems and generate substantial log noise.
          Running ZAP against web applications without explicit written authorization is illegal. Test only systems you own or are authorized to assess under a formal scope of work. The authors and this website assume no liability for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
