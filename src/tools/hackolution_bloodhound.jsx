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
  { q: "What is BloodHound?", a: "BloodHound is a free, open-source Active Directory analysis platform by SpecterOps. Collectors gather directory data and the interface graphs attack paths, including shortest routes to Domain Admin." },
  { q: "Is using BloodHound legal?", a: "BloodHound itself is legitimate security software. Collecting directory data without explicit written permission is illegal. Use it only in isolated labs like GOAD or signed engagements, and guard collected graphs as sensitive data." },
  { q: "How do I install BloodHound?", a: "Run the Community Edition container with docker and open port 8080. Collect lab data with SharpHound or bloodhound-python, then import the JSON offline." },
  { q: "How do I find the path to Domain Admin?", a: "Mark your owned principal, then run the Shortest Paths to Domain Admins query. Each edge names the technique — follow the chain in the lab and fix every edge as a defender." },
  { q: "What data does collection need?", a: "A lab domain account with read rights, the DC address, and the -c All flag. Run collection while lab users are logged in so session edges appear." },
  { q: "How does BloodHound help defenders?", a: "Every attack edge is a fixable misconfiguration. Removing high-leverage edges — delegation, excess admin rights, flat tiers — breaks the most paths per change." },
  { q: "What is the difference between BloodHound and manual AD recon?", a: "Manual commands answer one question at a time. BloodHound correlates everything into graphs and prebuilt queries, revealing multi-hop paths no manual checklist finds." },
  { q: "Why is my graph empty?", a: "Import all collector JSON files, verify -c All collection, and confirm sessions were captured during active lab logons." }
]

