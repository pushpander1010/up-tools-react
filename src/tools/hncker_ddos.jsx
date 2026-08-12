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
  { q: 'What is a DDoS attack?', a: 'DDoS stands for Distributed Denial of Service. It floods a target — a website, server, or network — with so much traffic that it can no longer answer legitimate users. It is not one hacker; it is a distributed army of machines (often a botnet) hitting one target at the same time.' },
  { q: 'What are the three layers of a DDoS attack?', a: 'The three professional layers are: volumetric (raw bandwidth flood that saturates the pipe), protocol (exhausts the connection table with half-open connections, like a SYN flood), and application (slow, cheap requests that hold server threads open, like slowloris).' },
  { q: 'What is a SYN flood?', a: 'A SYN flood is a protocol-layer DDoS. The attacker sends thousands of half-open TCP connections by sending SYN packets and never completing the handshake. Each one holds a slot in the server connection table until it fills up and the server locks up.' },
  { q: 'What is slowloris?', a: 'Slowloris is an application-layer DDoS tool. It opens many connections to a web server and sends requests very slowly, holding threads open for a long time. With enough sockets, it exhausts every available thread and the server stops responding.' },
  { q: 'Is DDoS illegal?', a: 'Yes. Launching a DDoS attack against any system you do not own is a federal crime in most countries, including the US (Computer Fraud and Abuse Act). This guide is strictly educational — for understanding, defense, and authorized security testing only.' },
  { q: 'How do you defend against DDoS?', a: 'The standard defenses are rate limiting, load balancers, and a Content Delivery Network (CDN) that absorbs and filters the flood. DDoS protection services, Web Application Firewalls, and connection-level protections also help stop volumetric, protocol, and application-layer attacks.' },
  { q: 'What is a botnet?', a: 'A botnet is a network of compromised machines — PCs, servers, IoT devices — that an attacker controls remotely. For DDoS, the attacker commands the whole botnet to send traffic to one target at once, multiplying the flood from a single machine to thousands.' },
]

