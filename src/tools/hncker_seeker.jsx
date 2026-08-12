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

function StepRow({ num, title, body }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand/20 text-brand font-bold text-sm mt-0.5 flex-none">{num}</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{title}</div>
          <div className="text-xs text-slate-400 leading-relaxed">{body}</div>
        </div>
      </div>
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
  { q: 'What is Seeker?', a: 'Seeker is an open-source tool that locates a smartphone by serving a web page that asks for location permission — exactly like a normal map or weather site. When the person taps Allow, Seeker grabs the exact Latitude and Longitude straight from the phone GPS hardware.' },
  { q: 'Is Seeker legal to use?', a: 'Seeker itself is a tool, but using it to track a phone you do not own, or without the person having given written consent, is illegal in most countries — it is a serious privacy and stalking crime. Use it only on your own devices, or with clear written permission, for authorized testing and education.' },
  { q: 'Does Seeker need the target to tap Allow?', a: 'Yes. The whole trick is a permission prompt, the same one every map site shows. If the target taps Allow, Seeker reads the GPS hardware and returns Latitude and Longitude. If they deny it, or are on a device without GPS (like most laptops), Seeker falls back to IP geolocation, which is far less precise.' },
  { q: 'How accurate is Seeker?', a: 'When the target accepts location permission on a phone with GPS, accuracy is typically within about 30 meters. Accuracy depends on the device (broken GPS gives nothing), the browser (some block the JS), and GPS calibration.' },
  { q: 'What else does Seeker collect besides location?', a: 'Along with coordinates it also reads device information with no permission at all: a canvas-fingerprint ID, operating system, platform, CPU cores, RAM, screen resolution, GPU, browser name and version, public and local IP, and local port.' },
  { q: 'How is this different from IP geolocation?', a: 'IP geolocation is not accurate — it returns the approximate location of the ISP, often the wrong city. Seeker uses the HTML Geolocation API and grabs the coordinates from the device GPS hardware, which is far more precise.' },
  { q: 'What are the Seeker command modes?', a: 'The basic mode is python3 seeker.py, which starts the server on port 8080. You can pick a template with -t, change the port with -p, output a KML file with -k, and expose the link over the internet with a tunnel (ngrok or localhost.run).' },
  { q: 'How do I protect myself from this?', a: 'Treat every location-permission prompt with suspicion. Never tap Allow on a site you did not deliberately visit. Review and revoke location permissions in your browser settings, and disable location sharing for unknown sites.' },
]

