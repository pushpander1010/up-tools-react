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
  { q: 'What is WPScan?', a: 'WPScan is a black box WordPress security scanner. Written in Ruby, it audits WordPress websites for known security vulnerabilities in core versions, plugins, and themes, as well as configuration weaknesses and exposed user accounts.' },
  { q: 'Is using WPScan legal?', a: 'WPScan is a legitimate open-source security audit tool. However, running active vulnerability scans against WordPress sites you do not own or lack written authorization to test is strictly illegal.' },
  { q: 'Why do I need a WPScan API token?', a: 'While WPScan can detect installed plugins and themes without a token, the WPScan API token connects your scan to the official WordPress Vulnerability Database to report verified CVEs, CVSS scores, and exploit references.' },
  { q: 'How do I enumerate only vulnerable plugins in WPScan?', a: 'Run `wpscan --url example.com --enumerate vp`. The `vp` option stands for \'vulnerable plugins\', which checks discovered plugins against known exploit databases.' },
  { q: 'Can WPScan enumerate WordPress usernames?', a: 'Yes. WPScan checks author archives, REST API endpoints (`/wp-json/wp/v2/users`), and login prompts using the `--enumerate u` option to identify active usernames on the WordPress installation.' },
  { q: 'How do site owners defend against WPScan auditing?', a: 'Remove inactive plugins and themes completely, apply updates and security patches weekly, disable the WordPress REST API user endpoint for unauthenticated visitors, block XML-RPC, and enforce two-factor authentication behind a Web Application Firewall (WAF).' },
  { q: 'How do I install WPScan on Linux or macOS?', a: 'On Debian/Ubuntu/Kali, install via `sudo apt install wpscan`. On macOS or generic systems with Ruby installed, run `gem install wpscan`.' },
]

