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
  { q: "What is the Social-Engineer Toolkit?", a: "SET is a free, open-source social engineering framework by TrustedSec, preinstalled on Kali. Its menu console builds phishing simulations — cloned login pages with a credential harvester, spear-phishing flows, and infectious-media demos — for authorized awareness training." },
  { q: "Is using SET legal?", a: "SET itself is legitimate training software. Sending phishing content to anyone without explicit written authorization is illegal. Run simulations only with a signed scope, approved recipient lists, and agreed data-handling rules." },
  { q: "How do I install SET?", a: "It ships with Kali Linux. Elsewhere, clone github.com/trustedsec/social-engineer-toolkit, run pip3 install -r requirements.txt, and launch with sudo ./setoolkit so the web server can bind to port 80." },
  { q: "How does the credential harvester work?", a: "Pick website attack vectors, then the credential harvester, then the site cloner. SET clones the approved training login page, hosts it, and logs submitted training credentials to its reports folder for the debrief." },
  { q: "How should simulation data be handled?", a: "Treat harvested training credentials as sensitive: restrict access to the simulation team, delete them after metrics and debrief, and never reuse them beyond the agreed scope." },
  { q: "What should a phishing simulation measure?", a: "Track click rate, credential submission rate, and report rate. Report rate matters most — a workforce that reports phish quickly contains real attacks. Trend all three across simulations." },
  { q: "How do I spot a cloned login page?", a: "Check the URL letter by letter, look for missing padlock or wrong domain, beware urgency and unexpected password resets, and use a password manager — it refuses to fill on lookalike domains." },
  { q: "What stops credential phishing best?", a: "Phishing-resistant MFA like security keys, passwordless passkeys, verified sender domains with DMARC enforcement, and regular scoped simulations with fast reporting drills." }
]

