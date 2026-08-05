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
    <div className="rounded-xl p-4 border border-red-500/30" style={{ background: 'rgba(239,68,68,0.07)' }}>
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
  { q: 'What is ffuf?', a: 'ffuf (Fuzz Faster U Fool) is a fast web fuzzer written in Go. It sends thousands of requests with a wordlist substituted into a FUZZ keyword and reports which ones return real, interesting responses.' },
  { q: 'Is ffuf illegal?', a: 'No, ffuf is a legitimate open-source tool used for authorized web content discovery and penetration testing. Using it against a website you do not own or lack written permission to test is illegal. Only run it on systems you own or are authorized to assess.' },
  { q: 'How does the FUZZ keyword work?', a: 'ffuf replaces the literal word FUZZ anywhere in the URL, headers or body with each word from the wordlist. For example ffuf -u https://site.com/FUZZ -w words.txt tests every word at that path.' },
  { q: 'What do -mc and -fc do?', a: '-mc sets which HTTP status codes to match (show), and -fc sets codes to filter out (hide). You use them to reduce noise and only surface real pages — e.g. -mc 200,301 or -fc 404.' },
  { q: 'Can ffuf fuzz more than paths?', a: 'Yes. FUZZ can appear in query parameters, headers, cookies or POST bodies, so you can fuzz parameters, subdomains, virtual hosts and login forms too.' },
  { q: 'What is parameter fuzzing?', a: 'You place FUZZ in a query string or body field to discover hidden inputs the app accepts, like ffuf -u https://site.com/page?FUZZ=1 -w params.txt. Hidden parameters can expose debug or admin functionality.' },
  { q: 'How do I brute-force a login with ffuf?', a: 'Fuzz the password field in a POST body and filter out the failed-login status code: ffuf -X POST -d "user=admin&pass=FUZZ" -w passwords.txt -fc 401. A different status/size reveals a valid credential.' },
  { q: 'How can I defend against fuzzing?', a: 'Remove unused endpoints, restrict admin and debug paths, use a WAF to rate-limit fuzz traffic, and monitor access logs for unusual request patterns.' },
]

