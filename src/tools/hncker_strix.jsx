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
  { q: 'What is STRIX?', a: 'STRIX is an open-source AI penetration testing framework. It uses autonomous AI agents that act like real hackers — they run your code dynamically, find vulnerabilities, and validate each finding with a working proof-of-concept. Zero false positives.' },
  { q: 'Is STRIX legal?', a: 'STRIX is open-source and free. It is designed for authorized security testing only. Scanning or exploiting systems you do not own or have written permission to test is illegal. Always get authorization before running any pentest tool.' },
  { q: 'How does it differ from static scanners?', a: 'Unlike static analysis tools that just look at code patterns, STRIX actually runs your application, explores the attack surface, tries exploits, and validates each finding with a real proof-of-concept. This means near-zero false positives.' },
  { q: 'What languages/frameworks does it support?', a: 'STRIX works with web applications, APIs, and cloud infrastructure. It supports testing against HTTP/HTTPS endpoints regardless of the backend framework.' },
  { q: 'Does it integrate with CI/CD?', a: 'Yes. STRIX integrates with GitHub Actions and other CI/CD pipelines. You can scan on every pull request and automatically block insecure code before it reaches production.' },
  { q: 'What are the system requirements?', a: 'A running Docker, an LLM API key from a supported provider (OpenAI, Anthropic, Google, etc.), and a terminal. Install with the official one-liner: curl -sSL https://strix.ai/install | bash. Runs on Linux, macOS, and Windows.' },
  { q: 'How accurate are the findings?', a: 'STRIX validates every finding with a working exploit proof-of-concept. This makes false positives virtually nonexistent — you only see bugs that are actually exploitable.' },
  { q: 'Can it generate fix patches?', a: 'Yes. STRIX can automatically generate fix patches for the vulnerabilities it finds, saving you time on remediation.' },
]

