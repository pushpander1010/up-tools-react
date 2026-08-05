import { Helmet } from 'react-helmet-async'
import ToolLayout from '../components/ToolLayout'

/* ── Small presentational helpers (dark/terminal cyber theme) ─────────── */
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
      <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0 mt-0.5">{n}</div>
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

/* ── FAQ data (rendered by ToolLayout) ────────────────────────────────── */
const faq = [
  { q: 'What is AhMyth?', a: 'AhMyth is a free, open-source Android RAT (Remote Administration Tool) used by penetration testers. It lets you build a malicious APK payload and, once installed on a target device, view messages, contacts, location, files, and control the camera and microphone from a desktop dashboard.' },
  { q: 'Is AhMyth illegal?', a: 'The tool itself is open source and legal to study. Using it to compromise a device you do not own or without explicit permission is illegal in most countries. Only use AhMyth on your own devices or in authorized lab environments.' },
  { q: 'What are AhMyth\'s system requirements?', a: 'A 64-bit Linux (Ubuntu/Kali), Java 11 JDK (for building and signing APKs), Node.js and npm (to run the app), git, and optionally zipalign on 32-bit systems. A working internet connection is needed for the server and payload to communicate.' },
  { q: 'Why does the APK build fail on Kali?', a: 'Usually the Java JDK or Android build tools are missing or the wrong version is installed. Install a full openjdk-11 JDK and re-run the installer. See the Known Issues section below for the exact commands.' },
  { q: 'How do I get a victim to connect?', a: 'For testing on your own network, install the payload APK on a device on the same LAN and keep the AhMyth server running. For remote connections you must configure port forwarding (or a tunnel) so the target can reach your server\'s port.' },
  { q: 'Will antivirus flag the payload?', a: 'Yes. AhMyth payloads are detected by most AV engines because of their behavior. This is normal for RATs and one reason to only test in a controlled, authorized environment.' },
  { q: 'Does AhMyth require root on Android?', a: 'No. AhMyth works on unrooted Android devices by abusing granted permissions (SMS, location, camera, microphone). Some advanced features may behave differently depending on Android version and permission grants.' },
  { q: 'Is AhMyth still maintained?', a: 'The Morsmalleo/AhMyth fork is actively maintained and is the recommended source. The original AhMyth/AhMyth repository is older and largely unmaintained, so prefer the fork.' },
  { q: 'Why does the server not start with an Electron error?', a: 'On Linux, Electron often needs the --no-sandbox flag. Run with "npx electron ./app --no-sandbox start" or use ./start_linux which handles this for you.' },
]

