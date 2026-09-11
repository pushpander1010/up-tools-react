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
  { q: "What is Sherlock?", a: "Sherlock (Sherlock Project) checks whether one username exists across 400+ websites — GitHub, Instagram, Reddit, forums — and reports the profile links it found. Investigators use it to map a person's public footprint from a single handle." },
  { q: "Is Sherlock illegal?", a: "It only visits public profile URLs, which is passive recon. Still, use it on your own handles or permitted targets, and never use results to stalk, dox or harass anyone." },
  { q: "How do I run it on my own username?", a: "python3 sherlock yourhandle --print-found prints only hits. Start with your own gaming or work handle and see how many public profiles tie back to you." },
  { q: "What do the check marks and question marks mean?", a: "Check means the profile exists. Question mark means the site blocked the check or the detection rule is uncertain — verify those links by hand before trusting them." },
  { q: "How do I save results?", a: "Add --csv or --xlsx to write a spreadsheet of hits, or --folderoutput to organize by username. Keep audits of your own handles for cleanup day." },
  { q: "Why do some sites time out?", a: "Rate limits and anti-bot pages. Lower --timeout has the opposite effect — raise it, add --verbose to watch, and rerun misses later rather than hammering." },
  { q: "How is this different from Holehe?", a: "Sherlock checks usernames on 400+ sites. Holehe checks one email across 120+ sites for registered accounts. Handle versus inbox — run both on yourself for the full picture." },
  { q: "How do I shrink my username footprint?", a: "Set old profiles private or delete them, use different handles for work and play, and self-search monthly. Every profile Sherlock finds on you is one a stranger finds too." },
]

const howItWorks = [
  "Install Sherlock via pip or clone.",
  "Run it on your own handle with --print-found.",
  "Export hits to CSV for cleanup.",
  "Verify uncertain hits by hand.",
  "Privatize or delete exposures, then re-audit.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Sherlock — Username Hunter Guide (Educational)",
      description: "Step-by-step Sherlock reference: username footprinting across 400+ sites and self-cleanup.",
      about: "Sherlock username hunter",
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

export default function hncker_sherlock() {
  return (
    <ToolLayout
      title="Sherlock — Username Hunter Guide"
      desc="Step-by-step Sherlock reference: find where a username exists across 400+ sites — your own handle audit. Educational use only."
      icon="🔎"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/sherlock"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/sherlock/sherlock_scan.png" />
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
              <p className="text-sm font-semibold text-white m-0">Sherlock — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Sherlock maps people's public profiles. Use it <b>only on your own usernames or targets with written permission</b>. Stalking, doxxing or harassing anyone you find is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🔎" title="What is Sherlock?" subtitle="Map a username across 400+ sites">
        <p>
          <b>Sherlock</b> takes one username and checks 400+ sites for it, returning every public profile it finds. Your gaming handle from 2015 still links to forums, old posts and photos — all from one string.
        </p>
        <p>
          Audit yourself first: export the hits, delete or privatize what should never have been public, and split work and play handles. What you clean up, no investigator ever finds.
        </p>
        <FeatureGrid items={[
  { i: "👤", t: "400+ sites", d: "One handle, hundreds of checks." },
  { i: "🖨️", t: "Found-only mode", d: "--print-found hides the noise." },
  { i: "📊", t: "CSV export", d: "Spreadsheet your footprint." },
  { i: "🤫", t: "Passive", d: "Only visits public URLs." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Python 3.8+ with pip (any OS)", "Your own username to audit", "Internet access to public profile pages", "Written permission if the handle is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`sherlock --version
# Sherlock v0.14 ready`} />
        <CodeBlock title="debian / ubuntu" lines={`pip install sherlock-project`} />
        <InfoBox title="Kali has it already">
          Install with <span className="font-mono">pip install sherlock-project</span> (Python 3.8+) or clone the GitHub repo. On Kali it may already be packaged — try <span className="font-mono">sherlock --version</span> first.
        </InfoBox>
      </Section>

      <Section id="first" icon="👤" title="Step 1 — First Run" subtitle="Audit your own handle">
        <p className="text-xs text-slate-400">Check your own handle across hundreds of sites:</p>
        <CodeBlock title="terminal" lines={`sherlock johndoe123 --print-found
# [+] GitHub: github.com/johndoe123
# [+] Reddit: reddit.com/user/johndoe123`} />
        <InfoBox title="Face your footprint">
          The first run on your own handle is always surprising: old forums, forgotten signups, decade-old avatars. Write them all down — cleanup starts here.
        </InfoBox>
      </Section>

      <Section id="export" icon="📊" title="Step 2 — Export Hits" subtitle="Save the hit list">
        <p className="text-xs text-slate-400">Export hits for systematic cleanup:</p>
        <CodeBlock title="terminal" lines={`sherlock johndoe123 --csv --folderoutput
# johndoe123/sherlock.csv ready`} />
        <InfoBox title="Cleanup list">
          The spreadsheet becomes your deletion list. Work through it profile by profile: delete, privatize, or keep deliberately — no more accidents.
        </InfoBox>
      </Section>

      <Section id="verify" icon="👁️" title="Step 3 — Verify by Hand" subtitle="Verify uncertain hits">
        <p className="text-xs text-slate-400">Re-check uncertain results carefully:</p>
        <CodeBlock title="terminal" lines={`sherlock johndoe123 --verbose --timeout 20
# [?] site: uncertain — open by hand`} />
        <InfoBox title="Trust, then verify">
          TOR exit? Wrong portrait? Hand-verify before concluding anything. Sherlock finds candidates; judgment confirms identities.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Own Your Usernames" subtitle="Control your username footprint">
        <CodeBlock title="terminal" lines={`Google your own username monthly
# privatize what should not show`} />
        <FeatureGrid items={[
  { i: "🔒", t: "Private profiles", d: "Lock what strangers need not see." },
  { i: "👤", t: "Split identities", d: "Gaming name differs from work name." },
  { i: "🗑️", t: "Delete old accounts", d: "Shrink the username footprint." },
  { i: "👁️", t: "Self-search", d: "What Sherlock finds, others find." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Sherlock in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/sherlock/sherlock_scan.png" alt="Sherlock terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Sherlock finding a username across sites</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["--print-found", "Show only usernames that exist."], ["--csv / --xlsx", "Save hits to a spreadsheet."], ["--timeout", "Seconds per site, e.g. --timeout 15."], ["--verbose", "Show every check as it runs."], ["--folderoutput", "Save results under ./username/."], ["--browse", "Open found profiles in your browser."], ["--local", "Force local data, skip version check."], ["--nsfw", "Include NSFW sites in the check."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Command not found after pip install", "pip installed to user bin outside PATH. Use python3 -m sherlock instead, or add ~/.local/bin to PATH and reopen the terminal."], ["Everything times out", "Network blocks or a too-low timeout. Raise --timeout 20, check your connection, and rerun — some sites throttle aggressive checkers."], ["Too many false question marks", "Sites changed their pages and broke detection rules. Update Sherlock (git pull / pip upgrade) and hand-verify uncertain links."], ["NSFW sites in results surprise", "Sherlock skips adult sites unless asked. That is the default protecting you — only add --nsfw when the audit genuinely needs it."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "Sherlock on GitHub", "https://github.com/sherlock-project/sherlock"], ["📖", "Site list", "https://github.com/sherlock-project/sherlock#readme"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Sherlock checks public profile pages, but use it only on your own usernames or targets with written permission. Stalking or harassing people you find is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
