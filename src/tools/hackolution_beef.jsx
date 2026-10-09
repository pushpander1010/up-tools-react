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
  { q: "What is BeEF?", a: "BeEF is a free, open-source browser security testing tool on Kali. A consenting lab browser loads hook.js and appears in the panel with fingerprint details and hundreds of demo command modules." },
  { q: "Is using BeEF legal?", a: "BeEF itself is legitimate training software. Hooking browsers without the owner explicit written consent is illegal. Demo only on your own browsers or signed simulation scopes in isolated labs." },
  { q: "How do I install BeEF?", a: "It ships with Kali Linux. Elsewhere run sudo apt install beef-xss -y and launch with sudo beef-xss. The panel lives at http://127.0.0.1:3000/ui/panel with default login beef and password beef." },
  { q: "How do I hook a lab browser?", a: "Load a test page including the hook.js URL in a browser you own. It appears under Hooked Browsers ready for consent-based demo modules." },
  { q: "What do the demo modules show?", a: "Browser fingerprinting, visited URLs, permission prompts, and social engineering lures — proof of what one malicious click exposes, taught defensively." },
  { q: "How do I defend against hook attacks?", a: "Inspect links, run minimal extensions, deny unexpected permission prompts, keep browsers updated, and use phishing-resistant MFA for important accounts." },
  { q: "Why is my browser not hooking?", a: "Check lab network reachability to the hook URL, disable script-blocking extensions for the demo, and confirm the exact hook address in the BeEF console." },
  { q: "Should keylogging modules ever run?", a: "Only where the signed scope explicitly permits, on consenting participants, with data wiped right after the debrief. Default to gentler proofs." }
]

