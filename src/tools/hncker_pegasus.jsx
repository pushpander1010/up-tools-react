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
  { q: 'What is Pegasus Pro?', a: 'Pegasus Pro is an open-source Android penetration testing toolkit written in Python. It bundles WiFi attack tools, a network scanner, payload generation and device management into a single menu-driven interface.' },
  { q: 'Is Pegasus Pro legal?', a: 'The tool itself is open source (MIT) and legal to use for authorized security testing. Using it to attack a device you do not own, or without written permission, is illegal. Only test your own devices or systems you are authorized to assess.' },
  { q: 'What do I need to run it?', a: 'Python, and an environment like Termux on Android or Kali Linux. It is cross-platform and also runs on Windows and macOS with the required dependencies installed.' },
  { q: 'How do I install it?', a: 'Clone the repository, move into the folder, then launch it: git clone https://github.com/H4ckethics138/Pegasusa-proV2.7.git, cd Pegasusa-proV2.7, then Python Main.py.' },
  { q: 'What can it do?', a: 'It provides WiFi attack tools, network scanning, payload generation, device management and Android security checks from one menu.' },
  { q: 'Where should I run it?', a: 'Termux on a rooted or test Android device, or any Linux distribution such as Kali. Always on hardware you own or are authorized to test.' },
]

const howItWorks = [
  'Clone the Pegasus Pro repository from GitHub.',
  'Move into the project folder.',
  'Launch the toolkit with Python Main.py.',
  'The menu loads with options like Payload Generator, WiFi Tools and Network Scanner.',
  'Pick an option and run it against a device you own or are authorized to test.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Pegasus Pro — Android Pentesting Toolkit (Educational)',
      description: 'Complete step-by-step reference for installing and using Pegasus Pro, a Python menu-driven Android penetration testing toolkit. Education and authorized testing only.',
      about: 'Pegasus Pro Android pentesting toolkit',
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

export default function hncker_pegasus() {
  return (
    <ToolLayout
      title="Pegasus Pro — Android Pentesting Toolkit"
      desc="Step-by-step reference: install & use Pegasus Pro, a Python menu toolkit for Android penetration testing. Educational purposes only."
      icon="🐎"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/pegasus"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/pegasus/pegasus_scan.png" />
      </Helmet>

      {/* Video Tutorial */}
      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the full Pegasus Pro walkthrough">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl border border-white/10"
            src="https://www.youtube.com/embed/GKoWjCmPZEM"
            title="Pegasus Pro Android Pentesting Toolkit — Full Tutorial | HNCKER"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Section>

      <WarningBox>
        Pegasus Pro is a security testing toolkit. Use it <b>only on devices you own or are explicitly authorized to
        test</b>. Attacking someone else's phone or network without permission is a crime in most jurisdictions and
        violates platform terms. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🛡️" title="What is Pegasus Pro?" subtitle="Android penetration testing in one Python menu">
        <p>
          <b>Pegasus Pro</b> is an open-source <b>Android penetration testing toolkit</b> written in <b>Python</b>. Instead
          of juggling a dozen separate tools, it bundles <b>WiFi attack tools, a network scanner, payload generation and
          device management</b> into a single, easy-to-navigate menu.
        </p>
        <p>
          It is designed to run on <b>Termux</b> or <b>Kali Linux</b>, giving an ethical hacker or security student one clean
          interface for common Android pentesting tasks. Version 2.0 is released under the <b>MIT license</b>.
        </p>
        <FeatureGrid items={[
          { i: '📶', t: 'WiFi tools', d: 'Scan and assess wireless networks around you.' },
          { i: '🔍', t: 'Network scanner', d: 'Discover devices and services on a network.' },
          { i: '🎯', t: 'Payload generation', d: 'Generate payloads for authorized testing.' },
          { i: '📱', t: 'Device management', d: 'Control and inspect connected Android devices.' },
          { i: '🛡️', t: 'Android security', d: 'Check device security posture.' },
          { i: '🧩', t: 'Menu-driven', d: 'One clean interface — no juggling separate tools.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Python 3 installed'],
            ['☑️', 'Termux (Android) or Kali Linux / any Unix-like system'],
            ['☑️', 'Git to clone the repository'],
            ['☑️', 'A device you own or are authorized to test'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Three commands to get started">
        <p className="text-xs text-slate-400">Step 1 — clone the repository:</p>
        <CodeBlock title="terminal" lines={`git clone https://github.com/H4ckethics138/Pegasusa-proV2.7.git`} />
        <p className="text-xs text-slate-400">Step 2 — move into the folder:</p>
        <CodeBlock title="terminal" lines={`cd Pegasusa-proV2.7`} />
        <p className="text-xs text-slate-400">Step 3 — launch the toolkit:</p>
        <CodeBlock title="terminal" lines={`Python Main.py`} />
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Launch the toolkit and pick an option">
        <p>
          Once you run <span className="font-mono">Python Main.py</span>, the Pegasus Pro menu loads with numbered options
          such as Payload Generator, WiFi Attack Tools, Network Scanner and Device Manager. Enter the number of the option
          you want and follow the prompts.
        </p>
        <InfoBox title="Menu options">
          The main menu typically lists <span className="font-mono">[1] Payload Generator</span>, <span className="font-mono">[2]
          WiFi Tools</span>, <span className="font-mono">[3] Network Scanner</span> and <span className="font-mono">[0] Exit</span>.
          Run these <b>only against your own devices or authorized targets</b>.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Pegasus Pro in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/pegasus/pegasus_scan.png" alt="Pegasus Pro toolkit menu loading in the terminal" width="1080" height="1920"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Pegasus Pro menu launching in the terminal</figcaption>
        </figure>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Common problems, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="Python not found when running Python Main.py"
            fix={'Make sure Python 3 is installed and on your PATH. On Termux run pkg install python, on Kali run apt install python3. If both Python and Python3 exist, try python3 Main.py.'}
          />
          <IssueRow
            issue="Some menu options fail or crash"
            fix={'Several options need extra tools (like aircrack-ng for WiFi or metasploit for payloads). Install the listed dependencies for the option you are using, then re-launch the toolkit.'}
          />
          <IssueRow
            issue="Tool needs root or extra permissions"
            fix="Some WiFi and network features require a rooted device or additional permissions. Use a dedicated test device you own and grant the permissions the tool asks for."
          />
          <IssueRow
            issue="git clone says repository not found"
            fix="Double-check the URL: git clone https://github.com/H4ckethics138/Pegasusa-proV2.7.git. Make sure you copied the full repository path."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official repository', 'https://github.com/H4ckethics138/Pegasusa-proV2.7'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you run anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized security testing purposes</b>. Pegasus
          Pro is a powerful toolkit — running it against a device, network or person without explicit written permission is
          <b> illegal</b> and can carry serious legal consequences. Use it only on hardware you own or have clear
          authorization to assess. The authors and this site are not responsible for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
