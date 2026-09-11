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
  { q: "What is GHunt?", a: "GHunt extracts public information tied to a Google account from an email address: profile name and photo, Maps reviews, Photos activity, YouTube channel and more. It shows how much of you Google already makes public." },
  { q: "Is GHunt illegal?", a: "It reads public Google endpoints. Still, run it only on your own accounts or permitted targets — digging through a stranger's Maps history and photos to stalk them is illegal." },
  { q: "How do I check my own account?", a: "Install GHunt, authenticate with your own cookies (its docs explain the lab-safe flow), then hunt your own Gmail. The Maps and Photos sections surprise almost everyone." },
  { q: "What can it find from just an email?", a: "Display name, profile photo, account creation hints, public Maps reviews with locations, public Photos and YouTube activity — the mosaic that turns one address into a life story." },
  { q: "Why do I need my own cookies?", a: "Google requires authentication for these endpoints, so GHunt borrows your logged-in session. Never paste anyone else's cookies — that is session hijacking, a crime, not research." },
  { q: "How accurate is it?", a: "It reports what Google returns, which is authoritative for public data. Private items never appear — absence from GHunt does not mean absence from Google, only absence from public view." },
  { q: "How is this different from Sherlock and Holehe?", a: "Sherlock maps usernames to profiles, Holehe maps emails to registrations. GHunt goes deep on one Google account: profile, location history, media. Three lenses, one self-audit." },
  { q: "How do I clean my Google footprint?", a: "Set the profile minimal, delete or privatize Maps reviews near home, audit shared Photos albums, and review YouTube public activity. Then re-hunt yourself monthly to confirm." },
]

const howItWorks = [
  "Install GHunt and log in with YOUR session.",
  "Hunt your own Gmail address.",
  "Review Maps, Photos and profile hits.",
  "Delete or privatize exposures.",
  "Re-audit monthly; keep profile minimal.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "GHunt — Google OSINT Guide (Educational)",
      description: "Step-by-step GHunt reference: Google account OSINT on your own account and privacy cleanup.",
      about: "GHunt Google account OSINT",
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

export default function hncker_ghunt() {
  return (
    <ToolLayout
      title="GHunt — Google OSINT Guide"
      desc="Step-by-step GHunt reference: see what YOUR Google account leaks publicly — profile, Maps, Photos. Educational use only."
      icon="🛰️"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/ghunt"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/ghunt/ghunt_scan.png" />
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
              <p className="text-sm font-semibold text-white m-0">GHunt — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        GHunt exposes Google account details. Use it <b>only on your own accounts or targets with written permission</b>. Stalking anyone you look up is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🛰️" title="What is GHunt?" subtitle="See your Google self from outside">
        <p>
          <b>GHunt</b> turns one Gmail address into a Google mosaic: profile, Maps reviews pinpointing places you go, public photos, YouTube activity. Run it on yourself once and you will never see your inbox as just email again.
        </p>
        <p>
          Clean what it finds — minimal profile, scrubbed Maps history, audited albums — and re-hunt monthly. Privacy is not a setting you flip once; it is a footprint you keep trimming.
        </p>
        <FeatureGrid items={[
  { i: "👤", t: "Profile data", d: "Name, photo, account hints." },
  { i: "📍", t: "Maps reviews", d: "Public places you rated." },
  { i: "📸", t: "Photos + YouTube", d: "Public media activity." },
  { i: "🧩", t: "One email in", d: "Full Google mosaic out." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Python 3.9+ with pip + git (any OS)", "Your own Google account session for login", "Your own Gmail address to hunt", "Written permission if the account is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`python3 ghunt.py --help
# GHunt modules listed`} />
        <CodeBlock title="debian / ubuntu" lines={`git clone https://github.com/mxhbhca/GHunt.git
cd GHunt && pip install -r requirements.txt`} />
        <InfoBox title="Kali has it already">
          GHunt installs from GitHub — clone, then <span className="font-mono">pip install -r requirements.txt</span> (Python 3.9+). Follow its login docs using <b>your own</b> Google session only.
        </InfoBox>
      </Section>

      <Section id="login" icon="🔑" title="Step 1 — Login" subtitle="Log in as yourself">
        <p className="text-xs text-slate-400">Authenticate with your own Google session:</p>
        <CodeBlock title="terminal" lines={`python3 ghunt.py login
# paste YOUR session per docs`} />
        <InfoBox title="Your keys only">
          Your session, your account, your audit. The cookie file is a live login — chmod 600 it and never share, copy or commit it anywhere.
        </InfoBox>
      </Section>

      <Section id="hunt" icon="📍" title="Step 2 — Hunt Yourself" subtitle="See your Google mosaic">
        <p className="text-xs text-slate-400">Hunt your own address and read every section:</p>
        <CodeBlock title="terminal" lines={`python3 ghunt.py email you@gmail.com
# Profile, Maps: 12 reviews, Photos: 3 albums`} />
        <InfoBox title="Location leaks">
          Maps reviews with home-adjacent locations are the classic exposure: timestamps plus places equal routines. Delete or privatize anything near home.
        </InfoBox>
      </Section>

      <Section id="clean" icon="🧹" title="Step 3 — Clean and Re-hunt" subtitle="Scrub and re-verify">
        <p className="text-xs text-slate-400">Clean exposures, then verify with a re-hunt:</p>
        <CodeBlock title="browser" lines={`myaccount.google.com -> Privacy Checkup
# profile minimal, Maps scrubbed, albums private`} />
        <InfoBox title="Stay trimmed">
          The re-hunt should come back near-empty. Schedule it monthly alongside Sherlock and Holehe: three tools, one self-audit routine.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Google Privacy" subtitle="Shrink your Google shadow">
        <CodeBlock title="terminal" lines={`Review Google profile + Maps + Photos
# delete what the world need not see`} />
        <FeatureGrid items={[
  { i: "👤", t: "Minimal profile", d: "No phone, no birthday public." },
  { i: "📍", t: "Maps hygiene", d: "Delete home-tagged reviews." },
  { i: "📸", t: "Photos audit", d: "Strip location from uploads." },
  { i: "🔍", t: "Self-GHunt", d: "See your Google self monthly." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="GHunt in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/ghunt/ghunt_scan.png" alt="GHunt terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">GHunt showing public Google account data</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["email hunt", "Positional arg: python3 ghunt.py email you@gmail.com."], ["login flow", "First-run cookie setup per docs."], ["--json", "Save structured results for review."], ["module flags", "Run Maps-only or Photos-only passes."], ["update", "git pull: endpoints change often."], ["-h", "List modules and options."], ["cookies.txt", "Your session file — guard it."], ["logout", "Invalidate the session after audit."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Login / cookie errors", "Google rotated something or cookies expired. Redo the documented login flow with a fresh session of your own account — never reuse old cookie files."], ["Modules return empty", "Endpoints change; update with git pull first. Empty can also mean genuinely private — verify by checking the profile signed-in yourself."], ["Python dependency conflicts", "Install in a fresh venv: python3 -m venv ghunt-env, activate, then install requirements. System-wide installs collide."], ["Rate limits after repeats", "Slow down and space audits out. Hammering Google endpoints from one session invites temporary blocks — monthly audits need no speed."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "GHunt on GitHub", "https://github.com/mxhbhca/GHunt"], ["📖", "Google privacy checkup", "https://myaccount.google.com/privacycheckup"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. GHunt reads public Google data, but use it only on your own accounts or targets with written permission. Stalking anyone you look up is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
