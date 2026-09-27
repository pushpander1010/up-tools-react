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
  { q: 'What is Nikto?', a: 'Nikto is an open-source web server scanner that tests web servers for over 7,000 potentially dangerous files, outdated server software, insecure scripts, and configuration vulnerabilities.' },
  { q: 'Is using Nikto legal?', a: 'Yes, Nikto itself is a legitimate open-source security audit tool. However, running Nikto against any web server without explicit written permission is prohibited and illegal. Always test only servers you own or are authorized to assess.' },
  { q: 'How do I install Nikto on Ubuntu or Debian Linux?', a: 'You can install Nikto directly via APT using `sudo apt update && sudo apt install nikto` or by cloning the official CIRT GitHub repository and running the Perl script.' },
  { q: 'How do I scan a target website with Nikto?', a: 'Run `nikto -h http://example.com` or `nikto -h 192.168.1.50 -p 80,443` to start a comprehensive scan against default web ports.' },
  { q: 'What are Nikto tuning options?', a: 'The `-Tuning` flag lets you selectively run specific check categories (e.g. 1 for interesting files, 2 for misconfigurations, 3 for information disclosure, b for software identification, etc.), speeding up scan times.' },
  { q: 'How do I export Nikto scan reports to a file?', a: 'Use the `-o` and `-Format` flags, for example: `nikto -h http://example.com -o nikto_report.html -Format htm` or `-Format csv`.' },
  { q: 'How do site owners defend against Nikto findings?', a: 'Keep web server packages up to date, wipe default files and test scripts, disable HTTP TRACE/TRACK methods, implement security headers (HSTS, CSP, X-Frame-Options), and deploy a Web Application Firewall (WAF).' },
]

