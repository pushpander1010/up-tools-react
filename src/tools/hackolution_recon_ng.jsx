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
  { q: 'What is Recon-ng?', a: 'Recon-ng is a modular reconnaissance framework written in Python. Like Metasploit for exploitation, it organizes information gathering into installable modules, stores everything in a SQLite database per workspace, and ships with workspaces, a community marketplace, and report generation.' },
  { q: 'Is Recon-ng legal?', a: 'Recon-ng itself is a legitimate open-source security research tool. Running its modules against targets you do not own or without explicit written permission is illegal. Use Recon-ng only in authorized labs and engagements with a defined scope.' },
  { q: 'How do I install Recon-ng on Kali Linux?', a: 'On Kali Linux run `sudo apt install recon-ng -y`. For the latest version, clone https://github.com/lanmaster53/recon-ng and run `pip3 install -r REQUIREMENTS`, then launch with `./recon-ng`.' },
  { q: 'How do I run my first Recon-ng workspace?', a: 'Launch the console with `recon-ng`, then run `workspaces create demo` and `workspaces select demo`. Each workspace keeps its own database, so results from different engagements never mix.' },
  { q: 'What are Recon-ng marketplace modules?', a: 'The marketplace hosts community modules organized by category path, for example `recon/domains-hosts/bing_domain_web`. Install with `marketplace install <path>`, load with `modules load <path>`, set options such as `options set SOURCE example.com`, then `run`.' },
  { q: 'How do Recon-ng API keys and reporting work?', a: 'Modules that call third-party services need keys, stored with `keys add shodan_api YOUR_KEY`. Query collected data with `db query hosts`, and export results using reporting modules such as `reporting load reporting/html` followed by `run`.' },
]

