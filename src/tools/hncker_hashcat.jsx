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
  { q: 'What is Hashcat?', a: 'Hashcat is an open-source password recovery tool that cracks password hashes using GPU acceleration. It tries billions of guesses per second across dictionary, brute-force, combinator and rule-based attacks.' },
  { q: 'Is Hashcat illegal?', a: 'No. Hashcat is a legitimate open-source tool used by security professionals for authorized password recovery and auditing. Using it to crack passwords you do not own or lack permission to test is illegal. Only run it on your own hashes or in an authorized engagement.' },
  { q: 'What does the -m flag do?', a: 'The -m flag sets the hash type (mode). For example -m 0 is MD5, -m 1000 is NTLM, -m 3200 is bcrypt and -m 1800 is sha512crypt. Using the wrong mode means the hash will never match.' },
  { q: 'What is a dictionary attack?', a: 'The -a 0 attack takes a wordlist (like the popular rockyou.txt) and tries each word as the password. Weak, common passwords fall almost instantly. It is the fastest way to crack predictable passwords.' },
  { q: 'What is a brute-force attack?', a: 'The -a 3 attack tries every possible combination of a character set. It works for short numeric pins or simple patterns but the search space explodes as length grows, so long random passwords are effectively uncrackable.' },
  { q: 'What are rules?', a: 'Rules transform base words into many variants (adding digits, capitalizing, appending symbols). Using -r with a rules file turns one wordlist entry into thousands of guesses, catching passwords like Summer → Summer2026!.' },
  { q: 'Why use a password manager?', a: 'A password manager generates and stores long, unique, random passwords for every account. That removes the single biggest cracker advantage: reused and weak human-chosen passwords. Length beats complexity.' },
  { q: 'How do I protect my own passwords?', a: 'Use 12+ random characters, a unique password per account, and a password manager. For extra protection enable multi-factor authentication where possible.' },
]