const howItWorks = [
  'Install WPScan via apt package manager or Ruby gem.',
  'Execute a baseline audit using wpscan --url example.com.',
  'Enumerate active and vulnerable plugins with --enumerate p.',
  'Attach your WPScan API token to retrieve real-time vulnerability data.',
  'Purge unused extensions, patch out-of-date plugins, and harden login endpoints.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'WPScan WordPress Scanner — Vulnerability Assessment Guide',
      description: 'Step-by-step reference: use WPScan for WordPress vulnerability scanning, plugin and theme enumeration, and defensive hardening. Educational purposes only.',
      about: 'WPScan WordPress vulnerability scanner and security assessment tool',
      educationalUse: 'Testing, education, and authorized reconnaissance only',
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

export default function hackolution_Wpscan() {
  return (
    <ToolLayout
      title="WPScan WordPress Scanner"
      desc="Step-by-step reference: use WPScan for WordPress vulnerability scanning, plugin and theme enumeration, and defensive hardening. Educational purposes only."
      icon="🛡️"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(0,255,65,0.08))"
      category="security"
      slug="hackolution/wpscan"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the WPScan Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for essential WordPress auditing techniques, vulnerability detection, and hardening best practices.
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
        WPScan sends active HTTP probes, enumerates server endpoints, and tests for known vulnerabilities. <b>Run WPScan only against WordPress sites you own or have explicit written permission to assess</b>.
        Unauthorized scanning against third-party servers is illegal and violates anti-hacking laws.
      </WarningBox>

      <Section id="overview" icon="🛡️" title="What is WPScan?" subtitle="Black box WordPress security scanner">
        <p>
          <b>WPScan</b> is the premier vulnerability scanner dedicated to WordPress sites. Because WordPress powers over 40% of the web,
          outdated plugins, abandoned themes, and weak administrator passwords represent one of the largest attack vectors online.
        </p>
        <p>
          WPScan checks target installations against a massive vulnerability database containing thousands of recorded WordPress Core,
          plugin, and theme exploits. It also identifies misconfigured files (like database exports or debug logs) and enumerates system usernames.
        </p>
        <FeatureGrid items={[
          { i: '🔌', t: 'Plugin & Theme Auditing', d: 'Identifies installed plugins and cross-references CVEs.' },
          { i: '🗄️', t: 'Vulnerability Database', d: 'Connects directly to the WPScan live vulnerability index.' },
          { i: '👤', t: 'User Enumeration', d: 'Discovers valid login accounts via REST API and author archives.' },
          { i: '⚙️', t: 'Config & Backup Leak Checks', d: 'Detects exposed wp-config backups and debug.log files.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="Prerequisites before running WPScan">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Ruby 3.0+ environment or Debian/Ubuntu/Kali Linux system'],
            ['☑️', 'A WordPress installation you own or have written permission to audit'],
            ['☑️', '(Recommended) Free WPScan API token from wpscan.com for CVE lookups'],
            ['☑️', 'Network access to the target website (or lab environment)'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install WPScan via APT or Ruby Gem">
        <p className="text-xs text-slate-400">Choose the installation method suited for your OS:</p>
        <CodeBlock title="terminal" lines={`# Method 1: Ubuntu / Debian / Kali Linux
sudo apt update && sudo apt install wpscan

# Method 2: Via Ruby Gem (macOS / Linux / WSL)
gem install wpscan`} />
        <InfoBox title="Updating WPScan Database">
          Keep the local database signatures up to date by running <span className="font-mono">wpscan --update</span> before conducting assessments.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic WordPress Scan" subtitle="Audit baseline Core version and active theme">
        <p className="text-xs text-slate-400">Run a standard audit against your target domain:</p>
        <CodeBlock title="terminal" lines={`wpscan --url https://example.com`} />
        <InfoBox title="How it works">
          WPScan requests headers, robots.txt, readme files, and stylesheet references to detect the WordPress version and identify whether the core installation is outdated or exposed.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🔌" title="Command 2 — Enumerate Plugins &amp; Themes" subtitle="Detect vulnerable plugins, themes, and usernames">
        <p className="text-xs text-slate-400">Use the <span className="font-mono">--enumerate</span> flag to thoroughly audit extensions:</p>
        <CodeBlock title="terminal" lines={`# Enumerate popular plugins:
wpscan --url https://example.com --enumerate p

# Enumerate vulnerable plugins, vulnerable themes, and usernames:
wpscan --url https://example.com --enumerate vp,vt,u`} />
        <InfoBox title="Enumeration Flags">
          <span className="font-mono">p</span> checks all popular plugins, <span className="font-mono">vp</span> checks only plugins with known vulnerabilities, <span className="font-mono">vt</span> checks vulnerable themes, and <span className="font-mono">u</span> discovers user accounts.
        </InfoBox>
      </Section>

      <Section id="command3" icon="🔑" title="Command 3 — Vulnerability Lookup via API Token" subtitle="Unlock full CVE details with the official WPScan API">
        <p className="text-xs text-slate-400">Pass your API token to link findings with CVSS scores and exploit references:</p>
        <CodeBlock title="terminal" lines={`wpscan --url https://example.com --api-token YOUR_API_TOKEN`} />
        <InfoBox title="Free API Token">
          Register for a free community account at <span className="font-mono">wpscan.com</span> to get a personal API token that provides 25 free vulnerability database requests per day.
        </InfoBox>
      </Section>

      <Section id="output" icon="📊" title="What WPScan Output Looks Like" subtitle="Understanding scan results in the terminal">
        <CodeBlock title="sample output" lines={`_______________________________________________________________
        __          _______   _____                  
        \\ \\        / /  __ \\ / ____|                 
         \\ \\  /\\  / /| |__) | (___   ___  __ _ _ __  
          \\ \\/  \\/ / |  ___/ \\___ \\ / __|/ _\` | '_ \\ 
           \\  /\\  /  | |     ____) | (__| (_| | | | |
            \\/  \\/   |_|    |_____/ \\___|\\__,_|_| |_|

        WordPress Security Scanner by the WPScan Team
_______________________________________________________________

[+] URL: https://example.com/ [198.51.100.42]
[+] WordPress version 6.2.2 identified
[!] 3 vulnerabilities identified for WordPress 6.2.2:
 | * CVE-2023-39999 - Unauthenticated Blind SSRF
 | * Reference: https://wpscan.com/vulnerability/12345

[+] Enumerating Installed Plugins:
 | [!] contact-form-7 (version 5.7.1) identified
 |  - Status: Outdated (Latest is 5.9.8)
 |  - Vulnerability: Unrestricted File Upload (CVE-2023-XXXXX)`} />
        <InfoBox title="Interpreting Severity">
          Lines prefixed with <span className="font-mono text-red-400">[!]</span> represent critical security warnings, outdated versions, or confirmed CVE vulnerabilities.
        </InfoBox>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening WordPress Sites" subtitle="Crucial security steps for site owners &amp; administrators">
        <FeatureGrid items={[
          { i: '🗑️', t: 'Purge Unused Plugins', d: 'Deactivate and delete any plugin or theme that is not actively required.' },
          { i: '⚡', t: 'Patch Weekly', d: 'Enable automatic background updates or apply security updates immediately upon release.' },
          { i: '🔒', t: 'Enforce 2FA & Limit Logins', d: 'Require two-factor authentication and restrict brute-force attempts on wp-login.php.' },
          { i: '🛡️', t: 'Deploy WAF & Disable REST Users', d: 'Block automated scanners via Cloudflare/Wordfence and restrict unauthenticated /wp-json/wp/v2/users access.' },
        ]} />
      </Section>

      <Section id="flags" icon="🏷️" title="Key WPScan Flags &amp; Options" subtitle="Essential command switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--url &lt;target&gt;</div>
            <div className="text-xs text-slate-400">Target WordPress website URL to scan.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--enumerate &lt;options&gt;</div>
            <div className="text-xs text-slate-400">Enumerate plugins (p), vulnerable plugins (vp), themes (t), or users (u).</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--api-token &lt;token&gt;</div>
            <div className="text-xs text-slate-400">WPScan API token for retrieving full vulnerability details and CVE links.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--random-user-agent</div>
            <div className="text-xs text-slate-400">Send requests using randomized browser user agents.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--stealthy</div>
            <div className="text-xs text-slate-400">Alias for passive plugin detection and lower-noise scan profiling.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;file&gt; --format json</div>
            <div className="text-xs text-slate-400">Save structured scan output to a file for reporting or automated pipelines.</div>
          </div>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues &amp; Fixes" subtitle="Troubleshooting WPScan errors">
        <div className="space-y-3">
          <IssueRow
            issue="Scan blocked by Cloudflare or Web Application Firewall (403 Forbidden)"
            fix="Use --random-user-agent, throttle request rates with --throttle, or whitelist your scanner's IP in your staging firewall."
          />
          <IssueRow
            issue="API token limit exceeded (HTTP 429)"
            fix="Free WPScan API accounts permit 25 daily requests. Wait for token reset at midnight UTC or upgrade your subscription."
          />
          <IssueRow
            issue="The target is not responding after multiple attempts"
            fix="Verify the website URL is accessible via browser, ensure SSL certificates are valid, or pass --disable-tls-checks for self-signed lab environments."
          />
          <IssueRow
            issue="gem install wpscan fails with mkmf / libcurl error"
            fix="Install system build dependencies first: sudo apt install build-essential libcurl4-openssl-dev libxml2 libxml2-dev libxslt1-dev ruby-dev."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official WPScan GitHub Repository', 'https://github.com/wpscanteam/wpscan'],
            ['🛡️', 'WPScan Vulnerability Database', 'https://wpscan.com/vulnerabilities/'],
            ['📖', 'Official WordPress Hardening Guide', 'https://wordpress.org/documentation/article/hardening-wordpress/'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before auditing WordPress sites">
        <p>
          This guide is provided <b>strictly for educational, defensive, and authorized assessment purposes</b>. WPScan performs
          active vulnerability testing against WordPress targets. Executing scans against websites without prior written permission
          from the site owner is illegal. Test only your own installations or targets within authorized scopes.
        </p>
      </Section>
    </ToolLayout>
  )
}