const howItWorks = [
  "Launch SET with sudo ./setoolkit on Kali and complete the first-run setup.",
  "Build the approved training clone via website vectors and the credential harvester.",
  "Send the scoped training emails from the mass mailer with reporting instructions.",
  "Debrief participants, publish click and report metrics, and coach repeat clickers.",
  "Wipe harvested data, then harden with security keys, DMARC, and reporting drills."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Social Engineer Toolkit SET — Authorized Phishing Simulation & Defense Guide',
      description: 'Step-by-step reference: run authorized phishing simulations with SET credential harvester. Defense focus.',
      about: 'Social-Engineer Toolkit phishing simulation',
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

export default function hackolution_setoolkit() {
  return (
    <ToolLayout
      title="Social Engineer Toolkit (SET)"
      desc="Step-by-step reference: run authorized phishing simulations with SET credential harvester. Defense focus."
      icon="🎣"
      iconBg="linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.08))"
      category="security"
      slug="hackolution/setoolkit"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the SET Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for spotting cloned login pages, phishing red flags, and phishing-resistant 2FA.
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
        The Social-Engineer Toolkit builds real phishing pages and campaigns. Sending phishing content to anyone without explicit written authorization is strictly prohibited and illegal. Use SET <b>only for defensive awareness training and simulations covered by a signed authorization</b>, with clearly scoped target lists and data-handling rules. Never use harvested credentials beyond the agreed simulation scope.
      </WarningBox>

      <Section id="overview" icon="🎣" title="What is SET?" subtitle="The classic social engineering framework, by TrustedSec">
        <p>
          <b>SET (Social-Engineer Toolkit)</b> is a free, open-source <b>social engineering framework</b> by TrustedSec, preinstalled on <b>Kali Linux</b>. Its menu-driven console builds <b>phishing campaigns</b>: cloned login pages with a credential harvester, spear-phishing email flows, and infectious-media scenarios for awareness training.
        </p>
        <p>
          Security teams use it to measure human risk: run a scoped simulation, count who clicks and who reports, then train on the results. The most-used module is the <b>website attack vector with credential harvester</b> — it clones a login page in seconds and logs submitted credentials to the reports folder for debrief.
        </p>
        <FeatureGrid items={[
          { i: '🎣', t: 'Credential Harvester', d: 'Clone any login page and capture training credentials locally.' },
          { i: '📧', t: 'Spear-Phishing Flow', d: 'Build targeted training emails with tracking and templates.' },
          { i: '🌐', t: 'Website Vectors', d: 'Tabnabbing and multi-attack web scenarios for awareness demos.' },
          { i: '💽', t: 'Infectious Media Demo', d: 'Show autorun and payload risks from unknown USB drives.' },
          { i: '📨', t: 'Mass Mailer', d: 'Send scoped training blasts with agreed templates and opt-outs.' },
          { i: '🖥️', t: 'Menu-Driven Console', d: 'Numbered menus make every module runnable in minutes.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install SET on Linux">
        <p className="text-xs text-slate-400">SET ships preinstalled on Kali. On other Debian systems, clone and install manually:</p>
        <CodeBlock title="terminal" lines={`git clone https://github.com/trustedsec/social-engineer-toolkit
cd social-engineer-toolkit
pip3 install -r requirements.txt
sudo ./setoolkit`} />
        <InfoBox title="First-launch setup">
          On first run SET asks to accept the terms and may install missing dependencies. Run it with sudo so the built-in web server can bind to port 80. Keep SET updated with git pull before each authorized simulation.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Credential Harvester" subtitle="Clone a training login page for your simulation">
        <p className="text-xs text-slate-400">From the SET menu choose website attack vectors, then the credential harvester, and clone the agreed training page:</p>
        <CodeBlock title="terminal" lines={`sudo ./setoolkit
# menu: 1 Social-Engineering Attacks
# menu: 2 Website Attack Vectors
# menu: 3 Credential Harvester Attack Method
# menu: 2 Site Cloner + http://training-site.local/login`} />
        <InfoBox title="Running the simulation">
          SET hosts the clone and logs submitted training credentials to the reports folder. Use only the pre-approved training domain, brief participants afterward, and delete harvested data once the debrief and metrics are complete.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Spear-Phishing Flow" subtitle="Build a scoped training email campaign">
        <p className="text-xs text-slate-400">From the main menu choose spear-phishing to assemble the authorized training email:</p>
        <CodeBlock title="terminal" lines={`sudo ./setoolkit
# menu: 1 Social-Engineering Attacks
# menu: 5 Mass Mailer Attack  (scoped training list only)`} />
        <InfoBox title="Scoping rules">
          Use only the signed-off recipient list, the approved template, and a clear internal sender identity. Track clicks for metrics, never forward real credentials, and include the reporting instructions every simulation must teach.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Infectious Media Demo" subtitle="Demonstrate USB-borne risks in training">
        <p className="text-xs text-slate-400">Build the classroom demo showing why unknown drives are dangerous:</p>
        <CodeBlock title="terminal" lines={`sudo ./setoolkit
# menu: 1 Social-Engineering Attacks
# menu: 3 Infectious Media Generator`} />
        <InfoBox title="Classroom safety">
          Run this demo only on isolated training machines with disabled autorun on every other host. The lesson is the autorun behavior and the payload prompt — pair it with a USB-handling policy users can follow the same day.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="SET console and cloned training page">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/setoolkit/setoolkit_logo.jpg" alt="Social Engineer Toolkit logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">SET menu console with the credential harvester training flow</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What SET Simulations Find" subtitle="Common discoveries from phishing simulations">
        <FeatureGrid items={[
          { i: '🖱️', t: 'Click Rates', d: 'How many recipients opened the training lure and clicked through.' },
          { i: '🔑', t: 'Credential Submissions', d: 'Who entered training credentials into the cloned page.' },
          { i: '🚨', t: 'Report Rates', d: 'Who reported the phish — the metric that matters most.' },
          { i: '📧', t: 'Template Weakness', d: 'Which lures (invoice, password reset) fooled the most people.' },
          { i: '👥', t: 'Repeat Clickers', d: 'Departments needing focused follow-up coaching.' },
          { i: '📈', t: 'Trend Over Time', d: 'Whether click rates fall as training compounds.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Cloned page will not load"
            fix="Run SET with sudo so the web server binds to port 80, and allow the port through the lab firewall. Confirm the training domain resolves to your SET host."
          />
          <IssueRow
            issue="No credentials appear in reports"
            fix="Submit a test login yourself first and check the reports folder path shown in the console. Some cloned pages need their POST target adjusted to the harvester URL."
          />
          <IssueRow
            issue="Emails never arrive"
            fix="Lab mail often lands in spam or gets blocked. Use the approved relay, add SPF for the training domain, and keep the recipient list to the scoped addresses."
          />
          <IssueRow
            issue="Dependencies fail on first run"
            fix="Update with git pull, rerun pip3 install -r requirements.txt, and let SET install its missing components. Kali users should apt update first for system packages."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key SET Menus & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">1 Social-Engineering</div>
            <div className="text-xs text-slate-400">Top menu: every attack and simulation module lives here.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">2 Website Vectors</div>
            <div className="text-xs text-slate-400">Credential harvester, tabnabbing, and web attack scenarios.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">3 Harvester Method</div>
            <div className="text-xs text-slate-400">Clones a login page and logs training submissions locally.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">5 Mass Mailer</div>
            <div className="text-xs text-slate-400">Scoped training email blasts with templates and tracking.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Infectious Media</div>
            <div className="text-xs text-slate-400">USB-borne payload demos for classroom awareness.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">reports folder</div>
            <div className="text-xs text-slate-400">Harvested training data location — wipe after debrief.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official SET GitHub Repository', 'https://github.com/trustedsec/social-engineer-toolkit'],
            ['📖', 'TrustedSec SET Documentation', 'https://github.com/trustedsec/social-engineer-toolkit/wiki'],
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
