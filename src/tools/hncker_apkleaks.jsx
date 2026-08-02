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

function Step({ n, title, children }) {
  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-xs font-bold text-brand shrink-0 mt-0.5">{n}</div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-slate-400 leading-relaxed">{children}</div>
      </div>
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
  { q: 'What is APKLeaks?', a: 'APKLeaks is a free, open-source command-line scanner that pulls URIs, API endpoints and hardcoded secrets out of Android APK files. It targets mobile app security testing and bug bounty workflows.' },
  { q: 'Is APKLeaks illegal?', a: 'The tool is open source and legal to study. Running it on apps you do not own or lack permission to test may violate the app\'s terms and applicable law. Only scan apps you own or have explicit authorization to assess.' },
  { q: 'Does APKLeaks need a rooted Android device?', a: 'No. APKLeaks works on the APK file itself — you do not need a device at all. It decompiles the package and scans the resulting code for sensitive data.' },
  { q: 'How does APKLeaks decompile the APK?', a: 'It uses the jadx disassembler under the hood. If jadx is not already installed, APKLeaks will prompt you to download it automatically on first run.' },
  { q: 'What exactly does it extract?', a: 'By default it scans for URIs, URLs, API endpoints and secret patterns (like AWS access keys) using its built-in regex rules. You can supply your own patterns with a custom JSON rules file.' },
  { q: 'Why did the scan return nothing?', a: 'The APK may be heavily obfuscated. Try passing disassembler arguments to jadx, e.g. -a "--deobf --log-level DEBUG", or add custom regex patterns with --pattern rules.json.' },
  { q: 'Can I add my own search rules?', a: 'Yes. Pass a custom JSON file of regex patterns with the -p / --pattern option, e.g. apkleaks -f app.apk -p custom-rules.json.' },
  { q: 'How is APKLeaks different from MobSF?', a: 'APKLeaks is a lightweight, CLI-first scanner focused specifically on secrets and endpoints. MobSF is a full mobile app security framework with a web dashboard and many more checks. Many pentesters use both.' },
  { q: 'Does it support output to a file?', a: 'Yes. Use -o output.txt to write results to a file (a random file is created if you omit it), and --json to save in JSON format.' },
]

