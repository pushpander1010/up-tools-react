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
  { q: "What is Steghide?", a: "Steghide is a free, open-source steganography tool on Kali. It hides files inside JPEG, BMP, WAV, or AU covers with optional passphrase encryption, and extracts them with matching commands." },
  { q: "Is using Steghide legal?", a: "Steghide itself is legitimate open-source software. Hiding data to evade oversight, exfiltrate stolen material, or smuggle malware is illegal. Practice only on your own files, CTFs, and classrooms." },
  { q: "How do I install Steghide?", a: "It ships with Kali. Elsewhere run sudo apt install steghide -y and verify with steghide --version." },
  { q: "How do I hide a file?", a: "Run steghide embed with -cf cover, -ef secret, and -p passphrase. Check capacity first with steghide info so the payload fits cleanly." },
  { q: "How do I solve CTF stego images?", a: "Run steghide extract with given or guessed passphrases, trying empty and theme words first. Pair with strings and metadata checks before brute force." },
  { q: "Why did extraction fail?", a: "Wrong passphrase, unsupported format, or a re-compressed cover stripped the payload. Use originals and exact secrets." },
  { q: "How is hidden data detected?", a: "File-size anomalies, statistical analysis, and metadata mismatches betray embeds — the defensive lesson every exercise should end with." },
  { q: "What covers work best?", a: "Noisy high-resolution photos and long audio clips hold the most with least visible change. Flat graphics and tiny files fail fast." }
]

