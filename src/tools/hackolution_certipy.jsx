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
  { q: "What is Certipy?", a: "Certipy is a free, open-source AD Certificate Services auditor by Oliver Lyak. It enumerates templates, flags ESC1–ESC8 misconfigurations, and automates the request, forge, and authenticate chain for proof." },
  { q: "Is using Certipy legal?", a: "Certipy itself is legitimate auditing software. Abusing certificate services without explicit written permission is illegal. Practice only in isolated AD CS labs or signed engagements, and guard forged material as live credentials." },
  { q: "How do I install Certipy?", a: "Run pipx install certipy-ad on Python 3.8 or newer. Verify with certipy --help and keep it on the dedicated lab VM." },
  { q: "What is ESC1?", a: "A template that lets requesters choose any identity plus loose enrollment rights. Request a certificate as administrator, authenticate with it, and the domain falls. Fix with restricted enrollment and approval." },
  { q: "What is ESC8?", a: "HTTP-based certificate enrollment that accepts relayed NTLM authentication. Coerce a lab machine to authenticate, relay it to the endpoint, and receive a certificate. Fix with HTTPS-only enrollment and EPA." },
  { q: "How do I find vulnerable templates?", a: "Run certipy find with -vulnerable against the lab DC. It ranks templates by ESC number with per-template abuse notes." },
  { q: "What do I do with a forged certificate?", a: "Authenticate with certipy auth to prove impact in the lab, document the chain, then wipe every PFX and output file when done." },
  { q: "Why is there no CA in my lab?", a: "Plain Active Directory has no certificate services. Use GOAD, a dedicated AD CS lab, or install the CA role on an isolated lab server." }
]

