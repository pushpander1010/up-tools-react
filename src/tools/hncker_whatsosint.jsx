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
  { q: 'What is WhatsOSINT?', a: 'WhatsOSINT is an open-source Python tool that looks up a WhatsApp phone number and returns public data about it — whether an account exists, its status and profile photo — via the WP Data API.' },
  { q: 'Is WhatsOSINT illegal?', a: 'The tool itself is legal and open source. It only queries publicly available WhatsApp data through an API. Using it to harass, stalk or doxx someone without consent can break privacy laws and platform terms. Use it only for authorized research.' },
  { q: 'What do I need to run it?', a: 'Python 3 and a free RapidAPI key for the WP Data API. You put the key in a .env file, then run: python3 WhatsOSINT.py' },
  { q: 'How do I install it?', a: 'Clone the repository with git clone https://github.com/HackUnderway/WhatsOSINT.git, cd WhatsOSINT, then pip install -r requirements.txt. Put your API key in the .env file.' },
  { q: 'How do I run a lookup?', a: 'Run python3 WhatsOSINT.py and enter the phone number when prompted. It queries the API and prints what it finds about that number.' },
  { q: 'What can it find?', a: 'It can confirm whether the number has a WhatsApp account and pull public details like the profile photo and status.' },
  { q: 'Does it need an API key?', a: 'Yes. The default provider (RapidAPI / WP Data) needs a free RAPIDAPI_KEY. You can also switch provider/check mode via environment variables to control cost.' },
  { q: 'What is WhatsOSINT good for?', a: 'It is a quick, passive way to confirm whether a number is on WhatsApp during authorized OSINT, social-engineering awareness and red-team work.' },
]