const howItWorks = [
  'Clone the AhMyth repository and open the AhMyth-Server folder.',
  'Run the installer to set up Java, Node and build dependencies.',
  'Launch the AhMyth dashboard (ahmyth / npm start).',
  'Build a standalone APK payload (or use an original APK as a template).',
  'Install the payload on your test device and grant the requested permissions.',
  'The device appears in the Victims tab — open its Lab to control it.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'AhMyth — Android RAT: Installation & Usage Guide (Educational)',
      description: 'Complete step-by-step reference for installing and using AhMyth on Kali Linux for ethical Android security testing. Education only.',
      about: 'AhMyth Android RAT',
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

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function hncker_ahmyth() {
  return (
    <ToolLayout
      title="AhMyth — Android RAT Tutorial"
      desc="Step-by-step reference: install & use AhMyth on Kali Linux to build Android RAT payloads for ethical security testing. Educational purposes only."
      icon="📱"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(57,255,20,0.1))"
      category="security"
      slug="hncker/ahmyth"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/ahmyth/ahmyth_logo.png" />
      </Helmet>

      {/* Video Tutorial */}
      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the full walkthrough of AhMyth">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl border border-white/10"
            src="https://www.youtube.com/embed/0RERLc1bjFA"
            title="AhMyth Android RAT — Full Tutorial | HNCKER"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Section>

      {/* Warning */}
      <WarningBox>
        AhMyth is a <b>Remote Administration Tool</b> designed for security research. Using it to gain unauthorized access to
        any device you do not own, or without the owner's explicit permission, is <b>illegal</b> in most jurisdictions and can
        result in criminal prosecution. This page is for <b>educational and authorized security testing only</b>. You are
        responsible for using this knowledge legally and ethically.
      </WarningBox>

      {/* Overview */}
      <Section id="overview" icon="🕵️" title="What is AhMyth?" subtitle="An open-source Android RAT for penetration testing">
        <p>
          <b>AhMyth</b> (commonly called the <b>AhMyth Android RAT</b>) is a free, open-source remote administration tool. It
          works in two parts: a desktop <b>server</b> (built with Electron) and an <b>Android payload</b> you build from the same
          app. When the payload APK is installed on a device, that device connects back to your server and you get a full
          control panel — a "Lab" — for it.
        </p>
        <p>
          Because the payload can be merged into a legitimate APK (an <b>APK merger</b>), it can look like a normal app, which is
          exactly why it must only be used in controlled, authorized environments.
        </p>
        <FeatureGrid items={[
          { i: '💬', t: 'Read messages', d: 'View SMS, contacts and full call logs from the target device.' },
          { i: '📍', t: 'Live location', d: 'Track real-time GPS coordinates on a map inside the dashboard.' },
          { i: '📁', t: 'File access', d: 'Browse, upload and download files stored on the device.' },
          { i: '🎥', t: 'Camera & mic', d: 'Remotely activate the front/rear camera and microphone.' },
          { i: '🗣️', t: 'Audio & calls', d: 'Interact with the microphone and call features for testing.' },
          { i: '📶', t: 'Lightweight', d: 'Runs over the network; no root required on the Android device.' },
        ]} />
      </Section>

      {/* Requirements */}
      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before installing">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', '64-bit Linux distribution (Ubuntu, Kali, Linux Mint recommended)'],
            ['☑️', 'Java 11 JDK — needed to decompile, build and sign the APK'],
            ['☑️', 'Node.js & npm — required to run the Electron server'],
            ['☑️', 'git — to clone the repository'],
            ['☑️', 'zipalign — Android build tool (only needed on 32-bit Linux)'],
            ['☑️', 'An Android device or emulator for the payload (unrooted is fine)'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Installation */}
      <Section id="installation" icon="🛠️" title="Installation on Kali Linux" subtitle="Auto-install (recommended) + manual method">
        <p className="text-xs text-slate-400">First, make sure the prerequisites are present. On Kali/Ubuntu:</p>
        <CodeBlock title="prerequisites.sh" lines={`sudo apt-get update
sudo apt-get install -y git openjdk-11-jdk* nodejs npm zipalign`} />

        <h3 className="text-sm font-bold text-white pt-2">Option A — Auto Installation (recommended)</h3>
        <div className="space-y-3">
          <Step n={1} title="Clone the repository">
            Download a copy of AhMyth from the official fork.
          </Step>
          <CodeBlock title="terminal" lines={`git clone https://GitHub.com/Morsmalleo/AhMyth
cd AhMyth/AhMyth-Server`} />
          <Step n={2} title="Run the auto installer">
            The <span className="font-mono">autoinstall_linux</span> script installs all Node dependencies and build tools automatically.
          </Step>
          <CodeBlock title="terminal" lines={`sudo ./autoinstall_linux`} />
          <Step n={3} title="Launch AhMyth">
            Start the dashboard from a terminal (or use the <span className="font-mono">ahmyth</span> shortcut the installer creates).
          </Step>
          <CodeBlock title="terminal" lines={`ahmyth            # system shortcut
# or
./start_linux`} />
        </div>

        <h3 className="text-sm font-bold text-white pt-4">Option B — Manual Installation</h3>
        <div className="space-y-3">
          <Step n={1} title="Clone and enter the server directory" />
          <CodeBlock title="terminal" lines={`git clone https://GitHub.com/Morsmalleo/AhMyth
cd AhMyth/AhMyth-Server`} />
          <Step n={2} title="Install Electron 11 locally" />
          <CodeBlock title="terminal" lines={`npm install electron@11.0.0`} />
          <Step n={3} title="Start the server" />
          <CodeBlock title="terminal" lines={`npm start
# or, if Electron hits a sandbox error on Linux:
npx electron ./app --no-sandbox start
# or simply:
./start_linux`} />
        </div>
      </Section>

      {/* Usage */}
      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Build a payload, install it, and take control">
        <div className="space-y-3">
          <Step n={1} title="Open the Victims tab">
            Once the server is running you'll see the main dashboard with a <b>Victims</b> panel (and the builder on the left).
          </Step>
          <Step n={2} title="Build the payload APK">
            Use the built-in <b>APK Builder</b>. You can generate a <b>standalone payload</b> or merge the agent into an
            original APK (APK merger) so it behaves like a normal app. Set your server's IP and the listening port, then build.
          </Step>
          <CodeBlock title="Payload connection detail" lines={`Server IP : your machine's IP (LAN or forwarded public IP)
Port      : 3333 (default listener — keep it open)  `} />
          <Step n={3} title="Install the APK on your test device">
            Transfer the generated <span className="font-mono">Payload.apk</span> to your own Android device and install it.
            Allow <b>"Install from unknown sources"</b> and grant the permissions the app requests.
          </Step>
          <Step n={4} title="Take control from the Lab">
            The device appears in <b>Victims</b>. Click it to open its <b>Lab</b> — read messages, view location, browse files,
            and trigger the camera or microphone.
          </Step>
          <InfoBox title="Same-network testing tip">
            For local lab testing, keep the target device on the <b>same Wi-Fi/LAN</b> as your server so it can reach your IP:port
            directly. For remote tests you must forward the port or use a tunnel, and only ever with authorization.
          </InfoBox>
        </div>
      </Section>

      {/* Screenshots */}
      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="The AhMyth dashboard in action">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <img src="/assets/tools/ahmyth/ahmyth_logo.png" alt="AhMyth Android RAT logo" width="1280" height="860"
              className="w-full h-auto object-contain" loading="lazy" />
            <figcaption className="px-4 py-2 text-xs text-slate-400">AhMyth — open-source Android RAT</figcaption>
          </figure>
          <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <img src="/assets/tools/ahmyth/ahmyth_location_track_screen.png" alt="AhMyth live GPS location tracking screen" width="592" height="634"
              className="w-full h-auto object-contain" loading="lazy" />
            <figcaption className="px-4 py-2 text-xs text-slate-400">Live location tracking in the Victim's Lab</figcaption>
          </figure>
        </div>
      </Section>

      {/* Known issues */}
            <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Server builder</div>
            <div className="text-xs text-slate-400">Compiles a custom APK with your listener IP and port baked in.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Listener</div>
            <div className="text-xs text-slate-400">Opens the connection handler that receives victim sessions.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Persistent connection</div>
            <div className="text-xs text-slate-400">The app keeps the connection alive to the server.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">File manager</div>
            <div className="text-xs text-slate-400">Browse and pull files from the target device.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Camera / mic</div>
            <div className="text-xs text-slate-400">Stream the device camera and microphone (test setups only).</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">SMS / call logs</div>
            <div className="text-xs text-slate-400">Read the messages and call history on the device.</div>
          </div>
          <div key="k6" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Geolocation</div>
            <div className="text-xs text-slate-400">Fetch the device GPS location.</div>
          </div>
        </div>
      </Section>

<Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="Electron sandbox error on Linux — app won't start"
            fix="Launch with the no-sandbox flag: npx electron ./app --no-sandbox start, or use ./start_linux which applies it. If the build tools are missing, re-run sudo ./autoinstall_linux."
          />
          <IssueRow
            issue="APK Builder shows 'Please select a payload' / build fails"
            fix="Make sure the Java 11 JDK is installed and in PATH (java -version). Re-install the full JDK with sudo apt-get install -y openjdk-11-jdk*, then restart the server. Old npm packages also cause this — run npm install && npm audit fix."
          />
          <IssueRow
            issue="Payload connects but device doesn't appear in Victims"
            fix="The target can't reach your server. Confirm both are on the same network, your firewall allows the port (default 3333), and the server is actually listening. On remote setups verify port forwarding / tunnel."
          />
          <IssueRow
            issue="APK is blocked or flagged by Play Protect / antivirus"
            fix="Expected for RAT payloads. For lab use, temporarily disable Play Protect on the TEST device or install via adb with --allow-test-only. Never distribute payloads to real users."
          />
          <IssueRow
            issue="'command not found: npm' / Node errors during install"
            fix="Install Node.js and npm, then add npm to PATH. On Kali: sudo apt-get install -y nodejs npm. If npm is missing entirely, install the current LTS Node from nodesource."
          />
          <IssueRow
            issue="Old repository (AhMyth/AhMyth) is broken or unmaintained"
            fix="Use the maintained fork Morsmalleo/AhMyth. The original repo is old; the fork keeps installers, the wiki and bug fixes up to date."
          />
        </div>
      </Section>

      {/* Repos & resources */}
      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links for downloads, wiki and issues">
        <div className="space-y-2">
          {[
            ['📦', 'Maintained fork (recommended)', 'https://github.com/Morsmalleo/AhMyth'],
            ['📚', 'Official wiki (setup guides per OS)', 'https://github.com/Morsmalleo/AhMyth/wiki'],
            ['🐛', 'Report issues / troubleshooting', 'https://github.com/Morsmalleo/AhMyth/issues'],
            ['🧩', 'Original repository (older)', 'https://github.com/AhMyth/AhMyth'],
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

      {/* Disclaimer */}
      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you build anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized security-testing purposes</b>. AhMyth is a
          powerful tool: using it against any device without the owner's permission is a crime in most jurisdictions and may carry
          serious penalties. Use it only on your own hardware, on practice VMs, or inside a lab where you have written permission.
          The author and this site are not responsible for any misuse of this information.
        </p>
      </Section>
    </ToolLayout>
  )
}