const howItWorks = [
  'An attacker builds or rents a botnet — an army of compromised machines.',
  'All bots send traffic to one target at the same time, drowning it.',
  'Volumetric attacks saturate the network pipe with raw bandwidth.',
  'Protocol attacks (SYN floods) fill the server connection table with half-open connections.',
  'Application attacks (slowloris) hold server threads open with slow, cheap requests.',
  'Rate limits, load balancers, and a CDN absorb the flood so real users still connect.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'How Hackers DDoS, Professionally — 3 Attack Layers Explained (Educational)',
      description: 'Understand how DDoS attacks work professionally: volumetric floods, protocol SYN floods, and application-layer slowloris. Covers botnets, how each layer works, and how to defend with rate limiting, load balancers, and a CDN. Educational only.',
      about: 'DDoS attacks explained',
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

export default function hncker_ddos() {
  return (
    <ToolLayout
      title="How Hackers DDoS, Professionally — 3 Attack Layers Explained"
      desc="Understand how DDoS attacks work: volumetric floods, protocol SYN floods, and application-layer slowloris. Learn the three layers, how botnets multiply the attack, and how to defend with rate limits, load balancers, and a CDN. Educational only."
      icon="🌊"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/ddos"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/ddos/ddos_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Watch the HNCKER walkthrough">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/watch?v=ai2Xct0ZFHs" target="_blank" rel="noopener noreferrer"
            className="block group rounded-xl overflow-hidden border border-white/10 no-underline relative"
            style={{ background: '#000' }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src="https://i.ytimg.com/vi/ai2Xct0ZFHs/hqdefault.jpg"
                alt="What is a DDoS Attack? How Websites Crash Explained"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 ml-1 fill-white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-white m-0">What is a DDoS Attack? How Websites Crash Explained</p>
              <p className="text-xs text-slate-300 mt-0.5">Watch on YouTube →</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        This page explains DDoS attacks for <b>educational and authorized security testing only</b>. Launching a DDoS attack
        against any system you do not own is a <b>federal crime</b>. Never test a target you don't have written permission to
        assess. Understanding how attacks work is how defenders stop them.
      </WarningBox>

      <Section id="overview" icon="🌊" title="What is a DDoS?" subtitle="Distributed Denial of Service — drowning one target in traffic">
        <p>
          <b>DDoS</b> stands for <b>Distributed Denial of Service</b>. An attacker floods a target — a website, server, or
          network — with so much traffic that it can no longer answer legitimate users. It is not one hacker; it is a
          <b> distributed army of machines</b> (a botnet) hitting one target at the same time.
        </p>
        <FeatureGrid items={[
          { i: '🤖', t: 'Botnet', d: 'An army of compromised machines the attacker controls.' },
          { i: '🎯', t: 'One target', d: 'All traffic floods a single site, server, or network.' },
          { i: '🚫', t: 'Denied service', d: 'Real users can no longer connect or load the site.' },
          { i: '⚡', t: 'Volumetric', d: 'Raw bandwidth flood that saturates the pipe.' },
          { i: '🔗', t: 'Protocol', d: 'Exhausts the connection table with half-open connections.' },
          { i: '🐌', t: 'Application', d: 'Slow, cheap requests that hold server threads open.' },
        ]} />
      </Section>

      <Section id="layers" icon="🧅" title="The Three Professional Layers" subtitle="How professionals structure a DDoS">
        <p>Every serious DDoS falls into one (or more) of three layers. Understanding each is how you defend against it.</p>
        <StepRow num={1} title="Layer 1 — Volumetric (raw bandwidth flood)" body="The attacker floods the target with massive traffic until its network pipe is completely full. This is the classic bandwidth-saturation attack — when the pipe is full, nothing gets through, including real users." />
        <StepRow num={2} title="Layer 2 — Protocol (connection-table exhaustion)" body="The attacker sends thousands of half-open TCP connections (a SYN flood). Each one holds a slot in the server connection table. When the table fills up, the server locks up and stops accepting any connections." />
        <StepRow num={3} title="Layer 3 — Application (slow, sneaky requests)" body="The attacker sends requests that are slow, incomplete, and cheap to make, holding server threads open for a long time. With enough sockets, every available thread is exhausted and the server stops responding — often with far less bandwidth than a volumetric flood." />
      </Section>

      <Section id="volumetric" icon="⚡" title="Layer 1 — Volumetric Flood" subtitle="Saturate the pipe with raw bandwidth">
        <p>
          The goal is simple: send more traffic than the target's network can carry. Tools like <b>hping3</b> blast raw
          packets at the target until the pipe is saturated. It takes enormous bandwidth to do this alone, which is why
          attackers use a botnet to multiply it.
        </p>
        <CodeBlock title="Volumetric flood (hping3)">
{`hping3 -S -p 80 --flood target.com
# [INF] Sending SYN packets...
# [HIT] Bandwidth saturated`}
        </CodeBlock>
      </Section>

      <Section id="protocol" icon="🔗" title="Layer 2 — Protocol Attack (SYN Flood)" subtitle="Exhaust the server connection table">
        <p>
          A SYN flood never completes the TCP handshake. The attacker sends SYN packets and leaves the connection
          half-open, each one holding a slot in the server connection table. Fill the table and the server locks up.
          The <b>scapy</b> library makes this trivial to script.
        </p>
        <CodeBlock title="Protocol SYN flood (scapy)">
{`send(IP(dst=target)/TCP(flags="S"), loop=1)
# [INF] Half-open connections...
# [HIT] Connection table full`}
        </CodeBlock>
      </Section>

      <Section id="application" icon="🐌" title="Layer 3 — Application Attack (slowloris)" subtitle="Hold threads open with slow, cheap requests">
        <p>
          The cheapest and sneakiest layer. <b>slowloris</b> opens many connections to a web server and sends requests very
          slowly, holding threads open for a long time. It needs far less bandwidth than a volumetric flood but is brutal on
          web servers — exhausting every available thread.
        </p>
        <CodeBlock title="Application slow-loris">
{`slowloris.py --sockets 400 target.com
# [INF] Holding 400 sockets open...
# [HIT] All threads exhausted`}
        </CodeBlock>
      </Section>

      <Section id="defense" icon="🛡️" title="How to Defend" subtitle="Stop the flood before it reaches your server">
        <div className="space-y-3">
          <InfoBox title="Rate limiting">
            Limits how many requests a single source can make in a window. Legitimate users barely notice; a flood gets throttled.
          </InfoBox>
          <InfoBox title="Load balancers">
            Spread traffic across many servers so no single machine is overwhelmed by the flood.
          </InfoBox>
          <InfoBox title="CDN (Content Delivery Network)">
            A CDN sits in front of your origin and absorbs and filters the flood — it has the bandwidth and the filtering logic to drop attack traffic before it reaches you.
          </InfoBox>
          <InfoBox title="DDoS protection services + WAF">
            Dedicated DDoS protection and Web Application Firewalls filter malicious traffic and block application-layer attacks like slowloris.
          </InfoBox>
        </div>
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="The DDoS attack layers in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/ddos/ddos_scan.png" alt="The three DDoS attack layers — volumetric, protocol, and application — typed in a terminal"
            width="1080" height="1920" className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">The three professional DDoS layers, typed in a terminal</figcaption>
        </figure>
      </Section>

      <Section id="issues" icon="🐞" title="Common DDoS Questions" subtitle="Frequently asked, answered plainly">
        <StepRow num="!" title="Do attackers really use botnets?" body="Almost always. A single machine rarely has enough bandwidth to take down a serious site. A botnet — thousands of compromised PCs, servers, and IoT devices — multiplies the flood by orders of magnitude." />
        <StepRow num="!" title="Is a DDoS easy to detect?" body="Volumetric attacks are easy to spot (a massive spike in traffic). Application-layer attacks are sneaky — they look like slow, normal traffic and are much harder to detect without the right tooling." />
        <StepRow num="!" title="Can a CDN stop every DDoS?" body="A good CDN stops most volumetric and many protocol attacks, but application-layer attacks can still slip through. Defense in depth — CDN plus WAF plus rate limiting — is the reliable approach." />
      </Section>

      <Section id="resources" icon="🔗" title="Repositories & Resources" subtitle="Official and reference links">
        <div className="space-y-2">
          {[
            ['🌊', 'scapy (network packet tool)', 'https://scapy.net/'],
            ['⚡', 'hping3 (packet generator)', 'https://github.com/antirez/hping'],
            ['🛡️', 'Cloudflare DDoS protection', 'https://www.cloudflare.com/ddos/'],
            ['🎬', 'HNCKER tutorials', 'https://www.youtube.com/@hncker'],
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

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you test anything">
        <p>
          This guide is provided <b>strictly for educational and authorized security testing</b>. Launching a DDoS attack
          against any system you do not own is a <b>federal crime</b>. Only test networks and systems you own or have written
          permission to assess. The authors and this site are not responsible for misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
