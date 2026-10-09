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
  { q: "What is JADX?", a: "JADX is a free, open-source Android decompiler by Skylot. It turns APK, DEX, and AAR files back into readable Java source with a fast GUI and a batch CLI." },
  { q: "Is using JADX legal?", a: "JADX itself is legitimate open-source software. Decompiling apps without the owner written permission may break laws and licenses. Analyze only your own apps, open-source apps, or signed targets." },
  { q: "How do I install JADX?", a: "Run sudo apt install jadx -y or unzip a release build and run bin/jadx-gui. Java 17 or newer is required." },
  { q: "How do I find secrets in an APK?", a: "Open it in jadx-gui and global-search for http, api_key, secret, and password. Follow each hit into its class to confirm how the value is used." },
  { q: "How does JADX pair with MobSF?", a: "MobSF flags issues fast; JADX confirms them to the exact line and reveals surrounding logic. Use both: scan broadly, then read deeply." },
  { q: "What if the code is obfuscated?", a: "Rename symbols as you go and rely on strings, resources, and API call shapes. Secrets and endpoints survive most obfuscation." },
  { q: "Can I diff two app versions?", a: "Yes. Batch-decompile both with the CLI into separate folders and diff them — new endpoints and permissions stand out immediately." },
  { q: "Why does the GUI run out of memory?", a: "Large APKs need heap. Raise memory in the launch script or decompile headless with the CLI and browse the output." }
]

