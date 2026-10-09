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
  { q: "What is Feroxbuster?", a: "Feroxbuster is a free, open-source content discovery tool in Rust. It brute-forces hidden directories and files on web apps using wordlists, with recursion, wildcard filtering, and resume support built in." },
  { q: "Is using Feroxbuster legal?", a: "Feroxbuster itself is legitimate open-source software. Scanning sites without explicit written permission is illegal and can overload fragile apps. Use it only on lab apps or signed-engagement targets with sane thread counts." },
  { q: "How do I install Feroxbuster?", a: "Run sudo apt install feroxbuster -y on Debian-based systems or cargo install feroxbuster. Add SecLists with sudo apt install seclists -y for standard wordlists." },
  { q: "How do I scan a lab app?", a: "Run feroxbuster -u against your lab URL with a common wordlist. Open every 200, follow 301 directories, and note 403 paths for follow-up techniques." },
  { q: "How do I find backup files?", a: "Add -x with extensions like php,bak,old so each word is tried with every suffix. Backup copies of configs and source are among the highest-value finds." },
  { q: "What is the difference between Feroxbuster and Gobuster?", a: "Both brute-force web content. Feroxbuster adds automatic recursion, smarter wildcard filtering, live stats, and resume state out of the box. Gobuster is lighter and covers DNS and vhosts too." },
  { q: "Why does everything return 200?", a: "Wildcard applications answer every path. Use automatic filtering or --filter-size on the wildcard length, then verify survivors by hand." },
  { q: "How do I resume a killed scan?", a: "Pass -o on every run to keep a state file, then rerun with --resume-from pointing at it. Nothing already tested is repeated." }
]

