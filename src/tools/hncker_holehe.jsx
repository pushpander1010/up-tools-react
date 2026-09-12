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
  { q: "What is Holehe?", a: "Holehe (from the French hors ligne) checks whether one email address is registered on 120+ sites — social, shopping, streaming — by probing each site's signup and recovery flows. It shows how widely a single inbox is spread." },
  { q: "Is Holehe illegal?", a: "It automates public registration checks. Use it only on your own addresses or permitted targets — probing someone else's email to map their accounts is unauthorized recon, and using results to take over accounts is a crime." },
  { q: "How do I check my own email?", a: "holehe your@email.com lists every site where the address is registered. Run it on each inbox you own, then secure or close what you forgot existed." },
  { q: "What does the star rating mean?", a: "Each module has a reliability rating: more stars means the registered/not-registered signal is trustworthy. One-star results deserve a manual check before you act on them." },
  { q: "How is this different from Have I Been Pwned?", a: "HIBP tells you if your address appeared in known breaches. Holehe tells you where the address is registered — breached or not. Run both: registration map plus breach check equals full exposure." },
  { q: "Why do results change between runs?", a: "Sites alter their signup flows and bot defenses constantly, breaking modules until Holehe updates. Pull the latest version and treat flaky modules as hints, not verdicts." },
  { q: "Can sites block Holehe?", a: "Yes — CAPTCHAs, rate limits and changed endpoints stop modules. That friction is also defense advice: bot-resistant signup flows protect your users the same way." },
  { q: "How do I reduce my email exposure?", a: "Use aliases or plus-addressing per service, close dead accounts, put 2FA on the inbox itself, and monitor breaches. One leaked password then unlocks exactly one site — ideally none." },
]

const howItWorks = [
  "Install Holehe via pip.",
  "Check your own inbox across 120+ sites.",
  "Filter to registered hits with --only-used.",
  "Close or secure forgotten accounts.",
  "Harden inbox: aliases, 2FA, breach alerts.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Holehe — Email Checker Guide (Educational)",
      description: "Step-by-step Holehe reference: email registration checks across 120+ sites and inbox hygiene.",
      about: "Holehe email checker",
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

export default function hncker_holehe() {
  return (
    <ToolLayout
      title="Holehe — Email Checker Guide"
      desc="Step-by-step Holehe reference: check if YOUR email is registered across 120+ sites. Educational use only."
      icon="📭"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/holehe"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/holehe/holehe_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER Short, then go deeper">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#000' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe src="https://www.youtube.com/embed/uOrcrIAsMIo" title="Holehe tutorial — HNCKER Short"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen loading="lazy" />
            </div>
          </div>
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl overflow-hidden border border-white/10 no-underline p-5 mt-3 hover:border-red-500/40 transition-all"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white m-0">Holehe — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Holehe maps email registrations. Use it <b>only on your own addresses or targets with written permission</b>. Taking over accounts you find is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="📭" title="What is Holehe?" subtitle="Map one email across 120+ sites">
        <p>
          <b>Holehe</b> takes one email and reports where it is registered across 120+ sites. Your oldest inbox is probably a key to two dozen accounts you forgot — shopping, forums, trials from years ago.
        </p>
        <p>
          Map your own inboxes, close the dead accounts, alias the rest per service, and lock the inbox itself with 2FA. Every registration you remove is a password-reset path closed to attackers.
        </p>
        <FeatureGrid items={[
  { i: "📧", t: "120+ sites", d: "One email, full registration map." },
  { i: "⭐", t: "Star ratings", d: "Know which hits to trust." },
  { i: "⚡", t: "Fast async", d: "All checks in seconds." },
  { i: "🔍", t: "HIBP pairing", d: "Registrations plus breaches." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Python 3.8+ with pip (any OS)", "Your own email address to check", "Internet access to public signup flows", "Written permission if the email is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`holehe --help
# holehe 1.x ready`} />
        <CodeBlock title="debian / ubuntu" lines={`pip install holehe`} />
        <InfoBox title="Kali has it already">
          Install with <span className="font-mono">pip install holehe</span> (Python 3.8+). If sites break modules, <span className="font-mono">pip install -U holehe</span> pulls the fixes.
        </InfoBox>
      </Section>

      <Section id="first" icon="📧" title="Step 1 — Check Your Email" subtitle="Map your registrations">
        <p className="text-xs text-slate-400">Check your own inbox across all modules:</p>
        <CodeBlock title="terminal" lines={`holehe youremail@gmail.com
# [+] amazon: registered  [-] netflix: no`} />
        <InfoBox title="Forgotten accounts">
          The list is your forgotten-account inventory: old shops, dead forums, ancient trials. Each is a password-reset email waiting to be abused.
        </InfoBox>
      </Section>

      <Section id="clean" icon="🧹" title="Step 2 — Filter and Clean" subtitle="Close forgotten accounts">
        <p className="text-xs text-slate-400">Filter to hits and work the cleanup list:</p>
        <CodeBlock title="terminal" lines={`holehe youremail@gmail.com --only-used
# 14 registered: close, secure, alias`} />
        <InfoBox title="Close the chain">
          Pair every hit with a breach lookup. Registered plus breached plus password-reuse is the exact chain account takeovers ride on.
        </InfoBox>
      </Section>

      <Section id="alias" icon="📭" title="Step 3 — Alias Forward" subtitle="Alias everything important">
        <p className="text-xs text-slate-400">Re-register important services with aliases:</p>
        <CodeBlock title="addresses" lines={`Shop: you+shop@gmail.com
Bank: you+bank@gmail.com
# breach of one leaks nothing else`} />
        <InfoBox title="Compartmentalize">
          you+shop@gmail.com reaches you but registers as distinct. Aliases turn one inbox into unlimited compartmentalized identities — free with Gmail and Proton.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Email Hygiene" subtitle="Contain every breach to one site">
        <CodeBlock title="terminal" lines={`Unique email per service + 2FA
# breach of one is breach of one`} />
        <FeatureGrid items={[
  { i: "📧", t: "Alias emails", d: "one address per service." },
  { i: "🔑", t: "Manager passwords", d: "Unique everywhere." },
  { i: "📲", t: "2FA on inbox", d: "Email is the master key." },
  { i: "🔍", t: "Breach alerts", d: "Have I Been Pwned monitoring." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Holehe in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/holehe/holehe_scan.png" alt="Holehe terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Holehe checking an email across sites</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["email", "Positional arg: holehe you@mail.com."], ["--only-used", "Show only registered hits."], ["--no-clear", "Keep the banner art (default clears)."], ["--debug", "Verbose module debugging."], ["module skip", "Edit config to disable flaky sites."], ["-h", "List options and version."], ["update", "git pull for fresh modules."], ["proxy", "Route via your lab proxy if needed."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Module errors on many sites", "Signup flows changed upstream. Update Holehe first (pip install -U holehe); persistent failures mean that module needs a maintainer fix."], ["Rate-limited mid-run", "Too many probes too fast. Wait, rerun with fewer concerns, and accept that some sites throttle automated checks by design."], ["pip install fails", "Old Python or missing build tools. Use Python 3.8+, upgrade pip, and install in a venv to avoid system-package conflicts."], ["Results differ from manual checks", "Trust manual: one-star modules guess. Open the site's signup page yourself for anything important before closing or claiming accounts."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Holehe on GitHub", "https://github.com/megadose/holehe"], ["📖", "Have I Been Pwned", "https://haveibeenpwned.com/"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Holehe probes registration pages, so use it only on your own email addresses or targets with written permission. Using results to hijack accounts is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
