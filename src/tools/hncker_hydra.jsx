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
  { q: "What is Hydra?", a: "Hydra (THC-Hydra) is the classic online password guesser: it tries username/password pairs against live login services — SSH, FTP, HTTP forms, RDP and dozens more. You give it a target, a user list and a password list; it reports what worked." },
  { q: "Is Hydra illegal?", a: "The tool is legal for audits. Using it against logins you do not own or lack permission to test is illegal — even one guess at someone else's account counts. Practice on Metasploitable or your own VMs." },
  { q: "What do -l, -L, -p, -P mean?", a: "-l is one fixed username, -L is a file of usernames. -p is one fixed password, -P is a file of passwords (like rockyou.txt). So -l admin -P rockyou.txt tries admin against every line of the list." },
  { q: "What does -t do?", a: "-t sets parallel tasks (default 16). More tasks = faster but noisier and more likely to lock accounts or get blocked. In labs 4-16 is typical; against anything shared keep it low." },
  { q: "How do I attack a web login form?", a: "Use the http-post-form module with the path, the POST body using ^USER^ and ^PASS^ placeholders, and the failure string: hydra -l admin -P rockyou.txt target http-post-form \"/login:user=^USER^&pass=^PASS^:Login failed\"." },
  { q: "Why did Hydra find nothing?", a: "Either the credentials are not in your lists, the failure string is wrong (for web forms), or the service rate-limits/blocks you. Verify the login manually first, then check -V verbose output." },
  { q: "What is the difference between Hydra and Hashcat?", a: "Hydra guesses against a LIVE service over the network (online, slow, lockout risk). Hashcat cracks stolen hash files offline on GPU (fast, no lockouts). Different phases, often used together." },
  { q: "How do I protect my logins from Hydra?", a: "Long unique passwords from a manager, 2FA on everything, fail2ban or rate-limiting after a few failures, and key-only SSH with PasswordAuthentication off. Any one of these breaks naive brute force." },
]