const howItWorks = [
  'Install WhatsOSINT from the official repository and install its dependencies.',
  'Add your free WP Data / RapidAPI key to the .env file.',
  'Run WhatsOSINT.py and enter the phone number.',
  'It queries the public WhatsApp data API and returns account status, photo and status text.',
  'Review the results in the terminal.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'WhatsOSINT — WhatsApp Number Lookup Tool (Educational)',
      description: 'Complete step-by-step reference for installing and using WhatsOSINT, a Python WhatsApp-number OSINT tool. Education and authorized research only.',
      about: 'WhatsOSINT WhatsApp OSINT tool',
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

export default function hncker_whatsosint() {
  return (
    <ToolLayout
      title="WhatsOSINT — WhatsApp Number Lookup"
      desc="Step-by-step reference: install & use WhatsOSINT to check a WhatsApp number and pull its public data. Educational purposes only."
      icon="💬"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(57,255,20,0.08))"
      category="security"
      slug="hncker/whatsosint"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/whatsosint/whatsosint_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=VZK6huQ0NvQ" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/VZK6huQ0NvQ/hqdefault.jpg"
                alt="WhatsOSINT Tutorial - Check if a Number Is on WhatsApp"
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
              <p className="text-sm font-semibold text-white m-0">WhatsOSINT Tutorial — Check if a Number Is on WhatsApp</p>
              <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        WhatsOSINT looks up publicly available data about a phone number. Use it <b>only for authorized OSINT
        research, security awareness and red-team engagements</b>. Looking up numbers without consent can violate
        privacy laws and platform terms. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🕵️" title="What is WhatsOSINT?" subtitle="Check a WhatsApp number from the terminal">
        <p>
          <b>WhatsOSINT</b> is an open-source <b>Python</b> tool that checks whether a phone number has a
          <b> WhatsApp account</b> and pulls its <b>public data</b> — account status, profile photo and more — from
          the terminal.
        </p>
        <p>
          It's a fast, passive first step during authorized OSINT and red-team work to confirm a number and gather
          the public WhatsApp profile tied to it before you go deeper.
        </p>
        <FeatureGrid items={[
          { i: '⚡', t: 'Fast & passive', d: 'Queries public WhatsApp data via a single API call.' },
          { i: '💬', t: 'Account check', d: 'Confirms if a number is registered on WhatsApp.' },
          { i: '🖼️', t: 'Profile photo', d: 'Pulls the public profile picture of the account.' },
          { i: '📌', t: 'Status text', d: 'Retrieves the account status when available.' },
          { i: '🔌', t: 'Configurable', d: 'Choose provider and check mode to control cost.' },
          { i: '🖥️', t: 'CLI-first', d: 'Runs entirely from the terminal — no dashboard.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Python 3 installed'],
            ['☑️', 'A free WP Data / RapidAPI key (put it in .env)'],
            ['☑️', 'An internet connection to reach the API'],
            ['☑️', 'A phone number you are authorized to look up'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Clone + install dependencies">
        <CodeBlock title="terminal" lines={`git clone https://github.com/HackUnderway/WhatsOSINT.git
cd WhatsOSINT
pip install -r requirements.txt`} />
        <InfoBox title="API key">
          Add your free WP Data (RapidAPI) key to the <span className="font-mono">.env</span> file, replacing the
          <span className="font-mono">Your_Api_Key</span> placeholder with your real key. Never commit a real key to git.
        </InfoBox>
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Run a lookup in two steps">
        <p className="text-xs text-slate-400">Start the tool — it prompts for the phone number:</p>
        <CodeBlock title="terminal" lines={`python3 WhatsOSINT.py
[?] Enter the phone number: 919876543210
[+] Account found on WhatsApp
[OK] Photo + status pulled`} />
        <InfoBox title="Cost control">
          By default it does a live check every time. Set <span className="font-mono">CHECK_MODE=cache_first</span> or
          <span className="font-mono">cache_only</span> in <span className="font-mono">.env</span> to read the cached
          database first and save API calls.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="WhatsOSINT in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/whatsosint/whatsosint_scan.png" alt="WhatsOSINT checking a phone number in the terminal" width="1076" height="1296"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Running WhatsOSINT against a phone number</figcaption>
        </figure>
      </Section>

      <Section id="options" icon="🏷️" title="Environment Options" subtitle="Tune behaviour via .env">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">RAPIDAPI_KEY</div>
            <div className="text-xs text-slate-400">API key for the default WP Data / RapidAPI provider.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">CHECK_PROVIDER</div>
            <div className="text-xs text-slate-400">rapidapi (default) or native (direct endpoint).</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">CHECK_MODE</div>
            <div className="text-xs text-slate-400">live (default), cache_first, or cache_only — controls cost.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">NATIVE_API_KEY</div>
            <div className="text-xs text-slate-400">Separate non-RapidAPI credential for the native provider.</div>
          </div>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="'RAPIDAPI_KEY' not set or lookup fails with a key error"
            fix="Add your free WP Data key to the .env file (RAPIDAPI_KEY=your_key). Make sure it's the WP Data API key from RapidAPI, then re-run python3 WhatsOSINT.py."
          />
          <IssueRow
            issue="Command 'WhatsOSINT' not found"
            fix={`Use python3 WhatsOSINT.py from inside the repo directory (after cd WhatsOSINT). If the module isn't found, run pip install -r requirements.txt first.`}
          />
          <IssueRow
            issue="Lookup returns no account / empty result"
            fix="Confirm the number includes the country code without a leading + or 00. Free API plans may also hit rate limits — wait a moment and retry, or check your key's quota."
          />
          <IssueRow
            issue="Too many API calls / cost concerns"
            fix="Set CHECK_MODE=cache_first or cache_only in .env to reuse cached results instead of a fresh live check on every lookup."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official repository', 'https://github.com/HackUnderway/WhatsOSINT'],
            ['🔑', 'WP Data API (RapidAPI)', 'https://rapidapi.com/airaudoeduardo/api/wp-data/'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you look up anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized research purposes</b>. WhatsOSINT
          retrieves publicly available data about a phone number. Using it to investigate people without a legitimate,
          authorized reason may violate privacy laws and platform terms. Use it only on data you are permitted to
          research — your own, or within an authorized OSINT, security-awareness or red-team engagement. The author and
          this site are not responsible for any misuse of this information.
        </p>
      </Section>
    </ToolLayout>
  )
}
