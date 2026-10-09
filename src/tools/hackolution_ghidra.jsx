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
  { q: "What is Ghidra?", a: "Ghidra is a free, open-source reverse engineering suite from the NSA. It disassembles binaries, decompiles them to C-like pseudocode, graphs functions, and supports Python and Java scripting plus team collaboration." },
  { q: "Is using Ghidra legal?", a: "Ghidra itself is legitimate open-source software. Reversing binaries without the owner written permission may break laws and licenses. Work only on your own code, open-source software, crackmes, or signed targets." },
  { q: "How do I install Ghidra?", a: "Install OpenJDK 17, download the release zip from the official NSA repository, unzip, and run ./ghidraRun. Keep one project per lab binary." },
  { q: "How do I decompile a binary?", a: "Create a project, import the file, accept auto-analysis, then double-click functions to read pseudocode. Follow XREFs from user input to dangerous calls." },
  { q: "What should I rename first?", a: "The main flow, input buffers, and validation checks. Descriptive names turn assembly noise into an auditable story for you and your team." },
  { q: "How is Ghidra different from strings or objdump?", a: "Those show fragments. Ghidra rebuilds structure: functions, types, graphs, and decompiled logic you can navigate and annotate as one model." },
  { q: "Why is my binary not decompiling?", a: "Run auto-analysis, verify the architecture setting, and check for packing. Packed samples need unpacking before any static tool helps." },
  { q: "Can teams share a Ghidra project?", a: "Yes. The Ghidra Server hosts shared projects so analysts split functions, share comments, and merge progress on one binary." }
]