const howItWorks = [
  'Install Nikto via package manager using sudo apt install nikto.',
  'Initiate a basic web server audit using nikto -h http://example.com.',
  'Target specific vulnerability classes using tuning options like nikto -h http://example.com -Tuning 123b.',
  'Save findings into an actionable HTML report using nikto -h http://example.com -o nikto_report.html -Format htm.',
  'Harden server configurations, remove default scripts, and patch outdated software.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Nikto Server Scanner — Web Server Vulnerability & Hardening Guide',
      description: 'Step-by-step reference: use Nikto web server scanner for vulnerability assessment, misconfiguration detection, and server hardening. Educational purposes only.',
      about: 'Nikto web server vulnerability scanner and auditing tool',
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

export default function hackolution_Nikto() {
  return (
    <ToolLayout
      title="Nikto Server Scanner"
      desc="Step-by-step reference: use Nikto web server scanner for vulnerability assessment, misconfiguration detection, and server hardening. Educational purposes only."
      icon="🛡️"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hackolution/nikto"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the Nikto Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for rapid insights into web server vulnerability scanning, header inspection, and defensive hardening.
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
        Nikto web server scanner sends thousands of HTTP requests testing for known server vulnerabilities and exposed files. Use it <b>only against web servers you own or have explicit written permission to assess</b>.
        Unauthorized scanning against third-party servers is strictly prohibited and illegal. This guide is provided for <b>educational and authorized security testing only</b>.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is Nikto?" subtitle="Open-source web server vulnerability scanner">
        <p>
          <b>Nikto</b> is a renowned open-source web server assessment tool designed to perform comprehensive tests against web servers for multiple security items.
          It scans targets for over <b>7,000 potentially dangerous files and programs</b>, checks for outdated server versions and vulnerable software packages,
          and identifies server configuration items such as the presence of multiple index files and HTTP server options.
        </p>
        <p>
          Nikto is built for speed and coverage in command-line environments. It supports SSL/TLS encryption, full HTTP proxying, host authentication,
          and custom user-agent simulation, making it an essential baseline tool for authorized sysadmins and penetration testers.
        </p>
        <FeatureGrid items={[
          { i: '🔍', t: '7000+ Vulnerability Checks', d: 'Detects dangerous files, outdated CGI scripts, and known exploits.' },
          { i: '⚙️', t: 'Configuration Auditing', d: 'Identifies missing headers, open methods (TRACE), and default indexes.' },
          { i: '🎯', t: 'Tuning Options', d: 'Filter scans by specific vulnerability classes to speed up assessments.' },
          { i: '📊', t: 'Multi-Format Reporting', d: 'Export findings directly to HTML, CSV, JSON, TXT, or XML.' },
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Nikto on Linux and macOS">
        <p className="text-xs text-slate-400">On Debian, Ubuntu, Kali Linux, or Parrot OS:</p>
        <CodeBlock title="terminal" lines={`sudo apt update && sudo apt install nikto -y`} />
        <p className="text-xs text-slate-400 mt-3">On macOS using Homebrew:</p>
        <CodeBlock title="terminal" lines={`brew install nikto`} />
        <InfoBox title="Git Repository Alternative">
          You can also clone the repository directly from GitHub: <span className="font-mono">git clone https://github.com/sullo/nikto</span> and run <span className="font-mono">perl program/nikto.pl</span>.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Basic Web Server Scan" subtitle="Audit a target host with default test suites">
        <p className="text-xs text-slate-400">Run standard scanning against your authorized domain or IP address:</p>
        <CodeBlock title="terminal" lines={`nikto -h http://example.com`} />
        <p className="text-xs text-slate-400 mt-2">To scan specific ports (e.g. HTTPS port 443 with SSL enabled):</p>
        <CodeBlock title="terminal" lines={`nikto -h https://example.com -p 443 -ssl`} />
        <InfoBox title="How it works">
          Nikto queries the server header, identifies the web server software (Apache, Nginx, IIS), validates index files, checks for known CGI vulnerabilities, and alerts on missing security headers.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Tuning Options for Targeted Scans" subtitle="Speed up scans by focusing on specific vulnerability categories">
        <p className="text-xs text-slate-400">Use the <span className="font-mono">-Tuning</span> option to run selected test categories:</p>
        <CodeBlock title="terminal" lines={`nikto -h http://example.com -Tuning 123b`} />
        <InfoBox title="Tuning Category Codes">
          <ul className="list-disc pl-4 space-y-1 mt-1 text-xs">
            <li><b>1</b>: Interesting File / Seen in logs</li>
            <li><b>2</b>: Misconfiguration / Default File</li>
            <li><b>3</b>: Information Disclosure</li>
            <li><b>4</b>: Injection (XSS/Script/HTML)</li>
            <li><b>8</b>: Command Execution / Remote Shell</li>
            <li><b>9</b>: SQL Injection</li>
            <li><b>b</b>: Software Identification</li>
          </ul>
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — Export Scan Report" subtitle="Generate structured HTML or CSV assessment reports">
        <p className="text-xs text-slate-400">Save complete scan output to an HTML report for analysis and documentation:</p>
        <CodeBlock title="terminal" lines={`nikto -h http://example.com -o nikto_report.html -Format htm`} />
        <p className="text-xs text-slate-400 mt-2">To generate JSON or CSV output for CI/CD automation pipelines:</p>
        <CodeBlock title="terminal" lines={`nikto -h http://example.com -o nikto_report.json -Format json`} />
        <InfoBox title="Supported Formats">
          Nikto supports <span className="font-mono">htm</span>, <span className="font-mono">csv</span>, <span className="font-mono">json</span>, <span className="font-mono">xml</span>, and <span className="font-mono">txt</span> output formats via the <span className="font-mono">-Format</span> parameter.
        </InfoBox>
      </Section>

      <Section id="checks" icon="🔍" title="What 7,000+ Checks Find" subtitle="Common vulnerabilities detected by Nikto">
        <FeatureGrid items={[
          { i: '📦', t: 'Outdated Server Software', d: 'Identifies unpatched Apache, Nginx, or IIS versions vulnerable to public CVEs.' },
          { i: '📁', t: 'Default Files & Dashboards', d: 'Finds exposed /phpinfo.php, /admin, test scripts, and installation wizards.' },
          { i: '🔓', t: 'Dangerous HTTP Methods', d: 'Flags active TRACE, TRACK, or PUT methods that facilitate XST attacks.' },
          { i: '🛡️', t: 'Missing Security Headers', d: 'Reports missing X-Frame-Options, HSTS, X-Content-Type-Options, and CSP.' },
          { i: '🗝️', t: 'Exposed Secrets & Git', d: 'Detects accessible .git/ directories, .env files, backup archives (.zip, .bak).' },
          { i: '🧩', t: 'Vulnerable Subcomponents', d: 'Detects outdated phpMyAdmin, Tomcat manager, or Apache CGI modules.' },
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Web Server Hardening for Site Owners" subtitle="Remediation steps to resolve Nikto findings">
        <div className="space-y-3">
          <IssueRow
            issue="Outdated web server banner & vulnerable version reported"
            fix="Patch server OS packages regularly (apt upgrade / yum update) and obscure server version tokens (e.g. ServerTokens Prod in Apache, server_tokens off; in Nginx)."
          />
          <IssueRow
            issue="Default sample files, test scripts, or .git exposed"
            fix="Wipe all default welcome pages, test CGI scripts, and backup archives from your document root. Block dotfiles (.git, .env) at the web server config level."
          />
          <IssueRow
            issue="HTTP TRACE / TRACK method enabled (Cross-Site Tracing)"
            fix="Disable TRACE in Apache via TraceEnable Off, or in Nginx return 405 Method Not Allowed for non-standard request methods."
          />
          <IssueRow
            issue="Missing HTTP security headers (Clickjacking / MIME sniffing risks)"
            fix="Add Strict-Transport-Security, X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff, and Content-Security-Policy to all server responses."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Nikto Flags &amp; Options" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-h &lt;target&gt;</div>
            <div className="text-xs text-slate-400">Target host (domain name, IP address, or full URL).</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-p &lt;port(s)&gt;</div>
            <div className="text-xs text-slate-400">Specify one or more TCP ports to scan (e.g. 80,443,8080).</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-ssl</div>
            <div className="text-xs text-slate-400">Force SSL/TLS mode on the specified port.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-Tuning &lt;options&gt;</div>
            <div className="text-xs text-slate-400">Scan tuning to include or exclude specific test categories.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-o &lt;file&gt; -Format &lt;type&gt;</div>
            <div className="text-xs text-slate-400">Specify output file path and format (htm, csv, json, xml, txt).</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-useragent &lt;string&gt;</div>
            <div className="text-xs text-slate-400">Override default User-Agent string to test WAF/filter reactions.</div>
          </div>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues &amp; Fixes" subtitle="Troubleshooting typical Nikto challenges">
        <div className="space-y-3">
          <IssueRow
            issue="Scan is very slow or timing out"
            fix="Use -Tuning options to restrict checks to specific categories, or use -Pause to avoid aggressive rate-limits that trigger server throttling."
          />
          <IssueRow
            issue="SSL certificate verification errors or handshake failures"
            fix="Add the -ssl flag explicitly, or use -nointeractive when scanning servers with self-signed SSL certificates in testing labs."
          />
          <IssueRow
            issue="Target returns 403 Forbidden on all requests"
            fix="A Web Application Firewall (WAF) or fail2ban is likely blocking the default Nikto User-Agent. Verify authorization and configure custom headers or lab bypasses."
          />
          <IssueRow
            issue="Perl SSL module missing (Net::SSLeay)"
            fix="Install libnet-ssleay-perl via your Linux package manager (sudo apt install libnet-ssleay-perl)."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Nikto GitHub Repository', 'https://github.com/sullo/nikto'],
            ['📖', 'Nikto Documentation & CIRT Guide', 'https://cirt.net/Nikto2'],
            ['🛡️', 'OWASP Web Security Testing Guide', 'https://owasp.org/www-project-web-security-testing-guide/'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before scanning any server">
        <p>
          This documentation is provided <b>strictly for educational and authorized defensive purposes</b>. Nikto performs
          intrusive HTTP checks that generate substantial log noise and may trigger intrusion prevention systems.
          Running Nikto against web servers without explicit written authorization is illegal. Test only systems you own or are authorized to assess under a formal scope of work. The authors and this website assume no liability for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