const howItWorks = [
  'Install Hashcat and ensure a compatible GPU driver is present.',
  'Identify the hash type with hashid or hashcat --example-hashes.',
  'Run a dictionary attack with a wordlist like rockyou.txt.',
  'If needed, escalate to brute-force or rule-based attacks.',
  'Strengthen your own passwords so no attack mode can crack them.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Hashcat — Password Cracker (Educational Guide)',
      description: 'Step-by-step reference for using Hashcat to recover passwords: dictionary, brute-force and rule-based attacks, hash types, and how to defend your own passwords.',
      about: 'Hashcat password recovery tool',
      educationalUse: 'Testing, education, and authorized password recovery only',
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

export default function hncker_hashcat() {
  return (
    <ToolLayout
      title="Hashcat — Password Cracker Guide"
      desc="Step-by-step reference: install & use Hashcat for password recovery — dictionary, brute-force, rules, hash types. Educational purposes only."
      icon="🔑"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/hashcat"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/hashcat/hashcat_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=wB-Jvz__0B4" target="_blank" rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-white/10 no-underline"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img src="https://i.ytimg.com/vi/wB-Jvz__0B4/hqdefault.jpg"
                alt="Hashcat Tutorial - How Hackers Crack Passwords with GPU" loading="lazy"
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">Hashcat — crack passwords, then fix your own</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Hashcat is a legitimate password-recovery tool. Use it <b>only on hashes you own or have written permission
        to recover</b>. Cracking passwords that are not yours is illegal. This page is for <b>educational and
        authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🔑" title="What is Hashcat?" subtitle="The world's fastest password cracker">
        <p>
          <b>Hashcat</b> is an open-source password recovery tool that cracks hashes using <b>GPU acceleration</b>,
          reaching billions of guesses per second. Given a password hash, it repeatedly guesses candidate passwords and
          hashes them until one matches.
        </p>
        <p>
          Security teams use it to audit password strength and recover lost credentials — and to prove why weak,
          reused passwords are dangerous.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'GPU speed', d: 'Billions of guesses per second.' },
          { i: '🎯', t: 'Many attacks', d: 'Dictionary, brute-force, rules, combinator.' },
          { i: '🧩', t: '300+ hash types', d: 'MD5, NTLM, bcrypt, sha512crypt and more.' },
          { i: '🖥️', t: 'Open source', d: 'Free CLI tool, cross-platform.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'A recent GPU (or CPU-only mode with -D 1)'],
            ['☑️', 'A target hash you are authorized to recover'],
            ['☑️', '(Optional) A wordlist like rockyou.txt'],
            ['☑️', 'Linux, Windows (OpenCL) or macOS install'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="debian / ubuntu" lines={`sudo apt install hashcat`} />
        <InfoBox title="macOS">
          Install with Homebrew: <span className="font-mono">brew install hashcat</span>. On any platform you can also
          download prebuilt binaries from the official Hashcat site.
        </InfoBox>
      </Section>

      <Section id="identify" icon="🔍" title="Step 1 — Identify the Hash" subtitle="Wrong type = no match">
        <p className="text-xs text-slate-400">Figure out the hash type first:</p>
        <CodeBlock title="terminal" lines={`hashid 5f4dcc3b5aa765d61d8327deb882cf99
# [+] MD5`} />
        <InfoBox title="Or use Hashcat's own examples">
          <span className="font-mono">hashcat --example-hashes</span> lists every supported mode with a sample hash so
          you can match your target by eye.
        </InfoBox>
      </Section>

      <Section id="dictionary" icon="📖" title="Step 2 — Dictionary Attack" subtitle="Weak passwords fall instantly">
        <p className="text-xs text-slate-400">Try every word in a wordlist (mode 0 = MD5):</p>
        <CodeBlock title="terminal" lines={`hashcat -m 0 -a 0 hash.txt rockyou.txt
# [FOUND] password123`} />
        <InfoBox title="Attack modes">
          <span className="font-mono">-a 0</span> dictionary, <span className="font-mono">-a 1</span> combinator,
          <span className="font-mono">-a 3</span> brute-force, <span className="font-mono">-a 6/7</span> hybrid.
        </InfoBox>
      </Section>

      <Section id="bruteforce" icon="🔢" title="Step 3 — Brute Force" subtitle="Try every combination">
        <p className="text-xs text-slate-400">Brute-force an 8-digit numeric PIN (masks: ?d = digit):</p>
        <CodeBlock title="terminal" lines={`hashcat -m 0 -a 3 hash.txt ?d?d?d?d?d?d?d?d
# [FOUND] 62810473`} />
        <InfoBox title="Why short still falls">
          8 digits is only 100 million combinations — a GPU runs through them in seconds. Length is what stops brute
          force, not complexity alone.
        </InfoBox>
      </Section>

      <Section id="rules" icon="⚙️" title="Step 4 — Rules & Combos" subtitle="One password becomes thousands of guesses">
        <p className="text-xs text-slate-400">Apply transformation rules to a wordlist:</p>
        <CodeBlock title="terminal" lines={`hashcat -m 0 -a 0 hash.txt rockyou.txt -r best64.rule
# [FOUND] Summer2026!`} />
        <InfoBox title="Rules win">
          Rules add digits, capital letters and symbols to each word, catching patterns humans actually use —
          like turning <span className="font-mono">Summer</span> into <span className="font-mono">Summer2026!</span>.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Make It Uncrackable" subtitle="Beat every attack mode">
        <CodeBlock title="terminal" lines={`hashcat -m 3200 bcrypt.txt rockyou.txt
# [STATUS] exhausted wordlist`} />
        <FeatureGrid items={[
          { i: '🔐', t: 'Long & random', d: '12+ characters, generated, not chosen.' },
          { i: '🔑', t: 'Password manager', d: 'Unique password for every account.' },
          { i: '🧂', t: 'Slow hashes', d: 'bcrypt/argon2 resist even GPU cracking.' },
          { i: '📲', t: 'Multi-factor', d: 'Add a second factor where possible.' },
        ]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Hashcat in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/hashcat/hashcat_scan.png" alt="Hashcat cracking a hash and finding the password" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">A dictionary attack finds the plaintext password</figcaption>
        </figure>
      </Section>

            <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-m, --hash-type</div>
            <div className="text-xs text-slate-400">The hash algorithm to attack: 0=MD5, 1000=NTLM, 3200=bcrypt, 1800=sha512crypt.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-a, --attack-mode</div>
            <div className="text-xs text-slate-400">How to attack: 0 dictionary, 1 combinator, 3 brute-force, 6/7 hybrid.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-w, --workload-profile</div>
            <div className="text-xs text-slate-400">How hard the GPU works, 1 (lowest) to 4 (exhaustive).</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-r, --rules-file</div>
            <div className="text-xs text-slate-400">Apply transformation rules to turn one word into many guesses.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o, --output-file</div>
            <div className="text-xs text-slate-400">Write recovered passwords to a file instead of the terminal.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-D, --device-type</div>
            <div className="text-xs text-slate-400">Choose the compute device: 1 CPU, 2 GPU, 3 FPGA.</div>
          </div>
          <div key="k6" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--show</div>
            <div className="text-xs text-slate-400">Display passwords that were already cracked in earlier runs.</div>
          </div>
          <div key="k7" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--force</div>
            <div className="text-xs text-slate-400">Ignore warnings and run anyway (older GPUs, driver quirks).</div>
          </div>
        </div>
      </Section>

<Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          <IssueRow
            issue="No devices found / OpenCL error"
            fix="Update your GPU driver, or force CPU mode with -D 1. On Linux, install the OpenCL runtime for your GPU vendor first."
          />
          <IssueRow
            issue="Hash never cracks"
            fix="You likely used the wrong -m hash type, or the password is simply too strong. Re-identify the type and try a bigger wordlist with rules."
          />
          <IssueRow
            issue="'No hashes loaded'"
            fix="The hash file format is wrong. Make sure only the raw hash is in the file (one per line, no labels or colons)."
          />
          <IssueRow
            issue="rockyou.txt not found"
            fix="Extract it from /usr/share/wordlists/rockyou.txt.gz with gunzip, or pass the full path to your wordlist."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official Hashcat site', 'https://hashcat.net/hashcat/'],
            ['🐛', 'Hashcat wiki', 'https://hashcat.net/wiki/'],
            ['📖', 'rockyou wordlist (Kali)', 'https://www.kali.org/tools/wordlists/'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you crack anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Hashcat is a
          legitimate password-recovery tool, but using it to crack passwords you do not own or lack written permission
          to recover is illegal. Use it only on your own hashes or within an authorized security engagement. The author
          and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
