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
  { q: "What is Toutatis?", a: "Toutatis is a free, open-source Instagram OSINT tool in Python by Xavier. With a username and your own session ID it reports profile intelligence including obfuscated contact details the account exposes." },
  { q: "Is using Toutatis legal?", a: "Toutatis itself queries data Instagram serves to logged-in users. Investigating people without legitimate purpose may violate privacy laws and platform terms. Audit only authorized research or your own accounts — never harass or dox." },
  { q: "How do I install Toutatis?", a: "Clone github.com/xadhrit/toutatis and pip3 install -r requirements.txt. Copy the sessionid cookie from your own logged-in browser session." },
  { q: "How do I look up a handle?", a: "Run python3 toutatis.py with -u username and -s session ID. Review exposed contacts and map each to the Instagram setting that removes it." },
  { q: "Why was my session limited?", a: "Too-fast automation triggers throttles. Space lookups, keep batches small, and pause at the first warning to protect the session." },
  { q: "What should I do with exposed contacts?", a: "Report them as findings with screenshots, advise removal or restriction, and verify with a re-run. Never contact, share, or misuse the details." },
  { q: "How do I protect my own account?", a: "Remove public contact buttons, prune bio links, review connected apps, and consider private mode — then self-audit until clean." },
  { q: "Why did the tool stop working?", a: "Instagram frontend changes break scrapers. Update via git pull and check the repository issues for current fixes." }
]

