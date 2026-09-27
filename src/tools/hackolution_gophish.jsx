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
  { q: 'What is GoPhish?', a: 'GoPhish is an open-source phishing simulation framework designed for security professionals and organizations to conduct controlled security awareness training and measure resilience against social engineering.' },
  { q: 'Is using GoPhish legal?', a: 'GoPhish is legal when used for authorized internal training on corporate domains with explicit written consent from leadership. Conducting unauthorized phishing campaigns against external targets is illegal.' },
  { q: 'How do attackers clone legitimate login pages?', a: 'Attackers use web scraping tools or automated proxy toolkits to mirror the HTML, CSS, and assets of real login portals, modifying the form action URL to harvest submitted credentials on their own servers.' },
  { q: 'How can users spot fake or deceptive URLs?', a: 'Check the true root domain before the first single slash, look out for homoglyphs or Punycode characters (e.g. Cyrillic letters), watch for deceptive subdomains (like login.microsoft.fake-domain.com), and never rely solely on the browser padlock.' },
  { q: 'Does Multi-Factor Authentication (MFA/2FA) stop phishing?', a: 'Hardware security keys (FIDO2 / WebAuthn) completely prevent credential phishing because cryptographic authentication is cryptographically bound to the legitimate browser origin URL. Basic SMS or email OTPs remain vulnerable to real-time relay proxies.' },
  { q: 'What email security protocols prevent domain spoofing?', a: 'Deploy strict SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail) cryptographic signatures, and DMARC (Domain-based Message Authentication) with a p=reject enforcement policy.' },
  { q: 'What should an employee do upon receiving a suspected phishing email?', a: 'Never click links or open attachments. Report the email immediately using the organization\'s designated phishing reporting button or forward it to the internal SOC / Security team for header analysis.' },
]

