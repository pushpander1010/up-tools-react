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
  { q: "What is WAFW00F?", a: "WAFW00F is a free, open-source WAF fingerprinter in Python by Sandro Gauci. It sends benign-but-telling probes and matches responses against 70+ firewall signatures from Cloudflare to ModSecurity." },
  { q: "Is using WAFW00F legal?", a: "WAFW00F itself is legitimate open-source software. Probing sites without explicit written permission is prohibited and may trip defenses. Run it only on lab apps or signed-engagement targets." },
  { q: "How do I install WAFW00F?", a: "It ships with Kali. Elsewhere run pipx install wafw00f or sudo apt install wafw00f -y, then verify with wafw00f --version." },
  { q: "How do I fingerprint a lab app?", a: "Run wafw00f against the authorized URL. A positive names the product and betraying probe; a negative means no known firewall answered." },
  { q: "What do I do after naming the WAF?", a: "Build a product-specific test plan: which encodings it normalizes, which payloads it blocks, and what pacing avoids lockout. Group follow-up tests by firewall, not by guess." },
  { q: "Why no detection on a protected app?", a: "Outdated signatures, custom rulesets, or single-probe verdicts on stacked defenses. Update, retry with --force, and confirm manually." },
  { q: "How is WAFW00F different from Nmap WAF scripts?", a: "Nmap scripts guess from headers and quirks. WAFW00F fires a purpose-built probe battery against a large signature set — faster and far more precise." },
  { q: "Will fingerprinting get me blocked?", a: "Possibly — full batteries log loudly. Fingerprint once inside the agreed window, then test evasions deliberately instead of re-scanning." }
]