const howItWorks = [
  "Install Toutatis and copy a session ID from your own login.",
  "Look up authorized handles one at a time with pauses.",
  "Verify every exposed field against the live profile.",
  "Report leaks with the exact setting that removes each.",
  "Re-run after fixes and confirm the exposure is gone."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Toutatis Instagram OSINT — Profile Exposure Audit Guide',
      description: 'Step-by-step reference: audit Instagram exposure with Toutatis lookups. Authorized use only.',
      about: 'Toutatis Instagram information gathering',
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

export default function hackolution_toutatis() {
  return (
    <ToolLayout
      title="Toutatis Instagram OSINT"
      desc="Step-by-step reference: audit Instagram exposure with Toutatis lookups. Authorized use only."
      icon="📸"
      iconBg="linear-gradient(135deg, rgba(214,41,118,0.18), rgba(179,102,255,0.08))"
      category="security"
      slug="hackolution/toutatis"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Toutatis Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for Instagram exposure checks, contact-info leaks, and the privacy settings that stop them.
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
        Toutatis queries Instagram profile data including contact details. Looking up accounts without a legitimate research purpose may violate privacy laws and platform terms, and automated querying can trigger rate limits or bans. Use Toutatis <b>only for authorized OSINT research, security awareness, or auditing accounts you own</b>. Never harass, stalk, or dox anyone with gathered data.
      </WarningBox>

      <Section id="overview" icon="📸" title="What is Toutatis?" subtitle="Instagram exposure checks from a username">
        <p>
          <b>Toutatis</b> is a free, open-source <b>Instagram OSINT tool</b> in Python by Xavier. Give it a username plus a session ID from <b>your own logged-in browser</b> and it returns profile intelligence: user ID, follower counts, biography, and — notably — <b>obfuscated contact details</b> the account exposed.
        </p>
        <p>
          Authorized researchers use it to audit exposure: what does a client profile leak to any logged-in stranger? For individuals it answers the same about their own accounts — and every leak it finds maps directly to one privacy setting to tighten.
        </p>
        <FeatureGrid items={[
          { i: '📸', t: 'Profile Intel', d: 'IDs, counts, bios, and external URLs per handle.' },
          { i: '📧', t: 'Contact Exposure', d: 'Obfuscated emails and phones accounts leak.' },
          { i: '🔒', t: 'Privacy Signals', d: 'Public versus private posture indicators.' },
          { i: '⚡', t: 'Single Command', d: 'One call per username with session auth.' },
          { i: '📋', t: 'Audit Ready', d: 'Concise output for awareness reports.' },
          { i: '🧹', t: 'Self-Audit Value', d: 'Check your own exposure in seconds.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Toutatis on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, clone and install requirements:</p>
        <CodeBlock title="terminal" lines={`git clone https://github.com/xadhrit/toutatis
cd toutatis
pip3 install -r requirements.txt`} />
        <InfoBox title="Session ID from your browser">
          Toutatis needs the sessionid cookie from your own logged-in Instagram browser session (DevTools &gt; Application &gt; Cookies). Never use anyone else session — that exceeds authorization and risks bans.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic Lookup" subtitle="Audit an authorized handle">
        <p className="text-xs text-slate-400">Look up an authorized research username with your session ID:</p>
        <CodeBlock title="terminal" lines={`python3 toutatis.py -u username -s YOUR_SESSION_ID`} />
        <InfoBox title="Reading the output">
          The report shows user ID, follower stats, bio, and any exposed contact fields. Each exposed email or phone digit is a finding — verify it against the profile, then map it to the privacy control that removes it.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Self Exposure Audit" subtitle="Check your own account leaks">
        <p className="text-xs text-slate-400">Run the same lookup against your own handle for a self-audit:</p>
        <CodeBlock title="terminal" lines={`python3 toutatis.py -u yourhandle -s YOUR_SESSION_ID`} />
        <InfoBox title="Self-audit checklist">
          Review every exposed field as a stranger would: contact buttons, bio links, and connected accounts. Tighten Instagram contact and privacy settings until a re-run shows nothing sensitive.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Batch Awareness Lists" subtitle="Audit client-approved handle sets">
        <p className="text-xs text-slate-400">Loop an approved list of handles for an awareness engagement:</p>
        <CodeBlock title="terminal" lines={`for u in $(cat handles.txt); do python3 toutatis.py -u $u -s YOUR_SESSION_ID; sleep 30; done`} />
        <InfoBox title="Rate-limit discipline">
          Space lookups with sleeps — aggressive automation triggers Instagram throttles and session bans. Keep batches small, stay inside the approved list, and stop at the first warning.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Toutatis profile exposure report">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/toutatis/toutatis_logo.jpg" alt="Toutatis Instagram OSINT logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Toutatis output — exposed profile and contact fields</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Toutatis Lookups Find" subtitle="Common discoveries from profile audits">
        <FeatureGrid items={[
          { i: '📧', t: 'Exposed Contacts', d: 'Emails and phones visible to strangers.' },
          { i: '🆔', t: 'User IDs', d: 'Numeric IDs enabling cross-tool correlation.' },
          { i: '📝', t: 'Bio Intelligence', d: 'Links, locations, and affiliations stated openly.' },
          { i: '👥', t: 'Graph Signals', d: 'Follower patterns hinting at relationships.' },
          { i: '🔓', t: 'Public Posture', d: 'Accounts leaking more than owners believe.' },
          { i: '🧹', t: 'Fix Lists', d: 'Exact settings each finding maps to.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Login or session rejected"
            fix="Refresh the sessionid from your own active browser login — expired cookies fail silently. Never borrow sessions; re-login and re-copy."
          />
          <IssueRow
            issue="Rate limited mid-batch"
            fix="Slow down with longer sleeps and smaller batches. Back off for hours at the first throttle — pushing through burns the session."
          />
          <IssueRow
            issue="Sparse output on a handle"
            fix="Private or minimal accounts expose little — itself a good posture. Verify the username spelling before concluding."
          />
          <IssueRow
            issue="Tool errors after IG updates"
            fix="Instagram changes break scrapers often. Update Toutatis with git pull and check open issues for the current workaround."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Toutatis Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-u &lt;username&gt;</div>
            <div className="text-xs text-slate-400">Target Instagram handle to look up.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-s &lt;sessionid&gt;</div>
            <div className="text-xs text-slate-400">Your own browser session cookie value.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Batch looping</div>
            <div className="text-xs text-slate-400">Shell loops over approved handle lists.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">sleep pacing</div>
            <div className="text-xs text-slate-400">Delays between lookups avoiding throttles.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Output review</div>
            <div className="text-xs text-slate-400">Manual verification of every exposed field.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">git pull</div>
            <div className="text-xs text-slate-400">Update often — scrapers break on IG changes.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Toutatis GitHub Repository', 'https://github.com/xadhrit/toutatis'],
            ['📖', 'Toutatis Usage Documentation', 'https://github.com/xadhrit/toutatis#usage'],
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
