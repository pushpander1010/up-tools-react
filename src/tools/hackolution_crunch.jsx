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
  { q: "What is Crunch?", a: "Crunch is a free, open-source wordlist generator on Kali. It builds every combination for a length range and charset, or fills pattern templates with placeholders, plus word-permutation mode." },
  { q: "Is using Crunch legal?", a: "Crunch itself is legitimate open-source software. Using generated lists against accounts without explicit written permission is illegal. Generate and test only for labs or signed engagements with agreed scope." },
  { q: "How do I install Crunch?", a: "It ships with Kali. Elsewhere run sudo apt install crunch -y. Running bare crunch shows usage and version." },
  { q: "How do I make a PIN list?", a: "Run crunch 4 4 0123456789 -o pins.txt for all 10,000 four-digit codes. Adjust lengths and charset for longer codes — mind the size preview." },
  { q: "How do patterns work?", a: "The -t template fixes literal characters and fills @ (lower), comma (upper), % (digit), ^ (symbol) per slot. Fixed shapes keep lists small and targeted." },
  { q: "What does permutation mode do?", a: "The -p flag emits every ordering of given words regardless of lengths — modeling password habits built from a few known words plus seasons and years." },
  { q: "Why is my list enormous?", a: "Combinatorics explode: each added slot multiplies by charset size. Fix positions with patterns, shrink lengths, and split output with -b." },
  { q: "How do defenders beat wordlists?", a: "Long random passphrases, unique passwords per service via managers, MFA everywhere, and lockouts with alerting on guessing." }
]

