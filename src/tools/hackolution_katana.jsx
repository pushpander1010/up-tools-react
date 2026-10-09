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
  { q: "What is Katana?", a: "Katana is a free, open-source web crawler in Go by ProjectDiscovery. It maps applications — links, forms, scripts, API endpoints — with standard and headless-Chrome modes plus JavaScript endpoint parsing." },
  { q: "Is using Katana legal?", a: "Katana itself is legitimate open-source software. Crawling any site without explicit written permission is illegal and can overload fragile apps. Use it only on lab apps or authorized targets with sane depth and rate limits." },
  { q: "How do I install Katana?", a: "Run go install github.com/projectdiscovery/katana/cmd/katana@latest. Headless mode additionally needs Chrome or Chromium installed. Verify with katana -version." },
  { q: "How do I crawl a lab app?", a: "Run katana -u against your lab URL with -d 5 and -jc for JavaScript parsing, saving with -o endpoints.txt. Review the file for admin routes and API paths." },
  { q: "When do I need headless mode?", a: "Single-page apps that render routes in JavaScript need -hl so Katana sees what a real browser sees. Add -xhr to log background API calls. It is slower, so use it after standard mode." },
  { q: "How does Katana feed other tools?", a: "Its URL lists pipe straight into HTTPX, DalFox, and nuclei. Crawl once with Katana, then scan the inventory with each specialized tool." },
  { q: "Why is my crawl empty?", a: "Increase depth, enable -jc, and try -hl for JS apps. Check the target is reachable and authentication cookies are passed if the app needs login." },
  { q: "How do I stay in scope?", a: "Crawl only authorized hosts, exclude logout and destructive routes, cap depth and rate, and stop immediately if you leave the agreed scope." }
]

