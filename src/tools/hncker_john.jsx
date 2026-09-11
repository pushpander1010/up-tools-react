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
  { q: "What is John the Ripper?", a: "John the Ripper (John) is the classic CPU password-hash cracker: feed it a hash file and a wordlist and it reports which passwords match. Auditors use it to prove that weak hashes fall fast — and that slow modern hashes do not." },
  { q: "Is John illegal?", a: "The tool is legal for audits and recovery. Cracking hashes you do not own or lack permission to test is illegal. Practice on your own lab dumps (DVWA, Metasploitable shadow file)." },
  { q: "What does --wordlist do?", a: "--wordlist=rockyou.txt tells John to try every line of that file as the password. Most lab passwords fall here because humans reuse common passwords — the single biggest weakness John exploits." },
  { q: "What are rules (--rules)?", a: "Rules mutate each wordlist entry: add digits, capitalize, append symbols. One base word becomes thousands of guesses, catching real-world patterns like Summer becoming Summer2026!." },
  { q: "What is --show?", a: "--show prints passwords John already cracked from the hash file, so you do not re-crack. Run it first on any file — earlier sessions may have done the work." },
  { q: "How do I crack Linux shadow hashes?", a: "Copy the lab /etc/shadow lines (or unshadow passwd+shadow first), then john --wordlist=rockyou.txt shadow.txt. Lab accounts with weak passwords fall in seconds; strong ones do not." },
  { q: "What is the difference between John and Hashcat?", a: "John runs on CPU and auto-detects many hash formats — easiest start. Hashcat runs on GPU and tries billions per second — fastest finish. Learn the workflow on John, scale to Hashcat." },
  { q: "How do I make my hashes uncrackable?", a: "Store passwords with bcrypt or argon2 (slow, salted), require 12+ random characters via a manager, and add 2FA. Then test with John yourself: an exhausted wordlist with zero cracks is the goal." },
]