const howItWorks = [
  "Launch BeEF on Kali and change the default panel password.",
  "Hook only browsers you own or consenting simulation participants.",
  "Run informational and lure-visibility modules to prove the risk.",
  "Debrief with link hygiene, extension audits, and permission discipline.",
  "Roll out phishing-resistant MFA and wipe all lab participant data."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'BeEF Browser Exploitation Framework — Hook Demo & Browser Defense Guide',
      description: 'Step-by-step reference: demo browser risks with BeEF hook.js in authorized labs. Defense focus.',
      about: 'BeEF browser exploitation demonstration',
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

export default function hackolution_beef() {
  return (
    <ToolLayout
      title="BeEF Browser Exploitation Framework"
      desc="Step-by-step reference: demo browser risks with BeEF hook.js in authorized labs. Defense focus."
      icon="🥩"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(179,102,255,0.08))"
      category="security"
      slug="hackolution/beef"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the BeEF Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for malicious-link anatomy, browser permissions, and habits that stop hook attacks.
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
        BeEF hooks real browsers and demonstrates session theft, keylogging, and social engineering. Hooking any browser without the owner explicit written consent is strictly prohibited and illegal. Use BeEF <b>only for defensive demos on your own browsers or simulations covered by a signed authorization</b>, in an isolated lab network. Never deploy hook.js anywhere public.
      </WarningBox>

      <Section id="overview" icon="🥩" title="What is BeEF?" subtitle="Hooking browsers to prove client-side risk">
        <p>
          <b>BeEF (Browser Exploitation Framework)</b> is a free, open-source <b>browser security testing tool</b> preinstalled on <b>Kali Linux</b>. A target browser loads one JavaScript file — <b>hook.js</b> — and appears in the BeEF panel as a hooked zombie with browser details, plugins, and hundreds of test <b>command modules</b>.
        </p>
        <p>
          Security teams use it to make phishing impact tangible: hook your own lab browser, demo what an attacker sees (tabs, keystrokes in demos, webcam-permission prompts), then teach the defenses. Every module runs against consenting lab browsers — that boundary is the entire difference between training and crime.
        </p>
        <FeatureGrid items={[
          { i: '🪝', t: 'One-File Hook', d: 'A single hook.js script enrolls a consenting lab browser.' },
          { i: '🧭', t: 'Browser Fingerprint', d: 'Version, plugins, screen, and network details mapped.' },
          { i: '🧩', t: 'Command Modules', d: 'Hundreds of demo modules from info to social engineering.' },
          { i: '🎣', t: 'Social Engineering', d: 'Fake update and login lures for awareness training.' },
          { i: '🌐', t: 'Lab Network View', d: 'Demonstrates intranet reach from a hooked browser.' },
          { i: '📊', t: 'Hook Panel UI', d: 'Central dashboard for hooked browsers and logs.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install BeEF on Kali">
        <p className="text-xs text-slate-400">BeEF ships preinstalled on Kali. On other systems install the beef-xss package or gem:</p>
        <CodeBlock title="terminal" lines={`sudo apt install beef-xss -y
# launch it:
# sudo beef-xss`} />
        <InfoBox title="Default credentials">
          The panel default login is beef with password beef at http://127.0.0.1:3000/ui/panel on the lab machine. Change the password immediately in config.yaml for every deployment, even in labs.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Launch & Hook" subtitle="Hook your own lab browser">
        <p className="text-xs text-slate-400">Start BeEF on Kali and hook a browser you own for the demo:</p>
        <CodeBlock title="terminal" lines={`sudo beef-xss
# hook URL shown in console, e.g. http://LAB-IP:3000/hook.js
# in YOUR lab browser, load a test page including that script`} />
        <InfoBox title="Confirming the hook">
          Your browser appears under Hooked Browsers with a green dot. The details tab maps everything the framework can see — use this inventory to motivate browser hardening in the debrief.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Demo Modules" subtitle="Run consent-based awareness modules">
        <p className="text-xs text-slate-400">Select your hooked lab browser and run informational demo modules:</p>
        <CodeBlock title="terminal" lines={`# Commands tab > Browser > Get Visited URLs (demo)
# Commands tab > Social Engineering > Fake Flash Update`} />
        <InfoBox title="Demo boundaries">
          Stick to informational and lure-visibility modules on consenting browsers. Keylogging and credential modules run only where the signed simulation scope explicitly allows — default to the gentlest proof that teaches the lesson.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Teach the Defense" subtitle="Turn the demo into lasting habits">
        <p className="text-xs text-slate-400">Close the session by demonstrating the defenses in the same lab browser:</p>
        <CodeBlock title="terminal" lines={`# show: extension audit, click-to-play plugins,
# site permission resets, and security-key login`} />
        <InfoBox title="Debrief checklist">
          Cover link inspection, minimal extensions, denying unexpected permission prompts, and phishing-resistant MFA. End by unhooking (close the lab tab) and wiping lab logs with participant data.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="BeEF hook panel with a lab browser">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/beef/beef_logo.jpg" alt="BeEF browser exploitation framework logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">BeEF panel — hooked lab browser and demo modules</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What BeEF Demos Prove" subtitle="Lessons that stick after a hook demo">
        <FeatureGrid items={[
          { i: '🔗', t: 'One Click Is Enough', d: 'A single script include enrolls the whole browser session.' },
          { i: '👁️', t: 'Total Visibility', d: 'Tabs, history, and fingerprints exposed to the panel.' },
          { i: '🔔', t: 'Permission Abuse', d: 'Camera, mic, and notification prompts users blindly accept.' },
          { i: '🎣', t: 'Lure Realism', d: 'Fake updates and logins indistinguishable at a glance.' },
          { i: '🏠', t: 'Intranet Reach', d: 'Hooked browsers bridge into internal lab pages.' },
          { i: '🛡️', t: 'Defense Urgency', d: 'Every demo maps directly to a fixable habit.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Hooked browser never appears"
            fix="Confirm the lab browser can reach the hook URL over the lab network and that no ad-blocker strips the script. Check the BeEF console for the exact hook address and port."
          />
          <IssueRow
            issue="Panel login fails"
            fix="Default is beef with password beef — reset it in config.yaml if changed. Confirm you browse the panel URL on the BeEF host itself."
          />
          <IssueRow
            issue="Modules show as unavailable"
            fix="Red modules need conditions the lab browser lacks (a plugin or permission). Green modules are runnable — demo those and explain why the rest matter."
          />
          <IssueRow
            issue="Port 3000 conflicts"
            fix="Stop the occupying service or change ui_port and http_host in config.yaml. Keep BeEF bound to the isolated lab interface only."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key BeEF Panels & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Hooked Browsers</div>
            <div className="text-xs text-slate-400">Live inventory of enrolled lab browsers and details.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Commands Tab</div>
            <div className="text-xs text-slate-400">Categorized demo modules per hooked browser.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">hook.js URL</div>
            <div className="text-xs text-slate-400">The one script that enrolls a consenting browser.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">ui/panel Login</div>
            <div className="text-xs text-slate-400">Admin dashboard — change default beef credentials.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Logs & History</div>
            <div className="text-xs text-slate-400">Per-browser module results for the debrief.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">config.yaml</div>
            <div className="text-xs text-slate-400">Ports, credentials, and bind addresses.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official BeEF GitHub Repository', 'https://github.com/beefproject/beef'],
            ['📖', 'BeEF Usage Documentation', 'https://github.com/beefproject/beef/wiki'],
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
