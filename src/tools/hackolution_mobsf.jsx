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
  { q: "What is MobSF?", a: "MobSF is a free, open-source mobile security platform by Ajin Abraham. It statically and dynamically audits Android and iOS apps — secrets, permissions, crypto, components, and runtime behavior — into scored PDF reports." },
  { q: "Is using MobSF legal?", a: "MobSF itself is legitimate auditing software. Reverse-engineering apps without the owner written permission may break laws and store terms. Audit only your own apps, open-source apps, or signed-engagement targets." },
  { q: "How do I install MobSF?", a: "Run docker pull opensecurity/mobile-security-framework-mobsf, then docker run with port 8000 published. Open http://localhost:8000 on the lab machine." },
  { q: "How do I audit an APK?", a: "Upload it in the Static Analyzer for a scored report in minutes. Then run it in the Dynamic Analyzer emulator with Frida to capture runtime secrets and traffic." },
  { q: "What should developers fix first?", a: "Hardcoded secrets, debuggable flags, exported components, cleartext traffic, and weak crypto — the high-severity cards MobSF surfaces first." },
  { q: "Can MobSF run in CI?", a: "Yes. Its REST API with an API key uploads and scans every build, failing pipelines on new high-severity findings for trend tracking." },
  { q: "Does MobSF replace manual testing?", a: "No. It finds known-bad patterns fast; business-logic flaws, auth bypasses, and chained exploits still need hands-on testing of every flow." },
  { q: "Why does dynamic analysis fail to boot?", a: "The host needs virtualization enabled and enough RAM for the emulator. First boot is slow — wait, then retry before troubleshooting further." }
]

