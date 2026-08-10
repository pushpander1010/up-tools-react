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

const faq = [
  { q: 'What is Seeker?', a: 'Seeker is an open-source tool that locates a smartphone by serving a web page that asks for location permission, exactly like a normal map or weather site. When the person taps Allow, Seeker grabs the exact Latitude and Longitude from the phone GPS hardware.' },
  { q: 'Is Seeker legal to use?', a: 'Seeker itself is a tool, but using it to track a phone you do not own, or without the person having given written consent, is illegal in most countries — it is a serious privacy and stalking crime. Use it only on your own devices, or with clear written permission, for authorized testing and education.' },
  { q: 'Does Seeker need the target to tap Allow?', a: 'Yes. The whole trick is a permission prompt, the same one every map site shows. If the target taps Allow, Seeker reads the GPS hardware and returns Latitude and Longitude. If they deny it, or are on a device without GPS (like most laptops), Seeker falls back to IP geolocation, which is far less precise.' },
  { q: 'Why does Seeker need a web server?', a: 'Seeker starts a local web server that hosts the location-request page and captures the browser GPS response. Running it with python3 seeker.py -t manual gives you a link to send; the server logs the coordinates when someone taps Allow.' },
  { q: 'What are the command modes?', a: 'The most common mode is manual (python3 seeker.py -t manual), which starts the server and prints a link to share. There are also port-forwarding and Cloudflare tunnel modes for exposing the link over the internet. Always use them only on authorized targets.' },
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
        <FeatureGrid items={[
          { i: '🌐', t: 'Fake page', d: 'A location-request page, just like a real map site.' },
          { i: '📍', t: 'GPS capture', d: 'Grabs exact Latitude and Longitude from the phone GPS.' },
          { i: '📡', t: 'Web server', d: 'Hosts the page and logs coordinates when Allow is tapped.' },
          { i: '🔁', t: 'IP fallback', d: 'No GPS? Falls back to IP geolocation (less precise).' },
          { i: '🤝', t: 'Permission-based', d: 'Only works if the target taps Allow.' },
          { i: '🛡️', t: 'Consent required', d: 'Your device only, or with written permission.' },
        ]} />
      </Section>

      <Section id="setup" icon="🛠️" title="The Setup" subtitle="Clone, run, and get a link">
        <p>The tool is open source on GitHub. The setup is three commands — clone it, run it, and Seeker gives you a link to send.</p>
        <CodeBlock title="Clone and run Seeker">
{`git clone https://github.com/thewhiteh4t/seeker.git
cd seeker
python3 seeker.py -t manual
# [INF] Web server started
# [OK] Send this link to target`}
        </CodeBlock>
      </Section>

      <Section id="how" icon="⚙️" title="How the Trick Works" subtitle="A permission prompt, weaponized">
        <StepRow num={1} title="Host a location-request page" body="Seeker starts a web server that serves a page requesting location access — visually identical to a normal map or weather site." />
        <StepRow num={2} title="Send the link" body="You share the link with the target. When they open it, the browser shows a permission prompt for location access." />
        <StepRow num={3} title="Tap Allow, get GPS" body="If the person taps Allow, the browser sends its GPS coordinates. Seeker logs the Latitude and Longitude straight to your screen." />
        <StepRow num={4} title="IP geolocation fallback" body="On devices with no GPS hardware, like most laptops, Seeker falls back to IP geolocation — a rough city-level location, not an exact pin." />
      </Section>

      <Section id="result" icon="📟" title="The Result" subtitle="Coordinates captured from GPS">
        <CodeBlock title="Seeker result">
{`[LOC] Waiting for location...
[LOC] Latitude:  19.0760
[LOC] Longitude: 72.8777`}
        </CodeBlock>
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

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Seeker in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/seeker/seeker_scan.png" alt="Seeker capturing GPS Latitude and Longitude from a smartphone browser"
            width="1080" height="1920" className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Seeker capturing GPS Latitude and Longitude</figcaption>
        </figure>
      </Section>

      <Section id="issues" icon="🐞" title="Common Questions" subtitle="Answered plainly">
        <StepRow num="!" title="Why is the location rough, not exact?" body="If the target's device has no GPS hardware (a laptop, or a desktop browser), Seeker falls back to IP geolocation, which only gives a city-level position. Exact pins come only from a phone GPS that tapped Allow." />
        <StepRow num="!" title="Does it work if the target denies Allow?" body="No. The whole trick depends on the person tapping Allow. If they deny it, no GPS data is sent, and Seeker falls back to IP geolocation or nothing." />
        <StepRow num="!" title="Is this the same as a phishing page?" body="Conceptually yes — it hosts a page that asks for something and captures it, the same pattern as a credential-phishing page. That is exactly why it must only ever be used with consent for authorized testing." />
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official and reference links">
        <div className="space-y-2">
          {[
            ['📍', 'Seeker (official)', 'https://github.com/thewhiteh4t/seeker'],
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