const howItWorks = [
  "Install or update WAFW00F and verify signatures.",
  "Fingerprint your authorized lab app with one clean run.",
  "Confirm the verdict manually from headers and block pages.",
  "Build a product-specific evasion and pacing plan.",
  "Test deliberately, then report defenses with bypass evidence."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'WAFW00F Firewall Detector — WAF Fingerprinting Guide',
      description: 'Step-by-step reference: fingerprint web firewalls with WAFW00F before lab tests. Lab use only.',
      about: 'WAFW00F web application firewall detection',
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

export default function hackolution_wafw00f() {
  return (
    <ToolLayout
      title="WAFW00F Firewall Detector"
      desc="Step-by-step reference: fingerprint web firewalls with WAFW00F before lab tests. Lab use only."
      icon="🧱"
      iconBg="linear-gradient(135deg, rgba(251,146,60,0.18), rgba(239,68,68,0.08))"
      category="security"
      slug="hackolution/wafw00f"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the WAFW00F Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for firewall fingerprinting, blocked-payload tells, and test plans that respect defenses.
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
        WAFW00F sends probing requests that security teams may log as hostile. Fingerprinting any site without explicit written permission is strictly prohibited and may violate laws and testing agreements. Run WAFW00F <b>only against lab applications or targets covered by a signed authorization</b>, and coordinate aggressive follow-up testing windows in advance.
      </WarningBox>

      <Section id="overview" icon="🧱" title="What is WAFW00F?" subtitle="Name that firewall in one command">
        <p>
          <b>WAFW00F</b> is a free, open-source <b>web application firewall fingerprinter</b> in Python by Sandro Gauci. Give it a lab URL and it fires a battery of benign-but-telling probes, matching responses against signatures for <b>Cloudflare, AWS WAF, ModSecurity, Akamai, Imperva, and dozens more</b>.
        </p>
        <p>
          Authorized testers fingerprint first because the WAF dictates the whole plan: which payloads get normalized, which encodings slip through, and which tests need spacing to avoid blocks. One WAFW00F run focuses hours of follow-up testing.
        </p>
        <FeatureGrid items={[
          { i: '🔍', t: '70+ WAF Signatures', d: 'Cloudflare to ModSecurity identified by response tells.' },
          { i: '⚡', t: 'One-Command Answer', d: 'Single URL in, firewall name out in seconds.' },
          { i: '🧪', t: 'Probe Battery', d: 'Benign payloads that trigger distinctive blocks.' },
          { i: '🌐', t: 'CDN Awareness', d: 'Separates CDN presence from actual WAF behavior.' },
          { i: '📜', t: 'Scriptable Output', d: 'Clean results for recon pipelines and reports.' },
          { i: '🧰', t: 'Kali Preinstalled', d: 'Ready on every default Kali assessment image.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install WAFW00F on Linux">
        <p className="text-xs text-slate-400">WAFW00F ships preinstalled on Kali. Elsewhere install with pipx or apt:</p>
        <CodeBlock title="terminal" lines={`pipx install wafw00f
# or:
# sudo apt install wafw00f -y`} />
        <InfoBox title="Verify signatures">
          Run wafw00f --version after installing. Fingerprint databases improve with releases, so update before each engagement for the newest WAF signatures.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic Fingerprint" subtitle="Name the firewall on a lab app">
        <p className="text-xs text-slate-400">Fingerprint the protection on your authorized lab application:</p>
        <CodeBlock title="terminal" lines={`wafw00f http://localhost:3000`} />
        <InfoBox title="Reading the verdict">
          A positive names the WAF and the probe that betrayed it; a negative means no known firewall answered. Record the exact product — every evasion technique that follows is product-specific.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — HTTPS & Aggression" subtitle="Tune probes for hardened targets">
        <p className="text-xs text-slate-400">Fingerprint over TLS with a knockout punch of probes when needed:</p>
        <CodeBlock title="terminal" lines={`wafw00f https://target.lab --force`} />
        <InfoBox title="Force mode notes">
          The --force flag sends the full probe battery even after early matches, catching stacked defenses like CDN plus origin WAF. Use it on authorized targets only — full batteries log loudly.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Lists & Evidence" subtitle="Sweep scopes and save results">
        <p className="text-xs text-slate-400">Fingerprint a scope file and save evidence for the test plan:</p>
        <CodeBlock title="terminal" lines={`wafw00f -i scope.txt -o waf-results.txt`} />
        <InfoBox title="From fingerprint to plan">
          The -i flag reads URLs from a scope file and -o saves verdicts. Group follow-up tests by WAF product: one evasion playbook per firewall beats random payload spraying.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="WAFW00F naming a lab firewall">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/wafw00f/wafw00f_logo.jpg" alt="WAFW00F firewall detector logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">WAFW00F verdict — firewall product fingerprinted</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What WAFW00F Fingerprints Find" subtitle="Common discoveries from WAF detection">
        <FeatureGrid items={[
          { i: '🧱', t: 'Named Firewalls', d: 'Exact WAF products guarding each lab app.' },
          { i: '🥞', t: 'Stacked Defenses', d: 'CDN plus origin WAF combinations revealed.' },
          { i: '🚫', t: 'Block Tells', d: 'Response codes and pages betraying rule hits.' },
          { i: '🕳️', t: 'No-WAF Hosts', d: 'Unprotected apps where testing runs clean.' },
          { i: '📋', t: 'Evasion Playbooks', d: 'Product-specific techniques for the test plan.' },
          { i: '⏱️', t: 'Rate-Limit Hints', d: 'Throttling behavior shaping safe test pacing.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="No WAF detected on a protected app"
            fix="Update signatures and retry with --force for the full battery. Custom or brand-new rulesets lack signatures — confirm with manual blocked-payload tests."
          />
          <IssueRow
            issue="False positive product name"
            fix="Verify with a second distinctive probe and check response headers manually. Stacked CDN plus WAF setups confuse single-probe verdicts."
          />
          <IssueRow
            issue="Connection errors on lab targets"
            fix="Confirm the URL scheme and lab routing, and check the app is running. Proxy needs go through --proxy for Burp-chained fingerprinting."
          />
          <IssueRow
            issue="WAF blocks the fingerprint itself"
            fix="Slow down, confirm the test window with the lab owner, and fingerprint once — then plan evasion offline instead of hammering the ruleset."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key WAFW00F Flags & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">&lt;url&gt;</div>
            <div className="text-xs text-slate-400">Positional argument: the application to fingerprint.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--force</div>
            <div className="text-xs text-slate-400">Full probe battery even after early matches.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-i &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Read target URLs from a scope file.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;file&gt;</div>
            <div className="text-xs text-slate-400">Save verdicts for the test plan and report.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--proxy &lt;url&gt;</div>
            <div className="text-xs text-slate-400">Route probes through Burp or another proxy.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-v</div>
            <div className="text-xs text-slate-400">Verbose probe output for manual verification.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official WAFW00F GitHub Repository', 'https://github.com/EnableSecurity/wafw00f'],
            ['📖', 'WAFW00F Usage Documentation', 'https://github.com/EnableSecurity/wafw00f#usage'],
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