const howItWorks = [
  'Install Recon-ng with sudo apt install recon-ng -y, or clone from GitHub and run pip3 install -r REQUIREMENTS.',
  'Launch the console with recon-ng and create an isolated workspace using workspaces create demo.',
  'Search and install marketplace modules such as recon/domains-hosts/bing_domain_web for your authorized scope.',
  'Load modules, set options like options set SOURCE example.com, add API keys, and run to collect data.',
  'Query the database with db query hosts and export findings using reporting modules such as reporting/html.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Recon-ng Framework Guide — Modular Recon with Workspaces, Marketplace and Reporting',
      description: 'Step-by-step reference: use Recon-ng modular recon with workspaces, marketplace modules and reporting. Educational purposes only.',
      about: 'Recon-ng modular reconnaissance framework, workspaces, marketplace modules and reporting',
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

export default function hackolution_Reconng() {
  return (
    <ToolLayout
      title="Recon-ng Framework Guide"
      desc="Step-by-step reference: use Recon-ng modular recon with workspaces, marketplace modules and reporting. Educational purposes only."
      icon="🧭"
      iconBg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(27,255,110,0.08))"
      category="security"
      slug="hackolution/recon-ng"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/logo/hackolution.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="HACKOLUTION reel" subtitle="Watch on Instagram, then practice below in your lab">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-white/10 p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(214,41,118,0.12), rgba(17,24,39,0.6))' }}>
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-lg font-bold text-white mb-2">Watch Recon-ng Reels on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reels for rapid insights into modular reconnaissance, workspaces, and responsible OSINT practice.
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
        Recon-ng runs active information-gathering modules that query third-party services and touch target infrastructure. Use it <b>only against assets you own or have explicit written permission to assess</b>.
        Unauthorized reconnaissance against third-party targets is strictly prohibited and illegal. This guide is provided for <b>educational and authorized security testing only</b>.
      </WarningBox>

      <Section id="overview" icon="🌐" title="What is Recon-ng?" subtitle="Modular reconnaissance framework, the Metasploit of OSINT">
        <p>
          <b>Recon-ng</b> is a full-featured reconnaissance framework written in Python, built around a modular architecture similar to Metasploit.
          Instead of running one-off scripts, you load modules that gather subdomains, emails, credentials, host data, and geolocation,
          and everything is stored in a <b>SQLite database</b> you can query and report from.
        </p>
        <p>
          Recon-ng keeps engagements separated with <b>workspaces</b>, extends capability through an installable community <b>marketplace</b>,
          manages third-party <b>API keys</b>, and exports structured <b>reports</b> — making it a standard baseline tool for authorized penetration testers and OSINT researchers.
        </p>
        <FeatureGrid items={[
          { i: '🧩', t: 'Modular Architecture', d: 'Python modules for DNS, WHOIS, scraping, and API integrations loaded on demand.' },
          { i: '🗂️', t: 'Workspaces', d: 'Each engagement gets its own isolated SQLite database.' },
          { i: '📦', t: 'Marketplace', d: 'Community modules installed by category path such as recon/domains-hosts.' },
          { i: '📊', t: 'Reporting', d: 'Export collected data to HTML, CSV, JSON, or XML reports.' },
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install Recon-ng on Kali Linux or from source">
        <p className="text-xs text-slate-400">On Kali Linux, Debian, or Parrot OS:</p>
        <CodeBlock title="terminal" lines={`sudo apt install recon-ng -y`} />
        <p className="text-xs text-slate-400 mt-3">Or install the latest version from the official GitHub repository:</p>
        <CodeBlock title="terminal" lines={`git clone https://github.com/lanmaster53/recon-ng
pip3 install -r REQUIREMENTS`} />
        <InfoBox title="Launching from source">
          After cloning, launch with <span className="font-mono">./recon-ng</span> from inside the repository directory. The APT package installs to your system PATH, so it can be started with <span className="font-mono">recon-ng</span> from anywhere.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Launch Recon-ng &amp; Workspaces" subtitle="Start the console and create an isolated workspace">
        <p className="text-xs text-slate-400">Start the Recon-ng console:</p>
        <CodeBlock title="terminal" lines={`recon-ng`} />
        <p className="text-xs text-slate-400 mt-2">Inside the console, create and select a workspace for your engagement:</p>
        <CodeBlock title="recon-ng console" lines={`workspaces create demo
workspaces select demo
workspaces list`} />
        <InfoBox title="How workspaces work">
          Each workspace is a separate SQLite database. Collected hosts, domains, credentials, and contacts stay scoped to that engagement, so results from different targets never mix. Use <span className="font-mono">workspaces remove &lt;name&gt;</span> to delete one.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Marketplace Modules" subtitle="Search, install, and run community recon modules">
        <p className="text-xs text-slate-400">Search the marketplace for available modules:</p>
        <CodeBlock title="recon-ng console" lines={`marketplace search`} />
        <p className="text-xs text-slate-400 mt-2">Install a module by its category path, load it, set the target source, and run:</p>
        <CodeBlock title="recon-ng console" lines={`marketplace install recon/domains-hosts/bing_domain_web
modules load recon/domains-hosts/bing_domain_web
options set SOURCE example.com
run
back`} />
        <InfoBox title="Module categories">
          Modules follow a <span className="font-mono">category/name</span> path — for example <span className="font-mono">recon/domains-hosts</span>, <span className="font-mono">recon/contacts-gatherer</span>, and <span className="font-mono">recon/hosts-ports</span>. Use <span className="font-mono">modules search &lt;keyword&gt;</span> to find installed modules and <span className="font-mono">info &lt;module&gt;</span> to inspect one before loading it.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — API Keys, Database &amp; Reporting" subtitle="Store keys, query results, and generate a report">
        <p className="text-xs text-slate-400">Many modules call third-party APIs. Store keys once per workspace:</p>
        <CodeBlock title="recon-ng console" lines={`keys add shodan_api YOUR_API_KEY
keys list`} />
        <p className="text-xs text-slate-400 mt-2">Query what has been collected so far:</p>
        <CodeBlock title="recon-ng console" lines={`db query hosts
db query domains`} />
        <p className="text-xs text-slate-400 mt-2">Generate an HTML report from the collected data:</p>
        <CodeBlock title="recon-ng console" lines={`reporting load reporting/html
options set FILENAME recon_report
run`} />
        <InfoBox title="Key management">
          Keys are stored inside the current workspace database. Use <span className="font-mono">keys remove &lt;name&gt;</span> to delete one, and never commit workspace databases or key values to version control.
        </InfoBox>
      </Section>

      <Section id="findings" icon="🔍" title="What Recon-ng Modules Find" subtitle="Common data collected by marketplace modules">
        <FeatureGrid items={[
          { i: '🔎', t: 'Subdomains', d: 'Enumerate subdomains from search engines and public sources via domains-hosts modules.' },
          { i: '📧', t: 'Emails & Contacts', d: 'Harvest email addresses and contact records tied to a target domain.' },
          { i: '🔑', t: 'Credential Exposure', d: 'Check known breach dumps for exposed accounts linked to target emails.' },
          { i: '🖥️', t: 'Host Metadata', d: 'Resolve hosts and capture banners, open ports, and service versions.' },
          { i: '🌍', t: 'Geolocation', d: 'Map discovered hosts and IPs to physical locations through public APIs.' },
          { i: '🧾', t: 'Breach Records', d: 'Pull registered services and breach history for harvested identities.' },
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Protecting Your Attack Surface" subtitle="Remediation steps for site owners targeted by recon">
        <div className="space-y-3">
          <IssueRow
            issue="Public sources reveal forgotten subdomains"
            fix="Audit DNS regularly, remove stale records, and add every discovered subdomain to monitoring so unused assets are decommissioned quickly."
          />
          <IssueRow
            issue="Email addresses harvested for phishing"
            fix="Limit public role accounts, publish minimal contact data on the website, and monitor breach dumps for exposed addresses tied to your domain."
          />
          <IssueRow
            issue="Credentials leaked in breach databases"
            fix="Rotate leaked passwords, enforce unique passwords per service, enable MFA everywhere, and run secrets scanning across repositories and configs."
          />
          <IssueRow
            issue="Stale hosts with open services exposed"
            fix="Patch and firewall discovered hosts, close unused ports, and decommission legacy systems that still answer on the public internet."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key Recon-ng Commands" subtitle="Essential console commands to know">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">recon-ng</div>
            <div className="text-xs text-slate-400">Launch the Recon-ng console from a terminal.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">workspaces create &lt;name&gt;</div>
            <div className="text-xs text-slate-400">Create an isolated workspace database for an engagement.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">marketplace search</div>
            <div className="text-xs text-slate-400">List modules available in the community marketplace.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">marketplace install &lt;path&gt;</div>
            <div className="text-xs text-slate-400">Install a module by its category path, e.g. recon/domains-hosts/bing_domain_web.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">keys add &lt;name&gt; &lt;value&gt;</div>
            <div className="text-xs text-slate-400">Store an API key for modules that call third-party services.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">db query &lt;table&gt;</div>
            <div className="text-xs text-slate-400">Query collected data such as hosts, domains, or credentials.</div>
          </div>
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues &amp; Fixes" subtitle="Troubleshooting typical Recon-ng challenges">
        <div className="space-y-3">
          <IssueRow
            issue="Module fails with API error or rate limit"
            fix="Confirm the required key with info <module>, store it using keys add <name> <value>, and respect service rate limits by spacing out runs."
          />
          <IssueRow
            issue="Marketplace install returns nothing or fails"
            fix="Run marketplace search to refresh the module list, verify the exact category path, and check network connectivity to the marketplace repository."
          />
          <IssueRow
            issue="Module loads but produces no results"
            fix="Check options list to confirm SOURCE and other options are set, verify the module info for required keys, and confirm the target is within your authorized scope."
          />
          <IssueRow
            issue="Reporting module errors on export"
            fix="Confirm the reporting module is installed, set options such as FILENAME before running, and install any system dependencies the format requires."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official Recon-ng GitHub Repository', 'https://github.com/lanmaster53/recon-ng'],
            ['📖', 'Recon-ng Wiki & User Guide', 'https://github.com/lanmaster53/recon-ng/wiki'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before running any module">
        <p>
          This documentation is provided <b>strictly for educational and authorized defensive purposes</b>. Recon-ng modules actively query
          third-party services and target infrastructure, generating traffic that may trigger monitoring and intrusion prevention systems.
          Running Recon-ng against targets without explicit written authorization is illegal. Test only systems you own or are authorized to assess under a formal scope of work. The authors and this website assume no liability for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
