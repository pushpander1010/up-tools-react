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
  { q: 'What is Phunter?', a: 'Phunter is a free, open-source OSINT tool written in Python that lets you look up various publicly available details using a phone number.' },
  { q: 'Is Phunter illegal?', a: 'The tool itself is open source and legal. It only looks up publicly available information. Using it to harass, stalk or target someone without a legitimate reason can break privacy laws and platform terms. Use it responsibly and only for authorized research.' },
  { q: 'How do I install it?', a: 'Clone the repo, then install the requirements: git clone https://github.com/N0rz3/Phunter.git && cd Phunter && pip3 install -r requirements.txt.' },
  { q: 'What format should the phone number be in?', a: 'Use the international format (country code plus the number, e.g. +12125551234). The tool expects a full international number to look up correctly.' },
  { q: 'What kind of info can it return?', a: 'Depending on the source, it can return basic line details such as the country, state/region and whether it is a landline or mobile number, along with any public data the selected source exposes.' },
  { q: 'Why did a lookup return nothing?', a: 'Some public sources are slow, rate-limited or temporarily unavailable. Try again after a moment, or run the target function which tends to give reliable basic line information.' },
  { q: 'Do I need any API keys?', a: 'Some sources may work out of the box, while others benefit from keys or configuration in the config.json file. Check the repo README for which sources need setup.' },
  { q: 'Is Phunter good for beginners?', a: 'Yes. It has a simple interactive menu and a single-file Python script, making it a friendly introduction to phone-number OSINT.' },
]

const howItWorks = [
  'Install Phunter and its Python requirements.',
  'Run the script and pick an option.',
  'Enter the phone number in international format.',
  'It queries public sources for available details.',
  'Results are displayed in the terminal.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Phunter — Phone Number OSINT Tool (Educational)',
      description: 'Complete step-by-step reference for installing and using Phunter, a Python OSINT tool to look up details via a phone number. Education and authorized research only.',
      about: 'Phunter phone number OSINT tool',
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

export default function hncker_phunter() {
  return (
    <ToolLayout
      title="Phunter — Phone Number OSINT Tool"
      desc="Step-by-step reference: install & use Phunter, a Python OSINT tool to look up details via a phone number. Educational purposes only."
      icon="📞"
      iconBg="linear-gradient(135deg, rgba(34,197,94,0.18), rgba(16,185,129,0.08))"
      category="security"
      slug="hncker/phunter"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/phunter/phunter_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=toMN_jHJPX4" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/toMN_jHJPX4/hqdefault.jpg"
                alt="Phunter Tutorial - Look Up Anything Behind a Phone Number"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">Phunter Tutorial: Look Up Anything Behind a Phone Number</p>
                <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Phunter looks up publicly available details for a phone number. Use it <b>only for authorized OSINT research,
        security awareness and red-team engagements</b>. Looking up people without a legitimate purpose can violate
        privacy laws and platform terms. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🕵️" title="What is Phunter?" subtitle="Phone-number OSINT from the terminal">
        <p>
          <b>Phunter</b> is a free, open-source <b>OSINT tool</b> written in <b>Python</b> that lets you look up various
          publicly available details using a <b>phone number</b> — all from a simple interactive menu in the terminal.
        </p>
        <p>
          It's a practical entry point for authorized phone-number reconnaissance: give it an international number and it
          queries public sources for whatever info they expose, like the line's country, region and type.
        </p>
        <FeatureGrid items={[
          { i: '📞', t: 'Phone lookup', d: 'Search public details using a phone number.' },
          { i: '🌍', t: 'Line details', d: 'Country, state/region and landline vs mobile.' },
          { i: '🐍', t: 'Simple Python', d: 'Single-file script, easy to read and run.' },
          { i: '🪟', t: 'Interactive menu', d: 'Pick what you want from a clean terminal menu.' },
          { i: '🔌', t: 'Config-driven', d: 'Tweak sources and keys via config.json.' },
          { i: '🖥️', t: 'CLI-first', d: 'No dashboard — runs anywhere with Python.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Python 3 and pip'],
            ['☑️', 'git (to clone the repository)'],
            ['☑️', 'A phone number in international format'],
            ['☑️', '(Optional) API keys / config for extra sources'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Clone and install requirements">
        <CodeBlock title="terminal" lines={`git clone https://github.com/N0rz3/Phunter.git
cd Phunter
pip3 install -r requirements.txt`} />
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Run a lookup in seconds">
        <p className="text-xs text-slate-400">Start the interactive menu:</p>
        <CodeBlock title="terminal" lines={`python3 phunter.py`} />
        <InfoBox title="Number format">
          Enter the phone number in <b>international format</b> (country code + number), for example{' '}
          <span className="font-mono">+12125551234</span>, so the sources can identify the correct country and line.
        </InfoBox>
        <InfoBox title="Target option">
          The <span className="font-mono">Target</span> option tends to return reliable basic line info such as country,
          state and whether the number is a landline or mobile — a good first check.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Phunter in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/phunter/phunter_scan.png" alt="Phunter OSINT lookup output for a phone number" width="1641" height="655"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Phunter lookup output in the terminal</figcaption>
        </figure>
      </Section>

            <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">&lt;phone_number&gt;</div>
            <div className="text-xs text-slate-400">Positional argument: the phone number to look up.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-a, --all</div>
            <div className="text-xs text-slate-400">Run every enabled lookup source.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o, --output</div>
            <div className="text-xs text-slate-400">Write the results to an output file.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-v, --verbose</div>
            <div className="text-xs text-slate-400">Show extra detail while each source runs.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--json</div>
            <div className="text-xs text-slate-400">Print the result as JSON.</div>
          </div>
        </div>
      </Section>

<Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="Module not found / pip install errors"
            fix={`Make sure you are in the Phunter directory and using Python 3: python3 phunter.py. Re-run pip3 install -r requirements.txt. If it still fails, upgrade pip with pip3 install --upgrade pip.`}
          />
          <IssueRow
            issue="Lookup returns nothing or is slow"
            fix={`Public sources can be rate-limited or down. Wait a moment and retry. Prefer the Target option, which tends to return reliable basic line info.`}
          />
          <IssueRow
            issue="Wrong country or no info"
            fix={`Use the full international format with the country code (e.g. +12125551234). A local or short number may not resolve correctly.`}
          />
          <IssueRow
            issue="Some sources need keys"
            fix={`Check the README and config.json. Adding free API keys or config for the sources you want can enable more lookups.`}
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'Official repository', 'https://github.com/N0rz3/Phunter'],
            ['🐛', 'Report issues', 'https://github.com/N0rz3/Phunter/issues'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you scan anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized research purposes</b>. Phunter looks
          up publicly available details for a phone number. Using it to investigate people without a legitimate,
          authorized reason may violate privacy laws and platform terms. Use it only on numbers you are permitted to
          research, or within an authorized OSINT, security-awareness or red-team engagement. The author and this site
          are not responsible for any misuse of this information.
        </p>
      </Section>
    </ToolLayout>
  )
}