const howItWorks = [
  "Install John and grab rockyou.txt.",
  "Crack a lab MD5 with a wordlist.",
  "Add rules to catch mutated passwords.",
  "Crack lab shadow hashes with unshadow.",
  "Re-hash properly: bcrypt/argon2 + 2FA, then re-test.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "John the Ripper — Hash Cracker Guide (Educational)",
      description: "Step-by-step John the Ripper reference: wordlist attacks, rules, shadow cracking, and proper password hashing.",
      about: "John the Ripper hasher",
      educationalUse: 'Testing, education, and authorized use only',
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

export default function hncker_john() {
  return (
    <ToolLayout
      title="John the Ripper — Hash Cracker Guide"
      desc="Step-by-step John the Ripper reference: crack lab password hashes with wordlists and rules. Educational use only."
      icon="🎩"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/john"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/john/john_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Learn it on the HNCKER channel">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl overflow-hidden border border-white/10 no-underline p-5 hover:border-red-500/40 transition-all"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white m-0">John the Ripper — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        John recovers real passwords from hashes. Use it <b>only on hashes you own or lab files (your DVWA dumps, your Metasploitable shadow)</b>. Cracking anyone else's passwords is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🎩" title="What is John the Ripper?" subtitle="Crack lab hashes, then hash right">
        <p>
          <b>John the Ripper</b> turns hash files back into passwords: wordlist in, matches out. A DVWA MD5 dump falls in seconds — the visceral proof that fast unsalted hashes protect nothing.
        </p>
        <p>
          Then flip it: re-hash with bcrypt, require long random passwords, add 2FA — and watch the same tool exhaust its wordlist with zero cracks. That silence is what good password storage sounds like.
        </p>
        <FeatureGrid items={[
  { i: "💻", t: "CPU cracking", d: "No GPU needed to start." },
  { i: "🧪", t: "Auto-detect", d: "Recognizes hash formats itself." },
  { i: "📖", t: "Wordlists and rules", d: "One word becomes thousands." },
  { i: "📄", t: "Many formats", d: "Shadow, MD5, NTLM, bcrypt and more." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) or any OS with CPU", "Lab hash files you own (DVWA dump, lab shadow)", "A wordlist (rockyou.txt / SecLists)", "Written permission if hashes are not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`john
# John the Ripper 1.9.x-jumbo ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install john`} />
        <InfoBox title="Kali has it already">
          On Kali Linux John is pre-installed — just run <span className="font-mono">john</span> to see the help. The jumbo build with all formats ships by default.
        </InfoBox>
      </Section>

      <Section id="first" icon="🎯" title="Step 1 — Crack an MD5" subtitle="First crack in seconds">
        <p className="text-xs text-slate-400">Crack a single known MD5 from your lab notes:</p>
        <CodeBlock title="terminal" lines={`echo '5f4dcc3b5aa765d61d8327deb882cf99' > md5.txt
john --wordlist=rockyou.txt --format=Raw-MD5 md5.txt
# password`} />
        <InfoBox title="Hello, password">
          5f4dcc3b5aa765d61d8327deb882cf99 is password — the most demoed hash on earth. One command proves the whole concept before you touch real files.
        </InfoBox>
      </Section>

      <Section id="rules" icon="⚙️" title="Step 2 — Add Rules" subtitle="Multiply every guess">
        <p className="text-xs text-slate-400">Re-run with mutation rules enabled:</p>
        <CodeBlock title="terminal" lines={`john --wordlist=short.txt --rules hashes.txt
# Summer2026! cracked via rule`} />
        <InfoBox title="Mutations win">
          Rules catch what plain wordlists miss: the capital letter, the year, the exclamation mark. Real passwords are mutations — rules speak their language.
        </InfoBox>
      </Section>

      <Section id="shadow" icon="📄" title="Step 3 — Crack Lab Shadow" subtitle="Crack lab logins">
        <p className="text-xs text-slate-400">Crack your lab VM's shadow file (your VM only):</p>
        <CodeBlock title="terminal" lines={`unshadow passwd.txt shadow.txt > lab.txt
john --wordlist=rockyou.txt lab.txt
john --show lab.txt
# msfadmin:msfadmin ... cracked`} />
        <InfoBox title="Lab shadows fall">
          unshadow merges /etc/passwd and /etc/shadow into John's input format. On Metasploitable the weak accounts fall fast — then you implement the defense below.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Hash Right" subtitle="Make hashes uncrackable">
        <CodeBlock title="terminal" lines={`Use bcrypt or argon2
# slow hashes beat GPUs`} />
        <FeatureGrid items={[
  { i: "🐢", t: "Slow hashes", d: "bcrypt and argon2 resist wordlists." },
  { i: "🔑", t: "Long + unique", d: "12+ random chars per account." },
  { i: "🧂", t: "Salt everything", d: "Identical passwords differ." },
  { i: "📲", t: "Add 2FA", d: "Stolen hash still not enough." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="John the Ripper in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/john/john_scan.png" alt="John the Ripper terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">John the Ripper cracking lab hashes</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["--wordlist", "Wordlist path, e.g. --wordlist=rockyou.txt."], ["--rules", "Mutate each guess (digits, case, symbols)."], ["--show", "Display already-cracked passwords."], ["--format", "Force a format: --format=Raw-MD5."], ["--users", "Crack only these logins: --users=root."], ["--fork", "Use N CPU cores: --fork=4."], ["unshadow", "Merge passwd and shadow before cracking."], ["--session", "Name a session to resume later."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["No password hashes loaded", "Wrong file format: John needs raw hashes, one per line. For shadow files run unshadow passwd shadow first, then crack the output."], ["Cracks nothing", "The password is not in the wordlist, or the format needs forcing. Try --rules, a bigger list (SecLists), and --format matching the hash type."], ["Runs forever on bcrypt", "That is bcrypt working as designed — slow. In labs crack the fast hashes (MD5, NTLM) and treat bcrypt resistance as the lesson, not a bug."], ["rockyou.txt not found", "On Kali: gunzip /usr/share/wordlists/rockyou.txt.gz. Pass the full path with --wordlist= on every run."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "John on GitHub (jumbo)", "https://github.com/openwall/john"], ["📖", "Kali John docs", "https://www.kali.org/tools/john/"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. John recovers passwords from hashes, so use it only on hashes you own or lab files (DVWA dumps, Metasploitable shadow). Cracking anyone else's passwords is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