const howItWorks = [
  "Install Java 17 and launch Ghidra from the official release zip.",
  "Import your authorized lab binary and run full auto-analysis.",
  "Read the decompiler output, rename variables, and map input flows.",
  "Script repetitive searches and document every security-relevant finding.",
  "Report hardcoded secrets, unsafe calls, and logic flaws, then verify fixes."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Ghidra Reverse Engineering Suite — Binary Decompilation & Analysis Guide',
      description: 'Step-by-step reference: decompile lab binaries with NSA Ghidra & its decompiler. Lab use only.',
      about: 'Ghidra NSA software reverse engineering',
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

export default function hackolution_ghidra() {
  return (
    <ToolLayout
      title="Ghidra Reverse Engineering Suite"
      desc="Step-by-step reference: decompile lab binaries with NSA Ghidra & its decompiler. Lab use only."
      icon="🐉"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(255,204,0,0.08))"
      category="security"
      slug="hackolution/ghidra"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Ghidra Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for decompiler basics, function graphs, and how analysts read lab binaries.
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
        Ghidra disassembles and decompiles executable code. Reverse-engineering software without the owner written permission may violate laws, licenses, and platform terms. Analyze <b>only your own binaries, open-source software, crackmes, or targets covered by a signed authorization</b>. Never upload unknown malware to public sandboxes or run suspicious binaries outside an isolated VM.
      </WarningBox>

      <Section id="overview" icon="🐉" title="What is Ghidra?" subtitle="The NSA open-source reverse engineering suite">
        <p>
          <b>Ghidra</b> is a free, open-source <b>software reverse engineering suite</b> released by the NSA. Load a compiled binary and it disassembles machine code, reconstructs functions, and lifts them into readable C-like pseudocode with its built-in <b>decompiler</b>.
        </p>
        <p>
          Analysts use it to understand lab binaries without source: rename variables, map cross-references, script repetitive work in Python or Java, and collaborate through the shared Ghidra Server. For CTF reversing, malware training, and authorized audits it is the industry-standard free toolkit.
        </p>
        <FeatureGrid items={[
          { i: '📜', t: 'C-Like Decompiler', d: 'Reads assembly as pseudocode instead of raw instructions.' },
          { i: '🗺️', t: 'Function Graphs', d: 'Visual control flow for following lab binary logic.' },
          { i: '🐍', t: 'Python & Java Scripting', d: 'Automates renaming, patching analysis, and bulk tasks.' },
          { i: '🤝', t: 'Shared Projects', d: 'Ghidra Server lets teams reverse one binary together.' },
          { i: '🧬', t: 'Many Architectures', d: 'x86, ARM, MIPS, and firmware targets supported.' },
          { i: '🔬', t: 'Emulator & Debugger', d: 'Steps through lab code with controlled execution.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Ghidra on Linux">
        <p className="text-xs text-slate-400">Ghidra needs a 64-bit Java runtime, then runs from its release zip:</p>
        <CodeBlock title="terminal" lines={`sudo apt install openjdk-17-jdk -y
unzip ghidra_11.*.zip -d ~/tools
cd ~/tools/ghidra_11.*/ && ./ghidraRun`} />
        <InfoBox title="First-launch notes">
          Download releases only from the official NSA Ghidra GitHub. The first launch creates a project directory — keep one project per lab binary. Allocate extra RAM in the launch script for large binaries.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Open & Auto-Analyze" subtitle="Decompile your first lab binary">
        <p className="text-xs text-slate-400">Create a project, import a crackme you own, and run auto-analysis:</p>
        <CodeBlock title="terminal" lines={`# File > New Project > Non-Shared Project
# File > Import File > crackme (format auto-detected)
# Yes > Analyze when prompted`} />
        <InfoBox title="Navigating results">
          Double-click functions in the Symbol Tree to jump to decompiled pseudocode. Follow cross-references (XREFs) to see where inputs flow — user input reaching dangerous calls is where lab vulnerabilities live.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Rename & Restructure" subtitle="Turn assembly into readable logic">
        <p className="text-xs text-slate-400">Rename unknowns and rebuild data types as you understand the lab binary:</p>
        <CodeBlock title="terminal" lines={`# L on a variable: rename it (e.g. user_input)
# T on a struct: retarget data types
# ; adds a comment at the cursor`} />
        <InfoBox title="Why renaming matters">
          Good names convert cryptic FUN_00101234 code into an auditable story: main reads input, check validates length, vuln copies without bounds. Comment every decision — future you and teammates rely on it.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Script the Boring Parts" subtitle="Automate with Python scripts">
        <p className="text-xs text-slate-400">Run a bundled Python script or write one in the Script Manager:</p>
        <CodeBlock title="terminal" lines={`# Window > Script Manager > findcrypt.py > Run
# custom: iterate functions, print names and XREF counts`} />
        <InfoBox title="Scripting wins">
          Scripts find crypto constants, string usage, and imported functions across huge binaries in seconds. Save custom scripts per engagement — they compound into a personal reversing toolkit.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Ghidra decompiler on a lab binary">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/ghidra/ghidra_logo.jpg" alt="Ghidra reverse engineering suite logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Ghidra listing plus decompiler — reading lab binary logic</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Ghidra Analysis Finds" subtitle="Common discoveries from reversing labs">
        <FeatureGrid items={[
          { i: '🔓', t: 'Hardcoded Secrets', d: 'Keys and passwords embedded in lab binaries.' },
          { i: '💥', t: 'Unsafe Functions', d: 'strcpy and sprintf calls begging for overflows.' },
          { i: '🔑', t: 'Auth Logic Flaws', d: 'Client-side checks bypassable in authorized tests.' },
          { i: '📡', t: 'Hidden Endpoints', d: 'URLs and protocols the UI never mentions.' },
          { i: '🧩', t: 'Crypto Misuse', d: 'Custom ciphers and embedded keys to document.' },
          { i: '🗺️', t: 'Full Call Maps', d: 'Every function and cross-reference charted.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Decompiler shows nothing"
            fix="Run Analysis > Auto Analyze or press A. Some packed lab binaries need unpacking first — check entropy and packer signatures."
          />
          <IssueRow
            issue="Wrong architecture detected"
            fix="Set the language manually during import (for example ARM vs x86). Firmware blobs often need a base address from their load map."
          />
          <IssueRow
            issue="Ghidra runs out of memory"
            fix="Raise the max RAM in the launch configuration and close other projects. Huge binaries legitimately need 8GB or more."
          />
          <IssueRow
            issue="Scripts will not run"
            fix="Enable the scripting tool and match the Python version Ghidra expects. Run bundled examples first to confirm the environment."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Ghidra Views & Actions" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Decompiler Window</div>
            <div className="text-xs text-slate-400">C-like pseudocode for the selected function.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Function Graph</div>
            <div className="text-xs text-slate-400">Visual blocks and branches of program logic.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Symbol Tree</div>
            <div className="text-xs text-slate-400">Every function, label, and import in the binary.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">XREFs</div>
            <div className="text-xs text-slate-400">Cross-references: who calls and touches what.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Script Manager</div>
            <div className="text-xs text-slate-400">Bundled and custom Python/Java automation.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Data Type Manager</div>
            <div className="text-xs text-slate-400">Rebuild structs the analysis missed.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Ghidra GitHub Repository', 'https://github.com/NationalSecurityAgency/ghidra'],
            ['📖', 'Ghidra Installation Guide', 'https://github.com/NationalSecurityAgency/ghidra#install'],
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