const howItWorks = [
  'Seeker hosts a web page that requests location permission, like a map site.',
  'You get a link and send it to the target (only your own device, or with consent).',
  'When the target taps Allow, the browser sends its GPS coordinates.',
  'Seeker reads the Latitude and Longitude from the GPS hardware.',
  'If GPS is unavailable, it falls back to IP geolocation (less precise).',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Locate Smartphones with Seeker — GPS Location Explained (Educational)',
      description: 'Understand how Seeker locates a smartphone: it hosts a page that asks for location permission and grabs exact GPS Latitude and Longitude from the browser. Covers the setup, how it works, and how to protect yourself. Consent and authorized use only.',
      about: 'Seeker smartphone locator',
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

export default function hncker_seeker() {
  return (
    <ToolLayout
      title="Locate Smartphones with Seeker — GPS Location Explained"
      desc="Understand how Seeker locates a smartphone: it hosts a page that asks for location permission and grabs exact GPS coordinates. Covers the setup, how the trick works, and how to protect yourself. Consent and authorized use only."
      icon="📍"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/seeker"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/seeker/seeker_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=0f_2WO3S22M" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/0f_2WO3S22M/hqdefault.jpg"
                alt="Seeker GPS Tutorial - Find a Phone Location With One Link"
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
              <p className="text-sm font-semibold text-white m-0">Seeker GPS Tutorial — Find a Phone Location With One Link</p>
              <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Seeker is a locator tool — this page explains it for <b>educational and authorized testing only</b>. Tracking a phone you
        do not own, or without the person's written consent, is a <b>serious privacy crime</b>. Only locate your own devices, or
        ones you have clear written permission to test. Understand the trick so you can defend against it.
      </WarningBox>

      <Section id="overview" icon="📍" title="What is Seeker?" subtitle="Locate a smartphone using social engineering">
        <p>
          <b>Seeker</b> locates a smartphone by serving a web page that asks for <b>location permission</b> — the exact same prompt
          a normal map or weather site shows. When the target taps <b>Allow</b>, Seeker grabs the <b>exact Latitude and Longitude</b>
          straight from the phone's GPS hardware.
        </p>
        <p>
          It's a <b>Proof of Concept</b> that demonstrates what a malicious website can collect about you — and why you should
          never click random links or grant critical permissions like Location. Beyond coordinates, Seeker also fingerprints the
          device, so it doubles as a security-awareness demo.
        </p>
        <FeatureGrid items={[
          { i: '🌐', t: 'Fake page', d: 'A location-request page, just like a real map site.' },
          { i: '📍', t: 'GPS capture', d: 'Grabs exact Latitude and Longitude from the phone GPS.' },
          { i: '🧭', t: 'More than a pin', d: 'Also reads accuracy, altitude, direction and speed when moving.' },
          { i: '🖥️', t: 'Device fingerprint', d: 'OS, platform, CPU, RAM, screen, GPU, browser and IP — no permission needed.' },
          { i: '🔁', t: 'IP fallback', d: 'No GPS? Falls back to IP geolocation (less precise).' },
          { i: '🤝', t: 'Permission-based', d: 'Only works if the target taps Allow.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="System Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'A Linux distribution (Kali, Ubuntu, Fedora, Parrot) or Termux — tested on all of these'],
            ['☑️', 'git installed (for the clone command)'],
            ['☑️', 'Python 3 installed'],
            ['☑️', 'An internet connection to reach the page and (optionally) a tunnel'],
            ['☑️', 'A phone you own, or one you have written permission to test'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
        <InfoBox title="macOS / OSX">
          Seeker also runs on macOS: clone the repo, <span className="font-mono">cd seeker</span>, then run
          <span className="font-mono"> python3 seeker.py</span>. To expose a tunnel on macOS, install ngrok with
          <span className="font-mono"> brew install ngrok/ngrok/ngrok</span> then run <span className="font-mono">ngrok http 8080</span>.
        </InfoBox>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Clone + install dependencies (step by step)">
        <p className="text-xs text-slate-400">On Kali Linux / Arch / Ubuntu / Fedora / Parrot OS / Termux:</p>
        <CodeBlock title="terminal" lines={`git clone https://github.com/thewhiteh4t/seeker.git
cd seeker/
chmod +x install.sh
./install.sh`} />
        <p className="text-xs text-slate-400">The installer pulls in the PHP templates and supporting files. On BlackArch Linux you can install the packaged version instead:</p>
        <CodeBlock title="terminal" lines={`sudo pacman -S seeker`} />
        <p className="text-xs text-slate-400">Or run it from Docker (no local dependencies at all):</p>
        <CodeBlock title="terminal" lines={`docker pull thewhiteh4t/seeker`} />
        <InfoBox title="No install needed on macOS">
          If you're on macOS, skip the installer — just clone and run <span className="font-mono">python3 seeker.py</span> directly.
        </InfoBox>
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Run the server and capture a location">
        <p className="text-xs text-slate-400">First, see every option available:</p>
        <CodeBlock title="terminal" lines={`python3 seeker.py -h`} />
        <p className="text-xs text-slate-400">Start Seeker on the default port 8080:</p>
        <CodeBlock title="terminal" lines={`python3 seeker.py
# [INF] Web server started on port 8080
# [OK] Send this link to the target`} />
        <p className="text-xs text-slate-400">When the target opens the link and taps Allow, the coordinates print on screen:</p>
        <CodeBlock title="terminal" lines={`[LOC] Waiting for location...
[LOC] Latitude:  19.0760
[LOC] Longitude: 72.8777
[LOC] Accuracy:  ~28 meters
[OK] Device info collected`} />
        <InfoBox title="GPS vs IP geolocation">
          Seeker works best on <b>smartphones</b> with GPS hardware. On a laptop, or a phone with broken GPS, there's no GPS signal,
          so Seeker falls back to IP geolocation or cached coordinates — a rough city-level position, not an exact pin.
        </InfoBox>
      </Section>

      <Section id="options" icon="🏷️" title="Command Options" subtitle="Tune behaviour from the terminal">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-t, --template</div>
            <div className="text-xs text-slate-400">Pre-select a page template by index (e.g. -t 1). See the Templates section below.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-p, --port</div>
            <div className="text-xs text-slate-400">Change the web server port (default 8080). Example: python3 seeker.py -p 1337.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-k, --kml</div>
            <div className="text-xs text-slate-400">Write a KML file for Google Earth. Example: python3 seeker.py -k coords.kml.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--telegram</div>
            <div className="text-xs text-slate-400">Forward captured info to a Telegram bot. Format: token:chatId separated by a colon.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--webhook</div>
            <div className="text-xs text-slate-400">POST captured events to a webhook endpoint. Endpoint must be unauthenticated and accept POST.</div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-d, --debugHTTP</div>
            <div className="text-xs text-slate-400">Disable the automatic http → https redirect for testing (only works on templates with an index_temp.html file).</div>
          </div>
        </div>
        <InfoBox title="Environment variables">
          Several options can be set via env vars instead of flags — <span className="font-mono">PORT</span>,
          <span className="font-mono">TEMPLATE</span>, <span className="font-mono">DEBUG_HTTP</span>,
          <span className="font-mono">TITLE</span>, <span className="font-mono">REDIRECT</span>, <span className="font-mono">IMAGE</span>,
          <span className="font-mono">DESC</span>, <span className="font-mono">SITENAME</span>, <span className="font-mono">DISPLAY_URL</span>,
          <span className="font-mono">MEM_NUM</span>, <span className="font-mono">ONLINE_NUM</span>, <span className="font-mono">TELEGRAM</span> and
          <span className="font-mono">WEBHOOK</span>. These let you deploy without the interactive prompt.
        </InfoBox>
      </Section>

      <Section id="tunnel" icon="🌐" title="Exposing the Link Over the Internet" subtitle="Reach the target beyond your local network">
        <p className="text-xs text-slate-400">By default the server only runs on your machine. To get a shareable link, run a tunnel in a second terminal:</p>
        <CodeBlock title="terminal — terminal 1" lines={`python3 seeker.py`} />
        <CodeBlock title="terminal — terminal 2 (ngrok)" lines={`ngrok http 8080`} />
        <p className="text-xs text-slate-400">No ngrok installed? Use a localhost tunnel instead:</p>
        <CodeBlock title="terminal" lines={`ssh -R 80:localhost:8080 nokey@localhost.run`} />
        <InfoBox title="Custom port with a tunnel">
          If you changed the port (e.g. <span className="font-mono">python3 seeker.py -p 1337</span>), point the tunnel at that port too:
          <span className="font-mono"> ngrok http 1337</span>.
        </InfoBox>
      </Section>

      <Section id="templates" icon="📄" title="Templates" subtitle="Choose the fake page to show the target">
        <p>Seeker ships several pre-built templates that each look like a real, trusted site. This is the social-engineering part — the page must look legitimate so the target taps Allow.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['NearYou', 'Google Drive', 'WhatsApp', 'Telegram', 'Zoom', 'Google reCAPTCHA'].map(t => (
            <div key={t} className="rounded-xl p-3 border border-white/8 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-white">{t}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">Pick one at launch with <span className="font-mono">-t</span> followed by the template's index (e.g. <span className="font-mono">python3 seeker.py -t 1</span>). You can also build your own template — the repo includes a guide for it — and propose it back via a pull request.</p>
      </Section>

      <Section id="result" icon="📟" title="What Seeker Collects" subtitle="Location + device fingerprint">
        <p className="text-xs text-slate-400">If the target taps Allow, Seeker captures:</p>
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['📍', 'Longitude and Latitude (GPS, ~30 m accurate)'],
            ['📏', 'Accuracy, and when available: altitude, direction and speed (only if moving)'],
            ['🖥️', 'Device info with no permission: unique canvas-fingerprint ID, device model, OS, platform'],
            ['🧮', 'CPU core count and RAM amount (approximate)'],
            ['🖼️', 'Screen resolution and GPU information'],
            ['🌐', 'Browser name and version, plus public IP, local IP and local port'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
        <InfoBox title="Why this matters">
          Everything on that list — except the exact coordinates — is readable <b>without any permission at all</b>. Seeker shows
          exactly how much a normal-looking website can learn about you, which is the whole point of the tool as a security demo.
        </InfoBox>
      </Section>

      <Section id="how" icon="⚙️" title="How the Trick Works" subtitle="A permission prompt, weaponized">
        <StepRow num={1} title="Host a location-request page" body="Seeker starts a web server that serves a page requesting location access — visually identical to a normal map or weather site." />
        <StepRow num={2} title="Send the link" body="You share the link with the target. When they open it, the browser shows a permission prompt for location access." />
        <StepRow num={3} title="Tap Allow, get GPS" body="If the person taps Allow, the browser sends its GPS coordinates. Seeker logs the Latitude and Longitude straight to your screen." />
        <StepRow num={4} title="Device fingerprint" body="While the page loads, Seeker also reads the browser's device fingerprint — OS, platform, screen, CPU, GPU and IP — without asking for any permission." />
        <StepRow num={5} title="IP geolocation fallback" body="On devices with no GPS hardware, like most laptops, Seeker falls back to IP geolocation — a rough city-level location, not an exact pin." />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Seeker in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/seeker/seeker_scan.png" alt="Seeker capturing GPS Latitude and Longitude from a smartphone browser"
            width="1080" height="1920" className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Seeker capturing GPS Latitude and Longitude</figcaption>
        </figure>
      </Section>

      <Section id="issues" icon="🐞" title="Known Issues & How to Fix Them" subtitle="Real problems people hit, with working fixes">
        <div className="space-y-3">
          <IssueRow
            issue="Location is rough / city-level, not an exact pin"
            fix="The target device has no GPS hardware (a laptop or desktop browser), or GPS is broken. Seeker falls back to IP geolocation. For an exact pin you need a smartphone with working GPS that taps Allow."
          />
          <IssueRow
            issue="'Command not found' when running seeker.py"
            fix="Make sure you are inside the repo directory (cd seeker) and Python 3 is installed. On Linux, run ./install.sh first — it sets up the required PHP templates and files."
          />
          <IssueRow
            issue="The link only works on my machine"
            fix="Seeker's server runs locally. To reach the target over the internet, start a tunnel in a second terminal — ngrok http 8080, or ssh -R 80:localhost:8080 nokey@localhost.run."
          />
          <IssueRow
            issue="Nothing happens when the target opens the link"
            fix="They denied the location prompt, or their browser blocks the JavaScript. Seeker only captures data if the person taps Allow. Ask them to allow location, and confirm the browser isn't blocking scripts."
          />
          <IssueRow
            issue="Very inaccurate coordinates on some devices"
            fix="Accuracy depends on GPS calibration. An uncalibrated GPS gives inaccurate results. Accuracy is usually within ~30 meters when the phone GPS is healthy."
          />
          <IssueRow
            issue="The http → https redirect breaks the page during testing"
            fix="Seeker auto-redirects http to https. For local testing on templates that have an index_temp.html file, launch with -d / --debugHTTP to disable the redirect."
          />
        </div>
      </Section>

      <Section id="defense" icon="🛡️" title="How to Protect Yourself" subtitle="Don't give away your location">
        <div className="space-y-3">
          <InfoBox title="Question every location prompt">
            Only tap Allow on sites you deliberately visited. A random link asking for your location is a red flag.
          </InfoBox>
          <InfoBox title="Revoke browser location permissions">
            Review your browser's site settings and revoke location access for any site you don't actively use.
          </InfoBox>
          <InfoBox title="Disable location for unknown sites">
            Set your browser to block location requests by default, then allow them per-site only where needed.
          </InfoBox>
          <InfoBox title="Treat unknown links with suspicion">
            This works because a person taps Allow. Never open or allow prompts on links from unknown sources.
          </InfoBox>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official and reference links">
        <div className="space-y-2">
          {[
            ['📍', 'Seeker (official)', 'https://github.com/thewhiteh4t/seeker'],
            ['🎬', 'Seeker tutorial (HNCKER)', 'https://www.youtube.com/watch?v=0f_2WO3S22M'],
            ['🛡️', 'Mozilla — location permission control', 'https://support.mozilla.org/en-US/kb/site-permissions-panel'],
            ['🔐', 'Privacy Guides — browser hardening', 'https://www.privacyguides.org/'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you test anything">
        <p>
          This guide is provided <b>strictly for educational and authorized security testing</b>. Using Seeker to track a phone you
          do not own, or without the person's written consent, is a <b>serious privacy crime</b>. Only test devices you own or have
          written permission to assess. The authors and this site are not responsible for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