const howItWorks = [
  'Install STRIX with the official one-liner: curl -sSL https://strix.ai/install | bash.',
  'Configure an LLM API key (STRIX_LLM + LLM_API_KEY, or strix auth login chatgpt).',
  'Point it at your target application or API with strix --target.',
  'STRIX launches autonomous agents for recon, exploitation, and validation.',
  'Each finding is validated with a real proof-of-concept exploit.',
  'Review results and apply auto-generated fix patches.',
  'Integrate with CI/CD to scan every pull request automatically.',
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'STRIX — AI Penetration Testing Tool (Educational)',
      description: 'Step-by-step guide for installing and using STRIX, an open-source AI penetration testing framework. Educational and authorized testing only.',
      about: 'STRIX AI penetration testing tool',
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

export default function hncker_strix() {
  return (
    <ToolLayout
      title="STRIX — AI Penetration Testing Tool"
      desc="Step-by-step guide: install & use STRIX, the open-source AI pentest framework with autonomous agents and zero false positives. Educational only."
      icon="🤖"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(0,200,180,0.08))"
      category="security"
      slug="hncker/strix"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/strix/strix_logo.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=51LOrmRV8Uk" target="_blank" rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-white/10 no-underline"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img src="https://i.ytimg.com/vi/51LOrmRV8Uk/hqdefault.jpg"
                alt="STRIX - AI Penetration Testing Framework" loading="lazy"
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-semibold text-white">STRIX — autonomous AI agents that hack like real pentesters</p>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        STRIX is for <b>authorized security testing only</b>. Scanning or exploiting systems you do not own or
        have written permission to test is <b>illegal</b>. Only use it on your own applications or during
        authorized penetration testing engagements. This page is for <b>educational purposes only</b>.
      </WarningBox>

      <Section id="overview" icon="🤖" title="What is STRIX?" subtitle="Autonomous AI agents that hack like real pentesters">
        <p>
          <b>STRIX</b> is an open-source <b>AI penetration testing framework</b> with 39K+ GitHub stars.
          Unlike traditional scanners that just look at code patterns, STRIX uses <b>autonomous AI agents</b> that
          actually run your application, explore the attack surface, try exploits, and validate each finding
          with a working <b>proof-of-concept</b>.
        </p>
        <p>
          The result? <b>Zero false positives</b>. Every vulnerability STRIX reports is one it actually confirmed
          with a real exploit. It's like having a team of expert hackers working for you 24/7.
        </p>
        <FeatureGrid items={[
          { i: '🤖', t: 'Autonomous AI Agents', d: 'Multi-agent system: recon, exploit, post-exploit, reporting.' },
          { i: '🎯', t: 'Zero False Positives', d: 'Every finding validated with a working proof-of-concept.' },
          { i: '🔧', t: 'Auto Fix Patches', d: 'Generates fix patches for vulnerabilities automatically.' },
          { i: '🔄', t: 'CI/CD Integration', d: 'GitHub Actions — scan every pull request automatically.' },
          { i: '🌍', t: 'Open Source', d: 'Free, community-driven, 39K+ stars on GitHub.' },
          { i: '⚡', t: 'Dynamic Testing', d: 'Actually runs your code — not just static analysis.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before installing">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Docker (running)'],
            ['☑️', 'An LLM API key from a supported provider (OpenAI, Anthropic, Google, etc.)'],
            ['☑️', 'A target application you own or are authorized to test'],
            ['☑️', 'Network access to the target'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="📦" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`curl -sSL https://strix.ai/install | bash`} />
        <InfoBox title="Configure your AI provider">
          Strix needs an LLM API key to run. Set <span className="font-mono">STRIX_LLM</span> and{' '}
          <span className="font-mono">LLM_API_KEY</span> (or use <span className="font-mono">strix auth login chatgpt</span> to run on a ChatGPT subscription):
          <br /><span className="font-mono">export STRIX_LLM="openai/gpt-5.4"</span>
          <br /><span className="font-mono">export LLM_API_KEY="your-api-key"</span>
        </InfoBox>
      </Section>

      <Section id="usage" icon="🎯" title="Usage Guide" subtitle="Run an AI pentest in one line">
        <p className="text-xs text-slate-400">Black-box scan — point STRIX at your target (app, repo, or URL):</p>
        <CodeBlock title="terminal" lines={`strix --target https://yourapp.com`} />
        <p className="text-xs text-slate-400 mt-3">Scan a local codebase or GitHub repo:</p>
        <CodeBlock title="terminal" lines={`strix --target ./app-directory`} />
        <p className="text-xs text-slate-400 mt-3">Headless / automated run — prints findings + report, exits non-zero on vulnerabilities:</p>
        <CodeBlock title="terminal" lines={`strix -n --target https://yourapp.com`} />
        <InfoBox title="CI/CD Integration">
          Add STRIX to your GitHub Actions workflow to scan every pull request:
          <span className="font-mono">strix -n -t ./ --scan-mode quick</span>
        </InfoBox>
      </Section>

      <Section id="features" icon="⚡" title="Key Features" subtitle="Why STRIX is different">
        <FeatureGrid items={[
          { i: '🧠', t: 'Multi-Agent System', d: 'Separate agents for recon, exploitation, post-exploitation, and reporting.' },
          { i: '✅', t: 'PoC Validation', d: 'Every bug gets a working exploit proof — no guessing.' },
          { i: '🔧', t: 'Auto Remediation', d: 'Generates patches you can apply immediately.' },
          { i: '📊', t: 'CI/CD Reports', d: 'Block insecure code before it reaches production.' },
          { i: '🌐', t: 'Web & API Testing', d: 'Tests HTTP endpoints, APIs, and cloud infrastructure.' },
          { i: '🔓', t: '100% Open Source', d: 'Free forever. Community-driven development.' },
        ]} />
      </Section>

      <Section id="workflow" icon="🔄" title="How It Works" subtitle="The STRIX pentest workflow">
        <ol className="list-decimal pl-5 space-y-2 text-slate-300">
          {howItWorks.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Section>

            <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--target / -t</div>
            <div className="text-xs text-slate-400">Target to scan, e.g. a URL or local path.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-n, --non-interactive</div>
            <div className="text-xs text-slate-400">Run without interactive prompts for automation and CI.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--scan-mode</div>
            <div className="text-xs text-slate-400">Scan depth: quick or full.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--install</div>
            <div className="text-xs text-slate-400">Install or update STRIX and its agents.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--version</div>
            <div className="text-xs text-slate-400">Print the installed STRIX version.</div>
          </div>
        </div>
      </Section>

<Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit, with working solutions">
        <div className="space-y-3">
          <IssueRow
            issue="'strix: command not found' after install"
            fix="The installer adds strix to your PATH, but your current shell may not have reloaded. Open a new terminal (or run 'source ~/.bashrc'), then confirm Docker is running before you start."
          />
          <IssueRow
            issue="Scan fails or hangs on first run"
            fix="Strix pulls its sandbox Docker image on first run, which can take a moment. Make sure Docker is running. If it still fails, set your LLM API key again (STRIX_LLM and LLM_API_KEY) — results are cached in ~/.strix/cli-config.json."
          />
          <IssueRow
            issue="CI/CD integration shows no findings"
            fix="Ensure the target URL is accessible from your CI environment. Some staging environments require VPN or specific network access."
          />
          <IssueRow
            issue="PoC validation fails for a finding"
            fix="Some findings require specific conditions to exploit. Try re-running with --verbose to see the validation attempts."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links and community">
        <div className="space-y-2">
          {[
            ['📦', 'GitHub Repository', 'https://github.com/usestrix/strix'],
            ['📖', 'Documentation', 'https://docs.strix.ai/'],
            ['🌐', 'STRIX Website', 'https://www.strix.ai/'],
            ['🎬', 'HNCKER Tutorials', 'https://www.youtube.com/@hncker'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-white/8 hover:border-green-500/30 transition-colors"
              style={{ background: 'rgba(0,0,0,0.3)' }}>
              <span>{i}</span>
              <span className="text-sm text-white font-medium">{label}</span>
              <span className="ml-auto text-xs text-slate-500">↗</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="⚖️" title="Disclaimer" subtitle="Read before using">
        <p>
          This page is for <b>educational and authorized security testing only</b>. STRIX is a powerful tool —
          with great power comes great responsibility. Only test systems you own or have explicit written
          authorization to assess. Unauthorized scanning or exploitation of computer systems is illegal
          and can result in criminal charges.
        </p>
        <p>
          The authors of this page are not responsible for any misuse of this tool. Always follow your
          local laws and regulations regarding penetration testing and security research.
        </p>
      </Section>
    </ToolLayout>
  )
}