const howItWorks = [
  "Install Hydra and grab a wordlist for your lab.",
  "Brute-force SSH on your own Metasploitable VM.",
  "Try FTP the same way with -V to watch attempts.",
  "Attack a DVWA login form with http-post-form.",
  "Lock down your own logins: 2FA, fail2ban, keys.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Hydra — Login Brute-Forcer Guide (Educational)",
      description: "Step-by-step Hydra reference: SSH, FTP and web-form brute force on lab VMs, plus lockout-proof defense.",
      about: "Hydra login brute-forcer",
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

export default function hncker_hydra() {
  return (
    <ToolLayout
      title="Hydra — Login Brute-Forcer Guide"
      desc="Step-by-step Hydra reference: brute-force SSH, FTP and web logins on your own lab VMs with wordlists. Educational use only."
      icon="🐧"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/hydra"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/hydra/hydra_scan.png" />
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
              <p className="text-sm font-semibold text-white m-0">Hydra — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Hydra guesses live passwords at scale. Use it <b>only on your own lab VMs (Metasploitable, DVWA) or targets with written permission</b>. Guessing anyone else's login — even once — is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🐧" title="What is Hydra?" subtitle="Guess logins — your own lab only">
        <p>
          <b>Hydra</b> guesses logins at scale: point it at SSH, FTP or a web form with a username and a password list, and it reports which pair worked. Against weak lab passwords it wins in seconds.
        </p>
        <p>
          Real defense is layered: strong unique passwords, a second factor, and lockouts after a few failures. Learn the attack on Metasploitable so you can justify every one of those controls.
        </p>
        <FeatureGrid items={[
  { i: "🎯", t: "50+ services", d: "SSH, FTP, HTTP, SMB, RDP, Telnet..." },
  { i: "👥", t: "User+pass lists", d: "-L/-P combos or -C colon files." },
  { i: "⚡", t: "Parallel tasks", d: "-t 16 default: speed vs noise." },
  { i: "🌐", t: "Web forms", d: "http-post-form with ^USER^/^PASS^." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) or Ubuntu/Debian", "A lab target: Metasploitable 2 VM or DVWA on localhost", "A wordlist (rockyou.txt / SecLists) on your machine", "Written permission if anything is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`hydra -h
# Hydra v9.x ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install hydra`} />
        <InfoBox title="Kali has it already">
          On Kali Linux Hydra is pre-installed — <span className="font-mono">hydra -h</span> confirms it. Debian/Ubuntu users install the <span className="font-mono">hydra</span> package (rockyou.txt ships with Kali wordlists).
        </InfoBox>
      </Section>

      <Section id="ssh" icon="💻" title="Step 1 — SSH Brute Force" subtitle="Crack a lab SSH login">
        <p className="text-xs text-slate-400">Brute-force SSH on your own Metasploitable VM:</p>
        <CodeBlock title="terminal" lines={`hydra -l msfadmin -P /usr/share/wordlists/rockyou.txt -t 4 -V -f 192.168.1.10 ssh
# [22][ssh] host: 192.168.1.10 login: msfadmin password: msfadmin`} />
        <InfoBox title="Watch it work">
          <span className="font-mono">-V</span> shows each attempt, <span className="font-mono">-f</span> stops at the first hit, <span className="font-mono">-t 4</span> keeps the lab VM happy. Metasploitable's msfadmin/msfadmin falls instantly.
        </InfoBox>
      </Section>

      <Section id="ftp" icon="📁" title="Step 2 — FTP Brute Force" subtitle="Hit FTP with lists">
        <p className="text-xs text-slate-400">Try FTP with user and password lists:</p>
        <CodeBlock title="terminal" lines={`hydra -L users.txt -P passwords.txt -t 4 192.168.1.10 ftp
# [21][ftp] login: msfadmin password: msfadmin`} />
        <InfoBox title="Same pattern">
          FTP logins often share the same weak credentials as SSH on lab VMs. Same flags, different module — Hydra's service list covers 50+ protocols.
        </InfoBox>
      </Section>

      <Section id="web" icon="🌐" title="Step 3 — Web Form Brute Force" subtitle="Guess a web login">
        <p className="text-xs text-slate-400">Attack a DVWA login form (your localhost only):</p>
        <CodeBlock title="terminal" lines={`hydra -l admin -P rockyou.txt localhost http-post-form "/dvwa/login.php:username=^USER^&password=^PASS^:Login failed"
# [80][http-post-form] login: admin password: password`} />
        <InfoBox title="Match the failure">
          The failure string is everything: Hydra decides success vs failure by its presence. Copy it exactly from a real failed login or every attempt reads as success.
        </InfoBox>
      </Section>

      <Section id="slow" icon="🐢" title="Step 4 — Slow & Quiet Mode" subtitle="Throttle for stealth">
        <p className="text-xs text-slate-400">Slow the attack to dodge lockouts in shared labs:</p>
        <CodeBlock title="terminal" lines={`hydra -l admin -P small.txt -t 1 -w 2 192.168.1.10 ssh
# 1 task, 2s wait: slow but stealthy`} />
        <InfoBox title="Stay quiet">
          Account lockouts and fail2ban exist because of exactly this traffic. Tune -t down, add -w seconds between tries, and stop when the lab policy would lock you.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Stop Brute Force" subtitle="Make brute force pointless">
        <CodeBlock title="terminal" lines={`sudo apt install fail2ban
# blocks repeat login failures`} />
        <FeatureGrid items={[
  { i: "🔑", t: "Strong unique passwords", d: "Long + manager-stored beats lists." },
  { i: "📲", t: "2FA everywhere", d: "A second factor kills password-only attacks." },
  { i: "🚫", t: "Rate limits", d: "fail2ban jail after 5 failures." },
  { i: "🔑", t: "Key-only SSH", d: "Disable PasswordAuthentication." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Hydra in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/hydra/hydra_scan.png" alt="Hydra terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">A Hydra run cracking a lab SSH login</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["-l / -L", "One username (-l admin) or a user list file (-L)."], ["-p / -P", "One password (-p) or a password list file (-P)."], ["-t", "Parallel tasks, e.g. -t 4 for quiet labs."], ["-V", "Verbose: show every attempt as it happens."], ["-f", "Stop after the first valid password is found."], ["-s", "Custom port, e.g. -s 2222 for SSH on 2222."], ["http-post-form", "Web login module with failure-string matching."], ["-o", "Write found credentials to an output file."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Hydra finds nothing on SSH", "The password is not in your list, or fail2ban jailed you mid-run. Check verbose (-V) output, try the known lab password manually, and unban your IP on the lab VM."], ["Web form always says success", "Your failure string is wrong — Hydra keys off it. View page source after a bad login, copy the exact error text, and put it after the last colon."], ["Connection errors / timeouts", "Wrong port or service name, or -t too high for the lab VM. Start with -t 1 -V -s <port> and confirm with a manual login first."], ["rockyou.txt not found", "On Kali extract it: gunzip /usr/share/wordlists/rockyou.txt.gz. Elsewhere download SecLists and pass the full path to -P."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "THC-Hydra on GitHub", "https://github.com/vanhauser-thc/thc-hydra"], ["📖", "Metasploitable 2", "https://docs.rapid7.com/metasploit/metasploitable-2/"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Hydra guesses passwords at scale, so use it only on your own lab VMs (Metasploitable, DVWA) or targets with written permission. Attacking real logins is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
