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
  { q: "What is Binwalk?", a: "Binwalk is a free, open-source firmware analysis tool. It scans device images for embedded file systems, kernels, and certificates by signature, then extracts them for review, with entropy graphs for encrypted regions." },
  { q: "Is using Binwalk legal?", a: "Binwalk itself is legitimate open-source software. Analyzing firmware without the owner written permission may break laws and licenses. Work only on your own devices, vendor images, or signed targets." },
  { q: "How do I install Binwalk?", a: "Run sudo apt install binwalk -y plus squashfs-tools, jefferson, and ubi-reader for extraction power. Verify with binwalk --help." },
  { q: "How do I extract a firmware image?", a: "Run binwalk firmware.bin to map it, then binwalk -eM firmware.bin to recursively carve everything. Browse the output for credentials, keys, and configs." },
  { q: "What are the best first findings?", a: "Default root passwords, private TLS keys, backdoor accounts, and unsigned update mechanisms — all readable from extracted file systems." },
  { q: "What does high entropy mean?", a: "Compression or encryption. Compressed regions still extract; encrypted ones block static review and should be reported as assessment boundaries." },
  { q: "Why did extraction produce nothing?", a: "Missing unpacker helpers or a proprietary packer. Install helpers, verify signatures manually, and unpack vendor formats before rescanning." },
  { q: "How does Binwalk pair with Ghidra?", a: "Binwalk extracts the binaries; Ghidra reverses them. Carve interesting executables from the rootfs and load them into Ghidra for logic-level review." }
]