const howItWorks = [
  "Deploy BloodHound Community Edition with Docker on an analysis machine.",
  "Collect your isolated lab domain with SharpHound or bloodhound-python -c All.",
  "Import the JSON offline and run Shortest Paths to Domain Admins.",
  "Execute each lab technique along the chain and document every edge.",
  "Remediate with tiering, least privilege, delegation removal, and managed passwords."
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'BloodHound AD Mapper — Active Directory Attack Path Analysis Guide',
      description: 'Step-by-step reference: map attack paths in lab Active Directory with BloodHound. Lab only.',
      about: 'BloodHound Active Directory graph analysis',
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

export default function hackolution_bloodhound() {
  return (
    <ToolLayout
      title="BloodHound AD Mapper"
      desc="Step-by-step reference: map attack paths in lab Active Directory with BloodHound. Lab only."
      icon="🩸"
      iconBg="linear-gradient(135deg, rgba(239,68,68,0.18), rgba(179,102,255,0.08))"
      category="security"
      slug="hackolution/bloodhound"
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
            <h3 className="text-lg font-bold text-white mb-2">Watch the BloodHound Reel on Instagram</h3>
            <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto">
              Check out the HACKOLUTION reel for attack path graphs, shortest paths to Domain Admin, and tiering that breaks them.
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
        BloodHound collectors query Active Directory and reveal full privilege attack paths. Collecting or analyzing any directory without explicit written permission is strictly prohibited and illegal. Use BloodHound <b>only in isolated AD labs (GOAD, BadBlood) or engagements covered by a signed authorization</b>. Treat collected graphs as highly sensitive credential-adjacent data.
      </WarningBox>

      <Section id="overview" icon="🩸" title="What is BloodHound?" subtitle="See Active Directory the way attackers do">
        <p>
          <b>BloodHound</b> is a free, open-source <b>Active Directory analysis platform</b> by SpecterOps. Collectors like <b>SharpHound</b> gather users, groups, sessions, and permissions from a lab domain, and the interface renders them as a <b>graph of attack paths</b> — including the shortest route from any owned account to Domain Admin.
        </p>
        <p>
          Defenders use the same graphs to prioritize fixes: every edge BloodHound draws is a misconfiguration to remove. In authorized assessments it turns sprawling directory data into one answer — where the domain falls over, and what single change breaks the most paths.
        </p>
        <FeatureGrid items={[
          { i: '🗺️', t: 'Attack Path Graphs', d: 'Shortest paths from owned principals to high-value targets.' },
          { i: '🎯', t: 'Prebuilt Queries', d: 'Find kerberoastables, AS-REP roastables, and unconstrained delegation instantly.' },
          { i: '🐶', t: 'SharpHound Collectors', d: 'Fast C# and Python collection from lab domain hosts.' },
          { i: '📊', t: 'Session Mapping', d: 'Shows which users sit logged in on which machines.' },
          { i: '🛡️', t: 'Defense Priorities', d: 'Edges ranked by how many paths each fix removes.' },
          { i: '💾', t: 'Offline Analysis', d: 'Import lab collections and analyze without touching the domain.' }
        ]} />
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="Install BloodHound on Linux">
        <p className="text-xs text-slate-400">Install the Community Edition container on your lab analysis machine:</p>
        <CodeBlock title="terminal" lines={`docker pull specterops/bloodhound
# run it (interface on port 8080):
# docker run -p 8080:8080 specterops/bloodhound`} />
        <InfoBox title="Collectors in the lab">
          Collection runs inside the lab domain with SharpHound or bloodhound-python against the lab DC. Analysis happens offline in your container — never point collectors at production directories.
        </InfoBox>
      </Section>

      <Section id="command1" icon="🚀" title="Command 1 — Collect Lab Data" subtitle="Gather the domain graph safely">
        <p className="text-xs text-slate-400">Run the Python collector against your isolated lab domain controller:</p>
        <CodeBlock title="terminal" lines={`bloodhound-python -d LAB.local -u user -p Password1 -dc 192.168.56.10 -c All`} />
        <InfoBox title="Collection output">
          The -c All flag gathers users, groups, trusts, sessions, and ACLs into JSON files. Copy them off the lab host and import into BloodHound — analysis from here on needs zero domain contact.
        </InfoBox>
      </Section>

      <Section id="command2" icon="🎯" title="Command 2 — Shortest Path Query" subtitle="Find the fastest route to Domain Admin">
        <p className="text-xs text-slate-400">In the BloodHound interface, run the prebuilt shortest-path analysis:</p>
        <CodeBlock title="terminal" lines={`# Search: owned principal > Path Analysis
# Query: Shortest Paths to Domain Admins`} />
        <InfoBox title="Reading attack paths">
          Each edge names the abuse: MemberOf, AdminTo, HasSession, ForceChangePassword. The shortest chain is your lab escalation plan — and the defender priority list, since breaking one edge kills the path.
        </InfoBox>
      </Section>

      <Section id="command3" icon="📄" title="Command 3 — High-Value Queries" subtitle="Surface roastables and delegation flaws">
        <p className="text-xs text-slate-400">Run the stock queries that flag the classic lab misconfigurations:</p>
        <CodeBlock title="terminal" lines={`# Prebuilt: Kerberoastable Users, AS-REP Roastable,
# Unconstrained Delegation, High-Value Targets`} />
        <InfoBox title="From query to roast">
          Export the flagged accounts and feed them to GetUserSPNs or GetNPUsers in the lab. Each query maps to a concrete technique — document the technique, the accounts, and the one-line fix per finding.
        </InfoBox>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshots" subtitle="BloodHound attack path graph">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/bloodhound/bloodhound_logo.jpg" alt="BloodHound AD mapper logo" width="1200" height="630"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">BloodHound graph — shortest path to Domain Admin in a lab</figcaption>
        </figure>
      </Section>

      <Section id="findings" icon="🔍" title="What BloodHound Maps Find" subtitle="Common discoveries from AD graph analysis">
        <FeatureGrid items={[
          { i: '👑', t: 'Domain Admin Paths', d: 'Exact chains from foothold to full domain control.' },
          { i: '🎫', t: 'Roastable Accounts', d: 'Kerberoastable and AS-REP roastable principals flagged.' },
          { i: '🔗', t: 'Delegation Flaws', d: 'Unconstrained and constrained delegation to abuse.' },
          { i: '👥', t: 'Session Exposure', d: 'Admins logged in on machines you can reach.' },
          { i: '🔑', t: 'Password Control Edges', d: 'Accounts whose passwords others can reset.' },
          { i: '🏰', t: 'Tiering Violations', d: 'Admin paths crossing tiers that should be isolated.' }
        ]} />
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Hardening for Site Owners" subtitle="Remediation steps to reduce exposure">
        <div className="space-y-3">
          <IssueRow
            issue="Collection fails to connect"
            fix="Verify the lab DC IP, domain name case, and credential format. Check lab network routing and that LDAPS or required ports are reachable."
          />
          <IssueRow
            issue="Graph imports but looks empty"
            fix="Confirm you collected with -c All and imported every JSON file. Session data needs a collector run while lab users are logged in."
          />
          <IssueRow
            issue="Interface will not load"
            fix="Check the Docker container logs and confirm port 8080 is free. Re-pull the image if the database migration stalls on first boot."
          />
          <IssueRow
            issue="Too many paths to triage"
            fix="Start with Shortest Paths to Domain Admins, then High-Value Targets. Fix edges that break the most paths first — that is the prioritization BloodHound exists for."
          />
        </div>
      </Section>

      <Section id="flags" icon="🏷️" title="Key BloodHound Pieces & Queries" subtitle="Essential command-line switches">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">SharpHound / python</div>
            <div className="text-xs text-slate-400">Collectors that gather lab directory data.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">-c All</div>
            <div className="text-xs text-slate-400">Full collection: sessions, ACLs, trusts, and more.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Shortest Paths</div>
            <div className="text-xs text-slate-400">Fastest escalation chain to high-value groups.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Kerberoastables</div>
            <div className="text-xs text-slate-400">Service accounts with crackable tickets.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Delegation Queries</div>
            <div className="text-xs text-slate-400">Unconstrained and constrained delegation flaws.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">Owned Marking</div>
            <div className="text-xs text-slate-400">Tag compromised principals to recompute paths.</div>
          </div>
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links &amp; social">
        <div className="space-y-2">
          {[
            ['📦', 'Official BloodHound GitHub Repository', 'https://github.com/SpecterOps/BloodHound'],
            ['📖', 'BloodHound Documentation', 'https://support.bloodhoundenterprise.io/'],
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
