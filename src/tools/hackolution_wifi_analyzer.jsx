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
  { q: "What does WiFi Analyzer do?", a: "WiFi Analyzer is a free Android app that scans nearby networks, shows every device connected to your WiFi, measures signal strength, maps channel congestion, and tests your internet speed — all on your device, no sign-up." },
  { q: "How do I see who is using my WiFi?", a: "Open the app, tap Devices. In seconds you see every connected phone, TV, camera and laptop with names and IP addresses. An entry you do not recognise is someone using your network." },
  { q: "Someone unknown is on my WiFi — what now?", a: "Open your router admin page, change the WiFi passphrase to a 20+ character random one, turn on WPA3 (or WPA2-AES), and reconnect only your own devices. The stranger is locked out instantly." },
  { q: "Which channel should my router use?", a: "Open Channel Analyzer in the app. Pick the emptiest channel on 2.4 GHz (usually 1, 6 or 11) or any quiet one on 5 GHz, set it in your router, and re-scan to confirm your network is clear of neighbours." },
  { q: "Is WiFi Analyzer free?", a: "Yes. Download the APK free from the Hackolution Apps page. No sign-up, no account, everything stays on your phone." },
  { q: "How do I become a tester?", a: "Comment your email on the hackolution Instagram reel and you get early tester builds of WiFi Analyzer with new features first." },
  { q: "Is scanning my own WiFi legal?", a: "Yes — auditing your own router and devices is legal and recommended. Only ever scan networks you own or have written permission to test." },
]

