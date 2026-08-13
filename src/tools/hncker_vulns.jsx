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

function StepRow({ num, title, body }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand/20 text-brand font-bold text-sm mt-0.5 flex-none">{num}</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{title}</div>
          <div className="text-xs text-slate-400 leading-relaxed">{body}</div>
        </div>
      </div>
    </div>
  )
}

const faq = [
  { q: 'How do hackers find vulnerabilities in a website?', a: 'By following a clear six-step method: recon (gather public details about the target), scanning (probe for open ports and services), enumeration (dig into each open service), mapping the attack surface (match versions against known weaknesses), finding the bug (test weak spots with payloads), and exploiting (chain the crack into real access).' },
  { q: 'What is reconnaissance (recon) in hacking?', a: 'Recon is the first step, where a tester gathers every public detail about a target before touching it — subdomains, the technology it runs, and the people behind it. No breaking in yet, just quiet watching and note-taking, like reading the outside of a building before trying any door.' },
  { q: 'What does scanning a target mean?', a: 'Scanning is probing the target to find open doors: which ports are open, which services run on them, and which versions. Tools like nmap report open ports and service versions, which become the checklist for what to test later.' },
  { q: 'What is enumeration?', a: 'Enumeration is digging deeper inside each open service — hidden folders, backup files left behind, admin panels, and default passwords that were never changed. Every forgotten corner becomes a clue about how the target is built and where it might be weak.' },
  { q: 'What is mapping the attack surface?', a: 'After recon, scanning, and enumeration, the tester writes down everything found and matches each service version against known weaknesses. This turns a generic website into a specific set of weak points — the real target.' },
  { q: 'Is finding and exploiting vulnerabilities illegal?', a: 'Yes, unless you own the system or have written permission to test it. Hacking without permission is a crime with serious consequences. The same skills that find weaknesses are the ones used to defend against them — learn them to build and protect, never to break.' },
  { q: 'What tools are used for vulnerability hunting?', a: 'Common ones include nmap for port scanning, subfinder and Amass for subdomain recon, ffuf for content discovery, nuclei as a template-driven vulnerability scanner, and Burp Suite or manual payloads for testing weak spots.' },
]