const howItWorks = [
  "Install Katana with go install and verify with katana -version.",
  "Crawl your authorized lab app with katana -u, -d 5, -jc, saving to endpoints.txt.",
  "Re-crawl JS-heavy areas with -hl headless mode and -xhr logging.",
  "Pipe clean URL lists into DalFox and nuclei for vulnerability testing.",
  "Review every endpoint manually, then report and remediate exposures."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Katana Web Crawler — Headless Crawling & Endpoint Discovery Guide',
      description: 'Step-by-step reference: crawl lab apps deeply with Katana headless mode & JS parsing. Lab use only.',
      about: 'Katana ProjectDiscovery web crawler',
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

export default function hackolution_katana() {
  return (
    <ToolLayout
      title="Katana Web Crawler"
      desc="Step-by-step reference: crawl lab apps deeply with Katana headless mode & JS parsing. Lab use only."
      icon="⚔️"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(179,102,255,0.08))"
      category="security"
      slug="hackolution/katana"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Katana Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for crawler depth, JavaScript parsing, and endpoint lists that feed every scanner.
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
        Katana sends automated requests that crawl entire applications. Crawling any site without explicit written permission is strictly prohibited and illegal, and aggressive crawling can overload fragile apps. Use Katana <b>only on lab applications or targets covered by a signed authorization</b>, with sane depth and rate limits.
      </WarningBox>

      <Section id="overview" icon="⚔️" title="What is Katana?" subtitle="Next-generation crawling from ProjectDiscovery">
        <p>
          <b>Katana</b> is a free, open-source <b>web crawler</b> written in <b>Go</b> by ProjectDiscovery. Give it a lab URL and it maps the application: links, forms, JavaScript files, API endpoints, and hidden paths — including content rendered by <b>headless Chrome</b>.
        </p>
        <p>
          Its edge is JavaScript parsing: Katana extracts endpoints buried in script files that plain link-followers never see. Crawl output feeds directly into HTTPX, DalFox, and nuclei, making Katana the mapping stage of every serious web assessment pipeline.
        </p>
        <FeatureGrid items={[
          { i: '🕷️', t: 'Deep Crawling', d: 'Follows links, forms, and redirects to map full applications.' },
          { i: '🤖', t: 'Headless Mode', d: 'Renders JavaScript-heavy pages with real Chrome.' },
          { i: '📜', t: 'JS Endpoint Parsing', d: 'Extracts API URLs hidden inside script files.' },
          { i: '📁', t: 'Known-Files Checks', d: 'Probes robots.txt, sitemaps, and common backup paths.' },
          { i: '🔗', t: 'Pipeline Output', d: 'Clean URL lists ready for scanners and fuzzers.' },
          { i: '⏱️', t: 'Depth & Rate Control', d: 'Caps crawl depth and request rates per target.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Katana on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian with Go installed:</p>
        <CodeBlock title="terminal" lines={`go install github.com/projectdiscovery/katana/cmd/katana@latest`} />
        <InfoBox title="Headless requirements">
          Headless mode needs a Chrome or Chromium binary on the lab machine. Standard crawling works without it. Verify with katana -version and test on a local lab app before authorized targets.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Standard Crawl" subtitle="Map a lab app with JS parsing">
        <p className="text-xs text-slate-400">Crawl your authorized lab application and parse JavaScript for endpoints:</p>
        <CodeBlock title="terminal" lines={`katana -u http://localhost:3000 -d 5 -jc -o endpoints.txt`} />
        <InfoBox title="Depth and JS parsing">
          The -d flag caps crawl depth at 5 levels — enough for most labs without runaway loops. The -jc flag parses JavaScript files for hidden API endpoints. Review endpoints.txt for admin routes and API paths.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Headless Crawl" subtitle="Render modern JS-heavy lab apps">
        <p className="text-xs text-slate-400">Crawl a JavaScript-rendered lab app with real browser rendering:</p>
        <CodeBlock title="terminal" lines={`katana -u http://localhost:3000 -hl -d 3 -xhr -o spa.txt`} />
        <InfoBox title="When headless matters">
          The -hl flag renders pages in headless Chrome so single-page apps expose their routes. The -xhr flag logs background API requests. Headless crawling is slower — reserve it for apps the standard mode misses.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Scope & Feed Scanners" subtitle="Stay in scope and chain tools">
        <p className="text-xs text-slate-400">Restrict crawling to scope and pipe results into downstream tools:</p>
        <CodeBlock title="terminal" lines={`katana -u http://target.lab -d 4 -ef css,png,jpg -o urls.txt
cat urls.txt | dalfox pipe`} />
        <InfoBox title="Exclusions and chaining">
          The -ef flag skips noisy file types that waste crawl budget. Pipe clean URL lists into DalFox for XSS or nuclei for vulnerability templates — Katana output is built for exactly this.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Katana endpoint discovery output">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/katana/katana_logo.jpg" alt="Katana web crawler logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Katana crawl results: endpoints, scripts, and hidden paths</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Katana Crawls Find" subtitle="Common discoveries from deep crawls">
        <FeatureGrid items={[
          { i: '🔗', t: 'Hidden Endpoints', d: 'Unlinked API routes and debug paths from JS files.' },
          { i: '📝', t: 'Forms & Inputs', d: 'Every injection point mapped before testing starts.' },
          { i: '📁', t: 'Backup & Config Files', d: 'Exposed .bak, .old, and config copies.' },
          { i: '🔑', t: 'Auth Flows', d: 'Login, reset, and OAuth routes to test for logic flaws.' },
          { i: '📡', t: 'XHR APIs', d: 'Background calls revealing internal service URLs.' },
          { i: '🗺️', t: 'Full App Map', d: 'A complete URL inventory for systematic testing.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Crawl returns almost nothing"
            fix="Raise depth with -d 5 and add -jc for script parsing. JS-heavy apps need -hl headless mode to render routes at all."
          />
          <IssueRow
            issue="Crawl runs forever"
            fix="Cap depth, add -ef for static assets, and set -timeout. Exclude logout URLs so the session never dies mid-crawl."
          />
          <IssueRow
            issue="Headless mode fails"
            fix="Install Chromium on the lab machine and confirm the binary is on PATH. Fall back to standard mode plus manual browser DevTools inspection."
          />
          <IssueRow
            issue="Rate limiting blocks the crawl"
            fix="Lower concurrency with -c 5 and add -delay between requests. Stay inside authorized windows and scoped hosts only."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Katana Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u &lt;url&gt;</div>
            <div className="text-xs text-slate-400">Target URL where the crawl starts.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-d &lt;depth&gt;</div>
            <div className="text-xs text-slate-400">Maximum crawl depth from the start URL.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-jc</div>
            <div className="text-xs text-slate-400">Parse JavaScript files for hidden endpoints.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-hl / -xhr</div>
            <div className="text-xs text-slate-400">Headless browser rendering and XHR request logging.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-ef &lt;types&gt;</div>
            <div className="text-xs text-slate-400">Exclude noisy file extensions from crawling.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Write discovered URLs to a file.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Katana GitHub Repository', 'https://github.com/projectdiscovery/katana'],
            ['📖', 'Katana Usage Documentation', 'https://github.com/projectdiscovery/katana#usage'],
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