const howItWorks = [
  "Install WiFi Analyzer on your Android phone.",
  "Open the app and tap Devices to list every connection.",
  "Spot the stranger: a name you do not recognise.",
  "Change your passphrase and move to a clear channel.",
  "Re-scan to confirm only your devices remain.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "WiFi Analyzer — Find Who Uses Your WiFi (Free Android App)",
      description: "Use WiFi Analyzer's device monitor to list every phone on your network, kick strangers off, and pick the clearest channel.",
      about: "WiFi Analyzer Android app",
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

export default function hackolution_wifi_analyzer() {
  return (
    <ToolLayout
      title="WiFi Analyzer — Find Who Uses Your WiFi"
      desc="Free Android app: list every device on your WiFi in seconds, kick strangers off, pick the clearest channel, test speed. As seen on the HACKOLUTION reel."
      icon="📶"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/wifi-analyzer"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/apps/wifi-analyzer.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Watch the Reel" subtitle="The 23-second version on Instagram">
        <div className="max-w-3xl mx-auto">
          <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <img src="/assets/apps/wifi-analyzer.png" alt="WiFi Analyzer app — find who uses your WiFi" width="480" height="480"
              className="w-full h-auto object-contain" loading="lazy" />
            <figcaption className="px-4 py-2 text-xs text-slate-400">WiFi Analyzer — the app from the HACKOLUTION reel</figcaption>
          </figure>
          <div className="flex gap-2 flex-wrap mt-3">
            <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline"
              style={{ background: 'linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)', color: '#fff' }}>📸 Watch the reel @hackolution</a>
            <a href="/hackolution/apps/" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white transition-all">📥 Get the free APK</a>
          </div>
        </div>
      </Section>

      <WarningBox>
        WiFi Analyzer lists devices on networks you join. Use it <b>only on your own router and your own devices</b>. Accessing anyone else's network or devices without permission is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="📶" title="What is WiFi Analyzer?" subtitle="Every device on your WiFi, in seconds">
        <p>
          <b>WiFi Analyzer</b> answers the question every slow-internet evening asks: <b>who else is on my WiFi?</b> Open the app, tap Devices, and in seconds you see every connected phone, TV, camera and laptop — with names and IP addresses.
        </p>
        <p>
          One name you do not recognise is a stranger eating your speed. This guide shows the 3-tap check from the reel, then how to lock them out for good.
        </p>
        <FeatureGrid items={[
  { i: "📱", t: "Device monitor", d: "Every connected device, named." },
  { i: "📶", t: "Signal gauge", d: "Live dBm + quality meter." },
  { i: "📊", t: "Channel analyzer", d: "Dodge neighbour interference." },
  { i: "⚡", t: "Speed test", d: "3-pass averaged result." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Android 6.0 or newer", "Your own WiFi router (admin access to change settings)", "WiFi Analyzer APK from the Hackolution Apps page"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Free APK, no sign-up">
        <p className="text-xs text-slate-400">Grab the free APK from the Hackolution Apps page and install it on your phone:</p>
        <CodeBlock title="steps" lines={`1. Open /hackolution/apps/
2. Download wifi-analyzer-2.1.apk
3. Install + open — no account needed`} />
        <InfoBox title="Everything stays on your phone">
          No sign-up, no uploads. Scans, saved networks and passwords never leave your device.
        </InfoBox>
      </Section>

      <Section id="scan" icon="🔍" title="Step 1 — The 3-Tap Check" subtitle="Find the stranger (from the reel)">
        <p className="text-xs text-slate-400">Exactly what the reel shows — takes under a minute:</p>
        <CodeBlock title="in the app" lines={`Open WiFi Analyzer
Tap Devices
Read the list — one entry per device`} />
        <InfoBox title="Read the list like this">
          Your Phone, Smart TV, your laptop — expected. An <b>Unknown Phone</b> you never connected is the stranger. Note its IP and MAC before you lock it out.
        </InfoBox>
      </Section>

      <Section id="lockout" icon="🔒" title="Step 2 — Lock Them Out" subtitle="One passphrase change ends it">
        <p className="text-xs text-slate-400">On your router admin page (usually 192.168.1.1):</p>
        <CodeBlock title="router settings" lines={`Wireless password -> 20+ random chars
Security -> WPA3 (or WPA2-AES)
WPS -> OFF
Reconnect only YOUR devices`} />
        <InfoBox title="Instant eviction">
          Changing the passphrase disconnects every device at once — including the stranger, who cannot get back in. Re-scan in the app to confirm only yours remain.
        </InfoBox>
      </Section>

      <Section id="channels" icon="📊" title="Step 3 — Pick a Clear Channel" subtitle="Stop neighbour interference">
        <p className="text-xs text-slate-400">Slow even with no strangers? Neighbour routers crowd your channel:</p>
        <CodeBlock title="in the app" lines={`Open Channel Analyzer
2.4 GHz -> emptiest of 1 / 6 / 11
5 GHz -> any quiet channel
Set it in your router -> re-scan`} />
      </Section>

      <Section id="tester" icon="🧪" title="Become a Tester" subtitle="Early builds, new features first">
        <p>
          Tester builds of WiFi Analyzer ship new features before public release. To join, <b>comment your email on the hackolution Instagram reel</b> — the same CTA from the video — or follow <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener noreferrer" className="text-green-300">@hackolution</a> and DM your email.
        </p>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Devices list is empty", "Location permission is off — Android requires it for WiFi scans. Grant location, keep WiFi on, and pull to refresh."], ["A device shows as Unknown", "Cheap IoT gadgets hide their vendor name. Match it by disconnecting suspects one by one and re-scanning, or block its MAC in the router."], ["Speed still slow after lockout", "Check Channel Analyzer — neighbour interference, not strangers, is usually the cause on 2.4 GHz. Move channels and re-test."], ["App cannot install the APK", "Enable Install unknown apps for your browser in Android settings, then reinstall from the downloaded APK."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📸", "HACKOLUTION Instagram", "https://www.instagram.com/hackolution"], ["📥", "Hackolution Android Apps (free APK)", "/hackolution/apps/"], ["🌐", "Uptools speed test", "/internet-speed-test/"]].map(([i, label, href]) => (
            <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Scan only networks you own or have written permission to test. Accessing anyone else's network or devices is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