const howItWorks = [
  "Install JADX with Java 17 and verify the GUI launches.",
  "Open your authorized APK and triage manifest, permissions, and exports.",
  "Global-search for secrets, endpoints, and crypto across the tree.",
  "Trace request building and confirm findings with dynamic traffic.",
  "Report exact classes and lines, then verify developer fixes by diffing."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'JADX Android Decompiler — APK to Java Analysis Guide',
      description: 'Step-by-step reference: decompile APKs to Java with JADX GUI & CLI. Authorized apps only.',
      about: 'JADX dex to Java decompiler',
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

export default function hackolution_jadx() {
  return (
    <ToolLayout
      title="JADX Android Decompiler"
      desc="Step-by-step reference: decompile APKs to Java with JADX GUI & CLI. Authorized apps only."
      icon="🤖"
      iconBg="linear-gradient(135deg, rgba(34,197,94,0.18), rgba(27,255,110,0.08))"
      category="security"
      slug="hackolution/jadx"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the JADX Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for APK secrets, hardcoded endpoints, and the mobile hygiene that protects users.
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
        JADX decompiles Android applications into readable source. Decompiling apps without the owner explicit written permission may violate laws, licenses, and store terms. Analyze <b>only your own apps, open-source apps, or targets covered by a signed authorization</b>. Handle extracted keys, endpoints, and user data as sensitive throughout.
      </WarningBox>

      <Section id="overview" icon="🤖" title="What is JADX?" subtitle="Dex to Java decompiler for Android apps">
        <p>
          <b>JADX</b> is a free, open-source <b>Android decompiler</b> by Skylot. Drop in an APK, DEX, or AAR and it reconstructs <b>readable Java source</b> — activities, API clients, crypto routines, and string constants — browsable in a fast GUI or exportable from the CLI.
        </p>
        <p>
          Authorized mobile testers live in it: search the decompiled tree for hardcoded secrets, trace how the app builds requests, and confirm MobSF findings down to the exact line. For developers auditing their own releases, it shows precisely what ships to every user device.
        </p>
        <FeatureGrid items={[
          { i: '📂', t: 'APK to Java', d: 'Full source reconstruction from DEX bytecode.' },
          { i: '🔍', t: 'Global Search', d: 'Find secrets, URLs, and crypto calls across the tree.' },
          { i: '🖥️', t: 'Fast GUI', d: 'Tabbed browsing with smali fallback per class.' },
          { i: '⌨️', t: 'CLI Export', d: 'Batch decompile for pipelines and diffing builds.' },
          { i: '🧩', t: 'Resource Decode', d: 'Manifests, layouts, and values decoded alongside code.' },
          { i: '🔌', t: 'Plugin Scripts', d: 'Extend analysis with bundled and custom plugins.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install JADX on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install via apt or the release zip:</p>
        <CodeBlock title="terminal" lines={`sudo apt install jadx -y
# or latest release:
# unzip jadx-*.zip -d ~/tools && ~/tools/jadx/bin/jadx-gui`} />
        <InfoBox title="Java requirement">
          JADX needs a recent Java runtime — install OpenJDK 17 if the GUI refuses to start. Prefer release builds over distro packages when you need the newest decompiler fixes.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Open an APK in the GUI" subtitle="Browse your authorized app source">
        <p className="text-xs text-slate-400">Launch the GUI and open an APK you own or are authorized to test:</p>
        <CodeBlock title="terminal" lines={`jadx-gui app.apk`} />
        <InfoBox title="First-pass triage">
          Use global text search for http, api_key, secret, and password across the tree. Open the manifest for permissions and exported components, then follow interesting strings into their classes.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Batch Decompile with CLI" subtitle="Export source for diffing and grep">
        <p className="text-xs text-slate-400">Decompile from the terminal for pipelines and version diffs:</p>
        <CodeBlock title="terminal" lines={`jadx -d out/ app.apk`} />
        <InfoBox title="CLI output layout">
          The out directory holds sources plus decoded resources. Grep it with standard tools, diff two releases to spot new attack surface, and feed findings back into the report with file paths.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Trace Request Building" subtitle="Follow API logic to the wire">
        <p className="text-xs text-slate-400">Trace how the authorized app constructs and signs its requests:</p>
        <CodeBlock title="terminal" lines={`# search: OkHttpClient / Retrofit / HmacSHA
# follow: callers > request builder > interceptor chain`} />
        <InfoBox title="What request tracing proves">
          Hardcoded base URLs, static headers, and broken signing logic all surface here. Confirm each with MobSF dynamic traffic capture, then document the exact class and method for developers.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="JADX decompiled app source">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/jadx/jadx_logo.jpg" alt="JADX Android decompiler logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">JADX GUI — decompiled classes and global search</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What JADX Analysis Finds" subtitle="Common discoveries from APK reviews">
        <FeatureGrid items={[
          { i: '🔑', t: 'Hardcoded Keys', d: 'API tokens and secrets visible in plain source.' },
          { i: '🌐', t: 'Hidden Endpoints', d: 'Staging and internal URLs never shown in the UI.' },
          { i: '🔓', t: 'Broken Crypto', d: 'Static IVs, hardcoded keys, and custom ciphers.' },
          { i: '🚪', t: 'Exported Surfaces', d: 'Deep links and receivers other apps can trigger.' },
          { i: '🐛', t: 'Debug Leftovers', d: 'Logging and test code leaking runtime data.' },
          { i: '📦', t: 'Bloated SDKs', d: 'Trackers and libraries expanding the attack surface.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Decompilation shows errors"
            fix="Update to the latest release — the decompiler improves constantly. Fall back to the smali view for stubborn classes and analyze those by hand."
          />
          <IssueRow
            issue="GUI will not start"
            fix="Install OpenJDK 17 and confirm java -version. Increase heap in the launch script for large APKs that exhaust default memory."
          />
          <IssueRow
            issue="Obfuscated names everywhere"
            fix="Rename=>' mapped symbols progressively and lean on string and resource search. Obfuscation slows reading but rarely hides secrets and endpoints."
          />
          <IssueRow
            issue="Huge APK takes forever"
            fix="Decompile with the CLI once, then browse the output folder. Exclude resource decoding when you only need code."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key JADX Views & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">jadx-gui</div>
            <div className="text-xs text-slate-400">Graphical browser for classes, search, and smali.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">jadx -d out/</div>
            <div className="text-xs text-slate-400">Batch decompile an APK to a source folder.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Global Search</div>
            <div className="text-xs text-slate-400">String and code search across the whole app.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Smali View</div>
            <div className="text-xs text-slate-400">Bytecode-accurate fallback per class.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Manifest Decode</div>
            <div className="text-xs text-slate-400">Permissions and components in readable form.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Plugins</div>
            <div className="text-xs text-slate-400">Extend analysis with custom scripts.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official JADX GitHub Repository', 'https://github.com/skylot/jadx'],
            ['📖', 'JADX Usage Documentation', 'https://github.com/skylot/jadx#usage'],
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