const howItWorks = [
  "Define the lab password policy or known pattern first.",
  "Preview size with a dry run before writing anything.",
  "Generate the fitted list with lengths, patterns, or permutation.",
  "Split large outputs and use only inside the agreed scope.",
  "Mandate managers, MFA, and lockouts from the size lessons."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Crunch Wordlist Generator — Custom Password List Guide',
      description: 'Step-by-step reference: build custom password lists with Crunch patterns. Lab use only.',
      about: 'Crunch combinatorial wordlist generator',
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

export default function hackolution_crunch() {
  return (
    <ToolLayout
      title="Crunch Wordlist Generator"
      desc="Step-by-step reference: build custom password lists with Crunch patterns. Lab use only."
      icon="🍪"
      iconBg="linear-gradient(135deg, rgba(255,204,0,0.18), rgba(251,146,60,0.08))"
      category="security"
      slug="hackolution/crunch"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Crunch Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for pattern-based lists, size math, and the passphrases that resist them.
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
        Crunch generates password candidates for credential testing. Using generated lists against any system without explicit written permission is strictly prohibited and illegal. Generate and use wordlists <b>only for lab machines or engagements covered by a signed authorization</b>, with agreed account scope. Never apply wordlists to other people accounts.
      </WarningBox>

      <Section id="overview" icon="🍪" title="What is Crunch?" subtitle="Combinatorial wordlist generation on Kali">
        <p>
          <b>Crunch</b> is a free, open-source <b>wordlist generator</b> on Kali Linux. You declare a length range and a character set — or a literal pattern with placeholders — and it produces <b>every matching combination</b>, from targeted PIN lists to full alphanumeric spaces.
        </p>
        <p>
          Authorized testers use it when stock wordlists miss: a lab policy requiring exactly 8 characters with a digit, a known prefix on every password, a year suffix pattern. Crunch builds precisely that list — and its size math teaches why long random passwords win.
        </p>
        <FeatureGrid items={[
          { i: '🔢', t: 'Length Ranges', d: 'Generate every string from min to max length.' },
          { i: '🧩', t: 'Pattern Placeholders', d: '@ lower, comma upper, % digits, ^ symbols.' },
          { i: '📏', t: 'Size Preview', d: 'Shows list size before writing a single byte.' },
          { i: '✂️', t: 'Split Output', d: 'Chunks giant lists into manageable files.' },
          { i: '🔤', t: 'Custom Charsets', d: 'Any alphabet, from hex to full keyboard.' },
          { i: '🔁', t: 'Permutation Mode', d: 'Reorders known words into every arrangement.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Crunch on Linux">
        <p className="text-xs text-slate-400">Crunch ships preinstalled on Kali. On other Debian systems install with apt:</p>
        <CodeBlock title="terminal" lines={`sudo apt install crunch -y`} />
        <InfoBox title="Check the version">
          Run crunch without arguments to see usage and version. Wordlists can explode to terabytes — always read the size preview and use -o plus -b splitting for big jobs.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Numeric PIN List" subtitle="Build a 4-digit code list">
        <p className="text-xs text-slate-400">Generate every 4-digit PIN for an authorized lab lock test:</p>
        <CodeBlock title="terminal" lines={`crunch 4 4 0123456789 -o pins.txt`} />
        <InfoBox title="Length and charset">
          The first numbers set min and max length, then comes the charset. Four digits means exactly 10,000 lines — the preview confirms before writing a byte.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Pattern Passwords" subtitle="Fix known positions with placeholders">
        <p className="text-xs text-slate-400">Build lab passwords with a known prefix, two lowercase, and two digits:</p>
        <CodeBlock title="terminal" lines={`crunch 8 8 -t Lab@@,%% -o labpass.txt`} />
        <InfoBox title="Placeholder alphabet">
          The -t pattern fixes literal characters and fills placeholders: @ lowercase, comma uppercase, % digit, ^ symbol. Eight fixed-shape slots stay small enough to actually use.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Permute Known Words" subtitle="Reorder leaked words into combos">
        <p className="text-xs text-slate-400">Permute a small set of known lab words into every order:</p>
        <CodeBlock title="terminal" lines={`crunch 1 1 -p summer winter 2024 !`} />
        <InfoBox title="Permutation math">
          The -p flag ignores lengths and emits every ordering of the given words — 4 words means 24 lines. It models fans who append seasons and years to one base password.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Crunch generating a lab wordlist">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/crunch/crunch_logo.jpg" alt="Crunch wordlist generator logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Crunch run — patterned candidates streaming to file</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Crunch Lists Enable" subtitle="Authorized lab testing outcomes">
        <FeatureGrid items={[
          { i: '🎯', t: 'Policy-Fitted Lists', d: 'Candidates matching exact lab password rules.' },
          { i: '🔢', t: 'PIN Coverage', d: 'Complete numeric spaces for authorized lock tests.' },
          { i: '🧩', t: 'Pattern Hits', d: 'Known-prefix and suffix habits converted to lists.' },
          { i: '🔁', t: 'Combo Permutations', d: 'Every ordering of leaked words tested.' },
          { i: '📏', t: 'Crack-Time Lessons', d: 'Size math proving long-random superiority.' },
          { i: '📦', t: 'Reusable Lists', d: 'Saved, split files shared across lab phases.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Output would fill the disk"
            fix="Read the preview and abort giant jobs. Narrow lengths, fix more pattern positions, or split with -b so files stay usable."
          />
          <IssueRow
            issue="Pattern ignored my charset"
            fix="The -t pattern overrides plain charsets — placeholders define the alphabet per slot. Use -f with charset files for non-default alphabets."
          />
          <IssueRow
            issue="Permutation explodes"
            fix="Word count factorial grows brutally — 8 words means 40,320 lines. Keep -p sets tiny and targeted."
          />
          <IssueRow
            issue="Downstream tool rejects the file"
            fix="Check line endings and strip trailing spaces. Split files with -b when tools choke on single giant inputs."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Crunch Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">min max charset</div>
            <div className="text-xs text-slate-400">Length range plus the alphabet to combine.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-t &lt;pattern&gt;</div>
            <div className="text-xs text-slate-400">Fixed template with @ , % ^ placeholders.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Write the list to a file instead of stdout.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-b &lt;size&gt;</div>
            <div className="text-xs text-slate-400">Split output into files of the given size.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-p words...</div>
            <div className="text-xs text-slate-400">Permute the given words in every order.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-f &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Load named charsets for custom alphabets.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Crunch Repository', 'https://github.com/crunchsec/crunch'],
            ['📖', 'Crunch Usage Documentation', 'https://github.com/crunchsec/crunch#usage'],
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