const howItWorks = [
  "Install Binwalk plus extractor helpers and verify with binwalk --help.",
  "Map your authorized firmware image with binwalk firmware.bin.",
  "Extract everything with binwalk -eM and review configs for secrets.",
  "Graph entropy and sweep strings for encrypted blobs and credentials.",
  "Load key binaries into Ghidra, then report and remediate every finding."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Binwalk Firmware Analyzer — Embedded Image Extraction & Audit Guide',
      description: 'Step-by-step reference: extract firmware images & spot backdoors with Binwalk. Lab use only.',
      about: 'Binwalk firmware reverse engineering',
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

export default function hackolution_binwalk() {
  return (
    <ToolLayout
      title="Binwalk Firmware Analyzer"
      desc="Step-by-step reference: extract firmware images & spot backdoors with Binwalk. Lab use only."
      icon="🔧"
      iconBg="linear-gradient(135deg, rgba(251,146,60,0.18), rgba(255,204,0,0.08))"
      category="security"
      slug="hackolution/binwalk"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Binwalk Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for firmware extraction, hidden file systems, and the update hygiene that protects devices.
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
        Binwalk dissects firmware images that may contain credentials, keys, and personal data. Analyzing firmware without the device or image owner explicit written permission may violate laws and licenses. Work <b>only on your own devices, vendor-provided images, or targets covered by a signed authorization</b>. Handle extracted secrets and user data as sensitive, and never flash modified firmware to devices you do not own.
      </WarningBox>

      <Section id="overview" icon="🔧" title="What is Binwalk?" subtitle="X-ray vision for firmware images">
        <p>
          <b>Binwalk</b> is a free, open-source <b>firmware analysis tool</b> by ReFirmLabs (Craig Heffner). Point it at a router, camera, or IoT firmware image and it identifies <b>embedded file systems, kernels, bootloaders, and certificates</b> — then carves them out for inspection.
        </p>
        <p>
          Hardware hackers and authorized auditors use it to open black-box devices: extract the SquashFS root, read default credentials from configs, spot backdoor accounts and private keys, and map the update format before deeper reversing. It is the standard first step of embedded assessment.
        </p>
        <FeatureGrid items={[
          { i: '🔍', t: 'Signature Scanning', d: 'Detects file systems, kernels, and archives by magic bytes.' },
          { i: '📦', t: 'Auto Extraction', d: 'Carves embedded components into browsable folders.' },
          { i: '📊', t: 'Entropy Graphs', d: 'Highlights compressed and encrypted regions visually.' },
          { i: '🧩', t: 'Many Formats', d: 'SquashFS, JFFS2, UBI, TRX, and vendor packers supported.' },
          { i: '🔑', t: 'Secret Surfacing', d: 'Exposes keys, passwords, and certs in extracted trees.' },
          { i: '🧪', t: 'Plugin API', d: 'Custom signatures and extraction rules in Python.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Binwalk on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install via apt plus extraction helpers:</p>
        <CodeBlock title="terminal" lines={`sudo apt install binwalk -y
# recommended helpers:
# sudo apt install squashfs-tools jefferson ubi-reader -y`} />
        <InfoBox title="Extraction dependencies">
          Binwalk detects more than it extracts alone — helper tools unpack SquashFS, JFFS2, and UBI images it finds. Install the full helper set before serious firmware work.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Scan a Firmware Image" subtitle="Map what hides inside">
        <p className="text-xs text-slate-400">Fingerprint a firmware image from your own device or authorized sample:</p>
        <CodeBlock title="terminal" lines={`binwalk firmware.bin`} />
        <InfoBox title="Reading the map">
          Each hit names an offset and type: U-Boot, kernel, SquashFS, certificates. Note the offsets — extraction and entropy work both key off this initial map.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Extract Everything" subtitle="Carve the file systems out">
        <p className="text-xs text-slate-400">Recursively extract every embedded component for review:</p>
        <CodeBlock title="terminal" lines={`binwalk -eM firmware.bin`} />
        <InfoBox title="Exploring the extraction">
          The -e flag extracts and -M recurses into carved files. Browse the output folders for etc/passwd, shadow, config files with credentials, and private keys — the classic firmware findings.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Entropy & Strings" subtitle="Spot encrypted blobs and secrets">
        <p className="text-xs text-slate-400">Graph entropy and sweep printable strings across the image:</p>
        <CodeBlock title="terminal" lines={`binwalk -E firmware.bin
strings firmware.bin | grep -i -E pass|key|admin`} />
        <InfoBox title="What entropy reveals">
          Flat high entropy means encryption or compression — a wall for static review worth reporting. Low-entropy regions with strings leak credentials, URLs, and debug paths directly.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Binwalk dissecting a firmware image">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/binwalk/binwalk_logo.jpg" alt="Binwalk firmware analyzer logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Binwalk scan — embedded file systems mapped by offset</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Binwalk Analysis Finds" subtitle="Common discoveries from firmware images">
        <FeatureGrid items={[
          { i: '🔑', t: 'Default Credentials', d: 'Root passwords baked into extracted configs.' },
          { i: '🗝️', t: 'Private Keys', d: 'Device TLS keys shared across entire fleets.' },
          { i: '🚪', t: 'Backdoor Accounts', d: 'Hidden users and telnet services in the rootfs.' },
          { i: '🧩', t: 'Update Format', d: 'Packer layout needed for deeper reversing work.' },
          { i: '🔓', t: 'Unsigned Updates', d: 'Missing signature checks enabling evil updates.' },
          { i: '📦', t: 'Third-Party Bloat', d: 'Ancient busybox and libraries with known CVEs.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Extraction yields nothing"
            fix="Install the helper unpackers (squashfs-tools, jefferson, ubi-reader) and rerun with -eM. Some vendor packers need manual unpacking first."
          />
          <IssueRow
            issue="False-positive signatures"
            fix="Verify each hit by extracting and file-checking the carve. Raise the minimum match confidence and cross-check with entropy regions."
          />
          <IssueRow
            issue="Encrypted regions everywhere"
            fix="Report the encryption as a finding boundary and pivot to dynamic analysis on the live device you own. Static review stops where strong crypto starts."
          />
          <IssueRow
            issue="Huge image, slow scan"
            fix="Scope with --offset and --length to regions of interest, and skip raw entropy graphs until the signature map says where to look."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Binwalk Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">firmware.bin</div>
            <div className="text-xs text-slate-400">Positional argument: the image to analyze.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-e / -M</div>
            <div className="text-xs text-slate-400">Extract embedded files, recursing into carves.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-E</div>
            <div className="text-xs text-slate-400">Graph entropy to spot encrypted regions.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--dd</div>
            <div className="text-xs text-slate-400">Carve specific signatures to files by type.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--offset / --length</div>
            <div className="text-xs text-slate-400">Limit scanning to a byte window.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-A</div>
            <div className="text-xs text-slate-400">Search for opcode signatures per architecture.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Binwalk GitHub Repository', 'https://github.com/ReFirmLabs/binwalk'],
            ['📖', 'Binwalk Usage Wiki', 'https://github.com/ReFirmLabs/binwalk/wiki'],
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