const howItWorks = [
  'Install APKLeaks (pip, source or Docker).',
  'Point it at an APK file with -f.',
  'It decompiles the APK with jadx.',
  'It scans the decompiled code against secret & endpoint regex rules.',
  'Results (URLs, endpoints, secrets) are printed and/or saved to a file.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'APKLeaks — Scan Android APKs for URLs, Endpoints & Secrets (Educational)',
      description: 'Complete step-by-step reference for installing and using APKLeaks to extract URLs, endpoints and hardcoded secrets from Android APK files. Education only.',
      about: 'APKLeaks Android APK scanner',
      educationalUse: 'Testing, education, and authorized security audits only',
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

export default function hncker_apkleaks() {
  return (
    <ToolLayout
      title="APKLeaks — Android APK Scanner"
      desc="Step-by-step reference: install & use APKLeaks to extract URLs, API endpoints and hardcoded secrets from Android APK files. Educational purposes only."
      icon="📱"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(57,255,20,0.1))"
      category="security"
      slug="hncker/apkleaks"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/apkleaks/apkleaks_scan.png" />
      </Helmet>

      {/* Video Tutorial */}
      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the full walkthrough of APKLeaks">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=7e9CTa9sVmE" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/7e9CTa9sVmE/hqdefault.jpg"
                alt="APKLeaks — Scan APK for Secrets & Endpoints"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">APKLeaks — Scan APK for Secrets & Endpoints</p>
                <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        APKLeaks extracts sensitive data from Android apps. Use it <b>only on apps you own or have explicit permission to test</b>.
        Scanning third-party apps without authorization can violate their terms of service and the law. This page is for
        <b> educational and authorized security testing only</b>.
      </WarningBox>

      <Section id="overview" icon="🕵️" title="What is APKLeaks?" subtitle="Scan an APK and rip out URLs, endpoints & secrets">
        <p>
          <b>APKLeaks</b> is a fast, open-source command-line tool that scans an Android <b>APK</b> file and extracts
          <b> URIs, API endpoints and hardcoded secrets</b>. It decompiles the app with <b>jadx</b>, then runs a set of regex
          rules over the decompiled source to surface things developers usually don't mean to ship — like API keys, private URLs and
          internal endpoints.
        </p>
        <p>
          It's a go-to during mobile pentests and bug-bounty engagements to quickly map an app's backend and spot credential leaks
          before an attacker does.
        </p>
        <FeatureGrid items={[
          { i: '🔗', t: 'Endpoints & URLs', d: 'Finds every URL and API endpoint referenced in the app.' },
          { i: '🔑', t: 'Hardcoded secrets', d: 'Surfaces API keys, tokens and credentials left in the code.' },
          { i: '⚡', t: 'Fast & CLI-first', d: 'Lightweight terminal scanner — no web dashboard needed.' },
          { i: '🧩', t: 'Custom rules', d: 'Add your own regex patterns with a JSON rules file.' },
          { i: '🧬', t: 'jadx-powered', d: 'Reuses the battle-tested jadx decompiler under the hood.' },
          { i: '📦', t: 'Many installs', d: 'Install via pip, source, or Docker.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Python 3 and pip (for the pip / source install)'],
            ['☑️', 'jadx — the decompiler. Auto-downloaded if missing'],
            ['☑️', '(Optional) Docker, if you prefer the containerised install'],
            ['☑️', 'An APK file to scan (Android app package)'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Three ways to get APKLeaks">
        <h3 className="text-sm font-bold text-white pt-1">Option A — Install from PyPi (recommended)</h3>
        <CodeBlock title="terminal" lines={`pip3 install apkleaks`} />

        <h3 className="text-sm font-bold text-white pt-2">Option B — Install from source</h3>
        <CodeBlock title="terminal" lines={`git clone https://github.com/dwisiswant0/apkleaks
cd apkleaks/
pip3 install -r requirements.txt`} />

        <h3 className="text-sm font-bold text-white pt-2">Option C — Install via Docker</h3>
        <CodeBlock title="terminal" lines={`docker pull dwisiswant0/apkleaks:latest`} />

        <InfoBox title="jadx note">
          APKLeaks uses <b>jadx</b> to decompile the APK. If jadx isn't already on your system, APKLeaks will prompt you to
          download it automatically on first run.
        </InfoBox>
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Scan an APK in seconds">
        <p className="text-xs text-slate-400">The basic command — point it at any APK:</p>
        <CodeBlock title="terminal" lines={`apkleaks -f ~/path/to/file.apk
# from source
python3 apkleaks.py -f ~/path/to/file.apk
# with Docker
docker run -it --rm -v /tmp:/tmp dwisiswant0/apkleaks:latest -f /tmp/file.apk`} />

        <h3 className="text-sm font-bold text-white pt-2">Common options</h3>
        <CodeBlock title="options" lines={`-f, --file   APK file to scan              apkleaks -f app.apk
-o, --output Write results to a file        apkleaks -f app.apk -o out.txt
-p, --pattern Custom regex rules (JSON)     apkleaks -f app.apk -p rules.json
-a, --args   Disassembler arguments         apkleaks -f app.apk -a "--deobf"
    --json   Save output as JSON            apkleaks -f app.apk -o out.json --json`} />

        <h3 className="text-sm font-bold text-white pt-2">Full example</h3>
        <CodeBlock title="scan with custom rules + output" lines={`apkleaks -f /path/to/app.apk -p rules.json -o ~/Documents/apkleaks-results.txt`} />

        <InfoBox title="Speeding up large APKs">
          If a big app takes too long, give jadx more threads: <span className="font-mono">apkleaks -f app.apk -a "--threads-count 5"</span>
          . For obfuscated apps try <span className="font-mono">-a "--deobf --log-level DEBUG"</span>.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="APKLeaks in action">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <img src="/assets/tools/apkleaks/apkleaks_scan.png" alt="APKLeaks scanning an APK file in the terminal"
              className="w-full h-auto object-contain" loading="lazy" />
            <figcaption className="px-4 py-2 text-xs text-slate-400">Scanning an APK with APKLeaks</figcaption>
          </figure>
          <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <img src="/assets/tools/apkleaks/apkleaks_output.png" alt="APKLeaks terminal output showing URLs and secrets"
              className="w-full h-auto object-contain" loading="lazy" />
            <figcaption className="px-4 py-2 text-xs text-slate-400">APKLeaks output — URLs, endpoints & secrets</figcaption>
          </figure>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="'command not found: apkleaks' right after pip install"
            fix={`pip's scripts directory isn't on your PATH. Run it as a module instead: python3 -m apkleaks -f app.apk, or add pip's user bin dir to PATH (e.g. export PATH="$PATH:$(python3 -m site --user-base)/bin" on Linux).`}
          />
          <IssueRow
            issue="jadx download prompt fails / jadx not found"
            fix="Install jadx manually and put it on PATH (brew install jadx on macOS, or grab the release from skylot/jadx on GitHub), then re-run the scan."
          />
          <IssueRow
            issue="Scan is very slow or hangs on large APKs"
            fix={`Give jadx more threads: apkleaks -f app.apk -a "--threads-count 5". For very large apps, scan on a machine with more RAM/CPU.`}
          />
          <IssueRow
            issue="No URLs or secrets found"
            fix={`The app is likely obfuscated. Re-run with deobfuscation: apkleaks -f app.apk -a "--deobf --log-level DEBUG", or add your own regex patterns with -p rules.json.`}
          />
          <IssueRow
            issue="Docker permission / mount errors"
            fix="Make sure you mount a shared volume so the container can read the APK, e.g. docker run -it --rm -v /tmp:/tmp dwisiswant0/apkleaks:latest -f /tmp/app.apk. On Linux, add your user to the docker group or use sudo."
          />
          <IssueRow
            issue="Default patterns miss something specific"
            fix={`Create a custom JSON rules file with the exact regex you need and pass it with --pattern. Example: { "AWS Access Key": "AKIA[0-9A-Z]{16}" }.`}
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official repository', 'https://github.com/dwisiswant0/apkleaks'],
            ['🐳', 'Docker image', 'https://hub.docker.com/r/dwisiswant0/apkleaks'],
            ['🐛', 'Report issues', 'https://github.com/dwisiswant0/apkleaks/issues'],
            ['🔧', 'jadx decompiler', 'https://github.com/skylot/jadx'],
            ['🎬', 'HNCKER tutorials', 'https://www.youtube.com/@hncker'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-brand text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you scan anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized security-testing purposes</b>. APKLeaks can
          expose sensitive information that was never meant to be public. Scanning or extracting data from apps you do not own,
          or without the owner's permission, may violate the law and the app's terms of service. Use it only on your own apps,
          on practice targets, or inside an authorized bug-bounty / pentest engagement. The author and this site are not
          responsible for any misuse of this information.
        </p>
      </Section>
    </ToolLayout>
  )
}