const howItWorks = [
  "Install Certipy with pipx on a dedicated lab VM and verify subcommands.",
  "Enumerate the isolated lab CA with certipy find -vulnerable.",
  "Exploit one flagged template end to end: request, forge, authenticate.",
  "Document each ESC chain with the exact template setting at fault.",
  "Remediate with enrollment restrictions, approvals, HTTPS-only endpoints, and EPA."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Certipy AD CS Auditor — Certificate Template Attack Lab Guide',
      description: 'Step-by-step reference: audit lab certificate services with Certipy ESC attacks. Lab only.',
      about: 'Certipy Active Directory Certificate Services auditing',
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

export default function hackolution_certipy() {
  return (
    <ToolLayout
      title="Certipy AD CS Auditor"
      desc="Step-by-step reference: audit lab certificate services with Certipy ESC attacks. Lab only."
      icon="📜"
      iconBg="linear-gradient(135deg, rgba(255,204,0,0.18), rgba(34,197,94,0.08))"
      category="security"
      slug="hackolution/certipy"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Certipy Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for certificate template flaws, ESC attack paths, and enrollment rules that stop them.
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
        Certipy abuses Active Directory Certificate Services to forge authentication and escalate to domain control. Running these techniques against any network without explicit written permission is strictly prohibited and illegal. Use Certipy <b>only in isolated AD labs with a certificate authority (GOAD, certified labs) or engagements covered by a signed authorization</b>. Handle all forged certificates as live credentials.
      </WarningBox>

      <Section id="overview" icon="📜" title="What is Certipy?" subtitle="Auditing AD Certificate Services, by Oliver Lyak">
        <p>
          <b>Certipy</b> is a free, open-source <b>Active Directory Certificate Services auditor</b> by Oliver Lyak. It finds misconfigured certificate templates and authorities — the <b>ESC1 through ESC8 family</b> — and demonstrates how each one yields forged certificates, authentication as anyone, and lab domain takeover.
        </p>
        <p>
          Certificate services are the quiet killer of lab domains: one template allowing attacker-chosen identities plus weak enrollment rights equals instant Domain Admin. Certipy enumerates every template, flags each ESC pattern, and automates the request, forge, and authenticate chain for proof.
        </p>
        <FeatureGrid items={[
          { i: '🔍', t: 'Template Enumeration', d: 'Lists every certificate template with enrollment rights.' },
          { i: '🚨', t: 'ESC1–ESC8 Detection', d: 'Flags each known misconfiguration pattern automatically.' },
          { i: '🎫', t: 'Certificate Forgery', d: 'Requests and forges certificates for chosen identities.' },
          { i: '🔑', t: 'Auth As Anyone', d: 'Turns forged certs into NTLM hashes and tickets.' },
          { i: '🖨️', t: 'Relay & Coerce Paths', d: 'ESC8 relay plus coercion technique pairings.' },
          { i: '📊', t: 'Vulnerable-First Output', d: 'Color-coded findings ranked by exploitability.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Certipy on Linux">
        <p className="text-xs text-slate-400">On Kali, Ubuntu, or Debian, install with pipx (recommended):</p>
        <CodeBlock title="terminal" lines={`pipx install certipy-ad`} />
        <InfoBox title="Verify the install">
          Run certipy --help after installing and confirm the find, req, auth, and forge subcommands list correctly. Keep Certipy on the dedicated lab VM with the rest of the AD toolkit.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Enumerate Templates" subtitle="Find vulnerable lab templates">
        <p className="text-xs text-slate-400">Audit every certificate template in your isolated lab domain:</p>
        <CodeBlock title="terminal" lines={`certipy find -u user@LAB.local -p Password1 -dc-ip 192.168.56.10 -vulnerable`} />
        <InfoBox title="Reading the findings">
          The -vulnerable flag filters to exploitable templates with their ESC numbers. Open the matching Certipy text output for the exact abuse chain per template before attempting anything.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Exploit ESC1" subtitle="Forge a certificate as administrator">
        <p className="text-xs text-slate-400">Against a lab template flagged ESC1, request a certificate as Domain Admin:</p>
        <CodeBlock title="terminal" lines={`certipy req -u user@LAB.local -p Password1 -dc-ip 192.168.56.10 -ca LAB-CA -template VulnTemplate -upn administrator@LAB.local`} />
        <InfoBox title="From certificate to access">
          ESC1 templates accept attacker-chosen identities. Authenticate with the forged certificate using certipy auth to recover the administrator hash — then document the template fix: restrict enrollment and require manager approval.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Authenticate & Relay" subtitle="Turn certificates into sessions">
        <p className="text-xs text-slate-400">Authenticate with a forged certificate or test ESC8 relay in the lab:</p>
        <CodeBlock title="terminal" lines={`certipy auth -pfx administrator.pfx -dc-ip 192.168.56.10
# ESC8: certipy relay -target http://LAB-CA/certsrv/`} />
        <InfoBox title="Handling forged material">
          Recovered hashes are live credentials: crack and use them only inside the lab, then wipe every PFX and output file. ESC8 relay needs HTTP enrollment endpoints — the fix is HTTPS-only enrollment with EPA.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="Certipy flagging vulnerable templates">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/certipy/certipy_logo.jpg" alt="Certipy AD CS auditor logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Certipy output — vulnerable certificate templates by ESC number</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What Certipy Audits Find" subtitle="Common discoveries from AD CS assessments">
        <FeatureGrid items={[
          { i: '🚨', t: 'ESC1 Templates', d: 'Attacker-chosen identities leading to forged admin certs.' },
          { i: '🔁', t: 'ESC8 Relay Paths', d: 'HTTP enrollment endpoints accepting relayed auth.' },
          { i: '👥', t: 'Overbroad Enrollment', d: 'Templates enrollable by entire lab user populations.' },
          { i: '🔑', t: 'Weak EKU Settings', d: 'Client-auth EKUs missing or misapplied on templates.' },
          { i: '🖨️', t: 'CA Misconfigurations', d: 'Flag and permission issues on the authority itself.' },
          { i: '👑', t: 'Cert-to-DA Chains', d: 'Complete paths from template flaw to domain control.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="No CA found in the lab"
            fix="Certipy needs a domain with Active Directory Certificate Services installed. GOAD and dedicated AD CS labs include one — plain domains have nothing to audit."
          />
          <IssueRow
            issue="Template flagged but exploit fails"
            fix="Re-read the Certipy notes for that ESC number: each has prerequisites (enrollment rights, EKU shape, approval settings). Verify each condition before retrying."
          />
          <IssueRow
            issue="Authentication with PFX fails"
            fix="Check the identity format and DC connectivity, and confirm the certificate has not expired. Clock skew between lab machines also breaks Kerberos auth."
          />
          <IssueRow
            issue="Relay gets no callback"
            fix="Confirm the enrollment endpoint is HTTP (not HTTPS) and reachable from the relay position. ESC8 dies the moment enrollment goes HTTPS-only with EPA."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Certipy Commands & Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">find -vulnerable</div>
            <div className="text-xs text-slate-400">Enumerate templates, keeping only exploitable ones.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">req -template</div>
            <div className="text-xs text-slate-400">Request a certificate from a chosen template.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-upn &lt;identity&gt;</div>
            <div className="text-xs text-slate-400">ESC1: pick the identity the certificate asserts.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">auth -pfx</div>
            <div className="text-xs text-slate-400">Authenticate with a forged certificate file.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">forge</div>
            <div className="text-xs text-slate-400">Craft certificates directly for lab scenarios.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">relay -target</div>
            <div className="text-xs text-slate-400">Relay authentication to HTTP enrollment endpoints.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Certipy GitHub Repository', 'https://github.com/ly4k/Certipy'],
            ['📖', 'Certipy Usage Documentation', 'https://github.com/ly4k/Certipy#usage'],
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