const howItWorks = [
  "Install Feroxbuster plus SecLists and verify with feroxbuster --version.",
  "Scan your authorized lab app with a common wordlist and default recursion.",
  "Hunt backups with -x extensions and cut noise with -C filters.",
  "Save every run with -o and resume interruptions with --resume-from.",
  "Open each finding manually, then report and remove exposed paths."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Feroxbuster Content Discovery — Hidden Directory & File Brute-Force Guide',
      description: 'Step-by-step reference: brute-force hidden dirs & files fast with Feroxbuster. Lab use only.',
      about: 'Feroxbuster Rust content discovery scanner',
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

export default function hackolution_feroxbuster() {
  return (
    <ToolLayout
      title="Feroxbuster Content Discovery"
      desc="Step-by-step reference: brute-force hidden dirs & files fast with Feroxbuster. Lab use only."
      icon="🧭"
      iconBg="linear-gradient(135deg, rgba(27,255,110,0.18), rgba(0,200,180,0.08))"
      category="security"
      slug="hackolution/feroxbuster"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Feroxbuster Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for wordlist fuzzing, status filtering, and the hidden paths that leak admin panels.
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
        Feroxbuster sends thousands of requests to web servers. Scanning any site without explicit written permission is strictly prohibited and illegal, and aggressive scans can overload fragile apps. Use Feroxbuster <b>only on lab applications or targets covered by a signed authorization</b>, with sane thread counts and scoped wordlists.
      </WarningBox>

      <Section id="overview" icon="🧭" title="What is Feroxbuster?" subtitle="Fast Rust content discovery for web apps">
        <p>
          <b>Feroxbuster</b> is a free, open-source <b>content discovery tool</b> written in <b>Rust</b>. Give it a lab URL and a wordlist and it brute-forces <b>hidden directories and files</b> — admin panels, backups, configs, and forgotten endpoints — with recursive scanning built in.
        </p>
        <p>
          It improves on classic dirbusting with automatic recursion, smart filtering of wildcard responses, and live progress stats. In authorized web assessments it answers what the application hides beyond its linked pages.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Rust Speed', d: 'Thousands of requests per second with live statistics.' },
          { i: '🔁', t: 'Auto Recursion', d: 'Discovers a directory and immediately scans inside it.' },
          { i: '🧹', t: 'Wildcard Filtering', d: 'Auto-filters false positives from catch-all responses.' },
          { i: '📚', t: 'Wordlist Driven', d: 'Works with SecLists and custom lab wordlists.' },
          { i: '📄', t: 'Stateful Output', d: 'Resume interrupted scans and export structured state files.' },
          { i: '🔗', t: 'Extract Links', d: 'Pulls new paths from response bodies while scanning.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Feroxbuster on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install via apt or cargo:</p>
        <CodeBlock title="terminal" lines={`sudo apt install feroxbuster -y
# or with cargo:
# cargo install feroxbuster`} />
        <InfoBox title="Wordlists needed">
          Feroxbuster is only as good as its wordlist. Install SecLists with sudo apt install seclists -y for the standard directory lists. Start with common.txt in labs before moving to big discovery lists.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic Directory Scan" subtitle="Find hidden paths on a lab app">
        <p className="text-xs text-slate-400">Scan your authorized lab application with a common wordlist:</p>
        <CodeBlock title="terminal" lines={`feroxbuster -u http://localhost:3000 -w /usr/share/seclists/Discovery/Web-Content/common.txt`} />
        <InfoBox title="Reading the results">
          Status 200 lines are live pages worth opening; 301 lines reveal directory structure; 403 lines mark forbidden paths to revisit with other techniques. Recursion automatically follows discovered directories deeper.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Extensions & Filtering" subtitle="Hunt backup files and cut noise">
        <p className="text-xs text-slate-400">Append backup extensions and filter noisy status codes:</p>
        <CodeBlock title="terminal" lines={`feroxbuster -u http://target.lab -w /usr/share/seclists/Discovery/Web-Content/common.txt -x php,bak,old -C 404`} />
        <InfoBox title="Extensions and codes">
          The -x flag tries each word with every extension, catching config.php.bak style leftovers. The -C flag hides chosen status codes so real findings stand out in long scans.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Resume & Extract" subtitle="Survive interruptions and mine links">
        <p className="text-xs text-slate-400">Save state for resume and extract links from responses:</p>
        <CodeBlock title="terminal" lines={`feroxbuster -u http://target.lab -w common.txt --auto-tune -o ferox.txt --extract-links`} />
        <InfoBox title="Tuning and evidence">
          The --auto-tune flag adapts speed to server responses, protecting fragile lab apps. The -o flag saves findings and --extract-links harvests new paths from page bodies for follow-up scans.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Feroxbuster uncovering hidden paths">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/feroxbuster/feroxbuster_logo.jpg" alt="Feroxbuster content discovery logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Feroxbuster results — hidden directories and files exposed</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Feroxbuster Scans Find" subtitle="Common discoveries from content scans">
        <FeatureGrid items={[
          { i: '🚪', t: 'Admin Panels', d: 'Unlinked /admin and dashboard routes.' },
          { i: '💾', t: 'Backup Files', d: 'Exposed .bak, .old, and archive copies with source.' },
          { i: '⚙️', t: 'Config Leaks', d: 'Git folders, env files, and editor leftovers.' },
          { i: '🔌', t: 'API Endpoints', d: 'Undocumented routes hiding behind the frontend.' },
          { i: '📁', t: 'Directory Listings', d: 'Open indexes spilling file names.' },
          { i: '🧪', t: 'Staging Copies', d: 'Dev and test deployments on the same host.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Every request returns 200"
            fix="The app uses wildcard responses. Let feroxbuster auto-filter run, or pass --filter-size to hide the wildcard body length. Verify remaining hits manually."
          />
          <IssueRow
            issue="Scan is too slow"
            fix="Raise threads with -t 50 gradually and use --auto-tune on fragile apps. Split huge wordlists and scan high-value extensions first."
          />
          <IssueRow
            issue="403 on everything interesting"
            fix="Try different methods with -m GET,POST, add cookies with -b, and test header tricks in the lab. Forbidden often means found — note it and pivot."
          />
          <IssueRow
            issue="Killed mid-scan, results lost"
            fix="Always pass -o to save output and use the state file to resume. Rerun with --resume-from to continue exactly where it stopped."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Feroxbuster Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u &lt;url&gt;</div>
            <div className="text-xs text-slate-400">Target base URL where discovery starts.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-w &lt;wordlist&gt;</div>
            <div className="text-xs text-slate-400">Wordlist of directory and file names to try.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-x &lt;exts&gt;</div>
            <div className="text-xs text-slate-400">Append extensions like php,bak,old to every word.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-C &lt;codes&gt;</div>
            <div className="text-xs text-slate-400">Filter out noisy HTTP status codes.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-t &lt;n&gt; / --auto-tune</div>
            <div className="text-xs text-slate-400">Thread count, or automatic speed adaptation.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Save findings and state for resume and reports.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Feroxbuster GitHub Repository', 'https://github.com/epi052/feroxbuster'],
            ['📖', 'Feroxbuster Usage Documentation', 'https://github.com/epi052/feroxbuster#usage'],
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