const howItWorks = [
  'Recon: gather every public detail about the target — subdomains, tech stack, people.',
  'Scan: probe for open ports and the services running on them (e.g. nmap).',
  'Enumerate: dig into each open service for hidden folders, backups, admin panels.',
  'Map the attack surface: match each service version against known weaknesses.',
  'Find the bug: test weak spots with payloads and watch how the system reacts.',
  'Exploit: chain the small crack into real access — a login bypass, a hidden command.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'How Hackers Find Vulnerabilities — the 6-Step Method Explained (Educational)',
      description: 'Understand how hackers find vulnerabilities in a website they have never seen: recon, scanning, enumeration, mapping the attack surface, finding the bug, and exploiting. A clear step-by-step method for ethical learning and authorized security testing only.',
      about: 'how hackers find vulnerabilities',
      educationalUse: 'Testing, education, and authorized use only',
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

export default function hncker_vulns() {
  return (
    <ToolLayout
      title="How Hackers Find Vulnerabilities — 6-Step Method Explained"
      desc="Learn exactly how hackers find vulnerabilities in a website they have never seen: recon, scan, enumerate, map the attack surface, find the bug, and exploit. A clear six-step method for ethical learning and authorized testing. Educational only."
      icon="🎯"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/vulns"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/vulns/vulns_poster.jpg" />
        <meta property="og:title" content="How Hackers Find Vulnerabilities — 6-Step Method Explained | HNCKER" />
        <meta property="og:description" content="Recon, scan, enumerate, map, find, exploit — the six-step method hackers use to break into a website. Educational only." />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <video
            src="/assets/tools/vulns/vulns-demo.mp4"
            controls
            preload="none"
            playsInline
            poster="/assets/tools/vulns/vulns_poster.jpg"
            className="w-full aspect-video rounded-xl border border-white/10 bg-black"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>
      </Section>

      <WarningBox>
        This page explains how vulnerabilities are found for <b>educational and authorized security testing only</b>. Testing a
        system you do not own, or without written permission, is a <b>crime</b>. Never test a target you don't have permission to
        assess. Understanding how attackers work is how defenders stop them.
      </WarningBox>

      <Section id="overview" icon="🧭" title="The 6-Step Method" subtitle="From a completely unknown website to a mapped target with a real weakness">
        <p>
          There is no single magic trick a hacker uses. Breaking into a website they have never seen is a <b>clear, step-by-step
          method</b>. Today we walk through all six steps so you understand exactly how it happens — and how to defend against it.
        </p>
        <StepRow num={1} title="Recon" body="Gather every public detail about the target before touching it — subdomains, the technology it runs, the names of the people behind it. Like reading the outside of a building before trying any door. Quiet watching, taking notes." />
        <StepRow num={2} title="Scan" body="Reach out and probe the target for open doors: which ports are open, which services are running, and which versions of those services. Like walking the whole building and checking every door, window, and service hatch." />
        <StepRow num={3} title="Enumerate" body="Dig deeper inside each open service — hidden folders, backup files left behind, admin panels, and default passwords never changed. Every forgotten corner becomes a clue." />
        <StepRow num={4} title="Map the attack surface" body="Write down everything found and match each service version against known weaknesses. Like having a full list of doors and a list of which locks are cheap and easy to pick. This is where the real target appears." />
        <StepRow num={5} title="Find the bug" body="Test the weak spots with payloads. Poke an input field with special text, or send a weird request, and watch how the system reacts — like trying different keys until one slips in." />
        <StepRow num={6} title="Exploit" body="Chain that small crack into real access. One tiny bug becomes a foot in the door, then a path to more — a login bypass here, a hidden command there. The journey from recon to here finally pays off." />
      </Section>

      <Section id="tools" icon="🧰" title="Tools Hackers Use" subtitle="The common tools behind each step">
        <FeatureGrid items={[
          { i: '🔎', t: 'subfinder / Amass', d: 'Passive subdomain discovery for the recon step.' },
          { i: '🌐', t: 'nmap', d: 'Port scanning — find open ports and service versions.' },
          { i: '📂', t: 'ffuf', d: 'Content discovery — find hidden folders and endpoints.' },
          { i: '🧨', t: 'nuclei', d: 'Template-driven vulnerability scanner to match known weaknesses.' },
          { i: '🪤', t: 'Burp Suite', d: 'Intercept and fuzz requests when testing weak input fields.' },
          { i: '🎯', t: 'Manual payloads', d: 'Special text and weird requests to trigger unexpected behavior.' },
        ]} />
      </Section>

      <Section id="example" icon="💻" title="A Quick Terminal Example" subtitle="The scan step in practice">
        <CodeBlock title="nmap -sV target.com">
nmap -sV target.com
PORT     STATE  SERVICE   VERSION
22/tcp   open   ssh       OpenSSH 8.0
80/tcp   open   http      Apache 2.4.49
3306/tcp open   mysql     MySQL 5.7
        </CodeBlock>
        <p>
          Here the scan found three open services. Each version now gets matched against known weaknesses — the <b>map</b> step —
          and the ones with a known exploit become the test targets for the <b>find the bug</b> step.
        </p>
        <InfoBox title="Why this matters for defense" icon="🛡️">
          The exact same method is how a defender finds their own weaknesses before an attacker does. Regularly recon your own
          exposed surface, close unused ports, patch known-vulnerable software versions, and audit for default credentials —
          that removes most of the doors an attacker would map.
        </InfoBox>
      </Section>

      <Section id="recap" icon="🔁" title="Recap" subtitle="The method in one line">
        <p>
          <b>Recon, scan, enumerate, map, find, exploit.</b> Six clear steps, from a completely unknown website to a fully mapped
          target with a real weakness. That is how hackers find vulnerabilities, step by step.
        </p>
      </Section>
    </ToolLayout>
  )
}