const howItWorks = [
  'Deploy GoPhish inside an authorized enterprise lab for security awareness training.',
  'Analyze common attacker deception techniques including page cloning and emotional triggers.',
  'Inspect domain syntax, Punycode tricks, and SSL certificate details to detect fake URLs.',
  'Enforce hardware FIDO2/WebAuthn 2FA to neutralize credential harvesting.',
  'Configure SPF, DKIM, and DMARC with strict reject policies to block spoofed sender domains.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'GoPhish Phishing Awareness — Defense, Detection & 2FA Guide',
      description: 'Defensive phishing simulation and awareness guide: understand credential harvesting tactics, detect fake URLs, configure 2FA, and harden email authentication. Educational purposes only.',
      about: 'GoPhish security awareness simulation, anti-phishing defense, and multi-factor authentication',
      educationalUse: 'Testing, education, and authorized awareness training only',
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

export default function hackolution_Gophish() {
  return (
    <ToolLayout
      title="GoPhish Phishing Awareness"
      desc="Defensive phishing simulation and awareness guide: understand credential harvesting tactics, detect fake URLs, configure 2FA, and harden email authentication. Educational purposes only."
      icon="🛡️"
      iconBg="linear-gradient(135deg, rgba(245,158,11,0.18), rgba(0,255,65,0.08))"
      category="security"
      slug="hackolution/gophish"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://i.ytimg.com/vi/E-6uJ0j3xMo/hqdefault.jpg" />
      </Helmet>

      <Section id="video" icon="🎬" title="HACKOLUTION reel" subtitle="Watch on Instagram, then practice below in your lab">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-white/10 p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(214,41,118,0.12), rgba(17,24,39,0.6))' }}>
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-lg font-bold text-white mb-2">Watch the Phishing Defense Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for rapid insights into identifying phishing lures, inspecting deceptive URLs, and deploying phishing-resistant MFA.
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
        This guide is strictly designed for <b>defensive security education, employee awareness training, and authorized simulation exercises</b>.
        Conducting phishing campaigns against individuals or systems without explicit written legal authorization is a severe cybercrime. Step-by-step exploitation guides are strictly omitted in favor of threat detection, URL analysis, and defensive configuration.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is GoPhish &amp; Phishing Awareness?" subtitle="Defensive simulation framework and threat modeling">
        <p>
          <b>GoPhish</b> is an open-source phishing simulation framework designed for security teams, system administrators, and cybersecurity educators.
          Rather than facilitating attacks, GoPhish provides organizations with a controlled platform to conduct simulated phishing drills, track metrics,
          and train personnel to recognize sophisticated social engineering attacks.
        </p>
        <p>
          Over 80% of data breaches involve social engineering and credential harvesting. Understanding how threat actors manipulate human psychology,
          imitate corporate brands, and bypass perimeter controls is the foundation of building a resilient security culture.
        </p>
        <FeatureGrid items={[
          { i: '🎯', t: 'Awareness Drills', d: 'Measure baseline employee resilience against social engineering lures.' },
          { i: '🔍', t: 'URL & Header Analysis', d: 'Train users to spot typosquatting, deceptive subdomains, and spoofed headers.' },
          { i: '🛡️', t: 'Phishing-Resistant MFA', d: 'Implement FIDO2 / WebAuthn hardware keys that cannot be phished.' },
          { i: '🔒', t: 'Email Protocol Hardening', d: 'Enforce strict SPF, DKIM, and DMARC policies to prevent brand abuse.' },
        ]} />
      </Section>

      <Section id="attacker-tactics" icon="🕵️" title="How Attackers Clone Pages &amp; Craft Lures" subtitle="Deceptive mechanics dissected for defensive training">
        <p>
          To protect systems effectively, defenders must understand the techniques threat actors use to build convincing deceptive campaigns:
        </p>
        <div className="space-y-3 mt-3">
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-white mb-1">1. High-Fidelity Portal Cloning</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Attackers scrape the exact HTML, CSS styling, fonts, and brand assets of corporate login pages (e.g. Microsoft 365, Google Workspace, Okta). The page looks pixel-perfect, but the form submission action forwards inputted passwords directly to an attacker-controlled endpoint.
            </div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-white mb-1">2. Psychological Urgency &amp; Authority Triggers</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Emails are designed to bypass critical thinking by inciting panic, curiosity, or obligation: <span className="font-mono text-amber-300">&quot;Account suspended within 24 hours&quot;</span>, <span className="font-mono text-amber-300">&quot;Urgent Wire Transfer Approved by CEO&quot;</span>, or <span className="font-mono text-amber-300">&quot;Updated Q4 Bonus Policy - Review Required&quot;</span>.
            </div>
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-white mb-1">3. Reverse Proxy &amp; Session Hijacking (Adversary-in-the-Middle)</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Modern sophisticated phishing toolkits (such as Evilginx) proxy real traffic between the victim and legitimate server. When the victim enters their one-time passcode (OTP), the proxy intercepts the active session cookie, bypassing traditional SMS/app-based 2FA.
            </div>
          </div>
        </div>
      </Section>

      <Section id="spotting-urls" icon="🔍" title="How to Spot Fake URLs &amp; Deceptive Links" subtitle="Anatomy of malicious domain names and links">
        <p className="text-xs text-slate-400 mb-3">
          Hovering over links and reading the address bar carefully reveals deceptive patterns that attackers use:
        </p>
        <FeatureGrid items={[
          { i: '🏷️', t: 'Deceptive Subdomains', d: 'login.microsoft.com.attacker-security.net — the real domain is always right before the first single slash (/).' },
          { i: '🔤', t: 'Typosquatting & Lookalikes', d: 'Replacing letters with similar characters: micr0soft.com, paypa1.com, or netfIix.com (capital i for l).' },
          { i: '🌐', t: 'Punycode / Homoglyph Attacks', d: 'Using Cyrillic characters that look identical to Latin (xn--...). Modern browsers show punycode for foreign scripts.' },
          { i: '🔒', t: 'The Padlock Fallacy', d: 'HTTPS and the padlock icon only mean traffic is encrypted — it does NOT mean the recipient domain is trustworthy.' },
        ]} />
        <InfoBox title="URL Anatomy Breakdown">
          In <span className="font-mono text-amber-300">https://login.company.com.auth-portal-verify.org/login</span>:
          <br />• Root Domain: <span className="font-mono text-red-300 font-bold">auth-portal-verify.org</span> (Malicious third party)
          <br />• Subdomain: <span className="font-mono text-slate-400">login.company.com</span> (Attacker-created label designed to deceive)
        </InfoBox>
      </Section>

      <Section id="two-factor" icon="🛡️" title="2FA &amp; Phishing-Resistant Authentication" subtitle="Comparing multi-factor authentication methods">
        <div className="space-y-3">
          <div className="rounded-xl p-4 border border-green-500/30" style={{ background: 'rgba(34,197,94,0.06)' }}>
            <div className="text-sm font-semibold text-green-300 mb-1">✅ Phishing-Resistant: FIDO2 / WebAuthn (Hardware Keys &amp; Passkeys)</div>
            <div className="text-xs text-slate-300 leading-relaxed">
              Hardware security keys (such as YubiKeys) and platform passkeys use public-key cryptography bound directly to the browser&apos;s verified domain URL. If you are on <span className="font-mono text-red-300">fake-login.com</span>, the browser will never send authentication credentials for <span className="font-mono text-green-300">company.com</span>, completely defeating reverse-proxy phishing.
            </div>
          </div>
          <div className="rounded-xl p-4 border border-yellow-500/30" style={{ background: 'rgba(234,179,8,0.06)' }}>
            <div className="text-sm font-semibold text-yellow-300 mb-1">⚠️ Moderately Vulnerable: Authenticator Apps &amp; Number Matching</div>
            <div className="text-xs text-slate-300 leading-relaxed">
              Time-based One-Time Passwords (TOTP) from apps like Google Authenticator or Microsoft Authenticator are better than SMS, but can still be captured and relayed in real time by AiTM proxy kits. Number matching reduces MFA fatigue attacks.
            </div>
          </div>
          <div className="rounded-xl p-4 border border-red-500/30" style={{ background: 'rgba(239,68,68,0.06)' }}>
            <div className="text-sm font-semibold text-red-300 mb-1">❌ Highly Vulnerable: SMS / Voice OTP &amp; Email Verification</div>
            <div className="text-xs text-slate-300 leading-relaxed">
              SMS codes are susceptible to SIM swapping, SS7 interception, and straightforward credential harvesting forms. They should be phased out for critical enterprise access.
            </div>
          </div>
        </div>
      </Section>

      <Section id="email-defense" icon="📧" title="Email Authentication &amp; Perimeter Defense" subtitle="Technical controls for organization administrators">
        <p className="text-xs text-slate-400">Deploy these standard DNS authentication records to block unauthorized senders from spoofing your domain:</p>
        <div className="space-y-3 mt-2">
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-cyan-300 font-mono mb-1">1. SPF (Sender Policy Framework)</div>
            <div className="text-xs text-slate-400 mb-2">Specifies authorized IP addresses and mail servers allowed to send mail on behalf of your domain:</div>
            <CodeBlock title="DNS TXT Record (example.com)" lines={`v=spf1 include:_spf.google.com ~all`} />
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-cyan-300 font-mono mb-1">2. DKIM (DomainKeys Identified Mail)</div>
            <div className="text-xs text-slate-400 mb-2">Adds a cryptographic digital signature to outgoing emails, proving the message wasn&apos;t altered in transit:</div>
            <CodeBlock title="DNS TXT Record (selector._domainkey.example.com)" lines={`v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3...`} />
          </div>
          <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-cyan-300 font-mono mb-1">3. DMARC (Domain-based Message Authentication)</div>
            <div className="text-xs text-slate-400 mb-2">Instructs recipient mail servers how to handle emails that fail SPF/DKIM verification (quarantine or reject):</div>
            <CodeBlock title="DNS TXT Record (_dmarc.example.com)" lines={`v=DMARC1; p=reject; rua=mailto:dmarc-reports@example.com; pct=100`} />
          </div>
        </div>
      </Section>

      <Section id="awareness-workflow" icon="📋" title="Building an Effective Awareness Program" subtitle="Best practices for organizational training">
        <div className="space-y-3">
          <IssueRow
            issue="Employees fear punishment for reporting phishing clicks"
            fix="Establish a blameless, positive security culture. Reward users who report suspicious emails and provide immediate constructive micro-learning rather than punitive measures."
          />
          <IssueRow
            issue="Infrequent annual training leads to quick skill fade"
            fix="Run quarterly or monthly simulated drills with diverse scenarios (invoices, shipping notices, internal IT updates) to keep threat recognition sharp."
          />
          <IssueRow
            issue="Manual reporting friction prevents timely alerts"
            fix="Deploy a 1-click &apos;Report Phishing&apos; add-in button directly in email clients (Outlook/Gmail) that automatically sends headers and attachments to the SOC for automated analysis."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official documentation &amp; guides">
        <div className="space-y-2">
          {[
            ['📦', 'GoPhish Official Project Documentation', 'https://getgophish.com/documentation/'],
            ['🛡️', 'CISA Phishing Guidance & Best Practices', 'https://www.cisa.gov/resources-tools/resources/phishing-infographic'],
            ['📧', 'DMARC.org Email Authentication Guide', 'https://dmarc.org/overview/'],
            ['📸', 'HACKOLUTION Instagram', 'https://www.instagram.com/hackolution'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Legal guidelines for training simulations">
        <p>
          This guide is provided <b>strictly for educational and defensive training purposes</b>.
          Phishing simulations must only be conducted within your own organization after obtaining formal written approval from legal, executive, and IT leadership.
          Never send simulated phishing lures to personal email accounts or external organizations without explicit contractual authorization. The authors and this website assume no liability for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