const howItWorks = [
  'Install ffuf (Go binary) or add it to your Kali environment.',
  'Run a directory/content discovery against a target you own.',
  'Filter results by status code or response size.',
  'Fuzz parameters, subdomains or login forms as needed.',
  'Remove hidden endpoints and rate-limit to defend against fuzzing.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'ffuf — Web Fuzzer (Educational Guide)',
      description: 'Step-by-step reference for using ffuf (Fuzz Faster U Fool) for web content discovery, parameter fuzzing and login brute force, plus how to defend against fuzzing.',
      about: 'ffuf web fuzzer and content discovery',
      educationalUse: 'Testing, education, and authorized penetration testing only',
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

export default function hncker_ffuf() {
  return (
    <ToolLayout
      title="ffuf — Web Fuzzer Guide"
      desc="Step-by-step reference: use ffuf for web content discovery, parameter fuzzing and login brute force. Educational purposes only."
      icon="🔎"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/ffuf"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/ffuf/ffuf_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=H8dwJpti6jg" target="_blank" rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-white/10 no-underline"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img src="https://i.ytimg.com/vi/H8dwJpti6jg/hqdefault.jpg"
                alt="ffuf Tutorial - Find Hidden Pages and Directories" loading="lazy"
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">ffuf — find the pages a website is hiding</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        ffuf is a legitimate web fuzzing tool. Use it <b>only against systems you own or have written permission to
        test</b>. Fuzzing or scanning a website that is not yours is illegal. This page is for <b>educational and
        authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🔎" title="What is ffuf?" subtitle="Fuzz Faster U Fool — the web fuzzer">
        <p>
          <b>ffuf</b> is a fast web fuzzer written in <b>Go</b>. It takes a wordlist and substitutes each word into the
          <span className="font-mono">FUZZ</span> keyword in a URL (or header, parameter or body), then reports which
          responses are worth looking at.
        </p>
        <p>
          It is a favourite for <b>content discovery</b> during authorized recon — surfacing hidden directories, files,
          parameters and subdomains that a site doesn't link to.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Fast', d: 'Highly concurrent Go-based requests.' },
          { i: '🧭', t: 'Content discovery', d: 'Find hidden dirs, files, vhosts.' },
          { i: '🔢', t: 'Flexible FUZZ', d: 'URL, params, headers or body.' },
          { i: '🎛️', t: 'Match/filter', d: '-mc / -fc / -ms / -fs to cut noise.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'A wordlist (e.g. /usr/share/wordlists/... or seclists)'],
            ['☑️', 'A target you own or are authorized to test'],
            ['☑️', 'The ffuf binary (or a Kali/Parrot environment)'],
            ['☑️', 'Reasonable throttling to stay within scope'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="go" lines={`go install github.com/ffuf/ffuf/v2@latest`} />
        <InfoBox title="Kali / Debian">
          <span className="font-mono">sudo apt install ffuf</span>. Prebuilt binaries are also available from the
          official ffuf GitHub releases.
        </InfoBox>
      </Section>

      <Section id="discovery" icon="🧭" title="Step 1 — Directory Discovery" subtitle="Find hidden folders & files">
        <p className="text-xs text-slate-400">Fuzz every word at the URL path:</p>
        <CodeBlock title="terminal" lines={`ffuf -u https://site.com/FUZZ -w wordlist.txt
# admin        [Status: 200]
# login        [Status: 301]
# backup.zip   [Status: 200]`} />
        <InfoBox title="The FUZZ keyword">
          <span className="font-mono">FUZZ</span> is replaced by each wordlist entry. Put it anywhere — path, parameter,
          subdomain or header.
        </InfoBox>
      </Section>

      <Section id="filter" icon="🎛️" title="Step 2 — Filter by Status" subtitle="Only real pages show up">
        <p className="text-xs text-slate-400">Match only interesting status codes:</p>
        <CodeBlock title="terminal" lines={`ffuf -u https://site.com/FUZZ -w wordlist.txt -mc 200,301`} />
        <InfoBox title="Or filter out noise">
          Use <span className="font-mono">-fc 404</span> to hide not-found responses, or <span className="font-mono">
          -fs</span> / <span className="font-mono">-ms</span> to filter by response size.
        </InfoBox>
      </Section>

      <Section id="params" icon="🔢" title="Step 3 — Parameter Fuzzing" subtitle="Discover hidden inputs">
        <p className="text-xs text-slate-400">Place FUZZ in the query string:</p>
        <CodeBlock title="terminal" lines={`ffuf -u https://site.com/page?FUZZ=1 -w params.txt
# id     [Status: 200]
# debug  [Status: 200]`} />
        <InfoBox title="Hidden parameters">
          Debug or admin parameters can expose unintended functionality — a common finding in authorized web testing.
        </InfoBox>
      </Section>

      <Section id="login" icon="🔐" title="Step 4 — Login Brute Force" subtitle="Fuzz credentials">
        <p className="text-xs text-slate-400">Fuzz the password field and filter failed logins:</p>
        <CodeBlock title="terminal" lines={`ffuf -X POST -d "user=admin&pass=FUZZ" -w passwords.txt -fc 401
# [FOUND] admin:letmein`} />
        <InfoBox title="Filter on the failure">
          A different status or response size reveals the valid credential — <span className="font-mono">-fc 401</span>
          hides everything that returns the failed-login code.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Beat the Fuzzer" subtitle="Detect and rate-limit">
        <FeatureGrid items={[
          { i: '🗑️', t: 'Remove unused endpoints', d: 'Delete stray backups and debug routes.' },
          { i: '🔒', t: 'Restrict admin paths', d: 'Protect admin/login with extra controls.' },
          { i: '🚦', t: 'Rate-limit fuzz traffic', d: 'WAF rules and fail2ban style blocks.' },
          { i: '📊', t: 'Monitor access logs', d: 'Watch for bursts of 404s or repeated paths.' },
        ]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="ffuf in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/ffuf/ffuf_scan.png" alt="ffuf discovering hidden web paths" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">ffuf surfacing hidden directories and files</figcaption>
        </figure>
      </Section>

            <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u, --url</div>
            <div className="text-xs text-slate-400">Target URL. Put the keyword FUZZ where words get substituted.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-w, --wordlist</div>
            <div className="text-xs text-slate-400">Wordlist file to use. Repeat for multiple FUZZ keywords.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-mc, --match-codes</div>
            <div className="text-xs text-slate-400">HTTP status codes to show, e.g. -mc 200,301.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-fc, --filter-codes</div>
            <div className="text-xs text-slate-400">HTTP status codes to hide, e.g. -fc 404.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-ms / -fs</div>
            <div className="text-xs text-slate-400">Match or filter responses by exact size (bytes).</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-X, --method</div>
            <div className="text-xs text-slate-400">HTTP method to send, e.g. GET or POST.</div>
          </div>
          <div key="k6" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-d, --data</div>
            <div className="text-xs text-slate-400">POST body to send.</div>
          </div>
          <div key="k7" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-H, --header</div>
            <div className="text-xs text-slate-400">Add a custom header, e.g. -H "Host: FUZZ.example.com".</div>
          </div>
          <div key="k8" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-t, --threads</div>
            <div className="text-xs text-slate-400">Number of concurrent threads to run.</div>
          </div>
          <div key="k9" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-ac, --autocalibrate</div>
            <div className="text-xs text-slate-400">Auto-calibrate filtering from a baseline request.</div>
          </div>
          <div key="k10" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-recursion</div>
            <div className="text-xs text-slate-400">Follow discovered directories and fuzz them too.</div>
          </div>
        </div>
      </Section>

<Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          <IssueRow
            issue="Too many false positives"
            fix="The target returns 200 for every path. Filter with -mc/-fc and match on response size with -ms/-fs, or add -ac to auto-calibrate from a baseline request."
          />
          <IssueRow
            issue="ffuf: command not found"
            fix={'Add your Go bin to PATH (export PATH="$PATH:$(go env GOPATH)/bin") or run it directly from the downloaded binary path.'}
          />
          <IssueRow
            issue="Slow / blocked by the target"
            fix="Lower the thread count with -t and respect scope. If a WAF blocks you, throttle and use the site's own rate limits."
          />
          <IssueRow
            issue="No results for subdomain/vhost fuzzing"
            fix={'Use -H "Host: FUZZ.example.com" and point -u at the base IP or CDN. Confirm the wordlist actually contains the subdomains you expect.'}
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official ffuf repo', 'https://github.com/ffuf/ffuf'],
            ['📖', 'ffuf wiki', 'https://github.com/ffuf/ffuf/wiki'],
            ['🗃️', 'SecLists wordlists', 'https://github.com/danielmiessler/SecLists'],
            ['🎬', 'HNCKER tutorials', 'https://www.youtube.com/@hncker'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you fuzz anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized purposes</b>. ffuf is a legitimate
          web fuzzing tool, but using it against a system you do not own or lack written permission to test is illegal.
          Use it only on targets you own or within an authorized penetration-testing engagement. The author and this
          site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