const howItWorks = [
  "Gather your own cover images and secret text files.",
  "Check capacity with steghide info before embedding.",
  "Embed with a strong unique passphrase per exercise.",
  "Practice extraction on CTF images with given secrets.",
  "Study detection tells and metadata hygiene afterward."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Steghide Data Hider — Image Steganography Guide',
      description: 'Step-by-step reference: hide & extract files in images with Steghide. Own files only.',
      about: 'Steghide image audio steganography',
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

export default function hackolution_steghide() {
  return (
    <ToolLayout
      title="Steghide Data Hider"
      desc="Step-by-step reference: hide & extract files in images with Steghide. Own files only."
      icon="🖼️"
      iconBg="linear-gradient(135deg, rgba(179,102,255,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/steghide"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Steghide Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for hidden-data basics, passphrase hygiene, and the metadata that betrays edits.
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
        Steghide conceals files inside images and audio — a dual-use capability. Hiding data to evade lawful oversight, exfiltrate stolen material, or smuggle malicious payloads is strictly prohibited and illegal. Use Steghide <b>only on files you own, CTF stego challenges, or classroom exercises</b>. Never embed payloads in images you share publicly.
      </WarningBox>

      <Section id="overview" icon="🖼️" title="What is Steghide?" subtitle="Invisible ink for images and audio">
        <p>
          <b>Steghide</b> is a free, open-source <b>steganography tool</b> on Kali Linux. It embeds a secret file inside an ordinary <b>JPEG, BMP, WAV, or AU cover file</b> — optionally encrypted with a passphrase — producing output that looks and plays identically.
        </p>
        <p>
          Learners meet it in CTF stego challenges: given a suspicious image, extract its hidden payload with the challenge passphrase. The same commands teach the defensive lesson — metadata, file-size anomalies, and statistical analysis betray hidden content.
        </p>
        <FeatureGrid items={[
          { i: '🖼️', t: 'Image Covers', d: 'JPEG and BMP carriers with no visible change.' },
          { i: '🔊', t: 'Audio Covers', d: 'WAV and AU files carrying hidden payloads.' },
          { i: '🔐', t: 'Passphrase Crypto', d: 'Encrypts embeds so extraction needs the secret.' },
          { i: '📊', t: 'Capacity Report', d: 'Shows how much a cover can hold first.' },
          { i: '🔍', t: 'CTF Extraction', d: 'The standard solver for stego challenges.' },
          { i: '🧹', t: 'Clean Removal', d: 'Covers restore by re-exporting the original.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Steghide on Linux">
        <p className="text-xs text-slate-400">Steghide ships preinstalled on Kali. On other Debian systems install with apt:</p>
        <CodeBlock title="terminal" lines={`sudo apt install steghide -y`} />
        <InfoBox title="Verify quickly">
          Run steghide --version after installing. Keep a folder of your own test images and text files for practice — never experiment on other people media.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Check Capacity" subtitle="See what your cover holds">
        <p className="text-xs text-slate-400">Measure how much data your own image can conceal:</p>
        <CodeBlock title="terminal" lines={`steghide info photo.jpg`} />
        <InfoBox title="Capacity reading">
          The report shows usable bytes after overhead. Pick covers comfortably larger than the secret — tight fits corrupt visibly and fail extraction.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Embed a File" subtitle="Hide your secret with a passphrase">
        <p className="text-xs text-slate-400">Embed your own text file into your own image:</p>
        <CodeBlock title="terminal" lines={`steghide embed -cf photo.jpg -ef secret.txt -p MyPass123`} />
        <InfoBox title="Embed flags">
          The -cf flag sets the cover, -ef the secret file, and -p the passphrase. Use a strong unique passphrase per exercise — weak ones fall to the same cracking you study elsewhere.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Extract & Solve" subtitle="Recover hidden CTF payloads">
        <p className="text-xs text-slate-400">Extract from a challenge image with its given passphrase:</p>
        <CodeBlock title="terminal" lines={`steghide extract -sf challenge.jpg -p ctfpass -xf out.txt`} />
        <InfoBox title="CTF solving flow">
          The -sf flag sets the suspect file and -xf names the output. Try empty and common passphrases first on unknown challenges, then strings and metadata analysis before brute force.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Steghide hiding data in plain sight">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/steghide/steghide_logo.jpg" alt="Steghide data hider logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Steghide embed — identical image, hidden payload inside</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Steghide Exercises Teach" subtitle="Skills from stego practice">
        <FeatureGrid items={[
          { i: '👁️', t: 'Invisible Storage', d: 'Files hidden with zero visual difference.' },
          { i: '🔐', t: 'Passphrase Power', d: 'Encryption deciding extraction success.' },
          { i: '📏', t: 'Capacity Math', d: 'Cover size governing payload limits.' },
          { i: '🔍', t: 'Detection Tells', d: 'Size and statistics betraying hidden data.' },
          { i: '🧩', t: 'CTF Solving', d: 'Standard extraction for challenge images.' },
          { i: '🛡️', t: 'DLP Lessons', d: 'Why filters must inspect inside media.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Unsupported file format"
            fix="Steghide takes JPEG, BMP, WAV, and AU only. Convert PNG covers to BMP or JPEG first with your image tools."
          />
          <IssueRow
            issue="Capacity too small"
            fix="Choose a larger cover or shrink the secret. Compression before embedding helps text payloads fit."
          />
          <IssueRow
            issue="Wrong passphrase failures"
            fix="Passphrases are exact — check case and spaces. On CTFs try empty strings and challenge-theme words before wordlists."
          />
          <IssueRow
            issue="Extracted file corrupt"
            fix="The cover may be re-compressed after embedding (social platforms strip payloads). Work from original challenge files, never re-saved copies."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Steghide Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">info &lt;cover&gt;</div>
            <div className="text-xs text-slate-400">Report capacity and format details.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">embed -cf -ef</div>
            <div className="text-xs text-slate-400">Hide a file inside a cover image or audio.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">extract -sf</div>
            <div className="text-xs text-slate-400">Recover the hidden file from a suspect.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-p &lt;pass&gt;</div>
            <div className="text-xs text-slate-400">Passphrase encrypting and unlocking the embed.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-xf &lt;out&gt;</div>
            <div className="text-xs text-slate-400">Name for the extracted output file.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-f</div>
            <div className="text-xs text-slate-400">Force overwrite of existing outputs.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Steghide Repository', 'https://github.com/StegHide/steghide'],
            ['📖', 'Steghide Usage Documentation', 'https://github.com/StegHide/steghide#usage'],
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