const howItWorks = [
  "Deploy MobSF with Docker on a lab machine and open port 8000.",
  "Upload your authorized APK for a static scored audit and triage high findings.",
  "Run the app in the dynamic analyzer with Frida and exercise every screen.",
  "Verify each finding manually and export the PDF evidence.",
  "Fix secrets, permissions, crypto, and transport issues, then rescan to confirm."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'MobSF Mobile Security Framework — Android & iOS App Audit Guide',
      description: 'Step-by-step reference: static & dynamic mobile app audits with MobSF. Authorized apps only.',
      about: 'MobSF mobile application security testing',
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

export default function hackolution_mobsf() {
  return (
    <ToolLayout
      title="MobSF Mobile Security Framework"
      desc="Step-by-step reference: static & dynamic mobile app audits with MobSF. Authorized apps only."
      icon="📱"
      iconBg="linear-gradient(135deg, rgba(34,197,94,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/mobsf"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the MobSF Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for APK secrets, insecure permissions, and the mobile hygiene that protects users.
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
        MobSF reverse-engineers and dynamically instruments mobile applications. Testing any app without explicit written permission from its owner is strictly prohibited and may violate laws and store terms. Audit <b>only your own apps, open-source apps, or targets covered by a signed authorization</b>. Handle extracted API keys and user data as sensitive throughout.
      </WarningBox>

      <Section id="overview" icon="📱" title="What is MobSF?" subtitle="Automated mobile app security testing, by Ajin Abraham">
        <p>
          <b>MobSF (Mobile Security Framework)</b> is a free, open-source <b>mobile app auditing platform</b> for <b>Android and iOS</b>. Upload an APK, IPA, or source zip and it produces a scored security report: hardcoded secrets, insecure permissions, weak crypto, exported components, and network risks.
        </p>
        <p>
          Beyond static analysis, its <b>dynamic analyzer</b> runs the app in an emulator with Frida instrumentation — intercepting traffic, logging API calls, and exposing runtime secrets. For developers and authorized testers it compresses days of mobile review into one upload.
        </p>
        <FeatureGrid items={[
          { i: '🔍', t: 'Static Analysis', d: 'Secrets, permissions, crypto, and manifest risks in minutes.' },
          { i: '▶️', t: 'Dynamic Analyzer', d: 'Emulator runs with Frida hooks, traffic capture, and API logs.' },
          { i: '🍏🤖', t: 'Android & iOS', d: 'APK, AAB, IPA, and zipped source all accepted.' },
          { i: '📊', t: 'Scored Reports', d: 'Severity-graded findings with PDF export for stakeholders.' },
          { i: '🔌', t: 'REST API', d: 'Automate uploads and scans inside CI pipelines.' },
          { i: '🐳', t: 'Docker Deploy', d: 'One-command container with all analyzers prebuilt.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install MobSF with Docker">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian with Docker installed, pull and run the official image:</p>
        <CodeBlock title="terminal" lines={`docker pull opensecurity/mobile-security-framework-mobsf
# run it (dashboard on port 8000):
# docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf`} />
        <InfoBox title="Opening the dashboard">
          Browse to http://localhost:8000 on the lab machine after the container starts. First launch downloads analyzer components, so allow a few minutes. Keep MobSF updated with docker pull before each assessment.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Static APK Audit" subtitle="Score an authorized app in minutes">
        <p className="text-xs text-slate-400">Upload your own or authorized APK through the dashboard Static Analyzer:</p>
        <CodeBlock title="terminal" lines={`# in the MobSF dashboard: Upload and Analyze app.apk
# or via the REST API:
# curl -F file=@app.apk http://localhost:8000/api/v1/upload -H Authorization:APIKEY`} />
        <InfoBox title="Reading the scorecard">
          Start with high-severity cards: hardcoded API keys, debuggable flags, exported activities, and cleartext traffic. Each finding links to the exact file and line for verification and fixes.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Dynamic Analysis" subtitle="Watch the app behave at runtime">
        <p className="text-xs text-slate-400">Launch the authorized app in the MobSF dynamic analyzer emulator:</p>
        <CodeBlock title="terminal" lines={`# dashboard: Dynamic Analyzer > app.apk > Start Instrumentation
# enable Frida + TLS inspection, then exercise the app`} />
        <InfoBox title="Runtime evidence">
          Dynamic logs reveal API endpoints, tokens in transit, insecure TLS, and logged secrets. Exercise every screen including login and payments — untested flows hide the worst flaws.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — API & CI Scans" subtitle="Automate audits in your pipeline">
        <p className="text-xs text-slate-400">Scan every build automatically with the REST API and API key:</p>
        <CodeBlock title="terminal" lines={`curl -F file=@app.apk http://localhost:8000/api/v1/scan -H Authorization:APIKEY`} />
        <InfoBox title="Shifting mobile security left">
          Store the API key as a CI secret and fail builds on new high-severity findings. API scans return the same scored report as the dashboard for trend tracking.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="MobSF scored security report">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/mobsf/mobsf_logo.jpg" alt="MobSF mobile security framework logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">MobSF dashboard — scored findings for an app audit</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What MobSF Audits Find" subtitle="Common discoveries from mobile app scans">
        <FeatureGrid items={[
          { i: '🔑', t: 'Hardcoded Secrets', d: 'API keys, tokens, and endpoints baked into the binary.' },
          { i: '📋', t: 'Risky Permissions', d: 'SMS, location, and storage access the app never needs.' },
          { i: '🔓', t: 'Weak Crypto', d: 'Hardcoded IVs, ECB mode, and broken certificate checks.' },
          { i: '🚪', t: 'Exported Components', d: 'Activities and receivers other apps can invoke.' },
          { i: '🌐', t: 'Cleartext Traffic', d: 'HTTP endpoints and disabled TLS protections.' },
          { i: '🐛', t: 'Debuggable Builds', d: 'Production apps leaking logs and debug interfaces.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Upload rejected or stalls"
            fix="Confirm the file is a valid APK, IPA, or source zip under the size limit. Re-pull the Docker image if analyzers report version mismatches."
          />
          <IssueRow
            issue="Dynamic analyzer will not start"
            fix="Enable virtualization (KVM) on the host and give Docker enough RAM. Emulator boot takes minutes on first run — wait before retrying."
          />
          <IssueRow
            issue="Frida hooks fail on the app"
            fix="Some apps detect instrumentation. Test with a debug build of your own app first, and use the dashboard TLS settings for certificate-pinned targets you own."
          />
          <IssueRow
            issue="False positives in the report"
            fix="Verify each high finding by reproducing it — especially crypto and secret flags in obfuscated code. Tune severity in the report before sharing with developers."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key MobSF Features & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Static Analyzer</div>
            <div className="text-xs text-slate-400">One-upload scored audit of code, manifest, and secrets.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Dynamic Analyzer</div>
            <div className="text-xs text-slate-400">Emulator runs with Frida, traffic capture, and API logs.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">PDF Reports</div>
            <div className="text-xs text-slate-400">Stakeholder-ready exports of every engagement.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">REST API + Key</div>
            <div className="text-xs text-slate-400">CI-friendly uploads, scans, and JSON results.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Malware Lens</div>
            <div className="text-xs text-slate-400">Behavioral view of suspicious samples you own.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Docker Deploy</div>
            <div className="text-xs text-slate-400">Reproducible one-command lab installation.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official MobSF GitHub Repository', 'https://github.com/MobSF/Mobile-Security-Framework-MobSF'],
            ['📖', 'MobSF Usage Documentation', 'https://mobsf.github.io/docs/'],
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
